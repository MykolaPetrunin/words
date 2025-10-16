'use server';

import prisma from '@/lib/prisma';

import { calculateBookLevelCompletion, createEmptyBookLevelCompletion, type BookLevelCompletion, type BookLevelCompletionInput } from './bookLevelProgress';

export interface DbBook {
    id: string;
    titleUk: string;
    titleEn: string;
    descriptionUk: string | null;
    descriptionEn: string | null;
    coverUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface BookSubjectInfo {
    id: string;
    nameUk: string;
    nameEn: string;
}

export interface BookTopicInfo {
    id: string;
    bookId: string;
    titleUk: string;
    titleEn: string;
}

export interface DbBookWithRelations extends DbBook {
    subjects: BookSubjectInfo[];
    topics: BookTopicInfo[];
}

export interface DbBookWithLearningStatus extends DbBook {
    isLearning: boolean;
    levelCompletion: BookLevelCompletion;
    userLevelScores?: {
        levelId: string;
        averageScore: number;
        totalQuestions: number;
    }[];
}

export interface BookInput {
    titleUk: string;
    titleEn: string;
    descriptionUk: string | null;
    descriptionEn: string | null;
    coverUrl: string | null;
    isActive: boolean;
    subjectIds: readonly string[];
    topicIds: readonly string[];
}

type BookBaseRow = {
    id: string;
    titleUk: string;
    titleEn: string;
    descriptionUk: string | null;
    descriptionEn: string | null;
    coverUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

type BookSubjectRow = {
    subject: {
        id: string;
        nameUk: string;
        nameEn: string;
    };
};

type TopicRow = {
    bookId: string | null;
    id: string;
    titleUk: string;
    titleEn: string;
};

type BookWithRelationsRow = BookBaseRow & {
    bookSubjects: BookSubjectRow[];
    topics: TopicRow[];
};

const mapToDbBook = (book: BookBaseRow): DbBook => ({
    id: book.id,
    titleUk: book.titleUk,
    titleEn: book.titleEn,
    descriptionUk: book.descriptionUk,
    descriptionEn: book.descriptionEn,
    coverUrl: book.coverUrl,
    isActive: book.isActive,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt
});

const mapToDbBookWithRelations = (book: BookWithRelationsRow): DbBookWithRelations => ({
    ...mapToDbBook(book),
    subjects: book.bookSubjects.map((item) => ({
        id: item.subject.id,
        nameUk: item.subject.nameUk,
        nameEn: item.subject.nameEn
    })),
    topics: book.topics
        .filter((topic): topic is TopicRow & { bookId: string } => typeof topic.bookId === 'string')
        .map((topic) => ({
            id: topic.id,
            bookId: topic.bookId,
            titleUk: topic.titleUk,
            titleEn: topic.titleEn
        }))
});

export async function getAllBooks(): Promise<DbBookWithRelations[]> {
    const rows = await prisma.book.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
            bookSubjects: {
                include: {
                    subject: {
                        select: {
                            id: true,
                            nameUk: true,
                            nameEn: true
                        }
                    }
                }
            },
            topics: {
                select: {
                    bookId: true,
                    id: true,
                    titleUk: true,
                    titleEn: true
                }
            }
        }
    });
    return rows.map((row) => mapToDbBookWithRelations(row));
}

export async function getBookWithRelations(id: string): Promise<DbBookWithRelations | null> {
    const book = await prisma.book.findUnique({
        where: { id },
        include: {
            bookSubjects: {
                include: {
                    subject: {
                        select: {
                            id: true,
                            nameUk: true,
                            nameEn: true
                        }
                    }
                }
            },
            topics: {
                select: {
                    bookId: true,
                    id: true,
                    titleUk: true,
                    titleEn: true
                }
            }
        }
    });
    if (!book) {
        return null;
    }
    return mapToDbBookWithRelations(book);
}

export async function createBook(input: BookInput): Promise<DbBookWithRelations> {
    const book = await prisma.book.create({
        data: {
            titleUk: input.titleUk,
            titleEn: input.titleEn,
            descriptionUk: input.descriptionUk,
            descriptionEn: input.descriptionEn,
            coverUrl: input.coverUrl,
            isActive: input.isActive,
            bookSubjects: {
                create: input.subjectIds.map((subjectId) => ({ subjectId }))
            }
        },
        include: {
            bookSubjects: {
                include: {
                    subject: {
                        select: {
                            id: true,
                            nameUk: true,
                            nameEn: true
                        }
                    }
                }
            },
            topics: {
                select: {
                    bookId: true,
                    id: true,
                    titleUk: true,
                    titleEn: true
                }
            }
        }
    });
    return mapToDbBookWithRelations(book);
}

