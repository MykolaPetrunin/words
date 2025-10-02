import { ArrowRight, BookOpen, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';
import { useAuth } from '@/lib/auth/AuthContext';

export const Dashboard = () => {
    const { user, loading } = useAuth();
    const t = useI18n();

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
                                    <Link href={appPaths.dashboard}>
                                        {t('home.goToDashboard')}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href={appPaths.login}>{t('home.login')}</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={appPaths.signup}>{t('home.signup')}</Link>
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
                    <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('home.heroTitle')}</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">{t('home.heroSubtitle')}</p>
                    <div className="flex gap-4 justify-center">
                        {!user && (
                            <>
                                <Button size="lg" asChild>
                                    <Link href={appPaths.signup}>
                                        {t('home.ctaStartFree')}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href={appPaths.login}>{t('home.ctaLogin')}</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-12">{t('home.whyTitle')}</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader>
                                <Zap className="h-10 w-10 text-blue-600 mb-4" />
                                <CardTitle>{t('home.featureFast')}</CardTitle>
                                <CardDescription>Використовуйте сучасні методики для швидкого запам&apos;ятовування</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300">{t('home.featureFastDesc')}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <BookOpen className="h-10 w-10 text-green-600 mb-4" />
                                <CardTitle>{t('home.featureDict')}</CardTitle>
                                <CardDescription>Тисячі слів з детальними поясненнями та прикладами</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300">{t('home.featureDictDesc')}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Shield className="h-10 w-10 text-purple-600 mb-4" />
                                <CardTitle>{t('home.featureSecure')}</CardTitle>
                                <CardDescription>Ваші дані захищені сучасними технологіями шифрування</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300">{t('home.featureSecureDesc')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gray-100 dark:bg-gray-800">
                <div className="container mx-auto text-center">
                    <h3 className="text-3xl font-bold mb-4">{t('home.readyTitle')}</h3>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('home.readyDesc')}</p>
                    {!user && (
                        <Button size="lg" asChild>
                            <Link href={appPaths.signup}>
                                {t('home.createFree')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t">
                <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2025 Words Next. {t('home.footerRights')}</p>
                </div>
            </footer>
        </div>
    );
};
