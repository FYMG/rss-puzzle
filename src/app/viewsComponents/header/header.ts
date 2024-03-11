import createComponent from '@components/baseComponent.ts';
import logoComponent from '@components/logo/logoComponent';
import authActionComponent from '@components/authAction/authActionComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import { useRouter } from '@services/router.ts';
import Routes from '@utils/consts/routes.ts';
import style from './header.module.scss';

const header: typeof createComponent<HTMLElement> = ({ classList, children, ...props }) => {
    const {route} = useRouter()
    const logo = logoComponent({}).addEventListener(
        'click',
        () => route(Routes.startPage)
    );

    const authAction = authActionComponent({});

    const content = createComponent<HTMLDivElement>({
        tag: 'div',
        classList: style['header__content'],
        children: [logo, authAction],
    });

    return createComponent({
        tag: 'header',
        classList: mergeClassLists(style['header'], classList),
        children: mergeChildrenLists(content, children),
        ...props,
    });
};
export default header;
