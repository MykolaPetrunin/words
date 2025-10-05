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

export interface QuestionDetailLevel {
    id: string;
    key: string;
    nameUk: string;
    nameEn: string;
}

export interface QuestionDetail {
    id: string;
    textUk: string;
    textEn: string;
    theoryUk: string | null;
    theoryEn: string | null;
    topicId: string | null;
    level: QuestionDetailLevel;
    topic: QuestionListTopic | null;
    answers: DbAnswer[];
}

export interface QuestionAnswerUpdateInput {
    id?: string;
    textUk: string;
    textEn: string;
    theoryUk?: string | null;
    theoryEn?: string | null;
    isCorrect: boolean;
}

export interface UpdateQuestionInput {
    textUk: string;
    textEn: string;
    theoryUk?: string | null;
    theoryEn?: string | null;
    topicId?: string | null;
    answers: QuestionAnswerUpdateInput[];
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

export async function getQuestionDetailById(questionId: string): Promise<QuestionDetail | null> {
    const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
            level: true,
            topic: true,
            answers: {
                orderBy: {
                    orderIndex: 'asc'
                }
            }
        }
    });

    if (!question) {
        return null;
    }

    return {
        id: question.id,
        textUk: question.textUk,
        textEn: question.textEn,
        theoryUk: question.theoryUk,
        theoryEn: question.theoryEn,
        topicId: question.topicId,
        level: {
            id: question.level.id,
            key: question.level.key,
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
        answers: question.answers.map((answer) => ({
            id: answer.id,
            textUk: answer.textUk,
            textEn: answer.textEn,
            isCorrect: answer.isCorrect,
            orderIndex: answer.orderIndex,
            theoryUk: answer.theoryUk,
            theoryEn: answer.theoryEn
        }))
    };
}

export async function getAllTopics(): Promise<QuestionListTopic[]> {
    const topics = await prisma.topic.findMany({
        orderBy: {
            titleEn: 'asc'
        }
    });

    return topics.map((topic) => ({
        id: topic.id,
        titleUk: topic.titleUk,
        titleEn: topic.titleEn
    }));
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

export async function updateQuestionDetail(questionId: string, input: UpdateQuestionInput): Promise<QuestionDetail> {
    await prisma.$transaction(async (tx) => {
        await tx.question.update({
            where: { id: questionId },
            data: {
                textUk: input.textUk,
                textEn: input.textEn,
                theoryUk: input.theoryUk ?? null,
                theoryEn: input.theoryEn ?? null,
                topicId: input.topicId ?? null
            }
        });

        const existingAnswers = await tx.answer.findMany({
            where: { questionId },
            select: { id: true }
        });

        const incomingIds = new Set(input.answers.map((answer) => answer.id).filter((id): id is string => typeof id === 'string' && id.length > 0));

        const idsToDelete = existingAnswers.map((answer) => answer.id).filter((id) => !incomingIds.has(id));

        if (idsToDelete.length > 0) {
            await tx.answer.deleteMany({
                where: {
                    id: {
                        in: idsToDelete
                    }
                }
            });
        }

        for (const [index, answer] of input.answers.entries()) {
            const payload = {
                textUk: answer.textUk,
                textEn: answer.textEn,
                theoryUk: answer.theoryUk ?? null,
                theoryEn: answer.theoryEn ?? null,
                isCorrect: answer.isCorrect,
                orderIndex: index
            };

            if (answer.id) {
                await tx.answer.update({
                    where: { id: answer.id },
                    data: payload
                });
                continue;
            }

            await tx.answer.create({
                data: {
                    questionId,
                    ...payload
                }
            });
        }
    });

    const updatedQuestion = await getQuestionDetailById(questionId);

    if (!updatedQuestion) {
        throw new Error('Question not found after update');
    }

    return updatedQuestion;
}
