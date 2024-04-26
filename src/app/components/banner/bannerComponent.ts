import createComponent, { FunctionComponent } from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import style from './banner.module.scss';

const bannerComponent: FunctionComponent<HTMLDivElement, { imgSrc: string }> = ({
    classList,
    children,
    imgSrc,
    ...props
}) => {
    const image = createComponent<HTMLImageElement>({
        tag: 'img',
        classList: style['banner__image'],
        src: imgSrc,
        alt: 'banner',
    });

    return createComponent({
        tag: 'div',
        classList: mergeClassLists(style['banner'], classList),
        children: mergeChildrenLists(image, children),
        ...props,
    });
};
export default bannerComponent;
