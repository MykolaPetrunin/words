'use client';

import { BookOpenIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

import type { BookTileProps } from '../types';

export default function BookTile({ id, title, isLearning }: BookTileProps): React.ReactElement {
    return (
        <Link href={`/books/${id}`}>
            <div className={cn('relative aspect-[2/3] rounded-lg overflow-hidden bg-muted/40 hover:bg-muted transition-colors cursor-pointer group')}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium truncate">{title}</div>
                {isLearning && (
                    <div className="absolute top-2 right-2">
                        <BookOpenIcon className="h-5 w-5 text-green-500" />
                    </div>
                )}
            </div>
        </Link>
    );
}
