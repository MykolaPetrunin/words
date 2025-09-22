/* eslint-disable no-console */
import { createHash } from 'crypto';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate deterministic hash for consistent IDs
function generateId(content: string): string {
    return createHash('sha256').update(content).digest('hex').substring(0, 16);
}

async function main(): Promise<void> {
    console.log('🌱 Starting seed...');

    // Seed levels
    console.log('📚 Seeding levels...');

    const levels = [
        {
            id: generateId('level-junior'),
            key: 'junior',
            nameUk: 'Junior',
            nameEn: 'Junior',
            isActive: true,
            orderIndex: 0
        },
        {
            id: generateId('level-middle'),
            key: 'middle',
            nameUk: 'Middle',
            nameEn: 'Middle',
            isActive: true,
            orderIndex: 1
        },
        {
            id: generateId('level-senior'),
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

    // Seed subjects
    console.log('📚 Seeding subjects...');

    const subjects = [
        {
            id: generateId('subject-frontend'),
            nameUk: 'Front-End розробник',
            nameEn: 'Front-End Developer',
            descriptionUk: 'Створення користувацьких інтерфейсів та клієнтської частини веб-додатків',
            descriptionEn: 'Creating user interfaces and client-side web applications',
            isActive: true
        },
        {
            id: generateId('subject-backend'),
            nameUk: 'Backend розробка',
            nameEn: 'Backend Development',
            descriptionUk: 'Серверна розробка, API, бази даних та архітектура',
            descriptionEn: 'Server-side development, APIs, databases and architecture',
            isActive: true
        },
        {
            id: generateId('subject-devops'),
            nameUk: 'DevOps',
            nameEn: 'DevOps',
            descriptionUk: 'Автоматизація розгортання, CI/CD, моніторинг та інфраструктура',
            descriptionEn: 'Deployment automation, CI/CD, monitoring and infrastructure',
            isActive: true
        },
        {
            id: generateId('subject-algorithms'),
            nameUk: 'Алгоритми та структури даних',
            nameEn: 'Algorithms and Data Structures',
            descriptionUk: 'Основи алгоритмів, структури даних та складність обчислень',
            descriptionEn: 'Fundamentals of algorithms, data structures and computational complexity',
            isActive: true
        }
    ];

    for (const subject of subjects) {
        await prisma.subject.upsert({
            where: { id: subject.id },
            update: {
                nameUk: subject.nameUk,
                nameEn: subject.nameEn,
                descriptionUk: subject.descriptionUk,
                descriptionEn: subject.descriptionEn,
                isActive: subject.isActive
            },
            create: subject
        });
        console.log(`✅ Subject "${subject.nameEn}" seeded`);
    }

    // Seed books
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

    for (const book of books) {
        await prisma.book.upsert({
            where: { id: book.id },
            update: {
                titleUk: book.titleUk,
                titleEn: book.titleEn,
                descriptionUk: book.descriptionUk,
                descriptionEn: book.descriptionEn,
                isActive: book.isActive
            },
            create: book
        });
        console.log(`✅ Book "${book.titleEn}" seeded`);
    }

    // Seed book-subject relations
    console.log('🔗 Seeding book-subject relations...');

    const bookSubjectRelations = [
        {
            bookId: generateId('book-javascript-frontend'),
            subjectId: generateId('subject-frontend')
        }
    ];

    for (const relation of bookSubjectRelations) {
        await prisma.bookSubject.upsert({
            where: {
                bookId_subjectId: {
                    bookId: relation.bookId,
                    subjectId: relation.subjectId
                }
            },
            update: {},
            create: relation
        });
        console.log(`✅ Book-Subject relation "${relation.bookId}" - "${relation.subjectId}" seeded`);
    }

    // Seed JavaScript primitives vs objects question
    console.log('❓ Seeding questions...');

    const questionId = generateId('question-js-primitives-vs-objects');
    const juniorLevelId = generateId('level-junior');

    const question = await prisma.question.upsert({
        where: { id: questionId },
        update: {
            textUk: "Яка основна відмінність між примітивними типами та об'єктами у JavaScript?",
            textEn: 'What is the main difference between primitive types and objects in JavaScript?',
            theoryUk:
                "У JavaScript **примітиви** є незмінними (immutable) значеннями. До них належать: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. Вони зберігають значення безпосередньо. \n\n**Об'єкти** ж є змінними (mutable) структурами, які зберігаються за посиланням. Це означає, що коли ви передаєте об'єкт у змінну або функцію, ви фактично передаєте посилання на нього, а не копію самого значення.\n\n✅ Основна різниця: примітиви копіюються за значенням, а об'єкти — за посиланням.",
            theoryEn:
                'In JavaScript, **primitives** are immutable values. They include: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. They store the actual value directly.\n\n**Objects**, on the other hand, are mutable structures stored by reference. This means when you assign or pass an object, you are working with its reference, not a separate copy.\n\n✅ Main difference: primitives are copied by value, while objects are copied by reference.',
            isActive: true,
            levelId: juniorLevelId
        },
        create: {
            id: questionId,
            textUk: "Яка основна відмінність між примітивними типами та об'єктами у JavaScript?",
            textEn: 'What is the main difference between primitive types and objects in JavaScript?',
            theoryUk:
                "У JavaScript **примітиви** є незмінними (immutable) значеннями. До них належать: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. Вони зберігають значення безпосередньо. \n\n**Об'єкти** ж є змінними (mutable) структурами, які зберігаються за посиланням. Це означає, що коли ви передаєте об'єкт у змінну або функцію, ви фактично передаєте посилання на нього, а не копію самого значення.\n\n✅ Основна різниця: примітиви копіюються за значенням, а об'єкти — за посиланням.",
            theoryEn:
                'In JavaScript, **primitives** are immutable values. They include: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. They store the actual value directly.\n\n**Objects**, on the other hand, are mutable structures stored by reference. This means when you assign or pass an object, you are working with its reference, not a separate copy.\n\n✅ Main difference: primitives are copied by value, while objects are copied by reference.',
            isActive: true,
            levelId: juniorLevelId
        }
    });

    console.log(`✅ Question "${question.textEn}" seeded`);

    // Seed answers for the question
    console.log('💡 Seeding answers...');

    const answers = [
        {
            id: generateId('answer-js-primitives-stored-by-value'),
            questionId: questionId,
            textUk: "Примітиви зберігаються за значенням, а об'єкти — за посиланням.",
            textEn: 'Primitives are stored by value, while objects are stored by reference.',
            isCorrect: true,
            theoryUk: "Це правильна відповідь: у випадку з примітивами зберігається саме значення, а об'єкти передаються через посилання.",
            theoryEn: 'This is the correct answer: primitives store the actual value, while objects are passed by reference.',
            orderIndex: 1
        },
        {
            id: generateId('answer-js-primitives-mutable-objects-immutable'),
            questionId: questionId,
            textUk: "Примітиви є змінними, а об'єкти — незмінними.",
            textEn: 'Primitives are mutable, while objects are immutable.',
            isCorrect: false,
            theoryUk: "❌ Це помилка: усе навпаки. Примітиви незмінні, а об'єкти можна змінювати.",
            theoryEn: "❌ Incorrect: it's the opposite. Primitives are immutable, while objects are mutable.",
            orderIndex: 2
        },
        {
            id: generateId('answer-js-objects-direct-primitives-reference'),
            questionId: questionId,
            textUk: "Об'єкти зберігають значення напряму, а примітиви — посилання.",
            textEn: 'Objects store values directly, while primitives store references.',
            isCorrect: false,
            theoryUk: "❌ Це помилка: примітиви зберігають значення напряму, об'єкти — лише посилання.",
            theoryEn: '❌ Incorrect: primitives store values directly, while objects store references.',
            orderIndex: 3
        },
        {
            id: generateId('answer-js-primitives-constructor-objects-direct'),
            questionId: questionId,
            textUk: "Примітиви створюються за допомогою конструктора, а об'єкти — безпосередньо.",
            textEn: 'Primitives are created using constructors, while objects are created directly.',
            isCorrect: false,
            theoryUk: "❌ Це помилка: примітиви створюються літералами (`42`, `'text'`), а об'єкти — через літерали `{}` або конструктори `new Object()`.",
            theoryEn:
                "❌ Incorrect: primitives are usually created with literals (`42`, `'text'`), while objects can be created with literals `{}` or constructors like `new Object()`.",
            orderIndex: 4
        },
        {
            id: generateId('answer-js-primitives-no-methods-objects-have'),
            questionId: questionId,
            textUk: "Примітиви не мають методів, а об'єкти мають.",
            textEn: "Primitives don't have methods, while objects do.",
            isCorrect: false,
            theoryUk: "❌ Це неточність: примітиви мають методи завдяки автоматичному boxing у тимчасові об'єкти (`'text'.toUpperCase()`).",
            theoryEn: "❌ Not entirely correct: primitives do have methods via automatic boxing into temporary objects (`'text'.toUpperCase()`).",
            orderIndex: 5
        },
        {
            id: generateId('answer-js-objects-always-more-memory'),
            questionId: questionId,
            textUk: "Об'єкти завжди займають більше пам'яті ніж примітиви.",
            textEn: 'Objects always take more memory than primitives.',
            isCorrect: false,
            theoryUk: "❌ Це перебільшення: хоча об'єкти зазвичай важчі, точне споживання пам'яті залежить від реалізації двигуна JS.",
            theoryEn: '❌ This is an oversimplification: objects are usually heavier, but actual memory usage depends on the JS engine implementation.',
            orderIndex: 6
        },
        {
            id: generateId('answer-js-primitives-compared-by-value'),
            questionId: questionId,
            textUk: "Примітиви завжди порівнюються за значенням, а об'єкти — за посиланням.",
            textEn: 'Primitives are always compared by value, while objects are compared by reference.',
            isCorrect: true,
            theoryUk: "✅ Це правильна особливість: два різні об'єкти з однаковими властивостями не будуть рівні (`{a:1} !== {a:1}`).",
            theoryEn: '✅ This is correct: two different objects with the same properties are not equal (`{a:1} !== {a:1}`).',
            orderIndex: 7
        },
        {
            id: generateId('answer-js-primitives-spread-clone-objects-not'),
            questionId: questionId,
            textUk: "Примітиви можна клонувати оператором spread, а об'єкти — ні.",
            textEn: 'Primitives can be cloned using the spread operator, but objects cannot.',
            isCorrect: false,
            theoryUk:
                "❌ Неправда: spread (`...`) можна застосовувати до об'єктів (`{...obj}`) та масивів, але він не клонує примітиви, бо вони й так копіюються за значенням.",
            theoryEn: "❌ Incorrect: spread (`...`) works on objects (`{...obj}`) and arrays, primitives don't need cloning since they are copied by value.",
            orderIndex: 8
        },
        {
            id: generateId('answer-js-primitives-seven-types-list'),
            questionId: questionId,
            textUk: 'До примітивів відносяться: string, number, boolean, undefined, symbol, null, bigint.',
            textEn: 'Primitives include: string, number, boolean, undefined, symbol, null, bigint.',
            isCorrect: true,
            theoryUk: '✅ Це правильний перелік усіх 7 примітивних типів у JS.',
            theoryEn: '✅ This is the correct list of all 7 primitive types in JS.',
            orderIndex: 9
        },
        {
            id: generateId('answer-js-objects-always-new-keyword'),
            questionId: questionId,
            textUk: "Об'єкти завжди створюються через ключове слово new.",
            textEn: 'Objects are always created using the new keyword.',
            isCorrect: false,
            theoryUk: "❌ Це помилка: об'єкти можна створювати літералами `{}`, масивами `[]` чи навіть функціями, не тільки через `new`.",
            theoryEn: '❌ Incorrect: objects can be created with literals `{}`, arrays `[]`, or functions, not only with `new`.',
            orderIndex: 10
        }
    ];

    for (const answer of answers) {
        await prisma.answer.upsert({
            where: { id: answer.id },
            update: {
                textUk: answer.textUk,
                textEn: answer.textEn,
                isCorrect: answer.isCorrect,
                theoryUk: answer.theoryUk,
                theoryEn: answer.theoryEn,
                orderIndex: answer.orderIndex
            },
            create: answer
        });
        console.log(`✅ Answer ${answer.orderIndex} seeded`);
    }

    // Add question to book
    console.log('📖 Adding question to book...');

    const bookId = generateId('book-javascript-frontend');

    await prisma.bookQuestion.upsert({
        where: {
            bookId_questionId: {
                bookId: bookId,
                questionId: questionId
            }
        },
        update: {
            orderIndex: 1
        },
        create: {
            bookId: bookId,
            questionId: questionId,
            orderIndex: 1
        }
    });

    console.log('✅ Question added to book');
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
