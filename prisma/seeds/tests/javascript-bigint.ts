import { TopicMock } from '../types';

export const tests: TopicMock = {
    titleUK: 'BigInt',
    titleEN: 'BigInt',
    questions: [
        {
            textUK: 'BigInt: створення, тип і базові обмеження. Які з наведених тверджень є правильними?',
            textEN: 'BigInt: creation, type, and basic constraints. Which of the following statements are correct?',
            theoryUK:
                "### Теорія: створення BigInt і базові правила\n\n**BigInt** — це примітивний тип для цілих довільної довжини. Існують два основних способи створення:\n\n1. **Літерал із суфіксом `n`**: `123n`.\n2. **Функція-конструктор без `new`**: `BigInt(123)` або `BigInt(\"123\")`.\n\nКлючові моменти:\n- `typeof 10n === 'bigint'`.\n- Не можна змішувати `BigInt` і `Number` в одній арифметичній операції без явного приведення (інакше `TypeError`).\n- `BigInt` приймає **лише цілі значення**; `BigInt('10.5')` призведе до **SyntaxError**.\n- Перетворення `Number(10n)` можливе, але може спричинити **втрату точності**, якщо значення виходить за межі `Number.MAX_SAFE_INTEGER`.\n- Унарний плюс (`+10n`) не дозволений, бо він означає приведення до `Number` → **TypeError**.\n- Літерали `BigInt` не можна записувати з десятковою крапкою: `1.0n` — **помилка**.\n",
            theoryEN:
                "### Theory: creating BigInt and basic rules\n\n**BigInt** is a primitive for arbitrarily large integers. Two main ways to create it:\n\n1. **Literal with `n` suffix**: `123n`.\n2. **Function call (without `new`)**: `BigInt(123)` or `BigInt(\"123\")`.\n\nKey points:\n- `typeof 10n === 'bigint'`.\n- You must not mix `BigInt` and `Number` in arithmetic without explicit conversion (otherwise a `TypeError`).\n- `BigInt` accepts **only integer values**; `BigInt('10.5')` results in a **SyntaxError**.\n- `Number(10n)` is allowed but may **lose precision** beyond `Number.MAX_SAFE_INTEGER`.\n- Unary plus (`+10n`) is disallowed because it implies conversion to `Number` → **TypeError**.\n- BigInt literals cannot have a decimal point: `1.0n` is a **parse error**.\n",
            answers: [
                {
                    textUK: 'Літерал 9007199254740993n є коректним BigInt.',
                    textEN: 'The literal 9007199254740993n is a valid BigInt.',
                    theoryUK: 'Так. Будь-яке ціле з суфіксом `n` — коректний літерал `BigInt`. Перевага — відсутність втрати точності на великих значеннях.',
                    theoryEN: 'Correct. Any integer with the `n` suffix is a valid `BigInt` literal. It preserves precision for large integers.',
                    isCorrect: true
                },
                {
                    textUK: "typeof 10n === 'number'.",
                    textEN: "typeof 10n === 'number'.",
                    theoryUK: "Ні. `typeof 10n` повертає **'bigint'**, оскільки це окремий примітивний тип, відмінний від `number`.",
                    theoryEN: "Incorrect. `typeof 10n` returns **'bigint'** because BigInt is a distinct primitive type from `number`.",
                    isCorrect: false
                },
                {
                    textUK: "BigInt('10.5') кине помилку під час виконання.",
                    textEN: "BigInt('10.5') will throw at runtime.",
                    theoryUK: 'Так. `BigInt` приймає лише цілі значення. Рядок із дробовою частиною спричиняє **SyntaxError**.',
                    theoryEN: 'Correct. `BigInt` only accepts integers; a string with a fractional part causes a **SyntaxError**.',
                    isCorrect: true
                },
                {
                    textUK: 'Number(10n) завжди безпечно, бо BigInt зберігає точність.',
                    textEN: 'Number(10n) is always safe because BigInt keeps precision.',
                    theoryUK: 'Ні. Під час **перетворення** в `Number` великі значення можуть втратити точність за межами `Number.MAX_SAFE_INTEGER`.',
                    theoryEN: 'Incorrect. During **conversion** to `Number`, large values may lose precision beyond `Number.MAX_SAFE_INTEGER`.',
                    isCorrect: false
                },
                {
                    textUK: 'Вираз +10n є коректним і поверне 10.',
                    textEN: 'The expression +10n is valid and returns 10.',
                    theoryUK: 'Ні. Унарний `+` намагається привести `BigInt` до `Number`, що призводить до **TypeError**.',
                    theoryEN: 'Incorrect. Unary `+` attempts to coerce a `BigInt` to `Number`, which results in a **TypeError**.',
                    isCorrect: false
                },
                {
                    textUK: 'В одному виразі можна змішувати Number і BigInt без явного приведення.',
                    textEN: 'You can mix Number and BigInt in one arithmetic expression without explicit conversion.',
                    theoryUK: 'Ні. Будь-яка арифметика зі змішаними типами (`1n + 1`) призведе до **TypeError**. Спершу приведіть один із операндів.',
                    theoryEN: 'Incorrect. Mixed-type arithmetic (`1n + 1`) throws a **TypeError**. Convert one operand first.',
                    isCorrect: false
                },
                {
                    textUK: 'Літерал 1.0n некоректний.',
                    textEN: 'The literal 1.0n is invalid.',
                    theoryUK: 'Так. Літерал `BigInt` не може містити десяткову крапку — допускаються лише цілі.',
                    theoryEN: 'Correct. BigInt literals cannot include a decimal point—only integers are allowed.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Операції з BigInt та приведення типів. Оберіть усі коректні твердження.',
            textEN: 'BigInt operations and type coercion. Choose all correct statements.',
            theoryUK:
                '### Теорія: операції, порівняння і приведення\n\n- **Арифметика**: `+`, `-`, `*`, `**`, `%`, `/` працюють із `BigInt`, але **обидва операнди мають бути `BigInt`**. Ділення `/` виконує **цілочисельну** операцію з усіченням до нуля: `7n / 2n === 3n`.\n- **Порівняння**: `===` порівнює **тип і значення** → `10n === 10` → `false`. `==` робить обмежене приведення → `10n == 10` → `true`.\n- **Реляційні оператори** (`<`, `>`, `<=`, `>=`) можуть порівнювати `BigInt` із `Number`; результат базується на числовому порядку (крім випадків із `NaN`, які завжди дають `false`).\n- **Bitwise**: підтримуються `~`, `&`, `|`, `^`, `<<`, `>>` для `BigInt`. **`>>>` (unsigned right shift) недоступний** для `BigInt` → `TypeError`.\n- **Math API**: `Math.*` очікує `Number`; передача `BigInt` призведе до `TypeError`.\n- **Експонентування**: `2n ** 3n` валідно, **негативний показник** (наприклад, `2n ** -1n`) — **RangeError**.\n- **Змішування з Number**: лише після явного приведення — `1n + BigInt(1)` або `Number(1n) + 1` (друге може втратити точність).\n',
            theoryEN:
                '### Theory: operations, comparison, and coercion\n\n- **Arithmetic**: `+`, `-`, `*`, `**`, `%`, `/` work with `BigInt`, but **both operands must be `BigInt`**. Division `/` is **integer division** with truncation toward zero: `7n / 2n === 3n`.\n- **Equality**: `===` checks **type and value** → `10n === 10` → `false`. `==` performs limited coercion → `10n == 10` → `true`.\n- **Relational operators** (`<`, `>`, `<=`, `>=`) can compare `BigInt` with `Number`; result is based on numeric ordering (except `NaN` which always yields `false`).\n- **Bitwise**: `~`, `&`, `|`, `^`, `<<`, `>>` are supported for `BigInt`. **`>>>` (unsigned right shift) is not supported** → `TypeError`.\n- **Math API**: `Math.*` expects `Number`; passing a `BigInt` raises `TypeError`.\n- **Exponentiation**: `2n ** 3n` is valid; **negative exponent** (e.g., `2n ** -1n`) is a **RangeError**.\n- **Mixing with Number**: only after explicit conversion — `1n + BigInt(1)` or `Number(1n) + 1` (the latter may lose precision).\n',
            answers: [
                {
                    textUK: '7n / 2n === 3n',
                    textEN: '7n / 2n === 3n',
                    theoryUK: 'Так. Ділення `BigInt` — цілочисельне з усіченням до нуля.',
                    theoryEN: 'Correct. BigInt division truncates toward zero.',
                    isCorrect: true
                },
                {
                    textUK: '10n === 10 повертає true.',
                    textEN: '10n === 10 evaluates to true.',
                    theoryUK: '`===` не виконує приведення типів. `bigint` !== `number`, тому вираз повертає `false`.',
                    theoryEN: '`===` does not coerce types. `bigint` !== `number`, so the expression is `false`.',
                    isCorrect: false
                },
                {
                    textUK: '10n == 10 повертає true.',
                    textEN: '10n == 10 evaluates to true.',
                    theoryUK: 'Так. `==` виконує обмежене приведення: якщо `Number(10n)` дорівнює `10` без втрати точності — результат `true`.',
                    theoryEN: 'Correct. `==` performs limited coercion; since `Number(10n)` equals `10` without precision loss, the result is `true`.',
                    isCorrect: true
                },
                {
                    textUK: '1n + 1 не кидає помилку, бо числа автоматично зводяться до BigInt.',
                    textEN: '1n + 1 does not throw because numbers auto-upcast to BigInt.',
                    theoryUK: 'Ні. Змішана арифметика заборонена — буде **TypeError**. Потрібне явне приведення.',
                    theoryEN: 'Incorrect. Mixed arithmetic is disallowed — it throws a **TypeError**. You must convert explicitly.',
                    isCorrect: false
                },
                {
                    textUK: 'Оператор >>> працює з BigInt так само, як і з Number.',
                    textEN: 'The >>> operator works with BigInt just like with Number.',
                    theoryUK: 'Ні. **Unsigned right shift `>>>` не підтримується** для `BigInt` → **TypeError**.',
                    theoryEN: 'Incorrect. **Unsigned right shift `>>>` is not supported** for `BigInt` → **TypeError**.',
                    isCorrect: false
                },
                {
                    textUK: '2n ** -1n згенерує помилку діапазону (RangeError).',
                    textEN: '2n ** -1n will raise a RangeError.',
                    theoryUK: 'Так. Степінь для `BigInt` має бути невід’ємним цілим. Негативний показник — **RangeError**.',
                    theoryEN: 'Correct. BigInt exponent must be a non-negative integer. Negative exponent causes a **RangeError**.',
                    isCorrect: true
                },
                {
                    textUK: 'Math.max(1n, 2n) поверне 2n.',
                    textEN: 'Math.max(1n, 2n) returns 2n.',
                    theoryUK: 'Ні. `Math.*` очікує `Number`; передача `BigInt` спричиняє **TypeError**.',
                    theoryEN: 'Incorrect. `Math.*` expects `Number`; passing `BigInt` results in a **TypeError**.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Інтеграція BigInt з екосистемою JS (JSON, Map/Set, Object.is, безпечні числа). Оберіть усі правильні твердження.',
            textEN: 'Integrating BigInt with the JS ecosystem (JSON, Map/Set, Object.is, safe integers). Choose all correct statements.',
            theoryUK:
                '### Теорія: BigInt у практиці\n\n- **JSON**: `JSON.stringify({ a: 10n })` кидає **TypeError** (серіалізатор не знає, як кодувати BigInt). Обхід:\n  - перетворити значення у рядок у `replacer`: `JSON.stringify(obj, (k, v) => typeof v === \'bigint\' ? v.toString() : v)`;\n  - для зворотного перетворення — `reviver`, що розпізнає цілі рядки й повертає `BigInt`.\n- **Map/Set**: `BigInt` — примітив, тому може бути ключем/елементом; різні значення `BigInt` — різні ключі.\n- **Object.is**: у `BigInt` **немає -0n**; `Object.is(0n, -0n) === true`. Для `Number` — навпаки: `Object.is(0, -0) === false`.\n- **Безпечні числа**: якщо ідентифікатори/суми можуть перевищити `Number.MAX_SAFE_INTEGER`, використовуйте `BigInt`, або зберігайте як рядки.\n- **parseInt**: повертає `Number` і може **втратити точність** для великих значень; натомість `BigInt("…")` збереже точність.\n',
            theoryEN:
                "### Theory: BigInt in practice\n\n- **JSON**: `JSON.stringify({ a: 10n })` throws a **TypeError** (serializer doesn't know how to encode BigInt). Workarounds:\n  - convert to string in a `replacer`: `JSON.stringify(obj, (k, v) => typeof v === 'bigint' ? v.toString() : v)`;\n  - use a `reviver` that detects integer strings and returns `BigInt` on parse.\n- **Map/Set**: `BigInt` is a primitive and can be a key/element; different `BigInt` values are distinct keys.\n- **Object.is**: `BigInt` has **no -0n**; `Object.is(0n, -0n) === true`. For `Number`, it's the opposite: `Object.is(0, -0) === false`.\n- **Safe integers**: if identifiers/sums may exceed `Number.MAX_SAFE_INTEGER`, use `BigInt` or store as strings.\n- **parseInt**: returns a `Number` and may **lose precision** for large values; `BigInt(\"…\")` preserves precision.\n",
            answers: [
                {
                    textUK: 'JSON.stringify({ id: 10n }) кине TypeError без спеціального replacer.',
                    textEN: 'JSON.stringify({ id: 10n }) throws a TypeError without a custom replacer.',
                    theoryUK: 'Так. Стандартний JSON-серіалізатор не підтримує `BigInt` і кидає помилку.',
                    theoryEN: "Correct. The standard JSON serializer doesn't support `BigInt` and throws.",
                    isCorrect: true
                },
                {
                    textUK: 'Щоб серіалізувати BigInt, можна перетворити його в рядок у replacer.',
                    textEN: 'To serialize BigInt, you can convert it to a string in a replacer.',
                    theoryUK: "Так. Приклад: `JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v)`.",
                    theoryEN: "Correct. Example: `JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v)`.",
                    isCorrect: true
                },
                {
                    textUK: 'Object.is(0n, -0n) === false.',
                    textEN: 'Object.is(0n, -0n) === false.',
                    theoryUK: 'Ні. У `bigint` немає від’ємного нуля — `0n` і `-0n` ідентичні → `true`.',
                    theoryEN: 'Incorrect. BigInt has no negative zero — `0n` and `-0n` are identical → `true`.',
                    isCorrect: false
                },
                {
                    textUK: 'У Map ключ 1n відрізняється від ключа 1.',
                    textEN: 'In a Map, the key 1n is different from the key 1.',
                    theoryUK: 'Так. `1n` (bigint) і `1` (number) — різні значення та різні ключі у `Map`.',
                    theoryEN: 'Correct. `1n` (bigint) and `1` (number) are different values and thus different `Map` keys.',
                    isCorrect: true
                },
                {
                    textUK: "parseInt('9007199254740993') безпечно відновлює точне значення як Number.",
                    textEN: "parseInt('9007199254740993') safely restores the exact value as a Number.",
                    theoryUK: 'Ні. `parseInt` повертає `Number`; значення > `MAX_SAFE_INTEGER` **втрачає точність**.',
                    theoryEN: 'Incorrect. `parseInt` returns a `Number`; values > `MAX_SAFE_INTEGER` **lose precision**.',
                    isCorrect: false
                },
                {
                    textUK: 'BigInt можна використовувати як стійкий ідентифікатор, коли значення можуть перевищувати Number.MAX_SAFE_INTEGER.',
                    textEN: 'BigInt can be used as a robust identifier when values may exceed Number.MAX_SAFE_INTEGER.',
                    theoryUK: 'Так. Це одна з типових причин вибору `BigInt` (великі ID, лічильники).',
                    theoryEN: 'Correct. This is a common reason to choose `BigInt` (large IDs, counters).',
                    isCorrect: true
                },
                {
                    textUK: 'Щоб відновити BigInt з JSON, можна використати reviver, що перетворює цілі рядки назад у BigInt.',
                    textEN: 'To restore BigInt from JSON, you can use a reviver that converts integer-like strings back to BigInt.',
                    theoryUK: "Так. Приклад: `JSON.parse(s, (k, v) => typeof v === 'string' && /^-?\\d+$/.test(v) ? BigInt(v) : v)`.",
                    theoryEN: "Correct. Example: `JSON.parse(s, (k, v) => typeof v === 'string' && /^-?\\d+$/.test(v) ? BigInt(v) : v)`.",
                    isCorrect: true
                }
            ],
            level: 'middle'
        }
    ]
};
