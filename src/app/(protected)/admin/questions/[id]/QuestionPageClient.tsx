'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/hooks/useI18n';
import { clientLogger } from '@/lib/logger';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { QuestionDetail, QuestionListTopic } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';

import { updateAdminQuestion } from '../../actions';

import { buildQuestionFormSchema, type QuestionFormData } from './schemas';

interface TopicMockAnswer {
    textUK: string;
    textEN: string;
    theoryUK: string;
    theoryEN: string;
    isCorrect: boolean;
}

interface TopicMockQuestion {
    textUK: string;
    textEN: string;
    theoryUK: string;
    theoryEN: string;
    level: TopicMockLevel;
    answers: TopicMockAnswer[];
}

interface TopicMock {
    titleUK: string;
    titleEN: string;
    questions: TopicMockQuestion[];
}

type TopicMockLevel = 'junior' | 'middle' | 'senior';

const topicMockLevels: readonly TopicMockLevel[] = ['junior', 'middle', 'senior'] as const;

const mapQuestionToFormData = (question: QuestionDetail): QuestionFormData => ({
    textUk: question.textUk,
    textEn: question.textEn,
    theoryUk: question.theoryUk ?? '',
    theoryEn: question.theoryEn ?? '',
    topicId: question.topicId ?? null,
    answers: question.answers
        .slice()
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((answer) => ({
            id: answer.id,
            textUk: answer.textUk,
            textEn: answer.textEn,
            theoryUk: answer.theoryUk ?? '',
            theoryEn: answer.theoryEn ?? '',
            isCorrect: answer.isCorrect
        }))
});

const normalizeLevel = (key: string): TopicMockLevel => {
    if (topicMockLevels.includes(key as TopicMockLevel)) {
        return key as TopicMockLevel;
    }
    return 'junior';
};

interface QuestionPageClientProps {
    question: QuestionDetail;
    topics: QuestionListTopic[];
}

