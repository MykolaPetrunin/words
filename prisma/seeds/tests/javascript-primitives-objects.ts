import { TopicMock } from '../types';

export const tests: TopicMock = {
    titleUK: 'Примітиви та об’єкти',
    titleEN: 'Primitives and Objects',
    questions: [
        {
            textUK: 'Які типи даних у JavaScript є примітивними? (оберіть усі правильні варіанти)',
            textEN: 'Which data types in JavaScript are primitives? (select all that apply)',
            theoryUK:
                "### Примітивні типи в JS\nУ JavaScript **примітиви** — це значення, які **не є об'єктами** і **не мають методів/властивостей у власному стані** (методи, що ви викликаєте на примітивах, насправді надаються тимчасовими обгортками — boxing). До примітивів належать:\n\n- `string`\n- `number`\n- `bigint`\n- `boolean`\n- `undefined`\n- `symbol`\n- `null`\n\nВсе інше — це **об'єкти** (включно з `Function`, `Array`, `Date`, а також об'єктами-обгортками `String/Number/Boolean`).\n\n> Важливо: `NaN` — **не окремий тип**, це особливе значення **типу `number`**. \n> Історична особливість: `typeof null === 'object'` — це **помилка дизайну**, `null` все одно є **примітивом**.\n> Обережно з обгортками: `new String('a')`, `new Number(1)`, `new Boolean(false)` створюють **об'єкти**, а не примітиви — це часто джерело плутанини та їх краще **не використовувати** у щоденному коді.",
            theoryEN:
                "### Primitive types in JS\nIn JavaScript, **primitives** are values that are **not objects** and **don't carry stateful properties/methods** (methods you call on primitives are provided by temporary wrappers—boxing). The primitive types are:\n\n- `string`\n- `number`\n- `bigint`\n- `boolean`\n- `undefined`\n- `symbol`\n- `null`\n\nEverything else is an **object** (including `Function`, `Array`, `Date`, and wrapper objects like `String/Number/Boolean`).\n\n> Note: `NaN` is **not a separate type**; it's a special value of **`number`**. \n> Historical quirk: `typeof null === 'object'` is a **design bug**—`null` is still a **primitive**.\n> Beware wrappers: `new String('a')`, `new Number(1)`, `new Boolean(false)` create **objects**, not primitives—best **avoid** them in everyday code.",
            answers: [
                {
                    textUK: 'string',
                    textEN: 'string',
                    theoryUK: '✅ Це примітивний тип, що представляє текстові значення.',
                    theoryEN: '✅ This is a primitive type representing textual values.',
                    isCorrect: true
                },
                {
                    textUK: 'number',
                    textEN: 'number',
                    theoryUK: '✅ Це примітивний числовий тип із плаваючою крапкою, включаючи `NaN` і `Infinity` як значення.',
                    theoryEN: '✅ This is the primitive floating-point numeric type; includes values like `NaN` and `Infinity`.',
                    isCorrect: true
                },
                {
                    textUK: 'bigint',
                    textEN: 'bigint',
                    theoryUK: '✅ Примітив для цілих довільної довжини.',
                    theoryEN: '✅ Primitive for arbitrarily large integers.',
                    isCorrect: true
                },
                {
                    textUK: 'boolean',
                    textEN: 'boolean',
                    theoryUK: '✅ Примітив, що містить `true` або `false`.',
                    theoryEN: '✅ Primitive that holds `true` or `false`.',
                    isCorrect: true
                },
                {
                    textUK: 'undefined',
                    textEN: 'undefined',
                    theoryUK: '✅ Примітив, що означає «значення не встановлене».',
                    theoryEN: '✅ Primitive meaning “value not set”.',
                    isCorrect: true
                },
                {
                    textUK: 'symbol',
                    textEN: 'symbol',
                    theoryUK: '✅ Унікальні ідентифікатори — це примітиви.',
                    theoryEN: '✅ Unique identifiers—this is a primitive.',
                    isCorrect: true
                },
                {
                    textUK: 'null',
                    textEN: 'null',
                    theoryUK: '✅ Це примітив, що означає «відсутність значення».',
                    theoryEN: '✅ This is a primitive meaning “no value”.',
                    isCorrect: true
                },
                {
                    textUK: 'function',
                    textEN: 'function',
                    theoryUK: '❌ `function` — це об’єкт (викликаємий об’єкт із внутрішньою можливістю `[[Call]]`), а не примітив.',
                    theoryEN: '❌ A `function` is an object (a callable object with `[[Call]]`), not a primitive.',
                    isCorrect: false
                },
                {
                    textUK: 'NaN (як окремий тип)',
                    textEN: 'NaN (as a separate type)',
                    theoryUK: '❌ `NaN` — це значення **типу `number`**, а не окремий тип.',
                    theoryEN: '❌ `NaN` is a **`number`** value, not its own type.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Чим примітив відрізняється від об’єкта у JavaScript?',
            textEN: 'How does a primitive differ from an object in JavaScript?',
            theoryUK:
                "### Примітиви vs об’єкти\n- **Примітиви**: незмінні (immutable), порівнюються **за значенням**, передаються та копіюються **за значенням**. При зверненні до «методів» примітива двигун робить **тимчасове boxing** (наприклад, `'a'.toUpperCase()` створює тимчасовий `String`-об’єкт).\n- **Об’єкти**: змінні структури (mutable зазвичай), порівнюються **за посиланням**, змінні зберігають **посилання** на них; при присвоєнні **копіюється посилання**, а не сам об’єкт.\n- **Функції**: це **об’єкти**, які додатково мають внутрішню здатність виклику (`[[Call]]`).\n\n> Порівняння: `42 === 42` → `true` (за значенням), а `{}` === `{}` → `false` (різні посилання).",
            theoryEN:
                "### Primitives vs Objects\n- **Primitives**: immutable, compared **by value**, passed and copied **by value**. When you access “methods”, the engine performs **temporary boxing** (e.g., `'a'.toUpperCase()` uses a temporary `String` object).\n- **Objects**: typically mutable, compared **by reference**; variables hold **references** to them; assignment **copies the reference**, not the object itself.\n- **Functions**: are **objects** that additionally have an internal callable capability (`[[Call]]`).\n\n> Comparison: `42 === 42` → `true` (by value), while `{}` === `{}` → `false` (different references).",
            answers: [
                {
                    textUK: 'Примітиви порівнюються за значенням, а об’єкти — за посиланням.',
                    textEN: 'Primitives are compared by value, objects by reference.',
                    theoryUK: '✅ Це ключова відмінність: `===` для примітивів порівнює саме значення, для об’єктів — посилання.',
                    theoryEN: '✅ This is the key difference: `===` compares the value for primitives and the reference for objects.',
                    isCorrect: true
                },
                {
                    textUK: 'Примітивам не можна викликати жодних методів.',
                    textEN: 'You can’t call any methods on primitives.',
                    theoryUK: "❌ Можна, але через тимчасове **boxing**: наприклад, `'text'.toUpperCase()` працює завдяки тимчасовому `String`-об’єкту.",
                    theoryEN: "❌ You can—thanks to temporary **boxing**. E.g., `'text'.toUpperCase()` works via a temporary `String` object.",
                    isCorrect: false
                },
                {
                    textUK: 'Об’єкти завжди порівнюються за значенням їхніх полів.',
                    textEN: 'Objects are always compared by the values of their fields.',
                    theoryUK: '❌ У JS об’єкти за замовчуванням порівнюються **за посиланням**, а не за структурою.',
                    theoryEN: '❌ In JS, objects are compared **by reference**, not by structural equality.',
                    isCorrect: false
                },
                {
                    textUK: 'Копіювання об’єкта через присвоєння створює незалежну глибоку копію.',
                    textEN: 'Assigning an object creates an independent deep copy.',
                    theoryUK: '❌ Присвоєння копіює **посилання**. Для глибокої копії потрібні спеціальні техніки (`structuredClone`, ручна рекурсія тощо).',
                    theoryEN: '❌ Assignment copies the **reference**. Deep copies require dedicated techniques (`structuredClone`, manual recursion, etc.).',
                    isCorrect: false
                },
                {
                    textUK: 'Лише об’єкти можуть мати властивості, а примітиви — ні за жодних умов.',
                    textEN: 'Only objects can have properties; primitives never can under any circumstances.',
                    theoryUK: '❌ Примітиви отримують доступ до методів/«властивостей» через **тимчасові об’єкти-обгортки** (boxing).',
                    theoryEN: '❌ Primitives access methods/“properties” via **temporary wrapper objects** (boxing).',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Як JavaScript зберігає та копіює примітиви й об’єкти? (у т.ч. де тут stack і heap)',
            textEN: 'How does JavaScript store and copy primitives vs objects? (including what goes to the stack vs the heap)',
            theoryUK:
                '### Пам’ять: stack vs heap і семантика копіювання\n- **Примітиви** (числа, рядки тощо) зберігаються **безпосередньо як значення** у змінній (концептуально — у **стеку кадру виклику** або навіть у регістрах). **Присвоєння/передача** копіює **значення**. Зміна однієї змінної **не впливає** на іншу.\n- **Об’єкти** (у тому числі масиви, функції) виділяються в **heap**. Змінна зберігає **посилання** на об’єкт. **Присвоєння** копіює **посилання**, отже дві змінні можуть вказувати на **той самий** об’єкт. Зміни через одне посилання видимі через інше.\n- **Порівняння**: примітиви — за **значенням**, об’єкти — за **посиланням**.\n\n> Зауваження: реальні оптимізації рушія можуть змінювати внутрішні деталі (наприклад, інтернінг рядків), але як **модель мислення** «значення в стеку» для примітивів і «об’єкти в heap» — корисна й коректна для фронтенд-практики.',
            theoryEN:
                '### Memory: stack vs heap and copy semantics\n- **Primitives** (numbers, strings, etc.) are stored **as values** in the variable (conceptually in the **call-stack frame** or even CPU registers). **Assignment/passing** copies the **value**. Changing one variable **does not affect** another.\n- **Objects** (including arrays, functions) are allocated on the **heap**. A variable holds a **reference** to the object. **Assignment** copies the **reference**, so two variables can point to the **same** object. Mutations through one are visible through the other.\n- **Comparison**: primitives — **by value**; objects — **by reference**.\n\n> Note: engine optimizations (e.g., string interning) may alter internals, but as a **mental model** “primitives on the stack, objects on the heap” is accurate and practical for frontend work.',
            answers: [
                {
                    textUK: 'Примітиви копіюються за значенням і концептуально зберігаються в стеку; об’єкти — у heap, а змінні містять посилання на них.',
                    textEN: 'Primitives are copied by value and conceptually live on the stack; objects live on the heap and variables hold references to them.',
                    theoryUK: '✅ Саме така модель пояснює різницю між незалежними примітивами та спільними посиланнями на один і той самий об’єкт.',
                    theoryEN: '✅ This model explains why primitives are independent while objects can be shared via references.',
                    isCorrect: true
                },
                {
                    textUK: 'І примітиви, і об’єкти зберігаються лише в heap; різниця — тільки у швидкості доступу.',
                    textEN: 'Both primitives and objects are stored only on the heap; the only difference is access speed.',
                    theoryUK: '❌ Це спрощення ігнорує стандартну модель: примітиви поводяться як значення в стеку, об’єкти — як посилання на heap.',
                    theoryEN: '❌ This ignores the standard model: primitives behave as stack values, objects as heap references.',
                    isCorrect: false
                },
                {
                    textUK: 'Присвоєння об’єкта копіює всі його властивості (глибоко), тоді як примітиви копіюються за посиланням.',
                    textEN: 'Assigning an object copies all its properties (deeply), while primitives are copied by reference.',
                    theoryUK: '❌ Навпаки: об’єкти копіюються **за посиланням** при присвоєнні; примітиви — **за значенням**.',
                    theoryEN: '❌ The opposite is true: objects copy **by reference** on assignment; primitives copy **by value**.',
                    isCorrect: false
                },
                {
                    textUK: 'Масив — це примітив, тому при присвоєнні створюється незалежна копія елементів.',
                    textEN: 'Array is a primitive, so assignment creates an independent copy of its elements.',
                    theoryUK: '❌ Масив — це **об’єкт**; присвоєння копіює **посилання**, а не елементи.',
                    theoryEN: '❌ An array is an **object**; assignment copies the **reference**, not the elements.',
                    isCorrect: false
                },
                {
                    textUK: 'Об’єкти зберігаються в стеку, а примітиви — в heap, бо примітиви великі.',
                    textEN: 'Objects are on the stack and primitives on the heap because primitives are large.',
                    theoryUK: '❌ Навпаки щодо моделі; також «розмір» не визначає це правило в JS.',
                    theoryEN: '❌ Reversed model; size doesn’t determine this behavior in JS.',
                    isCorrect: false
                },
                {
                    textUK: 'Копіювання примітивів і об’єктів у JS працює однаково — завжди копіюється саме значення.',
                    textEN: 'Copying primitives and objects in JS is the same—always copies the value itself.',
                    theoryUK: '❌ Для об’єктів за замовчуванням копіюється **посилання**, не сам об’єкт.',
                    theoryEN: '❌ For objects the **reference** is copied by default, not the object value.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Що означає «immutable» у контексті примітивних типів у JavaScript?',
            textEN: 'What does “immutable” mean for primitive types in JavaScript?',
            theoryUK:
                "### Незмінність (immutability) примітивів\n**Примітиви** (`string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`) — **незмінні**: створене значення не можна змінити «на місці». Будь-яка операція, що виглядає як зміна, насправді **створює нове значення**, а змінна просто починає посилатися на нього.\n\n#### Ключові наслідки\n- **Рядки не мутують**: методи на кшталт `toUpperCase`, `slice`, `replace` **повертають новий рядок**.\n- **Переприсвоєння ≠ мутація**: `let x = 1; x = x + 1;` — стара «1» не змінюється; змінна просто отримує **інше** значення.\n- **`const` фіксує прив’язку, а не робить значення «замороженим»**: `const s = 'hi'` забороняє **переприсвоєння** `s`, але не «заморожує» значення. Для об’єктів `const` теж не забороняє змінювати їх **вміст**.\n- **Boxing не робить примітив мутованим**: виклик `'a'.toUpperCase()` створює **тимчасовий** `String`-об’єкт; сам примітив не змінюється.\n- **Символьний доступ до рядка — тільки для читання**: `s[0] = 'H'` ігнорується.\n\n```js\nlet s = 'hi';\ns.toUpperCase();      // повертає 'HI', але s все ще 'hi'\ns = s.toUpperCase();  // тепер s посилається на НОВЕ значення 'HI'\n\nconst obj = { n: 1 };\nobj.n = 2;            // дозволено: const не забороняє мутацію вмісту об'єкта\n// obj = {}            // ❌ помилка: не можна переприсвоїти змінну obj\n```\n> Примітка про пам’ять: ми **моделюємо** примітиви як значення (концептуально у **стеку**) і об’єкти як дані у **heap** з посиланнями на них. Але **незмінність** — це властивість **поведінки значення**, а не наслідок місця зберігання. Також уникайте обгорток `new String/Number/Boolean`: вони створюють об’єкти, що ведуть себе інакше у порівнянні та логічних виразах.",
            theoryEN:
                "### Immutability of primitives\n**Primitives** (`string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`) are **immutable**: once created, a value cannot be changed in place. Any apparent change **creates a new value**, and the variable just points to it.\n\n#### Key takeaways\n- **Strings don’t mutate**: methods like `toUpperCase`, `slice`, `replace` **return a new string**.\n- **Reassignment ≠ mutation**: `let x = 1; x = x + 1;` — the old `1` is not modified; the variable simply points to a **different** value.\n- **`const` fixes the binding, not the value**: `const s = 'hi'` forbids **reassignment** of `s`, but doesn’t “freeze” values. With objects, `const` doesn’t prevent **mutating their contents**.\n- **Boxing doesn’t make primitives mutable**: `'a'.toUpperCase()` uses a **temporary** `String` object; the primitive itself is unchanged.\n- **String indexing is read-only**: `s[0] = 'H'` is ignored.\n\n```js\nlet s = 'hi';\ns.toUpperCase();      // returns 'HI', but s is still 'hi'\ns = s.toUpperCase();  // s now points to a NEW value 'HI'\n\nconst obj = { n: 1 };\nobj.n = 2;            // allowed: const doesn’t prevent object mutation\n// obj = {}            // ❌ error: cannot reassign obj\n```\n> Memory note: we **model** primitives as values (conceptually on the **stack**) and objects as data in the **heap** referenced by variables. However, **immutability** describes **value behavior**, not storage location. Also avoid `new String/Number/Boolean`: they create objects that behave differently in comparisons and logical contexts.",
            answers: [
                {
                    textUK: 'Значення примітива не можна змінити на місці; «зміни» завжди створюють нове значення, а змінна просто перепризначається.',
                    textEN: 'A primitive’s value cannot be changed in place; any “change” creates a new value and the variable is simply reassigned.',
                    theoryUK: '✅ Це і є сутність immutability для примітивів. Методи рядків повертають нові значення; старе не модифікується.',
                    theoryEN: '✅ This is exactly what immutability means for primitives. String methods return new values; the old one isn’t modified.',
                    isCorrect: true
                },
                {
                    textUK: 'Через boxing метод, викликаний на примітиві, може змінити його на місці.',
                    textEN: 'Thanks to boxing, a method called on a primitive can change it in place.',
                    theoryUK: '❌ Boxing створює **тимчасовий** об’єкт-обгортку; примітивне значення не мутується.',
                    theoryEN: '❌ Boxing creates a **temporary** wrapper object; the primitive value itself isn’t mutated.',
                    isCorrect: false
                },
                {
                    textUK: '`const` робить і примітиви, і об’єкти незмінними (immutable).',
                    textEN: '`const` makes both primitives and objects immutable.',
                    theoryUK: '❌ `const` лише забороняє **переприсвоєння змінної**. Об’єкти під `const` можна мутувати через їх властивості.',
                    theoryEN: '❌ `const` only forbids **reassignment of the variable**. Objects under `const` can still be mutated via their properties.',
                    isCorrect: false
                },
                {
                    textUK: 'Методи `String` (наприклад, `toUpperCase`) змінюють існуючий рядок без створення нового.',
                    textEN: 'String methods (e.g., `toUpperCase`) modify the existing string without creating a new one.',
                    theoryUK: '❌ Рядки immutable: методи повертають **новий** рядок. `s.toUpperCase()` не змінює `s` доки ви не переприсвоїте.',
                    theoryEN: '❌ Strings are immutable: methods return a **new** string. `s.toUpperCase()` doesn’t change `s` unless you reassign.',
                    isCorrect: false
                },
                {
                    textUK: 'Переприсвоєння змінної з примітивом змінює посилання змінної, але не мутує старе значення.',
                    textEN: 'Reassigning a variable holding a primitive changes the variable’s reference but doesn’t mutate the old value.',
                    theoryUK: '✅ Так. Стара «версія» значення лишається незмінною; змінна просто вказує на нове значення.',
                    theoryEN: '✅ Correct. The old value remains unchanged; the variable just points to a new value.',
                    isCorrect: true
                },
                {
                    textUK: 'Імм’ютабельність означає, що примітиви зберігаються у стеку, а об’єкти — у heap.',
                    textEN: 'Immutability means primitives are stored on the stack and objects on the heap.',
                    theoryUK: '❌ Місце зберігання — окрема модель. Імм’ютабельність — про **поведінку значення**, а не про розміщення в пам’яті.',
                    theoryEN: '❌ Storage location is a separate model. Immutability is about **value behavior**, not memory placement.',
                    isCorrect: false
                },
                {
                    textUK: "Створивши `new String('a')`, ми робимо примітивний рядок мутованим.",
                    textEN: "By creating `new String('a')`, we make the primitive string mutable.",
                    theoryUK: "❌ `new String('a')` повертає **об’єкт**, окремий від примітиву. Сам примітив не стає мутованим.",
                    theoryEN: "❌ `new String('a')` returns an **object**, separate from the primitive. The primitive doesn’t become mutable.",
                    isCorrect: false
                },
                {
                    textUK: "Окремий символ у рядку можна змінити індексацією: `s[0] = 'H'`.",
                    textEN: "You can change an individual string character via indexing: `s[0] = 'H'`.",
                    theoryUK: '❌ Індексація рядка в JS — тільки для читання; спроба запису ігнорується.',
                    theoryEN: '❌ String indexing in JS is read-only; write attempts are ignored.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Що з наведеного коректно описує особливість `typeof null` і як правильно перевіряти `null`?',
            textEN: 'Which statements correctly describe the `typeof null` quirk and the right way to check for `null`?',
            theoryUK:
                "### `typeof null === 'object'` — історична особливість\n- У JS `null` — **примітив**, що позначає відсутність значення.\n- Водночас `typeof null === 'object'` — **помилка дизайну**, збережена заради зворотної сумісності.\n- **Надійна перевірка** на `null` — це **строге порівняння** `value === null`.\n- Для більш детальної ідентифікації можна використати `Object.prototype.toString.call(value)`, яке для `null` повертає `\"[object Null]\"`.\n\n```js\ntypeof null; // 'object' (історичний баг)\nvalue === null; // надійна перевірка саме на null\nObject.prototype.toString.call(null); // '[object Null]'\n```",
            theoryEN:
                "### `typeof null === 'object'` — historical quirk\n- In JS, `null` is a **primitive** meaning \"no value\".\n- Yet `typeof null === 'object'` is a **design bug** kept for compatibility.\n- The **reliable check** for `null` is **strict equality**: `value === null`.\n- For finer identification use `Object.prototype.toString.call(value)`, which yields `\"[object Null]\"` for `null`.\n\n```js\ntypeof null; // 'object' (historical bug)\nvalue === null; // reliable, strict check for null\nObject.prototype.toString.call(null); // '[object Null]'\n```",
            answers: [
                {
                    textUK: "`typeof null === 'object'` — так, але `null` все одно примітив.",
                    textEN: "`typeof null === 'object'` — yes, but `null` is still a primitive.",
                    theoryUK: '✅ Це ключове: `null` — примітив, а результат `typeof` тут — історична помилка.',
                    theoryEN: '✅ Key point: `null` is primitive; the `typeof` result here is a historical bug.',
                    isCorrect: true
                },
                {
                    textUK: 'Надійний спосіб перевірити саме `null` — це `value === null`.',
                    textEN: 'A reliable way to test for `null` is `value === null`.',
                    theoryUK: '✅ Строге порівняння не сплутає `null` з `undefined` або іншими значеннями.',
                    theoryEN: "✅ Strict equality won't confuse `null` with `undefined` or anything else.",
                    isCorrect: true
                },
                {
                    textUK: "`typeof null === 'null'` — саме так і повинно бути.",
                    textEN: "`typeof null === 'null'` — that's how it should be.",
                    theoryUK: "❌ Насправді повертається `'object'`; це і є історична аномалія.",
                    theoryEN: "❌ It actually returns `'object'`; that's the historical anomaly.",
                    isCorrect: false
                },
                {
                    textUK: "`null` — це об'єкт, бо `typeof` так каже.",
                    textEN: '`null` is an object because `typeof` says so.',
                    theoryUK: '❌ Висновок помилковий: `null` — примітив попри результат `typeof`.',
                    theoryEN: '❌ Wrong conclusion: `null` is a primitive despite `typeof`.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Що вірно щодо об’єктів-обгорток `new String/Number/Boolean` і їх поведінки?',
            textEN: 'What is true about wrapper objects `new String/Number/Boolean` and their behavior?',
            theoryUK:
                "### Обгортки примітивів: чому їх краще уникати\n- `new String('a')`, `new Number(0)`, `new Boolean(false)` створюють **ОБ’ЄКТИ**, а не примітиви.\n- Це впливає на `typeof`, порівняння та істинність у умовах.\n- **Проблемні місця**:\n  - `Boolean(new Boolean(false)) === true` — бо будь-який об’єкт істинний.\n  - `'a' === new String('a')` → `false` (різні типи), але `'a' == new String('a')` → `true` (неявне розпакування).\n  - `new Number(0) === 0` → `false`, тоді як `new Number(0) == 0` → `true`.\n- Краще використовувати **літерали/примітиви**, а не конструктори-обгортки.",
            theoryEN:
                "### Wrapper objects: why to avoid them\n- `new String('a')`, `new Number(0)`, `new Boolean(false)` create **OBJECTS**, not primitives.\n- This affects `typeof`, comparisons, and truthiness.\n- **Gotchas**:\n  - `Boolean(new Boolean(false)) === true` — any object is truthy.\n  - `'a' === new String('a')` → `false` (different types) while `'a' == new String('a')` → `true` (unboxing).\n  - `new Number(0) === 0` → `false`, but `new Number(0) == 0` → `true`.\n- Prefer **literals/primitives** over wrapper constructors.",
            answers: [
                {
                    textUK: "`new String('a')` — це об’єкт; `typeof new String('a') === 'object'`.",
                    textEN: "`new String('a')` is an object; `typeof new String('a') === 'object'`.",
                    theoryUK: '✅ Обгортка повертає об’єкт, не примітив.',
                    theoryEN: '✅ The wrapper returns an object, not a primitive.',
                    isCorrect: true
                },
                {
                    textUK: "`'a' === new String('a')` дає `true`.",
                    textEN: "`'a' === new String('a')` yields `true`.",
                    theoryUK: '❌ Строге порівняння різних типів: примітив vs об’єкт → `false`.',
                    theoryEN: '❌ Strictly comparing different types: primitive vs object → `false`.',
                    isCorrect: false
                },
                {
                    textUK: "`'a' == new String('a')` може дати `true` через неявне розпакування (ToPrimitive).",
                    textEN: "`'a' == new String('a')` can be `true` due to implicit unboxing (ToPrimitive).",
                    theoryUK: '✅ `==` викликає перетворення типів; обгортка розпаковується до рядка.',
                    theoryEN: '✅ `==` performs coercion; the wrapper is unboxed to a string.',
                    isCorrect: true
                },
                {
                    textUK: '`Boolean(new Boolean(false))` дорівнює `false`.',
                    textEN: '`Boolean(new Boolean(false))` equals `false`.',
                    theoryUK: '❌ Будь-який об’єкт істинний → результат буде `true`.',
                    theoryEN: '❌ Any object is truthy → result is `true`.',
                    isCorrect: false
                },
                {
                    textUK: '`new Number(0) === 0` — `true`.',
                    textEN: '`new Number(0) === 0` is `true`.',
                    theoryUK: '❌ Об’єкт не дорівнює примітиву за `===`; це `false`.',
                    theoryEN: '❌ An object is not strictly equal to a primitive; it’s `false`.',
                    isCorrect: false
                },
                {
                    textUK: '`new Number(0) == 0` — `true`.',
                    textEN: '`new Number(0) == 0` is `true`.',
                    theoryUK: '✅ За `==` відбувається приведення: об’єкт → примітивне число `0`.',
                    theoryEN: '✅ With `==`, coercion unboxes the object to the primitive number `0`.',
                    isCorrect: true
                },
                {
                    textUK: 'У звичайному коді краще уникати `new String/Number/Boolean`.',
                    textEN: 'In everyday code you should avoid `new String/Number/Boolean`.',
                    theoryUK: '✅ Вони створюють об’єкти з нестандартною поведінкою у порівняннях і логічних виразах.',
                    theoryEN: '✅ They create objects with surprising comparison and truthiness behavior.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Функції в JS: що з наведеного істинно щодо їх природи як об’єктів і `[[Call]]`?',
            textEN: 'Functions in JS: which statements are true about their object nature and `[[Call]]`?',
            theoryUK:
                "### Функції — це об’єкти з внутрішньою здатністю виклику\n- Функція — **об’єкт**, що має внутрішнє `[[Call]]` (викликається як `f()`), а звичайні об’єкти — ні.\n- `typeof f === 'function'`, але це **окреме позначення типу** для викликаємих об’єктів; при цьому `f instanceof Object` теж `true`.\n- Функції успадковують від `Function.prototype`, мають властивості (`name`, `length`) і можуть отримувати довільні власні властивості.\n- Порівняння функцій — **за посиланням**.\n- Стрілкові функції мають `[[Call]]`, але **не** мають `[[Construct]`], тому `new (()=>{})` — помилка.",
            theoryEN:
                "### Functions are objects with an internal callable capability\n- A function is an **object** that has `[[Call]]` (invoked via `f()`); plain objects don’t.\n- `typeof f === 'function'` is a special tag for callable objects; still, `f instanceof Object` is `true`.\n- Functions inherit from `Function.prototype`, have properties (`name`, `length`), and can hold arbitrary own properties.\n- Functions are compared **by reference**.\n- Arrow functions have `[[Call]]` but **no** `[[Construct]]`, so `new (()=>{})` throws.",
            answers: [
                {
                    textUK: 'Функції — це об’єкти, що мають внутрішнє `[[Call]]`, тому їх можна викликати як `f()`.',
                    textEN: 'Functions are objects that have `[[Call]]`, hence you can invoke them as `f()`.',
                    theoryUK: '✅ Це базове визначення відмінності функції від звичайного об’єкта.',
                    theoryEN: '✅ This is the defining difference between functions and plain objects.',
                    isCorrect: true
                },
                {
                    textUK: "`typeof function(){} === 'function'`.",
                    textEN: "`typeof function(){} === 'function'`.",
                    theoryUK: '✅ Так рушій позначає викликаємі об’єкти.',
                    theoryEN: '✅ That’s how the engine tags callable objects.',
                    isCorrect: true
                },
                {
                    textUK: '`f instanceof Function` і `f instanceof Object` зазвичай обидва `true`.',
                    textEN: '`f instanceof Function` and `f instanceof Object` are typically both `true`.',
                    theoryUK: '✅ Функції успадковують від `Function.prototype`, а той — від `Object.prototype`.',
                    theoryEN: '✅ Functions inherit from `Function.prototype`, which in turn inherits from `Object.prototype`.',
                    isCorrect: true
                },
                {
                    textUK: 'Функції — примітиви, тому порівнюються за значенням.',
                    textEN: 'Functions are primitives and thus compared by value.',
                    theoryUK: '❌ Функції — об’єкти; порівнюються **за посиланням**.',
                    theoryEN: '❌ Functions are objects; they are compared **by reference**.',
                    isCorrect: false
                },
                {
                    textUK: 'Стрілкові функції не мають `[[Construct]]`, тому `new (()=>{})` кине помилку.',
                    textEN: 'Arrow functions lack `[[Construct]]`, so `new (()=>{})` throws.',
                    theoryUK: '✅ Стрілки викликаються, але не можуть бути конструкторами.',
                    theoryEN: '✅ Arrows are callable but not constructible.',
                    isCorrect: true
                },
                {
                    textUK: "`typeof` для будь-якої функції повертає `'object'`.",
                    textEN: "`typeof` for any function returns `'object'`.",
                    theoryUK: "❌ Для функцій воно повертає `'function'`.",
                    theoryEN: "❌ For functions it returns `'function'`.",
                    isCorrect: false
                },
                {
                    textUK: 'Функціям не можна додавати власні властивості (це дозволено лише об’єктам).',
                    textEN: 'You cannot add your own properties to functions (only objects can).',
                    theoryUK: '❌ Функції — це об’єкти, властивості можна додавати: `f.meta = 1`.',
                    theoryEN: '❌ Functions are objects; you can add properties like `f.meta = 1`.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        }
    ]
};
