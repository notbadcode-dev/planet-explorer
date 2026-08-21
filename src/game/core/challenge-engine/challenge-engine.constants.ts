/**
 * Constantes para el motor genérico de retos.
 *
 * NINGÚN LITERAL MÁGICO debe dispersarse en la lógica; todos deben estar aquí.
 * Ver `scripts/check-components.mjs` (regla d) y
 * `specs/007-challenge-engine-core/contracts/challenge-interface.md`.
 */

import type { Hint } from './challenge-engine.type';

/** Tipo de reto: conteo de elementos. */
export const CHALLENGE_TYPE_COUNTING = 'counting' as const;

/**
 * Catálogo de tipos de reto soportados en esta feature (v1.0). Futuras
 * features (008+) pueden extender este array sin romper el contrato público.
 */
export const SUPPORTED_CHALLENGE_TYPES: readonly string[] = [CHALLENGE_TYPE_COUNTING] as const;

/** Dificultad mínima soportada (inclusive). */
export const MIN_DIFFICULTY = 1;

/** Dificultad máxima soportada (inclusive). */
export const MAX_DIFFICULTY = 10;

/** Dificultad por defecto cuando `ChallengeConfig.difficulty` no se especifica. */
export const DEFAULT_DIFFICULTY = MIN_DIFFICULTY;

/** Valor mínimo permitido para `CountingChallengeConfig.min`. */
export const MIN_COUNTING_VALUE = 1;

/** Descriptor de tipo por defecto para los elementos de un `CountingChallenge`. */
export const COUNTING_ITEM_TYPE = 'star' as const;

/** Prefijo del identificador único de un reto. */
export const CHALLENGE_ID_PREFIX = 'challenge-';

/** Prefijo del identificador único de un elemento de conteo. */
export const ITEM_ID_PREFIX = 'item-';

/** Desplazamiento para convertir un índice base-0 en un número de orden base-1. */
export const ITEM_INDEX_OFFSET = 1;

/** Desplazamiento para que un rango `[min, max]` sea inclusivo en el cálculo aleatorio. */
export const INCLUSIVE_RANGE_OFFSET = 1;

/** Texto de la pregunta para retos de tipo `counting` (contenido visible al jugador). */
export const COUNTING_QUESTION_TEXT = '¿Cuántas estrellas ves?';

/** Tipo primitivo TypeScript esperado para la respuesta del jugador. */
export const TYPE_NUMBER = 'number' as const;

/**
 * Resultado de validar la respuesta del jugador a un reto.
 *
 * Valores: 'success' (respuesta correcta), 'failure' (respuesta incorrecta).
 *
 * Origen: históricamente importado de `../progress/skill-progress-state.constants`,
 * pero la corrección R5 (spec 009) mueve estas constantes aquí, a `challenge-engine.constants.ts`,
 * para desacoplar `challenge-engine.ts` de la lógica de progresión. El tipo
 * `SkillUpdateResult` permanece en `challenge-engine.type.ts` (ya estaba allí).
 *
 * Nota: en futuro, `validateAnswer()` devolverá `SkillUpdateResult` en vez de string literal;
 * por ahora, estos valores son strings literales para mantener compatibilidad.
 */
export const CHALLENGE_RESULT_SUCCESS = 'success' as const;
export const CHALLENGE_RESULT_FAILURE = 'failure' as const;

/**
 * Mensaje de error para `min` inválido (< `MIN_COUNTING_VALUE`).
 * Ver contrato: "min must be >= 1".
 */
export function makeInvalidMinError(min: unknown): Error {
    return new Error(`min must be >= 1 (received: ${min})`);
}

/**
 * Mensaje de error para `min > max`.
 * Ver contrato: "min cannot exceed max".
 */
export function makeInvalidRangeError(min: number, max: number): Error {
    return new Error(`min cannot exceed max (min: ${min}, max: ${max})`);
}

/**
 * Mensaje de error para `difficulty` fuera de [MIN_DIFFICULTY, MAX_DIFFICULTY].
 * Ver contrato: "difficulty must be between 1 and 10".
 */
export function makeInvalidDifficultyError(difficulty: unknown): Error {
    return new Error(
        `difficulty must be between ${MIN_DIFFICULTY} and ${MAX_DIFFICULTY} (received: ${difficulty})`,
    );
}

/**
 * Mensaje de error para `type` no soportado.
 * Ver contrato: "unsupported challenge type: {type}".
 */
export function makeUnsupportedChallengeTypeError(type: unknown): Error {
    return new Error(`unsupported challenge type: ${String(type)}`);
}

/** ID de la primera pista para retos de tipo `counting`. */
export const COUNTING_HINT_1_ID = 'counting-hint-1' as const;

/** ID de la segunda pista para retos de tipo `counting`. */
export const COUNTING_HINT_2_ID = 'counting-hint-2' as const;

/** Orden de la primera pista en la secuencia. */
export const COUNTING_HINT_ORDER_FIRST = 1 as const;

/** Orden de la segunda pista en la secuencia. */
export const COUNTING_HINT_ORDER_SECOND = 2 as const;

/** Texto de la primera pista para retos de tipo `counting`. */
export const COUNTING_HINT_1_TEXT = 'Señala cada estrella con el dedo y cuenta de una en una.';

/** Texto de la segunda pista para retos de tipo `counting`. */
export const COUNTING_HINT_2_TEXT = 'Agrupa las estrellas de dos en dos: así cuentas más rápido.';

/**
 * Catálogo de pistas progresivas para retos de tipo `counting`.
 * Estas pistas se adjuntan a cada `CountingChallenge` generado.
 */
export const COUNTING_HINTS: readonly Hint[] = [
    {
        id: COUNTING_HINT_1_ID,
        order: COUNTING_HINT_ORDER_FIRST,
        text: COUNTING_HINT_1_TEXT,
    },
    {
        id: COUNTING_HINT_2_ID,
        order: COUNTING_HINT_ORDER_SECOND,
        text: COUNTING_HINT_2_TEXT,
    },
] as const;

/**
 * Mensaje de error para respuesta `null`/`undefined`.
 * Ver contrato: "answer cannot be null or undefined".
 */
export function makeNullAnswerError(): Error {
    return new Error('answer cannot be null or undefined');
}

/**
 * Mensaje de error para respuesta de tipo distinto de `number`.
 * Ver contrato: "answer must be a number (got {typeof})".
 */
export function makeInvalidAnswerTypeError(answer: unknown): Error {
    return new Error(`answer must be a number (got ${typeof answer})`);
}
