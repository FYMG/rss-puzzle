import { FunctionComponent } from '../../app/components/baseComponent';
export interface IRouteParams {
    [key: string]: string | boolean | number | undefined | null;
    difficulty?: number;
    level?: number;
    reg?: boolean;
}
export interface IRoute {
    name: string;
    path: string;
    view: FunctionComponent<HTMLTemplateElement>;
    needAuth: boolean;
    params: IRouteParams;
}
export interface IRoutes {
    [key: string]: IRoute;
    startPage: IRoute;
    loginPage: IRoute;
    gamePage: IRoute;
}
declare const Routes: IRoutes;
export default Routes;
