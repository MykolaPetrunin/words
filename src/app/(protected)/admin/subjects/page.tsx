import React from 'react';

import { getAllSubjects } from '@/lib/repositories/subjectRepository';

import SubjectsPageClient from './SubjectsPageClient';

export default async function AdminSubjectsPage(): Promise<React.ReactElement> {
    const subjects = await getAllSubjects();
    return <SubjectsPageClient initialSubjects={subjects} />;
}
