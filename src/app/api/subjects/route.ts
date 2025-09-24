import { NextResponse } from 'next/server';

import { serverLogger } from '@/lib/logger';
import { getAllActiveSubjects } from '@/lib/repositories/subjectRepository';

export async function GET(): Promise<NextResponse> {
    try {
        const subjects = await getAllActiveSubjects();
        return NextResponse.json(
            subjects.map((s) => ({
                id: s.id,
                nameUk: s.nameUk,
                nameEn: s.nameEn,
                descriptionUk: s.descriptionUk,
                descriptionEn: s.descriptionEn,
                isActive: s.isActive,
                createdAt: s.createdAt.toISOString(),
                updatedAt: s.updatedAt.toISOString()
            }))
        );
    } catch (error) {
        serverLogger.error('Subjects fetch failed', error as Error, { endpoint: '/api/subjects' });
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
