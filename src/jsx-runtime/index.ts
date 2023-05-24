import type { Props, VNode } from "../framework/types"

export function h(nodeName: string, attrs: Props, ...children: (VNode | string)[]): VNode {
    return { nodeName, attrs, children }
}

export function hf(...children: any[]) {
    return children
}