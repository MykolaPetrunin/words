'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
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

const formSchema = z.object({
    email: z.string().email('Невірна електронна адреса'),
    password: z.string().min(6, 'Пароль має містити мінімум 6 символів')
});

type FormData = z.infer<typeof formSchema>;

export const LoginForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { signIn, user, loading: authLoading } = useAuth();
    const t = useI18n();
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        if (!authLoading && user) {
            router.replace(appPaths.dashboard);
        }
    }, [authLoading, router, user]);

    const onSubmit = async (data: FormData): Promise<void> => {
        setIsLoading(true);
        try {
            await signIn(data.email, data.password);
            toast.success(t('auth.loginSuccess'));
        } catch (error) {
            toast.error(t('auth.loginError'));
            clientLogger.error('Login form submission failed', error as Error, { email: data.email });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{t('auth.loginTitle')}</CardTitle>
                <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
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
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? t('auth.submittingLogin') : t('auth.submitLogin')}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    {t('auth.noAccount')}{' '}
                    <Link href={appPaths.signup} className="text-primary hover:underline">
                        {t('auth.signupCta')}
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
