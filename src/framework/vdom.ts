import { is } from "./is"
import { changed, parseNode } from "./utils"

export let oldTree: VNode = { nodeName: '', attrs: {}, children: [] }
let rootNode: Node | null = null

export function render(rootId: string, node: VNode) {
    const root = document.getElementById(rootId)

    if (!root) throw new Error(`Cannot find root element by id: ${rootId}`)

    oldTree.attrs = { ...node.attrs }
    oldTree.children = [...node.children]
    oldTree.nodeName = node.nodeName
    rootNode = root

    root.replaceChildren(parseNode(node))
}

export type VNode = { nodeName: string | ((...props: any[]) => VNode), attrs: Props, children: (VNode | string)[] }
type Props = { [key: string]: any }

export function h(nodeName: string, attrs: Props, ...children: (VNode | string)[]): VNode {
    return { nodeName, attrs, children }
}

export function hf(...children: any[]) {
    return children
}

export const renderNode = (vnode: VNode | string): Node => {
    if (!is.vnode(vnode)) return document.createTextNode(vnode);
    if (typeof vnode.nodeName === 'function') return renderNode(vnode.nodeName(vnode.attrs))

    const el = document.createElement(vnode.nodeName)

    patchProps(el, vnode.attrs)
    
    for (const ch of (vnode.children || [])) {
        if (typeof ch === "string") el.appendChild(document.createTextNode(ch))
        else el.appendChild(parseNode(ch))
    }
  
    return el;
}

export const patch = (vnode: VNode) => {
    if (!oldTree || !rootNode) throw new Error('Patch cannot be called before app is rendered.')
    console.time('Patch')
    internalPatch(rootNode, vnode, oldTree)
    oldTree.attrs = { ...vnode.attrs }
    oldTree.children = [...vnode.children]
    oldTree.nodeName = vnode.nodeName
    console.timeEnd('Patch')
}

const internalPatch = (root: Node, vnode: VNode | string | null, last: VNode | string, idx = 0) => {
    if (is.vnode(vnode) && typeof vnode.nodeName === 'function') vnode = vnode.nodeName({...vnode.attrs})
    if (is.vnode(last) && typeof last.nodeName === 'function') last = last.nodeName({...last.attrs})

    if (!vnode) {
        root.removeChild(root.childNodes[idx])
    } else if (!last) {
        root.appendChild(renderNode(vnode))
    } else if (changed(vnode, last)) {
        root.replaceChild(
            renderNode(vnode),
            root.childNodes[idx]
        )
    } else if (is.vnode(vnode)) {
        const isLast = is.vnode(last)
        patchProps(root.childNodes[idx] as HTMLElement, vnode.attrs, isLast ? (last as VNode).attrs : undefined)
        for (let i = 0; i < vnode.children.length || (isLast && i < (last as VNode).children.length); i++) {
            internalPatch(
                root.childNodes[idx],
                vnode.children[i],
                (last as VNode).children[i],
                i
            )
        }
    }
}

const patchProps = (target: HTMLElement, props: Props, old?: Props) => {
    if (!old) for (const key in props) setProp(target, key, props[key])
    else updateProps(target, props, old)
}

const updateProps = (target: HTMLElement, to: Props, from: Props) => {
    for (const key in { ...to, ...from }) updateProp(target, key, to[key], from[key])
}

const setBooleanProp = (target: HTMLElement, name: string, value: any) => {
    if (value) {
        target.setAttribute(name, value);
        (target as any)[name] = true
    } else {
        (target as any)[name] = false
    }
}

const removeBooleanProp = (target: HTMLElement, name: string) => {
    target.removeAttribute(name);
    (target as any)[name] = false
}

const removeProp = (target: HTMLElement, name: string, value: any) => {
    if (is.customProp(name)) {
        return
    } else if (typeof value === 'boolean') {
        removeBooleanProp(target, name)
    } else {
        target.removeAttribute(name)
    }
}

const updateProp = (target: HTMLElement, name: string, newVal: any, oldVal: any) => {
    if (!newVal) {
        removeProp(target, name, oldVal)
    } else if (!oldVal || newVal !== oldVal) {
        setProp(target, name, newVal)
    }
}

const setProp = (target: HTMLElement, name: string, value: any) => {
    if (is.customProp(name)) {
        return
    } else if (typeof value === "boolean") {
        setBooleanProp(target, name, value)
    } else if (is.eventHandler(name)) {
        (target as any)[name.toLowerCase()] = value
    } else if (!is.eventHandler(name)) {
        target.setAttribute(name, value)
    }
}