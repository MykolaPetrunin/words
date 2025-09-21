import type { PrismaClient } from '@prisma/client';

jest.mock('@/lib/prisma', () => {
    const user = {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn()
    };
    const prisma: Partial<PrismaClient> = { user } as unknown as PrismaClient;
    return prisma;
});

import prisma from '@/lib/prisma';

import { getUserByFirebaseId, updateUser, updateUserLocale, upsertUserByFirebaseId } from '../userRepository';

describe('userRepository.upsertUserByFirebaseId', () => {
    it('calls prisma.user.upsert with correct params and returns user', async () => {
        const input = {
            firebaseId: 'fid-1',
            email: 'u@example.com',
            firstName: 'John',
            lastName: 'Doe'
        };

        (prisma.user.upsert as jest.Mock).mockResolvedValue({ id: '1', ...input, locale: 'uk', createdAt: new Date(), updatedAt: new Date() });

        const result = await upsertUserByFirebaseId(input);

        expect(prisma.user.upsert).toHaveBeenCalledWith({
            where: { firebaseId: 'fid-1' },
            update: { email: 'u@example.com', firstName: 'John', lastName: 'Doe' },
            create: { firebaseId: 'fid-1', email: 'u@example.com', firstName: 'John', lastName: 'Doe' }
        });
        expect(result.firebaseId).toBe('fid-1');
        expect(result.locale).toBe('uk');
    });
});

describe('userRepository.getUserByFirebaseId', () => {
    it('returns null when not found', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        const res = await getUserByFirebaseId('x');
        expect(res).toBeNull();
    });

    it('returns mapped user when found', async () => {
        const raw = { id: '1', firebaseId: 'f', email: 'e', firstName: 'a', lastName: 'b', locale: 'en', createdAt: new Date(), updatedAt: new Date() };
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(raw);
        const res = await getUserByFirebaseId('f');
        expect(res?.id).toBe('1');
        expect(res?.locale).toBe('en');
    });
});

describe('userRepository.updateUserLocale', () => {
    it('updates locale and returns mapped user', async () => {
        const raw = { id: '1', firebaseId: 'f', email: 'e', firstName: 'a', lastName: 'b', locale: 'en', createdAt: new Date(), updatedAt: new Date() };
        (prisma.user.update as jest.Mock).mockResolvedValue(raw);
        const res = await updateUserLocale('f', 'en');
        expect(prisma.user.update).toHaveBeenCalledWith({ where: { firebaseId: 'f' }, data: { locale: 'en' } });
        expect(res.locale).toBe('en');
    });
});

describe('userRepository.updateUser', () => {
    it('updates names only when locale is invalid', async () => {
        const raw = { id: '1', firebaseId: 'f', email: 'e', firstName: 'x', lastName: 'y', locale: 'uk', createdAt: new Date(), updatedAt: new Date() };
        (prisma.user.update as jest.Mock).mockResolvedValue(raw);
        const res = await updateUser('f', { firstName: 'x', lastName: 'y', locale: 'xx' as any });
        expect(prisma.user.update).toHaveBeenCalledWith({ where: { firebaseId: 'f' }, data: { firstName: 'x', lastName: 'y' } });
        expect(res.locale).toBe('uk');
    });

    it('updates with locale when valid', async () => {
        const raw = { id: '1', firebaseId: 'f', email: 'e', firstName: 'x', lastName: 'y', locale: 'en', createdAt: new Date(), updatedAt: new Date() };
        (prisma.user.update as jest.Mock).mockResolvedValue(raw);
        const res = await updateUser('f', { locale: 'en' });
        expect(prisma.user.update).toHaveBeenCalledWith({ where: { firebaseId: 'f' }, data: { locale: 'en' } });
        expect(res.locale).toBe('en');
    });
});
