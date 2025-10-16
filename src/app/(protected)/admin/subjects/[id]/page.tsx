import React from 'react';
import { notFound } from 'next/navigation';

import { getSubjectByIdForAdmin } from '@/lib/repositories/subjectRepository';

import SubjectDetailPageClient from './SubjectDetailPageClient';

type AdminSubjectDetailParams = { id: string };

export default async function AdminSubjectDetailPage({ params }: { params: Promise<AdminSubjectDetailParams> }): Promise<React.ReactElement> {
    const { id } = await params;
    const subject = await getSubjectByIdForAdmin(id);

    if (!subject) {
        notFound();
    }

    return <SubjectDetailPageClient subject={subject} />;
}
