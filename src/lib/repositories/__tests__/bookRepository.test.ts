import type { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => {
    const bookSubject = {
        findMany: jest.fn()
    };
    const book = {
        findFirst: jest.fn()
    };
    const prisma: Partial<PrismaClient> = { bookSubject, book } as unknown as PrismaClient;
    return prisma;
});

import { getBookById, getBooksBySubjectId } from '../bookRepository';

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
                    book: true
                }
            });

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(mockBookSubjects[0].book);
            expect(result[1]).toEqual(mockBookSubjects[1].book);
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
});
