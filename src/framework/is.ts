import type { VNode } from "./types";

export const is = {
    eventHandler: (name: string): boolean => name.startsWith('on'),
    vnode: (vnode: string | VNode | null): vnode is VNode => typeof vnode !== 'string' && vnode?.nodeName !== undefined,
    customProp: (propName: string): boolean => propName == 'ref',
    element: (target: any): target is HTMLElement => target?.nodeType,
    path: (target: string | null): target is string => typeof target === 'string' && target.startsWith('/')
}