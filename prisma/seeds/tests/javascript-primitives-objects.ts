import { QuestionMock } from '../types';

export const tests: QuestionMock[] = [
    {
        textUK: "JavaScript: Примітиви та об'єкти",
        textEN: 'JavaScript: Primitives and Objects',
        theoryUK:
            "У JavaScript **примітиви** є незмінними (immutable) значеннями. До них належать: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. Вони зберігають значення безпосередньо. \n\n**Об'єкти** ж є змінними (mutable) структурами, які зберігаються за посиланням. Це означає, що коли ви передаєте об'єкт у змінну або функцію, ви фактично передаєте посилання на нього, а не копію самого значення.\n\n✅ Основна різниця: примітиви копіюються за значенням, а об'єкти — за посиланням.",
        theoryEN:
            'In JavaScript, **primitives** are immutable values. They include: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. They store the actual value directly.\n\n**Objects**, on the other hand, are mutable structures stored by reference. This means when you assign or pass an object, you are working with its reference, not a separate copy.\n\n✅ Main difference: primitives are copied by value, while objects are copied by reference.',
        level: 'junior',
        answers: [
            {
                textUK: "Примітиви зберігаються за значенням, а об'єкти — за посиланням.",
                textEN: 'Primitives are stored by value, while objects are stored by reference.',
                theoryUK: "Це правильна відповідь: у випадку з примітивами зберігається саме значення, а об'єкти передаються через посилання.",
                theoryEN: 'This is the correct answer: primitives store the actual value, while objects are passed by reference.',
                isCorrect: true
            },
            {
                textUK: "Примітиви є змінними, а об'єкти — незмінними.",
                textEN: 'Primitives are mutable, while objects are immutable.',
                theoryUK: "❌ Це помилка: усе навпаки. Примітиви незмінні, а об'єкти можна змінювати.",
                theoryEN: "❌ Incorrect: it's the opposite. Primitives are immutable, while objects are mutable.",
                isCorrect: false
            },
            {
                textUK: "Об'єкти зберігають значення напряму, а примітиви — посилання.",
                textEN: 'Objects store values directly, while primitives store references.',
                theoryUK: "❌ Це помилка: примітиви зберігають значення напряму, об'єкти — лише посилання.",
                theoryEN: '❌ Incorrect: primitives store values directly, while objects store references.',
                isCorrect: false
            },
            {
                textUK: "Примітиви створюються за допомогою конструктора, а об'єкти — безпосередньо.",
                textEN: 'Primitives are created using constructors, while objects are created directly.',
                theoryUK: "❌ Це помилка: примітиви створюються літералами (`42`, `'text'`), а об'єкти — через літерали `{}` або конструктори `new Object()`.",
                theoryEN:
                    "❌ Incorrect: primitives are usually created with literals (`42`, `'text'`), while objects can be created with literals `{}` or constructors like `new Object()`.",
                isCorrect: false
            },
            {
                textUK: "Примітиви не мають методів, а об'єкти мають.",
                textEN: "Primitives don't have methods, while objects do.",
                theoryUK: "❌ Це неточність: примітиви мають методи завдяки автоматичному boxing у тимчасові об'єкти (`'text'.toUpperCase()`).",
                theoryEN: "❌ Not entirely correct: primitives do have methods via automatic boxing into temporary objects (`'text'.toUpperCase()`).",
                isCorrect: false
            },
            {
                textUK: "Об'єкти завжди займають більше пам'яті ніж примітиви.",
                textEN: 'Objects always take more memory than primitives.',
                theoryUK: "❌ Це перебільшення: хоча об'єкти зазвичай важчі, точне споживання пам'яті залежить від реалізації двигуна JS.",
                theoryEN: '❌ This is an oversimplification: objects are usually heavier, but actual memory usage depends on the JS engine implementation.',
                isCorrect: false
            },
            {
                textUK: "Примітиви завжди порівнюються за значенням, а об'єкти — за посиланням.",
                textEN: 'Primitives are always compared by value, while objects are compared by reference.',
                theoryUK: "✅ Це правильна особливість: два різні об'єкти з однаковими властивостями не будуть рівні (`{a:1} !== {a:1}`).",
                theoryEN: '✅ This is correct: two different objects with the same properties are not equal (`{a:1} !== {a:1}`).',
                isCorrect: true
            },
            {
                textUK: "Примітиви можна клонувати оператором spread, а об'єкти — ні.",
                textEN: 'Primitives can be cloned using the spread operator, but objects cannot.',
                theoryUK:
                    "❌ Неправда: spread (`...`) можна застосовувати до об'єктів (`{...obj}`) та масивів, але він не клонує примітиви, бо вони й так копіюються за значенням.",
                theoryEN: "❌ Incorrect: spread (`...`) works on objects (`{...obj}`) and arrays, primitives don't need cloning since they are copied by value.",
                isCorrect: false
            },
            {
                textUK: 'До примітивів відносяться: string, number, boolean, undefined, symbol, null, bigint.',
                textEN: 'Primitives include: string, number, boolean, undefined, symbol, null, bigint.',
                theoryUK: '✅ Це правильний перелік усіх 7 примітивних типів у JS.',
                theoryEN: '✅ This is the correct list of all 7 primitive types in JS.',
                isCorrect: true
            },
            {
                textUK: "Об'єкти завжди створюються через ключове слово new.",
                textEN: 'Objects are always created using the new keyword.',
                theoryUK: "❌ Це помилка: об'єкти можна створювати літералами `{}`, масивами `[]` чи навіть функціями, не тільки через `new`.",
                theoryEN: '❌ Incorrect: objects can be created with literals `{}`, arrays `[]`, or functions, not only with `new`.',
                isCorrect: false
            }
        ]
    }
];
