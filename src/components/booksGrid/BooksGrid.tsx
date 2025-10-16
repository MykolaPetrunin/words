'use client';

import React from 'react';

import type { BooksGridProps } from '@/components/booksGrid/types';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { UserLocale } from '@/lib/types/user';

import BookTile from './components/BookTile';

export default function BooksGrid({ books, subject }: BooksGridProps): React.ReactElement {
    const user = useAppSelector((s) => s.currentUser.user);
    const locale: UserLocale = user?.locale === 'en' ? 'en' : 'uk';

    const subjectName = locale === 'uk' ? subject.nameUk : subject.nameEn;

    return (
        <div className="p-6">
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold mb-3">{subjectName}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {books.map((book) => (
                            <BookTile
                                key={book.id}
                                id={book.id}
                                title={locale === 'uk' ? book.titleUk : book.titleEn}
                                isLearning={book.isLearning}
                                coverUrl={book.coverUrl}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
