import prisma from '@/lib/prisma';

export interface DbBook {
    id: string;
    titleUk: string;
    titleEn: string;
    descriptionUk: string | null;
    descriptionEn: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface DbBookWithLearningStatus extends DbBook {
    isLearning: boolean;
    userLevelScores?: {
        levelId: string;
        averageScore: number;
        totalQuestions: number;
    }[];
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
        isActive: bs.book.isActive,
        createdAt: bs.book.createdAt,
        updatedAt: bs.book.updatedAt,
        isLearning: userId ? bs.book.userLevelScores.length > 0 : false,
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

export interface DbBookWithQuestions extends DbBookWithLearningStatus {
    questions: {
        id: string;
        textUk: string;
        textEn: string;
        level: {
            id: string;
            nameUk: string;
            nameEn: string;
        };
        userScore?: number;
    }[];
}

export async function getBookWithQuestions(bookId: string, userId?: string): Promise<DbBookWithQuestions | null> {
    const book = await prisma.book.findFirst({
        where: {
            id: bookId,
            isActive: true
        },
        include: {
            bookQuestions: {
                include: {
                    question: {
                        include: {
                            level: true,
                            userScores: userId
                                ? {
                                      where: {
                                          userId
                                      }
                                  }
                                : false
                        }
                    }
                },
                orderBy: {
                    orderIndex: 'asc'
                }
            },
            userLevelScores: userId
                ? {
                      where: {
                          userId
                      }
                  }
                : false
        }
    });

    if (!book) {
        return null;
    }

    return {
        id: book.id,
        titleUk: book.titleUk,
        titleEn: book.titleEn,
        descriptionUk: book.descriptionUk,
        descriptionEn: book.descriptionEn,
        isActive: book.isActive,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
        isLearning: userId ? book.userLevelScores.length > 0 : false,
        userLevelScores: userId
            ? book.userLevelScores.map((uls) => ({
                  levelId: uls.levelId,
                  averageScore: uls.averageScore,
                  totalQuestions: uls.totalQuestions
              }))
            : undefined,
        questions: book.bookQuestions.map((bq) => ({
            id: bq.question.id,
            textUk: bq.question.textUk,
            textEn: bq.question.textEn,
            level: {
                id: bq.question.level.id,
                nameUk: bq.question.level.nameUk,
                nameEn: bq.question.level.nameEn
            },
            userScore: userId && bq.question.userScores && bq.question.userScores.length > 0 ? bq.question.userScores[0].score : undefined
        }))
    };
}

export async function startLearningBook(userId: string, bookId: string): Promise<DbBookWithLearningStatus> {
    await prisma.$transaction(async (tx) => {
        const book = await tx.book.findUnique({
            where: { id: bookId },
            include: {
                bookQuestions: {
                    include: {
                        question: {
                            select: {
                                levelId: true
                            }
                        }
                    }
                }
            }
        });

        if (!book) {
            throw new Error('Book not found');
        }

        const levelIds = [...new Set(book.bookQuestions.map((bq) => bq.question.levelId))];

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
                where: { userId }
            }
        }
    });

    if (!updatedBook) {
        throw new Error('Book not found');
    }

    return {
        id: updatedBook.id,
        titleUk: updatedBook.titleUk,
        titleEn: updatedBook.titleEn,
        descriptionUk: updatedBook.descriptionUk,
        descriptionEn: updatedBook.descriptionEn,
        isActive: updatedBook.isActive,
        createdAt: updatedBook.createdAt,
        updatedAt: updatedBook.updatedAt,
        isLearning: true,
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

    return {
        id: updatedBook.id,
        titleUk: updatedBook.titleUk,
        titleEn: updatedBook.titleEn,
        descriptionUk: updatedBook.descriptionUk,
        descriptionEn: updatedBook.descriptionEn,
        isActive: updatedBook.isActive,
        createdAt: updatedBook.createdAt,
        updatedAt: updatedBook.updatedAt,
        isLearning: false,
        userLevelScores: []
    };
}
