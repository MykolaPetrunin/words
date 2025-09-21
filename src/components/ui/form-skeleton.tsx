import React from 'react';

import { Skeleton } from './skeleton';

interface FormFieldSkeletonProps {
    labelWidth?: string;
    className?: string;
}

export const FormFieldSkeleton: React.FC<FormFieldSkeletonProps> = ({ labelWidth = 'w-16', className = '' }) => {
    return (
        <div className={`space-y-2 ${className}`}>
            <Skeleton className={`h-4 ${labelWidth}`} />
            <Skeleton className="h-9 w-full" />
        </div>
    );
};

interface FormSkeletonProps {
    fields?: number;
    showSubmitButton?: boolean;
    className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({ fields = 3, showSubmitButton = true, className = '' }) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: fields }).map((_, index) => (
                <FormFieldSkeleton key={index} />
            ))}
            {showSubmitButton && <Skeleton className="h-9 w-full" />}
        </div>
    );
};

interface CardSkeletonProps {
    showHeader?: boolean;
    showContent?: boolean;
    contentLines?: number;
    className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ showHeader = true, showContent = true, contentLines = 3, className = '' }) => {
    return (
        <div className={`border rounded-lg p-6 ${className}`}>
            {showHeader && (
                <div className="mb-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
            )}
            {showContent && (
                <div className="space-y-2">
                    {Array.from({ length: contentLines }).map((_, index) => (
                        <Skeleton key={index} className={`h-4 ${index === contentLines - 1 ? 'w-3/4' : 'w-full'}`} />
                    ))}
                </div>
            )}
        </div>
    );
};
