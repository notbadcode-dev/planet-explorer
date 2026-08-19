/**
 * Constantes para el motor genérico de retos.
 *
 * NINGÚN LITERAL MÁGICO debe dispersarse en la lógica; todos deben estar aquí.
 * Ver `scripts/check-components.mjs` (regla d) y
 * `specs/007-challenge-engine-core/contracts/challenge-interface.md`.
 */

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
