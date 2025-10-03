export type UserLocale = 'uk' | 'en';

export enum UserRole {
    Admin = 'ADMIN',
    User = 'USER'
}

export interface ApiUser {
    id: string;
    firebaseId: string;
    email: string;
    firstName: string;
    lastName: string;
    questionsPerSession: number;
    locale: UserLocale;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}
