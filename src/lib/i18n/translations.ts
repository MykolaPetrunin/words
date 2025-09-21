import { en as accountEn, uk as accountUk } from './namespaces/account';
import { en as authEn, uk as authUk } from './namespaces/auth';
import { en as commonEn, uk as commonUk } from './namespaces/common';
import { en as homeEn, uk as homeUk } from './namespaces/home';

export const translations = {
    uk: { common: commonUk, home: homeUk, account: accountUk, auth: authUk },
    en: { common: commonEn, home: homeEn, account: accountEn, auth: authEn }
} as const;

export type Translations = typeof translations;
