import 'normalize.css';
import '@styles/index.scss';
import { createRouter } from '@services/router';
import Routes from '@utils/consts/routes.ts';

createRouter(undefined, Routes.startPage)