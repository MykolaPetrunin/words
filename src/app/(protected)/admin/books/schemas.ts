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
