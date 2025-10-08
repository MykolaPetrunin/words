import type { DbBookWithRelations } from '@/lib/repositories/bookRepository';

import type { BookFormData } from './schemas';

export const mapBookToFormData = (book: DbBookWithRelations): BookFormData => ({
    titleUk: book.titleUk,
    titleEn: book.titleEn,
    descriptionUk: book.descriptionUk ?? '',
    descriptionEn: book.descriptionEn ?? '',
    isActive: book.isActive,
    subjectIds: book.subjects.map((subject) => subject.id),
    topicIds: book.topics.map((topic) => topic.id)
});

export const createEmptyBookFormData = (): BookFormData => ({
    titleUk: '',
    titleEn: '',
    descriptionUk: '',
    descriptionEn: '',
    isActive: false,
    subjectIds: [],
    topicIds: []
});
