'use client';

import { ArrowRight, BarChart3, BookOpenCheck, Compass, RefreshCw, Target } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';
import { useAuth } from '@/lib/auth/AuthContext';

export const Dashboard = () => {
    const { user, loading } = useAuth();
    const t = useI18n();

    const features = useMemo(
        () => [
            {
                icon: RefreshCw,
                title: t('home.featureRepeatTitle'),
                description: t('home.featureRepeatDescription')
            },
            {
                icon: BookOpenCheck,
                title: t('home.featureStructureTitle'),
                description: t('home.featureStructureDescription')
            },
            {
                icon: BarChart3,
                title: t('home.featureProgressTitle'),
                description: t('home.featureProgressDescription')
            }
        ],
        [t]
    );

    const steps = useMemo(
        () => [
            {
                icon: Compass,
                title: t('home.workflowStepOneTitle'),
                description: t('home.workflowStepOneDescription')
            },
            {
                icon: BookOpenCheck,
                title: t('home.workflowStepTwoTitle'),
                description: t('home.workflowStepTwoDescription')
            },
            {
                icon: RefreshCw,
                title: t('home.workflowStepThreeTitle'),
                description: t('home.workflowStepThreeDescription')
            },
            {
                icon: Target,
                title: t('home.workflowStepFourTitle'),
                description: t('home.workflowStepFourDescription')
            }
        ],
        [t]
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">T</div>
                        <span className="text-lg font-semibold">{t('home.brand')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {loading ? (
                            <div className="h-9 w-24 animate-pulse rounded bg-muted" />
                        ) : user ? (
                            <Button asChild size="sm">
                                <Link href={appPaths.dashboard}>
                                    {t('home.goToDashboard')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={appPaths.login}>{t('home.login')}</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href={appPaths.signup}>{t('home.signup')}</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>
                <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.2fr_1fr] md:items-center">
                    <div className="space-y-6">
                        <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase text-muted-foreground">
                            {t('home.tagline')}
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('home.heroTitle')}</h1>
                        <p className="text-lg text-muted-foreground">{t('home.heroSubtitle')}</p>
                        <div className="flex flex-wrap gap-3">
                            {user ? (
                                <Button size="lg" asChild>
                                    <Link href={appPaths.dashboard}>
                                        {t('home.goToDashboard')}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button size="lg" asChild>
                                        <Link href={appPaths.signup}>
                                            {t('home.heroPrimaryCta')}
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild>
                                        <Link href={appPaths.login}>{t('home.heroSecondaryCta')}</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle>{t('home.featuresTitle')}</CardTitle>
                            <CardDescription>{t('home.featuresDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {features.map((feature) => (
                                <div key={feature.title} className="flex items-start gap-4">
                                    <feature.icon className="mt-1 h-6 w-6 text-primary" />
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-semibold">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section className="border-y bg-muted/20">
                    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-16">
                        <div className="space-y-3 text-center">
                            <h2 className="text-3xl font-semibold">{t('home.workflowTitle')}</h2>
                            <p className="mx-auto max-w-2xl text-muted-foreground">{t('home.workflowDescription')}</p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {steps.map((step) => (
                                <Card key={step.title} className="h-full">
                                    <CardHeader className="flex flex-row items-start gap-4 pb-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <step.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{step.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-3xl space-y-6 px-4 py-16 text-center">
                    <h2 className="text-3xl font-semibold">{t('home.ctaTitle')}</h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground">{t('home.ctaSubtitle')}</p>
                    {user ? (
                        <Button size="lg" asChild>
                            <Link href={appPaths.dashboard}>
                                {t('home.goToDashboard')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    ) : (
                        <Button size="lg" asChild>
                            <Link href={appPaths.signup}>
                                {t('home.ctaPrimary')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    )}
                </section>
            </main>
            <footer className="border-t py-8">
                <div className="mx-auto w-full max-w-6xl px-4 text-center text-sm text-muted-foreground">{t('home.footerRights')}</div>
            </footer>
        </div>
    );
};
