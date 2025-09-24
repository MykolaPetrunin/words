import type { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => {
    const subject = {
        findMany: jest.fn(),
        findFirst: jest.fn()
    };
    const prisma: Partial<PrismaClient> = { subject } as unknown as PrismaClient;
    return prisma;
});

import { getAllActiveSubjects, getSubjectById } from '../subjectRepository';

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

    it('getSubjectById returns subject when found', async () => {
        const mockSubject = {
            id: 'subject-1',
            nameUk: 'Тест',
            nameEn: 'Test',
            descriptionUk: 'Опис',
            descriptionEn: 'Description',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        (prisma.subject.findFirst as jest.Mock).mockResolvedValue(mockSubject);

        const result = await getSubjectById('subject-1');

        expect(prisma.subject.findFirst).toHaveBeenCalledWith({
            where: {
                id: 'subject-1',
                isActive: true
            }
        });
        expect(result).toEqual(mockSubject);
    });

    it('getSubjectById returns null when not found', async () => {
        (prisma.subject.findFirst as jest.Mock).mockResolvedValue(null);

        const result = await getSubjectById('non-existent');

        expect(result).toBeNull();
    });
});
