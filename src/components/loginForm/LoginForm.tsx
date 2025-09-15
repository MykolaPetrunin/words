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
import { useAuth } from '@/lib/auth/AuthContext';

import { GoogleSignInButton } from './components/GoogleSignInButton';

const formSchema = z.object({
    email: z.string().email('Невірна електронна адреса'),
    password: z.string().min(6, 'Пароль має містити мінімум 6 символів')
});

type FormData = z.infer<typeof formSchema>;

export const LoginForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { signIn } = useAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: FormData): Promise<void> => {
        setIsLoading(true);
        try {
            await signIn(data.email, data.password);
            toast.success('Ви успішно увійшли!');
        } catch (error) {
            toast.error('Помилка входу. Перевірте дані та спробуйте ще раз.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Вхід</CardTitle>
                <CardDescription>Введіть свої дані для входу в систему</CardDescription>
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
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Вхід...' : 'Увійти'}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Немає акаунту?{' '}
                    <Link href="/signup" className="text-primary hover:underline">
                        Зареєструватися
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
