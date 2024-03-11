import header from '@viewsComponents/header/header';
import startPageContent from '@viewsComponents/startPageContent/startPageContent';
import footer from '@viewsComponents/footer/footer';
import createComponent from '@components/baseComponent';

const startPageView = () => createComponent<HTMLTemplateElement>({
    tag: 'template',
    children: [header({}), startPageContent({}), footer({})],
});

export default startPageView;
