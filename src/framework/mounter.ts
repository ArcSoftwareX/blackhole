import { createRouter } from "./router";
import { render } from "./vdom";
import type { Routes, VNode } from "./types";

export const mount = (rootId: string) => {
    const root = document.getElementById(rootId)

    if (!root) throw new Error(`Failed to find root element by id: ${rootId}`)

    return {
        default: (rootNode: VNode) => {
            render(root, rootNode)
        },
        withRouter: (routes: Routes) => {
            createRouter(root, routes)
        }
    }
}