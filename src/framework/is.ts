import { VNode } from "./vdom";

export const is = {
    eventHandler: (name: string): boolean => name.startsWith('on'),
    vnode: (vnode: string | VNode | null): vnode is VNode => typeof vnode !== 'string' && vnode?.nodeName !== undefined,
    customProp: (propName: string): boolean => propName == 'ref'
}