export interface AppPaths {
    readonly root: '/';
    readonly login: '/login';
    readonly signup: '/signup';
    readonly notFound: '/_not-found';
    readonly dashboard: '/dashboard';
    readonly account: '/account';
    readonly subjects: '/subjects';
    readonly books: '/books';
    readonly admin: '/admin';
    readonly apiSubjects: '/api/subjects';
}

export const appPaths: AppPaths = {
    root: '/',
    login: '/login',
    signup: '/signup',
    notFound: '/_not-found',
    dashboard: '/dashboard',
    account: '/account',
    subjects: '/subjects',
    books: '/books',
    admin: '/admin',
    apiSubjects: '/api/subjects'
};

export type AppPathValue = AppPaths[keyof AppPaths];
