import { TopicMock } from '../types';

export const tests: TopicMock = {
    titleUK: 'Boxing/Unboxing',
    titleEN: 'Boxing/Unboxing',
    questions: [
        {
            textUK: 'Що таке boxing у JavaScript?',
            textEN: 'What is boxing in JavaScript?',
            theoryUK:
                '# Boxing у JavaScript\n\n## Визначення\nBoxing у JavaScript — це процес, коли **примітивне значення** автоматично обгортається в **об’єкт відповідного типу**, щоб можна було викликати методи та властивості.\n\nПриклад:\n```js\nconst str = "hello";\nconsole.log(str.toUpperCase()); // "HELLO"\n```\nТут `"hello"` — це примітивний рядок, але JavaScript тимчасово створює об’єкт `String`, щоб надати доступ до методу `toUpperCase()`.\n\n---\n\n## Типи, що підлягають boxing\n- `string` → `String`\n- `number` → `Number`\n- `boolean` → `Boolean`\n- `symbol` → `Symbol`\n- `bigint` → `BigInt`\n\n---\n\n## Процес\n1. JavaScript створює тимчасовий об’єкт-обгортку (всередині щось типу `new String("hello")`).  \n2. Викликає потрібний метод із прототипу обгортки.  \n3. Викидає цей тимчасовий об’єкт після виклику.\n\n---\n\n## Unboxing\nUnboxing — це зворотний процес: отримання примітивного значення з об’єкта-обгортки через внутрішні методи `valueOf()` або `toString()`.\n\nПриклад:\n```js\nconst num = new Number(42);\nconsole.log(num.valueOf()); // 42\n```\n\n---\n\n## Важливі зауваження\n- **Автоматичний boxing** відбувається лише за потреби (наприклад, при виклику методу у примітивів).  \n- **Явний boxing** за допомогою конструкторів `new String("x")` чи `new Number(123)` небажаний, адже створює справжні об’єкти, а не примітиви, що може спричиняти баги.\n\nПриклад:\n```js\nconsole.log(typeof "x");            // "string"\nconsole.log(typeof new String("x")); // "object"\n```\n\n---\n\n## Підсумок\n- Boxing = примітив → тимчасовий об’єкт-обгортка (для доступу до методів/властивостей).  \n- Unboxing = об’єкт-обгортка → примітивне значення.  \n- Використовуй примітиви напряму; уникай явного `new String`, `new Number` тощо.\n',
            theoryEN:
                '# Boxing in JavaScript\n\n## Definition\nBoxing in JavaScript is the process where a **primitive value** is automatically wrapped into an **object of its corresponding type** so that methods and properties can be accessed.\n\nExample:\n```js\nconst str = "hello";\nconsole.log(str.toUpperCase()); // "HELLO"\n```\nHere `"hello"` is a primitive string, but JavaScript temporarily creates a `String` object to provide access to the method `toUpperCase()`.\n\n---\n\n## Types that can be boxed\n- `string` → `String`\n- `number` → `Number`\n- `boolean` → `Boolean`\n- `symbol` → `Symbol`\n- `bigint` → `BigInt`\n\n---\n\n## Process\n1. JavaScript creates a temporary wrapper object (e.g. `new String("hello")` internally).\n2. Calls the required method from the wrapper\'s prototype.\n3. Discards the temporary object after the call.\n\n---\n\n## Unboxing\nUnboxing is the opposite process: retrieving the primitive value from the wrapper object using internal methods like `valueOf()` or `toString()`.\n\nExample:\n```js\nconst num = new Number(42);\nconsole.log(num.valueOf()); // 42\n```\n\n---\n\n## Important Notes\n- **Automatic boxing** happens only when needed (e.g., calling methods on primitives).\n- **Explicit boxing** using constructors like `new String("x")` or `new Number(123)` is discouraged because they create real objects, not primitives, which can lead to bugs.\n\nExample:\n```js\nconsole.log(typeof "x");            // "string"\nconsole.log(typeof new String("x")); // "object"\n```\n\n---\n\n## Summary\n- Boxing = primitive → temporary object wrapper (to access methods/properties).  \n- Unboxing = object wrapper → primitive value.  \n- Use primitives directly; avoid manual `new String`, `new Number`, etc.\n',
            level: 'middle',
            answers: [
                {
                    textUK: "Це процес автоматичного обгортання примітива в об'єкт для надання доступу до методів.",
                    textEN: 'It is the process of automatically wrapping a primitive into an object to provide access to methods.',
                    theoryUK:
                        '✅ Boxing — це автоматична і тимчасова обгортка примітивів (string, number, boolean, symbol, bigint) у відповідні об’єкти (String, Number, Boolean, Symbol, BigInt), що дає змогу викликати методи та читати властивості. Обгортка створюється під час доступу до методу/властивості та одразу відкидається після завершення операції. null та undefined не бокситься.',
                    theoryEN:
                        '✅ Boxing is the automatic and temporary wrapping of primitives (string, number, boolean, symbol, bigint) into their object counterparts (String, Number, Boolean, Symbol, BigInt) to enable method/property access. The wrapper is created when needed and immediately discarded after use. null and undefined are not boxed.',
                    isCorrect: true
                },
                {
                    textUK: "Це процес перетворення об'єкта у JSON.",
                    textEN: 'It is the process of converting an object into JSON.',
                    theoryUK:
                        '❌ Це серіалізація (`JSON.stringify`), яка перетворює значення у текстовий формат JSON для зберігання або передачі. Вона не має відношення до тимчасових обгорток примітивів і не є boxing.',
                    theoryEN:
                        '❌ This is serialization (`JSON.stringify`), which converts values into a JSON string for storage or transfer. It is unrelated to the temporary wrappers created for primitives and is not boxing.',
                    isCorrect: false
                },
                {
                    textUK: "Це коли примітив завжди зберігається в пам'яті як об'єкт.",
                    textEN: 'It is when a primitive is always stored in memory as an object.',
                    theoryUK:
                        '❌ Примітиви (string, number, boolean, symbol, bigint) зберігаються напряму як значення, а не як об’єкти. Boxing створює тимчасову обгортку лише під час виклику методів або доступу до властивостей.',
                    theoryEN:
                        '❌ Primitives (string, number, boolean, symbol, bigint) are stored directly as values, not as objects. Boxing only creates a temporary wrapper when accessing methods or properties.',
                    isCorrect: false
                },
                {
                    textUK: 'Це процес перетворення числа у рядок.',
                    textEN: 'It is the process of converting a number into a string.',
                    theoryUK:
                        "❌ Це приклад перетворення типів (type casting), наприклад `String(42)` або `42 + ''`. Boxing же стосується тимчасового обгортання примітивів у відповідні об’єкти для доступу до їх методів.",
                    theoryEN:
                        "❌ This is type casting, for example `String(42)` or `42 + ''`. Boxing instead refers to temporarily wrapping primitives in their corresponding objects to access their methods.",
                    isCorrect: false
                },
                {
                    textUK: 'Boxing виконується тільки вручну за допомогою конструктора.',
                    textEN: 'Boxing is done only manually using a constructor.',
                    theoryUK:
                        '❌ Використання `new String("x")` чи `new Number(123)` створює справжні об’єкти, але це не типовий boxing. Автоматичний boxing відбувається завжди, коли примітив викликає метод або властивість.',
                    theoryEN:
                        '❌ Using `new String("x")` or `new Number(123)` creates real objects, but that is not the typical boxing. Automatic boxing happens whenever a primitive\'s method or property is accessed.',
                    isCorrect: false
                },
                {
                    textUK: 'Boxing відбувається автоматично і тимчасово.',
                    textEN: 'Boxing happens automatically and temporarily.',
                    theoryUK:
                        '✅ Правильно: JavaScript сам створює тимчасову обгортку навколо примітива для доступу до методів, і одразу її викидає після завершення виклику.',
                    theoryEN:
                        '✅ Correct: JavaScript automatically creates a temporary wrapper around the primitive to access methods, and immediately discards it after the call is finished.',
                    isCorrect: true
                },
                {
                    textUK: 'Boxing застосовується лише до чисел.',
                    textEN: 'Boxing applies only to numbers.',
                    theoryUK: '❌ Boxing застосовується до кількох примітивних типів: рядків, чисел, логічних значень, символів і BigInt, а не тільки до чисел.',
                    theoryEN: '❌ Boxing applies to several primitive types: strings, numbers, booleans, symbols, and BigInt, not just numbers.',
                    isCorrect: false
                },
                {
                    textUK: 'Boxing потрібен для роботи з методами примітивів.',
                    textEN: 'Boxing is necessary for working with primitive methods.',
                    theoryUK:
                        '✅ Вірно: без boxing примітиви не мали б методів. Завдяки тимчасовій обгортці ми можемо викликати `.toUpperCase()` для рядків чи `.toFixed()` для чисел.',
                    theoryEN:
                        '✅ Correct: without boxing, primitives would not have methods. Thanks to temporary wrappers, we can call `.toUpperCase()` on strings or `.toFixed()` on numbers.',
                    isCorrect: true
                },
                {
                    textUK: 'Boxing відбувається лише при порівнянні значень.',
                    textEN: 'Boxing only happens when comparing values.',
                    theoryUK:
                        '❌ При порівнянні значень boxing не потрібен. Це інші механізми JavaScript (оператори порівняння, алгоритми абстрактного порівняння). Boxing пов’язаний тільки з доступом до методів/властивостей примітивів.',
                    theoryEN:
                        '❌ Boxing is not required when comparing values. Comparisons rely on different JavaScript mechanisms (comparison operators, abstract equality/strict equality algorithms). Boxing is only related to accessing primitive methods/properties.',
                    isCorrect: false
                },
                {
                    textUK: 'Boxing відбувається тільки при використанні strict mode.',
                    textEN: 'Boxing happens only when using strict mode.',
                    theoryUK: '❌ Boxing не залежить від strict mode. Він завжди відбувається автоматично під час доступу до методів примітивів.',
                    theoryEN: '❌ Boxing does not depend on strict mode. It always happens automatically whenever methods on primitives are accessed.',
                    isCorrect: false
                }
            ]
        },
        {
            textUK: 'Що таке unboxing у JavaScript?',
            textEN: 'What is unboxing in JavaScript?',
            theoryUK:
                '# Unboxing у JavaScript\n\n## Визначення\n\n**Unboxing** — це процес, коли з об\'єкта-обгортки (наприклад, `new Number(42)`) отримується його примітивне значення.  \nЦе зворотний процес до boxing.\n\n---\n\n## Де застосовується\n\n- **Арифметика**: при використанні операторів `+`, `-`, `*`, `/` тощо з об\'єктами-обгортками\n- **Конкатенація**: при додаванні рядків\n- **Порівняння**: при нестрогих порівняннях (`==`)\n- **Явні методи**: при виклику `valueOf()` чи `toString()`\n\n---\n\n## Приклади\n\n```js\nconst numObj = new Number(42);\n\n// Автоматичний unboxing при арифметиці\nconsole.log(numObj + 1); // 43\n\n// Автоматичний unboxing при конкатенації\nconst strObj = new String("Hi");\nconsole.log(strObj + "!"); // "Hi!"\n\n// Явний unboxing\nconsole.log(numObj.valueOf()); // 42\nconsole.log(strObj.toString()); // "Hi"\n```\n\n---\n\n## Як працює\n\nUnboxing реалізований через внутрішній алгоритм **ToPrimitive**.  \nВін намагається викликати спочатку `valueOf()`, а якщо результат не примітив — тоді `toString()`.\n\n---\n\n## Типи, що підтримують unboxing\n\n- `Number` → number\n- `String` → string\n- `Boolean` → boolean\n- `Symbol` → symbol\n- `BigInt` → bigint\n\n⚠️ `null` і `undefined` не мають об\'єктів-обгорток, тому unboxing до них не застосовується.\n\n---\n\n## Підсумок\n\n- **Unboxing** = об\'єкт-обгортка → примітивне значення\n- Відбувається як автоматично (арифметика, конкатенація, порівняння), так і явно (`valueOf`, `toString`)\n- Ґрунтується на внутрішньому механізмі `ToPrimitive`\n',
            theoryEN:
                '# Unboxing in JavaScript\n\n## Definition\n**Unboxing** is the process of retrieving the primitive value from a wrapper object (e.g., `new Number(42)`).  \nIt is the reverse process of boxing.\n\n---\n\n## Where it happens\n- **Arithmetic**: when using `+`, `-`, `*`, `/` with wrapper objects.  \n- **Concatenation**: when adding strings.  \n- **Comparisons**: in loose equality (`==`).  \n- **Explicit methods**: when calling `valueOf()` or `toString()`.\n\n---\n\n## Examples\n```js\nconst numObj = new Number(42);\n\n// Automatic unboxing in arithmetic\nconsole.log(numObj + 1); // 43\n\n// Automatic unboxing in concatenation\nconst strObj = new String("Hi");\nconsole.log(strObj + "!"); // "Hi!"\n\n// Explicit unboxing\nconsole.log(numObj.valueOf()); // 42\nconsole.log(strObj.toString()); // "Hi"\n```\n\n---\n\n## How it works\nUnboxing relies on the internal **ToPrimitive** algorithm.  \nIt first tries `valueOf()`, and if that does not return a primitive, it then calls `toString()`.\n\n---\n\n## Types that support unboxing\n- `Number` → number  \n- `String` → string  \n- `Boolean` → boolean  \n- `Symbol` → symbol  \n- `BigInt` → bigint  \n\n⚠️ `null` and `undefined` do not have wrapper objects and cannot be unboxed.\n\n---\n\n## Summary\n- Unboxing = wrapper object → primitive value.  \n- Happens automatically (arithmetic, concatenation, comparisons) or explicitly (`valueOf`, `toString`).  \n- Based on the internal `ToPrimitive` mechanism.\n',
            level: 'middle',
            answers: [
                {
                    textUK: "Це процес отримання примітива з об'єкта-обгортки.",
                    textEN: 'It is the process of extracting a primitive from its wrapper object.',
                    theoryUK:
                        '✅ Це правильне визначення: Unboxing — це зворотний процес до boxing. Він дозволяє отримати примітивне значення (наприклад, число, рядок, булеве) з об’єкта-обгортки (`Number`, `String`, `Boolean`, `Symbol`, `BigInt`).',
                    theoryEN:
                        '✅ This is correct: Unboxing is the reverse process of boxing. It retrieves the primitive value (e.g., number, string, boolean) from a wrapper object (`Number`, `String`, `Boolean`, `Symbol`, `BigInt`).',
                    isCorrect: true
                },
                {
                    textUK: "Це процес обгортання примітива в об'єкт.",
                    textEN: 'It is the process of wrapping a primitive into an object.',
                    theoryUK: '❌ Це плутанина з boxing. Boxing створює тимчасову обгортку навколо примітива, а Unboxing — навпаки, витягує примітив із обгортки.',
                    theoryEN:
                        '❌ This confuses it with boxing. Boxing creates a temporary wrapper around a primitive, while Unboxing does the opposite — extracts the primitive from the wrapper.',
                    isCorrect: false
                },
                {
                    textUK: 'Unboxing виконується лише вручну через метод `toPrimitive()`.',
                    textEN: 'Unboxing is performed only manually via the `toPrimitive()` method.',
                    theoryUK:
                        "❌ Unboxing може відбуватися автоматично (наприклад, у виразах `new Number(5) + 1` чи `'Hello ' + new String('World')`). Також можна викликати `valueOf()` чи `toString()`. Внутрішній алгоритм `ToPrimitive` визначає порядок викликів, але це не єдиний спосіб.",
                    theoryEN:
                        "❌ Unboxing can happen automatically (e.g., in `new Number(5) + 1` or `'Hello ' + new String('World')`). It can also be done explicitly using `valueOf()` or `toString()`. The internal `ToPrimitive` algorithm drives this, but it is not the only way.",
                    isCorrect: false
                },
                {
                    textUK: 'Unboxing застосовується тільки до рядків.',
                    textEN: 'Unboxing applies only to strings.',
                    theoryUK:
                        '❌ Unboxing застосовується не лише до рядків. Він працює з усіма обгортками примітивів: `Number`, `String`, `Boolean`, `Symbol`, `BigInt`. `null` і `undefined` не мають обгорток.',
                    theoryEN:
                        '❌ Unboxing is not limited to strings. It applies to all primitive wrappers: `Number`, `String`, `Boolean`, `Symbol`, `BigInt`. `null` and `undefined` do not have wrappers.',
                    isCorrect: false
                },
                {
                    textUK: "Unboxing потрібен для виконання арифметичних операцій з об'єктами-обгортками.",
                    textEN: 'Unboxing is necessary for performing arithmetic operations with wrapper objects.',
                    theoryUK:
                        '✅ Вірно: коли ви використовуєте об’єкт-обгортку в арифметичному виразі, JavaScript виконує unboxing, щоб отримати примітивне число і продовжити обчислення.',
                    theoryEN:
                        '✅ Correct: when using a wrapper object in an arithmetic expression, JavaScript performs unboxing to obtain the primitive number and continue the calculation.',
                    isCorrect: true
                },
                {
                    textUK: 'Unboxing завжди відбувається при присвоєнні значень.',
                    textEN: 'Unboxing always happens when assigning values.',
                    theoryUK:
                        '❌ При присвоєнні об’єкта-обгортки змінній (`const x = new Number(10)`) змінна зберігає саме об’єкт, а не примітив. Unboxing відбувається лише у випадках, коли потрібно саме примітивне значення.',
                    theoryEN:
                        '❌ When assigning a wrapper object to a variable (`const x = new Number(10)`), the variable stores the object itself, not the primitive. Unboxing happens only when a primitive is required.',
                    isCorrect: false
                },
                {
                    textUK: 'Unboxing залежить від strict mode.',
                    textEN: 'Unboxing depends on strict mode.',
                    theoryUK: '❌ Unboxing не залежить від `strict mode`. Він відбувається завжди, коли контекст вимагає примітивне значення.',
                    theoryEN: '❌ Unboxing does not depend on `strict mode`. It always happens whenever a primitive value is required.',
                    isCorrect: false
                },
                {
                    textUK: 'Unboxing виконується автоматично під час конкатенації рядків.',
                    textEN: 'Unboxing happens automatically during string concatenation.',
                    theoryUK: "✅ Правильно: якщо використати `new String('Hi') + '!'`, відбувається unboxing і результатом стає `'Hi!'`.",
                    theoryEN: "✅ Correct: if you use `new String('Hi') + '!'`, unboxing occurs and the result is `'Hi!'`.",
                    isCorrect: true
                },
                {
                    textUK: 'Unboxing відбувається тільки якщо викликати `JSON.stringify()`.',
                    textEN: 'Unboxing only happens when calling `JSON.stringify()`.',
                    theoryUK:
                        '❌ `JSON.stringify()` може викликати `toString` або `valueOf`, але це лише один із випадків. Unboxing також відбувається у багатьох інших сценаріях: арифметика, порівняння, конкатенація.',
                    theoryEN:
                        '❌ `JSON.stringify()` may call `toString` or `valueOf`, but that is only one case. Unboxing also happens in many other scenarios: arithmetic, comparisons, concatenation.',
                    isCorrect: false
                },
                {
                    textUK: "Unboxing застосовується до будь-якого об'єкта в JS.",
                    textEN: 'Unboxing applies to any object in JS.',
                    theoryUK:
                        '❌ Unboxing застосовується саме до об’єктів-обгорток примітивів (`Number`, `String`, `Boolean`, `Symbol`, `BigInt`). Звичайні об’єкти не розкриваються у примітиви, окрім випадків, коли вони реалізують власні `valueOf` або `toString`.',
                    theoryEN:
                        '❌ Unboxing applies specifically to wrapper objects of primitives (`Number`, `String`, `Boolean`, `Symbol`, `BigInt`). Regular objects are not unboxed, except if they implement their own `valueOf` or `toString`.',
                    isCorrect: false
                }
            ]
        }
    ]
};
