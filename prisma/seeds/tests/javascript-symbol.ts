import { TopicMock } from '../types';

export const tests: TopicMock = {
    titleUK: 'Symbol (у т.ч. well-known: toPrimitive, toStringTag, hasInstance)',
    titleEN: 'Symbol (including well-known symbols: toPrimitive, toStringTag, hasInstance)',
    questions: [
        {
            textUK: 'Унікальність символів і глобальний реєстр: що буде істинним?',
            textEN: 'Symbol uniqueness & the global registry: which statements are true?',
            theoryUK:
                "## Теорія: Унікальність `Symbol` та глобальний реєстр\n\n**Локальні символи.** Виклики `Symbol('a')` завжди створюють *новий* унікальний символ. Навіть якщо опис однаковий, посилання різні:\n```js\nSymbol('a') !== Symbol('a'); // true\n```\n\n**Глобальний реєстр.** `Symbol.for(key)` шукає символ у глобальному реєстрі за рядковим ключем `key`. Якщо немає — створює і кешує. Наступні виклики з тим самим ключем повернуть **те саме** посилання:\n```js\nSymbol.for('x') === Symbol.for('x'); // true\n```\n\n**Локальний vs реєстровий.** Символ, створений через `Symbol('x')`, **ніколи** не дорівнює символу з реєстру `Symbol.for('x')`:\n```js\nSymbol('x') === Symbol.for('x'); // false\n```\n\n**Зворотний пошук.** `Symbol.keyFor(sym)` працює лише для символів з глобального реєстру й повертає їх ключ. Для звичайних (незареєстрованих) символів повертає `undefined`:\n```js\nSymbol.keyFor(Symbol.for('a')) === 'a'; // true\nSymbol.keyFor(Symbol('a')) === undefined; // true\n```\n\n> Глобальний реєстр один на середовище виконання (engine/realm) і зіставляє *рядкові ключі* з *символами*.\n",
            theoryEN:
                "## Theory: `Symbol` uniqueness & the global registry\n\n**Local symbols.** Each call to `Symbol('a')` creates a *new* unique symbol. The description is metadata only; identities differ:\n```js\nSymbol('a') !== Symbol('a'); // true\n```\n\n**Global registry.** `Symbol.for(key)` looks up a symbol in the global symbol registry by the string `key`. If absent, it's created and cached. Subsequent calls with the same key return **the same** symbol:\n```js\nSymbol.for('x') === Symbol.for('x'); // true\n```\n\n**Local vs registry.** A locally created symbol `Symbol('x')` is **never** equal to `Symbol.for('x')`:\n```js\nSymbol('x') === Symbol.for('x'); // false\n```\n\n**Reverse lookup.** `Symbol.keyFor(sym)` only works for registry symbols and returns their key; for non-registry symbols it returns `undefined`:\n```js\nSymbol.keyFor(Symbol.for('a')) === 'a'; // true\nSymbol.keyFor(Symbol('a')) === undefined; // true\n```\n\n> The global registry maps *string keys* to *symbols* and is shared within the execution realm.",
            answers: [
                {
                    textUK: "`Symbol('a') !== Symbol('a')`",
                    textEN: "`Symbol('a') !== Symbol('a')`",
                    theoryUK: 'Кожен виклик `Symbol()` повертає новий унікальний символ, навіть з однаковим описом.',
                    theoryEN: 'Each `Symbol()` call returns a fresh unique symbol, regardless of the description.',
                    isCorrect: true
                },
                {
                    textUK: "`Symbol.for('x') === Symbol.for('x')`",
                    textEN: "`Symbol.for('x') === Symbol.for('x')`",
                    theoryUK: '`Symbol.for` дістає/створює один і той самий символ за ключем у глобальному реєстрі.',
                    theoryEN: '`Symbol.for` fetches/creates a single shared symbol per key in the global registry.',
                    isCorrect: true
                },
                {
                    textUK: "`Symbol('x') === Symbol.for('x')`",
                    textEN: "`Symbol('x') === Symbol.for('x')`",
                    theoryUK: 'Хибно: локально створений символ ніколи не дорівнює символу з реєстру, навіть з тим самим описом.',
                    theoryEN: 'Incorrect: a locally created symbol never equals a registry symbol, even with the same description.',
                    isCorrect: false
                },
                {
                    textUK: "`Symbol.keyFor(Symbol.for('a')) === 'a'`",
                    textEN: "`Symbol.keyFor(Symbol.for('a')) === 'a'`",
                    theoryUK: '`keyFor` повертає рядковий ключ лише для реєстрових символів.',
                    theoryEN: '`keyFor` returns the string key only for registry symbols.',
                    isCorrect: true
                },
                {
                    textUK: "`Symbol.keyFor(Symbol('a')) === undefined`",
                    textEN: "`Symbol.keyFor(Symbol('a')) === undefined`",
                    theoryUK: 'Так, для нереєстрових символів `keyFor` повертає `undefined`.',
                    theoryEN: 'Yes, for non-registry symbols `keyFor` returns `undefined`.',
                    isCorrect: true
                },
                {
                    textUK: "Якщо `const s1 = Symbol.for('x'), s2 = Symbol.for('x')`, тоді `s1 !== s2`",
                    textEN: "If `const s1 = Symbol.for('x'), s2 = Symbol.for('x')`, then `s1 !== s2`",
                    theoryUK: 'Хибно: обидві змінні посилаються на той самий реєстровий символ, тому `s1 === s2`.',
                    theoryEN: 'Incorrect: both variables reference the same registry symbol, so `s1 === s2`.',
                    isCorrect: false
                }
            ],
            level: 'senior'
        },
        {
            textUK: 'Символи як ключі об’єкта: чому `Object.keys` їх не показує і як їх отримати?',
            textEN: 'Symbols as object keys: why does `Object.keys` hide them and how to retrieve them?',
            theoryUK:
                "## Теорія: символи як ключі та перебирання\n\n- **Ключі-символи** не конфліктують із рядковими ключами й не з'являються у більшості рядкових переліків.\n- `Object.keys(obj)` повертає **тільки** *власні* **рядкові** *enumerable* ключі. Символи ігноруються.\n- Щоб дістати символи, використовуйте:\n  - `Object.getOwnPropertySymbols(obj)` — лише **символи** (власні, незалежно від `enumerable`).\n  - `Reflect.ownKeys(obj)` — **усі** власні ключі: і рядкові, і символьні (включно з неenumerable).\n- Інші нюанси:\n  - `for...in` не ітерує символи взагалі.\n  - `JSON.stringify` пропускає властивості-символи.\n  - `Object.assign(target, source)` копіює **власні enumerable** властивості **і рядкові, і символьні**.\n",
            theoryEN:
                '## Theory: symbols as keys & enumeration\n\n- **Symbol keys** do not collide with string keys and are skipped by most string-based listings.\n- `Object.keys(obj)` returns **only** *own* **string** *enumerable* keys. Symbol keys are ignored.\n- To get symbols, use:\n  - `Object.getOwnPropertySymbols(obj)` — **symbols only** (own, regardless of `enumerable`).\n  - `Reflect.ownKeys(obj)` — **all** own keys: both strings and symbols (including non-enumerable).\n- More nuances:\n  - `for...in` never iterates symbols.\n  - `JSON.stringify` omits symbol properties.\n  - `Object.assign(target, source)` copies **own enumerable** properties **including symbol keys**.',
            answers: [
                {
                    textUK: '`Object.keys(obj)` повертає лише власні **рядкові** enumerable-ключі, символи ігнорує',
                    textEN: '`Object.keys(obj)` returns only own **string** enumerable keys; it ignores symbols',
                    theoryUK: 'Це визначення методу: символи не входять у результат `Object.keys`.',
                    theoryEN: "That's by design: symbol keys are excluded from `Object.keys`.",
                    isCorrect: true
                },
                {
                    textUK: '`Object.getOwnPropertySymbols(obj)` повертає **усі** власні символ-ключі (навіть неenumerable)',
                    textEN: '`Object.getOwnPropertySymbols(obj)` returns **all** own symbol keys (even non-enumerable)',
                    theoryUK: 'Так, цей метод спеціально для символів і не фільтрує за `enumerable`.',
                    theoryEN: 'Correct; it returns symbol keys irrespective of enumerability.',
                    isCorrect: true
                },
                {
                    textUK: '`Reflect.ownKeys(obj)` повертає лише рядкові ключі',
                    textEN: '`Reflect.ownKeys(obj)` returns only string keys',
                    theoryUK: 'Хибно: `Reflect.ownKeys` повертає **і** рядкові, **і** символьні ключі.',
                    theoryEN: 'Incorrect: `Reflect.ownKeys` returns **both** string and symbol keys.',
                    isCorrect: false
                },
                {
                    textUK: '`for...in` буде перелічувати символ-ключі, якщо вони enumerable',
                    textEN: '`for...in` will enumerate symbol keys if they are enumerable',
                    theoryUK: 'Хибно: цикл `for...in` ніколи не ітерує символи, тільки рядкові ключі по ланцюжку прототипів.',
                    theoryEN: 'Incorrect: `for...in` never iterates symbols; it only yields string keys across the prototype chain.',
                    isCorrect: false
                },
                {
                    textUK: '`Object.assign({}, obj)` скопіює **enumerable** властивості з **рядковими та символ-ключами**',
                    textEN: '`Object.assign({}, obj)` copies **enumerable** properties with **both string and symbol keys**',
                    theoryUK: 'Так, специфікація вимагає враховувати символ-ключі під час копіювання enumerable властивостей.',
                    theoryEN: 'Correct; the spec includes symbol keys when copying own enumerable properties.',
                    isCorrect: true
                },
                {
                    textUK: '`JSON.stringify(obj)` збереже символ-ключі у виводі',
                    textEN: '`JSON.stringify(obj)` preserves symbol keys in output',
                    theoryUK: 'Хибно: `JSON.stringify` ігнорує властивості з символ-ключами.',
                    theoryEN: 'Incorrect: `JSON.stringify` omits properties with symbol keys.',
                    isCorrect: false
                }
            ],
            level: 'senior'
        },
        {
            textUK: 'Як `Symbol.toPrimitive` впливає на приведення типів (унарний `+obj`, шаблонні рядки ``${obj}``)?',
            textEN: 'How does `Symbol.toPrimitive` affect coercion (unary `+obj`, template literals ``${obj}``)?',
            theoryUK:
                "## Теорія: `Symbol.toPrimitive` і підказки перетворення\nКоли об'єкт потрібно перетворити до примітиву, двигун виконує *ToPrimitive* з **підказкою** (*hint*):\n\n1. Якщо є метод `obj[Symbol.toPrimitive](hint)`, він викликається першим.\n2. Якщо його немає, порядок залежить від `hint`:\n   - `hint: 'number'` або `'default'` → спочатку `valueOf()`, потім `toString()`.\n   - `hint: 'string'` → спочатку `toString()`, потім `valueOf()`.\n\n**Оператори й підказки:**\n- Унарний плюс `+obj` → `hint: 'number'`.\n- Шаблонний літерал ```${obj}``` та конкатенація зі строкою → `hint: 'string'`.\n- Додавання `a + b` з двома не-рядками зазвичай використовує `hint: 'default'` (практично як число).\n\n**Приклад:**\n```js\nconst obj = {\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') return 10;\n    if (hint === 'string') return 'S';\n    return 1; // default\n  }\n};\n+obj;       // 10\n`${obj}`;   // 'S'\nobj + 1;    // 2 (бо hint 'default' → 1, потім 1 + 1)\n```\n\n> Визначений `Symbol.toPrimitive` має пріоритет над `valueOf`/`toString` і дозволяє точно контролювати приведення.",
            theoryEN:
                "## Theory: `Symbol.toPrimitive` and coercion hints\nWhen an object must be converted to a primitive, the engine performs *ToPrimitive* with a **hint**:\n\n1. If `obj[Symbol.toPrimitive](hint)` exists, it runs first.\n2. Otherwise, order depends on `hint`:\n   - `hint: 'number'` or `'default'` → try `valueOf()` then `toString()`.\n   - `hint: 'string'` → try `toString()` then `valueOf()`.\n\n**Operators & hints:**\n- Unary plus `+obj` → `hint: 'number'`.\n- Template literal ```${obj}``` and string concatenation → `hint: 'string'`.\n- `a + b` with two non-strings generally uses `hint: 'default'` (effectively numeric).\n\n**Example:**\n```js\nconst obj = {\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') return 10;\n    if (hint === 'string') return 'S';\n    return 1; // default\n  }\n};\n+obj;       // 10\n`${obj}`;   // 'S'\nobj + 1;    // 2 (default hint yields 1)\n```\n\n> A defined `Symbol.toPrimitive` takes precedence over `valueOf`/`toString`, giving full control over coercion.",
            answers: [
                {
                    textUK: "Для `+obj` підказка дорівнює `'number'`, тому `obj[Symbol.toPrimitive]('number')` викликається першим",
                    textEN: "For `+obj` the hint is `'number'`, so `obj[Symbol.toPrimitive]('number')` is invoked first",
                    theoryUK: 'Саме так працює ToPrimitive для унарного плюса: числовий hint.',
                    theoryEN: "Correct: unary plus requests a numeric conversion, i.e., hint `'number'`.",
                    isCorrect: true
                },
                {
                    textUK: "У ```${obj}``` підказка — `'string'`, тому повернене значення буде рядком, якщо метод це врахує",
                    textEN: "In ```${obj}``` the hint is `'string'`, so the result will be a string if the method honors it",
                    theoryUK: 'Шаблонні рядки виконують ToPrimitive зі строковою підказкою.',
                    theoryEN: 'Template literals use the string hint during ToPrimitive.',
                    isCorrect: true
                },
                {
                    textUK: 'Якщо визначено `Symbol.toPrimitive`, `valueOf` і `toString` більше ніколи не викликаються',
                    textEN: 'If `Symbol.toPrimitive` is defined, `valueOf` and `toString` are never called',
                    theoryUK:
                        'Неточно: вони **не** викликаються *в межах цього перетворення*, але можуть викликатися в інших контекстах або якщо `Symbol.toPrimitive` відсутній.',
                    theoryEN:
                        "Not quite: they aren't consulted *for that coercion* if `Symbol.toPrimitive` handles it, but may be used in other contexts or when `Symbol.toPrimitive` is absent.",
                    isCorrect: false
                },
                {
                    textUK: "`obj + 1` завжди використовує підказку `'string'`",
                    textEN: "`obj + 1` always uses the `'string'` hint",
                    theoryUK: "Хибно: коли обидва операнди не є рядками, використовується `'default'` (зазвичай як число).",
                    theoryEN: "Incorrect: with two non-strings the hint is `'default'` (effectively numeric).",
                    isCorrect: false
                },
                {
                    textUK: "Якщо `Symbol.toPrimitive` повертає об'єкт, буде кинуто `TypeError`",
                    textEN: 'If `Symbol.toPrimitive` returns an object, a `TypeError` is thrown',
                    theoryUK: 'Так, результат має бути **примітивом**; інакше `TypeError`.',
                    theoryEN: 'Yes; the result must be a **primitive** or a `TypeError` is thrown.',
                    isCorrect: true
                },
                {
                    textUK: "`String(obj)` використовує підказку `'string'` і викликає `Symbol.toPrimitive('string')` за наявності",
                    textEN: "`String(obj)` uses the `'string'` hint and calls `Symbol.toPrimitive('string')` if present",
                    theoryUK: "Так, побудова рядка з об'єкта запускає ToPrimitive зі строковою підказкою.",
                    theoryEN: 'Correct: string conversion requests the string hint.',
                    isCorrect: true
                }
            ],
            level: 'senior'
        },
        {
            textUK: 'Symbol.hasInstance: як кастомізувати поведінку `instanceof`?',
            textEN: 'Symbol.hasInstance: how to customize `instanceof` behavior?',
            theoryUK:
                "## Теорія: `Symbol.hasInstance`\nОператор `instanceof` за замовчуванням перевіряє ланцюжок прототипів через внутрішній алгоритм **OrdinaryHasInstance**. Але якщо права частина має метод `[@@hasInstance]`, викликається **він**:\n\n```js\nclass Even {}\nObject.defineProperty(Even, Symbol.hasInstance, {\n  value(x) { return typeof x === 'number' && x % 2 === 0; }\n});\n2 instanceof Even;   // true\n3 instanceof Even;   // false\n```\nОсобливості:\n- `@@hasInstance` — **статичний** метод на конструкторі/функції (правій частині `instanceof`). Розміщення на `prototype` не впливає.\n- Повернене значення приводиться до булевого (`ToBoolean`). Тобто можна повертати truthy/falsy, не обов'язково `true|false`.\n- Якщо `@@hasInstance` **існує**, він викликається навіть якщо права частина **не є викликаною функцією**. Якщо методу немає, а права частина не callable — буде `TypeError`.\n- Визначення власного `@@hasInstance` **не змінює** реальний ланцюжок прототипів; це лише «угода» для оператора `instanceof`.\n",
            theoryEN:
                "## Theory: `Symbol.hasInstance`\nBy default, `instanceof` checks the prototype chain via **OrdinaryHasInstance**. If the right-hand side has a `[@@hasInstance]` method, **that** method is invoked instead:\n\n```js\nclass Even {}\nObject.defineProperty(Even, Symbol.hasInstance, {\n  value(x) { return typeof x === 'number' && x % 2 === 0; }\n});\n2 instanceof Even;   // true\n3 instanceof Even;   // false\n```\nKey points:\n- `@@hasInstance` is a **static** method on the constructor/function (the RHS of `instanceof`). Putting it on `prototype` has no effect.\n- The result is coerced with `ToBoolean`; you may return truthy/falsy, not strictly booleans.\n- If `@@hasInstance` **exists**, it is used even if the RHS is **not callable**. If it doesn't and the RHS isn't callable, `TypeError` is thrown.\n- Custom `@@hasInstance` does **not** alter the actual prototype chain; it only customizes `instanceof` semantics.",
            answers: [
                {
                    textUK: '`@@hasInstance` має бути оголошений на **конструкторі/функції**, а не на `prototype`',
                    textEN: '`@@hasInstance` must be defined on the **constructor/function**, not on the `prototype`',
                    theoryUK: 'Правильний контракт: оператор дивиться на праву частину, а не на екземпляр.',
                    theoryEN: "Correct: the operator consults the RHS object, not the instance's prototype.",
                    isCorrect: true
                },
                {
                    textUK: 'Метод `@@hasInstance` повинен повертати строго булеве значення, інакше кине `TypeError`',
                    textEN: '`@@hasInstance` must return a strict boolean or it throws `TypeError`',
                    theoryUK: 'Хибно: результат приводиться до булевого через `ToBoolean` (truthy/falsy прийнятні).',
                    theoryEN: 'Incorrect: the result is coerced via `ToBoolean` (truthy/falsy are acceptable).',
                    isCorrect: false
                },
                {
                    textUK: 'Якщо на RHS є `@@hasInstance`, він буде використаний навіть якщо RHS не є функцією',
                    textEN: 'If the RHS has `@@hasInstance`, it is used even if the RHS is not a function',
                    theoryUK: 'Так, наявність методу переважує звичайну перевірку callable; без нього не-callable RHS спричиняє `TypeError`.',
                    theoryEN: 'Yes; presence of the method takes precedence. Without it, a non-callable RHS causes `TypeError`.',
                    isCorrect: true
                },
                {
                    textUK: "Кастомізація `instanceof` змінює ланцюжок прототипів об'єкта",
                    textEN: "Customizing `instanceof` changes the object's prototype chain",
                    theoryUK: 'Ні: `@@hasInstance` лише впливає на результат `instanceof`, а не на `[[Prototype]]`.',
                    theoryEN: 'No: `@@hasInstance` affects `instanceof` only, not the `[[Prototype]]` linkage.',
                    isCorrect: false
                },
                {
                    textUK: '`value instanceof C` при відсутності `@@hasInstance` повертає результат звичайної перевірки по прототипному ланцюгу',
                    textEN: 'If `@@hasInstance` is absent, `value instanceof C` falls back to the ordinary prototype-chain check',
                    theoryUK: 'Так, застосовується алгоритм OrdinaryHasInstance.',
                    theoryEN: 'Correct; the OrdinaryHasInstance algorithm is used.',
                    isCorrect: true
                },
                {
                    textUK: 'Оголошення `static [Symbol.hasInstance](x) { ... }` у класі — скорочений синтаксис для визначення цього методу',
                    textEN: 'Declaring `static [Symbol.hasInstance](x) { ... }` in a class defines this method',
                    theoryUK: 'Так, це канонічний спосіб додати `@@hasInstance` на сам клас.',
                    theoryEN: "Yes; that's the canonical way to add `@@hasInstance` to the class constructor.",
                    isCorrect: true
                }
            ],
            level: 'senior'
        },
        {
            textUK: 'Інші well-known symbols: `iterator`, `species`, `match`, `replace` — що за що відповідає?',
            textEN: 'Other well-known symbols: `iterator`, `species`, `match`, `replace` — what does each do?',
            theoryUK:
                "## Теорія: інші well-known символи\n- **`Symbol.iterator`**: повертає **ітератор** (об'єкт із методом `next()`), що використовується `for...of`, оператором розпакування `...`, `Array.from()` тощо.\n- **`Symbol.species`**: статичний геттер, яким колекції/класи позначають **який конструктор** використовувати для методів, що створюють похідні об'єкти (наприклад, `map`, `filter` у `Array`/`TypedArray`, `then` у `Promise`). Дозволяє повертати базовий клас замість підкласу.\n- **`Symbol.match`**: якщо об'єкт має метод `[@@match](str)`, то `String.prototype.match` викликає його. Також встановлення `RegExp.prototype[Symbol.match] = false` на екземплярі змушує механізм **не** трактувати об'єкт як регулярний вираз у перевірках типу `IsRegExp`.\n- **`Symbol.replace`**: якщо об'єкт має метод `[@@replace](str, repl)`, його викликає `String.prototype.replace`.\n\n### Приклади\n```js\n// iterator\nconst obj = { \n  *[Symbol.iterator]() { yield 1; yield 2; }\n};\n[...obj]; // [1, 2]\n\n// species\nclass MyArray extends Array {\n  static get [Symbol.species]() { return Array; }\n}\nconst a = new MyArray(1,2,3);\nconst b = a.map(x => x*2);\nb instanceof MyArray; // false, бо species → Array\n\n// match / replace\nconst matcher = {\n  [Symbol.match](s) { return s.startsWith('hi') ? ['hi'] : null; }\n};\n'hi there'.match(matcher); // ['hi']\n\nconst replacer = {\n  [Symbol.replace](s, repl) { return s.split('x').join(repl); }\n};\n'axa'.replace(replacer, '_'); // '___'\n```\n",
            theoryEN:
                "## Theory: other well-known symbols\n- **`Symbol.iterator`**: returns an **iterator** (object with `next()`), used by `for...of`, spread `...`, `Array.from()`, etc.\n- **`Symbol.species`**: a static getter that collections/classes use to signal **which constructor** to use for methods that create derived objects (e.g., `map`, `filter` on `Array`/`TypedArray`, `then` on `Promise`). Lets subclasses return the base class instead of the subclass.\n- **`Symbol.match`**: if an object has `[@@match](str)`, `String.prototype.match` calls it. Also, setting `RegExp.prototype[Symbol.match] = false` on an instance makes the engine **not** treat it as a regular expression in `IsRegExp` checks.\n- **`Symbol.replace`**: if an object has `[@@replace](str, repl)`, `String.prototype.replace` invokes it.\n\n### Examples\n```js\n// iterator\nconst obj = { \n  *[Symbol.iterator]() { yield 1; yield 2; }\n};\n[...obj]; // [1, 2]\n\n// species\nclass MyArray extends Array {\n  static get [Symbol.species]() { return Array; }\n}\nconst a = new MyArray(1,2,3);\nconst b = a.map(x => x*2);\nb instanceof MyArray; // false, species→Array\n\n// match / replace\nconst matcher = {\n  [Symbol.match](s) { return s.startsWith('hi') ? ['hi'] : null; }\n};\n'hi there'.match(matcher); // ['hi']\n\nconst replacer = {\n  [Symbol.replace](s, repl) { return s.split('x').join(repl); }\n};\n'axa'.replace(replacer, '_'); // '___'\n```\n",
            answers: [
                {
                    textUK: '`for...of` шукає метод `obj[Symbol.iterator]()` ітеруючи значення',
                    textEN: '`for...of` looks up `obj[Symbol.iterator]()` to iterate values',
                    theoryUK: 'Це основний протокол ітерації в JS; повинен повертати ітератор із методом `next()`.',
                    theoryEN: "That's the core iteration protocol; it must return an iterator with `next()`.",
                    isCorrect: true
                },
                {
                    textUK: '`Symbol.species` дозволяє підкласу `Array` повертати `Array` з методів типу `map`',
                    textEN: '`Symbol.species` lets an `Array` subclass return `Array` from methods like `map`',
                    theoryUK: 'Вірно: статичний геттер визначає конструктор для похідних результатів.',
                    theoryEN: 'Correct: the static getter selects the constructor for derived results.',
                    isCorrect: true
                },
                {
                    textUK: 'Встановлення `re[Symbol.match] = false` для `RegExp` екземпляра забороняє трактувати його як RegExp у `String.prototype.match`',
                    textEN: 'Setting `re[Symbol.match] = false` on a `RegExp` instance prevents it from being treated as RegExp by `String.prototype.match`',
                    theoryUK: "Так, `IsRegExp` враховує `@@match === false`, тож об'єкт не розпізнається як регулярний вираз.",
                    theoryEN: "Yes, `IsRegExp` respects `@@match === false`, so it won't be treated as a RegExp.",
                    isCorrect: true
                },
                {
                    textUK: '`String.prototype.replace` викликає `obj[Symbol.replace](str, replacer)`, якщо такий метод існує',
                    textEN: '`String.prototype.replace` calls `obj[Symbol.replace](str, replacer)` if present',
                    theoryUK: 'Вірно: це договір well-known символу `@@replace`.',
                    theoryEN: "Correct: that's the well-known symbol contract for `@@replace`.",
                    isCorrect: true
                },
                {
                    textUK: '`Symbol.iterator` — це прапорець (boolean), який вмикає можливість ітерації без реалізації методу',
                    textEN: '`Symbol.iterator` is a boolean flag enabling iteration without a method implementation',
                    theoryUK: 'Хибно: `@@iterator` має бути **функцією**, що повертає ітератор.',
                    theoryEN: 'Incorrect: `@@iterator` must be a **function** returning an iterator.',
                    isCorrect: false
                },
                {
                    textUK: '`Symbol.species` — звичайний екземплярний геттер; його місце — на `prototype`',
                    textEN: '`Symbol.species` is an instance getter and belongs on the `prototype`',
                    theoryUK: 'Хибно: це **статичний** геттер на конструкторі класу.',
                    theoryEN: "Incorrect: it's a **static** getter on the class constructor.",
                    isCorrect: false
                }
            ],
            level: 'senior'
        }
    ]
};
