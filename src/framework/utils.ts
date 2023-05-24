import { is } from "./is"
import type { VNode } from "./types"
import { renderNode } from "./vdom"

export const getEventName = (name: string): string => {
    return name.substring(2, name.length).toLowerCase()
}

export const changed = (vnode: VNode | string, old: VNode | string) => {
    return typeof vnode !== typeof old ||
        typeof vnode === 'string' && vnode !== old ||
        is.vnode(vnode) && is.vnode(old) && vnode.nodeName !== old.nodeName ||
        typeof vnode === 'number' && typeof old === 'number' && old !== vnode
}

export const parseNode = (vnode: VNode | string): Node => {
    return typeof vnode === 'string' ? document.createTextNode(vnode) : renderNode(vnode)
}