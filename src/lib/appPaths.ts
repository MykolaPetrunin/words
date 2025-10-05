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
    readonly adminQuestions: '/admin/questions';
    readonly adminQuestionDetail: '/admin/questions/[id]';
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
    adminQuestions: '/admin/questions',
    adminQuestionDetail: '/admin/questions/[id]',
    apiSubjects: '/api/subjects'
};

export type AppPathValue = AppPaths[keyof AppPaths];

export const getAdminQuestionPath = (questionId: string): `/admin/questions/${string}` => `/admin/questions/${questionId}`;
