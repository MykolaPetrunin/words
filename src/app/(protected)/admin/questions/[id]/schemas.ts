import * as z from 'zod';

export interface QuestionFormMessages {
    required: string;
    answersMin: string;
    correctAnswer: string;
}

const createSchema = (messages: QuestionFormMessages) =>
    z
        .object({
            textUk: z.string().min(1, messages.required),
            textEn: z.string().min(1, messages.required),
            theoryUk: z.string(),
            theoryEn: z.string(),
            isActive: z.boolean(),
            topicId: z.union([z.string().min(1, messages.required), z.null()]).transform((val) => (typeof val === 'string' && val.length === 0 ? null : val)),
            answers: z
                .array(
                    z.object({
                        id: z.string().min(1).optional(),
                        textUk: z.string().min(1, messages.required),
                        textEn: z.string().min(1, messages.required),
                        theoryUk: z.string(),
                        theoryEn: z.string(),
                        isCorrect: z.boolean()
                    })
                )
                .min(2, messages.answersMin)
        })
        .superRefine((data, ctx) => {
            if (!data.answers.some((answer) => answer.isCorrect)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: messages.correctAnswer, path: ['answers'] });
            }
        });

export const defaultQuestionFormMessages: QuestionFormMessages = {
    required: 'Field is required',
    answersMin: 'Add at least two answers',
    correctAnswer: 'Mark at least one correct answer'
};

export const questionFormSchema = createSchema(defaultQuestionFormMessages);

export type QuestionFormData = z.infer<typeof questionFormSchema>;

export const buildQuestionFormSchema = (messages: QuestionFormMessages): typeof questionFormSchema => createSchema(messages);
