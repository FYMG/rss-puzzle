import createComponent from '@components/baseComponent.ts';
import header from '@viewsComponents/header/header';
import footer from '@viewsComponents/footer/footer';
import loginPageContent from '@viewsComponents/LoginPageContent/LoginPageContent';

const loginPageView = () => {
    return createComponent<HTMLTemplateElement>({
        tag: 'template',
        children: [header({}), loginPageContent({}), footer({})],
    });
};

export default loginPageView;
