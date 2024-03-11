import createComponent, { BaseComponent } from '@components/baseComponent.ts';
import { IRoute } from '@utils/consts/routes';
import throwError from '@utils/helpers/throwError';
import getRouteByPath from '@utils/helpers/getRouteByPath';

class Router {
    private root: BaseComponent

    private readonly defaultRoute: IRoute | undefined

    private static instance: Router

    constructor(rootComponent?: BaseComponent, defaultRoute?: IRoute ) {
        this.root = this.createOrGetRoot(rootComponent)
        this.defaultRoute = defaultRoute
        if (Router.instance) {
            return Router.instance
        }
        Router.instance = this;
    }

    private createOrGetRoot(rootComponent?: BaseComponent) {
        if (!this.root) {
            if (rootComponent) {
                this.root = rootComponent;
            } else {
                this.root = createComponent({
                    tag: 'div',
                    id: 'root'
                })
                document.body.append(this.root.getNode())
            }
        }
        return this.root
    }

    public route(toRoute: string | IRoute | undefined, params?: Record<string, string | undefined>) {
        let route = typeof toRoute === 'string' ? getRouteByPath(toRoute) : toRoute

        if (!route && !this.defaultRoute) throwError('Route never exist and default route is not set')
        if (!route && this.defaultRoute) route = this.defaultRoute

        if (route) {
            const url = new URL(window.location.href)
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (Object.keys(route?.params || {}).includes(key) && value) {
                        url.searchParams.set(key, value)
                    }
                })
            }

            url.pathname = route.path
            window.history.pushState({},'', url)
            this.root.getChildren().forEach(child => child.destroy())
            this.root.appendChildren(route.view({}).getChildren())
        }
    }

    getRouteInfo() {
        const route = getRouteByPath(window.location.pathname)!
        const routeCopy = JSON.parse(JSON.stringify(route)) as typeof route
        if (!route) throwError('Route not found')

        const urlParams = new URLSearchParams(window.location.search)
        Object.keys(route.params || {}).forEach((param) => {
            if (routeCopy.params) {
                routeCopy.params[param] = urlParams.get(param)
            }
        })

        return routeCopy
    }

    public init() {
        const route = window.location.pathname
        const paramsObj: Record<string, string> = {};
        new URLSearchParams(window.location.search).forEach((value, key) => paramsObj[key] = value)
        this.route(route, paramsObj)
    }

    static getInstance() {
        return Router.instance
    }
}

export const useRouter = () => {
    if (!Router.getInstance()) throwError('Router not created')
    const router = Router.getInstance()
    const routeInfo = router.getRouteInfo()
    return { route: router.route.bind(router), args: routeInfo.params }
}

export const createRouter = (root?: BaseComponent, defaultRoute?: IRoute) => {
    if (Router.getInstance()) throwError('Router already created')
    const router = new Router(root, defaultRoute)
    router.init()
    return useRouter()
}