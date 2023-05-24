export type Routes = { [path: string]: RouteData }
export type RouteData = {
    component: VNode
}

export type VNode = { nodeName: string | ((...props: any[]) => VNode), attrs: Props, children: (VNode | string)[] }
export type Props = { [key: string]: any }