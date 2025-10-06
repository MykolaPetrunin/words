// npx tsx prisma/seed-single.ts --file prisma/seeds/tests/javascript-variables.ts --bookId <existing-book-id>

/* eslint-disable no-console */
import path from 'node:path';

import { PrismaClient } from '@prisma/client';

import { TopicMock } from './seeds/types';
import { generateId, seedQuestions } from './seeds/utils';

type LevelKey = 'junior' | 'middle' | 'senior';

const prisma = new PrismaClient();

function parseArgs(argv: string[]): { fileArg?: string; bookId?: string } {
    const fileIndex = argv.findIndex((a) => a === '--file');
    const bookIndex = argv.findIndex((a) => a === '--bookId');
    return {
        fileArg: fileIndex !== -1 ? argv[fileIndex + 1] : undefined,
        bookId: bookIndex !== -1 ? argv[bookIndex + 1] : process.env.BOOK_ID
    };
}

async function resolveLevelIds(): Promise<Record<LevelKey, string>> {
    const levels = await prisma.level.findMany({ where: { key: { in: ['junior', 'middle', 'senior'] } } });
    const map = new Map(levels.map((l) => [l.key as LevelKey, l.id]));

    const missing: LevelKey[] = ['junior', 'middle', 'senior'].filter((k) => !map.get(k as LevelKey)) as LevelKey[];
    if (missing.length) {
        throw new Error(`Missing levels in DB: ${missing.join(', ')}. Seed base data first.`);
    }

    return {
        junior: map.get('junior') as string,
        middle: map.get('middle') as string,
        senior: map.get('senior') as string
    };
}

function buildModulePath(fileArg: string): string {
    if (fileArg.endsWith('.ts') || fileArg.endsWith('.js')) {
        if (path.isAbsolute(fileArg)) return fileArg;
        return path.join(process.cwd(), fileArg);
    }
    return path.join(process.cwd(), 'prisma', 'seeds', 'tests', `${fileArg}.ts`);
}

async function importTopicMock(modulePath: string): Promise<TopicMock> {
    const mod = await import(modulePath);
    const tests: unknown = mod.tests ?? mod.default ?? mod;
    if (!tests) throw new Error('Provided file does not export "tests"');
    const topic = tests as TopicMock;
    if (!topic.titleEN || !topic.titleUK || !Array.isArray(topic.questions)) {
        throw new Error('Invalid tests format in module');
    }
    return topic;
}

function uniquifyTopic(topic: TopicMock, uniqueSuffix: string): TopicMock {
    const suffix = ` [import ${uniqueSuffix}]`;
    return {
        ...topic,
        titleEN: `${topic.titleEN}${suffix}`,
        titleUK: `${topic.titleUK}${suffix}`
    };
}

async function main(): Promise<void> {
    console.log('🌱 Starting single-file seed...');

    const { fileArg, bookId } = parseArgs(process.argv.slice(2));
    if (!fileArg) {
        throw new Error('Please provide --file <relative|name> (e.g. javascript-variables or prisma/seeds/tests/javascript-variables.ts)');
    }
    if (!bookId) {
        throw new Error('Please provide --bookId <id> or set BOOK_ID env');
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
        throw new Error(`Book not found by id: ${bookId}`);
    }

    const levelIds = await resolveLevelIds();

    const modulePath = buildModulePath(fileArg);
    const topic = await importTopicMock(modulePath);

    const unique = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTopic = uniquifyTopic(topic, unique);

    const topicName = `${path.basename(modulePath).replace(/\.[tj]s$/, '')}-${unique}`;

    // Ensure book-subject relation is not required here; we only add questions
    await seedQuestions({ prisma, questions: safeTopic, levelIds, bookId, topicName });

    // Log IDs for reference
    const createdTopicId = generateId(`topic-${safeTopic.titleEN}`);
    console.log('✅ Done. Created topic id:', createdTopicId);
}

main()
    .catch((e) => {
        console.error('❌ Single-file seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
