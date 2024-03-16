import startPageView from '@views/startPage';
import { FunctionComponent } from '@components/baseComponent';
import loginPageView from '@views/loginPage.ts';
import gamePage from '@views/gamePage.ts';

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

const Routes: IRoutes = {
    startPage: {
        name: 'startPage',
        path: '/',
        view: startPageView,
        needAuth: false,
        params: {},
    },
    loginPage: {
        name: 'loginPage',
        path: '/login',
        view: loginPageView,
        needAuth: false,
        params: {
            reg: undefined,
        },
    },
    gamePage: {
        name: 'gamePage',
        path: '/game',
        view: gamePage,
        needAuth: true,
        params: {
            difficulty: undefined,
            level: undefined,
        },
    },
};

export default Routes;
