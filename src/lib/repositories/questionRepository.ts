import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export interface QuestionListFilters {
    readonly subjectIds?: readonly string[];
    readonly bookIds?: readonly string[];
    readonly topicIds?: readonly string[];
}

export interface QuestionListSubject {
    id: string;
    nameUk: string;
    nameEn: string;
}

export interface QuestionListBook {
    id: string;
    titleUk: string;
    titleEn: string;
    subjects: QuestionListSubject[];
}

export interface QuestionListLevel {
    id: string;
    nameUk: string;
    nameEn: string;
}

export interface QuestionListTopic {
    id: string;
    titleUk: string;
    titleEn: string;
}

export interface QuestionListItem {
    id: string;
    textUk: string;
    textEn: string;
    theoryUk: string | null;
    theoryEn: string | null;
    level: QuestionListLevel;
    topic: QuestionListTopic | null;
    books: QuestionListBook[];
}

export interface QuestionFilterTopicOption {
    value: string;
    label: string;
}

export interface QuestionFilterBookOption {
    value: string;
    label: string;
    topics: QuestionFilterTopicOption[];
}

export interface QuestionFilterSubjectOption {
    value: string;
    label: string;
    books: QuestionFilterBookOption[];
}

export type QuestionFiltersTree = QuestionFilterSubjectOption[];

export type PublicAnswer = Pick<DbAnswer, 'id' | 'textUk' | 'textEn' | 'orderIndex' | 'theoryUk' | 'theoryEn' | 'isCorrect'>;

export interface DbAnswer {
    id: string;
    textUk: string;
    textEn: string;
    isCorrect: boolean;
    orderIndex: number;
    theoryUk: string | null;
    theoryEn: string | null;
}

export async function getAllQuestions(filters?: QuestionListFilters): Promise<QuestionListItem[]> {
    const subjectIds = filters?.subjectIds ? Array.from(new Set(filters.subjectIds)) : [];
    const bookIds = filters?.bookIds ? Array.from(new Set(filters.bookIds)) : [];
    const topicIds = filters?.topicIds ? Array.from(new Set(filters.topicIds)) : [];

    const where: Prisma.QuestionWhereInput = {
        isActive: true
    };

    if (topicIds.length > 0) {
        where.topicId = { in: topicIds };
    }

    if (bookIds.length > 0 || subjectIds.length > 0) {
        const bookQuestionFilter: Prisma.BookQuestionListRelationFilter = {
            some: {}
        };

        if (bookIds.length > 0) {
            (bookQuestionFilter.some as Prisma.BookQuestionWhereInput).bookId = { in: bookIds };
        }

        if (subjectIds.length > 0) {
            (bookQuestionFilter.some as Prisma.BookQuestionWhereInput).book = {
                bookSubjects: {
                    some: {
                        subjectId: { in: subjectIds }
                    }
                }
            };
        }

        where.bookQuestions = bookQuestionFilter;
    }

    const questions = await prisma.question.findMany({
        where,
        include: {
            level: true,
            topic: true,
            bookQuestions: {
                include: {
                    book: {
                        include: {
                            bookSubjects: {
                                include: {
                                    subject: true
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return questions.map((question) => {
        const booksMap = new Map<string, QuestionListBook>();

        for (const bookQuestion of question.bookQuestions) {
            const book = bookQuestion.book;

            if (!book.isActive) {
                continue;
            }

            if (!booksMap.has(book.id)) {
                const subjectsMap = new Map<string, QuestionListSubject>();

                for (const bookSubject of book.bookSubjects) {
                    const subject = bookSubject.subject;

                    if (!subject.isActive || subjectsMap.has(subject.id)) {
                        continue;
                    }

                    subjectsMap.set(subject.id, {
                        id: subject.id,
                        nameUk: subject.nameUk,
                        nameEn: subject.nameEn
                    });
                }

                booksMap.set(book.id, {
                    id: book.id,
                    titleUk: book.titleUk,
                    titleEn: book.titleEn,
                    subjects: Array.from(subjectsMap.values()).sort((a, b) => a.nameEn.localeCompare(b.nameEn))
                });
            }
        }

        return {
            id: question.id,
            textUk: question.textUk,
            textEn: question.textEn,
            theoryUk: question.theoryUk,
            theoryEn: question.theoryEn,
            level: {
                id: question.level.id,
                nameUk: question.level.nameUk,
                nameEn: question.level.nameEn
            },
            topic: question.topic
                ? {
                      id: question.topic.id,
                      titleUk: question.topic.titleUk,
                      titleEn: question.topic.titleEn
                  }
                : null,
            books: Array.from(booksMap.values()).sort((a, b) => a.titleEn.localeCompare(b.titleEn))
        };
    });
}

export async function getQuestionFiltersTree(): Promise<QuestionFiltersTree> {
    const subjects = await prisma.subject.findMany({
        where: {
            isActive: true
        },
        orderBy: {
            nameEn: 'asc'
        },
        include: {
            bookSubjects: {
                include: {
                    book: {
                        include: {
                            bookQuestions: {
                                include: {
                                    question: {
                                        include: {
                                            topic: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return subjects.map((subject) => {
        const booksMap = new Map<string, QuestionFilterBookOption>();

        for (const bookSubject of subject.bookSubjects) {
            const book = bookSubject.book;

            if (!book.isActive) {
                continue;
            }

            if (!booksMap.has(book.id)) {
                booksMap.set(book.id, {
                    value: book.id,
                    label: book.titleEn,
                    topics: []
                });
            }

            const bookEntry = booksMap.get(book.id);

            if (!bookEntry) {
                continue;
            }

            const topicMap = new Map(bookEntry.topics.map((topic) => [topic.value, topic] as const));

            for (const bookQuestion of book.bookQuestions) {
                if (!bookQuestion.question.isActive) {
                    continue;
                }
                const topic = bookQuestion.question.topic;

                if (!topic || topicMap.has(topic.id)) {
                    continue;
                }

                topicMap.set(topic.id, {
                    value: topic.id,
                    label: topic.titleEn
                });
            }

            bookEntry.topics = Array.from(topicMap.values()).sort((a, b) => a.label.localeCompare(b.label));
        }

        return {
            value: subject.id,
            label: subject.nameEn,
            books: Array.from(booksMap.values()).sort((a, b) => a.label.localeCompare(b.label))
        };
    });
}

export async function getAnswersByQuestionId(questionId: string): Promise<DbAnswer[]> {
    const answers = await prisma.answer.findMany({
        where: { questionId },
        orderBy: { orderIndex: 'asc' }
    });

    return answers.map((a) => ({
        id: a.id,
        textUk: a.textUk,
        textEn: a.textEn,
        isCorrect: a.isCorrect,
        orderIndex: a.orderIndex,
        theoryUk: a.theoryUk,
        theoryEn: a.theoryEn
    }));
}

export async function getPublicAnswersByQuestionId(questionId: string): Promise<PublicAnswer[]> {
    const answers = await getAnswersByQuestionId(questionId);
    return answers.map(({ id, textUk, textEn, orderIndex, theoryUk, theoryEn, isCorrect }) => ({ id, textUk, textEn, orderIndex, theoryUk, theoryEn, isCorrect }));
}
