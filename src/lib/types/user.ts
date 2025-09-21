export type UserLocale = 'uk' | 'en';

export interface ApiUser {
    id: string;
    firebaseId: string;
    email: string;
    firstName: string;
    lastName: string;
    questionsPerSession: number;
    locale: UserLocale;
    createdAt: string;
    updatedAt: string;
}