export async function updateBook(id: string, input: BookInput): Promise<DbBookWithRelations> {
    await prisma.$transaction(async (tx) => {
        await tx.book.update({
            where: { id },
            data: {
                titleUk: input.titleUk,
                titleEn: input.titleEn,
                descriptionUk: input.descriptionUk,
                descriptionEn: input.descriptionEn,
                coverUrl: input.coverUrl,
                isActive: input.isActive,
                bookSubjects: {
                    deleteMany: {},
                    create: input.subjectIds.map((subjectId) => ({ subjectId }))
                }
            }
        });

        if (input.topicIds.length === 0) {
            await tx.topic.deleteMany({
                where: { bookId: id }
            });
            return;
        }

        await tx.topic.deleteMany({
            where: {
                bookId: id,
                id: {
                    notIn: [...input.topicIds]
                }
            }
        });
    });

    const updated = await prisma.book.findUnique({
        where: { id },
        include: {
            bookSubjects: {
                include: {
                    subject: {
                        select: {
                            id: true,
                            nameUk: true,
                            nameEn: true
                        }
                    }
                }
            },
            topics: {
                select: {
                    bookId: true,
                    id: true,
                    titleUk: true,
                    titleEn: true
                }
            }
        }
    });

    if (!updated) {
        throw new Error('Book not found after update');
    }

    return mapToDbBookWithRelations(updated);
}

export async function getBooksBySubjectId(subjectId: string, userId?: string): Promise<DbBookWithLearningStatus[]> {
    const bookSubjects = await prisma.bookSubject.findMany({
        where: {
            subjectId,
            book: {
                isActive: true
            }
        },
        include: {
            book: {
                include: {
                    userLevelScores: userId
                        ? {
                              where: {
                                  userId
                              },
                              include: {
                                  level: {
                                      select: {
                                          key: true
                                      }
                                  }
                              }
                          }
                        : false
                }
            }
        }
    });

    return bookSubjects.map((bs) => ({
        id: bs.book.id,
        titleUk: bs.book.titleUk,
        titleEn: bs.book.titleEn,
        descriptionUk: bs.book.descriptionUk,
        descriptionEn: bs.book.descriptionEn,
        coverUrl: bs.book.coverUrl,
        isActive: bs.book.isActive,
        createdAt: bs.book.createdAt,
        updatedAt: bs.book.updatedAt,
        isLearning: userId ? bs.book.userLevelScores.length > 0 : false,
        levelCompletion: userId ? resolveLevelCompletionFromScores(bs.book.userLevelScores) : createEmptyBookLevelCompletion(),
        userLevelScores: userId
            ? bs.book.userLevelScores.map((uls) => ({
                  levelId: uls.levelId,
                  averageScore: uls.averageScore,
                  totalQuestions: uls.totalQuestions
              }))
            : undefined
    }));
}

export async function getBookById(id: string): Promise<DbBook | null> {
    return prisma.book.findFirst({
        where: {
            id,
            isActive: true
        }
    });
}

export interface DbBookQuestion {
    id: string;
    textUk: string;
    textEn: string;
    theoryUk: string | null;
    theoryEn: string | null;
    level: {
        id: string;
        key: string;
        nameUk: string;
        nameEn: string;
    };
    userScore?: number;
}

export interface DbBookWithQuestions extends DbBookWithLearningStatus {
    questions: DbBookQuestion[];
}

type LevelScoreInput = {
    level?: {
        key: string;
    } | null;
    averageScore: number | null;
    totalQuestions: number | null;
};

function resolveLevelCompletionFromScores(levelScores: readonly LevelScoreInput[] | undefined): BookLevelCompletion {
    if (!levelScores || levelScores.length === 0) {
        return createEmptyBookLevelCompletion();
    }

    const inputs: BookLevelCompletionInput[] = levelScores
        .filter((score): score is Required<Pick<LevelScoreInput, 'level'>> & LevelScoreInput => Boolean(score.level))
        .map((score) => ({
            levelKey: score.level!.key,
            averageScore: score.averageScore,
            totalQuestions: score.totalQuestions ?? 0
        }));

    return calculateBookLevelCompletion(inputs);
}

export async function getBookWithQuestions(bookId: string, userId?: string): Promise<DbBookWithQuestions | null> {
    const book = await prisma.book.findFirst({
        where: {
            id: bookId,
            isActive: true
        },
        include: {
            questions: {
                include: {
                    level: true,
                    userScores: userId
                        ? {
                              where: {
                                  userId
                              }
                          }
                        : undefined
                },
                orderBy: {
                    createdAt: 'asc'
                }
            },
            userLevelScores: userId
                ? {
                      where: {
                          userId
                      },
                      include: {
                          level: {
                              select: {
                                  key: true
                              }
                          }
                      }
                  }
                : false
        }
    });

    if (!book) {
        return null;
    }

    const levelCompletion = userId ? resolveLevelCompletionFromScores(book.userLevelScores) : createEmptyBookLevelCompletion();

    return {
        id: book.id,
        titleUk: book.titleUk,
        titleEn: book.titleEn,
        descriptionUk: book.descriptionUk,
        descriptionEn: book.descriptionEn,
        coverUrl: book.coverUrl,
        isActive: book.isActive,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
        isLearning: userId ? book.userLevelScores.length > 0 : false,
        levelCompletion,
        userLevelScores: userId
            ? book.userLevelScores.map((uls) => ({
                  levelId: uls.levelId,
                  averageScore: uls.averageScore,
                  totalQuestions: uls.totalQuestions
              }))
            : undefined,
        questions: book.questions.map((question) => ({
            id: question.id,
            textUk: question.textUk,
            textEn: question.textEn,
            theoryUk: question.theoryUk,
            theoryEn: question.theoryEn,
            level: {
                id: question.level.id,
                key: question.level.key,
                nameUk: question.level.nameUk,
                nameEn: question.level.nameEn
            },
            userScore: userId ? question.userScores?.[0]?.score : undefined
        }))
    };
}