export default function QuestionPageClient({ question, topics }: QuestionPageClientProps): React.ReactElement {
    const t = useI18n();
    const reduxUser = useAppSelector((state) => state.currentUser.user);
    const locale: UserLocale = reduxUser?.locale === 'en' ? 'en' : 'uk';

    const [initialData, setInitialData] = useState<QuestionFormData>(() => mapQuestionToFormData(question));

    const messages = useMemo(
        () => ({
            required: t('questions.detailValidationRequired'),
            answersMin: t('questions.detailValidationAnswersMin'),
            correctAnswer: t('questions.detailValidationCorrect')
        }),
        [t]
    );

    const schema = useMemo(() => buildQuestionFormSchema(messages), [messages]);

    const form = useForm<QuestionFormData>({
        resolver: zodResolver(schema),
        defaultValues: initialData,
        mode: 'onChange'
    });

    const { control, handleSubmit, reset, getValues, formState } = form;
    const { fields, append, remove } = useFieldArray({ control, name: 'answers' });

    const handleAddAnswer = useCallback(() => {
        append({ textUk: '', textEn: '', theoryUk: '', theoryEn: '', isCorrect: false });
    }, [append]);

    const handleRemoveAnswer = useCallback(
        (index: number) => {
            remove(index);
        },
        [remove]
    );

    const onSubmit = useCallback(
        async (values: QuestionFormData) => {
            try {
                const updated = await updateAdminQuestion(question.id, values);
                const nextInitial = mapQuestionToFormData(updated);
                setInitialData(nextInitial);
                reset(nextInitial);
                toast.success(t('questions.detailSaveSuccess'));
            } catch (error) {
                clientLogger.error('Form submission failed', error as Error, { questionId: question.id });
                toast.error(t('questions.detailSaveError'));
            }
        },
        [question.id, reset, t]
    );

    const handleCopyTopicJson = useCallback(async () => {
        try {
            const values = getValues();
            const topicId = values.topicId ?? question.topicId ?? null;
            const topic = topicId ? topics.find((item) => item.id === topicId) : (question.topic ?? null);
            const payload: TopicMock = {
                titleUK: topic?.titleUk ?? '',
                titleEN: topic?.titleEn ?? '',
                questions: [
                    {
                        textUK: values.textUk,
                        textEN: values.textEn,
                        theoryUK: values.theoryUk,
                        theoryEN: values.theoryEn,
                        level: normalizeLevel(question.level.key),
                        answers: values.answers.map((answer) => ({
                            textUK: answer.textUk,
                            textEN: answer.textEn,
                            theoryUK: answer.theoryUk,
                            theoryEN: answer.theoryEn,
                            isCorrect: answer.isCorrect
                        }))
                    }
                ]
            };
            await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
            toast.success(t('questions.detailCopySuccess'));
        } catch (error) {
            clientLogger.error('Copy topic JSON failed', error as Error, { questionId: question.id });
            toast.error(t('questions.detailCopyError'));
        }
    }, [getValues, question.id, question.level.key, question.topic, question.topicId, t, topics]);

    const answersError = formState.errors.answers;
    let answersErrorMessage: string | undefined;

    if (typeof answersError?.message === 'string') {
        answersErrorMessage = answersError.message;
    } else if (answersError && 'root' in answersError && typeof answersError.root?.message === 'string') {
        answersErrorMessage = answersError.root?.message;
    } else if (answersError && '_errors' in answersError) {
        const list = (answersError as { _errors?: string[] })._errors;
        if (Array.isArray(list) && list.length > 0) {
            answersErrorMessage = list[0];
        }
    }

    const topicOptions = useMemo(
        () =>
            topics.map((topic) => ({
                value: topic.id,
                label: locale === 'uk' ? topic.titleUk : topic.titleEn
            })),
        [topics, locale]
    );

    return (
        <div className="space-y-6 p-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{t('questions.detailTitle')}</h1>
                <p className="text-sm text-muted-foreground">{t('questions.detailSubtitle')}</p>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <FormField
                            control={control}
                            name="textUk"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>{t('questions.detailTextUkLabel')}</FormLabel>
                                    <FormControl>
                                        <textarea
                                            ref={field.ref}
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="textEn"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>{t('questions.detailTextEnLabel')}</FormLabel>
                                    <FormControl>
                                        <textarea
                                            ref={field.ref}
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <FormField
                            control={control}
                            name="theoryUk"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>{t('questions.detailTheoryUkLabel')}</FormLabel>
                                    <FormControl>
                                        <textarea
                                            ref={field.ref}
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="min-h-[160px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="theoryEn"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>{t('questions.detailTheoryEnLabel')}</FormLabel>
                                    <FormControl>
                                        <textarea
                                            ref={field.ref}
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="min-h-[160px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={control}
                        name="topicId"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>{t('questions.detailTopicLabel')}</FormLabel>
                                <FormControl>
                                    <select
                                        ref={field.ref}
                                        value={field.value ?? ''}
                                        onChange={(event) => field.onChange(event.target.value.length > 0 ? event.target.value : null)}
                                        className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="">{t('questions.detailTopicPlaceholder')}</option>
                                        {topicOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{t('questions.detailAnswersHeading')}</h2>
                            <Button type="button" variant="outline" onClick={handleAddAnswer}>
                                {t('questions.detailAddAnswer')}
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="space-y-4 rounded-lg border border-dashed p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveAnswer(index)} disabled={fields.length <= 2}>
                                            {t('questions.detailRemoveAnswer')}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        <FormField
                                            control={control}
                                            name={`answers.${index}.textUk`}
                                            render={({ field: answerField }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>{t('questions.detailAnswerTextUk')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...answerField} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name={`answers.${index}.textEn`}
                                            render={({ field: answerField }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>{t('questions.detailAnswerTextEn')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...answerField} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        <FormField
                                            control={control}
                                            name={`answers.${index}.theoryUk`}
                                            render={({ field: answerField }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>{t('questions.detailAnswerTheoryUk')}</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            ref={answerField.ref}
                                                            value={answerField.value}
                                                            onChange={answerField.onChange}
                                                            className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name={`answers.${index}.theoryEn`}
                                            render={({ field: answerField }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>{t('questions.detailAnswerTheoryEn')}</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            ref={answerField.ref}
                                                            value={answerField.value}
                                                            onChange={answerField.onChange}
                                                            className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={control}
                                        name={`answers.${index}.isCorrect`}
                                        render={({ field: answerField }) => (
                                            <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                                <FormControl>
                                                    <input
                                                        ref={answerField.ref}
                                                        type="checkbox"
                                                        checked={answerField.value}
                                                        onChange={(event) => answerField.onChange(event.target.checked)}
                                                        className="size-4 rounded border border-input"
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-medium">{t('questions.detailAnswerIsCorrect')}</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                        {answersErrorMessage && <p className="text-sm font-medium text-destructive">{answersErrorMessage}</p>}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={!formState.isDirty || formState.isSubmitting}>
                            {t('questions.detailSave')}
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleCopyTopicJson}>
                            {t('questions.detailCopyTopicJson')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
