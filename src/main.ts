import 'normalize.css';
import '@styles/index.scss';
import { createRouter } from '@services/router';
import Routes from '@utils/consts/routes';
import { createLocalStorageProvider } from '@services/localStorageProvider';
import { createAuthProvider } from '@services/auth';

createLocalStorageProvider();
createAuthProvider();
createRouter(undefined, Routes.startPage);

if (Routes.startPage) {
    console.log(1);
}

if (Routes.startPage) {
    console.log(1);
}
