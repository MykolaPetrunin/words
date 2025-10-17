export interface AppPaths {
    readonly root: '/';
    readonly login: '/login';
    readonly signup: '/signup';
    readonly notFound: '/_not-found';
    readonly dashboard: '/dashboard';
    readonly account: '/account';
    readonly books: '/books';
    readonly admin: '/admin';
    readonly adminSubjects: '/admin/subjects';
    readonly adminSubjectDetail: '/admin/subjects/[id]';
    readonly adminBooks: '/admin/books';
    readonly adminBookDetail: '/admin/books/[id]';
    readonly adminBookTopics: '/admin/books/[id]/topics';
    readonly adminBookTopicDetail: '/admin/books/[id]/topics/[topicId]';
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
    books: '/books',
    admin: '/admin',
    adminSubjects: '/admin/subjects',
    adminSubjectDetail: '/admin/subjects/[id]',
    adminBooks: '/admin/books',
    adminBookDetail: '/admin/books/[id]',
    adminBookTopics: '/admin/books/[id]/topics',
    adminBookTopicDetail: '/admin/books/[id]/topics/[topicId]',
    adminQuestions: '/admin/questions',
    adminQuestionDetail: '/admin/questions/[id]',
    apiSubjects: '/api/subjects'
};

export type AppPathValue = AppPaths[keyof AppPaths];

export const getAdminQuestionPath = (questionId: string): `/admin/questions/${string}` => `/admin/questions/${questionId}`;
export const getAdminBookPath = (bookId: string): `/admin/books/${string}` => `/admin/books/${bookId}`;
export const getAdminBookTopicsPath = (bookId: string): `/admin/books/${string}/topics` => `/admin/books/${bookId}/topics`;
export const getAdminBookTopicPath = (bookId: string, topicId: string): `/admin/books/${string}/topics/${string}` => `/admin/books/${bookId}/topics/${topicId}`;
export const getAdminSubjectPath = (subjectId: string): `/admin/subjects/${string}` => `/admin/subjects/${subjectId}`;
