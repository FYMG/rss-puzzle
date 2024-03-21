import createComponent from '@components/baseComponent';
import header from '@viewsComponents/header/header';
import footer from '@viewsComponents/footer/footer';

import gamePageContent from '@viewsComponents/gamePageContent/gamePageContent';


const gamePage = () => {
    return createComponent<HTMLTemplateElement>({
        tag: 'template',

        children: [header({}), gamePageContent({}), footer({})],

    });
};

export default gamePage;
