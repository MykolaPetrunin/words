import React from 'react';

import SubjectsGrid from '@/components/subjectsGrid/SubjectsGrid';
import { getAllActiveSubjects } from '@/lib/repositories/subjectRepository';

export default async function DashboardPage(): Promise<React.ReactElement> {
    const subjects = await getAllActiveSubjects();
    return <SubjectsGrid subjects={subjects} />;
}
