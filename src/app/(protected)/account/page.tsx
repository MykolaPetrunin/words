'use client';

import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/hooks/useI18n';
import { useAuth } from '@/lib/auth/AuthContext';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import { useGetMeQuery, useUpdateMeMutation } from '@/lib/redux/api/userApi';

export default function AccountPage(): React.ReactElement | null {
    const { user } = useAuth();
    const t = useI18n();
    const reduxUser = useAppSelector((s) => s.currentUser.user);
    const { data: me } = useGetMeQuery(undefined, { skip: !user });
    const [updateMe, { isLoading }] = useUpdateMeMutation();

    const [firstName, setFirstName] = useState<string>(reduxUser?.firstName ?? me?.firstName ?? '');
    const [lastName, setLastName] = useState<string>(reduxUser?.lastName ?? me?.lastName ?? '');
    const [locale, setLocale] = useState<'uk' | 'en'>(reduxUser?.locale ?? me?.locale ?? 'uk');
    const [dirty, setDirty] = useState<boolean>(false);

    const _selectedLocale = useMemo(() => reduxUser?.locale ?? me?.locale ?? 'uk', [reduxUser, me]);

    if (!user) return null;

    const handleCancel = (): void => {
        setFirstName(reduxUser?.firstName ?? me?.firstName ?? '');
        setLastName(reduxUser?.lastName ?? me?.lastName ?? '');
        setLocale(reduxUser?.locale ?? me?.locale ?? 'uk');
        setDirty(false);
    };

    const handleSave = async (): Promise<void> => {
        await updateMe({ firstName, lastName, locale }).unwrap();
        setDirty(false);
    };

    return (
        <div className="mx-auto w-full max-w-3xl p-6">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">{t('account.title')}</h1>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label>{t('account.email')}</Label>
                        <div className="h-9 rounded-md border px-3 py-1 text-sm leading-8 text-muted-foreground">{reduxUser?.email ?? me?.email ?? ''}</div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t('account.firstName')}</Label>
                        <Input
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                                setDirty(true);
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{t('account.lastName')}</Label>
                        <Input
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                setDirty(true);
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{t('account.interfaceLanguage')}</Label>
                        <select
                            className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                            value={locale}
                            onChange={(e) => {
                                const v = e.target.value === 'en' ? 'en' : 'uk';
                                setLocale(v);
                                setDirty(true);
                            }}
                        >
                            <option value="uk">Українська</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button disabled={!dirty || isLoading} onClick={handleSave}>
                        {t('common.save')}
                    </Button>
                    <Button variant="outline" disabled={!dirty || isLoading} onClick={handleCancel}>
                        {t('common.cancel')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
