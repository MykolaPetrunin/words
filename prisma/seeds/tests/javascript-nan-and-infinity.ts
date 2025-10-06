import { TopicMock } from '../types';

export const tests: TopicMock = {
    titleUK: 'Робота з NaN, Infinity',
    titleEN: 'Working with NaN, Infinity',
    questions: [
        {
            textUK: 'IEEE-754 у JS: які твердження щодо бітових патернів, `NaN`, `Infinity` та знакового нуля (`+0`/`-0`) є вірними? Оберіть усі правильні варіанти.',
            textEN: 'IEEE-754 in JS: which statements about bit patterns, `NaN`, `Infinity`, and signed zero (`+0`/`-0`) are true? Select all that apply.',
            theoryUK:
                '## Теорія: як IEEE-754 (binary64) визначає поведінку чисел у JavaScript\n\nУсі значення типу `number` у JS — це **подвійна точність IEEE-754 (binary64)**: 1 біт знака, 11 біт експоненти, 52 біти мантиси. Це має прямі наслідки:\n\n### Спеціальні патерни\n- **`Infinity` / `-Infinity`**: усі біти експоненти = 1, мантиса = 0; знак задає `±`.\n- **`NaN`**: експонента = всі 1, **мантиса ≠ 0**. Існують різні `NaN` (payload), але **у JS вони не відрізняються на рівні мови** — ви просто отримуєте `NaN`.\n\n### Рівність і порівняння\n- `NaN` **ніколи** не дорівнює жодному значенню під `===`, навіть собі: `NaN === NaN // false`.\n- `Object.is(NaN, NaN) // true` (алгоритм SameValue).\n- `+0` і `-0` — різні бітові стани (знак нуля зберігається), але `+0 === -0 // true`; натомість `Object.is(+0, -0) // false`.\n\n### Обернене ділення для нулів\n- `1 / +0 === Infinity`, `1 / -0 === -Infinity` — **спостережний** спосіб побачити знак нуля.\n\n### Підсумок\nIEEE-754 пояснює: чому існує `-0`, чому `NaN` «руйнує» порівняння та арифметику, і чому `Object.is` має іншу семантику для `NaN`/`±0` ніж `===`.',
            theoryEN:
                '## Theory: how IEEE-754 (binary64) shapes numbers in JavaScript\n\nAll JS `number`s are **IEEE-754 double precision (binary64)**: 1 sign bit, 11 exponent bits, 52 fraction bits. Practical consequences:\n\n### Special patterns\n- **`Infinity` / `-Infinity`**: exponent = all 1s, fraction = 0; the sign encodes `±`.\n- **`NaN`**: exponent = all 1s, **fraction ≠ 0**. Multiple NaN payloads exist, but **JS does not expose them** — you only get `NaN`.\n\n### Equality & comparison\n- `NaN` **never** equals anything under `===`, not even itself: `NaN === NaN // false`.\n- `Object.is(NaN, NaN) // true` (SameValue algorithm).\n- `+0` and `-0` are distinct bit patterns; `+0 === -0 // true`, but `Object.is(+0, -0) // false`.\n\n### Reciprocal for zeros\n- `1 / +0 === Infinity`, `1 / -0 === -Infinity` — an **observable** way to detect the zero sign.\n\n### Takeaway\nIEEE-754 explains why `-0` exists, why `NaN` breaks equality/arithmetic, and why `Object.is` differs from `===` for `NaN`/`±0`.',
            answers: [
                {
                    textUK: 'У поданні `Infinity` мантиса дорівнює нулю, експонента заповнена 1',
                    textEN: 'For `Infinity`, the fraction is zero and the exponent is all 1s',
                    theoryUK: '**Правильно:** Це канонічний патерн нескінченності у IEEE-754.',
                    theoryEN: '**Correct:** That is the canonical infinity bit pattern in IEEE-754.',
                    isCorrect: true
                },
                {
                    textUK: '`NaN === NaN` повертає `true`, бо payload однаковий',
                    textEN: '`NaN === NaN` returns `true` because the payload matches',
                    theoryUK: '**Неправильно:** `===` для будь-якого `NaN` дає `false`. Payload у JS не спостережний.',
                    theoryEN: '**Incorrect:** `===` is always `false` for any `NaN`. Payload is not observable in JS.',
                    isCorrect: false
                },
                {
                    textUK: '`Object.is(+0, -0)` повертає `false`',
                    textEN: '`Object.is(+0, -0)` returns `false`',
                    theoryUK: '**Правильно:** SameValue розрізняє знак нуля.',
                    theoryEN: '**Correct:** SameValue distinguishes the zero sign.',
                    isCorrect: true
                },
                {
                    textUK: '`1 / -0 === -Infinity` — істинно',
                    textEN: '`1 / -0 === -Infinity` — true',
                    theoryUK: '**Правильно:** Обернення зберігає знак нуля.',
                    theoryEN: '**Correct:** Reciprocals preserve the zero sign.',
                    isCorrect: true
                },
                {
                    textUK: 'Різні payload у `NaN` можна розрізнити через побітові операції',
                    textEN: 'Different NaN payloads can be distinguished via bitwise ops',
                    theoryUK: '**Неправильно:** Побітові операції працюють над 32-бітними цілими після коерсії; payload `NaN` недоступний.',
                    theoryEN: '**Incorrect:** Bitwise ops coerce to 32-bit integers; NaN payloads aren’t exposed.',
                    isCorrect: false
                },
                {
                    textUK: '`+0 === -0` повертає `true`',
                    textEN: '`+0 === -0` returns `true`',
                    theoryUK: '**Правильно:** Strict Equality не розрізняє знак нуля.',
                    theoryEN: '**Correct:** Strict Equality does not distinguish zero sign.',
                    isCorrect: true
                }
            ],
            level: 'senior'
        },
        {
            textUK: 'Серіалізація та передача `NaN`/`Infinity`/`-0`: що правильно для `JSON.stringify`, `structuredClone` і `postMessage`? Оберіть усі правильні твердження.',
            textEN: 'Serialization & transfer of `NaN`/`Infinity`/`-0`: what is correct for `JSON.stringify`, `structuredClone`, and `postMessage`? Select all that apply.',
            theoryUK:
                '## Теорія: JSON vs Structured Clone\n\n### JSON\n- JSON **не має представлення** для `NaN`/`±Infinity`. При серіалізації вони стають `null` у значеннях: `JSON.stringify({v: NaN}) -> {"v":null}`.\n- **Важливо про `-0`:** формат JSON *дозволяє* число `-0`, і `JSON.parse("-0")` у JS повертає саме `-0` (`Object.is(-0, parsed) === true`). **Але** `JSON.stringify(-0)` виводить `"0"`, тому у циклі *stringify → parse* знак **втрачається**.\n\n### Structured Clone (використовують `structuredClone`, `postMessage`)\n- Зберігає **точно** `NaN`, `Infinity`, `-Infinity` і **знак нуля** (`-0`).\n- Працює з більшістю вбудованих структур (Map, Set, ArrayBuffer тощо), на відміну від JSON.\n- `postMessage` між вікнами/воркерами також базується на structured clone, тому переносить ці значення **без спотворення**.\n\n> Висновок: для точної передачі числових аномалій і бінарних даних — використовуйте structured clone (`structuredClone`, `postMessage`). JSON застосовуйте лише коли втрата `NaN`/`Infinity` до `null` та втрата знака `-0` при `JSON.stringify` прийнятні.',
            theoryEN:
                '## Theory: JSON vs Structured Clone\n\n### JSON\n- JSON **has no representation** for `NaN`/`±Infinity`. They serialize as `null` in values: `JSON.stringify({v: NaN}) -> {"v":null}`.\n- **Important about `-0`:** the JSON format *allows* `-0`, and `JSON.parse("-0")` in JS yields `-0` (`Object.is(-0, parsed) === true`). **However**, `JSON.stringify(-0)` outputs `"0"`, so a *stringify → parse* round-trip **loses** the sign.\n\n### Structured Clone (used by `structuredClone`, `postMessage`)\n- Preserves **exactly** `NaN`, `Infinity`, `-Infinity` and the **zero sign** (`-0`).\n- Works over many built-ins (Map, Set, ArrayBuffer, etc.), unlike JSON.\n- `postMessage` across windows/workers also uses structured clone, thus transfers these values **without distortion**.\n\n> Bottom line: prefer structured clone (`structuredClone`, `postMessage`) for precise transfer of numeric anomalies; JSON will collapse `NaN`/`Infinity` to `null` and `JSON.stringify` loses the `-0` sign.',
            answers: [
                {
                    textUK: '`JSON.stringify({ v: Infinity })` дає рядок з `{"v":null}`',
                    textEN: '`JSON.stringify({ v: Infinity })` yields a string with `{"v":null}`',
                    theoryUK: '**Правильно:** JSON перетворює `Infinity` на `null` у значеннях.',
                    theoryEN: '**Correct:** JSON converts `Infinity` to `null` in values.',
                    isCorrect: true
                },
                {
                    textUK: '`structuredClone({ v: NaN }).v` залишиться `NaN`',
                    textEN: '`structuredClone({ v: NaN }).v` remains `NaN`',
                    theoryUK: '**Правильно:** Алгоритм structured clone зберігає `NaN` без змін.',
                    theoryEN: '**Correct:** The structured clone algorithm preserves `NaN` as-is.',
                    isCorrect: true
                },
                {
                    textUK: '`postMessage({ z: -0 })` в воркер передасть `z` як `0`',
                    textEN: '`postMessage({ z: -0 })` to a worker transfers `z` as `0`',
                    theoryUK: '**Неправильно:** `postMessage` використовує structured clone і зберігає знак нуля (`-0`).',
                    theoryEN: '**Incorrect:** `postMessage` uses structured clone and preserves the zero sign (`-0`).',
                    isCorrect: false
                },
                {
                    textUK: '`JSON.stringify(-0)` зберігає знак нуля (`"−0"`)',
                    textEN: '`JSON.stringify(-0)` preserves the zero sign (`"−0"`)',
                    theoryUK: '**Неправильно:** `JSON.stringify(-0)` повертає рядок `"0"`, отже знак втрачається у серіалізації.',
                    theoryEN: '**Incorrect:** `JSON.stringify(-0)` returns the string `"0"`, so the sign is lost on serialization.',
                    isCorrect: false
                },
                {
                    textUK: '`structuredClone({ v: -Infinity }).v === -Infinity`',
                    textEN: '`structuredClone({ v: -Infinity }).v === -Infinity`',
                    theoryUK: '**Правильно:** Нескінченність зберігається без змін.',
                    theoryEN: '**Correct:** Infinity is preserved without change.',
                    isCorrect: true
                },
                {
                    textUK: '`postMessage` перетворює `NaN` на `null`, подібно до JSON',
                    textEN: '`postMessage` converts `NaN` to `null`, similar to JSON',
                    theoryUK: '**Неправильно:** На відміну від JSON, structured clone **не** змінює `NaN`.',
                    theoryEN: '**Incorrect:** Unlike JSON, structured clone **does not** alter `NaN`.',
                    isCorrect: false
                }
            ],
            level: 'senior'
        },
        {
            textUK: 'Взаємодія `BigInt` з `number` (`NaN`/`Infinity`) у JS: що дозволено, що заборонено і які помилки можливі? Оберіть усі правильні твердження.',
            textEN: '`BigInt` interacting with `number` (`NaN`/`Infinity`) in JS: what’s allowed, what’s forbidden, and which errors can occur? Select all that apply.',
            theoryUK:
                "## Теорія: `BigInt` проти `number`\n\n### Арифметика\n- Змішана арифметика `BigInt` ⊕ `number` (для `+ - * / % **`) **заборонена** → кидає **`TypeError`**: `1n + 1 // TypeError`.\n- У `BigInt` **немає** значень `NaN` чи `Infinity`. Спроби перетворення: `BigInt(NaN)`, `BigInt(Infinity)` → **`RangeError`**.\n\n### Порівняння\n- **Абстрактна рівність** `==` може порівнювати: `1n == 1 // true`.\n- **Строга рівність** `===` порівнює типи: `1n === 1 // false`.\n- **Реляційні** (`<`, `>`, `<=`, `>=`) між `BigInt` і `number` **допустимі**: `1n < Infinity // true`.\n\n### Перевірки та коерсія\n- `Number.isFinite(1n) // false` (бо аргумент не `number`).\n- Глобальний `isFinite(1n) // true`, оскільки виконується `Number(1n) === 1`.\n- `Number.isNaN(1n) // false`; `isNaN(1n) // false` (після коерсії до `1`).\n\n### Конверсії\n- `Number(big)` дозволено, але можливе **втрачання точності** для великих `BigInt`.\n- `BigInt(1.5) // RangeError` (неціле). `BigInt(-0) // 0n` — знак нуля зникає при перетворенні в ціле.\n\n> Пам'ятайте: **уникайте змішаної арифметики**; виконуйте явні перетворення типів і враховуйте, що `BigInt` не підтримує `NaN/Infinity`.",
            theoryEN:
                '## Theory: `BigInt` vs `number`\n\n### Arithmetic\n- Mixed arithmetic `BigInt` ⊕ `number` for `+ - * / % **` is **forbidden** → **`TypeError`**: `1n + 1 // TypeError`.\n- `BigInt` has **no** `NaN`/`Infinity`. Conversions: `BigInt(NaN)`, `BigInt(Infinity)` → **`RangeError`**.\n\n### Comparisons\n- **Abstract equality** `==` can compare: `1n == 1 // true`.\n- **Strict equality** `===` is type-sensitive: `1n === 1 // false`.\n- **Relational** (`<`, `>`, `<=`, `>=`) between `BigInt` and `number` are **allowed**: `1n < Infinity // true`.\n\n### Checks & Coercion\n- `Number.isFinite(1n) // false` (not a `number`).\n- Global `isFinite(1n) // true` via `Number(1n) === 1`.\n- `Number.isNaN(1n) // false`; `isNaN(1n) // false` after coercion to `1`.\n\n### Conversions\n- `Number(big)` is allowed but may **lose precision** for large `BigInt`s.\n- `BigInt(1.5) // RangeError` (non-integral). `BigInt(-0) // 0n` — the zero sign is lost when converting to an integer.\n\n> Remember: **avoid mixed arithmetic**; convert explicitly and note `BigInt` does not support `NaN/Infinity`.',
            answers: [
                {
                    textUK: '`1n + 1` кидає `TypeError`',
                    textEN: '`1n + 1` throws `TypeError`',
                    theoryUK: '**Правильно:** Змішана арифметика заборонена специфікацією.',
                    theoryEN: '**Correct:** Mixed arithmetic is forbidden by spec.',
                    isCorrect: true
                },
                {
                    textUK: '`1n == 1` повертає `true`',
                    textEN: '`1n == 1` returns `true`',
                    theoryUK: '**Правильно:** Абстрактна рівність дозволяє порівняння з коерсією.',
                    theoryEN: '**Correct:** Abstract equality allows cross-type comparison with coercion.',
                    isCorrect: true
                },
                {
                    textUK: '`1n === 1` повертає `true`',
                    textEN: '`1n === 1` returns `true`',
                    theoryUK: '**Неправильно:** Строга рівність враховує тип — поверне `false`.',
                    theoryEN: '**Incorrect:** Strict equality is type-sensitive — returns `false`.',
                    isCorrect: false
                },
                {
                    textUK: '`1n < Infinity` повертає `true`',
                    textEN: '`1n < Infinity` returns `true`',
                    theoryUK: '**Правильно:** Реляційні порівняння між `BigInt` і `number` дозволені.',
                    theoryEN: '**Correct:** Cross-type relational comparisons are allowed.',
                    isCorrect: true
                },
                {
                    textUK: '`BigInt(NaN)` кидає `RangeError`',
                    textEN: '`BigInt(NaN)` throws `RangeError`',
                    theoryUK: '**Правильно:** `NaN`/`Infinity` не можуть бути перетворені у ціле.',
                    theoryEN: '**Correct:** `NaN`/`Infinity` cannot be converted to an integer.',
                    isCorrect: true
                },
                {
                    textUK: '`isFinite(1n)` повертає `true`',
                    textEN: '`isFinite(1n)` returns `true`',
                    theoryUK: '**Правильно:** Глобальна версія коерсує `1n` до `1`.',
                    theoryEN: '**Correct:** The global variant coerces `1n` to `1`.',
                    isCorrect: true
                },
                {
                    textUK: '`Number.isFinite(1n)` повертає `true`',
                    textEN: '`Number.isFinite(1n)` returns `true`',
                    theoryUK: '**Неправильно:** Вона не коерсує й очікує `number`; поверне `false`.',
                    theoryEN: '**Incorrect:** It does not coerce and expects a `number`; returns `false`.',
                    isCorrect: false
                },
                {
                    textUK: '`BigInt(-0)` дорівнює `-0n` і зберігає знак',
                    textEN: '`BigInt(-0)` equals `-0n` and preserves the sign',
                    theoryUK: '**Неправильно:** Результат — `0n`; знак нуля в цілому типі не існує.',
                    theoryEN: '**Incorrect:** The result is `0n`; integers have no signed zero.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Арифметика з `Infinity`, `-Infinity`, `NaN` та знаковим нулем (`+0`/`-0`): які вирази повертають саме `NaN`, а які — ні? Оберіть усі, що дають `NaN`.',
            textEN: 'Arithmetic with `Infinity`, `-Infinity`, `NaN`, and signed zero (`+0`/`-0`): which expressions evaluate specifically to `NaN`? Select all that yield `NaN`.',
            theoryUK:
                '## Теорія: коли результат — `NaN`\n\nУ JS (`IEEE-754`) існує ряд *невизначених* комбінацій з нескінченністю, що повертають **`NaN`**:\n\n- `Infinity - Infinity` → `NaN`\n- `Infinity * 0` та `-Infinity * 0` → `NaN`\n- `Infinity / Infinity` та `-Infinity / Infinity` → `NaN`\n- Будь-яка арифметика з уже наявним `NaN` (окрім порівнянь): `NaN + 1`, `NaN * 0`, `Math.sqrt(-1)` → `NaN`\n\n### Контрасти (не `NaN`)\n- `1 / Infinity === 0`\n- `1 / -Infinity === -0` (знаковий нуль!)\n- `Infinity + 5 === Infinity`\n- `0 / 5 === 0`, але `0 / 0 === NaN`\n\n### Знаковий нуль\n- `1 / +0 === Infinity`\n- `1 / -0 === -Infinity`\n\n> Порада: якщо у формулі може зʼявитися `Infinity`, перевіряйте крайні випадки, аби не «заразити» результат `NaN`.',
            theoryEN:
                '## Theory: when the result is `NaN`\n\nIn JS (IEEE-754), several *indeterminate* infinity combinations return **`NaN`**:\n\n- `Infinity - Infinity` → `NaN`\n- `Infinity * 0` and `-Infinity * 0` → `NaN`\n- `Infinity / Infinity` and `-Infinity / Infinity` → `NaN`\n- Any arithmetic with an existing `NaN` (except comparisons): `NaN + 1`, `NaN * 0`, `Math.sqrt(-1)` → `NaN`\n\n### Contrasts (not `NaN`)\n- `1 / Infinity === 0`\n- `1 / -Infinity === -0` (signed zero!)\n- `Infinity + 5 === Infinity`\n- `0 / 5 === 0`, but `0 / 0 === NaN`\n\n### Signed zero\n- `1 / +0 === Infinity`\n- `1 / -0 === -Infinity`\n\n> Tip: if an expression can produce `Infinity`, guard edge cases to avoid `NaN` propagation.',
            answers: [
                {
                    textUK: 'Infinity - Infinity',
                    textEN: 'Infinity - Infinity',
                    theoryUK: '**Правильно:** Різниця нескінченностей невизначена → `NaN`.',
                    theoryEN: '**Correct:** The difference of infinities is indeterminate → `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: 'Infinity * 0',
                    textEN: 'Infinity * 0',
                    theoryUK: '**Правильно:** Добуток нескінченності на нуль невизначений → `NaN`.',
                    theoryEN: '**Correct:** Multiplying infinity by zero is undefined → `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: 'Infinity / Infinity',
                    textEN: 'Infinity / Infinity',
                    theoryUK: '**Правильно:** Відношення нескінченностей невизначене → `NaN`.',
                    theoryEN: '**Correct:** The ratio of infinities is undefined → `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: 'NaN + 1',
                    textEN: 'NaN + 1',
                    theoryUK: '**Правильно:** Будь-яка арифметика з `NaN` повертає `NaN`.',
                    theoryEN: '**Correct:** Any arithmetic with `NaN` yields `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: '1 / Infinity',
                    textEN: '1 / Infinity',
                    theoryUK: '**Неправильно:** Це дорівнює `0`, а не `NaN`.',
                    theoryEN: '**Incorrect:** This equals `0`, not `NaN`.',
                    isCorrect: false
                },
                {
                    textUK: '1 / -Infinity',
                    textEN: '1 / -Infinity',
                    theoryUK: '**Неправильно:** Це дорівнює `-0` (знаковий нуль), а не `NaN`.',
                    theoryEN: '**Incorrect:** This equals `-0` (signed zero), not `NaN`.',
                    isCorrect: false
                },
                {
                    textUK: 'Infinity + 5',
                    textEN: 'Infinity + 5',
                    theoryUK: '**Неправильно:** Результат — `Infinity`.',
                    theoryEN: '**Incorrect:** The result is `Infinity`.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: '`Object.is` vs `===` vs `SameValueZero`: які твердження про `NaN`, `+0`/`-0`, `includes`, `indexOf`, `Map`/`Set` є вірними? Оберіть усі правильні варіанти.',
            textEN: '`Object.is` vs `===` vs `SameValueZero`: which statements about `NaN`, `+0`/`-0`, `includes`, `indexOf`, and `Map`/`Set` are true? Select all that apply.',
            theoryUK:
                '## Теорія: три алгоритми рівності\n\n- **Strict Equality (`===`)**: `NaN === NaN` → `false`; `+0 === -0` → `true`.\n- **SameValue (`Object.is`)**: `Object.is(NaN, NaN)` → `true`; `Object.is(+0, -0)` → `false`.\n- **SameValueZero**: як SameValue, **але** `+0` та `-0` вважаються рівними; `NaN` дорівнює `NaN`.\n\n### Де вони застосовуються\n- `===`/`!==` — оператори порівняння в коді.\n- `Object.is` — безпосередньо виклик API.\n- **SameValueZero** — `Array.prototype.includes`, `Set`, `Map` (для зіставлення ключів/значень), `TypedArray.prototype.includes`.\n- **Виняток**: `Array.prototype.indexOf` використовує `===`, тому *не* знаходить `NaN`.\n\n> Практика: для пошуку `NaN` у масиві — використовуйте `includes`. Для розрізнення `+0` та `-0` — лише `Object.is` або перевірка через `1/x`.',
            theoryEN:
                '## Theory: the three equality algorithms\n\n- **Strict Equality (`===`)**: `NaN === NaN` → `false`; `+0 === -0` → `true`.\n- **SameValue (`Object.is`)**: `Object.is(NaN, NaN)` → `true`; `Object.is(+0, -0)` → `false`.\n- **SameValueZero**: like SameValue, **except** `+0` and `-0` are equal; `NaN` equals `NaN`.\n\n### Where they are used\n- `===`/`!==` — comparison operators.\n- `Object.is` — explicit API.\n- **SameValueZero** — `Array.prototype.includes`, `Set`, `Map` (key/value matching), `TypedArray.prototype.includes`.\n- **Exception**: `Array.prototype.indexOf` uses `===`, so it does *not* find `NaN`.\n\n> Practice: to find `NaN` in an array — use `includes`. To distinguish `+0` from `-0` — use `Object.is` or `1/x` trick.',
            answers: [
                {
                    textUK: '`Array.prototype.includes(NaN)` може повернути `true`',
                    textEN: '`Array.prototype.includes(NaN)` can return `true`',
                    theoryUK: '**Правильно:** `includes` застосовує SameValueZero, у якому `NaN` дорівнює `NaN`.',
                    theoryEN: '**Correct:** `includes` uses SameValueZero where `NaN` equals `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: '`Array.prototype.indexOf(NaN)` надійно знаходить `NaN`',
                    textEN: '`Array.prototype.indexOf(NaN)` reliably finds `NaN`',
                    theoryUK: '**Неправильно:** `indexOf` використовує `===`; `NaN === NaN` → `false`.',
                    theoryEN: '**Incorrect:** `indexOf` uses `===`; `NaN === NaN` → `false`.',
                    isCorrect: false
                },
                {
                    textUK: '`Object.is(+0, -0)` повертає `false`',
                    textEN: '`Object.is(+0, -0)` returns `false`',
                    theoryUK: '**Правильно:** SameValue розрізняє знак нуля.',
                    theoryEN: '**Correct:** SameValue distinguishes the zero sign.',
                    isCorrect: true
                },
                {
                    textUK: '`Set` вважає `+0` і `-0` однаковими',
                    textEN: '`Set` treats `+0` and `-0` as equal',
                    theoryUK: '**Правильно:** `Set` використовує SameValueZero, де `+0` і `-0` рівні.',
                    theoryEN: '**Correct:** `Set` uses SameValueZero where `+0` and `-0` are equal.',
                    isCorrect: true
                },
                {
                    textUK: '`Map` з ключем `NaN` дозволяє зчитувати значення іншим `NaN`',
                    textEN: '`Map` with a `NaN` key can be read using another `NaN`',
                    theoryUK: '**Правильно:** Порівняння ключів у `Map` — SameValueZero.',
                    theoryEN: '**Correct:** `Map` key equality is SameValueZero.',
                    isCorrect: true
                },
                {
                    textUK: '`+0 === -0` повертає `false`',
                    textEN: '`+0 === -0` returns `false`',
                    theoryUK: '**Неправильно:** Strict Equality не розрізняє нулі за знаком — поверне `true`.',
                    theoryEN: '**Incorrect:** Strict Equality does not distinguish zero sign — returns `true`.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: '`Number.isNaN` / `isNaN` / `Number.isFinite` / `isFinite`: які твердження коректно описують коерсію та результати для різних значень? Оберіть усі правильні варіанти.',
            textEN: '`Number.isNaN` / `isNaN` / `Number.isFinite` / `isFinite`: which statements correctly describe coercion and outcomes for various values? Select all that apply.',
            theoryUK:
                "## Теорія: перевірки на `NaN` і скінченність\n\n### `isNaN(value)` (глобальна)\n- **Коерсує** аргумент до числа: `isNaN('foo') === true` (бо `Number('foo') → NaN`).\n\n### `Number.isNaN(value)`\n- **Без коерсії**: `Number.isNaN('foo') === false`, `Number.isNaN(NaN) === true`.\n\n### `isFinite(value)` (глобальна)\n- **Коерсує** аргумент: `isFinite('10') === true`, `isFinite('Infinity') === false`.\n\n### `Number.isFinite(value)`\n- **Без коерсії**: повертає `true` лише для значень типу `number`, які скінченні: `Number.isFinite(10) === true`, `Number.isFinite('10') === false`.\n\n### Типові підводні камені\n- Порожній рядок і пробіли: `isFinite(' ') === true` (коерсія до `0`), `isNaN(' ') === false`.\n- Булеві: `isFinite(true) === true` (коерсія до `1`), але `Number.isFinite(true) === false`.\n- `null`: `isFinite(null) === true` (коерсія до `0`), `Number.isFinite(null) === false`.\n\n> Практика: для валідації завжди віддавайте перевагу **`Number.isNaN`** та **`Number.isFinite`**, щоби уникати сюрпризів коерсії.",
            theoryEN:
                "## Theory: checking `NaN` and finiteness\n\n### `isNaN(value)` (global)\n- **Coerces** the argument: `isNaN('foo') === true` (since `Number('foo') → NaN`).\n\n### `Number.isNaN(value)`\n- **No coercion**: `Number.isNaN('foo') === false`, `Number.isNaN(NaN) === true`.\n\n### `isFinite(value)` (global)\n- **Coerces** the argument: `isFinite('10') === true`, `isFinite('Infinity') === false`.\n\n### `Number.isFinite(value)`\n- **No coercion**: returns `true` only for finite values of type `number`: `Number.isFinite(10) === true`, `Number.isFinite('10') === false`.\n\n### Gotchas\n- Empty string & spaces: `isFinite(' ') === true` (coerces to `0`), `isNaN(' ') === false`.\n- Booleans: `isFinite(true) === true` (coerces to `1`), but `Number.isFinite(true) === false`.\n- `null`: `isFinite(null) === true` (coerces to `0`), `Number.isFinite(null) === false`.\n\n> Practice: prefer **`Number.isNaN`** and **`Number.isFinite`** for validation to avoid coercion surprises.",
            answers: [
                {
                    textUK: "`isNaN('foo') === true`",
                    textEN: "`isNaN('foo') === true`",
                    theoryUK: "**Правильно:** Коерсія рядка `'foo'` у `Number` дає `NaN`.",
                    theoryEN: "**Correct:** Coercing `'foo'` to `Number` yields `NaN`.",
                    isCorrect: true
                },
                {
                    textUK: "`Number.isNaN('foo') === true`",
                    textEN: "`Number.isNaN('foo') === true`",
                    theoryUK: '**Неправильно:** Без коерсії рядок не є `NaN`; результат `false`.',
                    theoryEN: '**Incorrect:** Without coercion the string isn’t `NaN`; result is `false`.',
                    isCorrect: false
                },
                {
                    textUK: "`isFinite('10') === true`, а `Number.isFinite('10') === false`",
                    textEN: "`isFinite('10') === true` while `Number.isFinite('10') === false`",
                    theoryUK: "**Правильно:** Перша функція коерсує (`'10'` → 10), друга — ні.",
                    theoryEN: "**Correct:** The former coerces (`'10'` → 10), the latter does not.",
                    isCorrect: true
                },
                {
                    textUK: "`isFinite('Infinity') === true`",
                    textEN: "`isFinite('Infinity') === true`",
                    theoryUK: "**Неправильно:** `'Infinity'` коерсується до `Infinity`, отже `isFinite('Infinity') === false`.",
                    theoryEN: "**Incorrect:** `'Infinity'` coerces to `Infinity`, so `isFinite('Infinity') === false`.",
                    isCorrect: false
                },
                {
                    textUK: '`isFinite(null) === true`, але `Number.isFinite(null) === false`',
                    textEN: '`isFinite(null) === true`, but `Number.isFinite(null) === false`',
                    theoryUK: '**Правильно:** Глобальна версія коерсує `null` → `0`; метод `Number.*` — ні.',
                    theoryEN: '**Correct:** The global version coerces `null` → `0`; `Number.*` does not.',
                    isCorrect: true
                },
                {
                    textUK: '`Number.isFinite(true) === true`',
                    textEN: '`Number.isFinite(true) === true`',
                    theoryUK: '**Неправильно:** `true` не є типом `number`; результат `false`.',
                    theoryEN: '**Incorrect:** `true` is not of type `number`; result is `false`.',
                    isCorrect: false
                },
                {
                    textUK: "`isNaN(' ') === true` (рядок із пробілом)",
                    textEN: "`isNaN(' ') === true` (string with a space)",
                    theoryUK: "**Неправильно:** `' '` коерсується до `0`, тож `isNaN(' ') === false`.",
                    theoryEN: "**Incorrect:** `' '` coerces to `0`, so `isNaN(' ') === false`.",
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'TypedArray і Float32Array: як `NaN`, `Infinity`, `-Infinity` та `-0` зберігаються і читаються на низькому рівні? Оберіть усі правильні твердження.',
            textEN: 'TypedArray and Float32Array: how are `NaN`, `Infinity`, `-Infinity`, and `-0` stored and read at a low level? Select all true statements.',
            theoryUK:
                '## Теорія: особливі значення у TypedArray/DataView\n\n### Плаваючі типи (Float32Array/Float64Array)\n- Вони зберігають значення у **IEEE-754** форматі (відповідно 32/64 біти).\n- Запис **`NaN`** повертається як `NaN` при читанні; **payload `NaN`** (точний бітовий вміст мантиси) **не спостережуваний** у JS — ви просто отримуєте `NaN`.\n- Запис **`±Infinity`** читається як `±Infinity` без змін.\n- Запис **`-0`** зберігає знак нуля; перевірка: `Object.is(value, -0)` або `1 / value === -Infinity`.\n- `TypedArray.prototype.includes` для «плаваючих» типів використовує **SameValueZero**, тому `includes(NaN)` повертає `true`. Натомість `indexOf` використовує семантику `===`, тож `indexOf(NaN) === -1`.\n\n### Цілочисельні типи (Int8/16/32, Uint8/16/32, BigInt64/BigUint64)\n- Вони **не можуть зберігати** `NaN` чи `Infinity`. Перед записом відбувається перетворення: \n  - Для звичайних Int/Uint — `ToNumber` → `ToInteger`/`ToInt32`/`ToUint32` з модульним обрізанням; `NaN` та `±Infinity` стають `+0`.\n  - Для `BigInt`-масивів потрібні **BigInt** значення; запис чисел (`number`) призведе до **TypeError**.\n\n### DataView\n- `DataView.setFloat32 / setFloat64` записують IEEE-754 подання; `getFloat*` з **тією ж endianness** поверне саме те значення (`NaN` лишиться `NaN`, знак нуля збережеться). Endianness впливає лише на **порядок байтів**, а не на саме числове значення при симетричному читанні.\n\n> Висновок: тільки «плаваючі» TypedArray та DataView зберігають `NaN`/`∞`/`-0` буквально; цілочисельні масиви перетворюють їх до цілих (здебільшого `0`) або вимагають BigInt без коерсії з `number`.',
            theoryEN:
                '## Theory: special values in TypedArray/DataView\n\n### Floating types (Float32Array/Float64Array)\n- They store values in **IEEE-754** format (32/64 bits).\n- Writing **`NaN`** reads back as `NaN`; the **NaN payload** (fraction bits) is **not observable** in JS — you only get `NaN`.\n- Writing **`±Infinity`** reads back as `±Infinity` unchanged.\n- Writing **`-0`** preserves the zero sign; verify with `Object.is(value, -0)` or `1 / value === -Infinity`.\n- `TypedArray.prototype.includes` for floating types uses **SameValueZero**, so `includes(NaN)` returns `true`. In contrast, `indexOf` uses `===`, thus `indexOf(NaN) === -1`.\n\n### Integer types (Int8/16/32, Uint8/16/32, BigInt64/BigUint64)\n- They **cannot store** `NaN` or `Infinity`. Before storage:\n  - For regular Int/Uint, `ToNumber` → `ToInteger`/`ToInt32`/`ToUint32` with modular wrapping; `NaN` and `±Infinity` become `+0`.\n  - For `BigInt` typed arrays, values **must be BigInt**; assigning a `number` throws **TypeError**.\n\n### DataView\n- `DataView.setFloat32 / setFloat64` write IEEE-754 representations; `getFloat*` with the **same endianness** returns the exact value (`NaN` remains `NaN`, zero sign is preserved). Endianness affects **byte order** only, not the numeric value when read symmetrically.\n\n> Takeaway: only floating typed arrays and DataView faithfully store `NaN`/`∞`/`-0`; integer typed arrays coerce them to integers (often `0`) or require BigInt without coercion from `number`.',
            answers: [
                {
                    textUK: 'Запис `NaN` у Float32Array при читанні дає `NaN` (payload `NaN` не спостерігається в JS)',
                    textEN: 'Writing `NaN` into a Float32Array reads back as `NaN` (NaN payload is not observable in JS)',
                    theoryUK: '**Правильно:** JS не розрізняє різні бітові патерни `NaN`; при читанні ви отримаєте просто `NaN`.',
                    theoryEN: '**Correct:** JS does not expose distinct NaN bit patterns; readback yields plain `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: 'Запис `-0` у Float64Array зберігає знак нуля; `Object.is(value, -0) === true`',
                    textEN: 'Writing `-0` into a Float64Array preserves the sign; `Object.is(value, -0) === true`',
                    theoryUK: '**Правильно:** Подання IEEE-754 має окремий біт знака, тож `-0` відтворюється точно.',
                    theoryEN: '**Correct:** IEEE-754 has a sign bit; `-0` is represented and preserved exactly.',
                    isCorrect: true
                },
                {
                    textUK: 'Запис `Infinity` у Int32Array збережеться як `Infinity`',
                    textEN: 'Writing `Infinity` into an Int32Array is stored as `Infinity`',
                    theoryUK: '**Неправильно:** Цілочисельні типи виконують перетворення; `ToInt32(Infinity) → +0`.',
                    theoryEN: '**Incorrect:** Integer typed arrays coerce; `ToInt32(Infinity) → +0`.',
                    isCorrect: false
                },
                {
                    textUK: '`DataView.setFloat32(..., NaN)` і `getFloat32` з тією ж endianness повернуть `NaN`',
                    textEN: '`DataView.setFloat32(..., NaN)` and `getFloat32` with the same endianness return `NaN`',
                    theoryUK: '**Правильно:** Endianness впливає лише на порядок байтів; за симетричного читання значення зберігається.',
                    theoryEN: '**Correct:** Endianness affects byte order only; symmetric readback reproduces the value.',
                    isCorrect: true
                },
                {
                    textUK: '`Float64Array.prototype.includes(NaN)` може повернути `true`, але `indexOf(NaN)` поверне `-1`',
                    textEN: '`Float64Array.prototype.includes(NaN)` may return `true`, but `indexOf(NaN)` returns `-1`',
                    theoryUK: '**Правильно:** `includes` використовує SameValueZero (де `NaN` дорівнює `NaN`), тоді як `indexOf` використовує `===`.',
                    theoryEN: '**Correct:** `includes` uses SameValueZero (where `NaN` equals `NaN`), while `indexOf` uses `===`.',
                    isCorrect: true
                },
                {
                    textUK: 'Запис `NaN` у Float32Array може прочитатися як скінченне число на деяких платформах',
                    textEN: 'Writing `NaN` into a Float32Array may read back as a finite number on some platforms',
                    theoryUK: '**Неправильно:** У межах специфікації JS/IEEE-754 `NaN` відтворюється як `NaN` при читанні.',
                    theoryEN: '**Incorrect:** Under JS/IEEE-754, `NaN` reads back as `NaN`.',
                    isCorrect: false
                },
                {
                    textUK: 'Присвоєння `Infinity` до BigInt64Array елемента призведе до `TypeError`',
                    textEN: 'Assigning `Infinity` to a BigInt64Array element results in `TypeError`',
                    theoryUK: '**Правильно:** BigInt-масиви приймають лише значення типу `bigint`; передача `number` (зокрема `Infinity`) заборонена.',
                    theoryEN: '**Correct:** BigInt typed arrays accept only `bigint` values; passing a `number` (including `Infinity`) is forbidden.',
                    isCorrect: true
                },
                {
                    textUK: 'Запис `-Infinity` у Uint8Array збереже найбільше значення (наприклад, 255)',
                    textEN: 'Writing `-Infinity` into a Uint8Array stores the max value (e.g., 255)',
                    theoryUK: '**Неправильно:** `ToUint8(-Infinity)` після кроків перетворення дає `+0`, а не 255.',
                    theoryEN: '**Incorrect:** After coercion steps, `ToUint8(-Infinity)` yields `+0`, not 255.',
                    isCorrect: false
                },
                {
                    textUK: '`DataView` з різною endianness може дати інше число при читанні тих самих байтів',
                    textEN: '`DataView` with different endianness can produce a different number for the same bytes',
                    theoryUK: '**Правильно:** Якщо запис у little-endian, а читання у big-endian (або навпаки), байти інтерпретуються інакше — число зміниться.',
                    theoryEN: '**Correct:** Writing in little-endian and reading in big-endian (or vice-versa) changes byte interpretation, thus the number.',
                    isCorrect: true
                }
            ],
            level: 'senior'
        },
        {
            textUK: 'Ділення на нуль і знаковий нуль: які вирази повертають саме `Infinity`, `-Infinity` або `NaN`? Оберіть усі твердження, які є коректними.',
            textEN: 'Division by zero and signed zero: which expressions evaluate to `Infinity`, `-Infinity` or `NaN`? Select all correct statements.',
            theoryUK:
                '## Теорія: `1 / 0`, `1 / -0` та інші крайні випадки\n\nJavaScript числа — IEEE-754 **double**. Це означає, що **ділення на нуль** дає нескінченності зі збереженням знаку, а деякі форми — **невизначені** й повертають `NaN`.\n\n### Базові правила\n- **Ненульове скінченне / `+0`** → `Infinity`  \n  `1 / +0 === Infinity`\n- **Ненульове скінченне / `-0`** → `-Infinity`  \n  `1 / -0 === -Infinity`\n- **`0 / 0`** → `NaN` (невизначеність)\n- **Будь-що / `Infinity`**:  \n  `1 / Infinity === 0`, `1 / -Infinity === -0`\n\n### Додаткові приклади з урахуванням знака нуля\n- `Infinity / +0 === Infinity`, `Infinity / -0 === -Infinity`\n- `-Infinity / +0 === -Infinity`, `-Infinity / -0 === Infinity`\n- `0 / -0` та `0 / +0` → `NaN`\n\n> **Спостереження знаку нуля**: `Object.is(-0, +0) === false`; також `1 / -0 === -Infinity`, `1 / +0 === Infinity`.',
            theoryEN:
                '## Theory: `1 / 0`, `1 / -0` and other edge cases\n\nJavaScript numbers follow IEEE-754 **double**. This implies division by zero yields infinities with preserved sign, while some forms are **indeterminate** and return `NaN`.\n\n### Core rules\n- **Non-zero finite / `+0`** → `Infinity`  \n  `1 / +0 === Infinity`\n- **Non-zero finite / `-0`** → `-Infinity`  \n  `1 / -0 === -Infinity`\n- **`0 / 0`** → `NaN` (indeterminate)\n- **Anything / `Infinity`**:  \n  `1 / Infinity === 0`, `1 / -Infinity === -0`\n\n### Extra examples with signed zero\n- `Infinity / +0 === Infinity`, `Infinity / -0 === -Infinity`\n- `-Infinity / +0 === -Infinity`, `-Infinity / -0 === Infinity`\n- `0 / -0` and `0 / +0` → `NaN`\n\n> **Observing the zero sign**: `Object.is(-0, +0) === false`; also `1 / -0 === -Infinity`, `1 / +0 === Infinity`.',
            answers: [
                {
                    textUK: '`1 / 0 === Infinity`',
                    textEN: '`1 / 0 === Infinity`',
                    theoryUK: '**Правильно:** Ненульове скінченне число, поділене на `+0`, дає `Infinity`.',
                    theoryEN: '**Correct:** A non-zero finite divided by `+0` yields `Infinity`.',
                    isCorrect: true
                },
                {
                    textUK: '`1 / -0 === -Infinity`',
                    textEN: '`1 / -0 === -Infinity`',
                    theoryUK: '**Правильно:** Знак нуля зберігається у результаті — отримаємо від’ємну нескінченність.',
                    theoryEN: '**Correct:** The zero sign is preserved — the result is negative infinity.',
                    isCorrect: true
                },
                {
                    textUK: '`0 / 0 === NaN`',
                    textEN: '`0 / 0 === NaN`',
                    theoryUK: '**Правильно:** Це класична невизначеність, результат — `NaN`.',
                    theoryEN: '**Correct:** This is indeterminate; result is `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: '`1 / Infinity === 0`',
                    textEN: '`1 / Infinity === 0`',
                    theoryUK: '**Правильно:** Ділення на нескінченно великий знаменник прямує до нуля.',
                    theoryEN: '**Correct:** Division by an infinite denominator tends to zero.',
                    isCorrect: true
                },
                {
                    textUK: '`Infinity / Infinity === Infinity`',
                    textEN: '`Infinity / Infinity === Infinity`',
                    theoryUK: '**Неправильно:** `Infinity / Infinity` — невизначеність → `NaN`.',
                    theoryEN: '**Incorrect:** `Infinity / Infinity` is indeterminate → `NaN`.',
                    isCorrect: false
                },
                {
                    textUK: '`0 / -0 === -Infinity`',
                    textEN: '`0 / -0 === -Infinity`',
                    theoryUK: '**Неправильно:** `0 / ±0` — це невизначеність, тому `NaN`.',
                    theoryEN: '**Incorrect:** `0 / ±0` is indeterminate, so `NaN`.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Math API з `NaN` і `Infinity`: які результати повернуть наведені виклики? Оберіть усі правильні твердження.',
            textEN: 'Math API with `NaN` and `Infinity`: which outcomes do these calls return? Select all correct statements.',
            theoryUK:
                '## Теорія: поведінка `Math.*` з особливими значеннями\n\n### `Math.min` / `Math.max`\n- Якщо **є хоча б один `NaN`**, результат — **`NaN`**:  \n  `Math.min(1, NaN) === NaN`, `Math.max(NaN, 5) === NaN`.\n- `Math.max(Infinity, 10) === Infinity`; `Math.min(-Infinity, 10) === -Infinity`.\n\n### `Math.sqrt`\n- `Math.sqrt(позитивне)` → звичайний корінь.  \n- `Math.sqrt(від’ємне)` → **`NaN`** (у стандартному `Math` немає комплексних чисел):  \n  `Math.sqrt(-1) === NaN`.\n\n### `Math.pow` / оператор `**`\n- `Math.pow(x, 0) === 1` навіть для `x = Infinity` або `x = -Infinity`.\n- `Math.pow(0, позитивна_нескінченність) === 0`.\n- `Math.pow(0, від’ємне)` → `Infinity` (бо це `1 / 0^k`). Для `-0` знак може вплинути на `±Infinity` залежно від парності степеня.\n\n> **Порада:** якщо у вхідних даних можливі `NaN`/`Infinity`, очікуйте, що `Math.min/max` «заражатимуться» `NaN`, а степені з нульовою основою й від’ємним показником дадуть нескінченність.',
            theoryEN:
                '## Theory: `Math.*` behavior with special values\n\n### `Math.min` / `Math.max`\n- If **any argument is `NaN`**, the result is **`NaN`**:  \n  `Math.min(1, NaN) === NaN`, `Math.max(NaN, 5) === NaN`.\n- `Math.max(Infinity, 10) === Infinity`; `Math.min(-Infinity, 10) === -Infinity`.\n\n### `Math.sqrt`\n- `Math.sqrt(positive)` → usual root.  \n- `Math.sqrt(negative)` → **`NaN`** (`Math` has no complex numbers):  \n  `Math.sqrt(-1) === NaN`.\n\n### `Math.pow` / `**`\n- `Math.pow(x, 0) === 1`, even for `x = Infinity` or `x = -Infinity`.\n- `Math.pow(0, positive_infinity) === 0`.\n- `Math.pow(0, negative)` → `Infinity` (since it’s `1 / 0^k`). For `-0`, the sign may affect `±Infinity` depending on exponent parity.\n\n> **Tip:** With possible `NaN`/`Infinity` inputs, expect `Math.min/max` to be contaminated by `NaN`, and powers with zero base and negative exponent to yield infinity.',
            answers: [
                {
                    textUK: '`Math.min(1, NaN) === NaN`',
                    textEN: '`Math.min(1, NaN) === NaN`',
                    theoryUK: '**Правильно:** Будь-яка присутність `NaN` у `min/max` робить результат `NaN`.',
                    theoryEN: '**Correct:** Any `NaN` argument makes `min/max` return `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: '`Math.max(Infinity, 10) === Infinity`',
                    textEN: '`Math.max(Infinity, 10) === Infinity`',
                    theoryUK: '**Правильно:** Нескінченність домінує у максимумі.',
                    theoryEN: '**Correct:** Infinity dominates in `max`.',
                    isCorrect: true
                },
                {
                    textUK: '`Math.sqrt(-1) === NaN`',
                    textEN: '`Math.sqrt(-1) === NaN`',
                    theoryUK: '**Правильно:** Корінь з від’ємного не визначено у дійсних числах.',
                    theoryEN: '**Correct:** Square root of a negative is not real.',
                    isCorrect: true
                },
                {
                    textUK: '`Math.pow(Infinity, 0) === 1`',
                    textEN: '`Math.pow(Infinity, 0) === 1`',
                    theoryUK: '**Правильно:** Будь-яке ненульове число у степені 0 дорівнює 1.',
                    theoryEN: '**Correct:** Any non-zero to the power of 0 is 1.',
                    isCorrect: true
                },
                {
                    textUK: '`Math.pow(0, -1) === Infinity`',
                    textEN: '`Math.pow(0, -1) === Infinity`',
                    theoryUK: '**Правильно:** Це `1 / 0^1`, що дорівнює `Infinity` (для `-0` може бути `-Infinity` залежно від парності).',
                    theoryEN: '**Correct:** This is `1 / 0^1`, which is `Infinity` (for `-0` sign may yield `-Infinity` depending on parity).',
                    isCorrect: true
                },
                {
                    textUK: '`Math.max(NaN, NaN) === 0`',
                    textEN: '`Math.max(NaN, NaN) === 0`',
                    theoryUK: '**Неправильно:** Результат — `NaN`, бо є `NaN` серед аргументів.',
                    theoryEN: '**Incorrect:** The result is `NaN` because arguments contain `NaN`.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: '`BigInt` + `NaN` та змішана арифметика: які з наведених тверджень є вірними? Оберіть усі правильні варіанти.',
            textEN: '`BigInt` + `NaN` and mixed arithmetic: which statements are true? Select all that apply.',
            theoryUK:
                '## Теорія: `BigInt` проти `number` і `NaN`\n\n### Заборона змішаної арифметики\n- Будь-яка **арифметична** операція між `bigint` і `number` (включно з `NaN`/`Infinity`) у JS → **`TypeError`**:  \n  `1n + 1`, `1n + NaN`, `1n * Infinity` — усе кидає `TypeError`.\n\n### Порівняння\n- Абстрактна рівність (`==`) *може* порівнювати `bigint` і `number`: `1n == 1` → `true`.\n- Строга рівність (`===`) — різні типи → `false`.\n- **`NaN`** не дорівнює нічому: `1n == NaN` → `false`, `NaN === NaN` → `false`.\n\n### Перевірки та конверсії\n- `Number.isNaN(1n)` → `false`; `isNaN(1n)` → `false` (коерсія до `1`).\n- `BigInt(NaN)` / `BigInt(Infinity)` → **`RangeError`** (неціле значення).\n- `Number(1n)` дозволено (можлива втрата точності для великих значень); після явного перетворення арифметика з числами — **допустима**:  \n  `Number(1n) + 1 === 2`.\n\n> **Висновок:** не змішуйте `bigint` із `number` в арифметиці; спершу виконайте явне перетворення до одного типу.',
            theoryEN:
                '## Theory: `BigInt` vs `number` and `NaN`\n\n### Mixed arithmetic is forbidden\n- Any **arithmetic** between `bigint` and `number` (including `NaN`/`Infinity`) in JS → **`TypeError`**:  \n  `1n + 1`, `1n + NaN`, `1n * Infinity` — all throw `TypeError`.\n\n### Comparisons\n- Abstract equality (`==`) *can* compare `bigint` and `number`: `1n == 1` → `true`.\n- Strict equality (`===`) — different types → `false`.\n- **`NaN`** equals nothing: `1n == NaN` → `false`, `NaN === NaN` → `false`.\n\n### Checks & conversions\n- `Number.isNaN(1n)` → `false`; `isNaN(1n)` → `false` (coerces to `1`).\n- `BigInt(NaN)` / `BigInt(Infinity)` → **`RangeError`** (non-integral).\n- `Number(1n)` is allowed (precision may be lost); after explicit conversion, arithmetic with numbers is **allowed**:  \n  `Number(1n) + 1 === 2`.\n\n> **Takeaway:** don’t mix `bigint` with `number` in arithmetic; convert explicitly to a single type first.',
            answers: [
                {
                    textUK: '`1n + NaN` кидає `TypeError`',
                    textEN: '`1n + NaN` throws `TypeError`',
                    theoryUK: '**Правильно:** Змішана арифметика `bigint` та `number` заборонена.',
                    theoryEN: '**Correct:** Mixed `bigint` and `number` arithmetic is forbidden.',
                    isCorrect: true
                },
                {
                    textUK: '`NaN + 1n` кидає `TypeError`',
                    textEN: '`NaN + 1n` throws `TypeError`',
                    theoryUK: '**Правильно:** Порядок операндів не змінює факт змішування типів.',
                    theoryEN: '**Correct:** Operand order doesn’t change the mixed-types restriction.',
                    isCorrect: true
                },
                {
                    textUK: '`BigInt(NaN)` кидає `RangeError`',
                    textEN: '`BigInt(NaN)` throws `RangeError`',
                    theoryUK: '**Правильно:** `NaN` — неціле значення; перетворення в `BigInt` заборонене.',
                    theoryEN: '**Correct:** `NaN` is not an integer; conversion to `BigInt` is disallowed.',
                    isCorrect: true
                },
                {
                    textUK: '`1n == NaN` повертає `true`',
                    textEN: '`1n == NaN` returns `true`',
                    theoryUK: '**Неправильно:** `NaN` не дорівнює жодному значенню в абстрактній рівності.',
                    theoryEN: '**Incorrect:** `NaN` equals nothing under abstract equality.',
                    isCorrect: false
                },
                {
                    textUK: '`Number(1n) + 1 === 2`',
                    textEN: '`Number(1n) + 1 === 2`',
                    theoryUK: '**Правильно:** Після явного перетворення до `number` арифметика коректна.',
                    theoryEN: '**Correct:** After explicit conversion to `number`, arithmetic is valid.',
                    isCorrect: true
                },
                {
                    textUK: '`Number.isNaN(1n) === true`',
                    textEN: '`Number.isNaN(1n) === true`',
                    theoryUK: '**Неправильно:** `1n` не є `NaN` і не типу `number`; результат `false`.',
                    theoryEN: '**Incorrect:** `1n` is not `NaN` and not a `number`; result is `false`.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Чим відрізняються `isNaN` (глобальна) і `Number.isNaN` (строга) у JavaScript? Оберіть усі правильні твердження.',
            textEN: 'How do the global `isNaN` and strict `Number.isNaN` differ in JavaScript? Select all correct statements.',
            theoryUK:
                "## Теорія: `isNaN` vs `Number.isNaN`\n\nУ JavaScript **є дві різні перевірки на NaN**:\n\n### 1) Глобальна `isNaN(value)`\n- **Виконує коерсію** аргументу до числа (`Number(value)`), а потім перевіряє, чи результат — `NaN`.\n- Через коерсію дає іноді **несподівані** результати:\n  - `isNaN('foo') === true` (бо `Number('foo') -> NaN`)\n  - `isNaN(' ') === false` (бо `Number(' ') -> 0`)\n  - `isNaN(undefined) === true` (бо `Number(undefined) -> NaN`)\n  - `isNaN(new Date('invalid')) === true` (бо `Number(invalidDate) -> NaN`)\n\n### 2) `Number.isNaN(value)`\n- **Без коерсії**: повертає `true` **лише** якщо *вхідне значення вже є числовим `NaN`*.\n- Приклади:\n  - `Number.isNaN(NaN) === true`\n  - `Number.isNaN('foo') === false` (рядок, не `number`)\n  - `Number.isNaN(undefined) === false`\n  - `Number.isNaN(new Date('invalid')) === false`\n\n### Чому це важливо\n- Для валідації користувацького вводу **завжди** віддавайте перевагу `Number.isNaN`, щоб уникнути прихованої коерсії.\n- `typeof NaN === 'number'`, але це *особливе* числове значення, яке «заражає» обчислення: `NaN + 1 -> NaN`.\n\n> **Висновок:** якщо потрібна **строга** перевірка без приведення типів — використовуйте `Number.isNaN`. Глобальна `isNaN` годиться лише тоді, коли **свідомо** приймаєте коерсію.",
            theoryEN:
                "## Theory: `isNaN` vs `Number.isNaN`\n\nJavaScript provides **two different NaN checks**:\n\n### 1) Global `isNaN(value)`\n- **Coerces** the argument to a number (`Number(value)`), then checks if it’s `NaN`.\n- Due to coercion it can yield **surprising** results:\n  - `isNaN('foo') === true` (since `Number('foo') -> NaN`)\n  - `isNaN(' ') === false` (since `Number(' ') -> 0`)\n  - `isNaN(undefined) === true` (since `Number(undefined) -> NaN`)\n  - `isNaN(new Date('invalid')) === true`\n\n### 2) `Number.isNaN(value)`\n- **No coercion**: returns `true` **only** if the input is already the numeric `NaN`.\n- Examples:\n  - `Number.isNaN(NaN) === true`\n  - `Number.isNaN('foo') === false`\n  - `Number.isNaN(undefined) === false`\n  - `Number.isNaN(new Date('invalid')) === false`\n\n### Why it matters\n- For validation of user input, prefer **`Number.isNaN`** to avoid hidden coercion.\n- `typeof NaN === 'number'`, but it’s a special value that contaminates arithmetic: `NaN + 1 -> NaN`.\n\n> **Bottom line:** use `Number.isNaN` for **strict**, no-coercion checks; use global `isNaN` only if you **intentionally** accept coercion.",
            answers: [
                {
                    textUK: "`isNaN('foo') === true`, а `Number.isNaN('foo') === false`",
                    textEN: "`isNaN('foo') === true` while `Number.isNaN('foo') === false`",
                    theoryUK: '**Правильно:** Перша функція коерсує рядок до числа (отримує `NaN`), друга — ні.',
                    theoryEN: '**Correct:** The global version coerces the string to a number (`NaN`), the strict one does not.',
                    isCorrect: true
                },
                {
                    textUK: '`isNaN(undefined) === true`, а `Number.isNaN(undefined) === false`',
                    textEN: '`isNaN(undefined) === true` while `Number.isNaN(undefined) === false`',
                    theoryUK: '**Правильно:** `Number(undefined) -> NaN`, але без коерсії це не `NaN`.',
                    theoryEN: '**Correct:** `Number(undefined) -> NaN`, but without coercion it’s not `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: "`isNaN(' ') === true` (рядок з пробілом)",
                    textEN: "`isNaN(' ') === true` (string with a space)",
                    theoryUK: "**Неправильно:** `' '` коерсується у `0`, тож `isNaN(' ') === false`.",
                    theoryEN: "**Incorrect:** `' '` coerces to `0`, therefore `isNaN(' ') === false`.",
                    isCorrect: false
                },
                {
                    textUK: '`Number.isNaN(NaN) === true`',
                    textEN: '`Number.isNaN(NaN) === true`',
                    theoryUK: '**Правильно:** Строга перевірка без коерсії.',
                    theoryEN: '**Correct:** Strict, no-coercion check.',
                    isCorrect: true
                },
                {
                    textUK: "`Number.isNaN(new Date('invalid')) === true`",
                    textEN: "`Number.isNaN(new Date('invalid')) === true`",
                    theoryUK: '**Неправильно:** Обʼєкт `Date` не є `number`; без коерсії результат `false`.',
                    theoryEN: '**Incorrect:** A `Date` object is not a `number`; without coercion the result is `false`.',
                    isCorrect: false
                },
                {
                    textUK: '`isNaN( { } )` завжди `false`, бо обʼєкти не числа',
                    textEN: '`isNaN( { } )` is always `false` because objects aren’t numbers',
                    theoryUK: '**Неправильно:** Обʼєкт спочатку коерсується (`Number({}) -> NaN`), тож `isNaN({}) === true`.',
                    theoryEN: '**Incorrect:** Objects are coerced first (`Number({}) -> NaN`), so `isNaN({}) === true`.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: '`Array.includes`, `indexOf` і `Set.has` з `NaN`: які твердження вірно описують поведінку (SameValueZero vs `===`)? Оберіть усі правильні варіанти.',
            textEN: '`Array.includes`, `indexOf`, and `Set.has` with `NaN`: which statements correctly describe their behavior (SameValueZero vs `===`)? Select all that apply.',
            theoryUK:
                '## Теорія: SameValueZero проти Strict Equality\n\nУ JS різні API використовують **різні алгоритми рівності**:\n\n- **Strict Equality (`===`)** — `NaN === NaN` → `false`; `+0 === -0` → `true`.\n- **SameValueZero** — як SameValue, **але** `+0` і `-0` вважаються однаковими; `NaN` дорівнює `NaN`.\n\n### Де що застосовується\n- `Array.prototype.includes` → **SameValueZero** (знаходить `NaN`).\n- `Set`/`Map` (зіставлення елементів/ключів) → **SameValueZero** (мають `NaN`).\n- `Array.prototype.indexOf` → **`===`** (не знайде `NaN`).\n- `TypedArray.prototype.includes` → **SameValueZero** (аналоги `includes` для типізованих масивів також знаходять `NaN`).\n\n> **Практика:** для пошуку `NaN` у масиві — використовуйте `includes` або структури `Set/Map`. `indexOf` тут не допоможе.',
            theoryEN:
                '## Theory: SameValueZero vs Strict Equality\n\nDifferent JS APIs rely on **different equality algorithms**:\n\n- **Strict Equality (`===`)** — `NaN === NaN` → `false`; `+0 === -0` → `true`.\n- **SameValueZero** — like SameValue but treats `+0` and `-0` as equal; `NaN` equals `NaN`.\n\n### Where they are used\n- `Array.prototype.includes` → **SameValueZero** (does find `NaN`).\n- `Set`/`Map` (matching elements/keys) → **SameValueZero** (do handle `NaN`).\n- `Array.prototype.indexOf` → **`===`** (will not find `NaN`).\n- `TypedArray.prototype.includes` → **SameValueZero** (typed arrays’ `includes` also finds `NaN`).\n\n> **Practice:** use `includes` or `Set/Map` to locate `NaN`; `indexOf` won’t work for `NaN`.',
            answers: [
                {
                    textUK: '`[NaN].includes(NaN) === true`',
                    textEN: '`[NaN].includes(NaN) === true`',
                    theoryUK: '**Правильно:** `includes` застосовує SameValueZero, де `NaN` рівний `NaN`.',
                    theoryEN: '**Correct:** `includes` uses SameValueZero, where `NaN` equals `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: '`[NaN].indexOf(NaN) === 0`',
                    textEN: '`[NaN].indexOf(NaN) === 0`',
                    theoryUK: '**Неправильно:** `indexOf` використовує `===`; `NaN === NaN` → `false`, тож поверне `-1`.',
                    theoryEN: '**Incorrect:** `indexOf` uses `===`; `NaN === NaN` → `false`, so it returns `-1`.',
                    isCorrect: false
                },
                {
                    textUK: '`new Set([NaN]).has(NaN) === true`',
                    textEN: '`new Set([NaN]).has(NaN) === true`',
                    theoryUK: '**Правильно:** `Set` використовує SameValueZero, отже `NaN` дорівнює `NaN`.',
                    theoryEN: '**Correct:** `Set` uses SameValueZero; `NaN` equals `NaN`.',
                    isCorrect: true
                },
                {
                    textUK: '`[+0].includes(-0) === false`',
                    textEN: '`[+0].includes(-0) === false`',
                    theoryUK: '**Неправильно:** У SameValueZero `+0` та `-0` вважаються однаковими, отже `true`.',
                    theoryEN: '**Incorrect:** In SameValueZero `+0` and `-0` are equal, so it’s `true`.',
                    isCorrect: false
                },
                {
                    textUK: '`[NaN].indexOf(NaN) === -1`',
                    textEN: '`[NaN].indexOf(NaN) === -1`',
                    theoryUK: '**Правильно:** Через використання `===` `NaN` не буде знайдено.',
                    theoryEN: '**Correct:** Because `===` is used, `NaN` won’t be found.',
                    isCorrect: true
                },
                {
                    textUK: '`new Set([+0]).has(-0) === true`',
                    textEN: '`new Set([+0]).has(-0) === true`',
                    theoryUK: '**Правильно:** SameValueZero не розрізняє знак нуля.',
                    theoryEN: '**Correct:** SameValueZero treats `+0` and `-0` as equal.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: '`JSON.stringify` з `NaN` та `Infinity`: що отримаємо у результаті серіалізації (включно з вкладеннями)? Оберіть усі правильні твердження.',
            textEN: '`JSON.stringify` with `NaN` and `Infinity`: what do we get after serialization (including nested values)? Select all correct statements.',
            theoryUK:
                "## Теорія: JSON не підтримує `NaN`/`±Infinity`\n\nСтандарт JSON **не має представлення** для `NaN`, `Infinity`, `-Infinity`. У JavaScript це означає:\n\n- **Як значення полів обʼєкта/елементів масиву** — замінюються на `null`:\n  - `JSON.stringify({ v: NaN }) // '{\"v\":null}'`\n  - `JSON.stringify([Infinity, -Infinity]) // '[null,null]'`\n- **Як кореневе значення** — результатом буде рядок `'null'`:\n  - `JSON.stringify(NaN) === 'null'`\n  - `JSON.stringify(Infinity) === 'null'`\n- **Про `-0`**: формат JSON *дозволяє* запис `-0`, і `JSON.parse('-0')` повертає `-0`. Водночас `JSON.stringify(-0) === '0'`, тому при серіалізації знак **втрачається** (round-trip `stringify → parse`).\n- `structuredClone`/`postMessage` **на відміну від JSON** зберігають `NaN`/`±Infinity`/`-0` без змін.\n- Можна використати **replacer** для власного кодування, якщо важливо уникнути `null`.\n\n> **Висновок:** очікуйте `null` замість `NaN`/`Infinity` у JSON; якщо потрібна точність або збереження `-0` — не використовуйте JSON як транспорт або кодуйте явно.",
            theoryEN:
                "## Theory: JSON does not support `NaN`/`±Infinity`\n\nThe JSON standard **has no representation** for `NaN`, `Infinity`, or `-Infinity`. In JavaScript this means:\n\n- **As object properties/array elements** — they are replaced with `null`:\n  - `JSON.stringify({ v: NaN }) // '{\"v\":null}'`\n  - `JSON.stringify([Infinity, -Infinity]) // '[null,null]'`\n- **As the root value** — the result is the string `'null'`:\n  - `JSON.stringify(NaN) === 'null'`\n  - `JSON.stringify(Infinity) === 'null'`\n- **About `-0`**: the JSON format *allows* `-0`, and `JSON.parse('-0')` yields `-0`. However, `JSON.stringify(-0) === '0'`, so the sign is **lost** during serialization (round-trip `stringify → parse`).\n- `structuredClone`/`postMessage`, **unlike JSON**, preserve `NaN`/`±Infinity`/`-0` as-is.\n- A **replacer** can be used to custom-encode if you need to avoid `null`.\n\n> **Bottom line:** expect `null` in place of `NaN`/`Infinity` in JSON; if precision or `-0` matters, avoid JSON for transport or encode explicitly.",
            answers: [
                {
                    textUK: '`JSON.stringify({ a: NaN })` поверне рядок з `{ "a": null }`',
                    textEN: '`JSON.stringify({ a: NaN })` returns a string with `{ "a": null }`',
                    theoryUK: '**Правильно:** JSON не має представлення для `NaN`, замінює на `null` у значенні поля.',
                    theoryEN: '**Correct:** JSON has no representation for `NaN`, so it’s replaced by `null` in a value position.',
                    isCorrect: true
                },
                {
                    textUK: '`JSON.stringify([Infinity, -Infinity]) === "[null,null]"`',
                    textEN: '`JSON.stringify([Infinity, -Infinity]) === "[null,null]"`',
                    theoryUK: '**Правильно:** Елементи масиву з `±Infinity` стають `null`.',
                    theoryEN: '**Correct:** Array elements with `±Infinity` become `null`.',
                    isCorrect: true
                },
                {
                    textUK: '`JSON.stringify(NaN) === "NaN"`',
                    textEN: '`JSON.stringify(NaN) === "NaN"`',
                    theoryUK: "**Неправильно:** Для кореневого значення отримаєте рядок `'null'`.",
                    theoryEN: "**Incorrect:** As a root value you get the string `'null'`.",
                    isCorrect: false
                },
                {
                    textUK: '`JSON.stringify(-0) === "0"` і після `JSON.parse("0")` знак нуля втрачено',
                    textEN: '`JSON.stringify(-0) === "0"` and after `JSON.parse("0")` the zero sign is lost',
                    theoryUK: '**Правильно:** Текстове представлення, яке емісить `JSON.stringify`, не містить знака нуля.',
                    theoryEN: '**Correct:** The textual form emitted by `JSON.stringify` does not carry the zero sign.',
                    isCorrect: true
                },
                {
                    textUK: '`JSON.stringify({ v: Infinity })` поверне `{ "v": "Infinity" }`',
                    textEN: '`JSON.stringify({ v: Infinity })` returns `{ "v": "Infinity" }`',
                    theoryUK: '**Неправильно:** Не рядок `"Infinity"`, а `null` у полі.',
                    theoryEN: '**Incorrect:** Not the string `"Infinity"`, but `null` in the field.',
                    isCorrect: false
                },
                {
                    textUK: '`structuredClone({ v: NaN }).v` збереже `NaN`, на відміну від JSON',
                    textEN: '`structuredClone({ v: NaN }).v` preserves `NaN`, unlike JSON',
                    theoryUK: '**Правильно:** Алгоритм structured clone зберігає спеціальні числові значення.',
                    theoryEN: '**Correct:** The structured clone algorithm preserves special numeric values.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        }
    ]
};
