import createComponent from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import buttonComponent from '@components/button/buttonComponent';
import loginImg from '@assets/login-page-img.png';
import { useRouter } from '@services/router';
import Routes from '@utils/consts/routes';
import { useAuthProvider } from '@services/auth';
import loginPageValidator from '@utils/helpers/loginPageValidator';
import style from './LoginPageContent.module.scss';

const loginPageContent: typeof createComponent<HTMLElement> = ({
    classList,
    children,
    ...props
}) => {
    const { route, args } = useRouter();
    const { login, singup } = useAuthProvider();
    const reg = args.reg ?? false;

    const error = createComponent<HTMLSpanElement>({
        tag: 'span',
        classList: style['login-form__error'],
    });

    const nameError = createComponent({
        tag: 'span',
        classList: style['login-form__error'],
    });

    const name = createComponent<HTMLInputElement>({
        tag: 'input',
        classList: style['login-form__input'],
        placeholder: 'Введите имя',
        required: true,
        type: 'text',
    });

    const surnameError = createComponent({
        tag: 'span',
        classList: style['login-form__error'],
    });
    const surname = createComponent<HTMLInputElement>({
        tag: 'input',
        classList: style['login-form__input'],
        placeholder: 'Введите фамилию',
        required: true,
        type: 'text',
    });

    const loginButton = buttonComponent({
        textContent: reg ? 'Зарегистрироваться' : 'Войти',
        classList: style['login-form__button'],
        type: 'submit',
        disabled: true,
    }).addEventListener('click', (evt) => {
        evt.preventDefault();
        const nameValue = name.getNode().value;
        const surnameValue = surname.getNode().value;
        const func = [singup, login][reg ? 0 : 1];
        func?.(nameValue, surnameValue, (reason) => {
            error.getNode().textContent = reason.messages.join(', ');
            if (reason.success) {
                route(Routes.gamePage);
            }
        });
    });

    const loginForm = createComponent({
        tag: 'form',
        classList: style['login-form'],
        children: [
            createComponent({
                tag: 'h2',
                textContent: reg ? 'Регистрация' : 'Вход',
                classList: style['login-form__title'],
            }),
            createComponent({
                tag: 'label',
                classList: style['login-form__label'],
                children: [
                    createComponent({
                        tag: 'span',
                        textContent: 'Name',
                        classList: style['login-form__label-text'],
                    }),
                    name,
                    nameError,
                ],
            }),
            createComponent({
                tag: 'label',
                classList: style['login-form__label'],
                children: [
                    createComponent({
                        tag: 'span',
                        textContent: 'Surname',
                        classList: style['login-form__label-text'],
                    }),
                    surname,
                    surnameError,
                ],
            }),
            createComponent({
                tag: 'div',
                classList: style['login-form__additions'],
                children: [
                    error,
                    createComponent<HTMLLinkElement>({
                        tag: 'a',
                        classList: style['login-form__mode'],
                        textContent: reg ? 'Вход' : 'Регистрация',
                    }).addEventListener('click', () => {
                        route(Routes.loginPage, {
                            reg: !reg,
                        });
                    }),
                ],
            }),
            loginButton,
            createComponent<HTMLImageElement>({
                tag: 'img',
                classList: style['login-form__img'],
                src: loginImg,
                alt: 'login form img',
            }),
        ],
    }).addEventListener('input', (evt) => {
        const surnameValue = surname.getNode().value ?? '';
        const nameValue = name.getNode().value ?? '';

        if ((evt.target as HTMLElement)?.isEqualNode(name.getNode())) {
            nameError.getNode().textContent = loginPageValidator(nameValue, 3);
        }

        if ((evt.target as HTMLElement)?.isEqualNode(surname.getNode())) {
            surnameError.getNode().textContent = loginPageValidator(surnameValue, 4);
        }

        loginButton.getNode().disabled = !!(
            loginPageValidator(nameValue, 3) || loginPageValidator(surnameValue, 4)
        );
    });

    const loginWrapper = createComponent({
        tag: 'section',
        classList: mergeClassLists(style['main__content']),
        children: [loginForm],
    });

    return createComponent({
        tag: 'main',
        classList: mergeClassLists(style['main'], classList),
        children: mergeChildrenLists(loginWrapper, children),
        ...props,
    });
};

export default loginPageContent;
