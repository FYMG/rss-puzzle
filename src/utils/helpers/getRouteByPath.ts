import Routes, { IRoute } from '@utils/consts/routes.ts';

export default function getRouteByPath(path: string) {
    return Object.keys(Routes).reduce((acc: IRoute | undefined, routeName): IRoute | undefined => {
        if (Routes[routeName]?.path === path) {
            acc = Routes[routeName]
        }
        return  acc
    }, undefined)
}