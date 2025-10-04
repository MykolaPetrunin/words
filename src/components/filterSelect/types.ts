export interface FilterSelectOption {
    value: string;
    label: string;
}

export interface FilterSelectProps {
    label: string;
    placeholder: string;
    value?: string;
    options: readonly FilterSelectOption[];
    disabled?: boolean;
    searchPlaceholder: string;
    noResultsLabel: string;
    clearLabel: string;
    onSelect: (value: string) => void;
    onClear: () => void;
}
