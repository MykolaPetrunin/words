import { TopicMock } from '../types';

export const tests: TopicMock = {
    titleUK: 'Неявне перетворення типів',
    titleEN: 'Implicit Type Casting',
    questions: [
        {
            textUK: 'Що таке неявне (implicit) приведення типів у JavaScript?',
            textEN: 'What is implicit type coercion in JavaScript?',
            theoryUK:
                "### Коротко\n**Неявне приведення типів** — це автоматичне перетворення значень рушієм JS, коли контекст вимагає інший тип (наприклад, оператор або конструкція мови очікують число, рядок або булеве значення).\n\n### Як це працює\nJS має стандартизовані абстрактні операції:\n- **ToPrimitive** (з підказкою *number* або *string*) — якщо значення не є примітивом, рушій викликає послідовно `@@toPrimitive`, `valueOf()` або `toString()`.\n- **ToNumber**, **ToString**, **ToBoolean** — перетворення примітивів до потрібного типу залежно від контексту.\n\n### Типові приклади\n```js\n1 + '2'       // '12'  (число → рядок)\n'5' * '2'     // 10    (рядки → числа)\nif ('') { }   // '' → false (ToBoolean)\n[] == ''      // true  (абстрактна рівність з коерцією)\n```\n\n### Проблемні моменти\n- Коерція **виконується під час виконання (runtime)**.\n- Вона **відрізняється від явного приведення**, яке виконується викликом функцій (`Number()`, `String()` тощо).\n- Неявна коерція може бути **джерелом неочікуваних результатів**, особливо з оператором `==`.",
            theoryEN:
                "### Summary\n**Implicit type coercion** is the automatic conversion of values by the JS engine when the context expects another type (for example, an operator or language construct expects a number, string, or boolean).\n\n### How it works\nJavaScript uses abstract operations:\n- **ToPrimitive** (with hint *number* or *string*). For objects, the engine calls `@@toPrimitive`, then `valueOf()`, then `toString()`.\n- **ToNumber**, **ToString**, and **ToBoolean** — conversions between primitive types depending on the context.\n\n### Typical examples\n```js\n1 + '2'       // '12'\n'5' * '2'     // 10\nif ('') { }   // '' → false\n[] == ''      // true\n```\n\n### Key notes\n- Coercion happens **at runtime**.\n- It differs from **explicit coercion** (using functions like `Number()`, `String()`).\n- Implicit coercion can sometimes lead to **unexpected results**, especially with the `==` operator.",
            answers: [
                {
                    textUK: 'Автоматичне перетворення типів під час виконання JS, коли контекст цього потребує.',
                    textEN: 'Automatic type conversion at runtime when the context requires it.',
                    theoryUK: 'Це правильна відповідь — саме так визначається неявне приведення типів у JavaScript.',
                    theoryEN: 'Correct — this is exactly what implicit type coercion means in JavaScript.',
                    isCorrect: true
                },
                {
                    textUK: 'Ручне перетворення типу за допомогою функцій, таких як Number() або String().',
                    textEN: 'Manual conversion using functions like Number() or String().',
                    theoryUK: 'Це **явне** приведення типів, не неявне. Тут програміст сам ініціює перетворення.',
                    theoryEN: 'This is **explicit** type coercion, not implicit — the programmer initiates it manually.',
                    isCorrect: false
                },
                {
                    textUK: 'Процес оптимізації коду під час компіляції.',
                    textEN: 'A process of code optimization during compilation.',
                    theoryUK: 'JS не компілює код як типізовані мови. Неявна коерція відбувається під час виконання, а не компіляції.',
                    theoryEN: 'JavaScript does not compile code like statically typed languages — coercion happens at runtime, not compile time.',
                    isCorrect: false
                },
                {
                    textUK: 'Автоматичне приведення значень лише до рядків.',
                    textEN: 'Automatic conversion only to strings.',
                    theoryUK: 'Неявна коерція може бути до числа, булевого або рядка, не лише до рядка.',
                    theoryEN: 'Implicit coercion can convert to number, boolean, or string — not only strings.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Яка різниця між явним і неявним приведенням типів у JavaScript?',
            textEN: 'What is the difference between explicit and implicit type coercion in JavaScript?',
            theoryUK:
                "### Основна різниця\n- **Явне приведення (explicit)** — програміст сам викликає функцію для зміни типу: `Number('5')`, `String(10)`, `Boolean(0)`.\n- **Неявне приведення (implicit)** — рушій JS автоматично перетворює тип, коли цього вимагає контекст (оператор, умова тощо).\n\n### Приклади\n```js\nNumber('5')   // явне\n'5' * 2       // неявне\n```\n\n### Чому важливо розрізняти\n- Явне приведення **передбачуване** та контрольоване програмістом.\n- Неявне може викликати **неочікувані ефекти**, особливо при порівнянні `==`, оскільки відбувається автоматична коерція типів.\n- Для уникнення помилок часто радять використовувати `===` замість `==`.",
            theoryEN:
                "### Main difference\n- **Explicit coercion**: the programmer intentionally converts a value, e.g. `Number('5')`, `String(10)`, `Boolean(0)`.\n- **Implicit coercion**: the JS engine automatically converts a value when the context demands it (e.g., operators, logical expressions).\n\n### Examples\n```js\nNumber('5')   // explicit\n'5' * 2       // implicit\n```\n\n### Why it matters\n- Explicit coercion is **predictable** and under developer control.\n- Implicit coercion may lead to **unexpected results**, especially with the `==` operator.\n- To avoid pitfalls, developers often prefer `===` for strict comparisons.",
            answers: [
                {
                    textUK: 'Явне — це ручне приведення, неявне — автоматичне.',
                    textEN: 'Explicit is manual, implicit is automatic.',
                    theoryUK: 'Саме так — різниця полягає у тому, хто ініціює перетворення: програміст або рушій.',
                    theoryEN: 'Exactly — the difference lies in who triggers the conversion: the programmer or the engine.',
                    isCorrect: true
                },
                {
                    textUK: 'Явне — це автоматичне, неявне — ручне.',
                    textEN: 'Explicit is automatic, implicit is manual.',
                    theoryUK: 'Навпаки: явне — ручне, неявне — автоматичне.',
                    theoryEN: 'The opposite: explicit is manual, implicit is automatic.',
                    isCorrect: false
                },
                {
                    textUK: 'Явне приведення можливе лише для чисел.',
                    textEN: 'Explicit coercion is only possible for numbers.',
                    theoryUK: 'Явне приведення можна робити для будь-яких типів: чисел, рядків, булевих тощо.',
                    theoryEN: 'Explicit coercion can be done for any types, not just numbers.',
                    isCorrect: false
                },
                {
                    textUK: 'Різниці немає — це синоніми.',
                    textEN: 'There is no difference — they are synonyms.',
                    theoryUK: 'Це різні поняття — явне та неявне приведення працюють по-різному.',
                    theoryEN: 'They are different concepts — explicit and implicit coercion behave differently.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'В яких ситуаціях JavaScript виконує неявне приведення типів?',
            textEN: 'In which situations does JavaScript perform implicit type coercion?',
            theoryUK:
                "### Основні ситуації неявного приведення типів\n1. **Арифметичні операції** — `+`, `-`, `*`, `/`, `%`, коли операнди різних типів. При цьому `+` може означати або додавання чисел, або конкатенацію рядків.\n2. **Рядкове додавання** — якщо один з операндів `+` є рядком, інший також перетворюється до рядка.\n3. **Порівняння (`==`, `<`, `>`)** — коли типи різні, відбувається перетворення для коректного порівняння.\n4. **Логічні контексти** — у виразах `if`, `while`, а також у логічних операторах `||`, `&&`, `??`. Використовується операція **ToBoolean**, що визначає істинність значення.\n5. **Шаблонні рядки** — коли нестрокові значення вставляються у шаблон, вони автоматично конвертуються до рядка.\n\n### Приклади\n```js\n1 + '2'         // '12'\n'5' - 1         // 4\nif ('') {}      // '' → false\ntrue == 1       // true\n`${123}`        // '123'\n```",
            theoryEN:
                "### Main cases of implicit coercion\n1. **Arithmetic operations** — `+`, `-`, `*`, `/`, `%` with mixed operand types. Note that `+` may mean addition or string concatenation.\n2. **String concatenation** — if one operand is a string, the other is converted to string as well.\n3. **Comparisons (`==`, `<`, `>`)** — when operands have different types, coercion is performed for comparison.\n4. **Logical contexts** — `if`, `while`, `||`, `&&`, `??`. The **ToBoolean** operation determines whether a value is truthy or falsy.\n5. **Template literals** — non-string values inside template literals are automatically converted to strings.\n\n### Examples\n```js\n1 + '2'       // '12'\n'5' - 1       // 4\nif ('') {}    // '' → false\ntrue == 1     // true\n`${123}`      // '123'\n```",
            answers: [
                {
                    textUK: 'У виразах з різними типами операндів, логічних умовах, порівняннях і шаблонних рядках.',
                    textEN: 'In expressions with mixed operand types, logical conditions, comparisons, and template literals.',
                    theoryUK: 'Так — у цих контекстах рушій JS виконує автоматичне приведення типів.',
                    theoryEN: 'Correct — in these contexts the JS engine performs implicit type coercion.',
                    isCorrect: true
                },
                {
                    textUK: 'Лише при виклику функцій.',
                    textEN: 'Only when calling functions.',
                    theoryUK: 'Ні, коерція може відбуватись у будь-яких виразах, не лише у функціях.',
                    theoryEN: 'No — coercion can occur in many contexts, not just function calls.',
                    isCorrect: false
                },
                {
                    textUK: "Тільки у строгому режимі 'use strict'.",
                    textEN: "Only in 'use strict' mode.",
                    theoryUK: 'Режим strict не впливає на механізм приведення типів.',
                    theoryEN: 'Strict mode does not affect type coercion behavior.',
                    isCorrect: false
                },
                {
                    textUK: 'Лише під час компіляції коду.',
                    textEN: 'Only during code compilation.',
                    theoryUK: 'JS не компілюється традиційно — неявна коерція відбувається під час виконання.',
                    theoryEN: 'JavaScript does not compile traditionally — coercion happens at runtime.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Що поверне вираз +"123" у JavaScript?',
            textEN: 'What does the expression +"123" return in JavaScript?',
            theoryUK:
                'У JavaScript унарний плюс (`+value`) намагається **привести операнд до числа**. Якщо `value` — рядок, JS спробує його розпарсити як число. Якщо це можливо — отримаємо числове значення. Якщо ні — `NaN`. Наприклад:\n```js\n+"123" // 123\n+true // 1\n+false // 0\n+null // 0\n+undefined // NaN\n```',
            theoryEN:
                'In JavaScript, the unary plus (`+value`) attempts to **convert the operand to a number**. If `value` is a string, JS tries to parse it as a number. If successful — a numeric value is returned; otherwise, `NaN`. For example:\n```js\n+"123" // 123\n+true // 1\n+false // 0\n+null // 0\n+undefined // NaN\n```',
            answers: [
                {
                    textUK: '123 (тип number)',
                    textEN: '123 (type number)',
                    theoryUK: '✅ Правильна відповідь. Унарний плюс перетворює рядок "123" у число 123.',
                    theoryEN: '✅ Correct. Unary plus converts the string "123" into the number 123.',
                    isCorrect: true
                },
                {
                    textUK: '"123" (тип string)',
                    textEN: '"123" (type string)',
                    theoryUK: '❌ Невірно. Рядок не залишається рядком, бо унарний плюс викликає Number(value).',
                    theoryEN: '❌ Incorrect. The string does not remain a string — unary plus calls Number(value).',
                    isCorrect: false
                },
                {
                    textUK: 'NaN',
                    textEN: 'NaN',
                    theoryUK: '❌ Невірно. NaN буде лише тоді, якщо рядок не можна конвертувати, наприклад +"abc".',
                    theoryEN: '❌ Incorrect. NaN appears only when the string cannot be converted, e.g. +"abc".',
                    isCorrect: false
                },
                {
                    textUK: 'undefined',
                    textEN: 'undefined',
                    theoryUK: '❌ Невірно. Унарний плюс ніколи не повертає undefined.',
                    theoryEN: '❌ Incorrect. Unary plus never returns undefined.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: "Різниця між `'5' - 2` і `'5' + 2`: що насправді відбувається?",
            textEN: "The difference between `'5' - 2` and `'5' + 2`: what actually happens?",
            theoryUK:
                "### Ключова ідея\nОператори в JavaScript мають різні правила приведення типів.\n\n- **Оператор `+` (addition/concatenation)**:\n  1. Обидва операнди спершу проходять `ToPrimitive` з підказкою *default*.\n  2. Якщо **хоча б один результат є типу `string`**, відбувається **конкатенація рядків** (нечислова операція): другий операнд приводиться до рядка (`ToString`).\n  3. Якщо **обидва не рядки**, застосовується числове додавання: обидва приводяться через `ToNumber`.\n\n- **Інші арифметичні оператори** (`-`, `*`, `/`, `%`, `**`) **завжди** працюють у числовому режимі: обидва операнди приводяться через `ToNumber`.\n\n### Приклади\n```js\n'5' - 2   // 3        → Number('5') - Number(2)\n'5' + 2   // '52'     → '5' + String(2)\n'5' * 2   // 10       → Number('5') * 2\n'5' - true // 4       → 5 - 1\n'5' + true // '5true' → '5' + 'true'\n```\n\n> Важливо: `+` не «частково парсить» рядки типу `'5a'`; `Number('5a')` дає `NaN`. Конкатенація ж просто склеює рядки.",
            theoryEN:
                "### Key idea\nOperators in JavaScript follow different coercion rules.\n\n- **`+` operator (addition/concatenation)**:\n  1. Both operands undergo `ToPrimitive` with the *default* hint.\n  2. If **either result is a `string`**, **string concatenation** happens (non-numeric): the other operand is converted with `ToString`.\n  3. If **neither is a string**, numeric addition occurs after `ToNumber`.\n\n- **Other arithmetic operators** (`-`, `*`, `/`, `%`, `**`) **always** operate numerically: both operands go through `ToNumber`.\n\n### Examples\n```js\n'5' - 2    // 3        → Number('5') - Number(2)\n'5' + 2    // '52'     → '5' + String(2)\n'5' * 2    // 10       → Number('5') * 2\n'5' - true // 4        → 5 - 1\n'5' + true // '5true'  → '5' + 'true'\n```\n\n> Note: `+` does not “partially parse” strings like `'5a'`; `Number('5a')` is `NaN`. Concatenation just glues strings.",
            answers: [
                {
                    textUK: "Оператор '+' спершу намагається перетворити операнди на примітиви; якщо хоча б один стає рядком — виконується конкатенація; '-' завжди приводить обидва операнди до числа і віднімає.",
                    textEN: "The '+' operator first converts operands to primitives; if either becomes a string, it concatenates; '-' always coerces both to numbers and subtracts.",
                    theoryUK: "✅ Це точний опис специфікації: '+' може стати рядковою операцією, тоді як '-' завжди числова.",
                    theoryEN: "✅ This matches the spec: '+' can become a string operation, while '-' is always numeric.",
                    isCorrect: true
                },
                {
                    textUK: "І '+' і '-' завжди перетворюють обидва операнди на числа, але '+' має вищий пріоритет.",
                    textEN: "Both '+' and '-' always convert both operands to numbers, but '+' has higher precedence.",
                    theoryUK: "❌ Помилка: '+' не завжди числовий; також пріоритет тут ні до чого — проблема в типі операції, а не в порядку.",
                    theoryEN: "❌ Incorrect: '+' isn't always numeric; operator precedence is irrelevant here — it's about operation type, not order.",
                    isCorrect: false
                },
                {
                    textUK: "'5' у виразі з будь-яким числовим оператором завжди парситься як 5, тому '5' + 2 === 7.",
                    textEN: "A string '5' with any numeric operator is always parsed as 5, therefore '5' + 2 === 7.",
                    theoryUK: "❌ Ні: '+' не завжди «числовий оператор» — він може бути рядковим і тоді не виконується `ToNumber` для конкатенації.",
                    theoryEN: "❌ No: '+' isn't always numeric — it may be string concatenation, skipping `ToNumber`.",
                    isCorrect: false
                },
                {
                    textUK: 'Результат залежить від того, чи рядок повністю числовий: якщо так — завжди математика, якщо ні — конкатенація.',
                    textEN: 'It depends on whether the string is purely numeric: if yes — always math; if not — concatenation.',
                    theoryUK: "❌ Ні: для '+' головне — чи є **рядковий тип** серед операндів після `ToPrimitive`, а не «наскільки числовий» рядок.",
                    theoryEN: "❌ No: for '+', the key is whether a **string type** is present after `ToPrimitive`, not how numeric the string looks.",
                    isCorrect: false
                },
                {
                    textUK: "Оператор '-' спочатку конкатенує, а вже потім пробує віднімати, тому '5' - 2 → 3.",
                    textEN: "'-' concatenates first and then tries to subtract, hence '5' - 2 → 3.",
                    theoryUK: "❌ Ні, '-' ніколи не виконує конкатенацію; він одразу переводить обидва операнди до числа.",
                    theoryEN: "❌ No, '-' never concatenates; it directly coerces both operands to numbers.",
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Обчисліть результати (одна відповідь містить **усі** правильні пари вираз → результат):',
            textEN: 'Evaluate the results (one option contains **all** correct expression → result pairs):',
            theoryUK:
                "### Алгоритм для перевірки\n- Для `+`: після `ToPrimitive` — якщо є рядок → конкатенація; інакше → числове додавання (`ToNumber`).\n- Для `-` та `*`: обидва операнди → `ToNumber`.\n\nРозберемо:\n```js\n'5' - 2     // 3\n'5' + 2     // '52'\n'5' * 2     // 10\n'5' + true  // '5true'  (рядок + рядок)\n'5' - true  // 4        (5 - 1)\n```\nДе `ToNumber(true) === 1`.",
            theoryEN:
                "### How to verify\n- For `+`: after `ToPrimitive` — if a string is present → concatenation; otherwise → numeric addition (`ToNumber`).\n- For `-` and `*`: both operands → `ToNumber`.\n\nWork through:\n```js\n'5' - 2     // 3\n'5' + 2     // '52'\n'5' * 2     // 10\n'5' + true  // '5true'  (string + string)\n'5' - true  // 4        (5 - 1)\n```\nWhere `ToNumber(true) === 1`.",
            answers: [
                {
                    textUK: "'5' - 2 → 3; '5' + 2 → '52'; '5' * 2 → 10; '5' + true → '5true'; '5' - true → 4",
                    textEN: "'5' - 2 → 3; '5' + 2 → '52'; '5' * 2 → 10; '5' + true → '5true'; '5' - true → 4",
                    theoryUK: "✅ Усі пари відповідають правилам: '+' з рядком — конкатенація, '-' і '*' — числові операції.",
                    theoryEN: "✅ All pairs match the rules: '+' with a string → concatenation, '-' and '*' → numeric.",
                    isCorrect: true
                },
                {
                    textUK: "'5' - 2 → 3; '5' + 2 → 7; '5' * 2 → 10; '5' + true → 6; '5' - true → 4",
                    textEN: "'5' - 2 → 3; '5' + 2 → 7; '5' * 2 → 10; '5' + true → 6; '5' - true → 4",
                    theoryUK: "❌ Тут помилково вважається, що '+' завжди числовий: `'5' + 2` не 7, а `'5' + true` не 6.",
                    theoryEN: "❌ Assumes '+' is always numeric: `'5' + 2` isn't 7, and `'5' + true` isn't 6.",
                    isCorrect: false
                },
                {
                    textUK: "'5' - 2 → NaN; '5' + 2 → '52'; '5' * 2 → 10; '5' + true → '6'; '5' - true → 4",
                    textEN: "'5' - 2 → NaN; '5' + 2 → '52'; '5' * 2 → 10; '5' + true → '6'; '5' - true → 4",
                    theoryUK: "❌ Віднімання з рядком не дає NaN для числового рядка; і `'5' + true` — це рядок `'5true'`, а не `'6'`.",
                    theoryEN: "❌ Subtraction with a numeric-looking string doesn't yield NaN; `'5' + true` is `'5true'`, not `'6'`.",
                    isCorrect: false
                },
                {
                    textUK: "'5' - 2 → 3; '5' + 2 → '52'; '5' * 2 → '10'; '5' + true → '5true'; '5' - true → '4'",
                    textEN: "'5' - 2 → 3; '5' + 2 → '52'; '5' * 2 → '10'; '5' + true → '5true'; '5' - true → '4'",
                    theoryUK: '❌ Помилка у типах: результати для `-` і `*` — числа, не рядки.',
                    theoryEN: '❌ Type errors: results of `-` and `*` are numbers, not strings.',
                    isCorrect: false
                },
                {
                    textUK: "'5' - 2 → 3; '5' + 2 → '52'; '5' * 2 → 10; '5' + true → '51'; '5' - true → 4",
                    textEN: "'5' - 2 → 3; '5' + 2 → '52'; '5' * 2 → 10; '5' + true → '51'; '5' - true → 4",
                    theoryUK: "❌ `'5' + true` не `'51'`, бо `true` → `'true'` при конкатенації, а не `'1'`.",
                    theoryEN: "❌ `'5' + true` isn't `'51'` because `true` becomes `'true'` on concatenation, not `'1'`.",
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Як працює неявне приведення до рядка при конкатенації оператором "+" з рядком?',
            textEN: 'How does implicit string coercion work when using the "+" operator with a string?',
            theoryUK:
                "### Конкатенація з рядком і неявне приведення\nОператор `+` у JS має **дві** семантики: числове додавання та рядкову конкатенацію. Алгоритм спрощено:\n1. Обчислити лівий і правий операнди та застосувати **ToPrimitive** (з *hint* `default`).\n2. Якщо **будь-який** з примітивів є типу `string`, JS виконує **рядкову конкатенацію**: обидва операнди проходять через **ToString** і зшиваються.\n3. Якщо жоден не є `string`, виконується числова гілка (через **ToNumber**).\n\n> Важливо: навіть якщо один операнд — рядок літерально (наприклад, `'x'`), інший все одно приводиться до примітиву, а потім до рядка.\n\n#### Крайні випадки\n- `null` → `'null'`, `undefined` → `'undefined'` при ToString.\n- `Symbol` **не можна** неявно перетворити на рядок при `+` з рядком — буде `TypeError`. Використовуйте `String(sym)` або `sym.description`.\n- Порядок: спочатку ToPrimitive лівого, потім правого; рішення про конкатенацію приймається після цього.\n\n#### Приклади\n```js\n'hi ' + 3            // 'hi 3'\n'v=' + true         // 'v=true'\n'obj=' + {}         // 'obj=[object Object]'\n'list:' + [1,2]     // 'list:1,2'\n'now:' + new Date() // 'now:' + date.toString()\nSymbol('x') + ''    // TypeError\n```\n",
            theoryEN:
                "### Concatenation with a string and implicit coercion\nThe `+` operator in JS has **two** meanings: numeric addition and string concatenation. In short:\n1. Evaluate both operands and apply **ToPrimitive** (hint `default`).\n2. If **either** primitive is a `string`, JS performs **string concatenation**: both are passed through **ToString** and joined.\n3. If neither is a `string`, the numeric branch runs (via **ToNumber**).\n\n> Note: even if one operand is a string literal, the other still goes through ToPrimitive and then ToString.\n\n#### Edge cases\n- `null` → `'null'`, `undefined` → `'undefined'` for ToString.\n- `Symbol` **cannot** be implicitly converted to string in `+` with a string — it throws `TypeError`. Use `String(sym)` or `sym.description`.\n- Order: ToPrimitive left, then right; the concatenation decision is made afterwards.\n\n#### Examples\n```js\n'hi ' + 3            // 'hi 3'\n'v=' + true         // 'v=true'\n'obj=' + {}         // 'obj=[object Object]'\n'list:' + [1,2]     // 'list:1,2'\n'now:' + new Date() // 'now:' + date.toString()\nSymbol('x') + ''    // TypeError\n```\n",
            answers: [
                {
                    textUK: 'Якщо хоча б один операнд — рядок, застосовується конкатенація; інший операнд приводиться до рядка через ToString.',
                    textEN: 'If at least one operand is a string, concatenation is used; the other operand is converted to string via ToString.',
                    theoryUK: 'Це вірно: після ToPrimitive, якщо будь-який з операндів має тип `string`, обидва проходять ToString і зшиваються.',
                    theoryEN: 'Correct: after ToPrimitive, if either operand is of type `string`, both go through ToString and are concatenated.',
                    isCorrect: true
                },
                {
                    textUK: 'Оператор "+" завжди конкатенує, якщо лівий операнд — рядок; правий не приводиться.',
                    textEN: 'The "+" operator always concatenates if the left operand is a string; the right one is not coerced.',
                    theoryUK: 'Невірно: правий операнд **завжди** приводиться до примітиву і далі до рядка при конкатенації.',
                    theoryEN: 'Incorrect: the right operand is **always** coerced to a primitive and then to string during concatenation.',
                    isCorrect: false
                },
                {
                    textUK: "При конкатенації з рядком `null` → 'null', `undefined` → 'undefined'.",
                    textEN: "When concatenating with a string, `null` → 'null', `undefined` → 'undefined'.",
                    theoryUK: "Вірно: ToString(null) дає 'null', ToString(undefined) дає 'undefined'.",
                    theoryEN: "Correct: ToString(null) yields 'null', ToString(undefined) yields 'undefined'.",
                    isCorrect: true
                },
                {
                    textUK: "Конкатенація зі `Symbol` працює як з будь-яким іншим типом і дає, наприклад, 'Symbol(x)'.",
                    textEN: "Concatenation with a `Symbol` works like any other type and yields e.g. 'Symbol(x)'.",
                    theoryUK: 'Невірно: `Symbol` не можна **неявно** перетворити на рядок у `+`; буде `TypeError`. Потрібно явно `String(sym)`.',
                    theoryEN: 'Incorrect: `Symbol` cannot be **implicitly** converted to string with `+`; it throws `TypeError`. You must use `String(sym)`.',
                    isCorrect: false
                },
                {
                    textUK: 'Навіть якщо один операнд — рядок, інший спочатку проходить ToPrimitive (hint default), а вже потім ToString.',
                    textEN: 'Even if one operand is a string, the other first goes through ToPrimitive (hint default), then ToString.',
                    theoryUK: 'Вірно: алгоритм `+` спочатку викликає ToPrimitive для обох операндів, а рішення про конкатенацію приймає після цього.',
                    theoryEN: 'Correct: the `+` algorithm first applies ToPrimitive to both operands, then decides on concatenation.',
                    isCorrect: true
                },
                {
                    textUK: 'Порядок перетворень: спочатку ToString обох, а вже потім ToPrimitive.',
                    textEN: 'Order of conversions: first ToString on both, then ToPrimitive.',
                    theoryUK: 'Невірно: навпаки — спочатку ToPrimitive, і лише якщо обрано рядкову гілку, застосовується ToString.',
                    theoryEN: "Incorrect: it's the other way around — ToPrimitive first, then ToString if the string branch is chosen.",
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Як об’єкти (наприклад `{}`, `[]`, `Date`) перетворюються на рядки при неявному приведенні?',
            textEN: 'How are objects (e.g., `{}`, `[]`, `Date`) converted to strings during implicit coercion?',
            theoryUK:
                "### Перетворення об’єктів у рядок (ToString через ToPrimitive)\n1. Спочатку викликається **ToPrimitive(input, hint)**. Для `+` (та більшості контекстів) hint = `default`.\n2. Для **звичайних об’єктів** (Object, Array, Function) при hint `string` або `default` порядок — спершу `toString()`, потім `valueOf()`. Те, що повертає **примітив**, і буде використано.\n3. Якщо після ToPrimitive отримали не `string`, але конкатенація з рядком вимагає рядка, застосовується **ToString** до примітиву.\n\n#### Типові об’єкти\n- **Plain Object (`{}`):** `{}.toString()` за замовчуванням → `\"[object Object]\"`.\n- **Array (`[]`):** `[].toString()` виконує `join(',')` над елементами з ToString для кожного → `''` для порожнього масиву, `'1,2'` для `[1,2]`, пропуски дають порожні сегменти (`[1,,3]` → `'1,,3'`).\n- **Date:** має *string-preferred* поведінку навіть для hint `default`: `new Date().toString()` → людський формат (не числовий timestamp).\n- **Function:** `fn.toString()` → текст подання функції.\n- **Symbol:** сам по собі об’єкт-примітив; `ToString(Symbol())` кидає `TypeError`, окрім явного `String(sym)` або `sym.toString()`.\n- **Власний `Symbol.toPrimitive`:** якщо об’єкт має метод `[Symbol.toPrimitive](hint)`, він має **пріоритет** над `toString`/`valueOf`.\n\n#### Приклади\n```js\nString({})            // \"[object Object]\"\nString([])            // ''\nString([1,2,3])       // '1,2,3'\nString(new Date(0))   // 'Thu Jan 01 1970 ...' (локалізовано)\n({ toString(){return 'X';} }) + ''   // 'X'\n({ valueOf(){return 7;} }) + ''      // '7' (через ToPrimitive → 7, потім ToString)\n({ [Symbol.toPrimitive](){return 'Z';} }) + '' // 'Z'\n```\n",
            theoryEN:
                "### Converting objects to string (ToString via ToPrimitive)\n1. First, **ToPrimitive(input, hint)** runs. For `+` (and most contexts) the hint is `default`.\n2. For **ordinary objects** (Object, Array, Function) with hint `string` or `default`, the order is `toString()` first, then `valueOf()`. Whichever returns a **primitive** is used.\n3. If the primitive is not a string but concatenation with a string is happening, **ToString** is applied to that primitive.\n\n#### Typical objects\n- **Plain Object (`{}`):** default `{}.toString()` → `\"[object Object]\"`.\n- **Array (`[]`):** `[].toString()` performs `join(',')` over elements using ToString for each → `''` for empty, `'1,2'` for `[1,2]`, holes produce empty segments (`[1,,3]` → `'1,,3'`).\n- **Date:** has *string-preferred* behavior even with hint `default`: `new Date().toString()` → human-readable format (not a numeric timestamp).\n- **Function:** `fn.toString()` → source-like string.\n- **Symbol:** a primitive; `ToString(Symbol())` throws `TypeError` unless you explicitly call `String(sym)` or `sym.toString()`.\n- **Custom `Symbol.toPrimitive`:** if present, `[Symbol.toPrimitive](hint)` takes **precedence** over `toString`/`valueOf`.\n\n#### Examples\n```js\nString({})            // \"[object Object]\"\nString([])            // ''\nString([1,2,3])       // '1,2,3'\nString(new Date(0))   // 'Thu Jan 01 1970 ...' (localized)\n({ toString(){return 'X';} }) + ''   // 'X'\n({ valueOf(){return 7;} }) + ''      // '7' (via ToPrimitive → 7, then ToString)\n({ [Symbol.toPrimitive](){return 'Z';} }) + '' // 'Z'\n```\n",
            answers: [
                {
                    textUK: '`{}` за замовчуванням дає рядок "[object Object]".',
                    textEN: '`{}` by default yields the string "[object Object]".',
                    theoryUK: 'Вірно: `Object.prototype.toString` повертає такий тег для звичайного об’єкта.',
                    theoryEN: 'Correct: `Object.prototype.toString` returns that tag for a plain object.',
                    isCorrect: true
                },
                {
                    textUK: "`[]` перетворюється на порожній рядок, а `[1,2]` → '1,2' завдяки `Array.prototype.toString` (це `join(',')`).",
                    textEN: "`[]` becomes an empty string, and `[1,2]` → '1,2' via `Array.prototype.toString` (i.e., `join(',')`).",
                    theoryUK: "Вірно: масиви використовують `join(',')`; пропуски створюють порожні сегменти.",
                    theoryEN: "Correct: arrays use `join(',')`; holes produce empty segments.",
                    isCorrect: true
                },
                {
                    textUK: '`new Date()` при неявному приведенні до рядка повертає локалізований людський формат через `toString()`.',
                    textEN: '`new Date()` when implicitly converted to string returns a localized human-readable format via `toString().`',
                    theoryUK: 'Вірно: об’єкти `Date` мають перевагу рядкового подання навіть для hint `default`.',
                    theoryEN: 'Correct: `Date` objects are string-preferred even under the `default` hint.',
                    isCorrect: true
                },
                {
                    textUK: 'Якщо об’єкт має `valueOf()` що повертає число, при конкатенації з рядком результатом буде **числове додавання**, а не рядок.',
                    textEN: 'If an object has `valueOf()` returning a number, concatenating with a string performs **numeric addition**, not a string result.',
                    theoryUK: 'Невірно: наявність рядка в операції змусить гілку **конкатенації**; число спершу отримаємо з ToPrimitive, але потім ToString і зшивання.',
                    theoryEN:
                        'Incorrect: the presence of a string forces the **concatenation** branch; the number is obtained via ToPrimitive, then ToString and joined.',
                    isCorrect: false
                },
                {
                    textUK: '`Symbol.toPrimitive` (якщо оголошений) має пріоритет і може відразу повернути рядок для конкатенації.',
                    textEN: '`Symbol.toPrimitive` (if defined) takes precedence and can directly return a string for concatenation.',
                    theoryUK: 'Вірно: специфікація спочатку перевіряє `[Symbol.toPrimitive]`, і лише потім `toString`/`valueOf`.',
                    theoryEN: 'Correct: the spec checks `[Symbol.toPrimitive]` first, then falls back to `toString`/`valueOf`.',
                    isCorrect: true
                },
                {
                    textUK: "`Symbol` без явного `String(sym)` або `sym.toString()` завжди тихо перетворюється на 'Symbol(...)' при конкатенації.",
                    textEN: "A `Symbol` without explicit `String(sym)` or `sym.toString()` silently becomes 'Symbol(...)' during concatenation.",
                    theoryUK: 'Невірно: таке перетворення кидає `TypeError`; символи не мають неявного ToString у `+`.',
                    theoryEN: 'Incorrect: that conversion throws `TypeError`; symbols lack implicit ToString with `+`.',
                    isCorrect: false
                },
                {
                    textUK: 'Для звичайних об’єктів при hint `string` порядок спроб — спочатку `toString`, потім `valueOf`.',
                    textEN: 'For ordinary objects with hint `string`, the order is `toString` first, then `valueOf`.',
                    theoryUK: 'Вірно: це стандартний порядок для string-preferred перетворення.',
                    theoryEN: "Correct: that's the standard order for string-preferred conversion.",
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: "Які значення вважаються 'falsy' у JavaScript?",
            textEN: "Which values are considered 'falsy' in JavaScript?",
            theoryUK:
                '### Приведення до логічного типу (Boolean) у JavaScript\nУ JavaScript будь-яке значення може бути приведене до логічного типу — `true` або `false`. Це відбувається неявно (наприклад, в умовах `if`, `while`) або явно — за допомогою конструкції `Boolean(value)` чи подвійного заперечення `!!value`.\n\n**Falsy значення** — це значення, які при приведенні до логічного типу дають `false`.\n\nДо `falsy` значень належать:\n- `false`\n- `0` і `-0`\n- `""` (порожній рядок)\n- `null`\n- `undefined`\n- `NaN`\n\nУсі інші значення є **truthy**, тобто перетворюються у `true`.',
            theoryEN:
                '### Type coercion to Boolean in JavaScript\nIn JavaScript, any value can be coerced into a Boolean — either `true` or `false`. This happens implicitly (e.g., inside `if`, `while` conditions) or explicitly using `Boolean(value)` or double negation `!!value`.\n\n**Falsy values** are those that become `false` when converted to Boolean.\n\nThe following values are considered falsy:\n- `false`\n- `0` and `-0`\n- `""` (empty string)\n- `null`\n- `undefined`\n- `NaN`\n\nAll other values are **truthy**, meaning they convert to `true`.',
            answers: [
                {
                    textUK: "false, 0, '', null, undefined, NaN",
                    textEN: "false, 0, '', null, undefined, NaN",
                    theoryUK: '✅ Це правильна відповідь. Саме ці значення вважаються *falsy* у JavaScript, бо при приведенні до логічного типу вони стають `false`.',
                    theoryEN: '✅ Correct. These are the values considered *falsy* in JavaScript because they evaluate to `false` when coerced to Boolean.',
                    isCorrect: true
                },
                {
                    textUK: "false, 0, '', null, undefined, NaN, []",
                    textEN: "false, 0, '', null, undefined, NaN, []",
                    theoryUK: "❌ Масив `[]` є truthy значенням, навіть якщо він порожній. Наприклад, `if ([]) console.log('yes')` виконається.",
                    theoryEN: "❌ The array `[]` is truthy, even when empty. For example, `if ([]) console.log('yes')` executes.",
                    isCorrect: false
                },
                {
                    textUK: "false, 0, '', null, undefined, NaN, {}",
                    textEN: "false, 0, '', null, undefined, NaN, {}",
                    theoryUK: '❌ Об’єкт `{}` завжди truthy, навіть якщо він порожній. Умова `if ({})` завжди повертає `true`.',
                    theoryEN: '❌ Objects `{}` are always truthy, even when empty. The condition `if ({})` always returns `true`.',
                    isCorrect: false
                },
                {
                    textUK: "false, 0, '', null, undefined",
                    textEN: "false, 0, '', null, undefined",
                    theoryUK: '❌ Тут пропущено `NaN`. `NaN` також є falsy значенням.',
                    theoryEN: '❌ `NaN` is missing here. It is also a falsy value.',
                    isCorrect: false
                },
                {
                    textUK: "false, 0, '', null, undefined, NaN, Symbol()",
                    textEN: "false, 0, '', null, undefined, NaN, Symbol()",
                    theoryUK: '❌ `Symbol()` є truthy значенням, воно не може бути перетворене на `false`.',
                    theoryEN: '❌ `Symbol()` is truthy and does not evaluate to `false`.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Які результати повертає подвійне заперечення (!!value) для різних типів даних?',
            textEN: 'What results does the double negation (!!value) return for different data types?',
            theoryUK:
                '### Подвійне заперечення `!!value`\n`!!` — це короткий спосіб явно привести будь-яке значення до логічного типу в JavaScript.\n\n- Перше `!` перетворює значення на булеве і заперечує його (тобто `true → false`, `false → true`).\n- Друге `!` заперечує результат ще раз, отримуючи справжнє булеве значення без зміни логічного змісту.\n\n**Приклади:**\n```js\n!!0         // false\n!!""        // false\n!!null      // false\n!!undefined // false\n!!NaN       // false\n!!false     // false\n!!1         // true\n!!"hello"   // true\n!![]        // true\n!!{}        // true\n```\n\nТаким чином, `!!value` — це еквівалент `Boolean(value)`, але часто використовується в коді для короткості.',
            theoryEN:
                '### Double negation `!!value`\n`!!` is a shorthand way to explicitly convert any value to a Boolean in JavaScript.\n\n- The first `!` converts the value to a Boolean and inverts it (`true → false`, `false → true`).\n- The second `!` inverts the result again, producing the actual Boolean equivalent of the value.\n\n**Examples:**\n```js\n!!0         // false\n!!""        // false\n!!null      // false\n!!undefined // false\n!!NaN       // false\n!!false     // false\n!!1         // true\n!!"hello"   // true\n!![]        // true\n!!{}        // true\n```\n\nThus, `!!value` is equivalent to `Boolean(value)`, but often used for brevity in code.',
            answers: [
                {
                    textUK: "!!0 → false, !!'' → false, !![] → true, !!{} → true, !!null → false",
                    textEN: "!!0 → false, !!'' → false, !![] → true, !!{} → true, !!null → false",
                    theoryUK: '✅ Це правильна відповідь. `!!` повертає логічний еквівалент значення, а порожні об’єкти та масиви завжди truthy.',
                    theoryEN: '✅ Correct. `!!` returns the Boolean equivalent of a value, and empty objects/arrays are always truthy.',
                    isCorrect: true
                },
                {
                    textUK: "!!0 → false, !!'' → false, !![] → false, !!{} → false, !!null → false",
                    textEN: "!!0 → false, !!'' → false, !![] → false, !!{} → false, !!null → false",
                    theoryUK: '❌ Неправильно. Порожні масиви `[]` та об’єкти `{}` — truthy, тому `!![]` і `!!{}` повертають `true`.',
                    theoryEN: '❌ Incorrect. Empty arrays `[]` and objects `{}` are truthy, so `!![]` and `!!{}` return `true`.',
                    isCorrect: false
                },
                {
                    textUK: "!!0 → true, !!'' → false, !![] → true, !!{} → true, !!null → false",
                    textEN: "!!0 → true, !!'' → false, !![] → true, !!{} → true, !!null → false",
                    theoryUK: '❌ `0` є falsy, тому `!!0` завжди дорівнює `false`.',
                    theoryEN: '❌ `0` is falsy, so `!!0` always equals `false`.',
                    isCorrect: false
                },
                {
                    textUK: "!!undefined → false, !!NaN → false, !!'text' → true, !![] → true",
                    textEN: "!!undefined → false, !!NaN → false, !!'text' → true, !![] → true",
                    theoryUK: '✅ Усі значення відображають правильну логіку приведення до логічного типу.',
                    theoryEN: '✅ All values correctly reflect Boolean coercion rules.',
                    isCorrect: true
                },
                {
                    textUK: '!!false → false, !!true → true, !!0 → false, !!1 → true',
                    textEN: '!!false → false, !!true → true, !!0 → false, !!1 → true',
                    theoryUK: '✅ Ці приклади демонструють базову поведінку `!!` для чисел і булевих значень.',
                    theoryEN: '✅ These examples correctly show the `!!` behavior for numbers and booleans.',
                    isCorrect: true
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Що відбувається при порівнянні null і undefined з іншими типами у JavaScript?',
            textEN: 'What happens when comparing null and undefined with other types in JavaScript?',
            theoryUK:
                '### Порівняння `null` та `undefined` у JavaScript\n\nПоведінка `null` і `undefined` при порівнянні відрізняється залежно від того, чи використовується оператор **строгого (`===`)** чи **нестрогого (`==`)** порівняння.\n\n#### 🔹 Оператор `==` (нестроге порівняння)\n- `null == undefined` → `true`\n- `null` і `undefined` **не рівні жодному іншому типу**.\n  ```js\n  null == 0        // false\n  undefined == 0   // false\n  null == false    // false\n  undefined == false // false\n  ```\n\n#### 🔹 Оператор `===` (строге порівняння)\n- `null === undefined` → `false` (різні типи)\n- `null === null` → `true`\n- `undefined === undefined` → `true`\n\n#### 💡 Висновок\n`null` та `undefined` у нестрогому порівнянні рівні **тільки між собою**, а в строгому — **ніколи**, бо мають різні типи.',
            theoryEN:
                '### Comparing `null` and `undefined` in JavaScript\n\nThe behavior of `null` and `undefined` differs depending on whether **strict (`===`)** or **loose (`==`)** comparison is used.\n\n#### 🔹 `==` (loose comparison)\n- `null == undefined` → `true`\n- Both are **not equal to any other value**:\n  ```js\n  null == 0        // false\n  undefined == 0   // false\n  null == false    // false\n  undefined == false // false\n  ```\n\n#### 🔹 `===` (strict comparison)\n- `null === undefined` → `false`\n- `null === null` → `true`\n- `undefined === undefined` → `true`\n\n#### 💡 Conclusion\n`null` and `undefined` are equal only to each other in loose comparison, and never in strict comparison since they have different types.',
            answers: [
                {
                    textUK: '`null == undefined` → true; з будь-якими іншими типами — false',
                    textEN: '`null == undefined` → true; false for all other types',
                    theoryUK: '✅ Це правильна відповідь. `null` і `undefined` рівні лише між собою у нестрогому порівнянні.',
                    theoryEN: '✅ Correct. `null` and `undefined` are only equal to each other in loose comparison.',
                    isCorrect: true
                },
                {
                    textUK: "`null == 0` → true, бо обидва 'порожні' значення",
                    textEN: "`null == 0` → true because both are 'empty' values",
                    theoryUK: '❌ Ні, `null == 0` → `false`. JavaScript не вважає `null` числовим значенням.',
                    theoryEN: '❌ No, `null == 0` is `false`. JavaScript does not coerce `null` to a number in this comparison.',
                    isCorrect: false
                },
                {
                    textUK: '`undefined == 0` → true',
                    textEN: '`undefined == 0` → true',
                    theoryUK: '❌ Неправильно. `undefined` не рівне жодному числу — `undefined == 0` → `false`.',
                    theoryEN: '❌ Incorrect. `undefined` equals no number — `undefined == 0` → `false`.',
                    isCorrect: false
                },
                {
                    textUK: '`null === undefined` → true',
                    textEN: '`null === undefined` → true',
                    theoryUK: '❌ У строгому порівнянні типи не співпадають, тому результат `false`.',
                    theoryEN: '❌ In strict comparison types differ, so the result is `false`.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Як працює неявне приведення типів у виразах з об’єктами: [] + [], [] + {}, {} + [], {} + {}?',
            textEN: 'How does implicit type coercion work in expressions with objects: [] + [], [] + {}, {} + [], {} + {}?',
            theoryUK:
                "### Неявне приведення об’єктів у JavaScript\nКоли об’єкти беруть участь в операціях, JavaScript намагається привести їх до примітивів через **`toPrimitive`**, **`valueOf`** або **`toString`**.\n\n#### 🔹 Приклад 1: `[] + []`\n- Кожен масив перетворюється на порожній рядок через `[].toString()` → `''`\n- `'' + ''` → `''`\n\n#### 🔹 Приклад 2: `[] + {}`\n- `[]` → `''`\n- `{}` → `'[object Object]'`\n- Результат: `'' + '[object Object]'` → `'[object Object]'`\n\n#### 🔹 Приклад 3: `{} + []`\n- Якщо код інтерпретується як блок `{}` і вираз `+[]`, то результат — `0` (унарний плюс перетворює масив на число → `0`).\n- Якщо ж написано `( {} + [] )`, тоді результат `'[object Object]'`.\n\n#### 🔹 Приклад 4: `{} + {}`\n- Аналогічно: якщо інтерпретується як блок, результат `NaN`, інакше `'[object Object][object Object]'`.\n\n> 💡 Поведінка залежить від контексту: **на початку рядка `{} + []` може бути сприйнято як блок коду, не як об’єкт.**",
            theoryEN:
                "### Implicit coercion of objects in JavaScript\nWhen objects participate in operations, JavaScript tries to convert them to primitives using **`toPrimitive`**, **`valueOf`**, or **`toString`**.\n\n#### 🔹 Example 1: `[] + []`\n- Each array is converted to an empty string via `[].toString()` → `''`\n- `'' + ''` → `''`\n\n#### 🔹 Example 2: `[] + {}`\n- `[]` → `''`\n- `{}` → `'[object Object]'`\n- Result: `'[object Object]'`\n\n#### 🔹 Example 3: `{} + []`\n- If interpreted as a block `{}` and expression `+[]`, result is `0`.\n- If wrapped like `( {} + [] )`, result is `'[object Object]'`.\n\n#### 🔹 Example 4: `{} + {}`\n- As block → `NaN`, otherwise `'[object Object][object Object]'`.\n\n> 💡 Behavior depends on parsing context: **at the beginning of a line, `{}` can be interpreted as a block, not an object.**",
            answers: [
                {
                    textUK: "`[] + []` → '', `[] + {}` → '[object Object]', `{} + []` → 0, `{} + {}` → NaN",
                    textEN: "`[] + []` → '', `[] + {}` → '[object Object]', `{} + []` → 0, `{} + {}` → NaN",
                    theoryUK: '✅ Це правильна відповідь у випадку, коли код виконується без дужок — `{} + []` інтерпретується як блок.',
                    theoryEN: '✅ Correct when code is evaluated without parentheses — `{} + []` is parsed as a block.',
                    isCorrect: true
                },
                {
                    textUK: "`[] + []` → '', `[] + {}` → '[object Object]', `{} + []` → '[object Object]', `{} + {}` → '[object Object][object Object]'",
                    textEN: "`[] + []` → '', `[] + {}` → '[object Object]', `{} + []` → '[object Object]', `{} + {}` → '[object Object][object Object]'",
                    theoryUK: '✅ Також правильна, якщо код оточено дужками `( {} + [] )` — тоді обидва операнди трактуються як об’єкти.',
                    theoryEN: '✅ Also correct if code is wrapped in parentheses `( {} + [] )` — both operands treated as objects.',
                    isCorrect: true
                },
                {
                    textUK: '`[] + []` → 0, `[] + {}` → NaN, `{} + []` → NaN',
                    textEN: '`[] + []` → 0, `[] + {}` → NaN, `{} + []` → NaN',
                    theoryUK: '❌ Неправильно. Оператор `+` між об’єктами не перетворює їх на числа, а спершу приводить до рядків.',
                    theoryEN: '❌ Incorrect. The `+` operator between objects coerces to strings first, not numbers.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Як неявне приведення використовується у логічних операторах (&&, ||, ??)?',
            textEN: 'How is implicit coercion used in logical operators (&&, ||, ??)?',
            theoryUK:
                "### Неявне приведення у логічних операторах\n\nЛогічні оператори у JavaScript **не завжди повертають булеві значення** — вони повертають **один з операндів**, використовуючи правила truthy/falsy.\n\n#### 🔹 `||` (логічне АБО)\n- Повертає **перший truthy** операнд або останній, якщо всі falsy.\n  ```js\n  'a' || 'b'   // 'a'\n  0 || 'hello' // 'hello'\n  false || 42   // 42\n  ```\n\n#### 🔹 `&&` (логічне І)\n- Повертає **перший falsy** операнд або останній, якщо всі truthy.\n  ```js\n  1 && 2       // 2\n  0 && 'a'     // 0\n  true && null // null\n  ```\n\n#### 🔹 `??` (nullish coalescing)\n- Повертає **перший не `null` і не `undefined`** операнд.\n  ```js\n  null ?? 'default'       // 'default'\n  undefined ?? 'fallback' // 'fallback'\n  0 ?? 42                 // 0 (бо 0 не null/undefined)\n  ```\n\n💡 На відміну від `||`, оператор `??` не спрацьовує на `0`, `''` або `false`, бо вони не вважаються відсутніми значеннями.",
            theoryEN:
                "### Implicit coercion in logical operators\n\nLogical operators in JavaScript **do not always return booleans** — they return **one of the operands**, following truthy/falsy rules.\n\n#### 🔹 `||` (logical OR)\n- Returns the **first truthy** operand or the last one if all are falsy.\n  ```js\n  'a' || 'b'   // 'a'\n  0 || 'hello' // 'hello'\n  false || 42   // 42\n  ```\n\n#### 🔹 `&&` (logical AND)\n- Returns the **first falsy** operand or the last one if all are truthy.\n  ```js\n  1 && 2       // 2\n  0 && 'a'     // 0\n  true && null // null\n  ```\n\n#### 🔹 `??` (nullish coalescing)\n- Returns the **first operand that is not `null` or `undefined`**.\n  ```js\n  null ?? 'default'       // 'default'\n  undefined ?? 'fallback' // 'fallback'\n  0 ?? 42                 // 0 (since 0 is not null/undefined)\n  ```\n\n💡 Unlike `||`, the `??` operator does not trigger on `0`, `''`, or `false` because they are valid defined values.",
            answers: [
                {
                    textUK: '`||` повертає перший truthy, `&&` — перший falsy, `??` — перший не null/undefined',
                    textEN: '`||` returns first truthy, `&&` returns first falsy, `??` returns first non-null/undefined',
                    theoryUK: '✅ Це правильна відповідь. Оператори повертають операнди, а не булеві значення.',
                    theoryEN: '✅ Correct. These operators return operands, not boolean values.',
                    isCorrect: true
                },
                {
                    textUK: '`||`, `&&`, `??` завжди повертають true або false',
                    textEN: '`||`, `&&`, `??` always return true or false',
                    theoryUK: "❌ Ні, вони повертають **операнди**, не булеві значення. Наприклад, `'a' || 'b'` → `'a'`.",
                    theoryEN: "❌ No, they return **operands**, not booleans. For example, `'a' || 'b'` → `'a'`.",
                    isCorrect: false
                },
                {
                    textUK: '`??` працює так само, як `||`',
                    textEN: '`??` works the same as `||`',
                    theoryUK: '❌ Вони відрізняються: `??` ігнорує лише `null` і `undefined`, а `||` — будь-яке falsy значення.',
                    theoryEN: '❌ They differ: `??` ignores only `null` and `undefined`, while `||` ignores all falsy values.',
                    isCorrect: false
                },
                {
                    textUK: '`&&` повертає true лише якщо всі операнди truthy',
                    textEN: '`&&` returns true only if all operands are truthy',
                    theoryUK: '❌ Хоча це здається правильним, `&&` фактично повертає **останній truthy операнд**, а не просто `true`.',
                    theoryEN: '❌ While it may seem correct, `&&` actually returns the **last truthy operand**, not `true`.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Чому [] == ![] → true, але [] == [] → false?',
            textEN: 'Why does [] == ![] evaluate to true, but [] == [] to false?',
            theoryUK:
                '### Неявне приведення типів у порівняннях з `==`\n\nУ JavaScript оператор `==` (нестроге порівняння) **виконує неявне приведення типів**, якщо операнди мають різні типи.\n\n#### Кроки виконання `[] == ![]`\n1. Вираз `![]` — це логічне заперечення масиву. Будь-який об\'єкт (включно з масивом) є **truthy**, тому `![]` → `false`.\n2. Тепер маємо: `[] == false`.\n3. Оператор `==` бачить, що зліва — об’єкт, а справа — булеве значення, тому **булеве приводиться до числа**: `false` → `0`.\n4. Потім `[]` приводиться до примітиву. Для масиву `[]`:\n   - `valueOf()` повертає сам масив (об\'єкт).\n   - `toString()` повертає `""` (порожній рядок).\n5. Порожній рядок `""` при приведенні до числа → `0`.\n6. Отже, `0 == 0` → `true`.\n\n#### Кроки виконання `[] == []`\n1. У цьому випадку **обидва операнди — об’єкти**.\n2. Порівняння `==` (і `===`) для об’єктів **порівнює посилання**, а не вміст.\n3. Кожен літерал `[]` створює **новий об’єкт**, тому посилання різні.\n4. Отже, `[] == []` → `false`.\n\n#### Висновок\n- `[] == ![]` → `true`, тому що після приведення обидві сторони стають `0`.\n- `[] == []` → `false`, тому що порівнюються різні об’єкти.',
            theoryEN:
                '### Implicit type coercion in `==` comparisons\n\nIn JavaScript, the `==` operator performs **type coercion** if the operands have different types.\n\n#### Steps for `[] == ![]`\n1. `![]` negates an array. Any object is **truthy**, so `![]` → `false`.\n2. Now the expression is `[] == false`.\n3. When comparing object vs boolean, JS converts boolean to number: `false` → `0`.\n4. Then `[]` is converted to a primitive value. For an empty array:\n   - `valueOf()` returns the array itself (object),\n   - `toString()` returns an empty string `""`.\n5. Empty string converts to number `0`.\n6. Therefore, `0 == 0` → `true`.\n\n#### Steps for `[] == []`\n1. Both operands are objects.\n2. `==` and `===` compare **references**, not contents.\n3. Each literal `[]` creates a **new object**, so the references differ.\n4. Hence `[] == []` → `false`.\n\n#### Summary\n- `[] == ![]` → `true` because both sides become `0` after coercion.\n- `[] == []` → `false` because the objects are distinct.',
            answers: [
                {
                    textUK: 'Тому що у першому випадку відбувається неявне приведення типів до числа, а у другому порівнюються різні об’єкти.',
                    textEN: 'Because in the first case implicit type coercion converts both sides to numbers, and in the second, different objects are compared.',
                    theoryUK:
                        "✅ Вірно. `![]` → `false` → `0`, `[]` → `''` → `0`, тому `0 == 0`. У випадку `[] == []` створюються два різні об'єкти, що мають різні посилання.",
                    theoryEN: "✅ Correct. `![]` → `false` → `0`, `[]` → `''` → `0`, so `0 == 0`. In `[] == []`, two distinct objects are compared by reference.",
                    isCorrect: true
                },
                {
                    textUK: 'Тому що оператор == завжди порівнює лише значення, а не посилання.',
                    textEN: 'Because the == operator always compares only values, not references.',
                    theoryUK: '❌ Невірно. Для об’єктів оператор `==` порівнює посилання, а не значення.',
                    theoryEN: '❌ Incorrect. For objects, `==` compares references, not values.',
                    isCorrect: false
                },
                {
                    textUK: 'Тому що у першому випадку масив автоматично перетворюється в рядок, а у другому — у число.',
                    textEN: 'Because in the first case the array converts to a string, and in the second to a number.',
                    theoryUK:
                        '❌ Невірно. У випадку `[] == ![]` масив приводиться до рядка `""`, який потім до числа `0`. У `[] == []` немає приведення типів — просто різні об’єкти.',
                    theoryEN: '❌ Wrong. In `[] == ![]`, the array becomes `""` and then `0`. In `[] == []`, no coercion occurs — they’re distinct objects.',
                    isCorrect: false
                },
                {
                    textUK: 'Тому що `![]` повертає `true`, а `[] == true` → `true`.',
                    textEN: 'Because `![]` returns `true`, and `[] == true` is true.',
                    theoryUK: '❌ Невірно. `![]` повертає `false`, оскільки будь-який об’єкт є truthy. Отже, `![]` → `false`, не `true`.',
                    theoryEN: '❌ Incorrect. `![]` → `false`, because any object is truthy. So `![]` is not `true`.',
                    isCorrect: false
                },
                {
                    textUK: 'Тому що порівняння масивів завжди повертає false у JavaScript.',
                    textEN: 'Because comparing arrays always returns false in JavaScript.',
                    theoryUK: '❌ Не зовсім. Це не завжди так — наприклад, якщо порівнювати одне й те саме посилання: `const a = []; a == a` → `true`.',
                    theoryEN: '❌ Not exactly. If you compare the same reference, like `const a = []; a == a`, it returns `true`.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        }
    ]
};
