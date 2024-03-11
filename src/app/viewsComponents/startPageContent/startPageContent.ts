import createComponent from '@components/baseComponent.ts';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import bannerComponent from '@components/banner/bannerComponent.ts';
import bannerImg from '@assets/banner-img.png';
import TextStrings from '@utils/consts/text';
import logoLinkComponent from '@components/logoLink/logoLinkComponent';
import rsLogoImg from '@assets/rs-logo.png';
import gitLogoImg from '@assets/gh-logo.png';
import buttonComponent from '@components/button/buttonComponent';
import style from './startPageContent.module.scss';

const startPageContent: typeof createComponent<HTMLElement> = ({
    classList,
    children,
    ...props
}) => {
    const aboutGameWrapper = createComponent({
        tag: 'div',
        classList: style['about-game__wrapper'],
        children: [
            createComponent({
                tag: 'div',
                classList: style['about-game__text'],
                children: [
                    createComponent({
                        tag: 'h2',
                        textContent: TextStrings.startPageAboutTitle,
                        classList: style['about-game__title'],
                    }),
                    createComponent({
                        tag: 'p',
                        textContent: TextStrings.startPageAboutDescription,
                        classList: style['about-game__description'],
                    }),
                    createComponent({
                        tag: 'div',
                        classList: style['actions'],
                        children: [
                            createComponent({
                                tag: 'div',
                                classList: style['actions__useful-links'],
                                children: [
                                    createComponent({
                                        tag: 'span',
                                        textContent: TextStrings.startPageAboutLInks,
                                    }),
                                    logoLinkComponent({
                                        classList: style['actions__link'],
                                        imgSrc: gitLogoImg,
                                        altText: '@FYMG',
                                        title: '@FYMG',
                                        href: 'https://github.com/FYMG',
                                    }),
                                    logoLinkComponent({
                                        classList: style['actions__link'],
                                        imgSrc: rsLogoImg,
                                        altText: 'RsSchool 2024',
                                        title: 'RsSchool 2024',
                                        href: 'https://rs.school/js/',
                                    }),
                                ],
                            }),
                            createComponent({
                                tag: 'div',
                                classList: style['actions__start-button-wrapper'],
                                children: [
                                    buttonComponent({
                                        classList: style['actions__start-button'],
                                        textContent: 'Начать игру',
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            bannerComponent({
                classList: style['about-game__banner'],
                imgSrc: bannerImg,
            }),
        ],
    });
    const content = createComponent({
        tag: 'section',
        classList: mergeClassLists(style['main__content'], style['about-game']),
        children: aboutGameWrapper,
    });

    return createComponent({
        tag: 'main',
        classList: mergeClassLists(style['main'], classList),
        children: mergeChildrenLists(content, children),
        ...props,
    });
};
export default startPageContent;
