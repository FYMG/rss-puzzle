import createComponent from '@components/baseComponent.ts';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import bannerComponent from '@components/banner/bannerComponent';
import bannerImg from '@assets/banner-img.png';
import TextStrings from '@utils/consts/text';
import logoLinkComponent from '@components/logoLink/logoLinkComponent';
import rsLogoImg from '@assets/rs-logo.png';
import gitLogoImg from '@assets/gh-logo.png';
import buttonComponent from '@components/button/buttonComponent';
import { useAuthProvider } from '@services/auth';
import { useRouter } from '@services/router';
import Routes from '@utils/consts/routes';
import style from './startPageContent.module.scss';

const startPageContent: typeof createComponent<HTMLElement> = ({
    classList,
    children,
    ...props
}) => {
    const { isAuth, user } = useAuthProvider();
    const { route } = useRouter();
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
                        textContent: isAuth
                            ? `С возвращением ${user?.name ?? 'Иван'} ${user?.surname ?? 'Иваныч'} быстрей жми на кнопку чтобы продолжить играть!`
                            : TextStrings.startPageAboutDescription,
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
                                        textContent: isAuth
                                            ? `Продолжить`
                                            : `Регистрация`,
                                    }).addEventListener('click', () =>
                                        isAuth
                                            ? route(Routes.gamePage)
                                            : route(Routes.loginPage, { reg: true }),
                                    ),
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
