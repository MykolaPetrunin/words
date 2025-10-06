import { TopicMock } from '../types';

export const tests: TopicMock = {
    titleUK: 'Object.is vs "==="',
    titleEN: 'Object.is vs "==="',
    questions: [
        {
            textUK: 'Object.is vs ===: теорія та ключові відмінності',
            textEN: 'Object.is vs ===: theory and key differences',
            theoryUK:
                '### Коротко\n`Object.is(a, b)` і `a === b` майже завжди дають однаковий результат, **окрім двох винятків**:\n- `NaN` порівнюється як рівний самому собі: `Object.is(NaN, NaN) === true`, тоді як `NaN === NaN` → `false`.\n- Різниця між підписаними нулями: `Object.is(+0, -0) === false`, тоді як `+0 === -0` → `true`.\n\n> **Примітка:** числовий літерал `0` — це `+0`. Тому `Object.is(0, 0) === true`, а різниця проявляється у порівнянні `0`/`+0` з `-0` (наприклад, `Object.is(0, -0) === false`).\n\n### Алгоритми рівності\n- `Object.is` використовує семантику **SameValue** (ES). Вона **відрізняє** `+0` та `-0` і **вважає `NaN` рівним `NaN`**.\n- `===` використовує **Strict Equality Comparison**. Він **не відрізняє** `+0`/`-0` і **вважає `NaN` нерівним** самому собі.\n\n### Для чого це важливо\n- У перевірках зміни значення (e.g. запобігти зайвим оновленням стану) коректна обробка `NaN` та знаку нуля може бути критичною.\n\n### Узагальнення\n- Для більшості примітивів і всіх посилальних типів (`object`, `function`) результати `Object.is` і `===` **збігаються**.',
            theoryEN:
                '### In short\n`Object.is(a, b)` and `a === b` produce the same result **except in two cases**:\n- `NaN` compares equal to itself with `Object.is(NaN, NaN) === true`, while `NaN === NaN` is `false`.\n- Signed zeros differ: `Object.is(+0, -0) === false`, while `+0 === -0` is `true`.\n\n> **Note:** the numeric literal `0` is `+0`. So `Object.is(0, 0) === true`; the difference appears only when comparing `0`/`+0` to `-0` (e.g., `Object.is(0, -0) === false`).\n\n### Equality algorithms\n- `Object.is` follows **SameValue** semantics (ES). It **distinguishes** `+0` vs `-0` and **treats `NaN` as equal to `NaN`**.\n- `===` uses **Strict Equality Comparison**. It **does not distinguish** `+0`/`-0` and **treats `NaN` as not equal** to itself.\n\n### Why it matters\n- When detecting value changes (e.g., preventing unnecessary state updates), handling `NaN` and the sign of zero correctly can be crucial.\n\n### Summary\n- For most primitives and all reference types (`object`, `function`), `Object.is` and `===` **agree**.',
            answers: [
                {
                    textUK: '`Object.is(NaN, NaN)` повертає `true`, тоді як `NaN === NaN` — `false`.',
                    textEN: '`Object.is(NaN, NaN)` returns `true`, while `NaN === NaN` is `false`.',
                    theoryUK: 'Це саме той виняток, де алгоритми розходяться: **SameValue** вважає `NaN` рівним `NaN`, а **Strict Equality** — ні.',
                    theoryEN: 'This is exactly one of the exceptions: **SameValue** deems `NaN` equal to `NaN`, while **Strict Equality** does not.',
                    isCorrect: true
                },
                {
                    textUK: '`Object.is(+0, -0)` повертає `false`, а `+0 === -0` — `true`.',
                    textEN: '`Object.is(+0, -0)` returns `false`, while `+0 === -0` is `true`.',
                    theoryUK: 'Другий виняток: **SameValue** розрізняє підпис нуля, а **Strict Equality** — ні.',
                    theoryEN: 'The second exception: **SameValue** distinguishes the sign of zero, **Strict Equality** does not.',
                    isCorrect: true
                },
                {
                    textUK: '`Object.is` виконує неявне приведення типів подібно до `==`.',
                    textEN: '`Object.is` performs implicit type coercion like `==`.',
                    theoryUK:
                        '`Object.is` **не виконує** приведення типів — це строга перевірка без коерції. Плутанина виникає з оператором `==`, який дійсно може приводити типи.',
                    theoryEN: "`Object.is` **does not** coerce types—it is a strict, no-coercion check. You're confusing it with `==`, which does coerce.",
                    isCorrect: false
                },
                {
                    textUK: 'Для об’єктів `Object.is(a, b)` і `a === b` збігаються: вони повернуть `true` лише якщо це **те саме** посилання.',
                    textEN: 'For objects, `Object.is(a, b)` and `a === b` agree: they return `true` only if both are the **same** reference.',
                    theoryUK: 'Обидва алгоритми для посилальних типів перевіряють ідентичність посилання, без глибокого порівняння.',
                    theoryEN: 'Both checks use reference identity for objects; no deep comparison is performed.',
                    isCorrect: true
                },
                {
                    textUK: '`Object.is(0, 0)` і `0 === 0` поводяться по-різному.',
                    textEN: '`Object.is(0, 0)` and `0 === 0` behave differently.',
                    theoryUK: 'Неправда. Вони обидва повертають `true`. Різниця лише при `+0` vs `-0`.',
                    theoryEN: 'False. Both return `true`. The difference appears only for `+0` vs `-0`.',
                    isCorrect: false
                },
                {
                    textUK: "`Object.is('a', 'a')` може відрізнятися від `'a' === 'a'` через інтернування рядків.",
                    textEN: "`Object.is('a', 'a')` can differ from `'a' === 'a'` due to string interning.",
                    theoryUK: 'Ні. Для примітивних рядків обидва повернуть `true`; інтернування тут не змінює семантику порівняння.',
                    theoryEN: 'No. For primitive strings both return `true`; interning does not alter the equality semantics here.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Які вирази обчислюються як `true`? (Object.is vs === у практиці)',
            textEN: 'Which expressions evaluate to `true`? (Object.is vs === in practice)',
            theoryUK:
                '### Пояснення до прикладів\nРозглянемо зразкові вирази і застосуємо правила з попереднього питання:\n- `NaN`: `Object.is(NaN, NaN) === true`, `NaN === NaN` → `false`.\n- Підписані нулі: `Object.is(+0, -0) === false`, тоді як `+0 === -0` → `true`.\n- Посилання на масиви/об’єкти: нові літерали створюють **різні посилання** → і `Object.is([], [])`, і `[] === []` → `false`.\n- Тотожні посилання: якщо змінні посилаються на **той самий об’єкт**, обидва методи дають `true`.\n- Примітиви однакові за значенням (числа, рядки, булі) → обидва методи повертають `true` (окрім `NaN`, `+0/-0`).',
            theoryEN:
                '### Explanation of the examples\nApply the rules from the previous question:\n- `NaN`: `Object.is(NaN, NaN) === true`, while `NaN === NaN` → `false`.\n- Signed zeros: `Object.is(+0, -0) === false`, but `+0 === -0` → `true`.\n- Array/object literals: new literals create **distinct references** → both `Object.is([], [])` and `[] === []` are `false`.\n- Same reference: if variables point to the **same object**, both checks return `true`.\n- Equal primitives (numbers, strings, booleans) → both return `true` (except `NaN`, `+0/-0`).',
            answers: [
                {
                    textUK: "```js\nObject.is(NaN, Number('oops'))\n```",
                    textEN: "```js\nObject.is(NaN, Number('oops'))\n```",
                    theoryUK: "`Number('oops')` дає `NaN`. `Object.is(NaN, NaN)` → `true`.",
                    theoryEN: "`Number('oops')` yields `NaN`. `Object.is(NaN, NaN)` → `true`.",
                    isCorrect: true
                },
                {
                    textUK: '```js\nNaN === NaN\n```',
                    textEN: '```js\nNaN === NaN\n```',
                    theoryUK: 'За **Strict Equality** `NaN` **ніколи** не дорівнює самому собі → `false`.',
                    theoryEN: 'Under **Strict Equality**, `NaN` is **never** equal to itself → `false`.',
                    isCorrect: false
                },
                {
                    textUK: '```js\nObject.is(+0, -0)\n```',
                    textEN: '```js\nObject.is(+0, -0)\n```',
                    theoryUK: '**SameValue** розрізняє знак нуля → `false`.',
                    theoryEN: '**SameValue** distinguishes the sign of zero → `false`.',
                    isCorrect: false
                },
                {
                    textUK: '```js\n+0 === -0\n```',
                    textEN: '```js\n+0 === -0\n```',
                    theoryUK: '**Strict Equality** не розрізняє знак нуля → `true`.',
                    theoryEN: '**Strict Equality** does not distinguish the sign of zero → `true`.',
                    isCorrect: true
                },
                {
                    textUK: '```js\nconst a = [];\nconst b = [];\nObject.is(a, b)\n```',
                    textEN: '```js\nconst a = [];\nconst b = [];\nObject.is(a, b)\n```',
                    theoryUK: 'Два різні літерали масиву → різні посилання → `false`.',
                    theoryEN: 'Two different array literals → different references → `false`.',
                    isCorrect: false
                },
                {
                    textUK: '```js\nconst a = { x: 1 };\nconst b = a;\na === b\n```',
                    textEN: '```js\nconst a = { x: 1 };\nconst b = a;\na === b\n```',
                    theoryUK: 'Обидві змінні посилаються на **той самий об’єкт** → `true`.',
                    theoryEN: 'Both variables point to the **same object** → `true`.',
                    isCorrect: true
                },
                {
                    textUK: "```js\nObject.is('foo', 'foo')\n```",
                    textEN: "```js\nObject.is('foo', 'foo')\n```",
                    theoryUK: 'Однакові примітивні рядки → `true`.',
                    theoryEN: 'Identical primitive strings → `true`.',
                    isCorrect: true
                },
                {
                    textUK: '```js\n[] === []\n```',
                    textEN: '```js\n[] === []\n```',
                    theoryUK: 'Різні літерали → різні посилання → `false`.',
                    theoryEN: 'Distinct literals → distinct references → `false`.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Коли краще використовувати Object.is замість ===?',
            textEN: 'When should you prefer Object.is over ===?',
            theoryUK:
                '### Принцип вибору\nВикористовуйте `Object.is`, коли **критично відрізняти** `+0` від `-0` або **вважати `NaN` рівним `NaN`**. У звичайних випадках `===` достатньо і читається звичніше.\n\n### Типові сценарії\n- **Виявлення зміни значення** (change detection), де `NaN` має вважатися «тим самим» значенням, а `+0`/`-0` — різними.\n- **Реалізація користувацької рівності** (e.g. `shallowEqual` для примітивів), де потрібна семантика **SameValue**.\n\n### Коли не потрібно\n- Для глибокого порівняння об’єктів: ні `Object.is`, ні `===` не роблять deep-equal.\n- Коли різниця `+0`/`-0` і особливість `NaN` **неважливі** — `===` простіший.',
            theoryEN:
                '### Selection principle\nUse `Object.is` when it is **critical to distinguish** `+0` from `-0` or to **treat `NaN` as equal to `NaN`**. In regular cases, `===` is sufficient and more conventional.\n\n### Common scenarios\n- **Change detection**, where `NaN` should be regarded as “the same” value and `+0`/`-0` should be considered different.\n- **Custom equality** (e.g., `shallowEqual` for primitives) that requires **SameValue** semantics.\n\n### When not to\n- For deep object comparison: neither `Object.is` nor `===` provides deep-equal.\n- When `+0`/`-0` and `NaN` peculiarities **don’t matter** — `===` is simpler.',
            answers: [
                {
                    textUK: 'У детекторі змін значення, щоб `NaN` вважався незмінним (рівним самому собі).',
                    textEN: 'In a change-detection check to treat `NaN` as unchanged (equal to itself).',
                    theoryUK: '`Object.is(NaN, NaN) === true`, тому перевірка «зміни» не спрацює хибно при переході `NaN → NaN`.',
                    theoryEN: '`Object.is(NaN, NaN) === true`, so a “changed” check won’t falsely trigger on `NaN → NaN`.',
                    isCorrect: true
                },
                {
                    textUK: 'Коли важливо розрізняти `+0` і `-0` (наприклад, у чисельних алгоритмах).',
                    textEN: 'When distinguishing `+0` and `-0` matters (e.g., in numeric algorithms).',
                    theoryUK: '`Object.is(+0, -0) === false`, що дозволяє виявити зміну знаку нуля.',
                    theoryEN: '`Object.is(+0, -0) === false`, enabling detection of sign changes in zero.',
                    isCorrect: true
                },
                {
                    textUK: 'Для глибокого порівняння двох об’єктів.',
                    textEN: 'For deep comparison of two objects.',
                    theoryUK: 'Ні `Object.is`, ні `===` не виконують deep-equal; обидва перевіряють лише **ідентичність посилань** для об’єктів.',
                    theoryEN: 'Neither `Object.is` nor `===` performs deep-equal; both only check **reference identity** for objects.',
                    isCorrect: false
                },
                {
                    textUK: 'Щоб отримати поведінку як у `==` з неявним приведенням типів, але без пасток.',
                    textEN: 'To get `==`-like behavior with implicit coercion but without pitfalls.',
                    theoryUK: '`Object.is` **не** робить коерції. Це інша, строга семантика (SameValue), не аналог `==`.',
                    theoryEN: '`Object.is` does **not** coerce. It’s a strict SameValue semantics, not a safer `==`.',
                    isCorrect: false
                },
                {
                    textUK: 'Під час реалізації власної функції рівності примітивів із семантикою SameValue.',
                    textEN: 'When implementing a custom primitive equality function with SameValue semantics.',
                    theoryUK: 'Це саме задача для `Object.is`: правильна обробка `NaN` і підписаних нулів.',
                    theoryEN: 'This is exactly where `Object.is` shines: correct handling of `NaN` and signed zeros.',
                    isCorrect: true
                },
                {
                    textUK: 'Завжди замінювати `===` на `Object.is`, бо останній швидший.',
                    textEN: 'Always replace `===` with `Object.is` because it is faster.',
                    theoryUK: 'Швидкодія залежить від середовища; головне — **семантична різниця**, а не універсальна «швидкість».',
                    theoryEN: 'Performance depends on the environment; the key is **semantic difference**, not universal “speed”.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'SameValue vs Strict Equality vs SameValueZero: коли що використовується і чим відрізняються',
            textEN: 'SameValue vs Strict Equality vs SameValueZero: when each is used and how they differ',
            theoryUK:
                '### Карта семантик рівності в JS\nУ стандарті ECMAScript існують **три близькі, але різні** семантики рівності:\n\n1. **Strict Equality (===)**\n   - Без приведення типів.\n   - **Не** розрізняє `+0` і `-0` (обидва рівні).\n   - Вважає `NaN` **нерівним** самому собі.\n   - Приклади використання: оператор `===`, `!==`.\n\n2. **SameValue** (на ній базується `Object.is`)\n   - Без приведення типів.\n   - **Розрізняє** `+0` і `-0` (`Object.is(+0, -0) === false`).\n   - Вважає `NaN` **рівним** `NaN`.\n   - Приклади: **`Object.is`**, внутрішні перевірки тотожності.\n\n3. **SameValueZero**\n   - Як **SameValue**, **але** **не** розрізняє `+0`/`-0` **і** вважає `NaN` рівним `NaN`.\n   - Приклади використання в стандартних API:\n     - `Array.prototype.includes` (знайде `NaN`).\n     - `Map`/`Set` для порівняння ключів/значень (ключ `NaN` працює очікувано).\n\n### Чому це важливо\n- Різні API вбудованої бібліотеки мають **різну** семантику рівності. Якщо ви очікуєте, що `NaN` або знак нуля буде важливим — **обирайте правильний інструмент** (`Object.is` або API з SameValueZero).\n\n### Узагальнення\n- `===` зручний за замовчуванням, але **помилиться** на `NaN` та **не відрізнить** `+0`/`-0`.\n- `Object.is` дає більш «математично очікувану» поведінку для `NaN` та підписаних нулів.\n- `includes`, `Map`, `Set` працюють за **SameValueZero**: знаходять `NaN`, а `+0`/`-0` вважають однаковими.',
            theoryEN:
                '### Equality semantics in JS\nThere are **three** closely related equality semantics in ECMAScript:\n\n1. **Strict Equality (===)**\n   - No type coercion.\n   - Does **not** distinguish `+0` and `-0` (they are equal).\n   - Treats `NaN` as **not equal** to itself.\n   - Used by the `===`/`!==` operators.\n\n2. **SameValue** (what `Object.is` implements)\n   - No type coercion.\n   - **Does** distinguish `+0` and `-0`.\n   - Treats `NaN` as **equal** to `NaN`.\n   - Used by **`Object.is`** and some internal identity checks.\n\n3. **SameValueZero**\n   - Like SameValue **but** does **not** distinguish `+0`/`-0` **and** considers `NaN` equal to `NaN`.\n   - Used by:\n     - `Array.prototype.includes` (will find `NaN`).\n     - `Map`/`Set` key/value comparisons.\n\n### Why it matters\n- Different built-ins rely on **different** equality semantics. If `NaN` or signed zeros matter, **choose the right tool** (`Object.is` or an API using SameValueZero).\n\n### Summary\n- `===` is fine by default, but **fails** on `NaN` and **doesn’t distinguish** `+0`/`-0`.\n- `Object.is` gives the "mathematically expected" behavior for `NaN` and signed zeros.\n- `includes`, `Map`, `Set` use **SameValueZero**: they find `NaN` and treat `+0`/`-0` as the same.',
            answers: [
                {
                    textUK: '`Array.prototype.includes(NaN)` повертає `true`, бо використовує SameValueZero.',
                    textEN: '`Array.prototype.includes(NaN)` returns `true` because it uses SameValueZero.',
                    theoryUK: '`includes` базується на SameValueZero: `NaN` дорівнює `NaN`, `+0` і `-0` не розрізняються.',
                    theoryEN: '`includes` relies on SameValueZero: `NaN` equals `NaN`, and `+0`/`-0` are not distinguished.',
                    isCorrect: true
                },
                {
                    textUK: '`Array.prototype.indexOf(NaN)` поверне індекс `NaN`, бо використовує SameValue.',
                    textEN: '`Array.prototype.indexOf(NaN)` returns the index of `NaN` because it uses SameValue.',
                    theoryUK: 'Помилка: `indexOf` використовує **Strict Equality** (`===`), тож `NaN` не буде знайдено → результат `-1`.',
                    theoryEN: 'Incorrect: `indexOf` uses **Strict Equality** (`===`), so `NaN` is not found → result `-1`.',
                    isCorrect: false
                },
                {
                    textUK: '`Map` використовує SameValueZero для порівняння ключів, тому ключ `NaN` працює як очікується.',
                    textEN: '`Map` uses SameValueZero for key comparison, so a `NaN` key works as expected.',
                    theoryUK: 'Так: у `Map`/`Set` `NaN` вважається рівним `NaN`, а `+0`/`-0` — однакові.',
                    theoryEN: 'Yes: in `Map`/`Set` `NaN` equals `NaN`, and `+0`/`-0` are treated the same.',
                    isCorrect: true
                },
                {
                    textUK: '`Object.is` реалізує Strict Equality, але з додатковою підтримкою `NaN`.',
                    textEN: '`Object.is` implements Strict Equality, but with added support for `NaN`.',
                    theoryUK: 'Неточно: `Object.is` реалізує **SameValue**, а не Strict Equality. Вона також **відрізняє** `+0`/`-0`.',
                    theoryEN: 'Not accurate: `Object.is` implements **SameValue**, not Strict Equality, and it **distinguishes** `+0`/`-0`.',
                    isCorrect: false
                },
                {
                    textUK: 'У `includes` `+0` і `-0` вважаються однаковими, але в `Object.is` — різними.',
                    textEN: 'In `includes`, `+0` and `-0` are considered the same, but in `Object.is` they are different.',
                    theoryUK: 'Так, це і є відмінність **SameValueZero** vs **SameValue**.',
                    theoryEN: 'Correct—this is exactly **SameValueZero** vs **SameValue**.',
                    isCorrect: true
                },
                {
                    textUK: 'Оператор `===` знаходить `NaN` у масиві так само, як `includes`.',
                    textEN: 'The `===` operator finds `NaN` in an array just like `includes`.',
                    theoryUK: 'Ні. `===` ніколи не вважає `NaN` рівним `NaN`, тому `indexOf`/ручні перевірки з `===` не знайдуть `NaN`.',
                    theoryEN: 'No. `===` never considers `NaN` equal to itself, so `indexOf`/manual checks using `===` won’t find `NaN`.',
                    isCorrect: false
                }
            ],
            level: 'senior'
        },
        {
            textUK: 'Глибокі edge-кейси: підписані нулі, NaN, обгортки-примітиви та Symbol',
            textEN: 'Deep edge cases: signed zeros, NaN, wrapper primitives, and Symbol',
            theoryUK:
                "### Практичні пастки й нюанси\n- **Підписані нулі**: `Object.is(+0, -0) === false`, але `+0 === -0` → `true`. Виявити `-0` можна через `1/x === -Infinity`.\n- **NaN**: лише `Object.is(NaN, NaN)` → `true`. `===` завжди дає `false` для `NaN`.\n- **Примітив проти об'єктної обгортки**: порівняння примітива та `new Number(...)` — **різні типи** → обидва підходи повернуть `false`.\n- **Різні об'єктні екземпляри**: навіть із тим самим значенням усередині — **різні посилання** → `false` і для `===`, і для `Object.is`.\n- **Symbol**: `Symbol('x') !== Symbol('x')` (кожен виклик створює новий унікальний символ). `Symbol.for('x')` повертає **той самий** символ між викликами — і `===`, і `Object.is` дадуть `true`.\n\n### Порада\n- Коли важлива **математика чисел** (знак нуля, `NaN`) — використовуйте `Object.is`.\n- Для посилань на об'єкти пам'ятайте: обидва перевіряють **ідентичність посилання**, не значення всередині.",
            theoryEN:
                "### Practical pitfalls and nuances\n- **Signed zeros**: `Object.is(+0, -0) === false`, while `+0 === -0` → `true`. Detect `-0` via `1/x === -Infinity`.\n- **NaN**: only `Object.is(NaN, NaN)` → `true`. `===` always yields `false` for `NaN`.\n- **Primitive vs wrapper object**: comparing a primitive to `new Number(...)` are **different types** → both checks return `false`.\n- **Distinct object instances**: even with the same internal value — **different references** → `false` for both `===` and `Object.is`.\n- **Symbol**: `Symbol('x') !== Symbol('x')` (each call is unique). `Symbol.for('x')` returns the **same** symbol across calls — both `===` and `Object.is` return `true`.\n\n### Tip\n- When numeric **math details** matter (zero sign, `NaN`) — prefer `Object.is`.\n- For objects, remember both checks use **reference identity**, not deep value equality.",
            answers: [
                {
                    textUK: '```js\nObject.is(new Number(NaN), new Number(NaN))\n```',
                    textEN: '```js\nObject.is(new Number(NaN), new Number(NaN))\n```',
                    theoryUK: "Два різні об'єкти → різні посилання → `false`, навіть якщо всередині `NaN`.",
                    theoryEN: 'Two different objects → different references → `false`, even if both wrap `NaN`.',
                    isCorrect: false
                },
                {
                    textUK: '```js\nObject.is(Object(0), 0)\n```',
                    textEN: '```js\nObject.is(Object(0), 0)\n```',
                    theoryUK: "`Object(0)` — це **об'єкт `Number`**, а `0` — **примітив**; різні типи → `false` для `Object.is` і для `===`.",
                    theoryEN: '`Object(0)` is a **Number object**, `0` is a **primitive**; different types → `false` for both `Object.is` and `===`.',
                    isCorrect: false
                },
                {
                    textUK: "```js\nObject.is(Symbol.for('id'), Symbol.for('id'))\n```",
                    textEN: "```js\nObject.is(Symbol.for('id'), Symbol.for('id'))\n```",
                    theoryUK: '`Symbol.for` повертає **той самий** символ із глобального реєстру → `true` (так само й `===`).',
                    theoryEN: '`Symbol.for` returns the **same** symbol from the global registry → `true` (same for `===`).',
                    isCorrect: true
                },
                {
                    textUK: "```js\nObject.is(Symbol('x'), Symbol('x'))\n```",
                    textEN: "```js\nObject.is(Symbol('x'), Symbol('x'))\n```",
                    theoryUK: "Кожен виклик `Symbol('x')` створює **новий** символ → `false` (так само й `===`).",
                    theoryEN: "Each call to `Symbol('x')` creates a **new** unique symbol → `false` (same for `===`).",
                    isCorrect: false
                },
                {
                    textUK: '```js\nconst x = -0;\nObject.is(1 / x, -Infinity)\n```',
                    textEN: '```js\nconst x = -0;\nObject.is(1 / x, -Infinity)\n```',
                    theoryUK: 'Ділення `1 / -0` дає `-Infinity`. Це спосіб виявити `-0`. Вираз поверне `true`.',
                    theoryEN: 'Dividing `1 / -0` yields `-Infinity`. This detects `-0`. The expression returns `true`.',
                    isCorrect: true
                },
                {
                    textUK: '```js\n[NaN].indexOf(NaN) !== -1\n```',
                    textEN: '```js\n[NaN].indexOf(NaN) !== -1\n```',
                    theoryUK: '`indexOf` використовує `===`, тож `NaN` не буде знайдено → вираз поверне `false`.',
                    theoryEN: "`indexOf` uses `===`, so `NaN` won't be found → the expression evaluates to `false`.",
                    isCorrect: false
                },
                {
                    textUK: '```js\n[0].includes(-0)\n```',
                    textEN: '```js\n[0].includes(-0)\n```',
                    theoryUK: '`includes` використовує SameValueZero, де `+0` і `-0` однакові → `true`.',
                    theoryEN: '`includes` uses SameValueZero, where `+0` and `-0` are the same → `true`.',
                    isCorrect: true
                },
                {
                    textUK: '```js\nconst a = {};\nconst b = {};\nObject.is(a, b)\n```',
                    textEN: '```js\nconst a = {};\nconst b = {};\nObject.is(a, b)\n```',
                    theoryUK: "Різні об'єкти (різні посилання) → `false`. Ні `Object.is`, ні `===` не роблять глибокого порівняння.",
                    theoryEN: 'Different objects (different references) → `false`. Neither `Object.is` nor `===` does deep equality.',
                    isCorrect: false
                }
            ],
            level: 'senior'
        }
    ]
};
