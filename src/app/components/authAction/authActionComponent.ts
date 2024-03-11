import createComponent from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import style from './authAction.module.scss';

const authActionComponent: typeof createComponent<HTMLButtonElement> = ({
    classList,
    children,
    ...props
}) => {
    const authButton = createComponent<HTMLLinkElement>({
        tag: 'a',
        classList: style['auth-action__auth-button'],
        href: '#',
        textContent: `Войти`,
    });

    return createComponent({
        tag: 'div',
        classList: mergeClassLists(style['auth-action'], classList),
        children: mergeChildrenLists(authButton, children),
        ...props,
    });
};
export default authActionComponent;
