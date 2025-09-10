'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetObjectsQuery } from '@/lib/redux/api/objectsApi';
import type { ApiObject } from '@/lib/types/objects';

function ObjectItem({ item }: { item: ApiObject }): React.JSX.Element {
    return (
        <Card className="transition-colors">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">{item.name}</CardTitle>
                <CardDescription>ID: {item.id}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{JSON.stringify(item.data, null, 2)}</pre>
            </CardContent>
        </Card>
    );
}

export default function ObjectsPage(): React.JSX.Element {
    const { data: items = [], isFetching, error, refetch } = useGetObjectsQuery();

    const handleLoad: React.MouseEventHandler<HTMLButtonElement> = () => {
        void refetch();
    };

    const errorMessage = React.useMemo(() => {
        if (!error) return null as string | null;
        const err = error as { error?: unknown; status?: unknown };
        if (typeof err.error === 'string') return err.error;
        if (typeof err.status === 'string' || typeof err.status === 'number') return String(err.status);
        return 'Unknown error';
    }, [error]);

    return (
        <div className="mx-auto w-full max-w-7xl px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Objects</h1>
                <Button onClick={handleLoad} disabled={isFetching} variant="outline" size="sm">
                    {isFetching ? 'Завантаження…' : 'Оновити'}
                </Button>
            </div>

            {errorMessage && <div className="mb-4 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive-foreground">{errorMessage}</div>}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <ObjectItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}
