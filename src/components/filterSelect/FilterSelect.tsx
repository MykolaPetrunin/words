'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import type { ChangeEvent } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import type { FilterSelectOption, FilterSelectProps } from './types';

const filterOptions = (options: readonly FilterSelectOption[], search: string): FilterSelectOption[] => {
    const normalizedSearch = search.trim().toLowerCase();
    if (normalizedSearch.length === 0) {
        return [...options];
    }
    return options.filter((option) => option.label.toLowerCase().includes(normalizedSearch));
};

export default function FilterSelect({
    label,
    placeholder,
    value,
    options,
    disabled,
    searchPlaceholder,
    noResultsLabel,
    clearLabel,
    onSelect,
    onClear
}: FilterSelectProps): React.ReactElement {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selectedOption = useMemo(() => options.find((option) => option.value === value) ?? null, [options, value]);

    const filteredOptions = useMemo(() => filterOptions(options, search), [options, search]);

    const handleOpenChange = useCallback((nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            setSearch('');
        }
    }, []);

    const handleSelect = useCallback(
        (nextValue: string) => {
            onSelect(nextValue);
            setOpen(false);
            setSearch('');
        },
        [onSelect]
    );

    const handleClear = useCallback(() => {
        onClear();
        setOpen(false);
        setSearch('');
    }, [onClear]);

    const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }, []);

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" disabled={disabled} className="flex w-full items-center justify-between">
                    <span className={selectedOption ? 'truncate' : 'text-muted-foreground truncate'}>{selectedOption?.label ?? placeholder}</span>
                    <ChevronsUpDown className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={4} className="w-[280px] p-0" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
                <div className="border-b px-3 py-2 text-sm font-medium">{label}</div>
                <div className="px-3 py-2">
                    <Input value={search} onChange={handleSearchChange} placeholder={searchPlaceholder} />
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                    {filteredOptions.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-muted-foreground">{noResultsLabel}</p>
                    ) : (
                        filteredOptions.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onSelect={(event) => {
                                    event.preventDefault();
                                    handleSelect(option.value);
                                }}
                                className="gap-2"
                            >
                                <Check className={option.value === value ? 'size-4 opacity-100' : 'size-4 opacity-0'} />
                                <span className="truncate">{option.label}</span>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                {value && (
                    <div className="border-t px-1 py-1">
                        <Button type="button" variant="ghost" className="w-full justify-start" onClick={handleClear}>
                            {clearLabel}
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
