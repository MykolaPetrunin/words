/* eslint-disable no-console */
import { createHash } from 'crypto';

import { PrismaClient } from '@prisma/client';

function generateId(content: string): string {
    return createHash('sha256').update(content).digest('hex').substring(0, 16);
}

export async function seedJavaScriptBoxingUnboxing(prisma: PrismaClient): Promise<void> {
    console.log('❓ Seeding JavaScript: Boxing/Unboxing questions...');

    const middleLevelId = generateId('level-middle');
    const bookId = generateId('book-javascript-frontend');

    const boxingQuestionId = generateId('question-js-boxing');
    const boxingQuestion = await prisma.question.upsert({
        where: { id: boxingQuestionId },
        update: {
            textUk: 'Що таке boxing у JavaScript?',
            textEn: 'What is boxing in JavaScript?',
            theoryUk:
                "### Boxing у JavaScript\n\n**Boxing** – це процес, коли примітив автоматично обгортається в об'єкт відповідного типу для надання доступу до методів.\n\nНаприклад:\n```js\nconst str = 'hello';\nconsole.log(str.toUpperCase()); // 'HELLO'\n```\nТут `'hello'` є рядком-примітивом, але виклик методу `toUpperCase()` можливий завдяки тому, що JS **тимчасово створює об'єкт String**.\n\n> Цей об'єкт існує лише під час виклику методу, після чого знищується.",
            theoryEn:
                "### Boxing in JavaScript\n\n**Boxing** is the process where a primitive value is automatically wrapped in an object of its corresponding type to provide access to methods.\n\nExample:\n```js\nconst str = 'hello';\nconsole.log(str.toUpperCase()); // 'HELLO'\n```\nHere `'hello'` is a primitive string, but calling `toUpperCase()` works because JS **temporarily creates a String object**.\n\n> This object exists only during the method call and is then discarded.",
            isActive: true,
            levelId: middleLevelId
        },
        create: {
            id: boxingQuestionId,
            textUk: 'Що таке boxing у JavaScript?',
            textEn: 'What is boxing in JavaScript?',
            theoryUk:
                "### Boxing у JavaScript\n\n**Boxing** – це процес, коли примітив автоматично обгортається в об'єкт відповідного типу для надання доступу до методів.\n\nНаприклад:\n```js\nconst str = 'hello';\nconsole.log(str.toUpperCase()); // 'HELLO'\n```\nТут `'hello'` є рядком-примітивом, але виклик методу `toUpperCase()` можливий завдяки тому, що JS **тимчасово створює об'єкт String**.\n\n> Цей об'єкт існує лише під час виклику методу, після чого знищується.",
            theoryEn:
                "### Boxing in JavaScript\n\n**Boxing** is the process where a primitive value is automatically wrapped in an object of its corresponding type to provide access to methods.\n\nExample:\n```js\nconst str = 'hello';\nconsole.log(str.toUpperCase()); // 'HELLO'\n```\nHere `'hello'` is a primitive string, but calling `toUpperCase()` works because JS **temporarily creates a String object**.\n\n> This object exists only during the method call and is then discarded.",
            isActive: true,
            levelId: middleLevelId
        }
    });

    console.log(`✅ Question "${boxingQuestion.textEn}" seeded`);

    const boxingAnswers = [
        {
            id: generateId('answer-boxing-wrapper-object-for-methods'),
            questionId: boxingQuestionId,
            textUk: "Це процес автоматичного обгортання примітива в об'єкт для надання доступу до методів.",
            textEn: 'It is the process of automatically wrapping a primitive into an object to provide access to methods.',
            isCorrect: true,
            theoryUk: '✅ Це правильне визначення boxing.',
            theoryEn: '✅ This is the correct definition of boxing.',
            orderIndex: 1
        },
        {
            id: generateId('answer-boxing-object-to-json'),
            questionId: boxingQuestionId,
            textUk: "Це процес перетворення об'єкта у JSON.",
            textEn: 'It is the process of converting an object into JSON.',
            isCorrect: false,
            theoryUk: '❌ Це плутанина з серіалізацією (`JSON.stringify`).',
            theoryEn: '❌ This confuses boxing with serialization (`JSON.stringify`).',
            orderIndex: 2
        },
        {
            id: generateId('answer-boxing-primitive-always-stored-as-object'),
            questionId: boxingQuestionId,
            textUk: "Це коли примітив завжди зберігається в пам'яті як об'єкт.",
            textEn: 'It is when a primitive is always stored in memory as an object.',
            isCorrect: false,
            theoryUk: "❌ Примітиви зберігаються напряму, а не як об'єкти. Обгортання відбувається тимчасово лише при доступі до методів.",
            theoryEn: '❌ Primitives are stored directly, not as objects. Wrapping happens temporarily only when accessing methods.',
            orderIndex: 3
        },
        {
            id: generateId('answer-boxing-number-to-string'),
            questionId: boxingQuestionId,
            textUk: 'Це процес перетворення числа у рядок.',
            textEn: 'It is the process of converting a number into a string.',
            isCorrect: false,
            theoryUk: '❌ Це перетворення типів (type casting), а не boxing.',
            theoryEn: '❌ This is type casting, not boxing.',
            orderIndex: 4
        },
        {
            id: generateId('answer-boxing-only-manual-constructor'),
            questionId: boxingQuestionId,
            textUk: 'Boxing виконується тільки вручну за допомогою конструктора.',
            textEn: 'Boxing is done only manually using a constructor.',
            isCorrect: false,
            theoryUk: '❌ Автоматичний boxing відбувається завжди при зверненні до методів примітива.',
            theoryEn: "❌ Automatic boxing happens whenever a primitive's method is accessed.",
            orderIndex: 5
        },
        {
            id: generateId('answer-boxing-automatic-temporary'),
            questionId: boxingQuestionId,
            textUk: 'Boxing відбувається автоматично і тимчасово.',
            textEn: 'Boxing happens automatically and temporarily.',
            isCorrect: true,
            theoryUk: "✅ Це правильна характеристика — JS створює об'єкт лише на час виклику.",
            theoryEn: '✅ Correct — JS creates an object only for the duration of the call.',
            orderIndex: 6
        },
        {
            id: generateId('answer-boxing-only-numbers'),
            questionId: boxingQuestionId,
            textUk: 'Boxing застосовується лише до чисел.',
            textEn: 'Boxing applies only to numbers.',
            isCorrect: false,
            theoryUk: '❌ Boxing працює і для рядків, і для boolean, і для символів.',
            theoryEn: '❌ Boxing works for strings, booleans, and symbols as well.',
            orderIndex: 7
        },
        {
            id: generateId('answer-boxing-needed-for-primitive-methods'),
            questionId: boxingQuestionId,
            textUk: 'Boxing потрібен для роботи з методами примітивів.',
            textEn: 'Boxing is necessary for working with primitive methods.',
            isCorrect: true,
            theoryUk: '✅ Вірно: без цього примітиви не мали б методів, таких як `.toUpperCase()`, `.toFixed()`.',
            theoryEn: '✅ Correct: without it, primitives would not have methods like `.toUpperCase()`, `.toFixed()`.',
            orderIndex: 8
        },
        {
            id: generateId('answer-boxing-only-when-comparing'),
            questionId: boxingQuestionId,
            textUk: 'Boxing відбувається лише при порівнянні значень.',
            textEn: 'Boxing only happens when comparing values.',
            isCorrect: false,
            theoryUk: "❌ При порівнянні boxing не обов'язковий, це різні механізми.",
            theoryEn: "❌ Boxing is not required for comparison, that's a different mechanism.",
            orderIndex: 9
        },
        {
            id: generateId('answer-boxing-only-strict-mode'),
            questionId: boxingQuestionId,
            textUk: 'Boxing відбувається тільки при використанні strict mode.',
            textEn: 'Boxing happens only when using strict mode.',
            isCorrect: false,
            theoryUk: '❌ Boxing не залежить від strict mode.',
            theoryEn: '❌ Boxing does not depend on strict mode.',
            orderIndex: 10
        }
    ];

    const unboxingQuestionId = generateId('question-js-unboxing');
    const unboxingQuestion = await prisma.question.upsert({
        where: { id: unboxingQuestionId },
        update: {
            textUk: 'Що таке unboxing у JavaScript?',
            textEn: 'What is unboxing in JavaScript?',
            theoryUk:
                "### Unboxing у JavaScript\n\n**Unboxing** – це зворотний процес, коли з об'єкта-обгортки отримується примітивне значення.\n\nВін відбувається:\n- при **неявному приведенні типів** (наприклад, арифметика або конкатенація);\n- при виклику `valueOf()` чи `toString()`.\n\nПриклад:\n```js\nconst numObj = new Number(42);\nconsole.log(numObj + 1); // 43 (автоматичний unboxing)\nconsole.log(numObj.valueOf()); // 42\n```",
            theoryEn:
                '### Unboxing in JavaScript\n\n**Unboxing** is the reverse process, where the primitive value is extracted from its object wrapper.\n\nIt happens:\n- during **implicit type coercion** (e.g., arithmetic or concatenation);\n- when calling `valueOf()` or `toString()`.\n\nExample:\n```js\nconst numObj = new Number(42);\nconsole.log(numObj + 1); // 43 (automatic unboxing)\nconsole.log(numObj.valueOf()); // 42\n```',
            isActive: true,
            levelId: middleLevelId
        },
        create: {
            id: unboxingQuestionId,
            textUk: 'Що таке unboxing у JavaScript?',
            textEn: 'What is unboxing in JavaScript?',
            theoryUk:
                "### Unboxing у JavaScript\n\n**Unboxing** – це зворотний процес, коли з об'єкта-обгортки отримується примітивне значення.\n\nВін відбувається:\n- при **неявному приведенні типів** (наприклад, арифметика або конкатенація);\n- при виклику `valueOf()` чи `toString()`.\n\nПриклад:\n```js\nconst numObj = new Number(42);\nconsole.log(numObj + 1); // 43 (автоматичний unboxing)\nconsole.log(numObj.valueOf()); // 42\n```",
            theoryEn:
                '### Unboxing in JavaScript\n\n**Unboxing** is the reverse process, where the primitive value is extracted from its object wrapper.\n\nIt happens:\n- during **implicit type coercion** (e.g., arithmetic or concatenation);\n- when calling `valueOf()` or `toString()`.\n\nExample:\n```js\nconst numObj = new Number(42);\nconsole.log(numObj + 1); // 43 (automatic unboxing)\nconsole.log(numObj.valueOf()); // 42\n```',
            isActive: true,
            levelId: middleLevelId
        }
    });

    console.log(`✅ Question "${unboxingQuestion.textEn}" seeded`);

    const unboxingAnswers = [
        {
            id: generateId('answer-unboxing-extract-primitive-from-wrapper'),
            questionId: unboxingQuestionId,
            textUk: "Це процес отримання примітива з об'єкта-обгортки.",
            textEn: 'It is the process of extracting a primitive from its wrapper object.',
            isCorrect: true,
            theoryUk: '✅ Це правильне визначення unboxing.',
            theoryEn: '✅ This is the correct definition of unboxing.',
            orderIndex: 1
        },
        {
            id: generateId('answer-unboxing-wrap-primitive-to-object'),
            questionId: unboxingQuestionId,
            textUk: "Це процес обгортання примітива в об'єкт.",
            textEn: 'It is the process of wrapping a primitive into an object.',
            isCorrect: false,
            theoryUk: '❌ Це визначення boxing, а не unboxing.',
            theoryEn: '❌ This is boxing, not unboxing.',
            orderIndex: 2
        },
        {
            id: generateId('answer-unboxing-only-manual-toprimitive'),
            questionId: unboxingQuestionId,
            textUk: 'Unboxing виконується лише вручну через метод `toPrimitive()`.',
            textEn: 'Unboxing is performed only manually via the `toPrimitive()` method.',
            isCorrect: false,
            theoryUk: '❌ Unboxing може бути як автоматичним, так і через `valueOf` чи `toString`, не лише через `toPrimitive`.',
            theoryEn: '❌ Unboxing can happen automatically, or via `valueOf`/`toString`, not just `toPrimitive`.',
            orderIndex: 3
        },
        {
            id: generateId('answer-unboxing-only-strings'),
            questionId: unboxingQuestionId,
            textUk: 'Unboxing застосовується тільки до рядків.',
            textEn: 'Unboxing applies only to strings.',
            isCorrect: false,
            theoryUk: '❌ Unboxing працює для Number, Boolean, String, Symbol тощо.',
            theoryEn: '❌ Unboxing works for Number, Boolean, String, Symbol, etc.',
            orderIndex: 4
        },
        {
            id: generateId('answer-unboxing-needed-for-arithmetic'),
            questionId: unboxingQuestionId,
            textUk: "Unboxing потрібен для виконання арифметичних операцій з об'єктами-обгортками.",
            textEn: 'Unboxing is necessary for performing arithmetic operations with wrapper objects.',
            isCorrect: true,
            theoryUk: '✅ Правильно: без unboxing ви не могли б робити `new Number(5) + 1`.',
            theoryEn: "✅ Correct: without unboxing, you couldn't do `new Number(5) + 1`.",
            orderIndex: 5
        },
        {
            id: generateId('answer-unboxing-always-on-assignment'),
            questionId: unboxingQuestionId,
            textUk: 'Unboxing завжди відбувається при присвоєнні значень.',
            textEn: 'Unboxing always happens when assigning values.',
            isCorrect: false,
            theoryUk: '❌ При присвоєнні значення зберігається як є, unboxing не завжди виконується.',
            theoryEn: "❌ Assignment keeps the value as is; unboxing doesn't always happen.",
            orderIndex: 6
        },
        {
            id: generateId('answer-unboxing-depends-strict-mode'),
            questionId: unboxingQuestionId,
            textUk: 'Unboxing залежить від strict mode.',
            textEn: 'Unboxing depends on strict mode.',
            isCorrect: false,
            theoryUk: '❌ Unboxing не залежить від strict mode.',
            theoryEn: '❌ Unboxing does not depend on strict mode.',
            orderIndex: 7
        },
        {
            id: generateId('answer-unboxing-automatic-string-concatenation'),
            questionId: unboxingQuestionId,
            textUk: 'Unboxing виконується автоматично під час конкатенації рядків.',
            textEn: 'Unboxing happens automatically during string concatenation.',
            isCorrect: true,
            theoryUk: "✅ Це правильна характеристика: `new String('Hi') + '!'` дає `'Hi!'` завдяки unboxing.",
            theoryEn: "✅ Correct: `new String('Hi') + '!' ` results in `'Hi!'` due to unboxing.",
            orderIndex: 8
        },
        {
            id: generateId('answer-unboxing-only-json-stringify'),
            questionId: unboxingQuestionId,
            textUk: 'Unboxing відбувається тільки якщо викликати `JSON.stringify()`.',
            textEn: 'Unboxing only happens when calling `JSON.stringify()`.',
            isCorrect: false,
            theoryUk: '❌ `JSON.stringify()` може викликати `toString`, але це не єдиний випадок unboxing.',
            theoryEn: "❌ `JSON.stringify()` may call `toString`, but that's not the only case of unboxing.",
            orderIndex: 9
        },
        {
            id: generateId('answer-unboxing-any-object'),
            questionId: unboxingQuestionId,
            textUk: "Unboxing застосовується до будь-якого об'єкта в JS.",
            textEn: 'Unboxing applies to any object in JS.',
            isCorrect: false,
            theoryUk: "❌ Unboxing стосується саме об'єктів-обгорток примітивів, а не будь-яких об'єктів.",
            theoryEn: '❌ Unboxing is specific to wrapper objects of primitives, not arbitrary objects.',
            orderIndex: 10
        }
    ];

    const allAnswers = [...boxingAnswers, ...unboxingAnswers];

    console.log('💡 Seeding answers...');
    await prisma.answer.createMany({
        data: allAnswers,
        skipDuplicates: true
    });
    console.log(`✅ ${allAnswers.length} answers seeded`);

    console.log('📖 Adding questions to book...');

    await prisma.bookQuestion.upsert({
        where: {
            bookId_questionId: {
                bookId: bookId,
                questionId: boxingQuestionId
            }
        },
        update: {
            orderIndex: 2
        },
        create: {
            bookId: bookId,
            questionId: boxingQuestionId,
            orderIndex: 2
        }
    });

    await prisma.bookQuestion.upsert({
        where: {
            bookId_questionId: {
                bookId: bookId,
                questionId: unboxingQuestionId
            }
        },
        update: {
            orderIndex: 3
        },
        create: {
            bookId: bookId,
            questionId: unboxingQuestionId,
            orderIndex: 3
        }
    });

    console.log('✅ Questions added to book');
}
