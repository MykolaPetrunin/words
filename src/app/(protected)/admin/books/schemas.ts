import { z } from 'zod';

const subjectIdSchema = z.string().trim().min(1);

export const bookFormSchema = z
    .object({
        titleUk: z.string().trim().min(1),
        titleEn: z.string().trim().min(1),
        descriptionUk: z.string().transform((value) => value.trim()),
        descriptionEn: z.string().transform((value) => value.trim()),
        isActive: z.boolean(),
        subjectIds: z.array(subjectIdSchema).transform((items) => Array.from(new Set(items)))
    })
    .strict();

export type BookFormData = z.infer<typeof bookFormSchema>;
