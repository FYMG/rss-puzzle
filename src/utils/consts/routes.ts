import startPageView from '@views/startPage';
// import loginPageView from '@views/loginPage';
import { FunctionComponent } from '@components/baseComponent';

export interface IRoute<ParamsKeys extends keyof any = keyof any> {
    name: string
    path: string
    view: FunctionComponent<HTMLTemplateElement>
    needAuth: boolean
    params?: Record<ParamsKeys, string | null>
}

export interface IRoutes {
    [key: string]: IRoute
    startPage: IRoute<'a' | 'b'>
    loginPage: IRoute
    gamePage: IRoute<'difficulty' | 'level'>
}

const Routes: IRoutes = {
    startPage: {
        name: 'startPage',
        path: '/',
        view: startPageView,
        needAuth: false,
        params: {
            a: null,
            b: null
        }
    },
    loginPage:{
        name: 'loginPage',
        path: '/login',
        view: startPageView,
        needAuth: false
    },
    gamePage:{
        name: 'gamePage',
        path: '/game',
        view: startPageView,
        needAuth: true,
        params: {
            'difficulty': null,
            'level': null
        }
    }
}

export default Routes