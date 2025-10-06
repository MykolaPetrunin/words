import { TopicMock } from '../types';

export const tests: TopicMock = {
    titleUK: 'typeof, instanceof, in, delete',
    titleEN: 'typeof, instanceof, in, delete',
    questions: [
        {
            textUK: 'Що повертає вираз `typeof null` і чому?',
            textEN: 'What does `typeof null` return and why?',
            theoryUK:
                '### Ключова ідея\n`null` — це **примітивне значення**, яке означає свідому відсутність значення. Однак історична помилка в ранній реалізації JavaScript призвела до того, що `typeof null` повертає рядок `"object"`.\n\n### Деталі\n- `typeof` завжди повертає **рядок** з назвою широкої категорії типу.\n- Для об’єктів (звичайних об’єктів, масивів, дат тощо) результат — `"object"`.\n- Для функцій — спеціальний випадок: `"function"`.\n- Для `null` очікувалося б щось на кшталт `"null"`, але через **історичну помилку** (бінарне представлення тегів типів у перших реалізаціях) його трактують як об’єкт, тому результат — `"object"`.\n\n### Наслідки та практичні поради\n- Щоб перевірити саме на `null`, використовуйте **строге порівняння**: `value === null`.\n- Для розрізнення «об’єкт або null» перевіряйте: `value !== null && typeof value === \'object\'`.\n\n### Приклади\n```js\ntypeof null;            // "object"\nnull === null;          // true\ntypeof {};              // "object"\ntypeof [];              // "object"\ntypeof function(){};    // "function"\n```',
            theoryEN:
                '### Key idea\n`null` is a **primitive** that represents an intentional absence of value. Due to a historical bug in early JavaScript engines, `typeof null` returns the string `"object"`.\n\n### Details\n- `typeof` always returns a **string** naming a broad type category.\n- For objects (plain objects, arrays, dates, etc.) the result is `"object"`.\n- For functions there is a special case: `"function"`.\n- For `null`, one would expect `"null"`, but because of a **historic bug** (tagged-pointer encoding in early implementations), it is classified as an object, so the result is `"object"`.\n\n### Implications & tips\n- To check specifically for `null`, use **strict equality**: `value === null`.\n- To distinguish "object or null", test: `value !== null && typeof value === \'object\'`.\n\n### Examples\n```js\ntypeof null;            // "object"\nnull === null;          // true\ntypeof {};              // "object"\ntypeof [];              // "object"\ntypeof function(){};    // "function"\n```',
            answers: [
                {
                    textUK: '`typeof null` повертає `"object"` через історичну помилку мови.',
                    textEN: '`typeof null` returns `"object"` due to a historical language bug.',
                    theoryUK:
                        '✅ **Вірно.** JavaScript з перших версій кодував типи бітовими тегами; `null` мав нульовий вказівник, який співпав з тегом об’єкта — так і залишилось зі зворотної сумісності.',
                    theoryEN:
                        '✅ **Correct.** Early JS engines used tagged pointers; `null` was a zero pointer that matched the object tag, and this stayed for backward compatibility.',
                    isCorrect: true
                },
                {
                    textUK: '`typeof null` повертає `"null"`, бо це примітив.',
                    textEN: '`typeof null` returns `"null"` because it is a primitive.',
                    theoryUK: '❌ **Невірно.** Хоча `null` є примітивом, результат саме `"object"`, а не `"null"`.',
                    theoryEN: '❌ **Incorrect.** `null` is primitive, but the actual result is `"object"`, not `"null"`.',
                    isCorrect: false
                },
                {
                    textUK: '`typeof null` повертає `"undefined"`, бо це відсутність значення.',
                    textEN: '`typeof null` returns `"undefined"` because it means absence of value.',
                    theoryUK: '❌ **Невірно.** Відсутність значення `undefined` має власне `typeof` → `"undefined"`. `null` відрізняється і дає `"object"`.',
                    theoryEN: '❌ **Incorrect.** `undefined` yields `"undefined"`. `null` is different and yields `"object"`.',
                    isCorrect: false
                },
                {
                    textUK: '`typeof null` повертає `"object"`, але це виправили в сучасному JS.',
                    textEN: '`typeof null` returns `"object"`, but this was fixed in modern JS.',
                    theoryUK: '❌ **Невірно.** Це **не виправлено** з міркувань зворотної сумісності.',
                    theoryEN: '❌ **Incorrect.** It has **not** been fixed due to backward compatibility.',
                    isCorrect: false
                },
                {
                    textUK: 'Щоб перевірити саме `null`, треба робити `value === null`, а не спиратися на `typeof`.',
                    textEN: 'To check for `null`, use `value === null` rather than relying on `typeof`.',
                    theoryUK: '✅ **Вірно.** `typeof` тут ненадійний; строге порівняння гарантує точну перевірку.',
                    theoryEN: '✅ **Correct.** `typeof` is unreliable here; strict equality gives a precise check.',
                    isCorrect: true
                },
                {
                    textUK: '`typeof null` повертає `"object"`, бо `null` — це об’єкт-обгортка.',
                    textEN: '`typeof null` returns `"object"` because `null` is a wrapper object.',
                    theoryUK: '❌ **Невірно.** `null` — **примітив**, не об’єкт-обгортка (на відміну від `new Number(…)`, `new String(…)`).',
                    theoryEN: '❌ **Incorrect.** `null` is a **primitive**, not a wrapper object (unlike `new Number(…)`, `new String(…)`).',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Обери всі правильні твердження щодо `typeof` для функцій, `Symbol` та `undefined`.',
            textEN: 'Select all true statements about `typeof` for functions, `Symbol`, and `undefined`.',
            theoryUK:
                '### Огляд `typeof` для спеціальних випадків\n- **Функції**: `typeof` повертає `"function"` для будь-яких викликних сутностей (звичайні функції, стрілкові, генератори, класи — класи технічно функції-конструктори).\n- **Symbol**: для **значення** типу `Symbol` результат — `"symbol"`. Для **конструктора** `Symbol` (сама змінна `Symbol`) — `"function"`.\n- **undefined**: для змінної без значення або літерала `undefined` — `"undefined"`.\n\n### Приклади\n```js\ntypeof function f(){};                // "function"\ntypeof class C {};                    // "function" (класи — синтаксичний цукор над функціями)\ntypeof Symbol(\'x\');                   // "symbol"\ntypeof Symbol;                        // "function" (конструктор/фабрика)\nlet x; typeof x;                      // "undefined"\ntypeof undefined;                     // "undefined"\n```\n\n### Типові пастки\n- `typeof null` **не** `"null"`, а `"object"`.\n- `typeof NaN` → `"number"` (бо це числове значення «не число»).\n- `typeof` **завжди** повертає рядок, ніколи не кидає помилки, і безпечний для **неіснуючих імен**: `typeof notDefined === \'undefined\'`.',
            theoryEN:
                '### `typeof` in special cases\n- **Functions**: `typeof` returns `"function"` for callable entities (regular functions, arrows, generators, classes — classes are constructor functions under the hood).\n- **Symbol**: for a **Symbol value** the result is `"symbol"`. For the **`Symbol` constructor** (the identifier `Symbol`) it is `"function"`.\n- **undefined**: for an uninitialized variable or the `undefined` literal the result is `"undefined"`.\n\n### Examples\n```js\ntypeof function f(){};                // "function"\ntypeof class C {};                    // "function" (classes are sugar over functions)\ntypeof Symbol(\'x\');                   // "symbol"\ntypeof Symbol;                        // "function" (constructor/factory)\nlet x; typeof x;                      // "undefined"\ntypeof undefined;                     // "undefined"\n```\n\n### Common pitfalls\n- `typeof null` is **not** `"null"` but `"object"`.\n- `typeof NaN` → `"number"`.\n- `typeof` **always** returns a string, never throws, and is safe against **undeclared identifiers**: `typeof notDefined === \'undefined\'`.',
            answers: [
                {
                    textUK: "`typeof function(){} === 'function'`",
                    textEN: "`typeof function(){} === 'function'`",
                    theoryUK: '✅ **Вірно.** Для функцій `typeof` має спеціальне значення — `"function"`.',
                    theoryEN: '✅ **Correct.** Functions yield the special `"function"` result.',
                    isCorrect: true
                },
                {
                    textUK: "`typeof class C {} === 'function'`",
                    textEN: "`typeof class C {} === 'function'`",
                    theoryUK: '✅ **Вірно.** Класи — це функції-конструктори з синтаксичним цукром.',
                    theoryEN: '✅ **Correct.** Classes are constructor functions with syntactic sugar.',
                    isCorrect: true
                },
                {
                    textUK: "`typeof Symbol('x') === 'symbol'`",
                    textEN: "`typeof Symbol('x') === 'symbol'`",
                    theoryUK: '✅ **Вірно.** Значення типу `Symbol` має власний тег типу `"symbol"`.',
                    theoryEN: '✅ **Correct.** Symbol values report `"symbol"`.',
                    isCorrect: true
                },
                {
                    textUK: "`typeof Symbol === 'function'`",
                    textEN: "`typeof Symbol === 'function'`",
                    theoryUK: '✅ **Вірно.** Ідентифікатор `Symbol` — це функція-фабрика для створення символів.',
                    theoryEN: '✅ **Correct.** The `Symbol` identifier is a function (factory) that creates symbols.',
                    isCorrect: true
                },
                {
                    textUK: "`typeof undefined === 'undefined'`",
                    textEN: "`typeof undefined === 'undefined'`",
                    theoryUK: '✅ **Вірно.** Це базовий випадок для невизначеного значення.',
                    theoryEN: '✅ **Correct.** This is the canonical `undefined` case.',
                    isCorrect: true
                },
                {
                    textUK: "`typeof Symbol('x') === 'object'`",
                    textEN: "`typeof Symbol('x') === 'object'`",
                    theoryUK: '❌ **Невірно.** Значення `Symbol` **не** об’єкт; вони мають окремий тип і дають `"symbol"`.',
                    theoryEN: '❌ **Incorrect.** A `Symbol` value is **not** an object; it yields `"symbol"`.',
                    isCorrect: false
                },
                {
                    textUK: "`typeof undefined === 'null'`",
                    textEN: "`typeof undefined === 'null'`",
                    theoryUK: '❌ **Невірно.** Для `undefined` повертається `"undefined"`, не `"null"`.',
                    theoryEN: '❌ **Incorrect.** `undefined` yields `"undefined"`, not `"null"`.',
                    isCorrect: false
                },
                {
                    textUK: "`typeof null === 'undefined'`",
                    textEN: "`typeof null === 'undefined'`",
                    theoryUK: '❌ **Невірно.** Це популярна плутанина: `typeof null` → `"object"` (історична помилка).',
                    theoryEN: '❌ **Incorrect.** Common confusion: `typeof null` → `"object"` (historic quirk).',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Які твердження щодо роботи `instanceof` є правильними (особливо для масивів та ланцюга прототипів)? Обери всі правильні варіанти.',
            textEN: 'Which statements about how `instanceof` works are correct (especially for arrays and the prototype chain)? Select all that apply.',
            theoryUK:
                '### Як працює `instanceof`\n`a instanceof Ctor` перевіряє **чи входить `Ctor.prototype` у ланцюг прототипів об’єкта `a`**. Це **не** порівняння за назвою конструктора чи типу.\n\n- Масиви мають прототип `Array.prototype`, який (через ланцюг) наслідує від `Object.prototype`, тому:\n  - `[] instanceof Array === true`\n  - `[] instanceof Object === true`\n- Об’єкти з **null-прототипом**: `Object.create(null) instanceof Object` → `false`, бо в ланцюзі **немає** `Object.prototype`.\n- Крос-реалм (наприклад, різні вікна/iframe): `instanceof` порівнює **точний об’єкт прототипу**, тож `arrFromOtherRealm instanceof Array` може бути `false`.\n- Класи і спадкування: якщо `class B extends A {}`, то `new B() instanceof A` → `true`.\n- Можлива перевизначуваність через `Symbol.hasInstance`, але за замовчуванням діє перевірка ланцюга прототипів.\n\n### Приклади\n```js\n[] instanceof Array;                 // true\n[] instanceof Object;                // true\nObject.create(null) instanceof Object; // false\nclass A {}\nclass B extends A {}\nnew B() instanceof A;                // true\n```',
            theoryEN:
                "### How `instanceof` works\n`a instanceof Ctor` checks **whether `Ctor.prototype` appears in `a`'s prototype chain**. It is **not** about constructor names or simple type tags.\n\n- Arrays have `Array.prototype` which (via the chain) inherits from `Object.prototype`, so:\n  - `[] instanceof Array === true`\n  - `[] instanceof Object === true`\n- Null-prototype objects: `Object.create(null) instanceof Object` → `false` because `Object.prototype` is **not** in the chain.\n- Cross-realm (e.g., different window/iframe): `instanceof` compares the **exact prototype object**, so `arrFromOtherRealm instanceof Array` may be `false`.\n- Classes & inheritance: if `class B extends A {}`, then `new B() instanceof A` → `true`.\n- Can be customized via `Symbol.hasInstance`, but by default it uses the prototype-chain check.\n\n### Examples\n```js\n[] instanceof Array;                 // true\n[] instanceof Object;                // true\nObject.create(null) instanceof Object; // false\nclass A {}\nclass B extends A {}\nnew B() instanceof A;                // true\n```",
            answers: [
                {
                    textUK: '`[] instanceof Object === true`',
                    textEN: '`[] instanceof Object === true`',
                    theoryUK: '✅ **Вірно.** Масив наслідує від `Array.prototype`, далі від `Object.prototype`, тому перевірка успішна.',
                    theoryEN: '✅ **Correct.** Arrays inherit from `Array.prototype`, then `Object.prototype`, so the check passes.',
                    isCorrect: true
                },
                {
                    textUK: '`[] instanceof Array === true`',
                    textEN: '`[] instanceof Array === true`',
                    theoryUK: '✅ **Вірно.** Прямий збіг: у ланцюзі є `Array.prototype`.',
                    theoryEN: '✅ **Correct.** Direct match: `Array.prototype` is in the chain.',
                    isCorrect: true
                },
                {
                    textUK: '`instanceof` порівнює ім’я конструктора об’єкта з ім’ям типу.',
                    textEN: "`instanceof` compares the object's constructor name with a type name.",
                    theoryUK: '❌ **Невірно.** Воно перевіряє **ланцюг прототипів**, а не рядкові імена.',
                    theoryEN: '❌ **Incorrect.** It checks the **prototype chain**, not string names.',
                    isCorrect: false
                },
                {
                    textUK: '`Object.create(null) instanceof Object === false`',
                    textEN: '`Object.create(null) instanceof Object === false`',
                    theoryUK: '✅ **Вірно.** Ланцюг прототипів порожній, `Object.prototype` відсутній.',
                    theoryEN: '✅ **Correct.** The prototype chain is empty; `Object.prototype` is absent.',
                    isCorrect: true
                },
                {
                    textUK: 'Якщо `class B extends A {}`, то `new B() instanceof A === true`.',
                    textEN: 'If `class B extends A {}`, then `new B() instanceof A === true`.',
                    theoryUK: '✅ **Вірно.** Прототип `A.prototype` з’являється в ланцюгу екземпляра `B`.',
                    theoryEN: "✅ **Correct.** `A.prototype` appears in the instance's chain.",
                    isCorrect: true
                },
                {
                    textUK: '`instanceof` завжди працює однаково між різними вікнами/iframe і ніколи не дає хибних результатів.',
                    textEN: '`instanceof` always behaves the same across different windows/iframes and never yields surprising results.',
                    theoryUK: '❌ **Невірно.** Крос-реалм випадки можуть повертати `false`, бо прототипи з іншого реалму — інші об’єкти.',
                    theoryEN: '❌ **Incorrect.** Cross-realm cases may return `false` because prototypes from another realm are different objects.',
                    isCorrect: false
                },
                {
                    textUK: '`({}).__proto__ === Object.prototype`, отже будь-який об’єкт завжди `instanceof Object` — навіть з `Object.create(null)`.',
                    textEN: '`({}).__proto__ === Object.prototype`, therefore every object is always `instanceof Object` — even with `Object.create(null)`.',
                    theoryUK: '❌ **Невірно.** Об’єкти з `Object.create(null)` **не** мають `Object.prototype` у ланцюгу, тому `instanceof Object` → `false`.',
                    theoryEN: '❌ **Incorrect.** Objects from `Object.create(null)` **lack** `Object.prototype` in their chain, so `instanceof Object` → `false`.',
                    isCorrect: false
                },
                {
                    textUK: '`instanceof` можна переозначити через `Symbol.hasInstance`, змінюючи поведінку для користувацьких типів.',
                    textEN: '`instanceof` can be customized via `Symbol.hasInstance`, altering behavior for custom types.',
                    theoryUK: '✅ **Вірно.** Класи/функції-конструктори можуть визначити статичний метод з ключем `Symbol.hasInstance`.',
                    theoryEN: '✅ **Correct.** Classes/constructors can define a static method keyed by `Symbol.hasInstance`.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Оберіть усі правильні твердження про оператор `in` та метод `hasOwnProperty`, включно з прототипними властивостями.',
            textEN: 'Select all correct statements about the `in` operator and `hasOwnProperty`, including prototype properties.',
            theoryUK:
                "### `in` vs `hasOwnProperty`\n**Оператор `in`** перевіряє, чи **є ключ у об'єкті або в його прототипному ланцюзі**.\n- Синтаксис: `key in obj`\n- Ліва частина має бути **рядком або символом** (назва властивості / ключ `Symbol`).\n- Права частина має бути **об'єктом** (включно з масивами, функціями, Proxy). Для примітивів кидає `TypeError`.\n- Повертає `true`, якщо **властивість існує** (власна або успадкована), і `false` — якщо ні.\n\n**`hasOwnProperty`** — метод, який **перевіряє лише власні (own) властивості** об'єкта.\n- Безпечне використання: `Object.prototype.hasOwnProperty.call(obj, key)` — це не залежить від можливого затінення `obj.hasOwnProperty` або об'єктів **без прототипу** (`Object.create(null)`).\n\n#### Приклади\n```js\nconst proto = { a: 1 };\nconst obj = Object.create(proto);\nobj.b = 2;\n'a' in obj;                             // true (успадкована)\n'b' in obj;                             // true (власна)\nobj.hasOwnProperty('a');                // false (не власна)\nObject.prototype.hasOwnProperty.call(obj, 'b'); // true\n\nconst dict = Object.create(null);\ndict.x = 1;\n'x' in dict;                            // true\n// dict.hasOwnProperty === undefined\nObject.prototype.hasOwnProperty.call(dict, 'x'); // true\n\n'0' in [10, , 30];                      // true (елемент існує)\n'1' in [10, , 30];                      // false (дірка/відсутній елемент)\n```\n\n### Типові помилки\n- Вважати, що `in` перевіряє тільки власні властивості — **ні**, він бачить і прототипні.\n- Викликати `obj.hasOwnProperty(...)`, коли `obj` може не мати такого методу (наприклад, `Object.create(null)`).\n- Використовувати `in` з примітивом справа (`'x' in 'abc'`) — це **помилка типу**.",
            theoryEN:
                "### `in` vs `hasOwnProperty`\nThe **`in` operator** checks whether a **key exists on the object or anywhere in its prototype chain**.\n- Syntax: `key in obj`\n- Left-hand side must be a **string or symbol**.\n- Right-hand side must be an **object** (arrays, functions, Proxy). Using a primitive throws `TypeError`.\n- Returns `true` if the property **exists** (own or inherited), otherwise `false`.\n\n**`hasOwnProperty`** checks **only own** properties.\n- Safe pattern: `Object.prototype.hasOwnProperty.call(obj, key)` — immune to shadowing and works with **null-prototype** objects (`Object.create(null)`).\n\n#### Examples\n```js\nconst proto = { a: 1 };\nconst obj = Object.create(proto);\nobj.b = 2;\n'a' in obj;                             // true (inherited)\n'b' in obj;                             // true (own)\nobj.hasOwnProperty('a');                // false (not own)\nObject.prototype.hasOwnProperty.call(obj, 'b'); // true\n\nconst dict = Object.create(null);\ndict.x = 1;\n'x' in dict;                            // true\n// dict.hasOwnProperty === undefined\nObject.prototype.hasOwnProperty.call(dict, 'x'); // true\n\n'0' in [10, , 30];                      // true (exists)\n'1' in [10, , 30];                      // false (hole)\n```\n\n### Common pitfalls\n- Assuming `in` checks only own properties — it **also** sees inherited ones.\n- Calling `obj.hasOwnProperty(...)` when `obj` may not have that method (e.g., `Object.create(null)`).\n- Using `in` with a primitive on the right (`'x' in 'abc'`) — **TypeError**.",
            answers: [
                {
                    textUK: "`'a' in obj` повертає `true`, якщо `a` є у `obj` або в його прототипному ланцюзі.",
                    textEN: "`'a' in obj` returns `true` if `a` is on `obj` or anywhere in its prototype chain.",
                    theoryUK: '✅ **Вірно.** Саме так визначено поведінку `in`: враховуються **власні і успадковані** властивості.',
                    theoryEN: '✅ **Correct.** `in` considers **both own and inherited** properties.',
                    isCorrect: true
                },
                {
                    textUK: "`obj.hasOwnProperty('a')` повертає `true` для власних властивостей, але `false` для прототипних.",
                    textEN: "`obj.hasOwnProperty('a')` returns `true` for own properties and `false` for inherited ones.",
                    theoryUK: '✅ **Вірно.** Це і є призначення `hasOwnProperty`.',
                    theoryEN: '✅ **Correct.** That is exactly what `hasOwnProperty` checks.',
                    isCorrect: true
                },
                {
                    textUK: "Для об'єктів з нульовим прототипом (`Object.create(null)`) безпечніше використовувати `Object.prototype.hasOwnProperty.call(obj, key)`.",
                    textEN: 'For null-prototype objects (`Object.create(null)`), prefer `Object.prototype.hasOwnProperty.call(obj, key)`.',
                    theoryUK: "✅ **Вірно.** Такі об'єкти **не мають** методу `hasOwnProperty`, тож викликаємо його через прототип Object.",
                    theoryEN: '✅ **Correct.** Such objects **lack** `hasOwnProperty`, so call it from `Object.prototype`.',
                    isCorrect: true
                },
                {
                    textUK: "`'1' in [10, , 30]` поверне `true`, бо довжина масиву 3.",
                    textEN: "`'1' in [10, , 30]` returns `true` because the array length is 3.",
                    theoryUK: '❌ **Невірно.** Довжина не гарантує наявність властивості. На позиції 1 — **дірка**, тому вираз поверне `false`.',
                    theoryEN: "❌ **Incorrect.** Length doesn't imply presence. Index 1 is a **hole**, so the result is `false`.",
                    isCorrect: false
                },
                {
                    textUK: "Оператор `in` можна використовувати з правим операндом-примітивом (наприклад, `'x' in 'abc'`).",
                    textEN: "The `in` operator can be used with a primitive on the right (e.g., `'x' in 'abc'`).",
                    theoryUK: "❌ **Невірно.** Правий операнд має бути **об'єктом**; інакше буде `TypeError`.",
                    theoryEN: '❌ **Incorrect.** The right-hand side must be an **object**; otherwise a `TypeError` is thrown.',
                    isCorrect: false
                },
                {
                    textUK: '`in` не працює з `Symbol`-ключами, лише з рядками.',
                    textEN: "`in` doesn't work with `Symbol` keys, only with strings.",
                    theoryUK: '❌ **Невірно.** Лівим операндом може бути **рядок або `Symbol`**.',
                    theoryEN: '❌ **Incorrect.** The left-hand side may be a **string or a `Symbol`**.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: "Що саме може видалити оператор `delete`, що не може, і як це змінюється в режимі `'use strict'`? Оберіть усі правильні твердження.",
            textEN: "What exactly can the `delete` operator remove, what can't it, and how does `'use strict'` change it? Select all that apply.",
            theoryUK:
                "### Поведінка `delete`\n`delete obj.prop` намагається **видалити власну властивість** `prop` у `obj`.\n- Повертає **`true`**, якщо видалення **вдалося** або якщо **властивість не існувала**.\n- Повертає **`false`** (у не-строгому режимі), якщо властивість **невидаляєма** (`configurable: false`). У строгому режимі спроба видалити **невидаляєму** власну властивість кидає **`TypeError`**.\n- Видалення **успадкованих** властивостей через `delete obj.prop` **не видалить** їх (вони належать прототипу), результат зазвичай `true`, але ефекту немає.\n\n### Змінні та оголошення\n- `delete` **не видаляє** змінні, оголошені через `var`, `let`, `const` — це **ідентифікатори**, а не властивості об'єкта. У не-строгому режимі вираз повертає `false`; у строгому — **синтаксична помилка** (Early Error) для незв'язаних ідентифікаторів виду `delete x`.\n- Глобальні **неоголошені** присвоєння у не-строгому режимі створюють **властивість глобального об'єкта**, яку зазвичай **можна видалити**: \n  ```js\n  // не-строгий\n  x = 1;                // створює window.x (браузер)\n  delete x;             // true, видаляє\n  ```\n- **Масиви**: `delete arr[i]` **не зсуває** елементи та **не змінює** `length` — створюється **дірка** (`empty`).\n\n### Приклади\n```js\n'use strict';\nconst o = {};\nObject.defineProperty(o, 'a', { value: 1, configurable: false });\n// delete o.a; // TypeError у strict, false у non-strict\n\nconst p = { b: 2 };\n'b' in p;           // true\ndelete p.b;         // true\n'b' in p;           // false\n\nconst proto = { c: 3 };\nconst q = Object.create(proto);\ndelete q.c;         // true (але не видалить з прототипу)\n'c' in q;           // true (бо лишається у прототипі)\n\nconst arr = [10, 20, 30];\ndelete arr[1];      // true; тепер arr[1] — дірка, length == 3\n1 in arr;           // false\n```",
            theoryEN:
                "### `delete` behavior\n`delete obj.prop` attempts to **remove an own property** `prop` from `obj`.\n- Returns **`true`** if deletion **succeeds** or if the property **didn't exist**.\n- Returns **`false`** (in sloppy mode) if the property is **non-configurable** (`configurable: false`). In strict mode, deleting a **non-configurable** own property throws a **`TypeError`**.\n- Deleting **inherited** properties via `delete obj.prop` **does not remove** them (they belong to the prototype). The result is typically `true` but there's no effect.\n\n### Variables and declarations\n- `delete` **does not delete** variables declared with `var`, `let`, or `const` — those are **bindings**, not object properties. In sloppy mode, the expression returns `false`; in strict mode, `delete x` for an unqualified identifier is an **early SyntaxError**.\n- In sloppy mode, assigning to an **undeclared** variable creates a **property on the global object**, which is usually **deletable**:\n  ```js\n  // non-strict\n  x = 1;            // creates window.x (browser)\n  delete x;         // true, removed\n  ```\n- **Arrays**: `delete arr[i]` **does not shift** elements and **does not change** `length` — it creates a **hole** (`empty`).\n\n### Examples\n```js\n'use strict';\nconst o = {};\nObject.defineProperty(o, 'a', { value: 1, configurable: false });\n// delete o.a; // TypeError in strict, false in non-strict\n\nconst p = { b: 2 };\n'b' in p;           // true\ndelete p.b;         // true\n'b' in p;           // false\n\nconst proto = { c: 3 };\nconst q = Object.create(proto);\ndelete q.c;         // true (but won't remove it from the prototype)\n'c' in q;           // true (still on the prototype)\n\nconst arr = [10, 20, 30];\ndelete arr[1];      // true; arr[1] becomes a hole, length == 3\n1 in arr;           // false\n```",
            answers: [
                {
                    textUK: '`delete obj.prop` може повернути `true` навіть якщо властивості не існувало.',
                    textEN: "`delete obj.prop` may return `true` even if the property didn't exist.",
                    theoryUK: '✅ **Вірно.** Відсутність властивості вважається «успішною операцією» для `delete`.',
                    theoryEN: '✅ **Correct.** Non-existence is treated as a successful deletion by `delete`.',
                    isCorrect: true
                },
                {
                    textUK: 'У строгому режимі спроба видалити **невидаляєму** (non-configurable) **власну** властивість кидає `TypeError`.',
                    textEN: 'In strict mode, deleting a **non-configurable** **own** property throws `TypeError`.',
                    theoryUK: '✅ **Вірно.** Це ключова відмінність strict vs non-strict для `delete`.',
                    theoryEN: '✅ **Correct.** This is a key strict vs sloppy difference for `delete`.',
                    isCorrect: true
                },
                {
                    textUK: '`delete` видаляє змінні, оголошені через `var`, якщо це не strict-режим.',
                    textEN: '`delete` deletes variables declared with `var` if not in strict mode.',
                    theoryUK: '❌ **Невірно.** Ідентифікатори `var/let/const` не видаляються `delete`. У не-строгому режимі результат просто `false`.',
                    theoryEN: "❌ **Incorrect.** `var/let/const` bindings aren't deletable. In sloppy mode the result is just `false`.",
                    isCorrect: false
                },
                {
                    textUK: 'Видалення елемента масиву через `delete arr[i]` зменшує `length` і зсуває індекси.',
                    textEN: 'Deleting an array element with `delete arr[i]` reduces `length` and shifts indexes.',
                    theoryUK: '❌ **Невірно.** Це створює **дірку** і **не** змінює `length`.',
                    theoryEN: '❌ **Incorrect.** It creates a **hole** and **does not** change `length`.',
                    isCorrect: false
                },
                {
                    textUK: "`delete obj.prop` не видаляє успадковану властивість; треба видаляти її з об'єкта-прототипа.",
                    textEN: "`delete obj.prop` won't remove an inherited property; you would need to delete it from the prototype object.",
                    theoryUK: '✅ **Вірно.** Успадковані властивості належать прототипу, а не самому `obj`.',
                    theoryEN: '✅ **Correct.** Inherited properties live on the prototype, not on `obj`.',
                    isCorrect: true
                },
                {
                    textUK: 'У не-строгому режимі неоголошене присвоєння `x = 1` створює глобальну властивість, яку зазвичай можна видалити через `delete x`.',
                    textEN: 'In sloppy mode, an undeclared assignment `x = 1` creates a global property that can usually be deleted via `delete x`.',
                    theoryUK: '✅ **Вірно.** У браузері це `window.x`; така властивість зазвичай **configurable**.',
                    theoryEN: '✅ **Correct.** In browsers this becomes `window.x` which is typically **configurable**.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: "Комбінований тест: проаналізуйте фрагмент і оберіть усі правильні твердження.\n```js\nconst Proto = { p: 1 };\nconst obj = Object.create(Proto);\nobj.q = null;\nconst arr = [10, , 30];\n\n// 1\nconst A = function(){};\nA.prototype.tag = true;\nconst a = new A();\n\n// 2\nclass B {}\nconst b = new B();\n\n// 3\nconst s = Symbol('x');\n\n```\n",
            textEN: "Combined test: analyze the snippet and select all correct statements.\n```js\nconst Proto = { p: 1 };\nconst obj = Object.create(Proto);\nobj.q = null;\nconst arr = [10, , 30];\n\n// 1\nconst A = function(){};\nA.prototype.tag = true;\nconst a = new A();\n\n// 2\nclass B {}\nconst b = new B();\n\n// 3\nconst s = Symbol('x');\n\n```\n",
            theoryUK:
                "### Розбір по частинах\n**`typeof`**:\n- `typeof null` → `\"object\"` (історична особливість).\n- `typeof Symbol('x')` → `\"symbol\"`; `typeof Symbol` → `\"function\"`.\n\n**`in`**:\n- `'p' in obj` → `true`, бо `p` у прототипі `Proto`.\n- `'q' in obj` → `true`, бо `q` — власна властивість `obj`, навіть якщо значення `null`.\n- `'1' in arr` → `false`, бо на індексі **дірка**; `'0' in arr` і `'2' in arr` → `true`.\n\n**`instanceof`**:\n- `a instanceof A` → `true`, бо `A.prototype` в ланцюзі `a`.\n- `b instanceof Object` → `true`, класи наслідують від `Function`, екземпляри — від `Object.prototype`.\n- `arr instanceof Object` → `true`, адже `Array.prototype` у ланцюзі, а далі — `Object.prototype`.\n\n**Дрібниці і підводні камені**:\n- Значення властивості (навіть `null`/`undefined`) **не впливає** на `in` — важливо лише існування ключа.\n- Масивні «дірки» не рахуються як наявні властивості.\n\n```js\n'p' in obj;               // true (успадковано)\n'q' in obj;               // true (власна, хоч і null)\n'typeof obj.q';          // \"object\"\n'1' in arr;               // false (дірка)\n[] instanceof Object;     // true\n```",
            theoryEN:
                "### Breakdown\n**`typeof`**:\n- `typeof null` → `\"object\"` (historical quirk).\n- `typeof Symbol('x')` → `\"symbol\"`; `typeof Symbol` → `\"function\"`.\n\n**`in`**:\n- `'p' in obj` → `true` because `p` is on `Proto`.\n- `'q' in obj` → `true` because `q` is an own property, even if its value is `null`.\n- `'1' in arr` → `false` due to a **hole**; `'0' in arr` and `'2' in arr` → `true`.\n\n**`instanceof`**:\n- `a instanceof A` → `true` because `A.prototype` is in `a`'s chain.\n- `b instanceof Object` → `true`; class instances inherit from `Object.prototype`.\n- `arr instanceof Object` → `true` since arrays inherit from `Array.prototype` then `Object.prototype`.\n\n**Gotchas**:\n- Property **existence** (not its value) determines `in`.\n- Array holes are **absent** properties.\n\n```js\n'p' in obj;               // true (inherited)\n'q' in obj;               // true (own, even if null)\n'typeof obj.q';          // \"object\"\n'1' in arr;               // false (hole)\n[] instanceof Object;     // true\n```",
            answers: [
                {
                    textUK: "`'p' in obj` дорівнює `true`.",
                    textEN: "`'p' in obj` is `true`.",
                    theoryUK: '✅ **Вірно.** `p` належить прототипу `Proto`, а `in` перевіряє весь ланцюг.',
                    theoryEN: '✅ **Correct.** `p` lives on `Proto` and `in` traverses the chain.',
                    isCorrect: true
                },
                {
                    textUK: "`'q' in obj` дорівнює `false`, бо значення `null` не рахується як наявна властивість.",
                    textEN: "`'q' in obj` is `false` because `null` doesn't count as an existing property.",
                    theoryUK: '❌ **Невірно.** `in` перевіряє **існування ключа**, а не правдивість значення. Власна властивість `q` існує — отже `true`.',
                    theoryEN: '❌ **Incorrect.** `in` checks **key existence**, not truthiness. `q` exists, thus `true`.',
                    isCorrect: false
                },
                {
                    textUK: "`'1' in arr` повертає `false`.",
                    textEN: "`'1' in arr` returns `false`.",
                    theoryUK: '✅ **Вірно.** На індексі 1 — **дірка**, отже властивості немає.',
                    theoryEN: '✅ **Correct.** Index 1 is a **hole**, so the property is absent.',
                    isCorrect: true
                },
                {
                    textUK: '`a instanceof A` дорівнює `true`.',
                    textEN: '`a instanceof A` is `true`.',
                    theoryUK: '✅ **Вірно.** `A.prototype` знаходиться в ланцюзі прототипів `a`.',
                    theoryEN: "✅ **Correct.** `A.prototype` is in `a`'s prototype chain.",
                    isCorrect: true
                },
                {
                    textUK: "`arr instanceof Object` дорівнює `false`, бо масив — не об'єкт.",
                    textEN: '`arr instanceof Object` is `false` because an array is not an object.',
                    theoryUK: "❌ **Невірно.** Масиви **є об'єктами**; ланцюг включає `Object.prototype`, тому результат `true`.",
                    theoryEN: "❌ **Incorrect.** Arrays **are objects**; `Object.prototype` is in the chain, so it's `true`.",
                    isCorrect: false
                },
                {
                    textUK: "`typeof obj.q` повертає `'object'`.",
                    textEN: "`typeof obj.q` returns `'object'`.",
                    theoryUK: "✅ **Вірно.** `obj.q === null`, а `typeof null` → `'object'` через історичну особливість.",
                    theoryEN: "✅ **Correct.** `obj.q === null`, and `typeof null` is `'object'` due to the historical quirk.",
                    isCorrect: true
                },
                {
                    textUK: "`typeof s` дорівнює `'symbol'`, а `typeof Symbol` — `'function'`.",
                    textEN: "`typeof s` equals `'symbol'`, and `typeof Symbol` is `'function'`.",
                    theoryUK: "✅ **Вірно.** Значення-символ має тип `'symbol'`, ідентифікатор `Symbol` — функція-фабрика.",
                    theoryEN: "✅ **Correct.** A symbol value reports `'symbol'`, while the `Symbol` identifier is a function.",
                    isCorrect: true
                },
                {
                    textUK: '`b instanceof Object` дорівнює `true`.',
                    textEN: '`b instanceof Object` is `true`.',
                    theoryUK: '✅ **Вірно.** Екземпляри класів наслідують від `Object.prototype`.',
                    theoryEN: '✅ **Correct.** Class instances inherit from `Object.prototype`.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        }
    ]
};
