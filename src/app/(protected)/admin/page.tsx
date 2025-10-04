import React from 'react';

import { getAllQuestions, getQuestionFiltersTree } from '@/lib/repositories/questionRepository';

import AdminPageClient from './AdminPageClient';

export default async function AdminPage(): Promise<React.ReactElement> {
    const [questions, filters] = await Promise.all([getAllQuestions(), getQuestionFiltersTree()]);
    return <AdminPageClient initialQuestions={questions} filters={filters} />;
}
