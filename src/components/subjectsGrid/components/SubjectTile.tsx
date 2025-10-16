'use client';

import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';

import { appPaths } from '@/lib/appPaths';

import type { SubjectTileProps } from '../types';

export default function SubjectTile({ id, name, coverUrl }: SubjectTileProps): React.ReactElement {
    return (
        <Link href={`${appPaths.subjects}/${id}`}>
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg group">
                {coverUrl ? (
                    <NextImage
                        src={coverUrl}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 50vw, 16vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-muted/40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium truncate">{name}</div>
            </div>
        </Link>
    );
}
