import { QuestionMock } from '../types';

export const tests: QuestionMock[] = [
    {
        textUK: 'Як `NaN` і `Infinity` поводяться у неявних приведеннях і арифметичних операціях?',
        textEN: 'How do `NaN` and `Infinity` behave in implicit coercion and arithmetic operations?',
        theoryUK:
            "### Теорія: `NaN` і `Infinity`\n\n**`NaN` (Not-a-Number)** з’являється, коли числове перетворення або обчислення неможливе:\n- Будь-яка арифметична операція з `NaN` → `NaN` (`NaN + 1`, `NaN * 5`).\n- Порівняння з `NaN` завжди `false`, навіть `NaN == NaN` і `NaN === NaN` → `false`.\n- `ToBoolean(NaN)` → `false` (falsy).\n\n**`Infinity` / `-Infinity`** виникає при переповненні або діленні на нуль:\n- `1 / 0` → `Infinity`, `-1 / 0` → `-Infinity`.\n- `Infinity ± finite` → `Infinity` / `-Infinity` відповідно.\n- `Infinity * 0` та `Infinity - Infinity` → `NaN` (виникає невизначеність).\n- `ToBoolean(Infinity)` → `true` (будь-яке ненульове число truthy).\n\n**Неявні приведення (коерції):**\n- Рядок у **числових** операторах (крім `+` з рядком) перетворюється через `Number()`:\n  - `Number('Infinity')` → `Infinity`, `Number('  ')` → `0`, `Number('abc')` → `NaN`.\n- Оператор `+` має дві семантики: якщо один операнд — рядок (або стає рядком під час `ToPrimitive`), відбувається **конкатенація**:\n  - `Infinity + '1'` → `'Infinity1'` (рядок), тоді як `'Infinity' - 1` → `Infinity` (числова операція).\n\n> Коротко: `NaN` «заражає» арифметику, `Infinity` поводиться як нескінченність у більшості операцій, але у виразах на кшталт `Infinity * 0` чи `Infinity - Infinity` результат — `NaN`.",
        theoryEN:
            "### Theory: `NaN` and `Infinity`\n\n**`NaN` (Not-a-Number)** appears when numeric conversion or computation fails:\n- Any arithmetic with `NaN` → `NaN` (`NaN + 1`, `NaN * 5`).\n- Comparisons with `NaN` are always `false`, even `NaN == NaN` and `NaN === NaN` → `false`.\n- `ToBoolean(NaN)` → `false` (falsy).\n\n**`Infinity` / `-Infinity`** arises from overflow or division by zero:\n- `1 / 0` → `Infinity`, `-1 / 0` → `-Infinity`.\n- `Infinity ± finite` → `Infinity` / `-Infinity` accordingly.\n- `Infinity * 0` and `Infinity - Infinity` → `NaN` (indeterminate).\n- `ToBoolean(Infinity)` → `true` (any non-zero number is truthy).\n\n**Implicit coercion:**\n- Strings in **numeric** operators (except `+` with a string) are converted via `Number()`:\n  - `Number('Infinity')` → `Infinity`, `Number('  ')` → `0`, `Number('abc')` → `NaN`.\n- The `+` operator is dual: if either operand is (or becomes) a string, we get **concatenation**:\n  - `Infinity + '1'` → `'Infinity1'` (string), whereas `'Infinity' - 1` → `Infinity` (numeric).\n\n> In short: `NaN` contaminates arithmetic, `Infinity` behaves like mathematical infinity except in edge cases like `Infinity * 0` or `Infinity - Infinity`, which become `NaN`.",
        level: 'middle',
        answers: [
            {
                textUK: "`'abc' * 2` → `NaN`.",
                textEN: "`'abc' * 2` → `NaN`.",
                theoryUK: '✅ Рядок, що не перетворюється в число, дає `NaN` у числовій операції.',
                theoryEN: '✅ A non-numeric string converts to `NaN` in numeric operations.',
                isCorrect: true
            },
            {
                textUK: "`'Infinity' - 1` → `Infinity`.",
                textEN: "`'Infinity' - 1` → `Infinity`.",
                theoryUK: '✅ Рядок перетворюється в `Infinity`, віднімання з нескінченності лишає `Infinity`.',
                theoryEN: '✅ String coerces to `Infinity`; subtracting 1 still yields `Infinity`.',
                isCorrect: true
            },
            {
                textUK: '`1 / 0` → `Infinity`.',
                textEN: '`1 / 0` → `Infinity`.',
                theoryUK: '✅ Ділення на нуль у JS дає `Infinity`.',
                theoryEN: '✅ Division by zero in JS yields `Infinity`.',
                isCorrect: true
            },
            {
                textUK: '`-1 / 0` → `-Infinity`.',
                textEN: '`-1 / 0` → `-Infinity`.',
                theoryUK: '✅ Знак зберігається при діленні на нуль.',
                theoryEN: '✅ The sign is preserved when dividing by zero.',
                isCorrect: true
            },
            {
                textUK: '`Infinity * 0` → `0`.',
                textEN: '`Infinity * 0` → `0`.',
                theoryUK: '❌ Це невизначеність → результат `NaN`.',
                theoryEN: '❌ This is indeterminate → result is `NaN`.',
                isCorrect: false
            },
            {
                textUK: '`NaN == NaN` → `true`.',
                textEN: '`NaN == NaN` → `true`.',
                theoryUK: '❌ `NaN` не дорівнює навіть самому собі.',
                theoryEN: '❌ `NaN` is not equal to itself.',
                isCorrect: false
            },
            {
                textUK: "`Number('  ')` → `0`.",
                textEN: "`Number('  ')` → `0`.",
                theoryUK: '✅ Пробіли обрізаються, порожній рядок → `0`.',
                theoryEN: '✅ Whitespace trims to empty; empty string → `0`.',
                isCorrect: true
            },
            {
                textUK: '`+undefined` → `0`.',
                textEN: '`+undefined` → `0`.',
                theoryUK: '❌ `Number(undefined)` → `NaN`, отже унарний `+` дає `NaN`.',
                theoryEN: '❌ `Number(undefined)` → `NaN`, so unary `+` yields `NaN`.',
                isCorrect: false
            },
            {
                textUK: "`Infinity + '1'` → `'Infinity1'`.",
                textEN: "`Infinity + '1'` → `'Infinity1'`.",
                theoryUK: '✅ `+` з рядком виконує конкатенацію.',
                theoryEN: '✅ `+` with a string performs concatenation.',
                isCorrect: true
            },
            {
                textUK: '`Infinity - Infinity` → `Infinity`.',
                textEN: '`Infinity - Infinity` → `Infinity`.',
                theoryUK: '❌ Різниця двох нескінченностей невизначена → `NaN`.',
                theoryEN: '❌ Subtracting two infinities is indeterminate → `NaN`.',
                isCorrect: false
            }
        ]
    },
    {
        textUK: 'Чому `isNaN` і `Number.isNaN` дають різні результати для одних і тих самих значень?',
        textEN: 'Why do `isNaN` and `Number.isNaN` produce different results for the same values?',
        theoryUK:
            "### Теорія: `isNaN` vs `Number.isNaN`\n\n- **`isNaN(value)`** спочатку **коерцює** `value` до числа (`Number(value)`), а потім перевіряє, чи це `NaN`.\n  - Приклад: `isNaN('foo')` → `true` (бо `Number('foo')` → `NaN`).\n  - `isNaN('')` → `false` (бо `Number('')` → `0`).\n  - `isNaN(undefined)` → `true` (бо `Number(undefined)` → `NaN`).\n\n- **`Number.isNaN(value)`** **нічого не коерцює** і повертає `true` **лише** коли `value` — саме числове значення `NaN`.\n  - `Number.isNaN('foo')` → `false` (рядок, не `NaN`).\n  - `Number.isNaN(NaN)` → `true`.\n  - `Number.isNaN(undefined)` → `false`.\n  - `Number.isNaN(new Number(NaN))` → `false` (це об’єкт, не примітив `NaN`).\n\n> Висновок: `isNaN` — «широка» перевірка з коерцією; `Number.isNaN` — «строга» без коерції.",
        theoryEN:
            "### Theory: `isNaN` vs `Number.isNaN`\n\n- **`isNaN(value)`** first **coerces** `value` to a number (`Number(value)`), then checks if it is `NaN`.\n  - Example: `isNaN('foo')` → `true` (since `Number('foo')` → `NaN`).\n  - `isNaN('')` → `false` (`Number('')` → `0`).\n  - `isNaN(undefined)` → `true` (`Number(undefined)` → `NaN`).\n\n- **`Number.isNaN(value)`** performs **no coercion** and returns `true` **only** when `value` is the numeric `NaN` itself.\n  - `Number.isNaN('foo')` → `false` (a string, not `NaN`).\n  - `Number.isNaN(NaN)` → `true`.\n  - `Number.isNaN(undefined)` → `false`.\n  - `Number.isNaN(new Number(NaN))` → `false` (wrapper object, not the primitive `NaN`).\n\n> Bottom line: `isNaN` is a *broad* coercing check; `Number.isNaN` is a *strict* non-coercing check.",
        level: 'middle',
        answers: [
            {
                textUK: "`isNaN('foo') === true`.",
                textEN: "`isNaN('foo') === true`.",
                theoryUK: '✅ Рядок коерцюється до `NaN`, тому `true`.',
                theoryEN: '✅ String coerces to `NaN`, hence `true`.',
                isCorrect: true
            },
            {
                textUK: "`Number.isNaN('foo') === true`.",
                textEN: "`Number.isNaN('foo') === true`.",
                theoryUK: '❌ Без коерції це просто рядок, не `NaN`.',
                theoryEN: "❌ Without coercion it's a string, not `NaN`.",
                isCorrect: false
            },
            {
                textUK: "`isNaN('') === true`.",
                textEN: "`isNaN('') === true`.",
                theoryUK: "❌ `Number('')` → `0`, отже `false`.",
                theoryEN: "❌ `Number('')` → `0`, so `false`.",
                isCorrect: false
            },
            {
                textUK: "`Number.isNaN('') === false`.",
                textEN: "`Number.isNaN('') === false`.",
                theoryUK: '✅ Без коерції порожній рядок не є `NaN`.',
                theoryEN: '✅ Without coercion an empty string is not `NaN`.',
                isCorrect: true
            },
            {
                textUK: '`isNaN(undefined) === true`.',
                textEN: '`isNaN(undefined) === true`.',
                theoryUK: '✅ `Number(undefined)` → `NaN`, отже `true`.',
                theoryEN: '✅ `Number(undefined)` → `NaN`, therefore `true`.',
                isCorrect: true
            },
            {
                textUK: '`Number.isNaN(undefined) === true`.',
                textEN: '`Number.isNaN(undefined) === true`.',
                theoryUK: '❌ `undefined` — не `NaN` без коерції.',
                theoryEN: '❌ `undefined` is not `NaN` without coercion.',
                isCorrect: false
            },
            {
                textUK: '`isNaN(NaN) === true`.',
                textEN: '`isNaN(NaN) === true`.',
                theoryUK: '✅ Очевидно: `NaN` є `NaN`.',
                theoryEN: '✅ Obvious: `NaN` is `NaN`.',
                isCorrect: true
            },
            {
                textUK: '`Number.isNaN(NaN) === true`.',
                textEN: '`Number.isNaN(NaN) === true`.',
                theoryUK: '✅ Строга перевірка повертає `true` тільки для самого `NaN`.',
                theoryEN: '✅ Strict check returns `true` only for the `NaN` value.',
                isCorrect: true
            },
            {
                textUK: "`isNaN('  ') === false`.",
                textEN: "`isNaN('  ') === false`.",
                theoryUK: '✅ Пробіли → `0`, отже не `NaN`.',
                theoryEN: '✅ Whitespace → `0`, thus not `NaN`.',
                isCorrect: true
            },
            {
                textUK: '`Number.isNaN(new Number(NaN)) === true`.',
                textEN: '`Number.isNaN(new Number(NaN)) === true`.',
                theoryUK: '❌ Це об’єкт-обгортка, не примітив `NaN`.',
                theoryEN: "❌ That's a wrapper object, not the primitive `NaN`.",
                isCorrect: false
            }
        ]
    },
    {
        textUK: 'Як працює оператор `+` при змішуванні типів (рядки, числа, об’єкти, масиви, Date, Symbol)?',
        textEN: 'How does the `+` operator work when mixing types (strings, numbers, objects, arrays, Date, Symbol)?',
        theoryUK:
            '### Теорія: подвійна семантика `+`\nОператор `+` має **два режими**:\n1) **Конкатенація рядків** — якщо хоча б один операнд є рядком **або** перетворюється на рядок під час `ToPrimitive` (підказка `default`). У цьому разі інший операнд теж приводиться до рядка, і відбувається конкатенація.\n2) **Числове додавання** — якщо обидва операнди не рядки, вони приводяться до числа (`ToNumber`) після `ToPrimitive`.\n\n**Порядок для об’єктів:** `obj[Symbol.toPrimitive]` → `valueOf()` → `toString()`. Для `Date` історично у `+` перевага — **рядок**; у відносних порівняннях (`<`/`>`) — **число** (timestamp). `Symbol` **не можна** неявно перетворювати до рядка або числа — це призводить до `TypeError`.',
        theoryEN:
            '### Theory: dual semantics of `+`\nThe `+` operator has **two modes**:\n1) **String concatenation** — if at least one operand is a string **or** becomes a string during `ToPrimitive` (hint `default`). The other operand is coerced to string and concatenated.\n2) **Numeric addition** — otherwise both operands are coerced to numbers (`ToNumber`) after `ToPrimitive`.\n\n**Object order:** `obj[Symbol.toPrimitive]` → `valueOf()` → `toString()`. `Date` tends to produce a **string** with `+`, while in relational comparisons it becomes a **number** (timestamp). `Symbol` cannot be implicitly converted to string/number — attempting so throws `TypeError`.',
        level: 'middle',
        answers: [
            {
                textUK: "`'5' + 2` → `'52'` (конкатенація).",
                textEN: "`'5' + 2` → `'52'` (concatenation).",
                theoryUK: '✅ Рядок змушує `+` працювати як конкатенацію.',
                theoryEN: '✅ A string operand makes `+` perform concatenation.',
                isCorrect: true
            },
            {
                textUK: "`2 + '5'` → `7`.",
                textEN: "`2 + '5'` → `7`.",
                theoryUK: "❌ Через рядок відбувається конкатенація → `'25'`, не додавання.",
                theoryEN: "❌ Presence of a string causes concatenation → `'25'`, not addition.",
                isCorrect: false
            },
            {
                textUK: "`[] + 1` → `'1'`.",
                textEN: "`[] + 1` → `'1'`.",
                theoryUK: "✅ `[]` → `''` через `toString()`, далі `'') + 1` → `'1'`.",
                theoryEN: "✅ `[]` → `''` via `toString()`, then concatenation yields `'1'`.",
                isCorrect: true
            },
            {
                textUK: "`[1] + 1` → `'11'`.",
                textEN: "`[1] + 1` → `'11'`.",
                theoryUK: "✅ `[1].toString()` → `'1'`; з `+` та рядком маємо конкатенацію.",
                theoryEN: "✅ `[1].toString()` → `'1'`; with `+` and a string we get concatenation.",
                isCorrect: true
            },
            {
                textUK: '`({ valueOf: () => 2 }) + 3` → `5`.',
                textEN: '`({ valueOf: () => 2 }) + 3` → `5`.',
                theoryUK: '✅ `valueOf()` дав число 2, отже числове додавання.',
                theoryEN: '✅ `valueOf()` returned 2, so numeric addition occurs.',
                isCorrect: true
            },
            {
                textUK: "`new Date(0) + 1` → `'Thu, 01 Jan 1970 ...1'` (рядок).",
                textEN: "`new Date(0) + 1` → `'Thu, 01 Jan 1970 ...1'` (string).",
                theoryUK: '✅ У `+` `Date` має рядкову упередженість, тож відбувається конкатенація.',
                theoryEN: '✅ With `+`, `Date` prefers string conversion, so concatenation happens.',
                isCorrect: true
            },
            {
                textUK: '`Number(new Date(0)) + 1` → `1`.',
                textEN: '`Number(new Date(0)) + 1` → `1`.',
                theoryUK: '✅ Явне перетворення дає 0 (timestamp), 0 + 1 = 1.',
                theoryEN: '✅ Explicit conversion gives 0 (timestamp), 0 + 1 = 1.',
                isCorrect: true
            },
            {
                textUK: "`Symbol('x') + ''` → `'Symbol(x)'`.",
                textEN: "`Symbol('x') + ''` → `'Symbol(x)'`.",
                theoryUK: '❌ Неявне перетворення `Symbol` до рядка заборонено → `TypeError`.',
                theoryEN: '❌ Implicit string coercion of `Symbol` is forbidden → `TypeError`.',
                isCorrect: false
            },
            {
                textUK: "`({ toString: () => 'A' }) + 'B'` → `'AB'`.",
                textEN: "`({ toString: () => 'A' }) + 'B'` → `'AB'`.",
                theoryUK: "✅ Після `ToPrimitive` маємо `'A'`, далі конкатенація з `'B'`.",
                theoryEN: "✅ After `ToPrimitive` we get `'A'`, then concatenation with `'B'`.",
                isCorrect: true
            },
            {
                textUK: "`({ [Symbol.toPrimitive]: () => 10 }) + '5'` → `'105'`.",
                textEN: "`({ [Symbol.toPrimitive]: () => 10 }) + '5'` → `'105'`.",
                theoryUK: "✅ Хоч об'єкт дає число 10, але через наявність рядка результат — рядок.",
                theoryEN: '✅ Even though the object yields 10, the string operand forces concatenation.',
                isCorrect: true
            }
        ]
    },
    {
        textUK: 'Як числові оператори (`-`, `*`, `/`, `%`, унарний `+`) виконують неявне приведення для рядків, null, undefined, масивів, Symbol?',
        textEN: 'How do numeric operators (`-`, `*`, `/`, `%`, unary `+`) perform implicit coercion for strings, null, undefined, arrays, Symbol?',
        theoryUK:
            "### Теорія: числові оператори прагнуть до числа\nДля `-`, `*`, `/`, `%`, унарного `+` операнди проходять `ToPrimitive`, потім `ToNumber`.\n- `null` → `0`; `true` → `1`; `false` → `0`.\n- `''` та рядок із самих пробілів → `0`; `'123'` → `123`; `'abc'` → `NaN`.\n- Масив: `[\"2\"]` → `'2'` → `2`; `[1,2]` → `'1,2'` → `NaN`.\n- `undefined` → `NaN` (будь-яка арифметика з `NaN` → `NaN`).\n- `Symbol` у `ToNumber` → `TypeError`.\nВідмінність від `+`: тут **немає** рядкової конкатенації — завжди числова коерція.",
        theoryEN:
            "### Theory: numeric operators aim for numbers\nFor `-`, `*`, `/`, `%`, unary `+`, operands undergo `ToPrimitive`, then `ToNumber`.\n- `null` → `0`; `true` → `1`; `false` → `0`.\n- `''` and whitespace-only strings → `0`; `'123'` → `123`; `'abc'` → `NaN`.\n- Arrays: `[\"2\"]` → `'2'` → `2`; `[1,2]` → `'1,2'` → `NaN`.\n- `undefined` → `NaN` (any arithmetic with `NaN` → `NaN`).\n- `Symbol` during `ToNumber` → `TypeError`.\nUnlike `+`, there is **no** string concatenation — it's always numeric coercion.",
        level: 'middle',
        answers: [
            {
                textUK: "`'6' - '2'` → `4`.",
                textEN: "`'6' - '2'` → `4`.",
                theoryUK: '✅ Обидва рядки перетворені на числа.',
                theoryEN: '✅ Both strings are converted to numbers.',
                isCorrect: true
            },
            {
                textUK: '`null * 5` → `0`.',
                textEN: '`null * 5` → `0`.',
                theoryUK: '✅ `null` → `0`, 0 × 5 = 0.',
                theoryEN: '✅ `null` → `0`, 0 × 5 = 0.',
                isCorrect: true
            },
            {
                textUK: '`undefined + 1` → `NaN` (у числовому сенсі).',
                textEN: '`undefined + 1` → `NaN` (in numeric sense).',
                theoryUK: '✅ `undefined` → `NaN`, а `NaN + 1` → `NaN`.',
                theoryEN: '✅ `undefined` → `NaN`, and `NaN + 1` → `NaN`.',
                isCorrect: true
            },
            {
                textUK: "`+'\\n\\t'` → `0`.",
                textEN: "`+'\\n\\t'` → `0`.",
                theoryUK: '✅ Рядок із пробільних символів → порожній → 0.',
                theoryEN: '✅ Whitespace-only string becomes 0.',
                isCorrect: true
            },
            {
                textUK: '`[1,2] * 2` → `2`.',
                textEN: '`[1,2] * 2` → `2`.',
                theoryUK: "❌ `[1,2]` → `'1,2'` → `NaN`, тож результат `NaN`.",
                theoryEN: "❌ `[1,2]` → `'1,2'` → `NaN`, so the result is `NaN`.",
                isCorrect: false
            },
            {
                textUK: "`['2'] - 1` → `1`.",
                textEN: "`['2'] - 1` → `1`.",
                theoryUK: "✅ `['2']` → `'2'` → 2; 2 − 1 = 1.",
                theoryEN: "✅ `['2']` → `'2'` → 2; 2 − 1 = 1.",
                isCorrect: true
            },
            {
                textUK: "`+Symbol('x')` → `0`.",
                textEN: "`+Symbol('x')` → `0`.",
                theoryUK: '❌ `ToNumber(Symbol)` заборонено → `TypeError`.',
                theoryEN: '❌ `ToNumber(Symbol)` is forbidden → `TypeError`.',
                isCorrect: false
            },
            {
                textUK: "`'abc' / 2` → `NaN`.",
                textEN: "`'abc' / 2` → `NaN`.",
                theoryUK: '✅ Нечисловий рядок перетворюється на `NaN`.',
                theoryEN: '✅ Non-numeric string converts to `NaN`.',
                isCorrect: true
            },
            {
                textUK: '`true % 2` → `1`.',
                textEN: '`true % 2` → `1`.',
                theoryUK: '✅ `true` → `1`, 1 % 2 = 1.',
                theoryEN: '✅ `true` → `1`, 1 % 2 = 1.',
                isCorrect: true
            },
            {
                textUK: "`+''` → `NaN`.",
                textEN: "`+''` → `NaN`.",
                theoryUK: '❌ Порожній рядок стає `0`, не `NaN`.',
                theoryEN: '❌ Empty string coerces to `0`, not `NaN`.',
                isCorrect: false
            }
        ]
    },
    {
        textUK: 'Які базові правила абстрактної рівності `==` і які в ній типові пастки (null/undefined, рядки з числами, boolean, об’єкти/масиви, NaN)?',
        textEN: 'What are the basic `==` abstract equality rules and its common pitfalls (null/undefined, strings vs numbers, booleans, objects/arrays, NaN)?',
        theoryUK:
            '### Теорія: абстрактна рівність `==`\n- Якщо типи однакові → порівняння як у `===` (окрім `NaN`).\n- `null` і `undefined` рівні **лише** один одному.\n- `boolean` перед порівнянням перетворюється на число (`true`→1, `false`→0).\n- `string` з `number` → рядок перетворюється на число.\n- `object` з примітивом → об’єкт через `ToPrimitive` (потім порівняння).\n- `NaN` ніколи не дорівнює нічому, навіть самому собі.',
        theoryEN:
            '### Theory: abstract equality `==`\n- If types match → comparison is like `===` (except for `NaN`).\n- `null` and `undefined` are equal **only** to each other.\n- `boolean` is converted to number before comparison (`true`→1, `false`→0).\n- `string` vs `number` → the string is converted to number.\n- `object` vs primitive → object goes through `ToPrimitive` (then compare).\n- `NaN` is never equal to anything, not even itself.',
        level: 'middle',
        answers: [
            {
                textUK: '`null == undefined` → `true`.',
                textEN: '`null == undefined` → `true`.',
                theoryUK: '✅ Спеціальне правило для `==`.',
                theoryEN: '✅ Special rule for `==`.',
                isCorrect: true
            },
            {
                textUK: '`null == 0` → `true`.',
                textEN: '`null == 0` → `true`.',
                theoryUK: '❌ `null` не дорівнює жодному числу.',
                theoryEN: '❌ `null` is not equal to any number.',
                isCorrect: false
            },
            {
                textUK: "`'0' == false` → `true`.",
                textEN: "`'0' == false` → `true`.",
                theoryUK: "✅ `false` → 0; `'0'` → 0; 0 == 0.",
                theoryEN: "✅ `false` → 0; `'0'` → 0; 0 == 0.",
                isCorrect: true
            },
            {
                textUK: "`'' == 0` → `true`.",
                textEN: "`'' == 0` → `true`.",
                theoryUK: '✅ Порожній рядок при порівнянні з числом стає 0.',
                theoryEN: '✅ Empty string becomes 0 when compared to a number.',
                isCorrect: true
            },
            {
                textUK: "`[] == ''` → `true`.",
                textEN: "`[] == ''` → `true`.",
                theoryUK: "✅ `[]` → `''` через `toString()`.",
                theoryEN: "✅ `[]` → `''` via `toString()`.",
                isCorrect: true
            },
            {
                textUK: '`[] == 0` → `true`.',
                textEN: '`[] == 0` → `true`.',
                theoryUK: "✅ `[]` → `''` → `0`.",
                theoryEN: "✅ `[]` → `''` → `0`.",
                isCorrect: true
            },
            {
                textUK: "`[1,2] == '1,2'` → `true`.",
                textEN: "`[1,2] == '1,2'` → `true`.",
                theoryUK: "✅ Масив перетворюється на рядок `'1,2'` і порівнюється як рядок.",
                theoryEN: "✅ The array coerces to `'1,2'` and compares as a string.",
                isCorrect: true
            },
            {
                textUK: '`NaN == NaN` → `true`.',
                textEN: '`NaN == NaN` → `true`.',
                theoryUK: '❌ `NaN` не дорівнює навіть самому собі; для перевірки використовуйте `Number.isNaN` або `Object.is`.',
                theoryEN: '❌ `NaN` is not equal to itself; use `Number.isNaN` or `Object.is` to check.',
                isCorrect: false
            },
            {
                textUK: '`true == 1` → `true`.',
                textEN: '`true == 1` → `true`.',
                theoryUK: '✅ `true` → 1 перед порівнянням.',
                theoryEN: '✅ `true` is coerced to 1 before comparison.',
                isCorrect: true
            },
            {
                textUK: "`{} == '[object Object]'` завжди `true`.",
                textEN: "`{} == '[object Object]'` is always `true`.",
                theoryUK: '❌ Це залежить від синтаксичного контексту та `ToPrimitive`; не «завжди» істина й безпечніше так не порівнювати.',
                theoryEN: '❌ Depends on parsing context and `ToPrimitive`; it\'s not "always" true and is unsafe to rely on.',
                isCorrect: false
            }
        ]
    },
    {
        textUK: 'Чим відрізняється `==` від `===` у контексті коерцій?',
        textEN: 'How does `==` differ from `===` in the context of coercion?',
        theoryUK:
            '### Теорія: `==` vs `===`\n- **`===` (строга рівність)**: *без коерції типів*. Якщо типи різні — одразу `false`. Винятки: `+0 === -0` → `true`; `NaN === NaN` → `false`.\n- **`==` (абстрактна рівність)**: *може виконувати коерцію* за правилами специ: `boolean → number`, `string ↔ number`, `object → primitive` (через `@@toPrimitive → valueOf → toString`). Спецвипадок: `null == undefined` → `true` і лише між собою.\n- `NaN` ніколи не дорівнює нічому в обох операторах.\n\n> Практичне правило: коли потрібна перевірка без прихованих перетворень — використовуйте `===`.',
        theoryEN:
            '### Theory: `==` vs `===`\n- **`===` (strict equality)**: *no type coercion*. If types differ → `false`. Exceptions: `+0 === -0` → `true`; `NaN === NaN` → `false`.\n- **`==` (abstract equality)**: *may coerce types* per spec rules: `boolean → number`, `string ↔ number`, `object → primitive` (`@@toPrimitive → valueOf → toString`). Special: `null == undefined` → `true` and only to each other.\n- `NaN` never equals anything under either operator.\n\n> Practical rule: prefer `===` when you don’t want hidden conversions.',
        level: 'middle',
        answers: [
            {
                textUK: "`'0' == 0` → `true`, тоді як `'0' === 0` → `false`.",
                textEN: "`'0' == 0` → `true`, whereas `'0' === 0` → `false`.",
                theoryUK: '✅ Для `==` рядок приводиться до числа 0; `===` не коерцює типи.',
                theoryEN: '✅ With `==` the string is coerced to number 0; `===` does not coerce.',
                isCorrect: true
            },
            {
                textUK: "`false == '0'` → `true`, але `false === '0'` → `true`.",
                textEN: "`false == '0'` → `true`, but `false === '0'` → `true`.",
                theoryUK: '❌ Для `===` типи різні (boolean vs string), результат `false`.',
                theoryEN: '❌ For `===`, types differ (boolean vs string), result is `false`.',
                isCorrect: false
            },
            {
                textUK: '`0 == false` → `true`, `0 === false` → `false`.',
                textEN: '`0 == false` → `true`, `0 === false` → `false`.',
                theoryUK: '✅ `false` коертується до 0 для `==`; `===` не виконує коерцію.',
                theoryEN: '✅ `false` is coerced to 0 for `==`; `===` does no coercion.',
                isCorrect: true
            },
            {
                textUK: '`[0] == 0` → `true`, а `[0] === 0` → `true`.',
                textEN: '`[0] == 0` → `true`, and `[0] === 0` → `true`.',
                theoryUK: '❌ Для `===` об’єкт ніколи не дорівнює числу (без коерції).',
                theoryEN: '❌ For `===` an object never equals a number (no coercion).',
                isCorrect: false
            },
            {
                textUK: '`null == undefined` → `true`, але `null === undefined` → `false`.',
                textEN: '`null == undefined` → `true`, but `null === undefined` → `false`.',
                theoryUK: '✅ Спецправило для `==`; строгий оператор вимагає однакові типи.',
                theoryEN: '✅ Special case for `==`; strict operator requires same types.',
                isCorrect: true
            },
            {
                textUK: '`NaN == NaN` → `false`, а `NaN === NaN` → `true`.',
                textEN: '`NaN == NaN` → `false`, while `NaN === NaN` → `true`.',
                theoryUK: '❌ В обох випадках порівняння з `NaN` → `false`.',
                theoryEN: '❌ In both cases, comparisons with `NaN` are `false`.',
                isCorrect: false
            },
            {
                textUK: '`+0 === -0` → `true`.',
                textEN: '`+0 === -0` → `true`.',
                theoryUK: '✅ У строгій рівності ці значення вважаються рівними.',
                theoryEN: '✅ In strict equality these values are equal.',
                isCorrect: true
            },
            {
                textUK: '`Object.is(+0, -0)` дає те саме, що `+0 === -0`.',
                textEN: '`Object.is(+0, -0)` gives the same as `+0 === -0`.',
                theoryUK: '❌ `Object.is(+0, -0)` → `false`, на відміну від `===`.',
                theoryEN: '❌ `Object.is(+0, -0)` → `false`, unlike `===`.',
                isCorrect: false
            },
            {
                textUK: "`'\\n' == 0` → `true`, тоді як `'\\n' === 0` → `false`.",
                textEN: "`'\\n' == 0` → `true`, whereas `'\\n' === 0` → `false`.",
                theoryUK: '✅ Пробільний рядок коертується у 0 для `==`; `===` — різні типи.',
                theoryEN: '✅ Whitespace string coerces to 0 for `==`; `===` types differ.',
                isCorrect: true
            },
            {
                textUK: '`[] === []` → `true`.',
                textEN: '`[] === []` → `true`.',
                theoryUK: '❌ Різні об’єктні посилання → `false`.',
                theoryEN: '❌ Different object references → `false`.',
                isCorrect: false
            }
        ]
    },
    {
        textUK: 'Як працює абстрактне відносне порівняння (`<`, `>`, `<=`, `>=`) з рядками, числами, null, undefined, масивами та Date?',
        textEN: 'How does abstract relational comparison (`<`, `>`, `<=`, `>=`) work with strings, numbers, null, undefined, arrays, and Date?',
        theoryUK:
            "### Теорія: абстрактне відносне порівняння\n1) Якщо **обидва — рядки** → лексикографічне порівняння (за кодпоінтами).\n2) Інакше: обидва операнди проходять `ToPrimitive`, далі `ToNumber` і порівнюються як числа.\n- `null` → `+0`.\n- `undefined` → `NaN` → будь-яке порівняння із `NaN` дає `false`.\n- Масив `[x]` → `'x'` → число; масив з кількома елементами → `NaN`.\n- `Date` у відносних порівняннях дає **число** (timestamp), на відміну від `+`, де схиляється до **рядка**.",
        theoryEN:
            "### Theory: abstract relational comparison\n1) If **both are strings** → lexicographic comparison (by code points).\n2) Otherwise: both operands undergo `ToPrimitive`, then `ToNumber`, and are compared as numbers.\n- `null` → `+0`.\n- `undefined` → `NaN` → any comparison with `NaN` is `false`.\n- Array `[x]` → `'x'` → number; multi-element arrays → `NaN`.\n- `Date` in relational comparisons yields a **number** (timestamp); with `+` it typically becomes a **string**.",
        level: 'middle',
        answers: [
            {
                textUK: "`'2' < '10'` → `false` (лексикографічно).",
                textEN: "`'2' < '10'` → `false` (lexicographic).",
                theoryUK: "✅ Порівнюються посимвольно: `'2'` > `'1'`.",
                theoryEN: "✅ Compared by characters: `'2'` > `'1'`.",
                isCorrect: true
            },
            {
                textUK: "`2 < '10'` → `true`.",
                textEN: "`2 < '10'` → `true`.",
                theoryUK: '✅ Рядок приводиться до числа 10.',
                theoryEN: '✅ The string coerces to number 10.',
                isCorrect: true
            },
            {
                textUK: '`null >= 0` → `true`, а `null > 0` → `false`.',
                textEN: '`null >= 0` → `true`, and `null > 0` → `false`.',
                theoryUK: '✅ `null` → 0; 0 ≥ 0 істина, 0 > 0 хиба.',
                theoryEN: '✅ `null` → 0; 0 ≥ 0 is true, 0 > 0 is false.',
                isCorrect: true
            },
            {
                textUK: '`undefined < 1` → `true`.',
                textEN: '`undefined < 1` → `true`.',
                theoryUK: '❌ `undefined` → `NaN`; порівняння з `NaN` повертають `false`.',
                theoryEN: '❌ `undefined` → `NaN`; comparisons with `NaN` return `false`.',
                isCorrect: false
            },
            {
                textUK: '`[2] > 1` → `true`.',
                textEN: '`[2] > 1` → `true`.',
                theoryUK: "✅ `[2]` → `'2'` → 2; 2 > 1.",
                theoryEN: "✅ `[2]` → `'2'` → 2; 2 > 1.",
                isCorrect: true
            },
            {
                textUK: '`[1,2] < 3` → `true`.',
                textEN: '`[1,2] < 3` → `true`.',
                theoryUK: "❌ `[1,2]` → `'1,2'` → `NaN`; з `NaN` порівняння → `false`.",
                theoryEN: "❌ `[1,2]` → `'1,2'` → `NaN`; comparisons with `NaN` → `false`.",
                isCorrect: false
            },
            {
                textUK: '`new Date(0) < 1` → `true`.',
                textEN: '`new Date(0) < 1` → `true`.',
                theoryUK: '✅ У relational контексті `Date` → число (0).',
                theoryEN: '✅ In relational context `Date` → number (0).',
                isCorrect: true
            },
            {
                textUK: "`'10' > '2'` → `true`.",
                textEN: "`'10' > '2'` → `true`.",
                theoryUK: "❌ Лексикографічно `'10'` < `'2'`, тож твердження хибне.",
                theoryEN: "❌ Lexicographically `'10'` < `'2'`, so the claim is false.",
                isCorrect: false
            },
            {
                textUK: "`'\\n' <= 0` → `true`.",
                textEN: "`'\\n' <= 0` → `true`.",
                theoryUK: '✅ Пробільний рядок → 0; 0 ≤ 0 істина.',
                theoryEN: '✅ Whitespace string → 0; 0 ≤ 0 is true.',
                isCorrect: true
            },
            {
                textUK: "`'abc' >= 0` → `true`.",
                textEN: "`'abc' >= 0` → `true`.",
                theoryUK: "❌ `'abc'` → `NaN`; порівняння з `NaN` → `false`.",
                theoryEN: "❌ `'abc'` → `NaN`; comparison with `NaN` → `false`.",
                isCorrect: false
            }
        ]
    },
    {
        textUK: 'Як відбувається неявне приведення об’єктів: порядок викликів `Symbol.toPrimitive`, `valueOf`, `toString` і що стається при помилковому результаті?',
        textEN: 'How does implicit coercion of objects work: the order of `Symbol.toPrimitive`, `valueOf`, `toString` calls, and what happens with invalid results?',
        theoryUK:
            "### Теорія: `ToPrimitive(obj, hint)`\n1) Якщо є `obj[Symbol.toPrimitive]`, викликається з підказкою (`'number'|'string'|'default'`).\n2) Інакше викликається `valueOf()`; якщо повертає **примітив** — він і береться.\n3) Інакше викликається `toString()`.\nЯкщо жоден крок не повернув примітив — **`TypeError`**. Якщо повернуто `Symbol` там, де потрібні число/рядок — також **`TypeError`**.",
        theoryEN:
            "### Theory: `ToPrimitive(obj, hint)`\n1) If `obj[Symbol.toPrimitive]` exists, call it with the hint (`'number'|'string'|'default'`).\n2) Else call `valueOf()`; if it returns a **primitive**, use it.\n3) Else call `toString()`.\nIf none returns a primitive → **`TypeError`**. Returning a `Symbol` where a number/string is required also throws **`TypeError`**.",
        level: 'middle',
        answers: [
            {
                textUK: "`({ [Symbol.toPrimitive]: () => 'X' }) + 'Y'` → `'XY'`.",
                textEN: "`({ [Symbol.toPrimitive]: () => 'X' }) + 'Y'` → `'XY'`.",
                theoryUK: '✅ Результат із `@@toPrimitive` — примітивний рядок; далі конкатенація.',
                theoryEN: '✅ `@@toPrimitive` returns a primitive string; then concatenation.',
                isCorrect: true
            },
            {
                textUK: '`({ valueOf: () => 2 }) * 3` → `6`.',
                textEN: '`({ valueOf: () => 2 }) * 3` → `6`.',
                theoryUK: '✅ `valueOf()` повертає 2 (примітив), відбувається числова операція.',
                theoryEN: '✅ `valueOf()` returns 2 (primitive), numeric operation proceeds.',
                isCorrect: true
            },
            {
                textUK: "`({ valueOf: () => ({}), toString: () => '7' }) - 5` → `2`.",
                textEN: "`({ valueOf: () => ({}), toString: () => '7' }) - 5` → `2`.",
                theoryUK: '✅ `valueOf` відкидається (повертає об’єкт), береться `toString()`.',
                theoryEN: '✅ `valueOf` is ignored (returns object), `toString()` is used.',
                isCorrect: true
            },
            {
                textUK: '`({ toString: () => ({}) }) + 1` кидає `TypeError`.',
                textEN: '`({ toString: () => ({}) }) + 1` throws `TypeError`.',
                theoryUK: '✅ Жоден метод не повернув примітив — виникає помилка.',
                theoryEN: '✅ No method returned a primitive — an error is thrown.',
                isCorrect: true
            },
            {
                textUK: "`({ [Symbol.toPrimitive]: () => Symbol('s') }) + 1` → `NaN`.",
                textEN: "`({ [Symbol.toPrimitive]: () => Symbol('s') }) + 1` → `NaN`.",
                theoryUK: '❌ Повернення `Symbol` у числовому контексті заборонене → `TypeError`.',
                theoryEN: '❌ Returning a `Symbol` in numeric context is forbidden → `TypeError`.',
                isCorrect: false
            },
            {
                textUK: "`({}) + ({})` завжди дорівнює `'[object Object][object Object]'`.",
                textEN: "`({}) + ({})` is always `'[object Object][object Object]'`.",
                theoryUK: '❌ Залежить від синтаксичного контексту; у виразі з дужками так, але «завжди» — некоректно.',
                theoryEN: '❌ Depends on parsing context; with parentheses yes, but not “always”.',
                isCorrect: false
            },
            {
                textUK: '`Number(new Date(0))` → `0`.',
                textEN: '`Number(new Date(0))` → `0`.',
                theoryUK: '✅ Явне перетворення використовує `valueOf()` дати (timestamp).',
                theoryEN: '✅ Explicit conversion uses date’s `valueOf()` (timestamp).',
                isCorrect: true
            },
            {
                textUK: "`String({})` → `'[object Object]'`.",
                textEN: "`String({})` → `'[object Object]'`.",
                theoryUK: '✅ Дефолтна рядкова репрезентація об’єкта.',
                theoryEN: '✅ Default string representation of an object.',
                isCorrect: true
            },
            {
                textUK: "`({ valueOf: () => 0 }) || 'x'` повертає `'x'`.",
                textEN: "`({ valueOf: () => 0 }) || 'x'` returns `'x'`.",
                theoryUK: '❌ Логічні оператори не коерцюють об’єкти до числа; об’єкт truthy, повернеться сам об’єкт.',
                theoryEN: '❌ Logical operators don’t coerce objects to number; objects are truthy, it returns the object.',
                isCorrect: false
            },
            {
                textUK: "`({ toString: () => '2' }) - '1'` → `1`.",
                textEN: "`({ toString: () => '2' }) - '1'` → `1`.",
                theoryUK: "✅ `-` змушує обидва операнди перейти до числа: `'2'` → 2, `'1'` → 1.",
                theoryEN: "✅ `-` forces numeric coercion: `'2'` → 2, `'1'` → 1.",
                isCorrect: true
            }
        ]
    },
    {
        textUK: 'Як працює ToBoolean (truthy/falsy) і чому логічні оператори (&&, ||, ??) повертають значення, а не true/false?',
        textEN: 'How does ToBoolean (truthy/falsy) work and why do logical operators (&&, ||, ??) return values instead of true/false?',
        theoryUK:
            "### Теорія: ToBoolean і повернення операндів\n**Falsy** значення: `false`, `0`, `-0`, `0n`, `''` (порожній рядок), `null`, `undefined`, `NaN`. Усі об’єкти (включно з `new Boolean(false)`) — **truthy**.\n\n**Чому `&&`/`||`/`??` повертають значення?**\n- `a && b` повертає **перший falsy** операнд, або **останній** (якщо всі truthy).\n- `a || b` повертає **перший truthy** операнд.\n- `a ?? b` повертає `a`, **крім** випадків коли `a` є `null` або `undefined`; тоді повертає `b`. Це **не** те саме, що `||`, бо `||` спрацьовує на будь-яке falsy (наприклад, `0`, `''`).",
        theoryEN:
            "### Theory: ToBoolean and returning operands\n**Falsy** values: `false`, `0`, `-0`, `0n`, `''` (empty string), `null`, `undefined`, `NaN`. All objects (including `new Boolean(false)`) are **truthy**.\n\n**Why do `&&`/`||`/`??` return values?**\n- `a && b` returns the **first falsy** operand, or the **last** one if all are truthy.\n- `a || b` returns the **first truthy** operand.\n- `a ?? b` returns `a` unless `a` is `null` or `undefined`; then it returns `b`. This is **not** the same as `||` because `||` triggers on any falsy (e.g., `0`, `''`).",
        level: 'middle',
        answers: [
            {
                textUK: '`Boolean(new Boolean(false))` → `true`.',
                textEN: '`Boolean(new Boolean(false))` → `true`.',
                theoryUK: '✅ Об’єкт-обгортка — завжди truthy, навіть якщо всередині false.',
                theoryEN: '✅ Wrapper objects are truthy even if they wrap false.',
                isCorrect: true
            },
            {
                textUK: "`[] && 'x'` → `'x'`.",
                textEN: "`[] && 'x'` → `'x'`.",
                theoryUK: '✅ Порожній масив — truthy; `&&` поверне другий операнд.',
                theoryEN: '✅ Empty array is truthy; `&&` returns the second operand.',
                isCorrect: true
            },
            {
                textUK: "`0 || 'x'` → `'x'`.",
                textEN: "`0 || 'x'` → `'x'`.",
                theoryUK: '✅ `0` — falsy; `||` повертає перший truthy операнд.',
                theoryEN: '✅ `0` is falsy; `||` returns the first truthy operand.',
                isCorrect: true
            },
            {
                textUK: "`0 ?? 'x'` → `'x'`.",
                textEN: "`0 ?? 'x'` → `'x'`.",
                theoryUK: '❌ `??` не реагує на `0`; повертається `0`.',
                theoryEN: '❌ `??` does not trigger on `0`; it returns `0`.',
                isCorrect: false
            },
            {
                textUK: "`null ?? 'x'` → `'x'`.",
                textEN: "`null ?? 'x'` → `'x'`.",
                theoryUK: '✅ `null` активує `??`, тож повертається правий операнд.',
                theoryEN: '✅ `null` triggers `??`, so the right operand is returned.',
                isCorrect: true
            },
            {
                textUK: "`NaN || 'a'` → `NaN`.",
                textEN: "`NaN || 'a'` → `NaN`.",
                theoryUK: "❌ `NaN` — falsy; `||` поверне `'a'`.",
                theoryEN: "❌ `NaN` is falsy; `||` returns `'a'`.",
                isCorrect: false
            },
            {
                textUK: '`({}) || 0` → `({})` (сам об’єкт).',
                textEN: '`({}) || 0` → `({})` (the object itself).',
                theoryUK: '✅ Об’єкт — truthy; `||` повертає перший truthy.',
                theoryEN: '✅ Objects are truthy; `||` returns the first truthy.',
                isCorrect: true
            },
            {
                textUK: "`false ?? 'x'` → `'x'`.",
                textEN: "`false ?? 'x'` → `'x'`.",
                theoryUK: '❌ `false` не є `null` або `undefined`; результат — `false`.',
                theoryEN: '❌ `false` is not `null`/`undefined`; the result is `false`.',
                isCorrect: false
            },
            {
                textUK: "`0n && 'y'` → `0n`.",
                textEN: "`0n && 'y'` → `0n`.",
                theoryUK: '✅ `0n` — єдиний falsy серед BigInt; `&&` повертає перший falsy.',
                theoryEN: '✅ `0n` is the only falsy BigInt; `&&` returns the first falsy.',
                isCorrect: true
            },
            {
                textUK: "`'' || 0` → `0`.",
                textEN: "`'' || 0` → `0`.",
                theoryUK: '✅ Порожній рядок — falsy; `||` повертає 0 (truthy? ні, але це перший не-falsy серед операндів).',
                theoryEN: '✅ Empty string is falsy; `||` returns 0 (the first non-falsy among operands).',
                isCorrect: true
            }
        ]
    },
    {
        textUK: 'Як відбувається коерція у шаблонних літералах ${expr} і чому з Symbol виникає помилка?',
        textEN: 'How does coercion work in template literals ${expr}, and why does Symbol cause an error?',
        theoryUK:
            "### Теорія: інтерполяція в шаблонних літералах\nУ виразі `` `...${expr}...` `` виконується **`ToString(expr)`**. Більшість типів успішно перетворюються у рядок: числа, `null` (`'null'`), `undefined` (`'undefined'`), масиви (`'1,2'`), об’єкти (`'[object Object]'`, якщо не перевизначено `toString`).\n\n**Важливо:** `Symbol` **не можна** неявно перетворювати до рядка. Інтерполяція `Symbol` без явного `String(sym)` призводить до `TypeError`.",
        theoryEN:
            "### Theory: interpolation in template literals\nIn `` `...${expr}...` ``, the engine performs **`ToString(expr)`**. Most types convert to strings: numbers, `null` (`'null'`), `undefined` (`'undefined'`), arrays (`'1,2'`), objects (`'[object Object]'` unless `toString` is overridden).\n\n**Important:** `Symbol` **cannot** be implicitly converted to string. Interpolating a `Symbol` without `String(sym)` throws `TypeError`.",
        level: 'middle',
        answers: [
            {
                textUK: "`` `x=${1}` `` → `'x=1'`.",
                textEN: "`` `x=${1}` `` → `'x=1'`.",
                theoryUK: '✅ Число перетворюється на рядок.',
                theoryEN: '✅ Number converts to string.',
                isCorrect: true
            },
            {
                textUK: "`` `x=${null}` `` → `'x=null'`.",
                textEN: "`` `x=${null}` `` → `'x=null'`.",
                theoryUK: "✅ `String(null)` → `'null'`.",
                theoryEN: "✅ `String(null)` → `'null'`.",
                isCorrect: true
            },
            {
                textUK: "`` `x=${undefined}` `` → `'x=undefined'`.",
                textEN: "`` `x=${undefined}` `` → `'x=undefined'`.",
                theoryUK: "✅ `String(undefined)` → `'undefined'`.",
                theoryEN: "✅ `String(undefined)` → `'undefined'`.",
                isCorrect: true
            },
            {
                textUK: "`` `x=${[1,2]}` `` → `'x=1,2'`.",
                textEN: "`` `x=${[1,2]}` `` → `'x=1,2'`.",
                theoryUK: '✅ Масив перетворюється через `toString()`.',
                theoryEN: '✅ Array converts via `toString()`.',
                isCorrect: true
            },
            {
                textUK: "`` `x=${{}}` `` → `'x=[object Object]'`.",
                textEN: "`` `x=${{}}` `` → `'x=[object Object]'`.",
                theoryUK: '✅ Дефолтний `toString` об’єкта.',
                theoryEN: '✅ Default object `toString`.',
                isCorrect: true
            },
            {
                textUK: "`` `x=${Symbol('s')}` `` → `'x=Symbol(s)'`.",
                textEN: "`` `x=${Symbol('s')}` `` → `'x=Symbol(s)'`.",
                theoryUK: '❌ Інтерполяція `Symbol` без `String()` кидає `TypeError`.',
                theoryEN: '❌ Interpolating `Symbol` without `String()` throws `TypeError`.',
                isCorrect: false
            },
            {
                textUK: "`` `x=${String(Symbol('s'))}` `` → `'x=Symbol(s)'`.",
                textEN: "`` `x=${String(Symbol('s'))}` `` → `'x=Symbol(s)'`.",
                theoryUK: '✅ Явне перетворення робить інтерполяцію безпечною.',
                theoryEN: '✅ Explicit conversion makes interpolation safe.',
                isCorrect: true
            },
            {
                textUK: "`` `x=${{ toString(){ return 'ok' }}}` `` → `'x=ok'`.",
                textEN: "`` `x=${{ toString(){ return 'ok' }}}` `` → `'x=ok'`.",
                theoryUK: '✅ Користувацький `toString` використовується при `ToString`.',
                theoryEN: '✅ Custom `toString` is used during `ToString`.',
                isCorrect: true
            },
            {
                textUK: "`` `x=${{ [Symbol.toPrimitive](){ return 2 }}}` `` → `'x=2'`.",
                textEN: "`` `x=${{ [Symbol.toPrimitive](){ return 2 }}}` `` → `'x=2'`.",
                theoryUK: '✅ Повернене число конвертується у рядок.',
                theoryEN: '✅ Returned number converts to string.',
                isCorrect: true
            },
            {
                textUK: "`` `x=${true}` `` → `'x=true'`.",
                textEN: "`` `x=${true}` `` → `'x=true'`.",
                theoryUK: '✅ Boolean перетворюється рядком `"true"`/`"false"`.',
                theoryEN: '✅ Boolean converts to the string `"true"`/`"false"`.',
                isCorrect: true
            }
        ]
    },
    {
        textUK: 'Які особливості неявних приведень для BigInt (арифметика з Number, унарний +, порівняння, Boolean)?',
        textEN: 'What are the specifics of implicit coercion for BigInt (arithmetic with Number, unary +, comparisons, Boolean)?',
        theoryUK:
            '### Теорія: BigInt і коерції\n- Змішана **арифметика** `Number` з `BigInt` **заборонена** → `TypeError` (`1n + 1`).\n- Унарний `+` для `BigInt` **заборонений** → `TypeError` (`+1n`).\n- Порівняння: `1n == 1` → `true` (абстрактна рівність може порівнювати), але `1n === 1` → `false` (типи різні). Відносні порівняння (`<`, `>`) між `Number` і `BigInt` дозволені.\n- `Boolean(0n)` → `false`, `Boolean(1n)` → `true`.',
        theoryEN:
            '### Theory: BigInt and coercions\n- Mixed **arithmetic** between `Number` and `BigInt` is **forbidden** → `TypeError` (`1n + 1`).\n- Unary `+` on `BigInt` is **forbidden** → `TypeError` (`+1n`).\n- Comparisons: `1n == 1` → `true` (abstract equality may compare), but `1n === 1` → `false` (types differ). Relational comparisons (`<`, `>`) between `Number` and `BigInt` are allowed.\n- `Boolean(0n)` → `false`, `Boolean(1n)` → `true`.',
        level: 'middle',
        answers: [
            {
                textUK: '`1n + 2n` → `3n`.',
                textEN: '`1n + 2n` → `3n`.',
                theoryUK: '✅ Чиста арифметика BigInt дозволена.',
                theoryEN: '✅ Pure BigInt arithmetic is allowed.',
                isCorrect: true
            },
            {
                textUK: '`1n + 1` → `2n`.',
                textEN: '`1n + 1` → `2n`.',
                theoryUK: '❌ Змішана арифметика Number/BigInt → `TypeError`.',
                theoryEN: '❌ Mixed Number/BigInt arithmetic → `TypeError`.',
                isCorrect: false
            },
            {
                textUK: '`1n == 1` → `true`.',
                textEN: '`1n == 1` → `true`.',
                theoryUK: '✅ Абстрактна рівність дозволяє таке порівняння.',
                theoryEN: '✅ Abstract equality allows this comparison.',
                isCorrect: true
            },
            {
                textUK: '`1n === 1` → `false`.',
                textEN: '`1n === 1` → `false`.',
                theoryUK: '✅ Типи різні: BigInt vs Number.',
                theoryEN: '✅ Types differ: BigInt vs Number.',
                isCorrect: true
            },
            {
                textUK: '`+1n` → `1`.',
                textEN: '`+1n` → `1`.',
                theoryUK: '❌ Унарний `+` для BigInt заборонений → `TypeError`.',
                theoryEN: '❌ Unary `+` on BigInt is forbidden → `TypeError`.',
                isCorrect: false
            },
            {
                textUK: '`Boolean(0n)` → `false`.',
                textEN: '`Boolean(0n)` → `false`.',
                theoryUK: '✅ Єдиний falsy серед BigInt — `0n`.',
                theoryEN: '✅ The only falsy BigInt is `0n`.',
                isCorrect: true
            },
            {
                textUK: '`1n < 2` → `true`.',
                textEN: '`1n < 2` → `true`.',
                theoryUK: '✅ Відносні порівняння Number/BigInt дозволені.',
                theoryEN: '✅ Relational comparisons Number/BigInt are allowed.',
                isCorrect: true
            },
            {
                textUK: "`1n + '1'` → `'11'`.",
                textEN: "`1n + '1'` → `'11'`.",
                theoryUK: '❌ `+` із BigInt і рядком не виконує конкатенацію — буде `TypeError`.',
                theoryEN: '❌ `+` with BigInt and string does not concatenate — it throws `TypeError`.',
                isCorrect: false
            },
            {
                textUK: '`Number(1n)` → `1`.',
                textEN: '`Number(1n)` → `1`.',
                theoryUK: '✅ Явне перетворення дозволене.',
                theoryEN: '✅ Explicit conversion is allowed.',
                isCorrect: true
            },
            {
                textUK: '`Boolean(1n)` → `false`.',
                textEN: '`Boolean(1n)` → `false`.',
                theoryUK: '❌ Ненульовий BigInt — truthy; результат `true`.',
                theoryEN: '❌ Non-zero BigInt is truthy; the result is `true`.',
                isCorrect: false
            }
        ]
    }
];
