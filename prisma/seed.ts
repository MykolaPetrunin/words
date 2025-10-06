/* eslint-disable no-console */
import { createHash } from 'crypto';

import { PrismaClient } from '@prisma/client';

import { tests as bigintTests } from './seeds/tests/javascript-bigint';
import { tests as boxingUnboxingTests } from './seeds/tests/javascript-boxing-unboxing';
import { tests as implicitTypeCastingTests } from './seeds/tests/javascript-implicit-type-casting';
import { tests as logicalOperatorsTests } from './seeds/tests/javascript-logical-operators';
import { tests as nanAndInfinityTests } from './seeds/tests/javascript-nan-and-infinity';
import { tests as objectIsTests } from './seeds/tests/javascript-object-is';
import { tests as primitivesObjectsTests } from './seeds/tests/javascript-primitives-objects';
import { tests as symbolTests } from './seeds/tests/javascript-symbol';
import { tests as typeofInstanceofInDeleteTests } from './seeds/tests/javascript-typeof-instanceof-in-delete';
import { tests as variablesTests } from './seeds/tests/javascript-variables';
import { seedQuestions } from './seeds/utils';

const prisma = new PrismaClient();

function generateId(content: string): string {
    return createHash('sha256').update(content).digest('hex').substring(0, 16);
}

async function main(): Promise<void> {
    console.log('🌱 Starting seed...');

    console.log('📚 Seeding levels...');

    const levelIds = {
        junior: generateId('level-junior'),
        middle: generateId('level-middle'),
        senior: generateId('level-senior')
    };

    const levels = [
        {
            id: levelIds.junior,
            key: 'junior',
            nameUk: 'Junior',
            nameEn: 'Junior',
            isActive: true,
            orderIndex: 0
        },
        {
            id: levelIds.middle,
            key: 'middle',
            nameUk: 'Middle',
            nameEn: 'Middle',
            isActive: true,
            orderIndex: 1
        },
        {
            id: levelIds.senior,
            key: 'senior',
            nameUk: 'Senior',
            nameEn: 'Senior',
            isActive: true,
            orderIndex: 2
        }
    ];

    for (const level of levels) {
        await prisma.level.upsert({
            where: { key: level.key },
            update: {
                id: level.id,
                nameUk: level.nameUk,
                nameEn: level.nameEn,
                isActive: level.isActive,
                orderIndex: level.orderIndex
            },
            create: level
        });
        console.log(`✅ Level "${level.nameEn}" seeded`);
    }

    console.log('📚 Seeding subjects...');

    const subjects = [
        {
            id: generateId('subject-frontend'),
            nameUk: 'Front-End розробник',
            nameEn: 'Front-End Developer',
            descriptionUk: 'Створення користувацьких інтерфейсів та клієнтської частини веб-додатків',
            descriptionEn: 'Creating user interfaces and client-side web applications',
            isActive: true
        }
    ];

    await prisma.subject.createMany({
        data: subjects,
        skipDuplicates: true
    });
    console.log(`✅ ${subjects.length} subjects seeded`);

    console.log('📖 Seeding books...');

    const books = [
        {
            id: generateId('book-javascript-frontend'),
            titleUk: 'Javascript для Front-End розробника',
            titleEn: 'Javascript for Front-End Developer',
            descriptionUk: 'Повний курс JavaScript для frontend розробки з практичними прикладами та завданнями',
            descriptionEn: 'Complete JavaScript course for frontend development with practical examples and tasks',
            isActive: true
        }
    ];

    await prisma.book.createMany({
        data: books,
        skipDuplicates: true
    });
    console.log(`✅ ${books.length} books seeded`);

    console.log('🔗 Seeding book-subject relations...');

    const bookSubjectRelations = [
        {
            bookId: books[0].id,
            subjectId: generateId('subject-frontend')
        }
    ];

    await prisma.bookSubject.createMany({
        data: bookSubjectRelations,
        skipDuplicates: true
    });
    console.log(`✅ ${bookSubjectRelations.length} book-subject relations seeded`);

    const bookId = books[0].id;

    await seedQuestions({
        prisma,
        questions: primitivesObjectsTests,
        levelIds,
        bookId,
        topicName: 'JavaScript Primitives and Objects questions'
    });

    await seedQuestions({
        prisma,
        questions: boxingUnboxingTests,
        levelIds,
        bookId,
        topicName: 'JavaScript Boxing/Unboxing questions'
    });

    await seedQuestions({
        prisma,
        questions: implicitTypeCastingTests,
        levelIds,
        bookId,
        topicName: 'JavaScript Implicit Type Casting questions'
    });

    await seedQuestions({
        prisma,
        questions: symbolTests,
        levelIds,
        bookId,
        topicName: 'JavaScript Symbol questions'
    });

    await seedQuestions({
        prisma,
        questions: bigintTests,
        levelIds,
        bookId,
        topicName: 'JavaScript BigInt questions'
    });

    await seedQuestions({
        prisma,
        questions: nanAndInfinityTests,
        levelIds,
        bookId,
        topicName: 'JavaScript NaN and Infinity questions'
    });

    await seedQuestions({
        prisma,
        questions: objectIsTests,
        levelIds,
        bookId,
        topicName: 'JavaScript Object.is questions'
    });

    await seedQuestions({
        prisma,
        questions: variablesTests,
        levelIds,
        bookId,
        topicName: 'JavaScript Variables questions'
    });

    await seedQuestions({
        prisma,
        questions: typeofInstanceofInDeleteTests,
        levelIds,
        bookId,
        topicName: 'JavaScript typeof, instanceof, in, delete questions'
    });

    await seedQuestions({
        prisma,
        questions: logicalOperatorsTests,
        levelIds,
        bookId,
        topicName: 'JavaScript Logical operators questions'
    });
    console.log('🎉 Seed completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
