'use client';

import React from 'react';

import { Prose } from '@/components/prose/Prose';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/hooks/useI18n';

interface TheoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    theory: string;
    questionText: string;
}

export default function TheoryModal({ isOpen, onClose, theory, questionText }: TheoryModalProps): React.ReactElement {
    const t = useI18n();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[90vw] h-[90vh] max-w-none flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{t('books.questionTheory')}</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-2">{questionText}</p>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto max-w-none p-4">
                    <Prose isMD>{theory}</Prose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
