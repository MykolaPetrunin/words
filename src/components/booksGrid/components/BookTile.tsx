'use client';

import React from 'react';

import type { BookTileProps } from '../types';

export default function BookTile({ title }: BookTileProps): React.ReactElement {
    return (
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted/40 hover:bg-muted transition-colors cursor-pointer group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium truncate">{title}</div>
        </div>
    );
}
