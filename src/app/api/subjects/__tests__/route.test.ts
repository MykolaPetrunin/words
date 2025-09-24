import { GET } from '../route';

const createMockNextResponse = (data: unknown, init?: { status?: number }) => {
    const json = async () => data;
    const status = init?.status || 200;
    return { json, status } as unknown as Response;
};

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data: unknown, init?: { status?: number }) => createMockNextResponse(data, init))
    }
}));
jest.mock('@/lib/repositories/subjectRepository', () => ({
    getAllActiveSubjects: jest.fn(() =>
        Promise.resolve([
            {
                id: '1',
                nameUk: 'Математика',
                nameEn: 'Math',
                descriptionUk: null,
                descriptionEn: null,
                isActive: true,
                createdAt: new Date('2024-01-01T00:00:00.000Z'),
                updatedAt: new Date('2024-01-02T00:00:00.000Z')
            }
        ])
    )
}));

describe('GET /api/subjects', () => {
    it('returns 200 with serialized subjects', async () => {
        const res = await GET();
        expect(res.status).toBe(200);
        const json = (await res.json()) as Array<{ id: string; nameUk: string; createdAt: string }>;
        expect(json[0].id).toBe('1');
        expect(json[0].nameUk).toBe('Математика');
        expect(json[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
    });
});
