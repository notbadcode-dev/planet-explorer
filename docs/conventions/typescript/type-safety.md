---
title: "Convención: Seguridad de tipos en TypeScript"
type: "convention"
version: "1.1"
created: "2026-08-22"
updated: "2026-08-22"
status: "Draft"
source: "Auditoría de `npx tsc --noEmit` (2026-08-22): 162 errores bajo la configuración estricta ya vigente (`strict: true` + `noUncheckedIndexedAccess: true`), corregidos íntegramente el mismo día en la rama `chore/tsc-strict-fixes`. Desde entonces `npx tsc --noEmit` (con `\"types\": [\"vite/client\"]` en `tsconfig.json`) da 0 errores y se ejecuta como gate adicional junto a `npm run lint && npm test && npm run build`."
tags: ["typescript", "type-safety", "convention", "quality"]
---

# Convención: Seguridad de tipos en TypeScript

**Fuente**: auditoría manual de `npx tsc --noEmit` ejecutada el 2026-08-22, tras cerrar
la spec 011. El proyecto ya declara `strict: true` y `noUncheckedIndexedAccess: true`
en `tsconfig.json`, pero bajo esas mismas reglas existían 162 errores acumulados sin
corregir en `libs/components/`, `libs/persistence/` y `src/game/`, porque `tsc --noEmit`
no forma parte del gate real de CI (`npm run lint && npm test && npm run build`) — ver
"Fuera de alcance" para el motivo documentado.

## Propósito

Fijar patrones concretos de código que evitan las cinco categorías de error de
`tsc --noEmit` detectadas en la auditoría, para que no vuelvan a introducirse al
escribir código nuevo o al modificar tipos existentes. Cada regla corresponde a una
categoría real de error observada, con su código TS asociado y un ejemplo tomado (o
adaptado) del propio repositorio.

## Jerarquía de tipado — `unknown` es el último recurso, no un valor por defecto

Antes de aplicar TS5 (más abajo), **MUST** agotar en orden estas alternativas; solo
se llega a `unknown` cuando ninguna de las anteriores aplica:

1. **Tipo concreto conocido de antemano** — si la forma del dato se conoce en tiempo
   de escritura (un DTO propio, la respuesta de una función interna), tipar con ese
   tipo exacto. Es la opción por defecto para todo el código interno del proyecto.
2. **Genérico con constraint** (`<T extends Record<string, unknown>>`) — cuando una
   función debe funcionar con varias formas conocidas pero relacionadas, en vez de
   perder el tipo por completo.
3. **Unión discriminada** (`{ type: 'a'; ... } | { type: 'b'; ... }`) — cuando el dato
   puede tener una de varias formas conocidas y cerradas.
4. **`unknown` + type guard** — reservado **exclusivamente** para fronteras reales de
   entrada/salida donde la forma no puede conocerse en tiempo de compilación:
   `JSON.parse`, `localStorage`, respuestas de red, payloads de eventos genéricos,
   librerías de terceros sin tipos. Ver TS5.

**MUST NOT** usar `unknown` como sustituto genérico de tipar correctamente una
función o variable interna "por si acaso cambia la forma más adelante" — eso es
exactamente para qué existen los tipos concretos y las uniones discriminadas. Si una
revisión de código encuentra `unknown` en una firma de función que **no** cruza una
frontera de entrada/salida real, es una señal de que falta modelar el tipo
correctamente, no de que el dato sea "genuinamente desconocido".

**MUST NOT** propagar `unknown` más allá del punto donde se valida: en cuanto el
type guard confirma la forma real del dato (ver ejemplo de TS5), el resto del código
MUST usar el tipo ya estrechado — no seguir pasando `unknown` a funciones internas
que podrían recibir directamente el tipo concreto.

**MUST NOT** usar `any` en ningún caso como alternativa a `unknown`: `any` desactiva
el chequeo de tipos por completo (incluida la obligación de usar un type guard antes
de leer propiedades), mientras que `unknown` obliga a validar antes de usar. Si
`tsc --noEmit` no reporta ningún error donde se esperaría uno tras introducir un dato
externo, sospecha primero de un `any` implícito o explícito.

## Reglas

### TS1 — Acceso a índices/arrays: tratar el resultado como posiblemente `undefined`

