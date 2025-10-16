'use client';

import { BookOpenIcon } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

import type { BookTileProps } from '../types';

export default function BookTile({ id, title, isLearning, coverUrl }: BookTileProps): React.ReactElement {
    return (
        <Link href={`/books/${id}`}>
            <div className={cn('relative aspect-[2/3] overflow-hidden rounded-lg cursor-pointer group border bg-muted transition hover:border-primary')}>
                {coverUrl ? (
                    <NextImage
                        src={coverUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 50vw, 16vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-muted/50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

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
