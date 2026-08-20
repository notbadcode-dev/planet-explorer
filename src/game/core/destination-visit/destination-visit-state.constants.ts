/**
 * Constantes para el módulo de gestión de visitas a destinos.
 *
 * Mismo patrón que challenge-engine.constants.ts y skill-progress-state.constants.ts.
 * NINGÚN LITERAL MÁGICO debe dispersarse en la lógica.
 */

/** Índice inicial de la secuencia de retos (primer reto). */
export const INITIAL_CHALLENGE_INDEX = 0;

/** Valor mínimo para los distractores (evita números negativos o cero). */
export const MIN_DISTRACTOR_VALUE = 1;

/** Incremento para mover al siguiente reto (currentIndex + 1). */
export const NEXT_CHALLENGE_OFFSET = 1;

/** Identificador de habilidad "counting" para actualización de progresión. */
export const SKILL_COUNTING_ID = 'counting' as const;

/** Nombre del parámetro de dificultad en la configuración de retos. */
export const CHALLENGE_DIFFICULTY_FIELD = 'difficulty' as const;

/** Índice de inicio para el algoritmo de barajado (Fisher-Yates). */
export const SHUFFLE_START_FACTOR = 1;

/** Factor de 0 para comparación en barajado. */
export const SHUFFLE_ZERO_FACTOR = 0;

/** Número de opciones de respuesta por reto (spec 008, FR-013).
 * 1 respuesta correcta + 3 distractores = 4 opciones totales.
 */
export const NUM_ANSWER_OPTIONS = 4;

/**
 * Offset para generar distractores: resta de la respuesta correcta.
 * Si correctAnswer es 5, -2 genera opción 3 (distractor).
 */
export const DISTRACTOR_OFFSET_1 = -2;

/**
 * Offset para generar distractores: suma a la respuesta correcta.
 * Si correctAnswer es 5, +1 genera opción 6 (distractor).
 */
export const DISTRACTOR_OFFSET_2 = 1;

/**
 * Offset para generar distractores: suma mayor a la respuesta correcta.
 * Si correctAnswer es 5, +3 genera opción 8 (distractor).
 */
export const DISTRACTOR_OFFSET_3 = 3;

/** Estado de visita: retos en curso. */
export const VISIT_STATUS_IN_PROGRESS = 'in-progress' as const;

/** Estado de visita: todos los retos completados. */
export const VISIT_STATUS_COMPLETED = 'completed' as const;

/** Tipo de reto de conteo (referencia al motor de retos 007). */
export const CHALLENGE_TYPE_COUNTING_REF = 'counting' as const;

/** Resultado de validación: respuesta correcta. */
export const ANSWER_OUTCOME_SUCCESS = 'success' as const;

/** Resultado de validación: respuesta incorrecta. */
export const ANSWER_OUTCOME_FAILURE = 'failure' as const;

/** Valor neutral para lastOutcome en nueva visita. */
export const LAST_OUTCOME_INITIAL = null;

/**
 * Factory: error cuando challengeConfigs es vacío o inválido.
 */
export function makeEmptyChallengeConfigsError(destinationId: string): Error {
    return new Error(`Cannot create destination visit for "${destinationId}": challengeConfigs is empty or invalid`);
}

/**
 * Factory: error cuando se intenta acceder al reto actual en una visita completed.
 */
export function makeCompletedVisitAccessError(): Error {
    return new Error('Cannot get current challenge: destination visit is already completed');
}

/**
 * Factory: error cuando currentIndex está fuera de rango en getCurrentChallenge.
 */
export function makeInvalidCurrentIndexError(): Error {
    return new Error('getCurrentChallenge: currentIndex is out of range');
}
