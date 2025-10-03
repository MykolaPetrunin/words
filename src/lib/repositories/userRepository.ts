import prisma from '@/lib/prisma';
import type { UserLocale } from '@/lib/types/user';
import { UserRole } from '@/lib/types/user';

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
    questionsPerSession: number;
    locale: UserLocale;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateUserInput {
    firstName?: string;
    lastName?: string;
    questionsPerSession?: number;
    locale?: UserLocale;
}

export async function upsertUserByFirebaseId(input: UpsertUserInput): Promise<DbUser> {
    const { firebaseId, email, firstName, lastName } = input;
    const created = await prisma.user.upsert({
        where: { firebaseId },
        update: { email, firstName, lastName },
        create: { firebaseId, email, firstName, lastName }
    });
    return mapToDbUser(created);
}

export async function getUserByFirebaseId(firebaseId: string): Promise<DbUser | null> {
    const found = await prisma.user.findUnique({ where: { firebaseId } });
    if (!found) return null;
    return mapToDbUser(found);
}

export async function updateUserLocale(firebaseId: string, locale: UserLocale): Promise<DbUser> {
    const updated = await prisma.user.update({
        where: { firebaseId },
        data: { locale }
    });
    return mapToDbUser(updated);
}

export async function updateUser(firebaseId: string, updates: UpdateUserInput): Promise<DbUser> {
    const data: { firstName?: string; lastName?: string; questionsPerSession?: number; locale?: UserLocale } = {};
    if (typeof updates.firstName === 'string') data.firstName = updates.firstName;
    if (typeof updates.lastName === 'string') data.lastName = updates.lastName;
    if (typeof updates.questionsPerSession === 'number' && updates.questionsPerSession >= 1 && updates.questionsPerSession <= 50) {
        data.questionsPerSession = updates.questionsPerSession;
    }
    if (updates.locale === 'uk' || updates.locale === 'en') data.locale = updates.locale;
    const updated = await prisma.user.update({ where: { firebaseId }, data });
    return mapToDbUser(updated);
}

const mapToDbUser = (u: unknown): DbUser => {
    const base = u as {
        id: string;
        firebaseId: string;
        email: string;
        firstName: string;
        lastName: string;
        questionsPerSession: number;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    } & Record<string, unknown>;
    const rawLocale = base['locale'];
    const locale: UserLocale = rawLocale === 'en' ? 'en' : 'uk';
    const rawRole = base['role'];
    const role: UserRole = rawRole === UserRole.Admin ? UserRole.Admin : UserRole.User;
    return {
        id: base.id,
        firebaseId: base.firebaseId,
        email: base.email,
        firstName: base.firstName,
        lastName: base.lastName,
        questionsPerSession: base.questionsPerSession,
        locale,
        role,
        createdAt: base.createdAt,
        updatedAt: base.updatedAt
    };
};
