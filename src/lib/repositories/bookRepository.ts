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

export async function getBooksBySubjectId(subjectId: string): Promise<DbBook[]> {
    const bookSubjects = await prisma.bookSubject.findMany({
        where: {
            subjectId,
            book: {
                isActive: true
            }
        },
        include: {
            book: true
        }
    });

    return bookSubjects.map((bs) => bs.book);
}

export async function getBookById(id: string): Promise<DbBook | null> {
    return prisma.book.findFirst({
        where: {
            id,
            isActive: true
        }
    });
}
