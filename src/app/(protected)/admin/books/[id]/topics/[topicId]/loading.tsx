'use client';

import React from 'react';

import QuestionsSkeleton from '../../../../components/QuestionsSkeleton';

export default function Loading(): React.ReactElement {
    return <QuestionsSkeleton count={4} />;
}
