import { BaseComponent } from '../app/components/baseComponent.ts';
import { IRoute, IRouteParams } from '../utils/consts/routes';
export declare const useRouter: () => {
    root: BaseComponent<HTMLElement>;
    route: (toRoute: string | IRoute | undefined, params?: IRouteParams, pushState?: boolean) => void;
    args: IRouteParams;
    isInitialized: boolean;
};
export declare const createRouter: (root?: BaseComponent, defaultRoute?: IRoute) => {
    root: BaseComponent<HTMLElement>;
    route: (toRoute: string | IRoute | undefined, params?: IRouteParams, pushState?: boolean) => void;
    args: IRouteParams;
    isInitialized: boolean;
};
