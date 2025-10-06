import { TopicMock } from '../types';

export const tests: TopicMock = {
    titleUK: 'Логічні оператори (&&, ||, ??, ?.)',
    titleEN: 'Logical operators (&&, ||, ??, ?.)',
    questions: [
        {
            textUK: 'Логічний оператор && з різними типами: яке твердження правильне?',
            textEN: 'Logical operator && with different types: which statement is correct?',
            theoryUK:
                "### Теорія: як працює `&&` у JavaScript\n\nОператор `&&` **не** повертає обовʼязково `true/false`. Він повертає **один з операндів**:\n- Якщо перший операнд є *falsy* (`false, 0, -0, 0n, NaN, '', null, undefined`), результатом буде **цей перший операнд** (коротке замикання – правий не обчислюється).\n- Якщо перший операнд *truthy*, оператор повертає **другий операнд** (який може бути будь-чим — значенням або результатом виразу).\n\n> Отже, `a && b` еквівалентно: «якщо `a` truthy, поверни `b`; інакше поверни `a`». Це важливо для ланцюжків: `a && b && c` дає перший *falsy* або останній *truthy*.\n\n**Жодного неявного перетворення до булевого для результату не відбувається** (булева оцінка виконується лише як частина логіки вибору гілки). Тому, наприклад, `{} && []` поверне `[]`, а `0 && 'x'` поверне `0`.\n\nТакож `&&` **коротко замикає** (short-circuit): якщо перша частина вже визначає результат, друга **не виконується** (це критично при виклику функцій з побічними ефектами).\n",
            theoryEN:
                "### Theory: how `&&` works in JavaScript\n\nThe `&&` operator **does not** necessarily return `true/false`. It returns **one of its operands**:\n- If the left operand is *falsy* (`false, 0, -0, 0n, NaN, '', null, undefined`), the result is **that left operand** (short-circuit – the right side is not evaluated).\n- If the left operand is *truthy*, the operator returns **the right operand** (whatever it is — a value or an expression result).\n\n> So `a && b` is effectively: “if `a` is truthy, return `b`; otherwise return `a`”. In chains like `a && b && c`, you get the first *falsy* value or the last *truthy*.\n\n**No implicit boolean conversion is applied to the result** (only to decide branching). For example, `{} && []` returns `[]`, and `0 && 'x'` returns `0`.\n\nAlso, `&&` **short-circuits**: if the left side already determines the outcome, the right side **is not executed** (critical when the right side has side effects).\n",
            answers: [
                {
                    textUK: '`&&` повертає перший *falsy* операнд, або якщо його немає — останній операнд.',
                    textEN: '`&&` returns the first *falsy* operand, or if there is none — the last operand.',
                    theoryUK:
                        '✅ **Вірно.** Саме так формулюється результат для ланцюжків: `a && b` → якщо `a` *falsy*, повертає `a`; інакше повертає `b`. У загальному випадку для `a && b && c` отримаємо перший *falsy* або останній (правий) операнд, якщо всі truthy.',
                    theoryEN:
                        "✅ **Correct.** That's the accurate rule for chains: `a && b` → if `a` is *falsy*, return `a`; otherwise return `b`. In general for `a && b && c` you get the first *falsy* or the last (rightmost) operand when all are truthy.",
                    isCorrect: true
                },
                {
                    textUK: '`&&` завжди повертає булеве значення (`true/false`).',
                    textEN: '`&&` always returns a boolean (`true/false`).',
                    theoryUK: '❌ **Хибно.** На відміну від мов на кшталт C#, у JS оператори `&&`/`||` повертають **операнди**, а не обовʼязково булеві значення.',
                    theoryEN: '❌ **Incorrect.** Unlike some languages (e.g., C#), JS `&&`/`||` return **operands**, not necessarily boolean values.',
                    isCorrect: false
                },
                {
                    textUK: '`a && b` спочатку завжди обчислює `b`, а вже потім вирішує результат.',
                    textEN: '`a && b` always evaluates `b` first and only then decides the result.',
                    theoryUK: '❌ **Хибно.** Є коротке замикання: якщо `a` *falsy*, `b` **не** обчислюється зовсім.',
                    theoryEN: '❌ **Incorrect.** Short-circuiting applies: if `a` is *falsy*, `b` is **not** evaluated at all.',
                    isCorrect: false
                },
                {
                    textUK: "`0 && 'x'` повертає `'x'`, бо `0` конвертується у `true` при `&&`.",
                    textEN: "`0 && 'x'` returns `'x'` because `0` is converted to `true` under `&&`.",
                    theoryUK: "❌ **Хибно.** `0` — *falsy*, отже `0 && 'x'` коротко замикає й повертає **`0`**.",
                    theoryEN: "❌ **Incorrect.** `0` is *falsy*, so `0 && 'x'` short-circuits and returns **`0`**.",
                    isCorrect: false
                },
                {
                    textUK: '`{} && []` повертає `true`, бо обидва операнди truthy.',
                    textEN: '`{} && []` returns `true` because both operands are truthy.',
                    theoryUK: '❌ **Хибно.** І `{}` і `[]` — truthy, але `&&` поверне **другий операнд** → `[]`, а не булеве `true`.',
                    theoryEN: '❌ **Incorrect.** Both `{}` and `[]` are truthy, but `&&` returns the **right operand** → `[]`, not boolean `true`.',
                    isCorrect: false
                },
                {
                    textUK: "`NaN && 'ok'` повертає `'ok'`, бо `NaN` прирівнюється до `true` у логіці.",
                    textEN: "`NaN && 'ok'` returns `'ok'` because `NaN` is treated as `true` in logic.",
                    theoryUK: '❌ **Хибно.** `NaN` — *falsy*, отже повернеться **`NaN`**.',
                    theoryEN: '❌ **Incorrect.** `NaN` is *falsy*, so the result is **`NaN`**.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Short-circuiting у `&&` і `||`: що буде в консолі та яке значення матиме `count`?',
            textEN: 'Short-circuiting with `&&` and `||`: what will be logged and what will `count` become?',
            theoryUK:
                "### Теорія: коротке замикання у `&&` та `||`\n\n- `a && b` **не** обчислює `b`, якщо `a` *falsy* (результат вже відомий: *falsy* → повертаємо `a`). Якщо `a` *truthy*, `b` **обчислюється** і повертається його значення.\n- `a || b` **не** обчислює `b`, якщо `a` *truthy* (результат вже truthy → повертаємо `a`). Якщо `a` *falsy*, `b` **обчислюється** і повертається його значення.\n\nЦе означає, що функції праворуч можуть **не викликатися**. Використання побічних ефектів (наприклад, інкремент змінної) добре демонструє коротке замикання.\n\nРозглянемо код:\n```js\nlet count = 0;\nconst inc = () => { count++; console.log('inc'); return true; };\nconst fail = () => { console.log('fail'); return false; };\n\nconsole.log( 0 && inc() );      // A\nconsole.log( 1 || fail() );     // B\nconsole.log( false || inc() );  // C\nconsole.log( true && fail() );  // D\n```\n- A: `0 && inc()` → `0` *falsy*, отже `inc()` **не** викличеться.\n- B: `1 || fail()` → `1` *truthy*, `fail()` **не** викличеться.\n- C: `false || inc()` → `false` *falsy*, отже викличеться `inc()` і поверне `true`.\n- D: `true && fail()` → `true` *truthy*, отже викличеться `fail()` і поверне `false`.\n\nПісля цього виклики `inc()` трапляться **один раз** (у C), `fail()` — **один раз** (у D).",
            theoryEN:
                "### Theory: short-circuiting in `&&` and `||`\n\n- `a && b` does **not** evaluate `b` when `a` is *falsy* (result is already determined: *falsy* → return `a`). If `a` is *truthy*, `b` **is** evaluated and returned.\n- `a || b` does **not** evaluate `b` when `a` is *truthy* (result is already truthy → return `a`). If `a` is *falsy*, `b` **is** evaluated and returned.\n\nThus right-hand functions may **not be called**. Side effects (like incrementing a variable) clearly expose short-circuiting.\n\nConsider the code:\n```js\nlet count = 0;\nconst inc = () => { count++; console.log('inc'); return true; };\nconst fail = () => { console.log('fail'); return false; };\n\nconsole.log( 0 && inc() );      // A\nconsole.log( 1 || fail() );     // B\nconsole.log( false || inc() );  // C\nconsole.log( true && fail() );  // D\n```\n- A: `0 && inc()` → `0` is *falsy*, so `inc()` **won't** run.\n- B: `1 || fail()` → `1` is *truthy*, so `fail()` **won't** run.\n- C: `false || inc()` → left is *falsy*, so `inc()` **runs** and returns `true`.\n- D: `true && fail()` → left is *truthy*, so `fail()` **runs** and returns `false`.\n\nSo `inc()` is called **once** (in C) and `fail()` is called **once** (in D).",
            answers: [
                {
                    textUK: 'Логи: A→0, B→1, C→true, D→false; `count` дорівнює 1.',
                    textEN: 'Logs: A→0, B→1, C→true, D→false; `count` equals 1.',
                    theoryUK: '✅ **Вірно.** `inc()` викликано лише у C, тому один інкремент → `count = 1`. `fail()` викликано у D, але він не змінює `count`.',
                    theoryEN: '✅ **Correct.** `inc()` is invoked only in C, so one increment → `count = 1`. `fail()` runs in D but does not affect `count`.',
                    isCorrect: true
                },
                {
                    textUK: 'Логи: A→undefined, B→1, C→true, D→false; `count` дорівнює 2.',
                    textEN: 'Logs: A→undefined, B→1, C→true, D→false; `count` equals 2.',
                    theoryUK: '❌ **Хибно.** В A повертається саме `0`, а не `undefined`. Також `inc()` викликається лише один раз (у C), тож `count` не може бути 2.',
                    theoryEN: '❌ **Incorrect.** In A the result is `0`, not `undefined`. Also `inc()` runs only once (in C), so `count` cannot be 2.',
                    isCorrect: false
                },
                {
                    textUK: 'Логи: A→0, B→1, C→true, D→true; `count` дорівнює 1.',
                    textEN: 'Logs: A→0, B→1, C→true, D→true; `count` equals 1.',
                    theoryUK: '❌ **Хибно.** У D викликається `fail()` і повертає **`false`**, не `true`.',
                    theoryEN: '❌ **Incorrect.** In D `fail()` is called and returns **`false`**, not `true`.',
                    isCorrect: false
                },
                {
                    textUK: 'Логи: A→0, B→1, C→true, D→false; `count` дорівнює 0.',
                    textEN: 'Logs: A→0, B→1, C→true, D→false; `count` equals 0.',
                    theoryUK: '❌ **Хибно.** `inc()` було викликано у C, тому `count` став 1.',
                    theoryEN: '❌ **Incorrect.** `inc()` is called in C, so `count` becomes 1.',
                    isCorrect: false
                },
                {
                    textUK: 'Логи: A→0, B→1, C→true, D→false; `count` дорівнює 2, бо `inc()` викликається у A та C.',
                    textEN: 'Logs: A→0, B→1, C→true, D→false; `count` equals 2 because `inc()` runs in A and C.',
                    theoryUK: '❌ **Хибно.** У A `0 && inc()` коротко замикає, тож `inc()` **не** викликається.',
                    theoryEN: '❌ **Incorrect.** In A `0 && inc()` short-circuits, so `inc()` **does not** run.',
                    isCorrect: false
                },
                {
                    textUK: 'Логи: A→0, B→true, C→true, D→false; `count` дорівнює 1.',
                    textEN: 'Logs: A→0, B→true, C→true, D→false; `count` equals 1.',
                    theoryUK: '❌ **Хибно.** Вираз `1 || fail()` повертає **`1`**, а не `true`, бо `||` повертає операнд.',
                    theoryEN: '❌ **Incorrect.** The expression `1 || fail()` returns **`1`**, not `true`, because `||` returns an operand.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: "Повернення значення, а не булевого: чим є результат виразу `('' || 0) && 'x'`?",
            textEN: "Returning a value, not a boolean: what is the result of `('' || 0) && 'x'`?",
            theoryUK:
                "### Теорія: `&&` та `||` повертають операнди, не булі\n\n1) Спочатку обчислимо `'' || 0`:\n- `''` — *falsy*, тому `'' || 0` повертає **другий операнд** → `0` (коротке замикання у `||`).\n\n2) Тепер маємо `0 && 'x'`:\n- `0` — *falsy*, тому `0 && 'x'` коротко замикає і повертає **лівий операнд** → `0`.\n\nУ підсумку вираз повертає **`0`**, а **не** `false` чи `true`. Це типовий приклад, що `&&`/`||` повертають **значення**, а не просто булеві результати. Якщо потрібне булеве, використовуйте явне перетворення: `Boolean(expr)` або подвійне заперечення `!!expr`.\n",
            theoryEN:
                "### Theory: `&&` and `||` return operands, not booleans\n\n1) First evaluate `'' || 0`:\n- `''` is *falsy*, so `'' || 0` returns the **right operand** → `0` (short-circuiting in `||`).\n\n2) Now evaluate `0 && 'x'`:\n- `0` is *falsy*, so `0 && 'x'` short-circuits and returns the **left operand** → `0`.\n\nTherefore the whole expression evaluates to **`0`**, **not** `false` or `true`. This illustrates that `&&`/`||` return **values**, not boolean results. If you need a boolean, use an explicit coercion: `Boolean(expr)` or the double-bang `!!expr`.\n",
            answers: [
                {
                    textUK: '`0`',
                    textEN: '`0`',
                    theoryUK: "✅ **Вірно.** `'' || 0` → `0`; далі `0 && 'x'` → `0` через *falsy* зліва.",
                    theoryEN: "✅ **Correct.** `'' || 0` → `0`; then `0 && 'x'` → `0` because the left side is *falsy*.",
                    isCorrect: true
                },
                {
                    textUK: "`'x'`",
                    textEN: "`'x'`",
                    theoryUK: "❌ **Хибно.** До `&&` доходить `0 && 'x'`; *falsy* зліва зупиняє обчислення і повертає `0`, не `'x'`.",
                    theoryEN: "❌ **Incorrect.** The `&&` sees `0 && 'x'`; the *falsy* left side stops evaluation and returns `0`, not `'x'`.",
                    isCorrect: false
                },
                {
                    textUK: '`true`',
                    textEN: '`true`',
                    theoryUK: '❌ **Хибно.** `&&`/`||` не повертають обовʼязково булеві. Результат — один з операндів, тут це `0`.',
                    theoryEN: "❌ **Incorrect.** `&&`/`||` don't necessarily return booleans. The result is one of the operands, here `0`.",
                    isCorrect: false
                },
                {
                    textUK: '`false`',
                    textEN: '`false`',
                    theoryUK: '❌ **Хибно.** Хоча `0` є *falsy*, але результат — саме число `0`, а не булеве `false`.',
                    theoryEN: '❌ **Incorrect.** While `0` is *falsy*, the actual result is the number `0`, not boolean `false`.',
                    isCorrect: false
                },
                {
                    textUK: '`undefined`',
                    textEN: '`undefined`',
                    theoryUK: "❌ **Хибно.** Жодна частина виразу не дає `undefined`: `'' || 0` → `0`, `0 && 'x'` → `0`.",
                    theoryEN: "❌ **Incorrect.** No part of the expression yields `undefined`: `'' || 0` → `0`, `0 && 'x'` → `0`.",
                    isCorrect: false
                },
                {
                    textUK: "`''` (порожній рядок)",
                    textEN: "`''` (empty string)",
                    theoryUK: "❌ **Хибно.** `'' || 0` вже повертає `0`, тобто порожній рядок не проходить далі.",
                    theoryEN: "❌ **Incorrect.** `'' || 0` already returns `0`, so the empty string doesn't propagate.",
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Відмінність між `||` та `??`: яке твердження коректне?',
            textEN: 'Difference between `||` and `??`: which statement is correct?',
            theoryUK:
                "### Теорія: `||` (логічне АБО) vs `??` (nullish coalescing)\n\nОбидва оператори — **механізми вибору значення за замовчуванням**, але вони по-різному трактують \"порожні\" значення:\n\n- `||` повертає **перший truthy** операнд. Тобто якщо лівий операнд *falsy* (`false`, `0`, `-0`, `0n`, `NaN`, `''`, `null`, `undefined`), тоді повертається правий. У підсумку **`0`, `''`, `false` вважаються відсутніми** і замінюються фолбеком.\n- `??` повертає правий операнд **лише коли лівий є `null` або `undefined`** (так звані *nullish* значення). Для `0`, `''`, `false` — **не перемикається** на фолбек.\n\n> Приклади: `0 || 'fallback'` → `'fallback'`, але `0 ?? 'fallback'` → `0`. Аналогічно для `''` та `false`.\n\n#### Коротке замикання\nОбидва оператори коротко замикають: якщо результат визначено лівим операндом, правий **не** обчислюється.\n\n#### Пріоритет і групування\nУ складніших виразах використовуйте **дужки**. Змішування `??` з `||` або `&&` **без дужок** заборонено (SyntaxError): потрібно писати `a ?? (b || c)` замість `a ?? b || c`.\n",
            theoryEN:
                "### Theory: `||` (logical OR) vs `??` (nullish coalescing)\n\nBoth operators offer a **defaulting** mechanism but treat \"empty\" values differently:\n\n- `||` returns the **first truthy** operand. If the left is *falsy* (`false`, `0`, `-0`, `0n`, `NaN`, `''`, `null`, `undefined`), it returns the right. As a result, **`0`, `''`, `false` are treated as missing** and replaced by the fallback.\n- `??` returns the right operand **only** when the left is `null` or `undefined` (*nullish*). For `0`, `''`, `false`, it **does not** switch to the fallback.\n\n> Examples: `0 || 'fallback'` → `'fallback'`, but `0 ?? 'fallback'` → `0`. Same for `''` and `false`.\n\n#### Short-circuiting\nBoth operators short-circuit: if the left decides the outcome, the right **is not** evaluated.\n\n#### Precedence and grouping\nIn complex expressions prefer **parentheses**. Mixing `??` with `||`/`&&` **without parentheses** is forbidden (SyntaxError): write `a ?? (b || c)` instead of `a ?? b || c`.\n",
            answers: [
                {
                    textUK: "`0 || 'x'` дає `'x'`, але `0 ?? 'x'` дає `0`.",
                    textEN: "`0 || 'x'` yields `'x'`, while `0 ?? 'x'` yields `0`.",
                    theoryUK: '✅ **Вірно.** `0` — *falsy* для `||`, але **не** *nullish* для `??`, тому `??` залишає `0`.',
                    theoryEN: '✅ **Correct.** `0` is *falsy* for `||` but **not** *nullish* for `??`, so `??` keeps `0`.',
                    isCorrect: true
                },
                {
                    textUK: "`false ?? 'x'` дає `'x'`, бо `false` вважається *nullish*.",
                    textEN: "`false ?? 'x'` returns `'x'` because `false` is considered *nullish*.",
                    theoryUK: '❌ **Хибно.** *Nullish* — це лише `null` та `undefined`. `false` — **не** *nullish*, отже результат буде `false`.',
                    theoryEN: '❌ **Incorrect.** *Nullish* means only `null` and `undefined`. `false` is **not** nullish, so the result is `false`.',
                    isCorrect: false
                },
                {
                    textUK: "`'' || 'x'` і `'' ?? 'x'` обидва повернуть `'x'`.",
                    textEN: "`'' || 'x'` and `'' ?? 'x'` will both return `'x'`.",
                    theoryUK: "❌ **Хибно.** Порожній рядок `''` — *falsy* для `||`, але **не** *nullish* для `??`. Отже `'' ?? 'x'` поверне `''`.",
                    theoryEN: "❌ **Incorrect.** Empty string `''` is *falsy* for `||` but **not** nullish for `??`. Therefore `'' ?? 'x'` yields `''`.",
                    isCorrect: false
                },
                {
                    textUK: "`undefined || 'x'` і `undefined ?? 'x'` повертають **різні типи**: перше — булевий, друге — рядок.",
                    textEN: "`undefined || 'x'` and `undefined ?? 'x'` return **different types**: the first is boolean, the second is string.",
                    theoryUK: "❌ **Хибно.** Обидва вирази повертають **рядок `'x'`**. `||` і `??` повертають **операнди**, а не примусово булеві значення.",
                    theoryEN: "❌ **Incorrect.** Both expressions return the **string `'x'`**. `||` and `??` return **operands**, not forced booleans.",
                    isCorrect: false
                },
                {
                    textUK: '`??` і `||` мають однакову асоціативність і їх можна змішувати без дужок.',
                    textEN: '`??` and `||` have the same associativity and can be mixed without parentheses.',
                    theoryUK: '❌ **Хибно.** Змішування `??` з `||`/`&&` **без дужок** заборонене й дає SyntaxError: пишіть, наприклад, `a ?? (b || c)`.',
                    theoryEN: '❌ **Incorrect.** Mixing `??` with `||`/`&&` **without parentheses** is forbidden and throws a SyntaxError; write e.g. `a ?? (b || c)`.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: "Що повернуть наступні вирази з optional chaining і чому?\n\n const userA = undefined;\n const userB = { profile: { settings: { theme: 'dark' } } };\n const res1 = userA?.profile?.settings?.theme;\n const res2 = userB?.profile?.settings?.lang;",
            textEN: "What will the following expressions using optional chaining return, and why?\n\n const userA = undefined;\n const userB = { profile: { settings: { theme: 'dark' } } };\n const res1 = userA?.profile?.settings?.theme;\n const res2 = userB?.profile?.settings?.lang;",
            theoryUK:
                "### Теорія: робота `?.` при доступі до властивостей\n\nОператор **optional chaining** (`?.`) зупиняє доступ до властивостей і повертає `undefined`, якщо **значення ліворуч** дорівнює `null` або `undefined` (*nullish*). Це запобігає `TypeError` при зверненні до вкладених властивостей.\n\n- `obj?.prop` → якщо `obj` *nullish* → результат `undefined`, і доступ до `prop` **не відбувається**.\n- `obj?.[key]` → аналогічно для індексного доступу.\n- Якщо об’єкт існує, але запитаної властивості немає → результат `undefined`, але **без короткого замикання** (виконується звичайний доступ).\n\n> `?.` реагує лише на `null` і `undefined`. Інші *falsy* (`0`, `''`, `false`, `NaN`) не зупиняють доступ.\n\n#### Аналіз прикладу\nconst userA = undefined; const userB = { profile: { settings: { theme: 'dark' } } }; const res1 = userA?.profile?.settings?.theme; // undefined (userA — nullish) const res2 = userB?.profile?.settings?.lang;  // undefined (властивість lang відсутня)\n\n- `res1`: перше `?.` зупиняє ланцюг, бо `userA` — `undefined` → результат `undefined`, **без помилки**.\n- `res2`: шлях до `settings` існує, але властивість `lang` відсутня → `undefined`, **без помилки**.",
            theoryEN:
                "### Theory: how `?.` works for property access\n\nThe **optional chaining** operator (`?.`) stops property access and returns `undefined` when the **left-hand value** is `null` or `undefined` (*nullish*). This prevents `TypeError` when accessing nested properties.\n\n- `obj?.prop` → if `obj` is nullish → result `undefined`, and `prop` is **not accessed**.\n- `obj?.[key]` → same for bracket access.\n- If the object exists but the property is missing → result is `undefined`, without short-circuiting.\n\n> `?.` only reacts to `null` and `undefined`. Other *falsy* values (`0`, `''`, `false`, `NaN`) do not stop access.\n\n#### Example explained\nconst userA = undefined; const userB = { profile: { settings: { theme: 'dark' } } }; const res1 = userA?.profile?.settings?.theme; // undefined (userA is nullish) const res2 = userB?.profile?.settings?.lang;  // undefined (missing property)\n\n- `res1`: the first `?.` short-circuits because `userA` is `undefined` → result `undefined`.\n- `res2`: access path exists, but `lang` is missing → `undefined`, no error.",
            answers: [
                {
                    textUK: 'Обидва вирази повернуть undefined: у першому випадку через userA дорівнює undefined, у другому через відсутню властивість lang.',
                    textEN: 'Both expressions return undefined: the first because userA is undefined, the second because lang is missing.',
                    theoryUK:
                        "✅ **Вірно.** У res1 спрацьовує коротке замикання при userA === undefined. У res2 об'єкт існує, але lang відсутня, тож результат також undefined.",
                    theoryEN: '✅ **Correct.** res1 short-circuits when userA is undefined. res2 accesses a real object but missing property, so result is undefined.',
                    isCorrect: true
                },
                {
                    textUK: 'res1 кине TypeError, бо не можна звертатись до profile у undefined.',
                    textEN: 'res1 throws a TypeError because you can’t access profile on undefined.',
                    theoryUK: '❌ **Хибно.** Саме ?. запобігає такій помилці — замість помилки повертається undefined.',
                    theoryEN: '❌ **Incorrect.** The ?. operator prevents this error — it returns undefined instead of throwing.',
                    isCorrect: false
                },
                {
                    textUK: 'res2 поверне false, бо відсутня властивість інтерпретується як falsy.',
                    textEN: 'res2 will return false because a missing property is interpreted as falsy.',
                    theoryUK: '❌ **Хибно.** Відсутня властивість повертає саме undefined, а не false.',
                    theoryEN: '❌ **Incorrect.** A missing property returns undefined, not false.',
                    isCorrect: false
                },
                {
                    textUK: "res1 поверне 'dark', бо ?. підставляє останнє знайдене значення.",
                    textEN: "res1 returns 'dark' because ?. substitutes the last valid value.",
                    theoryUK: '❌ **Хибно.** ?. нічого не підставляє, воно лише зупиняє доступ і повертає undefined.',
                    theoryEN: '❌ **Incorrect.** ?. does not substitute values; it only stops and returns undefined.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },

        {
            textUK: "Optional chaining при виклику функцій: що повернуть/зроблять наступні вирази і чому?\n\n const A = null;\n const B = { method() { return 'ok'; } };\n const C = { method: undefined };\n const fn = undefined;\n const r1 = A?.method();\n const r2 = B?.method();\n const r3 = C?.method();\n const r4 = B.method?.();\n const r5 = C.method?.();\n const r6 = fn?.();",
            textEN: "Optional chaining for function calls: what do the following expressions return/do and why?\n\n const A = null;\n const B = { method() { return 'ok'; } };\n const C = { method: undefined };\n const fn = undefined;\n const r1 = A?.method();\n const r2 = B?.method();\n const r3 = C?.method();\n const r4 = B.method?.();\n const r5 = C.method?.();\n const r6 = fn?.();",
            theoryUK:
                "### Теорія: виклики з `?.` — різниця між `obj?.method()` та `obj.method?.()`\n\nОператор `?.` може стояти **перед об'єктом** або **перед викликом методу**:\n\n1) `obj?.method()`\n- Перевіряє **`obj`** на *nullish* (`null`/`undefined`). Якщо `obj == null` → повертає `undefined` **без виклику**.\n- Якщо `obj` існує, відбувається **звичайний** виклик `obj.method()`.\n- Якщо `obj` існує, але `method` відсутній або не функція → **TypeError** (бо `?.` не «охороняє» сам метод, воно стоїть перед об'єктом).\n\n2) `obj.method?.()`\n- Перевіряє **посилання на метод** на *nullish* **перед викликом**. Якщо `obj.method == null` → повертає `undefined` **без помилки**.\n- Якщо `obj.method` — функція, вона викликається. Контекст `this` зберігається (`this === obj`).\n\n3) `fn?.()`\n- Аналогічно працює для змінної-функції: якщо `fn == null` → `undefined`, інакше — виклик `fn()`.\n\n> `?.` **не** гасить помилки всередині самої функції, якщо виклик відбувся — виняток «пролітає». Також заборонені форми на кшталт `new obj?.Ctor()` і `super?.()`.\n\n#### Розбір коду\n```js\nconst A = null;                    // r1: A?.method() → undefined (A nullish)\nconst B = { method() { return 'ok'; } }; // r2: B?.method() → 'ok'; r4: B.method?.() → 'ok'\nconst C = { method: undefined };    // r3: C?.method() → TypeError; r5: C.method?.() → undefined\nconst fn = undefined;               // r6: fn?.() → undefined\n```\n",
            theoryEN:
                "### Theory: calls with `?.` — difference between `obj?.method()` and `obj.method?.()`\n\n`?.` can guard **the object** or **the method reference**:\n\n1) `obj?.method()`\n- Guards **`obj`** for *nullish* (`null`/`undefined`). If `obj == null` → returns `undefined` **without calling**.\n- If `obj` exists, it performs a **normal** `obj.method()` call.\n- If `obj` exists but `method` is missing or not a function → **TypeError** (because the guard is on the object, not on the callee).\n\n2) `obj.method?.()`\n- Guards the **method reference** for *nullish* **before calling**. If `obj.method == null` → returns `undefined` **without error**.\n- If `obj.method` is a function, it is called. `this` is preserved (`this === obj`).\n\n3) `fn?.()`\n- Works for a function variable: if `fn == null` → `undefined`, otherwise calls `fn()`.\n\n> `?.` does **not** swallow errors thrown **inside** the called function if the call happens. Forms like `new obj?.Ctor()` and `super?.()` are disallowed.\n\n#### Code analysis\n```js\nA = null            → r1: A?.method() → undefined (A is nullish)\nB = { method(){'ok'} } → r2: B?.method() → 'ok'; r4: B.method?.() → 'ok'\nC = { method: undefined } → r3: C?.method() → TypeError; r5: C.method?.() → undefined\nfn = undefined      → r6: fn?.() → undefined\n```\n",
            answers: [
                {
                    textUK: "r1 === undefined; r2 === 'ok'; r3 кидає TypeError; r4 === 'ok'; r5 === undefined; r6 === undefined.",
                    textEN: "r1 === undefined; r2 === 'ok'; r3 throws TypeError; r4 === 'ok'; r5 === undefined; r6 === undefined.",
                    theoryUK: '✅ **Вірно.** `obj?.method()` охороняє лише `obj`, а `obj.method?.()` — сам метод; `fn?.()` охороняє змінну-функцію.',
                    theoryEN: '✅ **Correct.** `obj?.method()` guards `obj`, `obj.method?.()` guards the method, and `fn?.()` guards the function variable.',
                    isCorrect: true
                },
                {
                    textUK: 'r3 === undefined, бо ?. запобігає будь-яким помилкам виклику.',
                    textEN: 'r3 === undefined because ?. prevents any call errors.',
                    theoryUK: '❌ **Хибно.** `C?.method()` не перевіряє, чи `method` є функцією. При наявному `C` і `undefined` як методі отримаємо TypeError.',
                    theoryEN:
                        '❌ **Incorrect.** `C?.method()` does not validate that `method` is a function. With existing `C` and `undefined` method you get a TypeError.',
                    isCorrect: false
                },
                {
                    textUK: 'r1 кидає TypeError, бо доступ до методу у null неможливий навіть з ?.',
                    textEN: 'r1 throws TypeError because accessing a method on null is impossible even with ?.',
                    theoryUK: '❌ **Хибно.** Для `A?.method()` `A` є nullish, тож вираз повертає `undefined` без помилки.',
                    theoryEN: '❌ **Incorrect.** For `A?.method()` with nullish `A`, it returns `undefined` without error.',
                    isCorrect: false
                },
                {
                    textUK: 'r4 втрачає this і тому буде undefined.',
                    textEN: 'r4 loses this and thus becomes undefined.',
                    theoryUK: "❌ **Хибно.** Виклик через крапку зберігає `this === B`. `?.` не змінює прив'язку `this`.",
                    theoryEN: '❌ **Incorrect.** Dot-call preserves `this === B`. `?.` does not alter `this` binding.',
                    isCorrect: false
                },
                {
                    textUK: 'fn?.() заборонено синтаксично і викликає SyntaxError.',
                    textEN: 'fn?.() is syntactically forbidden and throws a SyntaxError.',
                    theoryUK: '❌ **Хибно.** `fn?.()` — валідний синтаксис: якщо `fn == null` → `undefined`, інакше виклик.',
                    theoryEN: '❌ **Incorrect.** `fn?.()` is valid syntax: if `fn == null` it yields `undefined`, otherwise it calls.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: "Комбінування optional chaining з nullish coalescing: що повернуть вирази і чому?\n\n const u1 = undefined;\n const u2 = { profile: { name: '' } };\n const u3 = { profile: null };\n const a = u1?.profile?.name ?? 'guest';\n const b = u2?.profile?.name ?? 'guest';\n const c = u3?.profile?.name ?? 'guest';\n const d = (u2?.settings ?? { theme: 'light' }).theme;",
            textEN: "Combining optional chaining with nullish coalescing: what do the expressions return and why?\n\n const u1 = undefined;\n const u2 = { profile: { name: '' } };\n const u3 = { profile: null };\n const a = u1?.profile?.name ?? 'guest';\n const b = u2?.profile?.name ?? 'guest';\n const c = u3?.profile?.name ?? 'guest';\n const d = (u2?.settings ?? { theme: 'light' }).theme;",
            theoryUK:
                "### Теорія: поєднання `?.` та `??`\n\n- `?.` повертає `undefined`, якщо зліва *nullish* (`null`/`undefined`), інакше — звичайний доступ.\n- `??` підставляє правий операнд **лише** коли лівий є *nullish* (не спрацьовує для `''`, `0`, `false`).\n- Змішувати `??` з `||`/`&&` **без дужок** заборонено (SyntaxError), але з `?.` — дозволено. Часто `a?.b ?? default` — канонічний шаблон: «безпечно дістань, а якщо *nullish* — підстав значення за замовчуванням».\n\n#### Розбір прикладу\n```js\nu1 = undefined\nu2 = { profile: { name: '' } }\nu3 = { profile: null }\n\na = u1?.profile?.name ?? 'guest'         // u1?.... → undefined → 'guest'\nb = u2?.profile?.name ?? 'guest'         // name === '' (не nullish) → ''\nc = u3?.profile?.name ?? 'guest'         // u3.profile === null → ланцюг дає undefined → 'guest'\nd = (u2?.settings ?? { theme: 'light' }).theme // u2?.settings → undefined → {theme:'light'} → 'light'\n```\n",
            theoryEN:
                "### Theory: combining `?.` and `??`\n\n- `?.` yields `undefined` when the left is *nullish* (`null`/`undefined`); otherwise it accesses normally.\n- `??` uses the right-hand side **only** when the left is *nullish* (does not trigger for `''`, `0`, `false`).\n- Mixing `??` with `||`/`&&` **without parentheses** is forbidden (SyntaxError), but using it with `?.` is fine. The idiom `a?.b ?? default` means “safely access, otherwise use a default when nullish”.\n\n#### Example walkthrough\n```js\na → 'guest' (left is undefined)\nb → '' (empty string is not nullish)\nc → 'guest' (chain hits null → undefined → default)\nd → 'light' (fallback object used)\n```\n",
            answers: [
                {
                    textUK: "a === 'guest'; b === ''; c === 'guest'; d === 'light'.",
                    textEN: "a === 'guest'; b === ''; c === 'guest'; d === 'light'.",
                    theoryUK: "✅ **Вірно.** `''` не є *nullish*, тож `b` зберігає порожній рядок; інші випадки використовують фолбек через *nullish*.",
                    theoryEN: "✅ **Correct.** `''` is not nullish, so `b` keeps the empty string; others use the fallback due to nullish values.",
                    isCorrect: true
                },
                {
                    textUK: "b === 'guest', бо порожній рядок вважається відсутнім для ??",
                    textEN: "b === 'guest' because an empty string is considered missing for ??",
                    theoryUK: "❌ **Хибно.** `??` переключається тільки на `null` або `undefined`. `''` не є *nullish*.",
                    theoryEN: "❌ **Incorrect.** `??` triggers only for `null`/`undefined`. `''` is not nullish.",
                    isCorrect: false
                },
                {
                    textUK: 'a === undefined, бо ?. вже повернув undefined і ?? його не змінює',
                    textEN: 'a === undefined because ?. already returned undefined and ?? does not change it',
                    theoryUK: '❌ **Хибно.** `??` саме для цього існує — підставляє праве значення, коли ліве `undefined` або `null`.',
                    theoryEN: '❌ **Incorrect.** `??` replaces `undefined`/`null` with the right-hand fallback.',
                    isCorrect: false
                },
                {
                    textUK: "d === undefined, бо (u2?.settings ?? { theme: 'light' }) дає об'єкт, але доступ до theme через крапку з ?. потрібен",
                    textEN: "d === undefined because (u2?.settings ?? { theme: 'light' }) yields an object but theme needs ?. for access",
                    theoryUK: "❌ **Хибно.** Доступ до існуючої властивості об'єкта працює звичайно; `?.` не потрібен. Отже `theme` → 'light'.",
                    theoryEN: "❌ **Incorrect.** Accessing an existing property does not require `?.`; the result is 'light'.",
                    isCorrect: false
                },
                {
                    textUK: 'c === undefined, бо ланцюг ?. завжди повертає undefined і ?? вже не застосовується',
                    textEN: 'c === undefined because ?. always returns undefined and ?? does not apply',
                    theoryUK: "❌ **Хибно.** `??` застосовується після результату ліворуч. Коли ліворуч `undefined`, повертається фолбек 'guest'.",
                    theoryEN: "❌ **Incorrect.** `??` applies after the left side evaluates. With `undefined` left, it returns the fallback 'guest'.",
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Пріоритет операторів: що станеться при виконанні виразу a && b || c ?? d без дужок у сучасному JavaScript і чому?',
            textEN: 'Operator precedence: what happens when evaluating a && b || c ?? d without parentheses in modern JavaScript, and why?',
            theoryUK:
                "### Теорія: пріоритет і обмеження змішування `??` з логічними операторами\n\n- Пріоритет: `&&` вище за `||`, а `??` має той самий рівень, що й `||`, але **особливе правило** синтаксису забороняє **змішувати `??` з `||` або `&&` без дужок**.\n- Причина: щоб уникнути неоднозначності, стандарт ECMAScript вимагає явні дужки, коли в одному виразі разом присутні `??` та будь-який з `||`/`&&`.\n- Тому вираз на кшталт `a && b || c ?? d` **є SyntaxError**, поки ви не додасте дужки, наприклад:\n  - `(a && b) || (c ?? d)` — валідно;\n  - `a && (b || (c ?? d))` — валідно;\n  - `(a && b || c) ?? d` — теж валідно, але спершу потрібно усвідомити порядок `&&` → `||`, а вже потім `??`.\n\n> Запам'ятайте: **жодного** змішування `??` з `||` або `&&` **без дужок**.\n",
            theoryEN:
                '### Theory: precedence and the restriction on mixing `??` with logical operators\n\n- Precedence: `&&` binds tighter than `||`. `??` has the same precedence as `||`, but with a **special syntax rule**: you **cannot mix** `??` with `||` or `&&` **without parentheses**.\n- Rationale: to avoid ambiguity, ECMAScript requires explicit parentheses whenever `??` appears in the same expression with `||`/`&&`.\n- Therefore, an expression like `a && b || c ?? d` is a **SyntaxError** unless you add parentheses, e.g.:\n  - `(a && b) || (c ?? d)` — valid;\n  - `a && (b || (c ?? d))` — valid;\n  - `(a && b || c) ?? d` — also valid, understanding that `&&` runs before `||`, then `??`.\n\n> Rule of thumb: **never** mix `??` with `||` or `&&` **without parentheses**.\n',
            answers: [
                {
                    textUK: 'Вираз спричиняє SyntaxError, бо `??` змішано з `||` і `&&` без дужок.',
                    textEN: 'The expression throws a SyntaxError because `??` is mixed with `||` and `&&` without parentheses.',
                    theoryUK: '✅ **Вірно.** ECMAScript забороняє таке змішування; потрібні явні дужки.',
                    theoryEN: '✅ **Correct.** ECMAScript forbids such mixing; explicit parentheses are required.',
                    isCorrect: true
                },
                {
                    textUK: 'Вираз обчислюється як ((a && b) || c) ?? d без помилок.',
                    textEN: 'It evaluates as ((a && b) || c) ?? d without errors.',
                    theoryUK: '❌ **Хибно.** Без дужок парсер зупиняється з SyntaxError — автоматичного групування немає.',
                    theoryEN: '❌ **Incorrect.** Without parentheses the parser throws a SyntaxError — no implicit grouping is applied.',
                    isCorrect: false
                },
                {
                    textUK: 'Спершу виконується `??`, потім `||`, потім `&&`, отже результат — d.',
                    textEN: '`??` runs first, then `||`, then `&&`, therefore the result is d.',
                    theoryUK: '❌ **Хибно.** По-перше, це SyntaxError. По-друге, такий порядок пріоритетів невірний.',
                    theoryEN: '❌ **Incorrect.** First, it’s a SyntaxError; second, the stated precedence is wrong.',
                    isCorrect: false
                },
                {
                    textUK: '`&&` має найнижчий пріоритет, тож вираз дорівнює a && (b || (c ?? d)).',
                    textEN: '`&&` has the lowest precedence, so the expression equals a && (b || (c ?? d)).',
                    theoryUK: '❌ **Хибно.** `&&` має **вищий** пріоритет за `||`. Але головне — без дужок тут SyntaxError.',
                    theoryEN: '❌ **Incorrect.** `&&` has **higher** precedence than `||`. Also, without parentheses this is a SyntaxError.',
                    isCorrect: false
                },
                {
                    textUK: 'JS не підтримує оператор `??`, тож вираз завжди помилка незалежно від дужок.',
                    textEN: 'JS does not support `??`, so it’s always an error regardless of parentheses.',
                    theoryUK: '❌ **Хибно.** `??` підтримується з ES2020; проблема саме у змішуванні без дужок.',
                    theoryEN: '❌ **Incorrect.** `??` is supported since ES2020; the issue is mixing without parentheses.',
                    isCorrect: false
                }
            ],
            level: 'senior'
        }
    ]
};
