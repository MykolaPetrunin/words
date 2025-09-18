import type { PrismaClient } from '@prisma/client';

jest.mock('@/lib/prisma', () => {
    const user = {
        upsert: jest.fn()
    };
    const prisma: Partial<PrismaClient> = { user } as unknown as PrismaClient;
    return prisma;
});

import prisma from '@/lib/prisma';

import { upsertUserByFirebaseId } from '../userRepository';

describe('userRepository.upsertUserByFirebaseId', () => {
    it('calls prisma.user.upsert with correct params and returns user', async () => {
        const input = {
            firebaseId: 'fid-1',
            email: 'u@example.com',
            firstName: 'John',
            lastName: 'Doe'
        };

        (prisma.user.upsert as jest.Mock).mockResolvedValue({ id: '1', ...input, createdAt: new Date(), updatedAt: new Date() });

        const result = await upsertUserByFirebaseId(input);

        expect(prisma.user.upsert).toHaveBeenCalledWith({
            where: { firebaseId: 'fid-1' },
            update: { email: 'u@example.com', firstName: 'John', lastName: 'Doe' },
            create: { firebaseId: 'fid-1', email: 'u@example.com', firstName: 'John', lastName: 'Doe' }
        });
        expect(result.firebaseId).toBe('fid-1');
    });
});
