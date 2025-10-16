'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useCallback, useId, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/hooks/useI18n';
import { getAdminBookPath, getAdminBookTopicPath } from '@/lib/appPaths';
import { clientLogger } from '@/lib/logger';
import { useAppSelector } from '@/lib/redux/ReduxProvider';
import type { QuestionDetail, QuestionListTopic } from '@/lib/repositories/questionRepository';
import type { UserLocale } from '@/lib/types/user';

import { updateAdminQuestion } from '../../actions';

import QuestionAnswersDialog from './components/questionAnswersDialog/QuestionAnswersDialog';
import QuestionTheoryDialog from './components/questionTheoryDialog/QuestionTheoryDialog';
import { buildQuestionFormSchema, type QuestionFormData } from './schemas';

interface TopicMockAnswer {
    textUK: string;
    textEN: string;
    theoryUK: string;
    theoryEN: string;
    isCorrect: boolean;
}

interface TopicMock {
    titleUK: string;
    titleEN: string;
    questions: QuestionMock[];
}

type TopicMockLevel = 'junior' | 'middle' | 'senior';

const topicMockLevels: readonly TopicMockLevel[] = ['junior', 'middle', 'senior'] as const;

interface QuestionMock {
    textUK: string;
    textEN: string;
    theoryUK: string;
    theoryEN: string;
    level: TopicMockLevel;
    answers: TopicMockAnswer[];
}

const questionMockSchema = z
    .object({
        textUK: z.string().min(1),
        textEN: z.string().min(1),
        theoryUK: z.string(),
        theoryEN: z.string(),
        level: z.enum(topicMockLevels),
        answers: z
            .array(
                z.object({
                    textUK: z.string().min(1),
                    textEN: z.string().min(1),
                    theoryUK: z.string(),
                    theoryEN: z.string(),
                    isCorrect: z.boolean()
                })
            )
            .min(2)
    })
    .strict();

