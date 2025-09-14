'use client';

import { ArrowRight, BookOpen, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/AuthContext';

export default function Home(): React.ReactElement {
    const { user, loading } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Navigation */}
            <nav className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm fixed top-0 w-full z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Words Next</h1>
                        <div className="flex gap-4">
                            {loading ? (
                                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            ) : user ? (
                                <Button asChild>
                                    <Link href="/dashboard">
                                        Перейти до Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href="/login">Увійти</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/signup">Зареєструватися</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Вивчайте слова легко та ефективно
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Сучасна платформа для вивчення нових слів з використанням передових технологій та персоналізованого підходу до навчання
                    </p>
                    <div className="flex gap-4 justify-center">
                        {!user && (
                            <>
                                <Button size="lg" asChild>
                                    <Link href="/signup">
                                        Почати безкоштовно
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/login">Увійти в акаунт</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-12">Чому обирають Words Next?</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader>
                                <Zap className="h-10 w-10 text-blue-600 mb-4" />
                                <CardTitle>Швидке навчання</CardTitle>
                                <CardDescription>Використовуйте сучасні методики для швидкого запам&apos;ятовування</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Наші алгоритми адаптуються під ваш темп навчання та допомагають засвоювати матеріал максимально ефективно
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <BookOpen className="h-10 w-10 text-green-600 mb-4" />
                                <CardTitle>Великий словник</CardTitle>
                                <CardDescription>Тисячі слів з детальними поясненнями та прикладами</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300">
                                    База постійно оновлюється новими словами та виразами, щоб ви завжди мали актуальний матеріал
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Shield className="h-10 w-10 text-purple-600 mb-4" />
                                <CardTitle>Безпека даних</CardTitle>
                                <CardDescription>Ваші дані захищені сучасними технологіями шифрування</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Ми використовуємо Firebase Authentication для забезпечення максимального захисту вашого акаунту
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gray-100 dark:bg-gray-800">
                <div className="container mx-auto text-center">
                    <h3 className="text-3xl font-bold mb-4">Готові почати навчання?</h3>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Приєднуйтесь до тисяч користувачів, які вже покращують свій словниковий запас</p>
                    {!user && (
                        <Button size="lg" asChild>
                            <Link href="/signup">
                                Створити безкоштовний акаунт
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t">
                <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2025 Words Next. Всі права захищені.</p>
                </div>
            </footer>
        </div>
    );
}
