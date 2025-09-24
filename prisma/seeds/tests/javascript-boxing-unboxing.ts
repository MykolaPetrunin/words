import { QuestionMock } from '../types';

export const tests: QuestionMock[] = [
    {
        textUK: 'Що таке boxing у JavaScript?',
        textEN: 'What is boxing in JavaScript?',
        theoryUK:
            "### Boxing у JavaScript\n\n**Boxing** – це процес, коли примітив автоматично обгортається в об'єкт відповідного типу для надання доступу до методів.\n\nНаприклад:\n```js\nconst str = 'hello';\nconsole.log(str.toUpperCase()); // 'HELLO'\n```\nТут `'hello'` є рядком-примітивом, але виклик методу `toUpperCase()` можливий завдяки тому, що JS **тимчасово створює об'єкт String**.\n\n> Цей об'єкт існує лише під час виклику методу, після чого знищується.",
        theoryEN:
            "### Boxing in JavaScript\n\n**Boxing** is the process where a primitive value is automatically wrapped in an object of its corresponding type to provide access to methods.\n\nExample:\n```js\nconst str = 'hello';\nconsole.log(str.toUpperCase()); // 'HELLO'\n```\nHere `'hello'` is a primitive string, but calling `toUpperCase()` works because JS **temporarily creates a String object**.\n\n> This object exists only during the method call and is then discarded.",
        level: 'middle',
        answers: [
            {
                textUK: "Це процес автоматичного обгортання примітива в об'єкт для надання доступу до методів.",
                textEN: 'It is the process of automatically wrapping a primitive into an object to provide access to methods.',
                theoryUK: '✅ Це правильне визначення boxing.',
                theoryEN: '✅ This is the correct definition of boxing.',
                isCorrect: true
            },
            {
                textUK: "Це процес перетворення об'єкта у JSON.",
                textEN: 'It is the process of converting an object into JSON.',
                theoryUK: '❌ Це плутанина з серіалізацією (`JSON.stringify`).',
                theoryEN: '❌ This confuses boxing with serialization (`JSON.stringify`).',
                isCorrect: false
            },
            {
                textUK: "Це коли примітив завжди зберігається в пам'яті як об'єкт.",
                textEN: 'It is when a primitive is always stored in memory as an object.',
                theoryUK: "❌ Примітиви зберігаються напряму, а не як об'єкти. Обгортання відбувається тимчасово лише при доступі до методів.",
                theoryEN: '❌ Primitives are stored directly, not as objects. Wrapping happens temporarily only when accessing methods.',
                isCorrect: false
            },
            {
                textUK: 'Це процес перетворення числа у рядок.',
                textEN: 'It is the process of converting a number into a string.',
                theoryUK: '❌ Це перетворення типів (type casting), а не boxing.',
                theoryEN: '❌ This is type casting, not boxing.',
                isCorrect: false
            },
            {
                textUK: 'Boxing виконується тільки вручну за допомогою конструктора.',
                textEN: 'Boxing is done only manually using a constructor.',
                theoryUK: '❌ Автоматичний boxing відбувається завжди при зверненні до методів примітива.',
                theoryEN: "❌ Automatic boxing happens whenever a primitive's method is accessed.",
                isCorrect: false
            },
            {
                textUK: 'Boxing відбувається автоматично і тимчасово.',
                textEN: 'Boxing happens automatically and temporarily.',
                theoryUK: "✅ Це правильна характеристика — JS створює об'єкт лише на час виклику.",
                theoryEN: '✅ Correct — JS creates an object only for the duration of the call.',
                isCorrect: true
            },
            {
                textUK: 'Boxing застосовується лише до чисел.',
                textEN: 'Boxing applies only to numbers.',
                theoryUK: '❌ Boxing працює і для рядків, і для boolean, і для символів.',
                theoryEN: '❌ Boxing works for strings, booleans, and symbols as well.',
                isCorrect: false
            },
            {
                textUK: 'Boxing потрібен для роботи з методами примітивів.',
                textEN: 'Boxing is necessary for working with primitive methods.',
                theoryUK: '✅ Вірно: без цього примітиви не мали б методів, таких як `.toUpperCase()`, `.toFixed()`.',
                theoryEN: '✅ Correct: without it, primitives would not have methods like `.toUpperCase()`, `.toFixed()`.',
                isCorrect: true
            },
            {
                textUK: 'Boxing відбувається лише при порівнянні значень.',
                textEN: 'Boxing only happens when comparing values.',
                theoryUK: "❌ При порівнянні boxing не обов'язковий, це різні механізми.",
                theoryEN: "❌ Boxing is not required for comparison, that's a different mechanism.",
                isCorrect: false
            },
            {
                textUK: 'Boxing відбувається тільки при використанні strict mode.',
                textEN: 'Boxing happens only when using strict mode.',
                theoryUK: '❌ Boxing не залежить від strict mode.',
                theoryEN: '❌ Boxing does not depend on strict mode.',
                isCorrect: false
            }
        ]
    },
    {
        textUK: 'Що таке unboxing у JavaScript?',
        textEN: 'What is unboxing in JavaScript?',
        theoryUK:
            "### Unboxing у JavaScript\n\n**Unboxing** – це зворотний процес, коли з об'єкта-обгортки отримується примітивне значення.\n\nВін відбувається:\n- при **неявному приведенні типів** (наприклад, арифметика або конкатенація);\n- при виклику `valueOf()` чи `toString()`.\n\nПриклад:\n```js\nconst numObj = new Number(42);\nconsole.log(numObj + 1); // 43 (автоматичний unboxing)\nconsole.log(numObj.valueOf()); // 42\n```",
        theoryEN:
            '### Unboxing in JavaScript\n\n**Unboxing** is the reverse process, where the primitive value is extracted from its object wrapper.\n\nIt happens:\n- during **implicit type coercion** (e.g., arithmetic or concatenation);\n- when calling `valueOf()` or `toString()`.\n\nExample:\n```js\nconst numObj = new Number(42);\nconsole.log(numObj + 1); // 43 (automatic unboxing)\nconsole.log(numObj.valueOf()); // 42\n```',
        level: 'middle',
        answers: [
            {
                textUK: "Це процес отримання примітива з об'єкта-обгортки.",
                textEN: 'It is the process of extracting a primitive from its wrapper object.',
                theoryUK: '✅ Це правильне визначення unboxing.',
                theoryEN: '✅ This is the correct definition of unboxing.',
                isCorrect: true
            },
            {
                textUK: "Це процес обгортання примітива в об'єкт.",
                textEN: 'It is the process of wrapping a primitive into an object.',
                theoryUK: '❌ Це визначення boxing, а не unboxing.',
                theoryEN: '❌ This is boxing, not unboxing.',
                isCorrect: false
            },
            {
                textUK: 'Unboxing виконується лише вручну через метод `toPrimitive()`.',
                textEN: 'Unboxing is performed only manually via the `toPrimitive()` method.',
                theoryUK: '❌ Unboxing може бути як автоматичним, так і через `valueOf` чи `toString`, не лише через `toPrimitive`.',
                theoryEN: '❌ Unboxing can happen automatically, or via `valueOf`/`toString`, not just `toPrimitive`.',
                isCorrect: false
            },
            {
                textUK: 'Unboxing застосовується тільки до рядків.',
                textEN: 'Unboxing applies only to strings.',
                theoryUK: '❌ Unboxing працює для Number, Boolean, String, Symbol тощо.',
                theoryEN: '❌ Unboxing works for Number, Boolean, String, Symbol, etc.',
                isCorrect: false
            },
            {
                textUK: "Unboxing потрібен для виконання арифметичних операцій з об'єктами-обгортками.",
                textEN: 'Unboxing is necessary for performing arithmetic operations with wrapper objects.',
                theoryUK: '✅ Правильно: без unboxing ви не могли б робити `new Number(5) + 1`.',
                theoryEN: "✅ Correct: without unboxing, you couldn't do `new Number(5) + 1`.",
                isCorrect: true
            },
            {
                textUK: 'Unboxing завжди відбувається при присвоєнні значень.',
                textEN: 'Unboxing always happens when assigning values.',
                theoryUK: '❌ При присвоєнні значення зберігається як є, unboxing не завжди виконується.',
                theoryEN: "❌ Assignment keeps the value as is; unboxing doesn't always happen.",
                isCorrect: false
            },
            {
                textUK: 'Unboxing залежить від strict mode.',
                textEN: 'Unboxing depends on strict mode.',
                theoryUK: '❌ Unboxing не залежить від strict mode.',
                theoryEN: '❌ Unboxing does not depend on strict mode.',
                isCorrect: false
            },
            {
                textUK: 'Unboxing виконується автоматично під час конкатенації рядків.',
                textEN: 'Unboxing happens automatically during string concatenation.',
                theoryUK: "✅ Це правильна характеристика: `new String('Hi') + '!'` дає `'Hi!'` завдяки unboxing.",
                theoryEN: "✅ Correct: `new String('Hi') + '!' ` results in `'Hi!'` due to unboxing.",
                isCorrect: true
            },
            {
                textUK: 'Unboxing відбувається тільки якщо викликати `JSON.stringify()`.',
                textEN: 'Unboxing only happens when calling `JSON.stringify()`.',
                theoryUK: '❌ `JSON.stringify()` може викликати `toString`, але це не єдиний випадок unboxing.',
                theoryEN: "❌ `JSON.stringify()` may call `toString`, but that's not the only case of unboxing.",
                isCorrect: false
            },
            {
                textUK: "Unboxing застосовується до будь-якого об'єкта в JS.",
                textEN: 'Unboxing applies to any object in JS.',
                theoryUK: "❌ Unboxing стосується саме об'єктів-обгорток примітивів, а не будь-яких об'єктів.",
                theoryEN: '❌ Unboxing is specific to wrapper objects of primitives, not arbitrary objects.',
                isCorrect: false
            }
        ]
    }
];
