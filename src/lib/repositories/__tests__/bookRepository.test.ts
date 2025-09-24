import type { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

type MockPrismaTransaction = {
    book: {
        findUnique: jest.Mock;
    };
    bookSubject: {
        findMany: jest.Mock;
    };
    userBookLevelScore: {
        create: jest.Mock;
        deleteMany: jest.Mock;
        findFirst: jest.Mock;
        upsert: jest.Mock;
    };
    userSubjectLevelScore: {
        create: jest.Mock;
        deleteMany: jest.Mock;
        upsert: jest.Mock;
    };
};

jest.mock('@/lib/prisma', () => {
    const bookSubject = {
        findMany: jest.fn()
    };
    const book = {
        findFirst: jest.fn(),
        findUnique: jest.fn()
    };
    const userBookLevelScore = {
        create: jest.fn(),
        findFirst: jest.fn(),
        deleteMany: jest.fn(),
        upsert: jest.fn()
    };
    const userSubjectLevelScore = {
        create: jest.fn(),
        deleteMany: jest.fn(),
        upsert: jest.fn()
    };
    const $transaction = jest.fn();
    const prisma: Partial<PrismaClient> = {
        bookSubject,
        book,
        userBookLevelScore,
        userSubjectLevelScore,
        $transaction
    } as unknown as PrismaClient;
    return prisma;
});

import { getBookById, getBooksBySubjectId, getBookWithQuestions, startLearningBook, stopLearningBook } from '../bookRepository';

describe('bookRepository', () => {
    describe('getBooksBySubjectId', () => {
        it('returns books for a specific subject', async () => {
            const mockBookSubjects = [
                {
                    id: 'bs1',
                    bookId: 'b1',
                    subjectId: 's1',
                    book: {
                        id: 'b1',
                        titleUk: 'Книга 1',
                        titleEn: 'Book 1',
                        descriptionUk: null,
                        descriptionEn: null,
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 'bs2',
                    bookId: 'b2',
                    subjectId: 's1',
                    book: {
                        id: 'b2',
                        titleUk: 'Книга 2',
                        titleEn: 'Book 2',
                        descriptionUk: null,
                        descriptionEn: null,
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            (prisma.bookSubject.findMany as jest.Mock).mockResolvedValue(mockBookSubjects);

            const result = await getBooksBySubjectId('s1');

            expect(prisma.bookSubject.findMany).toHaveBeenCalledWith({
                where: {
                    subjectId: 's1',
                    book: {
                        isActive: true
                    }
                },
                include: {
                    book: {
                        include: {
                            userLevelScores: false
                        }
                    }
                }
            });

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                ...mockBookSubjects[0].book,
                isLearning: false,
                userLevelScores: undefined
            });
            expect(result[1]).toEqual({
                ...mockBookSubjects[1].book,
                isLearning: false,
                userLevelScores: undefined
            });
        });

        it('returns empty array when no books found', async () => {
            (prisma.bookSubject.findMany as jest.Mock).mockResolvedValue([]);

            const result = await getBooksBySubjectId('s1');

            expect(result).toEqual([]);
        });
    });

    describe('getBookById', () => {
        it('returns book by id', async () => {
            const mockBook = {
                id: 'b1',
                titleUk: 'Книга 1',
                titleEn: 'Book 1',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBook);

            const result = await getBookById('b1');

            expect(prisma.book.findFirst).toHaveBeenCalledWith({
                where: {
                    id: 'b1',
                    isActive: true
                }
            });

            expect(result).toEqual(mockBook);
        });

        it('returns null when book not found', async () => {
            (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getBookById('b1');

            expect(result).toBeNull();
        });
    });

    describe('startLearningBook', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('starts learning a book successfully', async () => {
            const mockBook = {
                id: 'book-1',
                titleUk: 'Test Book',
                titleEn: 'Test Book',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                bookQuestions: [],
                bookSubjects: [{ subjectId: 'subject-1' }],
                userLevelScores: []
            };

            const mockTransaction = async <T>(callback: (tx: MockPrismaTransaction) => Promise<T>) => {
                const tx = {
                    book: {
                        findUnique: jest
                            .fn()
                            .mockResolvedValueOnce(mockBook) // First call returns book
                            .mockResolvedValueOnce({
                                ...mockBook,
                                userLevelScores: [{ userId: 'user-1' }]
                            }) // Second call returns book with user scores
                    },
                    bookSubject: {
                        findMany: jest.fn().mockResolvedValue(mockBook.bookSubjects)
                    },
                    userBookLevelScore: {
                        create: jest.fn(),
                        deleteMany: jest.fn(),
                        findFirst: jest.fn(),
                        upsert: jest.fn()
                    },
                    userSubjectLevelScore: {
                        create: jest.fn(),
                        deleteMany: jest.fn(),
                        upsert: jest.fn()
                    }
                };
                return callback(tx);
            };

            (prisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

            // Mock the findUnique call after transaction
            (prisma.book.findUnique as jest.Mock).mockResolvedValue({
                ...mockBook,
                userLevelScores: [{ userId: 'user-1' }]
            });

            const result = await startLearningBook('user-1', 'book-1');

            expect(result).toMatchObject({
                id: mockBook.id,
                titleUk: mockBook.titleUk,
                titleEn: mockBook.titleEn,
                descriptionUk: mockBook.descriptionUk,
                descriptionEn: mockBook.descriptionEn,
                isActive: mockBook.isActive,
                isLearning: true
            });
        });

        it('throws error when book not found', async () => {
            const mockTransaction = async <T>(callback: (tx: MockPrismaTransaction) => Promise<T>) => {
                const tx = {
                    book: {
                        findUnique: jest.fn().mockResolvedValue(null)
                    },
                    bookSubject: {
                        findMany: jest.fn()
                    },
                    userBookLevelScore: {
                        create: jest.fn(),
                        deleteMany: jest.fn(),
                        findFirst: jest.fn(),
                        upsert: jest.fn()
                    },
                    userSubjectLevelScore: {
                        create: jest.fn(),
                        deleteMany: jest.fn(),
                        upsert: jest.fn()
                    }
                };
                return callback(tx);
            };

            (prisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

            await expect(startLearningBook('user-1', 'invalid-book')).rejects.toThrow('Book not found');
        });

        it('creates user book and subject level scores', async () => {
            const mockBook = {
                id: 'book-1',
                titleUk: 'Test Book',
                titleEn: 'Test Book',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                bookQuestions: [{ question: { id: 'q1', levelId: 'level-1' } }, { question: { id: 'q2', levelId: 'level-2' } }],
                bookSubjects: [{ subjectId: 'subject-1' }, { subjectId: 'subject-2' }],
                userLevelScores: []
            };

            const mockUpsert = jest.fn();
            const mockUpsertSubject = jest.fn();
            const mockTransaction = async <T>(callback: (tx: MockPrismaTransaction) => Promise<T>) => {
                const tx = {
                    book: {
                        findUnique: jest
                            .fn()
                            .mockResolvedValueOnce(mockBook) // First call returns book
                            .mockResolvedValueOnce({
                                ...mockBook,
                                userLevelScores: [{ userId: 'user-1' }]
                            }) // Second call returns book with user scores
                    },
                    bookSubject: {
                        findMany: jest.fn().mockResolvedValue(mockBook.bookSubjects)
                    },
                    userBookLevelScore: {
                        create: jest.fn(),
                        deleteMany: jest.fn(),
                        findFirst: jest.fn(),
                        upsert: mockUpsert
                    },
                    userSubjectLevelScore: {
                        create: jest.fn(),
                        deleteMany: jest.fn(),
                        upsert: mockUpsertSubject
                    }
                };
                return callback(tx);
            };

            (prisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

            // Mock the findUnique call after transaction
            (prisma.book.findUnique as jest.Mock).mockResolvedValue({
                ...mockBook,
                userLevelScores: [{ userId: 'user-1' }]
            });

            await startLearningBook('user-1', 'book-1');

            expect(mockUpsert).toHaveBeenCalledTimes(2);
            expect(mockUpsert).toHaveBeenCalledWith({
                where: {
                    userId_bookId_levelId: {
                        userId: 'user-1',
                        bookId: 'book-1',
                        levelId: 'level-1'
                    }
                },
                create: {
                    userId: 'user-1',
                    bookId: 'book-1',
                    levelId: 'level-1',
                    averageScore: 0,
                    totalQuestions: 0
                },
                update: {}
            });
        });
    });

    describe('stopLearningBook', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('stops learning a book successfully', async () => {
            const mockBook = {
                id: 'book-1',
                titleUk: 'Test Book',
                titleEn: 'Test Book',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockTransaction = async <T>(callback: (tx: MockPrismaTransaction) => Promise<T>) => {
                const tx = {
                    userBookLevelScore: {
                        deleteMany: jest.fn(),
                        create: jest.fn(),
                        findFirst: jest.fn(),
                        upsert: jest.fn()
                    },
                    bookSubject: {
                        findMany: jest.fn().mockResolvedValue([{ subjectId: 'subject-1' }])
                    },
                    userSubjectLevelScore: {
                        deleteMany: jest.fn(),
                        create: jest.fn(),
                        upsert: jest.fn()
                    },
                    book: {
                        findUnique: jest.fn().mockResolvedValue({
                            ...mockBook,
                            userLevelScores: []
                        })
                    }
                };
                return callback(tx);
            };

            (prisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

            // Mock the findUnique call after transaction
            (prisma.book.findUnique as jest.Mock).mockResolvedValue({
                ...mockBook,
                userLevelScores: []
            });

            const result = await stopLearningBook('user-1', 'book-1');

            expect(result).toEqual({
                id: mockBook.id,
                titleUk: mockBook.titleUk,
                titleEn: mockBook.titleEn,
                descriptionUk: mockBook.descriptionUk,
                descriptionEn: mockBook.descriptionEn,
                isActive: mockBook.isActive,
                createdAt: mockBook.createdAt,
                updatedAt: mockBook.updatedAt,
                isLearning: false,
                userLevelScores: []
            });
        });

        it('throws error when book not found', async () => {
            const mockTransaction = async <T>(callback: (tx: MockPrismaTransaction) => Promise<T>) => {
                const tx = {
                    userBookLevelScore: {
                        deleteMany: jest.fn(),
                        create: jest.fn(),
                        findFirst: jest.fn(),
                        upsert: jest.fn()
                    },
                    bookSubject: {
                        findMany: jest.fn().mockResolvedValue([])
                    },
                    userSubjectLevelScore: {
                        deleteMany: jest.fn(),
                        create: jest.fn(),
                        upsert: jest.fn()
                    },
                    book: {
                        findUnique: jest.fn().mockResolvedValue(null)
                    }
                };
                return callback(tx);
            };

            (prisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

            // Mock the findUnique call after transaction to return null
            (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(stopLearningBook('user-1', 'invalid-book')).rejects.toThrow('Book not found');
        });

        it('removes subject level scores when no other books in subject', async () => {
            const mockDeleteMany = jest.fn();
            const mockTransaction = async <T>(callback: (tx: MockPrismaTransaction) => Promise<T>) => {
                const tx = {
                    userBookLevelScore: {
                        deleteMany: jest.fn(),
                        create: jest.fn(),
                        findFirst: jest.fn().mockResolvedValue(null),
                        upsert: jest.fn()
                    },
                    bookSubject: {
                        findMany: jest.fn().mockResolvedValue([{ subjectId: 'subject-1' }])
                    },
                    userSubjectLevelScore: {
                        deleteMany: mockDeleteMany,
                        create: jest.fn(),
                        upsert: jest.fn()
                    },
                    book: {
                        findUnique: jest.fn().mockResolvedValue({
                            id: 'book-1',
                            titleUk: 'Test Book',
                            titleEn: 'Test Book',
                            descriptionUk: null,
                            descriptionEn: null,
                            isActive: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            userLevelScores: []
                        })
                    }
                };
                return callback(tx);
            };

            (prisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

            // Mock the findUnique call after transaction
            (prisma.book.findUnique as jest.Mock).mockResolvedValue({
                id: 'book-1',
                titleUk: 'Test Book',
                titleEn: 'Test Book',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await stopLearningBook('user-1', 'book-1');

            expect(mockDeleteMany).toHaveBeenCalledWith({
                where: {
                    userId: 'user-1',
                    subjectId: 'subject-1'
                }
            });
        });
    });

    describe('getBookWithQuestions', () => {
        it('returns book with questions for a user', async () => {
            const mockBook = {
                id: 'book-1',
                titleUk: 'Книга 1',
                titleEn: 'Book 1',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                bookQuestions: [
                    {
                        id: 'bq1',
                        bookId: 'book-1',
                        questionId: 'q1',
                        question: {
                            id: 'q1',
                            textUk: 'Питання 1',
                            textEn: 'Question 1',
                            theoryUk: null,
                            theoryEn: null,
                            levelId: 'level-1',
                            isActive: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            level: {
                                id: 'level-1',
                                nameUk: 'Рівень 1',
                                nameEn: 'Level 1'
                            }
                        }
                    }
                ],
                userLevelScores: [
                    {
                        userId: 'user-1',
                        bookId: 'book-1',
                        levelId: 'level-1',
                        averageScore: 75
                    }
                ]
            };

            (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBook);

            const result = await getBookWithQuestions('book-1', 'user-1');

            expect(prisma.book.findFirst).toHaveBeenCalled();

            expect(result).toMatchObject({
                id: mockBook.id,
                titleUk: mockBook.titleUk,
                titleEn: mockBook.titleEn,
                questions: expect.arrayContaining([
                    expect.objectContaining({
                        textUk: 'Питання 1',
                        textEn: 'Question 1',
                        level: {
                            id: 'level-1',
                            nameUk: 'Рівень 1',
                            nameEn: 'Level 1'
                        }
                    })
                ])
            });
        });

        it('returns book with questions without user', async () => {
            const mockBook = {
                id: 'book-1',
                titleUk: 'Книга 1',
                titleEn: 'Book 1',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                bookQuestions: [
                    {
                        id: 'bq1',
                        bookId: 'book-1',
                        questionId: 'q1',
                        question: {
                            id: 'q1',
                            textUk: 'Питання 1',
                            textEn: 'Question 1',
                            theoryUk: null,
                            theoryEn: null,
                            levelId: 'level-1',
                            isActive: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            level: {
                                id: 'level-1',
                                nameUk: 'Рівень 1',
                                nameEn: 'Level 1'
                            }
                        }
                    }
                ],
                userLevelScores: []
            };

            (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBook);

            const result = await getBookWithQuestions('book-1');

            expect(result).toBeDefined();
        });

        it('returns null when book not found', async () => {
            (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await getBookWithQuestions('invalid-book');

            expect(result).toBeNull();
        });
    });
});
