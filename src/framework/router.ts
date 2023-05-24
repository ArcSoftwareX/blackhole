import { is } from "./is"
import { Routes } from "./types"
import { renderNode } from "./vdom"

let routerRoot: HTMLElement | null = null

export const createRouter = (root: HTMLElement, routes: Routes) => {
    routerRoot = root
    window.addEventListener('DOMContentLoaded', () => {
        routerProcedure(routes)

        window.addEventListener('click', e => {
            if (is.element(e.target) && e.target.hasAttribute('href') && !e.target.hasAttribute('data-router-ignore') && is.path(e.target.getAttribute('href'))) {
                e.preventDefault()
                navigateTo(e.target.getAttribute('href') as string, routes)
            }
        })

        window.addEventListener('popstate', () => routerProcedure(routes))
    })
}

const routerProcedure = (routes: Routes) => {
    if (!routerRoot) throw new Error('Unable to run router procedure. Router is not mounted.')

    const currentRoute = routeMatcher(routes)

    routerRoot.innerHTML = ''
    routerRoot.append(renderNode(currentRoute.component))    
}

const routeMatcher = (routes: Routes) => {
    if (routes.hasOwnProperty(location.pathname)) {
        return routes[location.pathname]
    }

    return routes['**']
}

export const navigateTo = (path: string, routes: Routes) => {
    history.pushState(null, '', path)
    routerProcedure(routes)
}