export async function updateBookCover(id: string, coverUrl: string | null): Promise<DbBookWithRelations> {
    const book = await prisma.book.update({
        where: { id },
        data: { coverUrl },
        include: {
            bookSubjects: {
                include: {
                    subject: {
                        select: {
                            id: true,
                            nameUk: true,
                            nameEn: true
                        }
                    }
                }
            },
            topics: {
                select: {
                    bookId: true,
                    id: true,
                    titleUk: true,
                    titleEn: true
                }
            }
        }
    });
    return mapToDbBookWithRelations(book);
}

export async function startLearningBook(userId: string, bookId: string): Promise<DbBookWithLearningStatus> {
    await prisma.$transaction(async (tx) => {
        const book = await tx.book.findUnique({
            where: { id: bookId },
            include: {
                questions: {
                    select: {
                        levelId: true
                    }
                }
            }
        });

        if (!book) {
            throw new Error('Book not found');
        }

        const levelIds = [...new Set(book.questions.map((question) => question.levelId))];

        for (const levelId of levelIds) {
            await tx.userBookLevelScore.upsert({
                where: {
                    userId_bookId_levelId: {
                        userId,
                        bookId,
                        levelId
                    }
                },
                create: {
                    userId,
                    bookId,
                    levelId,
                    averageScore: 0,
                    totalQuestions: 0
                },
                update: {}
            });
        }

        const bookSubjects = await tx.bookSubject.findMany({
            where: { bookId }
        });

        for (const bookSubject of bookSubjects) {
            for (const levelId of levelIds) {
                await tx.userSubjectLevelScore.upsert({
                    where: {
                        userId_subjectId_levelId: {
                            userId,
                            subjectId: bookSubject.subjectId,
                            levelId
                        }
                    },
                    create: {
                        userId,
                        subjectId: bookSubject.subjectId,
                        levelId,
                        averageScore: 0,
                        totalQuestions: 0
                    },
                    update: {}
                });
            }
        }
    });

    const updatedBook = await prisma.book.findUnique({
        where: { id: bookId },
        include: {
            userLevelScores: {
                where: { userId },
                include: {
                    level: {
                        select: {
                            key: true
                        }
                    }
                }
            }
        }
    });

    if (!updatedBook) {
        throw new Error('Book not found');
    }

    const levelCompletion = resolveLevelCompletionFromScores(updatedBook.userLevelScores);

    return {
        id: updatedBook.id,
        titleUk: updatedBook.titleUk,
        titleEn: updatedBook.titleEn,
        descriptionUk: updatedBook.descriptionUk,
        descriptionEn: updatedBook.descriptionEn,
        coverUrl: updatedBook.coverUrl,
        isActive: updatedBook.isActive,
        createdAt: updatedBook.createdAt,
        updatedAt: updatedBook.updatedAt,
        isLearning: true,
        levelCompletion,
        userLevelScores: updatedBook.userLevelScores.map((uls) => ({
            levelId: uls.levelId,
            averageScore: uls.averageScore,
            totalQuestions: uls.totalQuestions
        }))
    };
}

export async function stopLearningBook(userId: string, bookId: string): Promise<DbBookWithLearningStatus> {
    await prisma.$transaction(async (tx) => {
        await tx.userBookLevelScore.deleteMany({
            where: { userId, bookId }
        });

        const bookSubjects = await tx.bookSubject.findMany({
            where: { bookId },
            select: { subjectId: true }
        });

        for (const bookSubject of bookSubjects) {
            const otherBooksLearning = await tx.userBookLevelScore.findFirst({
                where: {
                    userId,
                    book: {
                        bookSubjects: {
                            some: {
                                subjectId: bookSubject.subjectId
                            }
                        }
                    }
                }
            });

            if (!otherBooksLearning) {
                await tx.userSubjectLevelScore.deleteMany({
                    where: {
                        userId,
                        subjectId: bookSubject.subjectId
                    }
                });
            }
        }
    });

    const updatedBook = await prisma.book.findUnique({
        where: { id: bookId }
    });

    if (!updatedBook) {
        throw new Error('Book not found');
    }

    const levelCompletion = createEmptyBookLevelCompletion();

    return {
        id: updatedBook.id,
        titleUk: updatedBook.titleUk,
        titleEn: updatedBook.titleEn,
        descriptionUk: updatedBook.descriptionUk,
        descriptionEn: updatedBook.descriptionEn,
        coverUrl: updatedBook.coverUrl,
        isActive: updatedBook.isActive,
        createdAt: updatedBook.createdAt,
        updatedAt: updatedBook.updatedAt,
        isLearning: false,
        levelCompletion,
        userLevelScores: []
    };
}
