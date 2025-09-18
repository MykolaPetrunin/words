import prisma from '@/lib/prisma';

export interface UpsertUserInput {
    firebaseId: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface DbUser {
    id: string;
    firebaseId: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function upsertUserByFirebaseId(input: UpsertUserInput): Promise<DbUser> {
    const { firebaseId, email, firstName, lastName } = input;
    const user = await prisma.user.upsert({
        where: { firebaseId },
        update: { email, firstName, lastName },
        create: { firebaseId, email, firstName, lastName }
    });
    return user;
}
