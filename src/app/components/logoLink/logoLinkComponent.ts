import createComponent, { FunctionComponent } from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import style from './logoLink.module.scss';

const logoLinkComponent: FunctionComponent<
    HTMLLinkElement,
    { altText: string; imgSrc: string }
> = ({ classList, children, altText, imgSrc, ...props }) => {
    const linkImg = createComponent<HTMLImageElement>({
        tag: 'img',
        src: imgSrc,
        alt: altText,
        classList: style['logo-link__img'],
    });
    return createComponent({
        tag: 'a',
        classList: mergeClassLists(style['logo-link'], classList),
        children: mergeChildrenLists(linkImg, children),
        ...props,
    });
};
export default logoLinkComponent;
