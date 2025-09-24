import type { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => {
    const subject = {
        findMany: jest.fn()
    };
    const prisma: Partial<PrismaClient> = { subject } as unknown as PrismaClient;
    return prisma;
});

import { getAllActiveSubjects } from '../subjectRepository';

describe('subjectRepository.getAllActiveSubjects', () => {
    it('queries only active subjects ordered by createdAt asc and maps result', async () => {
        (prisma.subject.findMany as jest.Mock).mockResolvedValue([
            {
                id: 's1',
                nameUk: 'Укр',
                nameEn: 'Eng',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02')
            }
        ]);

        const res = await getAllActiveSubjects();

        expect(prisma.subject.findMany).toHaveBeenCalledWith({ where: { isActive: true }, orderBy: { createdAt: 'asc' } });
        expect(res).toHaveLength(1);
        expect(res[0].id).toBe('s1');
        expect(res[0].nameUk).toBe('Укр');
    });
});
