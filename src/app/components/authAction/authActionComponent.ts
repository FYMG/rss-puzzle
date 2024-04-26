import createComponent from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import { useAuthProvider } from '@services/auth';
import { useRouter } from '@services/router';
import Routes from '@utils/consts/routes';
import style from './authAction.module.scss';

const authActionComponent: typeof createComponent<HTMLButtonElement> = ({
    classList,
    children,
    ...props
}) => {
    const { isAuth, logout } = useAuthProvider();
    const { route } = useRouter();

    const authLink = createComponent<HTMLLinkElement>({
        tag: 'a',
        classList: style['auth-action__link'],
        textContent: isAuth ? `Выйти` : `Войти`,
    }).addEventListener('click', () =>
        isAuth ? logout(() => route(Routes.startPage)) : route(Routes.loginPage),
    );

    return createComponent({
        tag: 'div',
        classList: mergeClassLists(style['auth-action'], classList),
        children: mergeChildrenLists(authLink, children),
        ...props,
    });
};
export default authActionComponent;