const mapQuestionToFormData = (question: QuestionDetail): QuestionFormData => ({
    textUk: question.textUk,
    textEn: question.textEn,
    theoryUk: question.theoryUk ?? '',
    theoryEn: question.theoryEn ?? '',
    isActive: question.isActive,
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

const mapMockToFormData = (mock: QuestionMock, topicId: string | null, isActive: boolean): QuestionFormData => ({
    textUk: mock.textUK,
    textEn: mock.textEN,
    theoryUk: mock.theoryUK,
    theoryEn: mock.theoryEN,
    isActive,
    topicId,
    answers: mock.answers.map((answer) => ({
        textUk: answer.textUK,
        textEn: answer.textEN,
        theoryUk: answer.theoryUK,
        theoryEn: answer.theoryEN,
        isCorrect: answer.isCorrect
    }))
});

interface QuestionMockImporterProps {
    disabled: boolean;
    label: string;
    placeholder: string;
    buttonLabel: string;
    parseErrorMessage: string;
    submitErrorMessage: string;
    onImport: (mock: QuestionMock) => Promise<void>;
    questionId: string;
}

const QuestionMockImporter = ({
    disabled,
    label,
    placeholder,
    buttonLabel,
    parseErrorMessage,
    submitErrorMessage,
    onImport,
    questionId
}: QuestionMockImporterProps): React.ReactElement => {
    const [value, setValue] = useState<string>('');
    const textareaId = useId();

    const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
    }, []);

    const handleImport = useCallback(async () => {
        if (value.trim().length === 0) {
            toast.error(parseErrorMessage);
            return;
        }

        let mock: QuestionMock | null = null;

        try {
            const raw = JSON.parse(value) as unknown;
            const parsed = questionMockSchema.parse(raw);
            mock = {
                textUK: parsed.textUK,
                textEN: parsed.textEN,
                theoryUK: parsed.theoryUK,
                theoryEN: parsed.theoryEN,
                level: parsed.level,
                answers: parsed.answers.map((answer) => ({
                    textUK: answer.textUK,
                    textEN: answer.textEN,
                    theoryUK: answer.theoryUK,
                    theoryEN: answer.theoryEN,
                    isCorrect: answer.isCorrect
                }))
            };
        } catch (error) {
            clientLogger.error('Question mock JSON parse failed', error as Error, { questionId });
            toast.error(parseErrorMessage);
            return;
        }

        if (!mock) {
            return;
        }

        try {
            await onImport(mock);
        } catch (error) {
            clientLogger.error('Question mock import failed', error as Error, { questionId });
            toast.error(submitErrorMessage);
        }
    }, [onImport, parseErrorMessage, questionId, submitErrorMessage, value]);

    return (
        <div className="space-y-2">
            <label htmlFor={textareaId} className="text-sm font-medium">
                {label}
            </label>
            <textarea
                id={textareaId}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="min-h-[160px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="flex justify-end">
                <Button type="button" onClick={handleImport} disabled={disabled || value.trim().length === 0}>
                    {buttonLabel}
                </Button>
            </div>
        </div>
    );
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

    const importerMessages = useMemo(
        () => ({
            label: t('questions.detailMockJsonLabel'),
            placeholder: t('questions.detailMockJsonPlaceholder'),
            button: t('questions.detailMockJsonButton'),
            parseError: t('questions.detailMockJsonInvalid'),
            submitError: t('questions.detailMockJsonError')
        }),
        [t]
    );

    const schema = useMemo(() => buildQuestionFormSchema(messages), [messages]);

    const form = useForm<QuestionFormData>({
        resolver: zodResolver(schema),
        defaultValues: initialData,
        mode: 'onChange'
    });

    const { control, handleSubmit, reset, getValues, formState, watch } = form;
    const { fields, append, remove } = useFieldArray({ control, name: 'answers' });
    const hasAnswers = fields.length > 0;
    const watchedIsActive = watch('isActive') ?? false;
    const watchedTextUk = watch('textUk') ?? '';
    const watchedTextEn = watch('textEn') ?? '';
    const watchedTheoryUk = watch('theoryUk') ?? '';
    const watchedTheoryEn = watch('theoryEn') ?? '';
    const watchedAnswers = watch('answers') ?? [];
    const bookTitle = question.book ? (locale === 'uk' ? question.book.titleUk : question.book.titleEn) : null;
    const bookLinkHref = question.book ? getAdminBookPath(question.book.id) : null;
    const topicTitleDisplay = question.topic ? (locale === 'uk' ? question.topic.titleUk : question.topic.titleEn) : null;
    const topicLinkHref = question.book && question.topic ? getAdminBookTopicPath(question.book.id, question.topic.id) : null;
    const questionLevelLabel = locale === 'uk' ? question.level.nameUk : question.level.nameEn;

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
            if (values.isActive) {
                const missingQuestionTheory = values.theoryUk.trim().length === 0 || values.theoryEn.trim().length === 0;
                const missingAnswersTheory = values.answers.some((answer) => answer.theoryUk.trim().length === 0 || answer.theoryEn.trim().length === 0);
                if (missingQuestionTheory || missingAnswersTheory) {
                    toast.error(t('questions.detailActivationTheoryError'));
                    return;
                }
            }
            try {
                const updated = await updateAdminQuestion(question.id, values, false);
                const nextInitial = mapQuestionToFormData(updated);
                setInitialData(nextInitial);
                reset(nextInitial);
                toast.success(t('questions.detailSaveSuccess'));
            } catch (error) {
                const err = error as Error;
                if (err.message === 'QUESTION_THEORY_REQUIRED') {
                    toast.error(t('questions.detailActivationTheoryError'));
                    return;
                }
                clientLogger.error('Form submission failed', err, { questionId: question.id });
                toast.error(t('questions.detailSaveError'));
            }
        },
        [question.id, reset, setInitialData, t]
    );

    const handleApprove = useCallback(async () => {
        const values = getValues();
        try {
            const updated = await updateAdminQuestion(question.id, values, true);
            const nextInitial = mapQuestionToFormData(updated);
            setInitialData(nextInitial);
            reset(nextInitial);
            toast.success(t('questions.detailApproveSuccess'));
        } catch (error) {
            const err = error as Error;
            clientLogger.error('Question approval failed', err, { questionId: question.id });
            toast.error(t('questions.detailSaveError'));
        }
    }, [getValues, question.id, reset, setInitialData, t]);

    const activationTheoryError =
        watchedIsActive &&
        (watchedTheoryUk.trim().length === 0 ||
            watchedTheoryEn.trim().length === 0 ||
            watchedAnswers.some((answer) => (answer.theoryUk ?? '').trim().length === 0 || (answer.theoryEn ?? '').trim().length === 0))
            ? t('questions.detailActivationTheoryError')
            : null;

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

    const handleImportMock = useCallback(
        async (mock: QuestionMock) => {
            const formTopic = getValues('topicId');
            const targetTopic = formTopic ?? question.topicId ?? null;
            const currentIsActive = getValues('isActive');
            const formData = mapMockToFormData(mock, targetTopic, currentIsActive ?? question.isActive);
            reset(formData);
            await handleSubmit(onSubmit)();
        },
        [getValues, handleSubmit, onSubmit, question.isActive, question.topicId, reset]
    );

    const handleQuestionUpdated = useCallback(
        async (updated: QuestionDetail) => {
            const nextInitial = mapQuestionToFormData(updated);
            setInitialData(nextInitial);
            reset(nextInitial);
        },
        [reset, setInitialData]
    );

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
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">{t('questions.detailTitle')}</h1>
                        <p className="text-sm text-muted-foreground">{t('questions.detailSubtitle')}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>
                            {t('questions.levelLabel')}: {questionLevelLabel}
                        </span>
                        <span>•</span>
                        <span>{t(watchedIsActive ? 'questions.detailStatusActive' : 'questions.detailStatusInactive')}</span>
                        {bookTitle && (
                            <>
                                <span>•</span>
                                <span>
                                    {t('questions.detailBookLabel')}:{' '}
                                    {bookLinkHref ? (
                                        <Link href={bookLinkHref} className="text-primary hover:underline" prefetch={false}>
                                            {bookTitle}
                                        </Link>
                                    ) : (
                                        bookTitle
                                    )}
                                </span>
                            </>
                        )}
                        {topicTitleDisplay && (
                            <>
                                <span>•</span>
                                <span>
                                    {t('questions.detailTopicLabel')}:{' '}
                                    {topicLinkHref ? (
                                        <Link href={topicLinkHref} className="text-primary hover:underline" prefetch={false}>
                                            {topicTitleDisplay}
                                        </Link>
                                    ) : (
                                        topicTitleDisplay
                                    )}
                                </span>
                            </>
                        )}
                    </div>
                </div>
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

                    {hasAnswers && (
                        <div className="flex justify-end">
                            <QuestionTheoryDialog
                                questionId={question.id}
                                questionTextUk={watchedTextUk}
                                questionTextEn={watchedTextEn}
                                hasAnswers={hasAnswers}
                                onApplied={handleQuestionUpdated}
                            />
                        </div>
                    )}

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

                    <FormField
                        control={control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <div className="flex flex-row items-center gap-2">
                                    <FormControl>
                                        <input
                                            ref={field.ref}
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={(event) => field.onChange(event.target.checked)}
                                            className="size-4 rounded border border-input"
                                        />
                                    </FormControl>
                                    <FormLabel className="text-sm font-medium">{t('questions.detailIsActiveLabel')}</FormLabel>
                                </div>
                                {activationTheoryError && <FormMessage>{activationTheoryError}</FormMessage>}
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{t('questions.detailAnswersHeading')}</h2>
                            <div className="flex items-center gap-2">
                                {!hasAnswers && (
                                    <QuestionAnswersDialog
                                        questionId={question.id}
                                        questionTextUk={watchedTextUk}
                                        questionTextEn={watchedTextEn}
                                        onApplied={handleQuestionUpdated}
                                    />
                                )}
                                <Button type="button" variant="outline" onClick={handleAddAnswer}>
                                    {t('questions.detailAddAnswer')}
                                </Button>
                            </div>
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

                    <QuestionMockImporter
                        disabled={formState.isSubmitting}
                        label={importerMessages.label}
                        placeholder={importerMessages.placeholder}
                        buttonLabel={importerMessages.button}
                        parseErrorMessage={importerMessages.parseError}
                        submitErrorMessage={importerMessages.submitError}
                        onImport={handleImportMock}
                        questionId={question.id}
                    />

                    <div className="flex flex-wrap gap-3">
                        {question.previewMode ? (
                            <Button type="button" disabled={formState.isSubmitting} onClick={handleApprove}>
                                {t('questions.detailApproveButton')}
                            </Button>
                        ) : (
                            <Button type="submit" disabled={!formState.isDirty || formState.isSubmitting}>
                                {t('questions.detailSave')}
                            </Button>
                        )}
                        <Button type="button" variant="secondary" onClick={handleCopyTopicJson}>
                            {t('questions.detailCopyTopicJson')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