`noUncheckedIndexedAccess` hace que `array[i]`, `Object.values(obj)[i]` o `map.get(k)`
devuelvan `T | undefined`, no `T`. **MUST** estrechar el tipo (guard, optional
chaining, valor por defecto) antes de usar el valor — nunca asumir que existe solo
porque "en la práctica siempre hay al menos un elemento".

Categorías de error que cubre: `TS18048` ("possibly undefined"), `TS2532` ("Object is
possibly undefined").

```ts
// ❌ Incorrecto — options[0] es `Option | undefined`, no `Option`
const firstOption = options[0];
console.log(firstOption.label); // TS2532: Object is possibly 'undefined'

// ✅ Correcto — guard explícito antes de acceder
const firstOption = options[0];
if (firstOption) {
  console.log(firstOption.label);
}

// ✅ Correcto — valor por defecto cuando existe uno razonable
const firstOption = options[0] ?? DEFAULT_OPTION;

// ✅ Correcto — optional chaining cuando `undefined` es un resultado válido
const label = options[0]?.label;
```

**MUST NOT** silenciar el error con `options[0]!` (non-null assertion) salvo que la
invariante esté garantizada estructuralmente por el tipo (p. ej. un array literal no
vacío definido en el mismo módulo) **y** se documente con un comentario por qué es
seguro. Ante la duda, usar el guard explícito.

### TS2 — Los tipos MUST reflejar todas las propiedades que usa la implementación

Cuando se añade una propiedad a un objeto (p. ej. una config, un DTO) sin actualizar
su `interface`/`type`, TypeScript detecta el desajuste con `TS2339` (leer una
propiedad que el tipo no declara) o `TS2353` (escribir una propiedad que el tipo no
admite en un objeto literal). **MUST** actualizar el tipo en el mismo cambio que se
usa la propiedad nueva — nunca dejar que el objeto literal "se adelante" al tipo.

```ts
// ❌ Incorrecto — ChallengeConfig no declara `min`/`max`, pero el literal los usa
interface ChallengeConfig {
  operandCount: number;
}

const config: ChallengeConfig = {
  operandCount: 2,
  min: 1, // TS2353: Object literal may only specify known properties
  max: 10,
};

// función consumidora, en otro fichero:
function generateChallenge(config: ChallengeConfig) {
  return random(config.min, config.max); // TS2339: Property 'min' does not exist
}

// ✅ Correcto — el tipo se actualiza a la vez que se introduce el uso
interface ChallengeConfig {
  operandCount: number;
  min: number;
  max: number;
}
```

### TS3 — No mezclar tipos "similares en forma" pero distintos en dominio

Dos tipos pueden compartir estructura (ambos son `string` unions, o ambos son objetos
con campos parecidos) sin ser intercambiables semánticamente. Pasar uno donde se
espera el otro es un error de dominio, no solo de tipos — TypeScript lo marca como
`TS2345` ("Argument of type X is not assignable to parameter of type Y").

```ts
// ❌ Incorrecto — SkillDomain (p. ej. 'counting' | 'addition') no es lo mismo
// que SkillName (el identificador completo de una skill, p. ej. 'counting-lv1')
function updateSkillProgress(state: SkillProgressState, skill: SkillName, result: SkillUpdateResult) { /* ... */ }

updateSkillProgress(state, someSkillDomain, result);
// TS2345: Argument of type 'SkillDomain' is not assignable to parameter of type 'SkillName'

// ✅ Correcto — convertir explícitamente en el punto de la llamada, con una
// función nombrada que documente la relación entre ambos tipos
const skillName = skillNameFromDomain(someSkillDomain);
updateSkillProgress(state, skillName, result);
```

**MUST** revisar, ante este error, si de verdad los dos tipos deberían fusionarse
(evidencia de que la distinción ya no aporta nada) o si el código de la llamada tiene
un bug real (el caso más común: un test que pasó el valor equivocado por
copy-paste). **MUST NOT** "arreglar" el error solo con `as SkillName` sin verificar
cuál de las dos situaciones es.

### TS4 — Los helpers de DOM MUST tipar exactamente qué elementos aceptan

`HTMLElement` y `SVGElement` heredan de `Element` pero no son intercambiables:
`HTMLElement` no cubre nodos SVG (`<svg>`, `<path>`, etc.), así que una función tipada
para recibir `HTMLElement` rechaza un `SVGElement` con `TS2322`/`TS2345`.

```ts
// ❌ Incorrecto — el icono es un <svg>, no un HTMLElement
function focusFirst(container: HTMLElement, candidates: HTMLElement[]) { /* ... */ }

const icon = element.querySelector('svg'); // tipo: SVGSVGElement | null
focusFirst(container, [icon]); // TS2345: SVGElement no es HTMLElement

// ✅ Correcto — tipar el helper con la unión real de elementos que puede recibir
function focusFirst(container: HTMLElement, candidates: (HTMLElement | SVGElement)[]) { /* ... */ }

// ✅ Alternativa — si el helper es genérico de verdad (no le importa si es HTML o SVG),
// tiparlo contra `Element`, que es el ancestro común
function focusFirst(container: Element, candidates: Element[]) { /* ... */ }
```

**MUST** decidir explícitamente cuál de las dos alternativas aplica según si el
helper necesita miembros específicos de `HTMLElement` (p. ej. `.focus()`, `.dataset`,
que SVGElement no tiene igual) — en ese caso, la unión explícita es la opción
correcta, no `Element`.

### TS5 — Estrechar `unknown` antes de leer propiedades o pasarlo a funciones tipadas

**Recordatorio**: aplica esta regla solo tras confirmar, según la "Jerarquía de
tipado" de arriba, que el dato cruza de verdad una frontera de entrada/salida — si
la forma ya se conoce en tiempo de escritura, usa un tipo concreto en su lugar, no
`unknown`.

Datos que vienen de `JSON.parse`, `localStorage`, o cualquier entrada externa MUST
tiparse como `unknown`, nunca `any`. Pero `unknown` no permite leer propiedades
(`TS18046`, "'x' is of type unknown") ni pasarlo directamente a una función que
espera un tipo concreto (`TS2769`, "No overload matches this call") — hay que
validarlo/estrecharlo primero con un type guard.

```ts
// ❌ Incorrecto — `data` es `unknown` tras JSON.parse; acceder a `.version`
// o pasarlo a `new Date()` sin comprobar su forma falla en tiempo de compilación
function fallbackFromRaw(raw: string) {
  const data = JSON.parse(raw); // tipo: any implícito solo si no hay "strict"; con strict: unknown
  const version: number = data.version; // TS18046: 'data.version' is of type 'unknown'
  const date = new Date(data.timestamp); // TS2769: No overload matches this call
  return { version, date };
}

// ✅ Correcto — validar la forma con un type guard antes de leer nada
function isRawProgress(value: unknown): value is { version: number; timestamp: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).version === 'number' &&
    typeof (value as Record<string, unknown>).timestamp === 'string'
  );
}

function fallbackFromRaw(raw: string) {
  const data: unknown = JSON.parse(raw);
  if (!isRawProgress(data)) {
    return FALLBACK_PROGRESS;
  }
  return { version: data.version, date: new Date(data.timestamp) };
}
```

**MUST NOT** usar `as SomeType` para forzar el cast directamente sobre el resultado
de `JSON.parse` sin un type guard que compruebe la forma real en runtime — eso
reintroduce exactamente el problema que `unknown` existe para prevenir (asumir una
forma que el dato podría no tener, típicamente en datos persistidos con un
`schemaVersion` antiguo).

### TS6 — `typeof x === CONST` (constante nombrada) NO estrecha el tipo; envolver en un guard con predicado

Confirmado en TypeScript 6.0.3 (`strict` + `noUncheckedIndexedAccess`): `typeof x ===
'number'` con un **literal inline** SÍ estrecha `x` a `number`, pero `typeof x ===
TYPE_NUMBER` con una **constante nombrada** (aunque esté declarada `as const`, local
o importada) **NO** estrecha — TypeScript sigue viendo `x` con su tipo original tanto
en el resto del `&&`/`||` como en el cuerpo del `if`. Esto choca de frente con la
convención "sin literales mágicos" (`scripts/check-components.mjs`), que obliga a usar
constantes tipo `TYPE_NUMBER = 'number' as const` en vez del literal inline.

```ts
// ❌ Incorrecto — TS sigue viendo `data.version` como el tipo original
// (normalmente `unknown` o el de una propiedad de índice), no como `number`
if (typeof data.version === TYPE_NUMBER) {
  return data.version; // sin estrechar: sigue fallando TS18046/TS2322 según el contexto
}

// ✅ Correcto — envolver la comparación en una función guard con predicado
// explícito de tipo (`value is T`): el predicado estrecha SIEMPRE en el call site,
// independientemente de que la implementación interna use una constante
function isNumber(value: unknown): value is number {
  return typeof value === TYPE_NUMBER; // constante, sin problema aquí dentro
}

if (isNumber(data.version)) {
  return data.version; // ✅ estrechado a `number`
}
```

**MUST** replicar guards pequeños (`isNumber`, `isString`, `isRecord`, etc.) definidos
localmente por fichero cuando se necesite este patrón — no existe (ni se debe crear)
un módulo compartido de guards genéricos; seguir el mismo precedente que `isObject`
en `libs/persistence/src/core/fallback.ts`/`validate.ts`.

## Verificación

Ejecuta `npx tsc --noEmit` tras aplicar estas reglas a un fichero para confirmar que
el error puntual desaparece. Este comando **SÍ** forma parte del conjunto de gates a
ejecutar tras tocar tipos (junto a `npm run lint && npm test && npm run build`):
desde que `tsconfig.json` incluye `"types": ["vite/client"]`, da 0 errores en todo
el proyecto.

## Fuera de alcance

* **Reglas de ESLint equivalentes** — ver la sección siguiente: requieren un cambio
  de configuración (`parserOptions.project`) no incluido en este documento; queda
  como propuesta a decidir/aplicar por separado.

## Posible refuerzo con ESLint (propuesta, no aplicada)

`eslint.config.js` tiene actualmente `parserOptions.project: false`: el *type-aware
linting* de `typescript-eslint` está desactivado. Sin información de tipos, ESLint
**no puede** detectar por sí mismo las categorías TS1-TS3 (acceso a índices
posiblemente `undefined`, propiedades inexistentes, argumentos de tipo incorrecto)
— esos son diagnósticos que solo produce el compilador (`tsc --noEmit`), no reglas
de ESLint. Ningún plugin de ESLint sustituye esa comprobación; la única vía es
ejecutar `tsc --noEmit` (ver limitación del `TS2882` más arriba) o activar el
type-aware linting para las reglas que sí dependen de tipos (ver abajo).

Lo que **sí** aportaría el type-aware linting, activando `parserOptions.project`
(apuntando a `tsconfig.json`, y al `tsconfig.json` propio de `libs/persistence/` si
tiene reglas de compilación distintas) y añadiendo `...tseslint.configs.recommendedTypeChecked`
(o `strictTypeChecked` para más rigor) al `eslint.config.js`:

* `@typescript-eslint/no-unsafe-assignment`, `no-unsafe-member-access`,
  `no-unsafe-call`, `no-unsafe-return`, `no-unsafe-argument` — detectan operaciones
  sobre valores `any` (incluido `any` implícito colado por un cast prematuro),
  reforzando TS5 y la "Jerarquía de tipado".
* `@typescript-eslint/no-explicit-any` en modo `"error"` (ya está en `recommended`,
  pero solo como warning) — para que `unknown` sea la única vía posible en fronteras
  de entrada, nunca `any`.
* `@typescript-eslint/no-non-null-assertion` — para forzar a justificar cada `!`
  (relevante para TS1: evita silenciar `possibly undefined` con un assertion en vez
  de un guard).
* `@typescript-eslint/no-floating-promises`, `no-misused-promises` — no ligadas
  directamente a las categorías de esta auditoría, pero típicamente se activan junto
  al resto del set `recommendedTypeChecked`.

**Coste a tener en cuenta antes de activarlo**: el type-aware linting es
sensiblemente más lento (analiza tipos, no solo sintaxis) y, igual que `tsc --noEmit`,
probablemente reportaría errores nuevos sobre el código ya existente (especialmente
`no-unsafe-*` en los mismos ficheros de `libs/persistence/src/core/fallback.ts` y
`validate.ts` que ya tienen `TS18046`/`TS2769`). Activar esta config sin antes
resolver esos casos rompería `npm run lint` — no lo actives sin planificar antes cómo
tratar el código existente (misma disyuntiva que con `tsc --noEmit` en el gate).
