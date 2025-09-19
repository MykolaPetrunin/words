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
import { appPaths } from '@/lib/appPaths';
import { useAuth } from '@/lib/auth/AuthContext';

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
            toast.success('Реєстрація успішна!');
        } catch (error) {
            toast.error('Помилка реєстрації. Можливо, цей email вже використовується.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Реєстрація</CardTitle>
                <CardDescription>Створіть новий акаунт для доступу до системи</CardDescription>
            </CardHeader>
            <CardContent>
                <GoogleSignInButton disabled={isLoading} />
                <div className="my-4 flex items-center">
                    <Separator className="flex-1" />
                    <span className="px-2 text-sm text-muted-foreground">або</span>
                    <Separator className="flex-1" />
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Електронна пошта</FormLabel>
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
                                    <FormLabel>Пароль</FormLabel>
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
                                    <FormLabel>Підтвердження пароля</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Вже маєте акаунт?{' '}
                    <Link href={appPaths.login} className="text-primary hover:underline">
                        Увійти
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
