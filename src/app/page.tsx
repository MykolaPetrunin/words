'use client';

import { Code2, Layers, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import ThemeToggle from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { decrement, increment, reset } from '@/lib/redux/slices/counterSlice';

import { useAppDispatch, useAppSelector } from '../lib/redux/ReduxProvider';

interface FeatureItem {
    id: 'ts' | 'eslint' | 'prettier' | 'next' | 'redux';
    title: string;
    description: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

function FeatureCard({ feature }: { feature: FeatureItem }): React.JSX.Element {
    const { Icon } = feature;
    return (
        <Card className="transition-colors">
            <CardHeader className="pb-3">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Icon />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <CardDescription>{feature.description}</CardDescription>
            </CardContent>
        </Card>
    );
}

export default function Home(): React.JSX.Element {
    const count = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();

    const handleDecrement: React.MouseEventHandler<HTMLButtonElement> = () => {
        dispatch(decrement());
    };

    const handleReset: React.MouseEventHandler<HTMLButtonElement> = () => {
        dispatch(reset());
    };

    const handleIncrement: React.MouseEventHandler<HTMLButtonElement> = () => {
        dispatch(increment());
    };

    const features: FeatureItem[] = [
        { id: 'ts', title: 'TypeScript', description: 'Строга типізація для надійного коду', Icon: Code2 },
        { id: 'eslint', title: 'ESLint', description: 'Автоматична перевірка якості коду', Icon: ShieldCheck },
        { id: 'prettier', title: 'Prettier', description: 'Консистентне форматування коду', Icon: Sparkles },
        { id: 'next', title: 'Next.js 15', description: 'Актуальний стек та архітектура', Icon: Rocket },
        { id: 'redux', title: 'Redux Toolkit', description: 'Сучасне управління станом', Icon: Layers }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
                <div className="text-lg font-semibold tracking-tight">Next.js TS Starter</div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <a href="#features">Можливості</a>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/objects">Об&apos;єкти</Link>
                    </Button>
                    <ThemeToggle />
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-6 md:pt-10">
                <section className="mb-10 text-center">
                    <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-6xl">Ласкаво просимо до Next.js</h1>
                    <p className="mx-auto mb-6 max-w-2xl text-muted-foreground md:text-lg">Сучасний старт із TypeScript, ESLint, Prettier та Redux Toolkit</p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button asChild size="lg">
                            <a href="#counter">Спробувати лічильник</a>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <a href="#features">Переглянути можливості</a>
                        </Button>
                    </div>
                </section>

                <section id="counter" className="mb-16">
                    <Card className="mx-auto max-w-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl">Redux Counter</CardTitle>
                            <CardDescription>Класичний приклад керування станом</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div aria-live="polite" className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-md bg-muted text-4xl font-bold">
                                {count}
                            </div>
                            <div className="flex justify-center gap-3">
                                <Button onClick={handleDecrement} variant="destructive" size="lg">
                                    -1
                                </Button>
                                <Button onClick={handleReset} variant="secondary" size="lg">
                                    Скинути
                                </Button>
                                <Button onClick={handleIncrement} size="lg">
                                    +1
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section id="features">
                    <div className="mb-6 text-center">
                        <h2 className="text-3xl font-semibold md:text-4xl">Можливості</h2>
                        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Оптимізований стек інструментів для швидкого старту та масштабування</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <FeatureCard key={feature.id} feature={feature} />
                        ))}
                    </div>
                </section>
            </main>

            <footer className="mx-auto w-full max-w-7xl px-6 pb-8 pt-10 text-center text-sm text-muted-foreground">
                Готово до роботи з TypeScript, ESLint, Prettier, Redux Toolkit
            </footer>
        </div>
    );
}
