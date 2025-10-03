/* eslint-disable no-console */
import { createHash } from 'crypto';

import { PrismaClient } from '@prisma/client';

import { TopicMock } from './types';

function generateId(content: string): string {
    return createHash('sha256').update(content).digest('hex').substring(0, 16);
}

interface SeedQuestionsParams {
    prisma: PrismaClient;
    questions: TopicMock;
    levelId: string;
    bookId: string;
    startOrderIndex?: number;
    topicName?: string;
}

export async function seedQuestions({ prisma, questions, levelId, bookId, startOrderIndex = 1, topicName = 'Questions' }: SeedQuestionsParams): Promise<void> {
    console.log(`❓ Seeding ${topicName}...`);

    let questionOrderIndex = startOrderIndex;

    const topicId = generateId(`topic-${questions.titleEN}`);

    await prisma.topic.upsert({
        where: { id: topicId },
        update: {
            titleUk: questions.titleUK,
            titleEn: questions.titleEN
        },
        create: {
            id: topicId,
            titleUk: questions.titleUK,
            titleEn: questions.titleEN
        }
    });

    for (const testQuestion of questions.questions) {
        const questionId = generateId(`question-${topicName}-${testQuestion.textEN.substring(0, 50)}`);
        // Create question
        const question = await prisma.question.upsert({
            where: { id: questionId },
            update: {
                textUk: testQuestion.textUK,
                textEn: testQuestion.textEN,
                theoryUk: testQuestion.theoryUK,
                theoryEn: testQuestion.theoryEN,
                isActive: true,
                topicId,
                levelId
            },
            create: {
                id: questionId,
                textUk: testQuestion.textUK,
                textEn: testQuestion.textEN,
                theoryUk: testQuestion.theoryUK,
                theoryEn: testQuestion.theoryEN,
                isActive: true,
                topicId,
                levelId
            }
        });

        console.log(`✅ Question "${question.textEn.substring(0, 60)}..." seeded`);

        // Create answers for this question
        const answersData = testQuestion.answers.map((answer, index) => ({
            id: generateId(`answer-${questionId}-${index}-${answer.textEN.substring(0, 20)}`),
            questionId: questionId,
            textUk: answer.textUK,
            textEn: answer.textEN,
            isCorrect: answer.isCorrect,
            theoryUk: answer.theoryUK,
            theoryEn: answer.theoryEN,
            orderIndex: index + 1
        }));

        await prisma.answer.createMany({
            data: answersData,
            skipDuplicates: true
        });

        console.log(`💡 ${answersData.length} answers seeded for question`);

        // Add question to book
        await prisma.bookQuestion.upsert({
            where: {
                bookId_questionId: {
                    bookId: bookId,
                    questionId: questionId
                }
            },
            update: {
                orderIndex: questionOrderIndex
            },
            create: {
                bookId: bookId,
                questionId: questionId,
                orderIndex: questionOrderIndex
            }
        });

        questionOrderIndex++;
    }

    console.log(`✅ ${questions.questions.length} ${topicName} seeded`);
}

export { generateId };
