'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/hooks/useI18n';
import { useAppDispatch } from '@/lib/redux/ReduxProvider';
import { useUpdateMeMutation } from '@/lib/redux/api/userApi';
import { setUser } from '@/lib/redux/slices/currentUserSlice';

const accountFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    questionsPerSession: z.number().int().min(1).max(50),
    locale: z.enum(['uk', 'en'])
});

type AccountFormData = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
    initialData: AccountFormData;
    email: string;
}

export default function AccountForm({ initialData, email }: AccountFormProps): React.ReactElement {
    const t = useI18n();
    const dispatch = useAppDispatch();
    const [updateMe, { isLoading }] = useUpdateMeMutation();
    const [currentInitialData, setCurrentInitialData] = useState<AccountFormData>(initialData);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty }
    } = useForm<AccountFormData>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: currentInitialData
    });

    const handleCancel = (): void => {
        reset(currentInitialData);
    };

    const onSubmit = async (data: AccountFormData): Promise<void> => {
        try {
            const newUser = await updateMe(data).unwrap();

            dispatch(setUser(newUser));

            setCurrentInitialData(data);
            reset(data);
            toast.success(t('account.saveSuccess'));
        } catch {
            toast.error(t('account.saveError'));
        }
    };

    return (
        <div className="mx-auto w-full max-w-3xl p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold">{t('account.title')}</h1>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>{t('account.email')}</Label>
                            <div className="h-9 rounded-md border px-3 py-1 text-sm leading-8 text-muted-foreground">{email}</div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t('account.firstName')}</Label>
                            <Input id="firstName" {...register('firstName')} className={errors.firstName ? 'border-red-500' : ''} />
                            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">{t('account.lastName')}</Label>
                            <Input id="lastName" {...register('lastName')} className={errors.lastName ? 'border-red-500' : ''} />
                            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="questionsPerSession">{t('account.questionsPerSession')}</Label>
                            <Input
                                id="questionsPerSession"
                                type="number"
                                min="1"
                                max="50"
                                {...register('questionsPerSession', { valueAsNumber: true })}
                                className={errors.questionsPerSession ? 'border-red-500' : ''}
                            />
                            <p className="text-sm text-muted-foreground">{t('account.questionsPerSessionHelper')}</p>
                            {errors.questionsPerSession && <p className="text-sm text-red-500">{errors.questionsPerSession.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="locale">{t('account.interfaceLanguage')}</Label>
                            <select id="locale" {...register('locale')} className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm">
                                <option value="uk">Українська</option>
                                <option value="en">English</option>
                            </select>
                            {errors.locale && <p className="text-sm text-red-500">{errors.locale.message}</p>}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={!isDirty || isLoading}>
                            {t('common.save')}
                        </Button>
                        <Button type="button" variant="outline" disabled={!isDirty || isLoading} onClick={handleCancel}>
                            {t('common.cancel')}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
