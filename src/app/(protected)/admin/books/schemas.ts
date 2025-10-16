import { z } from 'zod';

const subjectIdSchema = z.string().trim().min(1);
const topicIdSchema = z.string().trim().min(1);

export type BookFormSchemaMessages = {
    titleUk: string;
    titleEn: string;
    subjectIds: string;
};

const buildBookFormSchema = (messages: BookFormSchemaMessages) =>
    z
        .object({
            titleUk: z.string().trim().min(1, { message: messages.titleUk }),
            titleEn: z.string().trim().min(1, { message: messages.titleEn }),
            descriptionUk: z.string().transform((value) => value.trim()),
            descriptionEn: z.string().transform((value) => value.trim()),
            coverUrl: z.union([z.string().trim().url(), z.literal(''), z.null()]).transform((value) => {
                if (value === null) {
                    return null;
                }
                return value.length === 0 ? null : value;
            }),
            isActive: z.boolean(),
            subjectIds: z
                .array(subjectIdSchema)
                .min(1, { message: messages.subjectIds })
                .transform((items) => Array.from(new Set(items))),
            topicIds: z.array(topicIdSchema).transform((items) => Array.from(new Set(items)))
        })
        .strict();

export type BookFormSchema = ReturnType<typeof buildBookFormSchema>;

const defaultMessages: BookFormSchemaMessages = {
    titleUk: 'Title in Ukrainian is required.',
    titleEn: 'Title in English is required.',
    subjectIds: 'Select at least one subject.'
};

export const bookFormSchema = buildBookFormSchema(defaultMessages);
export const createBookFormSchema = (messages: BookFormSchemaMessages): BookFormSchema => buildBookFormSchema(messages);

export type BookFormData = z.infer<typeof bookFormSchema>;

export type BookTopicFormSchemaMessages = {
    titleUk: string;
    titleEn: string;
};

const buildBookTopicFormSchema = (messages: BookTopicFormSchemaMessages) =>
    z
        .object({
            titleUk: z.string().trim().min(1, { message: messages.titleUk }),
            titleEn: z.string().trim().min(1, { message: messages.titleEn })
        })
        .strict();

export type BookTopicFormSchema = ReturnType<typeof buildBookTopicFormSchema>;

const topicDefaultMessages: BookTopicFormSchemaMessages = {
    titleUk: 'Title in Ukrainian is required.',
    titleEn: 'Title in English is required.'
};

export const bookTopicFormSchema = buildBookTopicFormSchema(topicDefaultMessages);
export const createBookTopicFormSchema = (messages: BookTopicFormSchemaMessages): BookTopicFormSchema => buildBookTopicFormSchema(messages);

export type BookTopicFormData = z.infer<typeof bookTopicFormSchema>;
