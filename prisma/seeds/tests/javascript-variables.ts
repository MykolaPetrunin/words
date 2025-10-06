import { TopicMock } from '../types';

export const tests: TopicMock = {
    titleUK: 'Змінні',
    titleEN: 'Variables',
    questions: [
        {
            textUK: 'Hoisting: чим відрізняється поведінка var, let та const? (демонстрація TDZ)',
            textEN: 'Hoisting: how do var, let and const differ? (TDZ demonstration)',
            theoryUK:
                '### Теорія: Hoisting і TDZ\n\n**Hoisting** — це етап створення контексту виконання, коли рушій JS заздалегідь реєструє ідентифікатори змінних та функцій.\n\n- `var` **піднімається** з початковим значенням `undefined` і створює *mutable binding* одразу на етапі створення. Доступ до змінної **до** фактичного оголошення не кидає помилку, а дає `undefined` (читання) — але присвоєння працює.\n- `let`/`const` теж піднімаються (їх імена відомі рушію), але їхні *bindings* потрапляють у **Temporal Dead Zone (TDZ)** — інтервал від початку області видимості до рядка ініціалізації. Будь-який доступ **до ініціалізації** кидає `ReferenceError`.\n- `const` додатково вимагає **ініціалізації при оголошенні** (інакше — синтаксична помилка).\n- **Function Declaration** повністю піднімається як ціле значення (функція стає доступною до оголошення), тоді як **Function Expression** залежить від змінної, що її зберігає (тобто правила `var/let/const`).\n\n#### Приклад\n```js\nconsole.log(a);    // undefined (var піднятий з undefined)\n// console.log(b); // ReferenceError (b у TDZ)\n// console.log(c); // ReferenceError (c у TDZ)\nvar a = 1;\nlet b = 2;\nconst c = 3;\n```\n\n#### Вкладені блоки\n`let/const` мають блокову область; TDZ діє в кожному блоці окремо.\n\n#### Чому TDZ потрібна?\nTDZ робить поведінку передбачуванішою: забороняє використання потенційно неініціалізованих значень і прибирає неочевидність `undefined` для `let/const`.',
            theoryEN:
                '### Theory: Hoisting and TDZ\n\n**Hoisting** is the creation phase of an execution context when the JS engine pre-registers variable and function identifiers.\n\n- `var` **is hoisted** with an initial value of `undefined` and gets a mutable binding immediately. Reading it **before** the declaration yields `undefined` (no error); assignments also work.\n- `let`/`const` names are hoisted too, but their bindings reside in the **Temporal Dead Zone (TDZ)** from the start of the scope until the initialization line. Any access **before initialization** throws a `ReferenceError`.\n- `const` additionally **must be initialized** at declaration time (otherwise a syntax error).\n- **Function Declarations** are hoisted as full values (callable before their line), while **Function Expressions** follow the hosting rules of their variable (`var/let/const`).\n\n#### Example\n```js\nconsole.log(a);    // undefined (var hoisted with undefined)\n// console.log(b); // ReferenceError (b in TDZ)\n// console.log(c); // ReferenceError (c in TDZ)\nvar a = 1;\nlet b = 2;\nconst c = 3;\n```\n\n#### Nested blocks\n`let/const` are block-scoped; TDZ applies per block.\n\n#### Why TDZ?\nTDZ prohibits using potentially uninitialized bindings, removing the `undefined` surprise for `let/const` and improving predictability.',
            answers: [
                {
                    textUK: '`var` доступний до оголошення і має значення `undefined`.',
                    textEN: '`var` is accessible before its declaration and has the value `undefined`.',
                    theoryUK:
                        'Це **вірно**: при hoisting для `var` створюється binding з початковим значенням `undefined`, тож читання до рядка оголошення повертає `undefined`.',
                    theoryEN: 'This is **true**: `var` is hoisted with an initial `undefined` binding, so reads before the declaration line evaluate to `undefined`.',
                    isCorrect: true
                },
                {
                    textUK: '`let` піднімається як і `var`, але також ініціалізується `undefined`.',
                    textEN: '`let` is hoisted like `var` and also initialized to `undefined`.',
                    theoryUK: 'Невірно: `let` піднімається **без** ініціалізації; до ініціалізації змінна перебуває у TDZ і доступ спричиняє `ReferenceError`.',
                    theoryEN: 'Incorrect: `let` is hoisted **without** initialization; until initialized it is in the TDZ and any access throws `ReferenceError`.',
                    isCorrect: false
                },
                {
                    textUK: '`const` має TDZ і потребує ініціалізації в момент оголошення.',
                    textEN: '`const` has a TDZ and must be initialized at declaration time.',
                    theoryUK: 'Вірно: `const` не лише у TDZ до ініціалізації, а ще й вимагає ініціалізації безпосередньо під час оголошення.',
                    theoryEN: 'True: `const` is subject to TDZ before initialization and also requires initialization at the declaration site.',
                    isCorrect: true
                },
                {
                    textUK: 'Function Declaration **не** піднімається; виклик до оголошення кидає помилку.',
                    textEN: 'Function Declarations are **not** hoisted; calling one before its line throws.',
                    theoryUK: 'Невірно: Function Declaration піднімається як повне значення (функція доступна до оголошення).',
                    theoryEN: 'Incorrect: Function Declarations are hoisted as full values and are callable before their declaration line.',
                    isCorrect: false
                },
                {
                    textUK: '`typeof x` для неоголошеного ідентифікатора не кидає, але для `let x` у TDZ — кидає.',
                    textEN: '`typeof x` for an undeclared identifier does not throw, but for `let x` inside TDZ it does throw.',
                    theoryUK:
                        'Вірно: спеціальний випадок — `typeof` не кидає для повністю відсутнього ідентифікатора, але при наявності `let/const` у TDZ буде `ReferenceError`.',
                    theoryEN:
                        'True: special case — `typeof` does not throw for an entirely undeclared identifier, yet it **does** throw when a `let/const` binding exists but is in TDZ.',
                    isCorrect: true
                },
                {
                    textUK: '`var` у вкладеному блоці має блокову область видимості й тому TDZ до нього не застосовується.',
                    textEN: '`var` inside a nested block is block-scoped, therefore TDZ does not apply to it.',
                    theoryUK: 'Невірно подвійно: `var` має **функціональну**, а не блокову область; і для `var` **немає** TDZ узагалі.',
                    theoryEN: 'Double-incorrect: `var` is **function-scoped**, not block-scoped; also `var` bindings **do not** have TDZ at all.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Reassignment vs Redeclaration: коли що дозволено для var, let, const?',
            textEN: 'Reassignment vs Redeclaration: what is allowed for var, let, const?',
            theoryUK:
                "### Теорія: Переприсвоєння (reassignment) та перевизначення (redeclaration)\n\n- **`var`**: можна **переприсвоювати** і **перевизначати в тій самій області** (навіть повторно оголошувати `var x;`). Повторне `var` просто ігнорується або перезаписує властивість у глобальному об'єкті (у скриптах).\n- **`let`**: можна **переприсвоювати**, **не можна перевизначати** в тій самій області. Спроба `let x; let x;` у тому ж блоці — `SyntaxError`.\n- **`const`**: **не можна переприсвоювати**, **не можна перевизначати** в тій самій області; потрібна ініціалізація при оголошенні. Важливо: `const` фіксує **зв'язок (binding)**, а не *глибоку* незмінність значення. Для об'єктів це означає, що **можна змінювати властивості**, але не можна переназначити саму змінну на інше посилання.\n- **Області**: у **іншому блоці** (навіть з тим самим ім'ям) `let/const` створить *інший* ідентифікатор — це *shadowing*, не redeclaration в одній області.\n\n#### Приклади\n```js\nvar a = 1; var a = 2; // ок, redeclaration\nlet b = 1; // b = 2;   // ок, reassignment\n// let b = 3;         // SyntaxError (та сама область)\nconst c = {x: 1};\nc.x = 2;             // ок, зміна властивості\n// c = {};            // TypeError: reassignment заборонено\n```\n\n> Пам'ятай: *redeclaration* перевіряється **в межах однієї області**, *reassignment* — це операція над уже створеним binding.",
            theoryEN:
                '### Theory: Reassignment vs Redeclaration\n\n- **`var`**: allows **reassignment** and **redeclaration in the same scope** (e.g., multiple `var x;`). A repeated `var` is effectively ignored or updates the global property in scripts.\n- **`let`**: allows **reassignment**, **no redeclaration** in the same scope. `let x; let x;` in the same block → `SyntaxError`.\n- **`const`**: **no reassignment**, **no redeclaration** in the same scope; must be initialized at declaration. Importantly, `const` fixes the **binding**, not deep immutability of the value. With objects you **may mutate properties** but cannot rebind the variable.\n- **Scopes**: in a **different block**, using the same name with `let/const` creates a *new* identifier — *shadowing*, not redeclaration in the same scope.\n\n#### Examples\n```js\nvar a = 1; var a = 2; // ok, redeclaration\nlet b = 1; // b = 2;   // ok, reassignment\n// let b = 3;         // SyntaxError (same scope)\nconst c = {x: 1};\nc.x = 2;             // ok, property mutation\n// c = {};            // TypeError: reassignment is forbidden\n```\n\n> Remember: *redeclaration* is checked **within the same scope**, *reassignment* operates on an existing binding.',
            answers: [
                {
                    textUK: '`var` можна і переприсвоювати, і перевизначати в тій самій області.',
                    textEN: '`var` can be both reassigned and redeclared in the same scope.',
                    theoryUK: 'Вірно: `var` допускає обидві операції в межах однієї функції/глобальної області (для скриптів).',
                    theoryEN: 'True: `var` allows both operations within the same function/global scope (for scripts).',
                    isCorrect: true
                },
                {
                    textUK: '`let` дозволяє переприсвоєння, але забороняє перевизначення в тій самій області.',
                    textEN: '`let` allows reassignment but disallows redeclaration in the same scope.',
                    theoryUK: 'Вірно: `let x; x = 2;` — ок; `let x; let x;` — `SyntaxError`.',
                    theoryEN: 'True: `let x; x = 2;` is fine; `let x; let x;` yields `SyntaxError`.',
                    isCorrect: true
                },
                {
                    textUK: '`const` забороняє переприсвоєння, але дозволяє перевизначення в тій самій області.',
                    textEN: '`const` forbids reassignment but allows redeclaration in the same scope.',
                    theoryUK: 'Невірно: `const` забороняє **обидва** — і reassignment, і redeclaration в одній області.',
                    theoryEN: 'Incorrect: `const` forbids **both** reassignment and redeclaration within the same scope.',
                    isCorrect: false
                },
                {
                    textUK: "Зміна властивості об'єкта, оголошеного через `const`, є валідною і не є переприсвоєнням.",
                    textEN: 'Mutating a property of an object declared with `const` is valid and is not a reassignment.',
                    theoryUK: 'Вірно: `const` фіксує binding, а не робить значення глибоко незмінним.',
                    theoryEN: 'True: `const` fixes the binding; it does not enforce deep immutability.',
                    isCorrect: true
                },
                {
                    textUK: 'Два оголошення `let x` у різних блоках — це помилка redeclaration.',
                    textEN: 'Two `let x` declarations in different blocks is a redeclaration error.',
                    theoryUK: 'Невірно: це **shadowing** у різних областях, не redeclaration в одній і тій самій області.',
                    theoryEN: "Incorrect: that's **shadowing** across different scopes, not redeclaration in the same scope.",
                    isCorrect: false
                },
                {
                    textUK: '`var` у модулі (ESM) можна оголосити двічі на верхньому рівні без помилки.',
                    textEN: 'Top-level `var` in an ES module can be declared twice without error.',
                    theoryUK:
                        'Підступно: у модулях верхній рівень — **не глобальна область скрипта**; повторне оголошення в одному модулі призведе до **SyntaxError**, бо це та сама область (module scope).',
                    theoryEN:
                        'Tricky: in ES modules the top level is **module scope**, not script global; redeclaring in the same module results in **SyntaxError** (same scope).',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: "`var` у глобальній області: чи створює він властивість глобального об'єкта (window/globalThis)?",
            textEN: '`var` in the global scope: does it create a property on the global object (window/globalThis)?',
            theoryUK:
                "### Теорія: Глобальний об'єкт і `var`\n\nУ **скриптах** (не модулях) верхньорівневе `var` в браузері створює **властивість глобального об'єкта** (`window`) і стає частиною **Object Environment Record** глобального середовища. Також top-level Function Declaration стає властивістю глобального об'єкта.\n\n- `let/const` на верхньому рівні створюють **глобальні bindings** у **Declarative Environment Record**, **не** стаючи властивостями глобального об'єкта.\n- У **ES-модулях** верхній рівень — *module scope*, а не глобальний; `var` **не** створює глобальну властивість і не «витікає» у `window`.\n- У середовищах без `window` (наприклад, Worker або Node.js) глобальний об'єкт інший (`self`, `global`, `globalThis`), але загальна ідея для **скриптів** лишається: top-level `var` стає властивістю відповідного глобального об'єкта.\n- `'use strict'` **не скасовує** факт створення властивості для top-level `var` у скриптах; він впливає на інші речі (наприклад, `this` усередині функцій, заборона неявних глобальних змінних тощо).\n\n#### Приклад (скрипт, не модуль)\n```html\n<script>\n  var x = 1;\n  let y = 2;\n  console.log(window.x); // 1\n  console.log('y' in window); // false\n</script>\n```\n\n#### Приклад (модуль)\n```html\n<script type=\"module\">\n  var x = 1;\n  console.log('x' in window); // false — module scope, не глобальна властивість\n</script>\n```",
            theoryEN:
                "### Theory: Global object and `var`\n\nIn **scripts** (not modules), top-level `var` in browsers creates a **property on the global object** (`window`), becoming part of the global **Object Environment Record**. Top-level Function Declarations also become properties on the global object.\n\n- Top-level `let/const` create **global bindings** in the **Declarative Environment Record** and **do not** become properties of the global object.\n- In **ES modules**, the top level is *module scope*, not the global one; `var` **does not** create a global property and does not leak onto `window`.\n- In environments without `window` (e.g., Worker or Node.js), the global object differs (`self`, `global`, `globalThis`), yet for **scripts** the idea stands: top-level `var` becomes a property of the corresponding global object.\n- `'use strict'` **does not cancel** this behavior for top-level `var` in scripts; it affects other semantics (e.g., `this` in functions, banning implicit globals, etc.).\n\n#### Example (script, not module)\n```html\n<script>\n  var x = 1;\n  let y = 2;\n  console.log(window.x); // 1\n  console.log('y' in window); // false\n</script>\n```\n\n#### Example (module)\n```html\n<script type=\"module\">\n  var x = 1;\n  console.log('x' in window); // false — module scope, not a global property\n</script>\n```",
            answers: [
                {
                    textUK: 'У скрипті верхньорівневий `var` стає властивістю `window`.',
                    textEN: 'In a script, a top-level `var` becomes a property of `window`.',
                    theoryUK: "Вірно: для скриптів глобальне середовище має об'єктну частину; `var` додає властивість до глобального об'єкта.",
                    theoryEN: 'True: scripts use a global object record; `var` adds a property to the global object.',
                    isCorrect: true
                },
                {
                    textUK: 'У модулі верхньорівневий `var` так само стає властивістю `window`.',
                    textEN: 'In a module, a top-level `var` also becomes a property of `window`.',
                    theoryUK: "Невірно: модулі мають окрему область — module scope; `var` не витікає у глобальний об'єкт.",
                    theoryEN: 'Incorrect: modules have their own scope; `var` does not leak to the global object.',
                    isCorrect: false
                },
                {
                    textUK: "Верхньорівневі `let/const` **не** стають властивостями глобального об'єкта.",
                    textEN: 'Top-level `let/const` **do not** become properties of the global object.',
                    theoryUK: 'Вірно: вони зберігаються у Declarative Environment Record і не додаються до `window`.',
                    theoryEN: 'True: they live in the Declarative Environment Record, not on `window`.',
                    isCorrect: true
                },
                {
                    textUK: "У `'use strict'` top-level `var` у скрипті перестає створювати глобальну властивість.",
                    textEN: "With `'use strict'`, top-level `var` in a script stops creating a global property.",
                    theoryUK: 'Невірно: strict mode не скасовує це правило; вплив стосується інших аспектів (наприклад, `this` всередині функцій).',
                    theoryEN: 'Incorrect: strict mode does not change this; it affects other semantics (e.g., function `this`).',
                    isCorrect: false
                },
                {
                    textUK: 'У Worker середовищі top-level `var` у скрипті стає властивістю `self`/`globalThis`, а не `window`.',
                    textEN: 'In a Worker, top-level `var` in a script becomes a property of `self`/`globalThis`, not `window`.',
                    theoryUK: "Вірно: глобальний об'єкт відрізняється; ідея лишається — властивість глобального об'єкта середовища.",
                    theoryEN: "True: the global object differs; the idea remains — a property on that environment's global object.",
                    isCorrect: true
                },
                {
                    textUK: "Top-level Function Declaration у скрипті також стає властивістю глобального об'єкта.",
                    textEN: 'A top-level Function Declaration in a script also becomes a property of the global object.',
                    theoryUK: "Вірно: як і `var`, декларація функції з'являється як властивість глобального об'єкта у скриптах.",
                    theoryEN: 'True: like `var`, a function declaration appears as a property of the global object in scripts.',
                    isCorrect: true
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'const і об’єкти: чи можна змінювати властивості об’єкта, оголошеного через const?',
            textEN: 'const and objects: can you mutate properties of an object declared with const?',
            theoryUK:
                "### Теорія: `const` фіксує **зв'язок (binding)**, а не робить значення глибоко незмінним\n\n- Ключове: `const` **забороняє переприсвоєння змінної** (rebinding), але **не** забороняє зміну *вмісту* об'єкта, на який ця змінна посилається.\n- Отже, для\n  - **примітивів**: ви не можете присвоїти нове значення змінній `const` — це призведе до `TypeError`.\n  - **об'єктів/масивів/функцій**: можна **змінювати властивості/елементи** (мутація), але не можна **перепризначити** саму змінну на інший об'єкт/масив/функцію.\n- `const` **не** вмикає автоматично `Object.freeze()` або будь-яку іншу глибоку іммутабельність. Якщо потрібна незмінність — застосовуйте `Object.freeze()` (поверхневу) або бібліотеки/патерни для **глибокого** freeze.\n- Важливо відрізняти: \n  - **Immutability of binding** (що робить `const`) vs \n  - **Immutability of value** (чого `const` не гарантує).\n\n#### Приклади\n```js\nconst user = { name: 'Ada' };\nuser.name = 'Grace';   // ✅ ок, мутація властивості\n// user = { name: 'Alan' }; // ❌ TypeError: reassignment заборонено\n\nconst nums = [1, 2];\nnums.push(3);          // ✅ ок, мутація масиву\n// nums = [];          // ❌ TypeError: reassignment\n\nconst frozen = Object.freeze({ a: 1 });\n// frozen.a = 2;       // ❌ ігнорується або TypeError у strict mode\n```\n\n> **Strict mode** не змінює семантику `const` щодо мутації об'єкта; він лише впливає на поведінку помилок (наприклад, заборонені тихі присвоєння).",
            theoryEN:
                "### Theory: `const` fixes the **binding**, not deep immutability\n\n- Key point: `const` **forbids reassigning the variable** (rebinding) but **does not** prevent mutating the *contents* of the referenced object.\n- So for\n  - **primitives**: you cannot assign a new value to a `const` variable — this throws `TypeError`.\n  - **objects/arrays/functions**: you **may mutate** properties/elements, but you cannot **rebind** the variable to a different object/array/function.\n- `const` **does not** automatically call `Object.freeze()` nor provide deep immutability. For immutability, use `Object.freeze()` (shallow) or libraries/patterns for **deep** freezing.\n- Distinguish between:\n  - **Immutability of the binding** (what `const` provides) vs\n  - **Immutability of the value** (which `const` does **not** guarantee).\n\n#### Examples\n```js\nconst user = { name: 'Ada' };\nuser.name = 'Grace';   // ✅ ok, property mutation\n// user = { name: 'Alan' }; // ❌ TypeError: reassignment forbidden\n\nconst nums = [1, 2];\nnums.push(3);          // ✅ ok, array mutation\n// nums = [];          // ❌ TypeError: reassignment\n\nconst frozen = Object.freeze({ a: 1 });\n// frozen.a = 2;       // ❌ ignored or TypeError in strict mode\n```\n\n> **Strict mode** does not change `const` semantics around object mutation; it mainly affects error behavior (e.g., forbids silent assignments).",
            answers: [
                {
                    textUK: 'Можна змінювати властивості об’єкта, оголошеного через `const`, але не можна переприсвоїти змінну на інший об’єкт.',
                    textEN: 'You can mutate properties of an object declared with `const`, but you cannot reassign the variable to a different object.',
                    theoryUK: 'Це **вірно**: `const` фіксує binding, тож мутація вмісту дозволена, а переприсвоєння — ні.',
                    theoryEN: 'This is **true**: `const` fixes the binding; content mutation is allowed, reassignment is not.',
                    isCorrect: true
                },
                {
                    textUK: '`const` робить об’єкт глибоко незмінним (аналог `Object.freeze()` для всієї глибини).',
                    textEN: '`const` makes the object deeply immutable (like `Object.freeze()` for full depth).',
                    theoryUK: 'Невірно: `const` не надає жодної іммутабельності значення; він лише забороняє **переприсвоєння змінної**.',
                    theoryEN: 'Incorrect: `const` provides no value immutability; it only forbids **reassigning the variable**.',
                    isCorrect: false
                },
                {
                    textUK: 'Для масиву, оголошеного через `const`, виклик `push()`/`pop()` дозволений.',
                    textEN: 'For an array declared with `const`, calling `push()`/`pop()` is allowed.',
                    theoryUK: 'Вірно: це мутація масиву, а не переприсвоєння змінної.',
                    theoryEN: 'True: this mutates the array, not the variable binding.',
                    isCorrect: true
                },
                {
                    textUK: 'У strict mode `const` автоматично еквівалентний `Object.freeze()`.',
                    textEN: 'In strict mode `const` automatically equals `Object.freeze()`.',
                    theoryUK: 'Невірно: strict mode не змінює факт, що `const` не фрізить значення.',
                    theoryEN: 'Incorrect: strict mode does not make `const` freeze the value.',
                    isCorrect: false
                },
                {
                    textUK: 'Переприсвоєння змінної `const` призводить до `TypeError` у час виконання.',
                    textEN: 'Reassigning a `const` variable results in a `TypeError` at runtime.',
                    theoryUK: 'Вірно: спроба `const x = 1; x = 2;` викликає `TypeError`.',
                    theoryEN: 'True: attempting `const x = 1; x = 2;` throws `TypeError`.',
                    isCorrect: true
                },
                {
                    textUK: '`Object.freeze()` застосовується автоматично до будь-якого об’єкта, створеного через `const`.',
                    textEN: '`Object.freeze()` is applied automatically to any object created with `const`.',
                    theoryUK: 'Невірно: `Object.freeze()` треба викликати вручну; `const` цього не робить.',
                    theoryEN: 'Incorrect: `Object.freeze()` must be called explicitly; `const` does not do this.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: '`let` у циклах: як створюється нова лексична змінна на кожну ітерацію `for`?',
            textEN: '`let` in loops: how is a new lexical variable created per iteration of `for`?',
            theoryUK:
                "### Теорія: пер-ітераційні лексичні оточення для `let`\n\n- Для циклів `for`, `for...in`, `for...of` змінна, оголошена через `let` у заголовку, отримує **новий лексичний binding на кожну ітерацію**. Це визначено механізмом **CreatePerIterationEnvironment** у специфікації.\n- Наслідок: **замикання**, створені всередині ітерації (колбеки, таймери, проміси), «бачать» **свою копію** змінної.\n- Це протилежно до `var`, який має **єдиний** binding на весь цикл (функціональна область видимості).\n- TDZ: навіть у тілі циклу **існує TDZ** від початку блоку до точки оголошення (якщо `let` оголошено у тілі). У заголовку `for (let i = ...)` binding ініціалізується ще до входу в тіло ітерації.\n\n#### Приклади\n```js\n// Класичний приклад з таймером: отримаємо 0,1,2\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n\n// for...of / for...in також створюють пер-ітераційний binding\nfor (let x of ['a','b']) {\n  Promise.resolve().then(() => console.log(x)); // 'a', 'b'\n}\n\n// TDZ у тілі\nfor (let j = 0; j < 1; j++) {\n  // console.log(k); // ReferenceError (TDZ)\n  let k = 10;\n}\n```\n\n> Пер-ітераційний binding — це не «копія за значенням», а **окремий лексичний запис** з власною поточною величиною.",
            theoryEN:
                "### Theory: per-iteration lexical environments for `let`\n\n- In `for`, `for...in`, and `for...of` loops, a `let` declared in the header gets a **new lexical binding each iteration**. This is mandated by the **CreatePerIterationEnvironment** mechanism in the spec.\n- Consequence: **closures** created within an iteration (callbacks, timers, promises) capture **their own** variable.\n- This contrasts with `var`, which has **one** binding for the entire loop (function scope).\n- TDZ: even inside the loop body there is a **TDZ** from the start of the block to the declaration point (when `let` is declared inside the body). In `for (let i = ...)`, the binding is initialized before entering the iteration body.\n\n#### Examples\n```js\n// Classic timer example: logs 0,1,2\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n\n// for...of / for...in also create per-iteration bindings\nfor (let x of ['a','b']) {\n  Promise.resolve().then(() => console.log(x)); // 'a', 'b'\n}\n\n// TDZ in the body\nfor (let j = 0; j < 1; j++) {\n  // console.log(k); // ReferenceError (TDZ)\n  let k = 10;\n}\n```\n\n> The per-iteration binding is not a “copy by value”; it is a **separate lexical record** with its own current value.",
            answers: [
                {
                    textUK: 'Кожна ітерація `for (let i = ...)` має **власний** binding `i`, тож замикання бачать відповідне значення.',
                    textEN: 'Each iteration of `for (let i = ...)` has its **own** binding `i`, so closures see the correct value.',
                    theoryUK: 'Вірно: саме це вирішує класичну проблему з `var` і асинхронними колбеками.',
                    theoryEN: 'True: this solves the classic `var` + async callbacks issue.',
                    isCorrect: true
                },
                {
                    textUK: 'Пер-ітераційний binding існує лише у `for...of`, але не у звичайному `for`.',
                    textEN: 'Per-iteration binding exists only in `for...of`, not in a regular `for`.',
                    theoryUK: 'Невірно: пер-ітераційні лексичні оточення застосовні і до звичайного `for` з `let`.',
                    theoryEN: 'Incorrect: per-iteration lexical environments also apply to regular `for` with `let`.',
                    isCorrect: false
                },
                {
                    textUK: 'Оператор `i++` модифікує **той самий** binding `i` у всіх ітераціях циклу з `let`.',
                    textEN: '`i++` modifies the **same** `i` binding across all iterations in a `let` loop.',
                    theoryUK:
                        'Невірно: у `for (let i...)` кожна ітерація має **окремий** binding; старе значення переноситься до нового binding за правилами створення середовища.',
                    theoryEN: 'Incorrect: in `for (let i...)` each iteration has a **separate** binding; the previous value is propagated into a new binding.',
                    isCorrect: false
                },
                {
                    textUK: 'У `for...in` та `for...of` з `let` колбеки захоплюють значення ключа/елемента окремо для кожної ітерації.',
                    textEN: 'In `for...in` and `for...of` with `let`, callbacks capture the key/element value separately per iteration.',
                    theoryUK: 'Вірно: створюється новий лексичний binding на ітерацію, що й дає правильне замикання.',
                    theoryEN: 'True: a new lexical binding per iteration yields correct closures.',
                    isCorrect: true
                },
                {
                    textUK: 'Використання `let` усуває TDZ усередині тіла циклу.',
                    textEN: 'Using `let` removes the TDZ inside the loop body.',
                    theoryUK: 'Невірно: TDZ існує для `let/const` від початку блоку до оголошення; це не зникає в циклах.',
                    theoryEN: 'Incorrect: TDZ still exists for `let/const` from block start to the declaration; loops do not remove it.',
                    isCorrect: false
                },
                {
                    textUK: 'Різниця з `var` полягає в тому, що `var` має один binding на весь цикл (функціональна область).',
                    textEN: 'The difference with `var` is that `var` has a single binding for the whole loop (function scope).',
                    theoryUK: 'Вірно: тому замикання з `var` часто «бачать» останнє значення.',
                    theoryEN: 'True: hence closures with `var` often “see” the final value.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: '`var` у циклах і асинхронності: чому всі колбеки часто «бачать» останнє значення?',
            textEN: '`var` in loops and asynchrony: why do callbacks often see the last value?',
            theoryUK:
                '### Теорія: один binding `var` + відкладене виконання\n\n- `var` має **функціональну** (не блокову) область видимості. У циклі `for (var i = 0; i < n; i++)` існує **один** binding `i` для всіх ітерацій.\n- Асинхронні колбеки (через `setTimeout`, `Promise.then`, тощо) виконуються **пізніше**, коли цикл уже завершено та `i` має **остаточне** значення `n`.\n- Отже, усі колбеки читають **той самий** binding `i`, який до моменту виконання має останнє значення.\n\n#### Класика\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 3, 3, 3\n}\n```\n\n#### Виправлення\n1) Використати `let` у заголовку:\n```js\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 0,1,2\n}\n```\n2) IIFE/функція-перенесення значення:\n```js\nfor (var i = 0; i < 3; i++) {\n  (function (j) { setTimeout(() => console.log(j), 0); })(i);\n}\n```\n3) Передати аргументи в `setTimeout` або використати `bind`:\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(console.log, 0, i);                 // 0,1,2\n  // або\n  setTimeout(console.log.bind(null, i), 0);      // 0,1,2 (i захоплено як аргумент)\n}\n```\n\n> Навіть `setTimeout(..., 0)` не означає синхронність: виклик ставиться у **чергу макрозавдань** і виконається після завершення поточної черги мікрозавдань/стеку.',
            theoryEN:
                '### Theory: single `var` binding + deferred execution\n\n- `var` is **function-scoped** (not block-scoped). In `for (var i = 0; i < n; i++)`, there is **one** `i` binding for all iterations.\n- Async callbacks (via `setTimeout`, `Promise.then`, etc.) run **later**, after the loop has finished and `i` holds its **final** value `n`.\n- Therefore, all callbacks read the **same** `i` binding which, by the time they execute, holds the last value.\n\n#### Classic\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 3, 3, 3\n}\n```\n\n#### Fixes\n1) Use `let` in the header:\n```js\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 0,1,2\n}\n```\n2) IIFE/value carrier function:\n```js\nfor (var i = 0; i < 3; i++) {\n  (function (j) { setTimeout(() => console.log(j), 0); })(i);\n}\n```\n3) Pass arguments to `setTimeout` or use `bind`:\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(console.log, 0, i);                 // 0,1,2\n  // or\n  setTimeout(console.log.bind(null, i), 0);      // 0,1,2 (i captured as an argument)\n}\n```\n\n> Even `setTimeout(..., 0)` is asynchronous: it enqueues a **macrotask** to run after the current microtask queue/stack completes.',
            answers: [
                {
                    textUK: 'Через `var` у циклі існує один binding `i`, тому асинхронні колбеки читають останнє значення.',
                    textEN: "With `var` in a loop there's a single `i` binding, so async callbacks read the final value.",
                    theoryUK: 'Вірно: усі колбеки звертаються до того самого `i`, який на момент виконання вже дорівнює `n`.',
                    theoryEN: 'True: all callbacks reference the same `i`, which equals `n` by execution time.',
                    isCorrect: true
                },
                {
                    textUK: 'Використання `let` в заголовку циклу усуває проблему, бо створюється новий binding на ітерацію.',
                    textEN: 'Using `let` in the loop header fixes it by creating a new binding per iteration.',
                    theoryUK: 'Вірно: `CreatePerIterationEnvironment` гарантує окремі лексичні змінні.',
                    theoryEN: 'True: `CreatePerIterationEnvironment` ensures separate lexical variables.',
                    isCorrect: true
                },
                {
                    textUK: "Додавання `'use strict'` робить `setTimeout(..., 0)` синхронним і розв’язує проблему.",
                    textEN: "Adding `'use strict'` makes `setTimeout(..., 0)` synchronous and solves the issue.",
                    theoryUK: 'Невірно: strict mode **не** змінює асинхронність таймерів і не впливає на модель черг завдань.',
                    theoryEN: 'Incorrect: strict mode does **not** change timer asynchrony or the task queue model.',
                    isCorrect: false
                },
                {
                    textUK: 'IIFE з параметром (або окрема функція) фіксує поточне значення `i` для кожного колбеку.',
                    textEN: 'An IIFE with a parameter (or a separate function) captures the current `i` for each callback.',
                    theoryUK: 'Вірно: значення `i` передається як аргумент і стає локальною змінною функції.',
                    theoryEN: 'True: the `i` value is passed as an argument and becomes the function’s local variable.',
                    isCorrect: true
                },
                {
                    textUK: '`setTimeout(fn, 0)` виконується синхронно в кінці ітерації циклу.',
                    textEN: '`setTimeout(fn, 0)` executes synchronously at the end of the loop iteration.',
                    theoryUK: 'Невірно: `setTimeout` завжди асинхронний; виклик потрапляє до черги макрозавдань.',
                    theoryEN: 'Incorrect: `setTimeout` is always asynchronous; it enqueues a macrotask.',
                    isCorrect: false
                },
                {
                    textUK: 'Передача аргументів у `setTimeout(fn, delay, i)` або використання `bind(null, i)` дозволяє кожному колбеку мати своє значення.',
                    textEN: 'Passing arguments via `setTimeout(fn, delay, i)` or using `bind(null, i)` lets each callback have its own value.',
                    theoryUK: 'Вірно: значення `i` фіксується як аргумент виклику; для примітивів воно копіюється за значенням у момент планування.',
                    theoryEN: "True: the `i` value is fixed as a call argument; for primitives it's copied by value at scheduling time.",
                    isCorrect: true
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Області видимості: чим відрізняються функціональна, блокова та глобальна? Наведіть правильні твердження.',
            textEN: 'Scopes: how do function, block, and global scope differ? Select all correct statements.',
            theoryUK:
                "### Теорія: функціональна, блокова та глобальна область видимості\n\nУ JavaScript **область видимості (scope)** визначає, звідки і як можна звертатися до ідентифікаторів (змінних, функцій, класів). Рушій оперує **лексичними середовищами (Lexical Environments)**, кожне з яких має **Environment Record** (де зберігаються біндінги) і посилання на **зовнішнє середовище** (outer environment).\n\n#### 1) Функціональна область (Function scope)\n- Створюється при вході у **тіло функції** або **Function Declaration/Expression**. \n- `var` має **функціональну** область (а не блокову). \n- Параметри функції також належать до функціональної області.\n\n#### 2) Блокова область (Block scope)\n- Будь-який блок `{ ... }` (у т.ч. тіла `if`, `for`, `while`, `try/catch`) створює **блокову** область для `let` та `const`.\n- Конструкція `catch (e)` створює **власну** блокову область для параметра `e`.\n- У заголовках `for (let i=...)` створюється **новий лексичний біндінг на ітерацію**.\n\n#### 3) Глобальна область (Global scope)\n- Найзовнішнє середовище програми. У **скриптах (не модулях)** браузера верхньорівневий `var` і топ-рівневі Function Declarations стають **властивостями глобального об'єкта** (`window`).\n- `let/const` на верхньому рівні **не** стають властивостями глобального об’єкта; вони зберігаються у **Declarative Environment Record**.\n- У **ES-модулях** ( `<script type=\"module\">` або `.mjs`) верхній рівень — **module scope**, а не глобальний: навіть `var` **не** стає властивістю `window`.\n\n#### Додаткові нюанси\n- **TDZ**: для `let/const` існує Temporal Dead Zone від початку області до ініціалізації.\n- **'use strict'** не змінює тип області, але впливає на інші семантики (наприклад, `this` у функціях, заборона неявних глобалів).\n\n```js\nfunction f(){\n  if (true){\n    var a = 1;      // функціональна область (видна в усій f)\n    let b = 2;      // блокова область (видна лише в цьому if-блоці)\n  }\n  console.log(a);   // 1\n  // console.log(b); // ReferenceError\n}\n```\n",
            theoryEN:
                "### Theory: function, block, and global scope\n\nJavaScript **scope** defines where identifiers can be accessed. Engines use **Lexical Environments** each holding an **Environment Record** and a reference to an **outer environment**.\n\n#### 1) Function scope\n- Created for function bodies / Function Declarations/Expressions.\n- `var` is **function-scoped** (not block-scoped).\n- Function parameters live in function scope.\n\n#### 2) Block scope\n- Any `{ ... }` block (including `if`, `for`, `while`, `try/catch`) creates **block scope** for `let`/`const`.\n- `catch (e)` introduces its own block scope for `e`.\n- `for (let i=...)` creates a **new binding per iteration**.\n\n#### 3) Global scope\n- The outermost environment. In **scripts (not modules)** in browsers, top-level `var` and Function Declarations become **properties of the global object** (`window`).\n- Top-level `let/const` do **not** become properties; they live in a **Declarative Environment Record**.\n- In **ES modules**, the top level is **module scope**, not global: even `var` **does not** leak to `window`.\n\n#### Extras\n- **TDZ**: `let/const` have a Temporal Dead Zone from block start to initialization.\n- **'use strict'** doesn’t change scope kinds but affects other semantics (e.g., `this`, implicit globals are banned).\n\n```js\nfunction f(){\n  if (true){\n    var a = 1;      // function scope\n    let b = 2;      // block scope\n  }\n  console.log(a);   // 1\n  // console.log(b); // ReferenceError\n}\n```\n",
            answers: [
                {
                    textUK: '`var` має функціональну (а не блокову) область видимості.',
                    textEN: '`var` is function-scoped (not block-scoped).',
                    theoryUK: 'Вірно: оголошення `var` у блоці `if/for` видиме у всій функції, де воно з’явилося.',
                    theoryEN: 'True: a `var` declared inside `if/for` is visible throughout the containing function.',
                    isCorrect: true
                },
                {
                    textUK: '`let/const` мають блокову область видимості та потрапляють у TDZ до ініціалізації.',
                    textEN: '`let/const` are block-scoped and are in TDZ until initialized.',
                    theoryUK: 'Вірно: блок `{}` формує нову область; доступ до `let/const` до ініціалізації кидає `ReferenceError`.',
                    theoryEN: 'True: a `{}` block scopes them; access before initialization throws `ReferenceError`.',
                    isCorrect: true
                },
                {
                    textUK: 'У скриптах верхньорівневий `var` стає властивістю `window`, а `let/const` — ні.',
                    textEN: 'In scripts, top-level `var` becomes a `window` property, while `let/const` do not.',
                    theoryUK: 'Вірно: це різниця між Object Environment Record та Declarative Environment Record у глобалі.',
                    theoryEN: 'True: global object vs declarative records differ in scripts.',
                    isCorrect: true
                },
                {
                    textUK: 'У ES-модулі верхній рівень — глобальна область, тому `var` додається до `window`.',
                    textEN: 'In ES modules the top level is global, so `var` is added to `window`.',
                    theoryUK: 'Невірно: у модулях верхній рівень — **module scope**; `var` не потрапляє на `window`.',
                    theoryEN: 'Incorrect: modules have **module scope**; `var` does not leak to `window`.',
                    isCorrect: false
                },
                {
                    textUK: '`catch (e)` створює власну блокову область для параметра помилки.',
                    textEN: '`catch (e)` creates its own block scope for the error parameter.',
                    theoryUK: 'Вірно: параметр `e` доступний лише всередині блоку `catch`.',
                    theoryEN: 'True: the `e` binding exists only within the `catch` block.',
                    isCorrect: true
                },
                {
                    textUK: "`'use strict'` перетворює всі `var` на блокову область видимості.",
                    textEN: "`'use strict'` turns all `var` into block scope.",
                    theoryUK: 'Невірно: strict mode не змінює тип області для `var`; він впливає на інші семантики.',
                    theoryEN: 'Incorrect: strict mode does not change `var` scoping; it affects other semantics.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Scope chain: як відбувається пошук змінних у лексичних середовищах?',
            textEN: 'Scope chain: how are variables resolved through lexical environments?',
            theoryUK:
                '### Теорія: ланцюг областей та лексичні середовища\n\nПри виконанні коду рушій тримає **поточне лексичне середовище** з посиланням на **зовнішнє середовище**. Пошук ідентифікатора відбувається за правилом **лексичної (статичної) області**:\n\n1. Шукаємо у **поточному Environment Record**.\n2. Якщо не знайдено — йдемо через **outer environment** (батьківські лексичні середовища).\n3. Якщо дійшли до глобального середовища і не знайшли — для **неоголошеного** ідентифікатора звертання призведе до `ReferenceError` (у нестрогому режимі присвоєння новій неоголошеній змінній створювало б неявний глобал, але strict це забороняє).\n\nКлючові факти:\n- **Лексичність** означає, що ланцюг визначається **місцем оголошення** функцій/блоків, а не місцем виклику.\n- **Замикання** зберігає посилання на потрібні зовнішні середовища навіть після повернення з функції.\n- **`this` не впливає на scope chain**: це окремий механізм прив’язки контексту виклику.\n- **Властивості об’єкта** не шукаються через scope chain: доступ `obj.x` звертається до самого об’єкта `obj` і його прототипного ланцюжка, а не до лексичних середовищ.\n- `with` (не рекомендовано) тимчасово додає об’єкт на початок ланцюга пошуку ідентифікаторів.\n\n```js\nconst x = 1;\nfunction outer(){\n  const y = 2;\n  return function inner(){\n    const z = 3;\n    console.log(x, y, z); // 1 2 3 — внутрішня функція бачить outer через лексичний ланцюг\n  }\n}\nouter()();\n```\n',
            theoryEN:
                '### Theory: scope chain and lexical environments\n\nDuring execution the engine keeps a **current Lexical Environment** with a reference to an **outer environment**. Identifier resolution follows **lexical (static) scoping**:\n\n1. Look in the **current Environment Record**.\n2. If missing, follow the **outer environment** chain.\n3. At the global end, unresolved identifiers cause a `ReferenceError` (in sloppy mode, assigning to an undeclared name could create an implicit global—strict mode forbids this).\n\nKey points:\n- **Lexical** means the chain is determined by the **declaration site**, not the call site.\n- **Closures** keep references to required outers even after the function returns.\n- **`this` does not affect the scope chain**; it’s a separate call-context mechanism.\n- **Object properties** are not found via the scope chain: `obj.x` accesses `obj` and its prototype chain, not lexical environments.\n- `with` (discouraged) temporarily places an object at the head of identifier lookup.\n\n```js\nconst x = 1;\nfunction outer(){\n  const y = 2;\n  return function inner(){\n    const z = 3;\n    console.log(x, y, z); // 1 2 3\n  }\n}\nouter()();\n```\n',
            answers: [
                {
                    textUK: 'Пошук ідентифікатора визначається місцем **оголошення** (лексична область), а не місцем виклику.',
                    textEN: 'Identifier lookup is determined by the **declaration site** (lexical scope), not the call site.',
                    theoryUK: 'Вірно: саме тому замикання працюють незалежно від того, де викликаються.',
                    theoryEN: 'True: closures work regardless of where they are invoked.',
                    isCorrect: true
                },
                {
                    textUK: '`this` впливає на побудову лексичного ланцюга пошуку змінних.',
                    textEN: '`this` affects how the lexical scope chain is built.',
                    theoryUK: 'Невірно: `this` — окремий механізм (контекст виклику), на scope chain не впливає.',
                    theoryEN: 'Incorrect: `this` is separate (call context) and does not alter the scope chain.',
                    isCorrect: false
                },
                {
                    textUK: 'Замикання зберігає посилання на необхідні зовнішні середовища навіть після повернення з функції.',
                    textEN: 'A closure retains references to needed outer environments even after the function returns.',
                    theoryUK: "Вірно: саме так внутрішні функції «пам'ятають» змінні ззовні.",
                    theoryEN: 'True: that’s how inner functions “remember” outer variables.',
                    isCorrect: true
                },
                {
                    textUK: 'Доступ `obj.x` використовує лексичний ланцюг для пошуку `x`, якщо властивості немає на `obj`.',
                    textEN: "`obj.x` uses the lexical chain to find `x` if it's not on `obj`.",
                    theoryUK: 'Невірно: `obj.x` йде по **прототипному ланцюгу** об’єкта, а не по лексичному ланцюгу.',
                    theoryEN: 'Incorrect: `obj.x` follows the **prototype chain**, not the lexical chain.',
                    isCorrect: false
                },
                {
                    textUK: '`with` може тимчасово додати об’єкт на початок ланцюга пошуку ідентифікаторів.',
                    textEN: '`with` can temporarily add an object to the head of the identifier lookup chain.',
                    theoryUK: 'Вірно: саме тому `with` вважається небезпечним і не рекомендований.',
                    theoryEN: 'True: that’s why `with` is error-prone and discouraged.',
                    isCorrect: true
                },
                {
                    textUK: 'У строгому режимі звертання до неоголошеного ідентифікатора створює неявний глобал.',
                    textEN: 'In strict mode, referencing an undeclared identifier creates an implicit global.',
                    theoryUK: 'Невірно: у strict mode це `ReferenceError`. Неявні глобали — особливість нестрогого режиму при **присвоєнні**.',
                    theoryEN: 'Incorrect: strict mode throws `ReferenceError`. Implicit globals appear in sloppy mode upon **assignment**.',
                    isCorrect: false
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Shadowing: коли локальна змінна перекриває глобальну, і як це працює?',
            textEN: 'Shadowing: when does a local variable overshadow a global one, and how does it work?',
            theoryUK:
                '### Теорія: Shadowing (перекриття ідентифікаторів)\n\n**Shadowing** — це ситуація, коли у внутрішній області видимості оголошується змінна з тим же ім’ям, що й у зовнішній. Внутрішній біндінг **приховує** (shadow) зовнішній у межах своєї області.\n\n- Shadowing працює завдяки **лексичному ланцюгу**: пошук зупиняється на **першому знайденому** біндінгу.\n- Зустрічається для всіх видів біндінгів: параметри функції, `let/const/var` у блоці чи функції, імпортовані імена в модулі тощо.\n- **TDZ** може спричинити парадоксальні помилки: локальне ім’я існує, але ще **не ініціалізоване**, і доступ до нього кине `ReferenceError`, навіть якщо є однойменна глобальна змінна.\n- Дістатися до «прихованої» глобальної змінної можна через явне посилання на глобальний об’єкт (`globalThis`, у браузері — `window`), якщо мова про скриптовий глобал.\n\n```js\nlet x = 1;           // глобальна (у модулі — модульна) змінна\nfunction f(){\n  // console.log(x); // ReferenceError, якщо нижче є `let x` (TDZ)\n  let x = 2;         // локальна змінна **затьмарює** зовнішню\n  console.log(x);     // 2\n}\nf();\nconsole.log(x);       // 1\n\n// Доступ до глобального властивісного `var` у скрипті\n// var g = 10; // у скрипті -> window.g\n// function h(){ let g = 20; console.log(window.g); } // 10\n```\n',
            theoryEN:
                '### Theory: Shadowing\n\n**Shadowing** occurs when an inner scope declares a variable with the same name as an outer one. The inner binding **hides** the outer binding within its scope.\n\n- Shadowing follows the **lexical chain**: lookup stops at the **first** matching binding.\n- Applies to parameters, `let/const/var` inside blocks or functions, imported names, etc.\n- **TDZ** makes it tricky: the local name exists but is **uninitialized**; accessing it throws `ReferenceError` even if there is a same-named global.\n- To reach a shadowed global (when it’s a property-style global in scripts), refer explicitly via `globalThis` (or `window` in browsers).\n\n```js\nlet x = 1;\nfunction f(){\n  // console.log(x); // ReferenceError if `let x` exists below (TDZ)\n  let x = 2;        // shadows outer x\n  console.log(x);   // 2\n}\nf();\nconsole.log(x);     // 1\n\n// Accessing property-style globals (scripts)\n// var g = 10; // -> window.g\n// function h(){ let g = 20; console.log(window.g); } // 10\n```\n',
            answers: [
                {
                    textUK: 'Локальна змінна з тим самим ім’ям **перекриває** зовнішню в межах своєї області.',
                    textEN: 'A local variable with the same name **shadows** the outer one within its scope.',
                    theoryUK: 'Вірно: пошук зупиняється на найближчому біндінгу.',
                    theoryEN: 'True: lookup stops at the nearest binding.',
                    isCorrect: true
                },
                {
                    textUK: 'Наявність локального `let x` може спричинити `ReferenceError` при звертанні до `x` до ініціалізації, навіть якщо є глобальний `x`.',
                    textEN: 'A local `let x` can cause a `ReferenceError` when accessing `x` before initialization, even if a global `x` exists.',
                    theoryUK: 'Вірно: локальний `x` у TDZ блокує доступ до глобального однойменного `x`.',
                    theoryEN: 'True: the local `x` in TDZ blocks access to the global same-named `x`.',
                    isCorrect: true
                },
                {
                    textUK: 'Shadowing змінює значення зовнішньої змінної на рівні пам’яті (обидві вказують на один binding).',
                    textEN: 'Shadowing mutates the outer variable at the memory level (both point to the same binding).',
                    theoryUK: 'Невірно: внутрішній та зовнішній — **різні** біндінги в різних Environment Records.',
                    theoryEN: 'Incorrect: inner and outer are **different** bindings in different Environment Records.',
                    isCorrect: false
                },
                {
                    textUK: 'Щоб звернутися до «прихованого» глобального `var` у скрипті, можна використати `window`/`globalThis`.',
                    textEN: 'To access a shadowed global `var` in a script, you can use `window`/`globalThis`.',
                    theoryUK: "Вірно: top-level `var` у скриптах стає властивістю глобального об'єкта.",
                    theoryEN: 'True: top-level `var` in scripts becomes a property on the global object.',
                    isCorrect: true
                },
                {
                    textUK: '`import` в модулі не підлягає shadowing — локальна змінна з тим же ім’ям ігнорується.',
                    textEN: '`import` in a module cannot be shadowed—the local variable with the same name is ignored.',
                    theoryUK:
                        'Невірно: `import` створює незмінний біндінг у модульній області; ви **можете** створити інший біндінг з тим самим ім’ям в **іншій** (внутрішній) області, і це буде shadowing. У тій самій області — заборонено (SyntaxError).',
                    theoryEN:
                        'Incorrect: `import` creates an immutable binding in module scope; you **can** shadow it in an **inner** scope. Redeclaring in the same scope is a SyntaxError.',
                    isCorrect: false
                },
                {
                    textUK: 'Shadowing можливе для параметрів функції: локальний `let x` у тілі може перекрити параметр `x` у вкладеному блоці.',
                    textEN: 'Function parameters can be shadowed: a local `let x` in an inner block can shadow parameter `x`.',
                    theoryUK: 'Вірно: параметри — це біндінги функціональної області, які можуть бути перекриті у вкладених блоках.',
                    theoryEN: 'True: parameters are function-scope bindings that inner blocks may shadow.',
                    isCorrect: true
                }
            ],
            level: 'junior'
        },
        {
            textUK: 'Closure та scope: як саме замикання “запам’ятовують” область видимості?',
            textEN: 'Closures and scope: how exactly do closures “remember” their scope?',
            theoryUK:
                '### Теорія: що таке замикання і як воно працює з областями видимості\n\n**Замикання (closure)** — це функція разом із посиланнями на *лексичні середовища* (Lexical Environments), у яких вона була **оголошена**. Коли функція створюється, рушій фіксує не «копії значень», а **посилання на біндінги** (entries) у відповідних `Environment Record`-ах. Завдяки цьому:\n\n- Після повернення зовнішньої функції її внутрішня функція **продовжує мати доступ** до змінних зовнішньої (поки на ці змінні або функцію є посилання). \n- Замикання «бачить» **поточне** значення біндінгу на момент доступу, а не знімок значення на момент створення (для примітивів це теж важливо: зміниться біндінг — зміниться й те, що бачить замикання).\n- Для циклів `for (let i=...)` стандарт створює **окремий лексичний біндінг на кожну ітерацію** (CreatePerIterationEnvironment), тому замикання «бачить» свій `i`. Для `var` у тій самій функції біндінг **спільний**, тож асинхронні колбеки часто «бачать» фінальне значення.\n- **`this` не є частиною scope chain**: замикання не «захоплюють `this`» автоматично (звичайні функції отримують `this` під час виклику; стрілкові — лексично, але це інший механізм).\n- Пам’ятай про **TDZ** для `let/const`: якщо всередині області оголошено однойменну змінну, доступ до неї до ініціалізації викличе `ReferenceError`, навіть якщо є зовнішня з тим самим ім’ям.\n\n#### Приклади\n```js\nfunction makeCounter() {\n  let count = 0;           // біндінг у зовнішньому лексичному середовищі\n  return function() {      // внутрішня функція замикає посилання на `count`\n    count++;\n    return count;\n  };\n}\nconst next = makeCounter();\nnext(); // 1\nnext(); // 2  (бачимо актуальний стан біндінгу `count`)\n```\n\n```js\n// var у циклі: один біндінг — усі колбеки «бачать» фінальне значення\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 3, 3, 3\n}\n\n// let у циклі: окремий біндінг на ітерацію\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 0, 1, 2\n}\n```\n\n> GC (збирання сміття): доти, доки існує колбек/функція, що тримає посилання на середовище зі змінними, ці біндінги **живі** й не колектяться.',
            theoryEN:
                '### Theory: what a closure is and how it interacts with scope\n\nA **closure** is a function bundled with references to the **Lexical Environments** in which it was **declared**. When a function is created, the engine captures **references to bindings** (not snapshots of values) in the relevant `Environment Records`. As a result:\n\n- After the outer function returns, the inner function still **has access** to the outer variables (as long as references exist).\n- A closure sees the **current value of the binding** at access time, not a historical copy.\n- In `for (let i=...)`, the spec creates a **new binding per iteration**, so closures see per-iteration values. With `var`, there’s **one** binding for the entire loop, so async callbacks often see the final value.\n- **`this` is not part of the scope chain**: closures don’t automatically capture `this` (regular functions get `this` on call; arrow functions capture `this` lexically, which is a separate mechanism).\n- Beware of **TDZ** for `let/const`: an inner same-named binding in TDZ can throw `ReferenceError` even if an outer binding exists.\n\n#### Examples\n```js\nfunction makeCounter() {\n  let count = 0;           // binding in the outer lexical environment\n  return function() {      // inner function closes over `count`\n    count++;\n    return count;\n  };\n}\nconst next = makeCounter();\nnext(); // 1\nnext(); // 2\n```\n\n```js\n// var in loops: single binding — callbacks see the final value\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 3, 3, 3\n}\n\n// let in loops: new binding per iteration\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 0, 1, 2\n}\n```\n\n> GC: as long as a closure is reachable, the captured environments and bindings remain alive.',
            answers: [
                {
                    textUK: 'Замикання зберігає **посилання на біндінги**, а не копії значень.',
                    textEN: 'A closure preserves **references to bindings**, not copies of values.',
                    theoryUK: 'Вірно: саме тому після зміни змінної зовні замикання «бачить» актуальне значення.',
                    theoryEN: 'True: that’s why closures observe updated values when the binding changes.',
                    isCorrect: true
                },
                {
                    textUK: 'Замикання працюють за рахунок **місця виклику** функції (dynamic scope).',
                    textEN: 'Closures are based on the **call site** (dynamic scope).',
                    theoryUK: 'Невірно: JS має **лексичну** (статичну) область — важливо місце **оголошення**, а не виклику.',
                    theoryEN: 'Incorrect: JavaScript uses **lexical** scope — declaration site matters, not the call site.',
                    isCorrect: false
                },
                {
                    textUK: 'Стрілкова функція «захоплює» `this` лексично, але це інший механізм, відмінний від scope chain.',
                    textEN: 'An arrow function captures `this` lexically, but that is separate from the scope chain.',
                    theoryUK: 'Вірно: `this` не входить до ланцюга пошуку ідентифікаторів.',
                    theoryEN: 'True: `this` is not part of identifier resolution via the scope chain.',
                    isCorrect: true
                },
                {
                    textUK: 'У `for (let i=...)` кожна ітерація має **той самий** біндінг `i`, що й попередня.',
                    textEN: 'In `for (let i=...)` each iteration uses the **same** `i` binding as the previous one.',
                    theoryUK: 'Невірно: створюється **новий** біндінг на ітерацію (CreatePerIterationEnvironment).',
                    theoryEN: 'Incorrect: a **new** binding is created per iteration.',
                    isCorrect: false
                },
                {
                    textUK: 'Замикання можуть жити довше за зовнішню функцію, утримуючи її середовище від GC.',
                    textEN: 'Closures can outlive the outer function, keeping its environment from GC.',
                    theoryUK: 'Вірно: поки замикання досяжне, середовище теж досяжне.',
                    theoryEN: 'True: as long as the closure is reachable, so is the environment.',
                    isCorrect: true
                },
                {
                    textUK: 'TDZ може перекрити доступ до зовнішньої змінної з тим же ім’ям, спричиняючи `ReferenceError` до ініціалізації.',
                    textEN: 'TDZ can block access to an outer same-named variable, causing `ReferenceError` before initialization.',
                    theoryUK: 'Вірно: локальний біндінг існує, але ще не ініціалізований — доступ заборонено.',
                    theoryEN: 'True: a local binding exists but is uninitialized — access is forbidden.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: '`with` та `eval`: як вони змінюють (або ламають) передбачуваність ланцюга областей видимості?',
            textEN: '`with` and `eval`: how do they change (or break) the predictability of the scope chain?',
            theoryUK:
                "### Теорія: `with` і `eval` та їх вплив на scope chain\n\n#### `with`\n- Додає **Object Environment Record** (переданий об’єкт) на **початок** ланцюга пошуку ідентифікаторів. Через це незрозуміло, до чого саме звертається ім’я: до **властивості об’єкта** чи до **лексичного біндінгу**.\n- Заборонений у **strict mode** (`SyntaxError` у суворому коді або в модулях). Вважається **анти-патерном**, бо ускладнює аналіз і оптимізацію коду рушієм.\n\n```js\nconst obj = { x: 1 };\nwith (obj) {\n  // x може йти як до obj.x, так і потенційно до зовнішнього x — залежно від наявності властивості\n  x; // читає obj.x\n}\n```\n\n#### `eval`\n- **Прямий eval** (виклик ідентифікатора `eval` без перекручень) виконує рядок коду у **поточному** лексичному контексті:\n  - у **нестрогому** режимі декларації `var`/`function` з `eval` можуть **впливати** на поточну область (навіть додавати біндінги у той самий `VariableEnvironment`).\n  - у **strict mode** прямий `eval` виконується в **окремому** лексичному/змінному середовищі: його оголошення **не протікають** у зовнішню область.\n- **Непрямий eval** (наприклад, `(0, eval)(code)` або збереження в іншу змінну) завжди виконується у **глобальному** контексті, а не у локальному.\n- `eval` ускладнює статичний аналіз, гальмує оптимізації та є ризикованим з точки зору безпеки (ін’єкції).\n\n```js\nlet a = 1;\n(function(){\n  let a = 2;\n  eval('a = 3');       // прямий eval: у non-strict змінить локальну `a`\n  // у strict — працює в окремому середовищі, тож зовнішня `a` лишиться 2\n})();\n\n(0, eval)('var g = 10'); // непрямий eval: оголосить глобальну g\n```\n\n> Підсумок: `with` робить **динамічний** пошук ім'янованих властивостей у ланцюзі, `eval` — **динамічно** додає/оцінює код, змінюючи правила видимості залежно від режиму та способу виклику. Обидва інструменти знижують передбачуваність та оптимізовність.",
            theoryEN:
                "### Theory: `with` and `eval` and their impact on the scope chain\n\n#### `with`\n- Inserts an **Object Environment Record** (the object) at the **front** of the identifier lookup chain. This blurs whether an identifier refers to an **object property** or a **lexical binding**.\n- Disallowed in **strict mode** (`SyntaxError` in strict code or modules). Considered an **anti-pattern**; hampers engine optimization.\n\n```js\nconst obj = { x: 1 };\nwith (obj) {\n  x; // resolves to obj.x\n}\n```\n\n#### `eval`\n- **Direct eval** (calling the identifier `eval` directly) executes code in the **current** lexical context:\n  - in **sloppy** mode, `var`/`function` declarations from `eval` may **affect** the current scope (add to the same `VariableEnvironment`).\n  - in **strict** mode, direct `eval` runs in a **separate** lexical/variable environment, so its declarations **do not leak** into the outer scope.\n- **Indirect eval** (e.g., `(0, eval)(code)` or assigning eval to another variable) always runs in the **global** context, not the local one.\n- `eval` hinders static analysis, hurts optimization, and poses security risks (injection).\n\n```js\nlet a = 1;\n(function(){\n  let a = 2;\n  eval('a = 3');       // direct eval: in non-strict updates local `a`\n  // in strict — its own environment; outer `a` stays 2\n})();\n\n(0, eval)('var g = 10'); // indirect eval: declares a global `g`\n```\n\n> Bottom line: `with` makes identifier resolution **dynamic**, `eval` dynamically injects code and can change visibility rules depending on mode and call form. Both reduce predictability and optimizability.",
            answers: [
                {
                    textUK: '`with` додає об’єкт на початок ланцюга пошуку ідентифікаторів, змішуючи імена та властивості.',
                    textEN: '`with` places an object at the head of identifier lookup, mixing names and properties.',
                    theoryUK: 'Вірно: це ускладнює статичний аналіз і оптимізацію.',
                    theoryEN: 'True: this complicates static analysis and optimization.',
                    isCorrect: true
                },
                {
                    textUK: '`with` дозволено у strict mode, але лише в модулях.',
                    textEN: '`with` is allowed in strict mode, but only in modules.',
                    theoryUK: 'Невірно: у strict mode (включно з модулями) `with` заборонено (`SyntaxError`).',
                    theoryEN: 'Incorrect: in strict mode (including modules) `with` is forbidden (`SyntaxError`).',
                    isCorrect: false
                },
                {
                    textUK: 'Прямий `eval` у нестрогому режимі може додати `var` у поточну область видимості.',
                    textEN: 'Direct `eval` in sloppy mode can add a `var` to the current scope.',
                    theoryUK: 'Вірно: декларації з eval потрапляють у поточний VariableEnvironment.',
                    theoryEN: 'True: declarations from eval contribute to the current VariableEnvironment.',
                    isCorrect: true
                },
                {
                    textUK: 'У strict mode прямий `eval` виконується у власному лексичному середовищі і не «протікає» у зовнішню область.',
                    textEN: 'In strict mode, direct `eval` runs in its own lexical environment and does not leak into the outer scope.',
                    theoryUK: 'Вірно: оголошення/варіації всередині не змінюють зовнішні біндінги.',
                    theoryEN: 'True: declarations/changes inside do not alter outer bindings.',
                    isCorrect: true
                },
                {
                    textUK: 'Непрямий `eval` (напр., `(0, eval)(...)`) виконується у локальному контексті виклику.',
                    textEN: 'Indirect `eval` (e.g., `(0, eval)(...)`) runs in the local call context.',
                    theoryUK: 'Невірно: непрямий eval виконується у **глобальному** контексті.',
                    theoryEN: 'Incorrect: indirect eval executes in the **global** context.',
                    isCorrect: false
                },
                {
                    textUK: "`new Function('code')` подібний до непрямого eval — виконується у глобальній області.",
                    textEN: "`new Function('code')` is similar to indirect eval — it runs in the global scope.",
                    theoryUK: 'Вірно: тіло функції створюється в глобальному контексті, без доступу до локальних лексичних біндінгів.',
                    theoryEN: 'True: the function body is created in the global context with no access to local lexical bindings.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Етапи створення Execution Context: коли й де створюються bindings для var, let, const, function?',
            textEN: 'Execution Context creation phases: when and where are bindings for var, let, const, and function created?',
            theoryUK:
                "### Теорія: створення контексту виконання (EC) та лексичних середовищ\n\nПід час запуску коду рушій створює **Execution Context (EC)** і проходить дві ключові стадії:\n\n1) **Creation Phase (Етап створення)**  \n   Формуються лексичні середовища та біндінги:\n   - **Lexical Environment (LE)** — для `let`, `const`, `class`, а також для параметрів функції; створюються **біндінги без ініціалізації** (вони перебувають у **TDZ**) до моменту фактичної ініціалізації.  \n   - **Variable Environment (VE)** — для `var` і **Function Declarations** (у скриптовому/функціональному коді).  \n   - **Function Declarations** піднімаються як **повністю ініціалізовані** значення (оголошення => вже доступні як функції).  \n   - **var**-змінні піднімаються з початковим значенням **`undefined`** (створений і ініціалізований біндінг).  \n   - **let/const** створюються **без ініціалізації** (у TDZ) до рядка оголошення; `const` **вимагає ініціалізації** при оголошенні.  \n   - У **глобальному** контексті в скриптах використовується **GlobalEnvironmentRecord**, що складається з **Object Environment Record** (властивості глобального об’єкта для `var`/функцій) і **Declarative Environment Record** (для `let/const`). У **модулях** — **Module Environment Record** (усі топ-рівневі біндінги декларативні; модулі — завжди strict).\n\n2) **Execution Phase (Етап виконання)**  \n   Виконуються оператори; відбувається **ініціалізація** `let/const` у місці оголошення, присвоєння значень тощо.\n\n#### Особливості function EC\n- Параметри функції створюються як біндінги в LE до початку тіла.  \n- У нестрогому режимі може створюватися `arguments`-об’єкт з відбиттям значень параметрів (aliasing).  \n- `Function Expression` **не** піднімається як значення — її доступність залежить від біндінгу змінної (`var/let/const`).\n\n```js\n// Глобальний скрипт (не модуль)\nconsole.log(a); // undefined (var)\n// console.log(b); // ReferenceError (let у TDZ)\n// console.log(c); // ReferenceError (const у TDZ)\nconsole.log(fn()); // працює — Function Declaration піднята як функція\nvar a = 1;\nlet b = 2;\nconst c = 3;\nfunction fn(){ return 'ok'; }\n```\n",
            theoryEN:
                "### Theory: Execution Context (EC) creation and lexical environments\n\nWhen code starts, the engine creates an **Execution Context** and performs two key phases:\n\n1) **Creation Phase**  \n   The environments and bindings are established:\n   - **Lexical Environment (LE)** holds `let`, `const`, `class`, and function parameters; these are created **uninitialized** (in **TDZ**) until their declaration is evaluated.  \n   - **Variable Environment (VE)** holds `var` and **Function Declarations** (in script/function code).  \n   - **Function Declarations** are hoisted as **fully initialized** callable values.  \n   - **`var`** bindings are hoisted and **initialized to `undefined`**.  \n   - **`let/const`** bindings are created **without initialization** (TDZ) until the declaration line; `const` **must be initialized** at its declaration.  \n   - In the **global** script context, a **GlobalEnvironmentRecord** is used (Object Env Record for global-object properties from `var`/functions, and Declarative Env Record for `let/const`). In **modules**, a **Module Environment Record** is used (all top-level bindings are declarative; modules are strict).\n\n2) **Execution Phase**  \n   Statements run; `let/const` get initialized at the declaration site, assignments occur, etc.\n\n#### Function EC nuances\n- Function parameters are created as bindings in LE before the body executes.  \n- In sloppy mode, an `arguments` object may alias parameters.  \n- A **Function Expression** is not hoisted as a value; its availability follows the variable binding (`var/let/const`).\n\n```js\n// Global script (not module)\nconsole.log(a); // undefined (var)\n// console.log(b); // ReferenceError (let in TDZ)\n// console.log(c); // ReferenceError (const in TDZ)\nconsole.log(fn()); // works — Function Declaration hoisted as a function\nvar a = 1;\nlet b = 2;\nconst c = 3;\nfunction fn(){ return 'ok'; }\n```\n",
            answers: [
                {
                    textUK: 'На етапі створення `var` ініціалізується `undefined`, а `let/const` — створюються без ініціалізації (TDZ).',
                    textEN: 'During creation, `var` is initialized to `undefined`, while `let/const` are created uninitialized (TDZ).',
                    theoryUK: 'Вірно: це і є базова відмінність під час hoisting між `var` і `let/const`.',
                    theoryEN: 'True: this is the core hoisting difference between `var` and `let/const`.',
                    isCorrect: true
                },
                {
                    textUK: 'Function Declaration піднімається як повністю ініціалізоване значення (функція доступна до оголошення).',
                    textEN: 'A Function Declaration is hoisted as a fully initialized value (callable before its line).',
                    theoryUK: 'Вірно: саме тому виклик функції до її рядка працює.',
                    theoryEN: 'True: hence calling it before its line works.',
                    isCorrect: true
                },
                {
                    textUK: '`const` під час етапу створення одразу отримує початкове значення `undefined`.',
                    textEN: '`const` receives an initial value of `undefined` during creation.',
                    theoryUK: 'Невірно: `const` створюється **без** ініціалізації (TDZ) і має бути ініціалізований у декларації.',
                    theoryEN: 'Incorrect: `const` is created **uninitialized** (TDZ) and must be initialized at declaration.',
                    isCorrect: false
                },
                {
                    textUK: 'У модулях топ-рівневі біндінги є декларативними; навіть `var` не стає властивістю глобального об’єкта.',
                    textEN: 'In modules, top-level bindings are declarative; even `var` does not become a global-object property.',
                    theoryUK: 'Вірно: модульна область відрізняється від скриптової глобалі.',
                    theoryEN: 'True: module scope differs from script globals.',
                    isCorrect: true
                },
                {
                    textUK: 'Function Expression піднімається як значення так само, як Function Declaration.',
                    textEN: 'A Function Expression is hoisted as a value just like a Function Declaration.',
                    theoryUK: 'Невірно: вона підпорядковується біндінгу змінної (`var/let/const`); як значення не піднімається.',
                    theoryEN: 'Incorrect: its availability follows the variable binding; it is not hoisted as a value.',
                    isCorrect: false
                },
                {
                    textUK: 'Параметри функції створюються як біндінги до виконання тіла функції.',
                    textEN: 'Function parameters are created as bindings before the function body executes.',
                    theoryUK: 'Вірно: параметри — частина LE функціонального EC.',
                    theoryEN: 'True: parameters are part of the function EC’s LE.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Hoisting функцій vs змінних: у чому різниця доступності до виконання?',
            textEN: 'Function hoisting vs variable hoisting: how does availability differ?',
            theoryUK:
                '### Теорія: hoisting функцій і змінних\n\n- **Function Declaration** піднімається як **цілісна функція**: її можна викликати до фактичного рядка оголошення.  \n- **var** піднімається як біндінг, ініціалізований **`undefined`**: читання до присвоєння дає `undefined`; виклик як функції призведе до `TypeError` (бо значення поки не функція).  \n- **let/const** піднімаються **без ініціалізації** (TDZ): будь-який доступ до ініціалізації кидає `ReferenceError`.  \n- **Function Expression / Arrow Function** поводяться як звичайні значення: якщо збережені в `var` — є `undefined` до присвоєння; у `let/const` — доступ до присвоєння кидає `ReferenceError`.\n\n```js\nfoo();                // ✅ працює (Function Declaration)\nfunction foo(){}\n\nconsole.log(bar);     // undefined (var)\n// bar();             // ❌ TypeError: bar is not a function\nvar bar = function(){};\n\n// baz();             // ❌ ReferenceError (let у TDZ)\nlet baz = () => {};\n```\n',
            theoryEN:
                '### Theory: hoisting of functions and variables\n\n- **Function Declarations** are hoisted as **full functions**: callable before their line.  \n- **`var`** is hoisted as a binding initialized to **`undefined`**: reading before assignment yields `undefined`; calling it as a function throws `TypeError`.  \n- **`let/const`** are hoisted **uninitialized** (TDZ): any access before initialization throws `ReferenceError`.  \n- **Function Expressions / Arrow Functions** behave like regular values: with `var`, they are `undefined` until assigned; with `let/const`, access before assignment throws `ReferenceError`.\n\n```js\nfoo();                // ✅ works (Function Declaration)\nfunction foo(){}\n\nconsole.log(bar);     // undefined (var)\n// bar();             // ❌ TypeError: bar is not a function\nvar bar = function(){};\n\n// baz();             // ❌ ReferenceError (let in TDZ)\nlet baz = () => {};\n```\n',
            answers: [
                {
                    textUK: 'Function Declaration доступна до рядка оголошення, оскільки піднімається як функція.',
                    textEN: 'A Function Declaration is callable before its line because it is hoisted as a function.',
                    theoryUK: 'Вірно: створюється повністю ініціалізований функціональний біндінг.',
                    theoryEN: 'True: a fully initialized function binding is created.',
                    isCorrect: true
                },
                {
                    textUK: '`var fn = function(){}` дозволяє виклик до присвоєння так само, як і декларація функції.',
                    textEN: '`var fn = function(){}` can be called before assignment just like a function declaration.',
                    theoryUK: 'Невірно: до присвоєння `fn` дорівнює `undefined`; виклик призведе до `TypeError`.',
                    theoryEN: 'Incorrect: before assignment `fn` is `undefined`; calling it throws `TypeError`.',
                    isCorrect: false
                },
                {
                    textUK: '`let`/`const` з Function Expression у TDZ: доступ до імені до ініціалізації кидає `ReferenceError`.',
                    textEN: '`let`/`const` with a Function Expression in TDZ: accessing the name before initialization throws `ReferenceError`.',
                    theoryUK: 'Вірно: біндінг існує, але не ініціалізований.',
                    theoryEN: 'True: the binding exists but is uninitialized.',
                    isCorrect: true
                },
                {
                    textUK: '`var` завжди блокує виклик як функції до присвоєння, повертаючи `ReferenceError`.',
                    textEN: '`var` always blocks being called as a function before assignment by throwing `ReferenceError`.',
                    theoryUK: 'Невірно: буде `TypeError` (бо `undefined` не функція), а не `ReferenceError`.',
                    theoryEN: "Incorrect: it's a `TypeError` (calling `undefined`), not `ReferenceError`.",
                    isCorrect: false
                },
                {
                    textUK: 'Hoisting для Function Expression залежить від того, як оголошено змінну-носій (`var/let/const`).',
                    textEN: 'Hoisting for a Function Expression depends on the carrier variable (`var/let/const`).',
                    theoryUK: 'Вірно: саме біндінг змінної визначає доступність.',
                    theoryEN: 'True: the variable binding governs availability.',
                    isCorrect: true
                },
                {
                    textUK: 'Стрілкові функції піднімаються як декларації та доступні до оголошення.',
                    textEN: 'Arrow functions are hoisted like declarations and are available before their line.',
                    theoryUK: 'Невірно: це вирази; їх доступність залежить від біндінгу змінної.',
                    theoryEN: 'Incorrect: they are expressions; availability follows the variable binding.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Temporal Dead Zone (TDZ): що це таке і чому `typeof x` інколи кидає помилку?',
            textEN: 'Temporal Dead Zone (TDZ): what is it and why does `typeof x` sometimes throw?',
            theoryUK:
                "### Теорія: TDZ і особливість `typeof`\n\n**TDZ (Temporal Dead Zone)** — проміжок часу від **початку області видимості** до **моменту ініціалізації** біндінгу `let/const/class`. У TDZ біндінг **існує**, але він **не ініціалізований**; **будь-який доступ** (читання/запис/`typeof`) призводить до `ReferenceError`.\n\n- `let/const` піднімаються (їх імена відомі рушію), але не ініціалізуються — тому доступ до оголошення заборонено.  \n- `const` додатково **вимагає ініціалізації** в момент декларації.  \n- **Особливість `typeof`**: зазвичай `typeof` для **повністю неоголошеного** ідентифікатора **не кидає**, повертає рядок `'undefined'`. Проте якщо існує **лексичний біндінг у TDZ** (напр., `let x;` нижче в тій самій області), `typeof x` **кине `ReferenceError`**, бо звертається до наявного, але не ініціалізованого біндінгу.  \n- TDZ стосується кожного блоку окремо та діє також у заголовках циклів (`for (let i = ...)`).\n\n```js\n// Приклад з TDZ\n// console.log(x);   // ReferenceError (x у TDZ)\nlet x = 1;\n\n// Особливість typeof\n// console.log(typeof y); // 'undefined' (y зовсім не оголошено)\n{\n  // console.log(typeof z); // ReferenceError — у цій області нижче є `let z`\n  let z = 10;\n}\n```\n",
            theoryEN:
                "### Theory: TDZ and the `typeof` peculiarity\n\n**TDZ (Temporal Dead Zone)** is the period from the **start of a scope** until the **initialization** of a `let/const/class` binding. In the TDZ the binding **exists** but is **uninitialized**; **any access** (read/write/`typeof`) causes a `ReferenceError`.\n\n- `let/const` are hoisted (names known) but not initialized—access before the declaration is forbidden.  \n- `const` additionally **must be initialized** at its declaration.  \n- **`typeof` quirk**: normally, `typeof` on a **completely undeclared** identifier **does not throw** and returns `'undefined'`. But if a **lexical binding in TDZ** exists (e.g., a `let x` later in the same scope), then `typeof x` **throws `ReferenceError`**, because it refers to an existing yet uninitialized binding.  \n- TDZ applies per block and also to loop headers (`for (let i = ...)`).\n\n```js\n// TDZ example\n// console.log(x);   // ReferenceError (x in TDZ)\nlet x = 1;\n\n// typeof behavior\n// console.log(typeof y); // 'undefined' (y is truly undeclared)\n{\n  // console.log(typeof z); // ReferenceError — `let z` exists below in this block\n  let z = 10;\n}\n```\n",
            answers: [
                {
                    textUK: 'TDZ — це стан біндінгу `let/const`, коли він існує, але ще не ініціалізований; доступ спричиняє `ReferenceError`.',
                    textEN: 'TDZ is the state where a `let/const` binding exists but is uninitialized; accessing it throws `ReferenceError`.',
                    theoryUK: 'Вірно: так працює безпечний доступ до лексичних біндінгів до їх ініціалізації.',
                    theoryEN: 'True: it prevents use of lexical bindings before initialization.',
                    isCorrect: true
                },
                {
                    textUK: "`typeof` для повністю неоголошеного імені повертає `'undefined'` і не кидає помилку.",
                    textEN: "`typeof` on a completely undeclared name returns `'undefined'` and does not throw.",
                    theoryUK: 'Вірно: це історична особливість `typeof`.',
                    theoryEN: 'True: this is a historical quirk of `typeof`.',
                    isCorrect: true
                },
                {
                    textUK: '`typeof x` **кидає**, якщо в поточній області є `let x` у TDZ.',
                    textEN: '`typeof x` **throws** if there is a `let x` in TDZ within the current scope.',
                    theoryUK: 'Вірно: існує біндінг у TDZ — звертання заборонено.',
                    theoryEN: 'True: a TDZ binding exists, so access is forbidden.',
                    isCorrect: true
                },
                {
                    textUK: 'TDZ діє лише для `const`, але не для `let`.',
                    textEN: 'TDZ applies only to `const`, not to `let`.',
                    theoryUK: 'Невірно: TDZ стосується **і `let`, і `const` (і `class`)**.',
                    theoryEN: 'Incorrect: TDZ applies to **both `let` and `const` (and `class`)**.',
                    isCorrect: false
                },
                {
                    textUK: 'У межах TDZ читання дозволено, але присвоєння заборонено.',
                    textEN: 'Within the TDZ reads are allowed but writes are forbidden.',
                    theoryUK: 'Невірно: **будь-який** доступ (читання, запис, `typeof`) спричиняє `ReferenceError`.',
                    theoryEN: 'Incorrect: **any** access (read, write, `typeof`) throws `ReferenceError`.',
                    isCorrect: false
                },
                {
                    textUK: 'TDZ не стосується заголовків циклу `for (let i = ...)`.',
                    textEN: 'TDZ does not apply to a `for (let i = ...)` header.',
                    theoryUK:
                        'Невірно: біндінг у заголовку створюється та ініціалізується до входу в тіло ітерації, але концептуально TDZ як механізм існує; в інших місцях тіла блоку до оголошення діє TDZ.',
                    theoryEN:
                        'Incorrect: the header binding is created and initialized before the iteration body, but TDZ still exists conceptually; elsewhere in the block TDZ applies until initialization.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Hoisting у вкладених блоках: як поводяться `let/const` у вкладених областях видимості (TDZ, shadowing, доступність)? Оберіть усі коректні твердження.',
            textEN: 'Hoisting in nested blocks: how do `let/const` behave in nested scopes (TDZ, shadowing, availability)? Select all correct statements.',
            theoryUK:
                "### Теорія: Hoisting `let/const` у **вкладених блоках**\n\nУ JavaScript **усі оголошення** піднімаються (hoisted), але з різною семантикою:\n- `var` створює біндінг під час **етапу створення** й **ініціалізується `undefined`** (функціональна або глобальна область).\n- `let/const` **піднімаються до верхівки найближчого блоку**, але **без ініціалізації** — це **TDZ (Temporal Dead Zone)** від початку блоку до моменту виконання декларації. Будь-який доступ у TDZ (читання, запис або `typeof`) → `ReferenceError`.\n- `const` вимагає ініціалізації **безпосередньо** в декларації.\n\n#### Вкладені блоки та shadowing\n- Кожний блок `{ ... }` має **власне лексичне середовище**. Якщо у внутрішньому блоці оголосити `let x`, це **перекриє (shadow)** зовнішній `x` у межах цього блоку. \n- Важливо: **локальний біндінг у TDZ блокує доступ** до однойменного зовнішнього `x` — навіть `typeof x` у цьому блоці **кине** помилку до ініціалізації локального `x`.\n- Поза внутрішнім блоком зовнішній `x` **залишається доступним** — shadowing діє лише в межах блоку.\n\n#### Приклади\n```js\nlet x = 1;\n{\n  // TDZ для локального x вже активна з початку блоку\n  // console.log(x);     // ReferenceError: локальний x у TDZ перекриває зовнішній x\n  let x = 2;            // Ініціалізація локального x\n  console.log(x);       // 2 (локальний)\n}\nconsole.log(x);         // 1 (зовнішній)\n```\n\n```js\n// Вкладення декількох рівнів\nconst a = 'outer';\n{\n  const a = 'middle';\n  {\n    // console.log(a);  // ReferenceError (локальний a у TDZ на цьому рівні)\n    const a = 'inner';\n    console.log(a);     // 'inner'\n  }\n  console.log(a);       // 'middle'\n}\nconsole.log(a);         // 'outer'\n```\n\n```js\n// for-цикл і локальне перевизначення у тілі\nlet i = 'outer';\nfor (let k = 0; k < 1; k++) {\n  // console.log(i);    // ReferenceError (локальний i нижче у TDZ)\n  let i = 'inner';\n  console.log(i);       // 'inner'\n}\nconsole.log(i);         // 'outer'\n```\n\n#### Ключові висновки\n- **Межа TDZ = весь блок від його початку до декларації.**\n- **Shadowing + TDZ** можуть призводити до `ReferenceError`, навіть якщо \"десь поруч\" є зовнішня змінна з тим самим ім’ям.\n- `'use strict'` **не** скасовує TDZ і не робить `let/const` \"як var\".\n- **Redeclaration**: у **тому самому** блоці не можна двічі оголосити одне й те саме ім’я з `let/const`; у **внутрішньому** блоці — можна (це **shadowing**, а не redeclaration в одній області).",
            theoryEN:
                "### Theory: Hoisting of `let/const` in **nested blocks**\n\nAll declarations are hoisted, but semantics differ:\n- `var` is created during the **creation phase** and **initialized to `undefined`** (function/global scope).\n- `let/const` are **hoisted to the top of their nearest block** but **left uninitialized** — the **TDZ** spans from the block start to the declaration. Any TDZ access (read, write, or `typeof`) → `ReferenceError`.\n- `const` must be initialized **at declaration**.\n\n#### Nested blocks and shadowing\n- Each `{ ... }` creates its **own lexical environment**. Declaring `let x` inside creates a binding that **shadows** an outer `x` within that block.\n- Crucially, a **local binding in TDZ blocks access** to the same-named outer `x` — even `typeof x` **throws** until the local `x` is initialized.\n- Outside the inner block the outer `x` **remains accessible**; shadowing is block-local.\n\n#### Examples\n```js\nlet x = 1;\n{\n  // Local x is in TDZ here and shadows the outer x\n  // console.log(x);     // ReferenceError\n  let x = 2;\n  console.log(x);       // 2 (local)\n}\nconsole.log(x);         // 1 (outer)\n```\n\n```js\nconst a = 'outer';\n{\n  const a = 'middle';\n  {\n    // console.log(a);  // ReferenceError (inner a in TDZ)\n    const a = 'inner';\n    console.log(a);     // 'inner'\n  }\n  console.log(a);       // 'middle'\n}\nconsole.log(a);         // 'outer'\n```\n\n```js\nlet i = 'outer';\nfor (let k = 0; k < 1; k++) {\n  // console.log(i);    // ReferenceError (local i below is in TDZ)\n  let i = 'inner';\n  console.log(i);       // 'inner'\n}\nconsole.log(i);         // 'outer'\n```\n\n#### Takeaways\n- **TDZ spans the entire block** from its start to the declaration.\n- **Shadowing + TDZ** can trigger `ReferenceError` even when an outer binding exists.\n- `'use strict'` does **not** remove TDZ or make `let/const` behave like `var`.\n- **Redeclaration**: not allowed within the **same block** for `let/const`; allowed in **inner blocks** (that’s **shadowing**, not redeclaration in one scope).",
            answers: [
                {
                    textUK: '`let/const` піднімаються до початку **свого блоку**, але лишаються **не ініціалізованими** до декларації (TDZ).',
                    textEN: '`let/const` are hoisted to the start of **their block** but remain **uninitialized** until the declaration (TDZ).',
                    theoryUK: 'Вірно: TDZ діє з початку блоку до точки оголошення.',
                    theoryEN: 'True: the TDZ spans from the block start to the declaration site.',
                    isCorrect: true
                },
                {
                    textUK: "Якщо у внутрішньому блоці є `let x`, то `typeof x` до декларації поверне `'undefined'`, бо використовується зовнішній `x`.",
                    textEN: "If an inner block has `let x`, then `typeof x` before the declaration returns `'undefined'` by falling back to the outer `x`.",
                    theoryUK: 'Невірно: локальний `x` у TDZ **перекриває** зовнішній; `typeof x` кине `ReferenceError`.',
                    theoryEN: 'Incorrect: the local `x` in TDZ **shadows** the outer one; `typeof x` throws `ReferenceError`.',
                    isCorrect: false
                },
                {
                    textUK: 'Shadowing у внутрішньому блоці не впливає на доступність однойменної змінної **поза** цим блоком.',
                    textEN: 'Shadowing in an inner block does not affect availability of the same-named variable **outside** that block.',
                    theoryUK: 'Вірно: після виходу з блоку доступ повертається до зовнішнього біндінгу.',
                    theoryEN: 'True: once the block ends, lookup resumes to the outer binding.',
                    isCorrect: true
                },
                {
                    textUK: "`'use strict'` скасовує TDZ для `let/const` у вкладених блоках.",
                    textEN: "`'use strict'` removes the TDZ for `let/const` in nested blocks.",
                    theoryUK: 'Невірно: strict mode не скасовує TDZ; правила доступу лишаються тими самими.',
                    theoryEN: 'Incorrect: strict mode does not remove TDZ; access rules are unchanged.',
                    isCorrect: false
                },
                {
                    textUK: 'У межах **того самого** блоку не можна двічі оголошувати однакове ім’я з `let/const`, але в **внутрішньому** блоці — можна.',
                    textEN: 'Within the **same** block you cannot redeclare the same name with `let/const`, but you can in an **inner** block.',
                    theoryUK: 'Вірно: у внутрішньому блоці це вже інша область — це shadowing.',
                    theoryEN: 'True: an inner block introduces a new scope — that’s shadowing.',
                    isCorrect: true
                },
                {
                    textUK: '`const` у вкладеному блоці піднімається й одразу ініціалізується `undefined`, тому читання до декларації можливе.',
                    textEN: '`const` in a nested block is hoisted and immediately initialized to `undefined`, so reads before the declaration are allowed.',
                    theoryUK: 'Невірно: `const` так само у TDZ і не ініціалізується до декларації.',
                    theoryEN: 'Incorrect: `const` is in TDZ and remains uninitialized until the declaration.',
                    isCorrect: false
                },
                {
                    textUK: 'Локальне оголошення `let i` в тілі `for` може зробити звертання до зовнішнього `i` неможливим **вище** рядка декларації через TDZ.',
                    textEN: 'A local `let i` declared in a `for` body can block access to an outer `i` **above** the declaration line due to the TDZ.',
                    theoryUK: 'Вірно: від початку блоку тіла циклу до декларації діє TDZ для локального `i`.',
                    theoryEN: 'True: from the start of the loop body block until the declaration the local `i` is in TDZ.',
                    isCorrect: true
                },
                {
                    textUK: 'Якщо внутрішній блок завершується, зовнішня змінна з тим самим ім’ям залишається прихованою й надалі.',
                    textEN: 'Once the inner block ends, the outer variable with the same name remains hidden afterwards.',
                    theoryUK: 'Невірно: приховування діє лише **всередині** блоку; поза ним — знову видно зовнішню змінну.',
                    theoryEN: 'Incorrect: shadowing is **block-local**; outside, the outer variable is visible again.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Створення змінних без декларації: що станеться у strict mode і як це відрізняється від нестрогого режиму?',
            textEN: 'Creating variables without declaration: what happens in strict mode and how does it differ from sloppy mode?',
            theoryUK:
                "### Теорія: неявні глобальні змінні та strict mode\n\nУ **нестрогому режимі** (sloppy mode) присвоєння ідентифікатору, який **не був оголошений** (`var/let/const`), призводить до **неявного створення глобальної змінної** (у скриптах браузера — властивості `window`). Це історична поведінка, яка часто призводить до помилок та витоків у глобальну область.\n\nУ **strict mode** будь-яке присвоєння **неоголошеному** імені викликає **`ReferenceError`**. Строгий режим забороняє неявні глобалі, роблячи код більш передбачуваним.\n\n> Важливо:\n> - **Модулі (ESM)** завжди працюють у strict mode; отже, присвоєння неоголошеному імені в модулі також призведе до `ReferenceError`.\n> - У скриптах верхнього рівня (не модулі) strict mode вмикається директивою `'use strict'` на початку файлу чи функції.\n> - У strict mode **не можна** тихо створити властивість глобального об’єкта через присвоєння неоголошеній змінній.\n\n#### Приклади\n```html\n<!-- Скрипт без strict mode (sloppy) -->\n<script>\n  x = 10;               // ❗ створює window.x (неявний глобал)\n  console.log(window.x); // 10\n</script>\n\n<!-- Скрипт зі strict mode -->\n<script>\n  'use strict';\n  // x = 10;            // ❌ ReferenceError: x is not defined\n</script>\n\n<!-- Модуль завжди strict -->\n<script type=\"module\">\n  // x = 10;            // ❌ ReferenceError у модулі\n</script>\n```",
            theoryEN:
                "### Theory: implicit globals and strict mode\n\nIn **sloppy mode** (non-strict), assigning to an **undeclared** identifier (not declared with `var/let/const`) **creates an implicit global** (in browser scripts this becomes a `window` property). This legacy behavior often causes bugs and global leaks.\n\nIn **strict mode**, any assignment to an **undeclared** name throws a **`ReferenceError`**. Strict mode bans implicit globals, making code more predictable.\n\n> Notes:\n> - **ES modules (ESM)** are always strict; assigning to an undeclared name in a module throws `ReferenceError` as well.\n> - In scripts (non-modules), enable strict mode with a top-level `'use strict'` (file) or inside a function.\n> - In strict mode you **cannot** silently create a global object property by assigning to an undeclared variable.\n\n#### Examples\n```html\n<!-- Script without strict mode (sloppy) -->\n<script>\n  x = 10;               // ❗ creates window.x (implicit global)\n  console.log(window.x); // 10\n</script>\n\n<!-- Script with strict mode -->\n<script>\n  'use strict';\n  // x = 10;            // ❌ ReferenceError: x is not defined\n</script>\n\n<!-- Module is always strict -->\n<script type=\"module\">\n  // x = 10;            // ❌ ReferenceError in a module\n</script>\n```",
            answers: [
                {
                    textUK: 'У strict mode присвоєння неоголошеному імені кидає `ReferenceError`.',
                    textEN: 'In strict mode, assigning to an undeclared name throws `ReferenceError`.',
                    theoryUK: 'Вірно: strict забороняє неявні глобалі.',
                    theoryEN: 'True: strict mode forbids implicit globals.',
                    isCorrect: true
                },
                {
                    textUK: 'У нестрогому режимі присвоєння `x = 1` створить `window.x` у браузерному скрипті.',
                    textEN: 'In sloppy mode, assigning `x = 1` creates `window.x` in a browser script.',
                    theoryUK: 'Вірно: це історична поведінка скриптової глобалі.',
                    theoryEN: 'True: legacy behavior of script globals.',
                    isCorrect: true
                },
                {
                    textUK: 'У модулі `x = 1` без оголошення мовчки створить глобальну змінну.',
                    textEN: 'In a module, `x = 1` without declaration silently creates a global variable.',
                    theoryUK: 'Невірно: модулі завжди strict; буде `ReferenceError`.',
                    theoryEN: 'Incorrect: modules are always strict; it throws `ReferenceError`.',
                    isCorrect: false
                },
                {
                    textUK: "Директива `'use strict'` у функції робить строгим лише тіло цієї функції.",
                    textEN: "A `'use strict'` inside a function makes only that function body strict.",
                    theoryUK: 'Вірно: область дії директиви — поточний скрипт або функція.',
                    theoryEN: 'True: the directive applies to the current script or that function only.',
                    isCorrect: true
                },
                {
                    textUK: 'У strict mode заборонено не лише створення неявних глобалів, а й тихе присвоєння read-only властивостям.',
                    textEN: 'Strict mode forbids not only implicit globals but also silent assignments to read-only properties.',
                    theoryUK: 'Вірно: у strict багато «тихих» помилок перетворюються на явні.',
                    theoryEN: 'True: many silent failures become explicit errors in strict mode.',
                    isCorrect: true
                },
                {
                    textUK: 'Якщо оголосити `var x;` у strict mode, то `x = 1` кине помилку, бо strict забороняє присвоєння.',
                    textEN: 'If you declare `var x;` in strict mode, then `x = 1` throws because strict forbids assignment.',
                    theoryUK: 'Невірно: присвоєння **оголошеним** змінним дозволено; заборонене присвоєння **неоголошеним**.',
                    theoryEN: 'Incorrect: assigning to **declared** variables is fine; assigning to **undeclared** is forbidden.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: '`this` у звичайних функціях: `undefined` проти глобального об’єкта — як саме працює у strict/sloppy?',
            textEN: '`this` in regular functions: `undefined` vs global object — how does it work in strict vs sloppy?',
            theoryUK:
                "### Теорія: `this` у звичайних функціях\n\n- **Виклик як звичайна функція** (`fn()`):\n  - У **нестрогому** режимі `this` за замовчуванням посилається на **глобальний об’єкт** (у браузері — `window`, в інших середовищах — `globalThis`).\n  - У **strict mode** `this` в такому виклику дорівнює **`undefined`**.\n- **Виклик як метод** (`obj.fn()`): `this` дорівнює **`obj`** (контекст — об’єкт до крапки), незалежно від strict/слoppy.\n- **Конструктор** (`new Fn()`): `this` — новий створений об’єкт (екземпляр), незалежно від strict/слoppy.\n- **`Function.prototype.call/apply/bind`**: явно задають `this` (у strict — зберігається значення; у sloppy `null/undefined` коерсується до глобального об’єкта).\n- **Стрілкові функції**: `this` береться **лексично** з оточення оголошення; strict/sloppy не впливає на це правило.\n- **Модулі**: на верхньому рівні `this === undefined` (навіть без `'use strict'`, бо модулі завжди strict). У скриптах на верхньому рівні `this === window` (у браузері).\n\n#### Приклади\n```js\nfunction f(){ return this; }\n\n// sloppy script\na = f();              // глобальний об'єкт (window/globalThis)\n\n// strict\n(function(){ 'use strict'; console.log(f()); })(); // undefined\n\nconst obj = { f };\nobj.f();              // obj\n\nnew f();              // this — новий екземпляр\n\nconst g = f.bind(123);\ng();                  // 123 у strict; у sloppy 123 примітив обгортається (boxing)\n```",
            theoryEN:
                "### Theory: `this` in regular functions\n\n- **Plain function call** (`fn()`):\n  - In **sloppy** mode, `this` defaults to the **global object** (`window` in browsers, or `globalThis`).\n  - In **strict** mode, `this` in such a call is **`undefined`**.\n- **Method call** (`obj.fn()`): `this` equals **`obj`**, regardless of strict/sloppy.\n- **Constructor** (`new Fn()`): `this` is the newly created instance, regardless of strict/sloppy.\n- **`call/apply/bind`**: set `this` explicitly (in strict, the exact value is used; in sloppy, `null/undefined` is coerced to the global object).\n- **Arrow functions**: `this` is captured **lexically** from the surrounding scope; strict vs sloppy doesn’t change this.\n- **Modules**: top-level `this === undefined` (modules are always strict). In scripts, top-level `this === window` (in browsers).\n\n#### Examples\n```js\nfunction f(){ return this; }\n\n// sloppy script\na = f();              // global object (window/globalThis)\n\n// strict\n(function(){ 'use strict'; console.log(f()); })(); // undefined\n\nconst obj = { f };\nobj.f();              // obj\n\nnew f();              // this — new instance\n\nconst g = f.bind(123);\ng();                  // 123 in strict; in sloppy primitives are boxed\n```",
            answers: [
                {
                    textUK: 'У strict mode `fn()` (звичайний виклик) встановлює `this === undefined`.',
                    textEN: 'In strict mode a plain `fn()` call sets `this === undefined`.',
                    theoryUK: 'Вірно: відсутній прив’язаний об’єкт — `this` не коерсується до глобального.',
                    theoryEN: 'True: without a receiver, `this` is not coerced to the global object.',
                    isCorrect: true
                },
                {
                    textUK: 'У нестрогому режимі `fn()` встановлює `this` на глобальний об’єкт.',
                    textEN: 'In sloppy mode, `fn()` sets `this` to the global object.',
                    theoryUK: 'Вірно: так працює історична семантика.',
                    theoryEN: 'True: that’s the legacy behavior.',
                    isCorrect: true
                },
                {
                    textUK: '`obj.fn()` у strict mode встановлює `this` в `undefined`, бо strict вимикає контекст об’єкта.',
                    textEN: '`obj.fn()` in strict mode sets `this` to `undefined` because strict disables object context.',
                    theoryUK: 'Невірно: виклик як **методу** завжди встановлює `this` у об’єкт-отримувач (`obj`).',
                    theoryEN: 'Incorrect: method calls set `this` to the receiver object (`obj`).',
                    isCorrect: false
                },
                {
                    textUK: '`new Fn()` встановлює `this` на новий екземпляр як у strict, так і в sloppy.',
                    textEN: '`new Fn()` sets `this` to the new instance in both strict and sloppy modes.',
                    theoryUK: 'Вірно: конструкторна семантика не залежить від strict.',
                    theoryEN: 'True: constructor semantics are independent of strict mode.',
                    isCorrect: true
                },
                {
                    textUK: 'У модулях на верхньому рівні `this === window`.',
                    textEN: 'At the top level of modules, `this === window`.',
                    theoryUK: 'Невірно: у модулях `this === undefined` на верхньому рівні.',
                    theoryEN: 'Incorrect: in modules, top-level `this === undefined`.',
                    isCorrect: false
                },
                {
                    textUK: 'Стрілкові функції завжди мають `this === undefined` у strict mode.',
                    textEN: 'Arrow functions always have `this === undefined` in strict mode.',
                    theoryUK: 'Невірно: стрілки **лексично** успадковують `this` з оточення, а не встановлюють `undefined` за правилом виклику.',
                    theoryEN: 'Incorrect: arrows **lexically** capture `this` from the surrounding scope.',
                    isCorrect: false
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'Strict mode у модулях: чому модулі автоматично строгі і чим вони відрізняються від скриптів?',
            textEN: 'Strict mode in modules: why are modules automatically strict and how do they differ from scripts?',
            theoryUK:
                "### Теорія: модулі (ESM) та strict mode\n\n- **ES-модулі завжди виконуються в strict mode** — навіть без явної директиви `'use strict'`.\n- **Верхньорівневий `this`** у модулі дорівнює **`undefined`** (у скрипті — посилання на глобальний об’єкт, наприклад `window`).\n- **Глобальні біндінги**: у модулі верхній рівень — **module scope**, а не глобальна область скрипта; тому:\n  - `var` на верхньому рівні **не** стає властивістю глобального об’єкта;\n  - `let/const` — також модульні декларативні біндінги;\n  - імпорти/експорти доступні лише в модульному контексті.\n- **Заборони strict mode** застосовуються автоматично: не можна використовувати `with`, дублювати імена параметрів, використовувати деякі восьмкові escape-послідовності тощо.\n- **`eval` у модулі**: модуль уже strict; прямий `eval` не «протікає» у модульний лексичний простір так, як у sloppy-скрипті. Непрямий `eval` виконується в глобальному контексті.\n- **Завантаження**: модулі завжди виконуються в окремому модульному графі з чітким порядком завантаження/оцінки, тоді як скрипти просто виконуються у глобальному середовищі послідовно.\n\n#### Приклади\n```html\n<!-- Скрипт (не модуль) -->\n<script>\n  console.log(this === window); // true\n  var a = 1;\n  console.log('a' in window);   // true (у скрипті)\n</script>\n\n<!-- Модуль -->\n<script type=\"module\">\n  console.log(this);            // undefined\n  var a = 1;\n  console.log('a' in window);   // false — module scope, не глобальна властивість\n</script>\n```",
            theoryEN:
                "### Theory: modules (ESM) and strict mode\n\n- **ES modules run in strict mode by default** — even without an explicit `'use strict'`.\n- **Top-level `this`** in a module is **`undefined`** (whereas in a script it refers to the global object, e.g., `window`).\n- **Global bindings**: modules have **module scope** at the top level; therefore:\n  - top-level `var` does **not** become a global object property;\n  - `let/const` are module-scoped declarative bindings;\n  - imports/exports are available only in modules.\n- **Strict-mode bans** apply automatically: `with` is disallowed, duplicate parameter names are illegal, certain octal escapes are forbidden, etc.\n- **`eval` in modules**: the module is already strict; direct eval does not leak into module scope like sloppy scripts. Indirect eval runs in the global context.\n- **Loading**: modules execute within a dependency graph with well-defined evaluation order; scripts just run in the global environment sequentially.\n\n#### Examples\n```html\n<!-- Script (non-module) -->\n<script>\n  console.log(this === window); // true\n  var a = 1;\n  console.log('a' in window);   // true (script)\n</script>\n\n<!-- Module -->\n<script type=\"module\">\n  console.log(this);            // undefined\n  var a = 1;\n  console.log('a' in window);   // false — module scope, not a global property\n</script>\n```",
            answers: [
                {
                    textUK: "Модулі за замовчуванням виконуються в strict mode (без `'use strict'`).",
                    textEN: "Modules run in strict mode by default (without `'use strict'`).",
                    theoryUK: 'Вірно: це частина специфікації ESM.',
                    theoryEN: 'True: that’s mandated by ESM specification.',
                    isCorrect: true
                },
                {
                    textUK: 'На верхньому рівні модуля `this === undefined`, тоді як у скрипті — посилання на глобальний об’єкт.',
                    textEN: 'At a module’s top level `this === undefined`, whereas in scripts it refers to the global object.',
                    theoryUK: 'Вірно: різниця між module scope та script global.',
                    theoryEN: 'True: module scope vs script global difference.',
                    isCorrect: true
                },
                {
                    textUK: 'У модулі `var x` стає `window.x`, як і в скрипті.',
                    textEN: 'In a module, `var x` becomes `window.x`, same as in a script.',
                    theoryUK: 'Невірно: у модулі top-level `var` **не** додається до глобального об’єкта.',
                    theoryEN: 'Incorrect: top-level `var` in a module does **not** create a global object property.',
                    isCorrect: false
                },
                {
                    textUK: "Директива `'use strict'` у модулі нічого не змінює, бо strict уже увімкнено.",
                    textEN: "A `'use strict'` directive in a module changes nothing because strict is already on.",
                    theoryUK: 'Вірно: зайва, але легальна.',
                    theoryEN: 'True: redundant but legal.',
                    isCorrect: true
                },
                {
                    textUK: "`with` дозволено в модулях, якщо явно не вказувати `'use strict'`.",
                    textEN: "`with` is allowed in modules if you don’t explicitly use `'use strict'`.",
                    theoryUK: 'Невірно: модулі **завжди** strict; `with` заборонено.',
                    theoryEN: 'Incorrect: modules are **always** strict; `with` is forbidden.',
                    isCorrect: false
                },
                {
                    textUK: 'У модулях імпорти/експорти вимагають модульного контексту і недоступні у звичайних скриптах.',
                    textEN: 'Imports/exports require module context and are unavailable in plain scripts.',
                    theoryUK: 'Вірно: синтаксис `import/export` працює лише в ESM.',
                    theoryEN: 'True: `import/export` syntax works only in ESM.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'LexicalEnvironment та EnvironmentRecord: як рушій зберігає змінні (концептуальний рівень)?',
            textEN: 'LexicalEnvironment and EnvironmentRecord: how does the engine store variables (conceptual view)?',
            theoryUK:
                '### Теорія: LexicalEnvironment та EnvironmentRecord\n\n**Lexical Environment** — це пара:\n1) **Environment Record (ER)** — «таблиця» біндінгів (ідентифікатор → значення + метадані),\n2) посилання на **outer** (зовнішнє лексичне середовище).\n\nПошук ідентифікатора йде по ланцюгу: *current ER → outer → … → global*.\n\n**Види Environment Record:**\n- **Declarative ER** — біндінги для `let/const/class`, параметрів, локальних змінних функції.\n- **Function ER** *(спеціалізація Declarative)* — додає службове: `this` binding, `super`, `new.target`, `arguments` (у нестрогому режимі можливе aliasing параметрів з `arguments`).\n- **Module ER** *(спеціалізація Declarative)* — імпорт/експорт як незмінні біндінги, завжди strict.\n- **Object ER** — використовує **об’єкт** як сховище (в глобалі — глобальний об’єкт).\n- **Global ER** — композиція **Object ER** (властивості глобального об’єкта для `var`/Function Declaration у скрипті) + **Declarative ER** (для `let/const` на верхньому рівні).\n\n**VariableEnvironment vs LexicalEnvironment (в EC):**\n- У кожному **Execution Context** є `LexicalEnvironment` **та** `VariableEnvironment`.\n- Під час *BindingInstantiation* у скриптах/функціях: `var` і **Function Declaration** кладуться у **VariableEnvironment**; `let/const/class` — у **LexicalEnvironment**. (У модулях все топ-рівневе — декларативне, без Object ER для `var`).\n\n**Операції ER (спрощено):** `HasBinding`, `CreateMutableBinding`, `CreateImmutableBinding`, `InitializeBinding`, `SetMutableBinding`, `GetBindingValue`, `DeleteBinding`.\n- `let/const` створюються **без ініціалізації** (у TDZ) і отримують значення лише на кроці ініціалізації декларації.\n- `var` створюється та ініціалізується `undefined` одразу під час *creation phase*.\n- Function Declaration створюється як **ціла функція** (доступна до рядка оголошення).\n\n```text\nLexicalEnvironment = { envRec, outer }\nenvRec (Declarative|Function|Module|Object|Global)\n```\n\n```js\n// Глобальний скрипт: дві частини Global ER\nvar a = 1;      // -> Global Object ER (window.a у браузері)\nlet b = 2;      // -> Global Declarative ER (не властивість window)\nfunction f(x){  // Function ER: параметри, this, arguments\n  let y = x;    // Declarative ER функції\n  return () => y; // замикання тримає посилання на ER з y\n}\n```\n',
            theoryEN:
                '### Theory: LexicalEnvironment and EnvironmentRecord\n\nA **Lexical Environment** is a pair of:\n1) an **Environment Record (ER)** — a map of bindings (identifier → value + metadata), and\n2) a reference to an **outer** environment.\n\nIdentifier lookup walks: *current ER → outer → … → global*.\n\n**Kinds of Environment Records:**\n- **Declarative ER** — bindings for `let/const/class`, parameters, local vars.\n- **Function ER** *(specialized Declarative)* — adds `this` binding, `super`, `new.target`, `arguments` (sloppy aliasing of params).\n- **Module ER** *(specialized Declarative)* — import/export immutable bindings; always strict.\n- **Object ER** — uses an **object** as storage (global object in scripts).\n- **Global ER** — composition of **Object ER** (global-object props for `var`/Function Declarations in scripts) + **Declarative ER** (top-level `let/const`).\n\n**VariableEnvironment vs LexicalEnvironment:**\n- Each **Execution Context** has both. During *BindingInstantiation* in scripts/functions: `var` and **Function Declarations** go to **VariableEnvironment**; `let/const/class` go to **LexicalEnvironment**. (In modules, top-level bindings are declarative only.)\n\n**ER operations (simplified):** `HasBinding`, `CreateMutableBinding`, `CreateImmutableBinding`, `InitializeBinding`, `SetMutableBinding`, `GetBindingValue`, `DeleteBinding`.\n- `let/const` are created **uninitialized** (TDZ) and get values only at the declaration’s initialization step.\n- `var` is created and initialized to `undefined` during the *creation phase*.\n- Function Declarations are created as **full functions** (callable before their line).\n\n```js\n// Global script: Global ER has object + declarative parts\nvar a = 1;      // -> Global Object ER (window.a in browsers)\nlet b = 2;      // -> Global Declarative ER (not a window prop)\nfunction f(x){  // Function ER: params, this, arguments\n  let y = x;    // Declarative ER of the function\n  return () => y; // closure keeps a reference to the ER with y\n}\n```\n',
            answers: [
                {
                    textUK: 'Lexical Environment — це `envRec` плюс посилання на `outer` для ланцюга пошуку.',
                    textEN: 'A Lexical Environment is an `envRec` plus an `outer` reference for lookup chaining.',
                    theoryUK: 'Вірно: саме пара (EnvironmentRecord, outer) утворює вузол лексичного ланцюга.',
                    theoryEN: 'True: the pair (EnvironmentRecord, outer) forms each node of the lexical chain.',
                    isCorrect: true
                },
                {
                    textUK: '`var` і Function Declaration потрапляють у VariableEnvironment під час ініціалізації контексту.',
                    textEN: '`var` and Function Declarations go into the VariableEnvironment during context initialization.',
                    theoryUK: 'Вірно: це частина процедури BindingInstantiation для скриптів/функцій.',
                    theoryEN: 'True: part of BindingInstantiation for scripts/functions.',
                    isCorrect: true
                },
                {
                    textUK: 'Module Environment Record — це спеціалізація Declarative ER; імпорти/експорти — біндінги ER.',
                    textEN: 'The Module Environment Record is a specialized Declarative ER; imports/exports are ER bindings.',
                    theoryUK: 'Вірно: модулі працюють тільки з декларативними біндінгами і завжди strict.',
                    theoryEN: 'True: modules use declarative bindings and are always strict.',
                    isCorrect: true
                },
                {
                    textUK: 'Object Environment Record використовується для `let/const` у глобалі.',
                    textEN: 'The Object Environment Record is used for top-level `let/const` in the global scope.',
                    theoryUK:
                        'Невірно: `let/const` глобального рівня зберігаються у **Global Declarative ER**; Object ER — для властивостей глобального об’єкта (зокрема `var`).',
                    theoryEN: 'Incorrect: top-level `let/const` live in the **Global Declarative ER**; the Object ER backs global-object properties (e.g., `var`).',
                    isCorrect: false
                },
                {
                    textUK: 'Function Expression піднімається як повна функція в ER так само, як і Function Declaration.',
                    textEN: 'A Function Expression is hoisted as a full function in the ER just like a Function Declaration.',
                    theoryUK: 'Невірно: Function Expression — це значення змінної; її доступність визначає біндінг (`var/let/const`).',
                    theoryEN: 'Incorrect: Function Expressions are just values bound to variables; availability follows the variable’s binding.',
                    isCorrect: false
                },
                {
                    textUK: 'Кожний ER має операції на кшталт `CreateMutableBinding`, `InitializeBinding`, `GetBindingValue`.',
                    textEN: 'Each ER exposes operations like `CreateMutableBinding`, `InitializeBinding`, and `GetBindingValue`.',
                    theoryUK: 'Вірно: ці абстрактні методи визначають життєвий цикл біндінгів у спеку.',
                    theoryEN: 'True: these abstract ops define the binding lifecycle in the spec.',
                    isCorrect: true
                }
            ],
            level: 'middle'
        },
        {
            textUK: 'TDZ і ReferenceError на рівні специфікації: чому змінна «є у scope», але доступ викликає помилку?',
            textEN: 'TDZ and ReferenceError at the spec level: why can a variable be "in scope" yet accessing it throws?',
            theoryUK:
                "### Теорія: TDZ у термінах спеку (ECMAScript)\n\n1) На етапі **BindingInstantiation** у Declarative ER створюється біндінг для `let/const` через `CreateMutableBinding`/`CreateImmutableBinding`, **без ініціалізації**.\n2) До виконання декларації виконується код, що звертається до ідентифікатора. Механізм `ResolveBinding(name)` повертає **Reference** до знайденого біндінгу (він **існує** у поточному LE), але він **не ініціалізований** (TDZ).\n3) Під час отримання значення викликається `GetValue(ref)` → `envRec.GetBindingValue(name, strict)`. Якщо біндінг **Uninitialized**, специфікація наказує кинути **`ReferenceError`**.\n\nЗвідси: змінна **є** у scope (бо ER вже містить запис), але **недоступна** до ініціалізації — це і є **Temporal Dead Zone**.\n\n**`typeof` і TDZ:**\n- Якщо імені **немає** ні в одному ER (unresolvable reference), `typeof name` повертає `'undefined'` (історичний виняток).\n- Якщо біндінг **є**, але **не ініціалізований** (TDZ), `typeof name` теж намагається отримати значення і **кидає `ReferenceError`**.\n\n**Приклади**\n```js\n// Приклад 1: базовий TDZ\n// console.log(x);   // ReferenceError (x у TDZ)\nlet x = 1;\n\n// Приклад 2: shadowing + TDZ\nlet y = 10;\n{\n  // console.log(y); // ReferenceError: локальний y у TDZ перекриває зовнішній\n  let y = 20;\n}\n\n// Приклад 3: typeof і TDZ\n// console.log(typeof notDeclared); // 'undefined' (нема біндінгу взагалі)\n{\n  // console.log(typeof z); // ReferenceError (є біндінг у TDZ нижче)\n  let z = 5;\n}\n```\n",
            theoryEN:
                "### Theory: TDZ in specification terms (ECMAScript)\n\n1) During **BindingInstantiation**, Declarative ER creates a binding for `let/const` via `CreateMutableBinding`/`CreateImmutableBinding`, **without initializing** it.\n2) Before the declaration executes, code may reference the identifier. `ResolveBinding(name)` returns a **Reference** to a found binding (it **exists** in the current LE) but it’s **uninitialized** (TDZ).\n3) When reading, `GetValue(ref)` calls `envRec.GetBindingValue(name, strict)`. If the binding is **Uninitialized**, the spec requires throwing **`ReferenceError`**.\n\nThus the variable **is** in scope (ER has the entry) but **unavailable** until initialization — that gap is the **Temporal Dead Zone**.\n\n**`typeof` and TDZ:**\n- If the name is **unresolvable** (no ER has it), `typeof name` returns `'undefined'`.\n- If a binding **exists** but is **uninitialized** (TDZ), `typeof name` also tries to get the value and **throws `ReferenceError`**.\n\n**Examples**\n```js\n// Example 1: basic TDZ\n// console.log(x);   // ReferenceError (x in TDZ)\nlet x = 1;\n\n// Example 2: shadowing + TDZ\nlet y = 10;\n{\n  // console.log(y); // ReferenceError: local y in TDZ shadows the outer y\n  let y = 20;\n}\n\n// Example 3: typeof and TDZ\n// console.log(typeof notDeclared); // 'undefined' (no binding at all)\n{\n  // console.log(typeof z); // ReferenceError (binding exists below but is uninitialized)\n  let z = 5;\n}\n```\n",
            answers: [
                {
                    textUK: 'У TDZ біндінг **існує** у ER, але не ініціалізований; `GetBindingValue` кидає `ReferenceError`.',
                    textEN: 'In the TDZ the binding **exists** in the ER but is uninitialized; `GetBindingValue` throws `ReferenceError`.',
                    theoryUK: 'Вірно: це прямий наслідок кроків `ResolveBinding` → `GetValue` у спеку.',
                    theoryEN: 'True: a direct consequence of `ResolveBinding` → `GetValue` steps in the spec.',
                    isCorrect: true
                },
                {
                    textUK: '`typeof x` завжди безпечний і ніколи не кидає, навіть при TDZ.',
                    textEN: '`typeof x` is always safe and never throws, even with the TDZ.',
                    theoryUK: 'Невірно: якщо існує неініціалізований біндінг (TDZ), `typeof` кине `ReferenceError`.',
                    theoryEN: 'Incorrect: with an existing uninitialized binding (TDZ), `typeof` throws `ReferenceError`.',
                    isCorrect: false
                },
                {
                    textUK: "Якщо ім’я взагалі не знайдено у жодному ER, `typeof name` поверне `'undefined'`.",
                    textEN: "If a name is not found in any ER, `typeof name` returns `'undefined'`.",
                    theoryUK: 'Вірно: це історична особливість `typeof` для unresolvable reference.',
                    theoryEN: 'True: the historical exception for unresolvable references.',
                    isCorrect: true
                },
                {
                    textUK: 'Shadowing може зробити так, що доступ до зовнішньої змінної кидає `ReferenceError`, доки локальна у TDZ.',
                    textEN: 'Shadowing can cause access to an outer variable to throw while the local one is in TDZ.',
                    theoryUK: 'Вірно: локальний біндінг у TDZ перекриває зовнішній і блокує доступ.',
                    theoryEN: 'True: the local TDZ binding shadows and blocks access to the outer.',
                    isCorrect: true
                },
                {
                    textUK: '`var` теж має TDZ до рядка оголошення, але без помилки (просто `undefined`).',
                    textEN: '`var` also has a TDZ until its declaration, just without an error (it’s `undefined`).',
                    theoryUK: 'Невірно: для `var` **немає** TDZ; біндінг створюється й ініціалізується `undefined` у creation phase.',
                    theoryEN: 'Incorrect: `var` has **no** TDZ; it’s created and initialized to `undefined` during the creation phase.',
                    isCorrect: false
                },
                {
                    textUK: 'У модулях TDZ застосовується так само: імпортовані імена — це біндінги ER з чіткими фазами створення/ініціалізації.',
                    textEN: 'In modules the TDZ applies alike: imported names are ER bindings with defined creation/initialization phases.',
                    theoryUK: 'Вірно: модульний граф оцінюється поетапно; доступ до ще-не-ініціалізованих імпортів призводить до помилки.',
                    theoryEN: 'True: module evaluation is phased; accessing not-yet-initialized imports is an error.',
                    isCorrect: true
                }
            ],
            level: 'senior'
        }
    ]
};
