import { en as accountEn, uk as accountUk } from './namespaces/account';
import { en as authEn, uk as authUk } from './namespaces/auth';
import { en as booksEn, uk as booksUk } from './namespaces/books';
import { en as commonEn, uk as commonUk } from './namespaces/common';
import { en as dashboardEn, uk as dashboardUk } from './namespaces/dashboard';
import { en as homeEn, uk as homeUk } from './namespaces/home';
import { en as subjectsEn, uk as subjectsUk } from './namespaces/subjects';

export const translations = {
    uk: { common: commonUk, home: homeUk, account: accountUk, auth: authUk, dashboard: dashboardUk, books: booksUk, subjects: subjectsUk },
    en: { common: commonEn, home: homeEn, account: accountEn, auth: authEn, dashboard: dashboardEn, books: booksEn, subjects: subjectsEn }
} as const;

export type Translations = typeof translations;
