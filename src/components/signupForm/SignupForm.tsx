'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';
import { useAuth } from '@/lib/auth/AuthContext';
import { clientLogger } from '@/lib/logger';

import { GoogleSignInButton } from './components/GoogleSignInButton';

const formSchema = z
    .object({
        email: z.string().email('Невірна електронна адреса'),
        password: z.string().min(6, 'Пароль має містити мінімум 6 символів'),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Паролі не співпадають',
        path: ['confirmPassword']
    });

type FormData = z.infer<typeof formSchema>;

export const SignupForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { signUp } = useAuth();
    const t = useI18n();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: FormData): Promise<void> => {
        setIsLoading(true);
        try {
            await signUp(data.email, data.password);
            toast.success(t('auth.signupSuccess'));
        } catch (error) {
            toast.error(t('auth.signupError'));
            clientLogger.error('Signup form submission failed', error as Error, { email: data.email });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{t('auth.signupTitle')}</CardTitle>
                <CardDescription>{t('auth.signupSubtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
                <GoogleSignInButton disabled={isLoading} />
                <div className="my-4 flex items-center">
                    <Separator className="flex-1" />
                    <span className="px-2 text-sm text-muted-foreground">{t('auth.or')}</span>
                    <Separator className="flex-1" />
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('auth.email')}</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="your@email.com" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('auth.password')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? t('auth.submittingSignup') : t('auth.submitSignup')}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    {t('auth.haveAccount')}{' '}
                    <Link href={appPaths.login} className="text-primary hover:underline">
                        {t('auth.loginCta')}
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
