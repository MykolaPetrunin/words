import { z } from 'zod';

export const subjectFormSchema = z
    .object({
        nameUk: z.string().trim().min(1),
        nameEn: z.string().trim().min(1),
        descriptionUk: z.string().transform((value) => value.trim()),
        descriptionEn: z.string().transform((value) => value.trim()),
        coverUrl: z.union([z.string().trim().url(), z.literal(''), z.null()]).transform((value) => {
            if (value === null) {
                return null;
            }
            return value.length === 0 ? null : value;
        }),
        isActive: z.boolean()
    })
    .strict();

export type SubjectFormData = z.infer<typeof subjectFormSchema>;
