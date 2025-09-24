export interface AppPaths {
    readonly root: '/';
    readonly login: '/login';
    readonly signup: '/signup';
    readonly notFound: '/_not-found';
    readonly dashboard: '/dashboard';
    readonly account: '/account';
    readonly subjects: '/subjects';
    readonly subject: '/subject';
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
    subject: '/subject',
    apiSubjects: '/api/subjects'
};

export type AppPathValue = AppPaths[keyof AppPaths];
