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
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {books.map((book) => (
                            <div key={book.id} className="flex-shrink-0">
                                <BookTile id={book.id} title={locale === 'uk' ? book.titleUk : book.titleEn} isLearning={book.isLearning} coverUrl={book.coverUrl} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
