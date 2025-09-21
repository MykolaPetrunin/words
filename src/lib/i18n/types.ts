import type { Translations } from './translations';

export type AvailableLocale = keyof Translations;
export type Namespaces = keyof Translations['uk'];

export type I18nKey = {
    [N in Namespaces]: `${N & string}.${keyof Translations['uk'][N] & string}`;
}[Namespaces];
