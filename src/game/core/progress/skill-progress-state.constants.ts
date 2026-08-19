/**
 * Constantes para el modelo de progreso por habilidades.
 *
 * NINGÚN LITERAL MÁGICO debe dispersarse en la lógica; todos deben estar aquí.
 * Ver `docs/conventions/architecture/game-engine-scenes.md` (regla R1: sin Phaser).
 */

import type { SkillName, SkillUpdateResult } from './skill-progress-state.type';

/**
 * Catálogo de 7 habilidades soportadas en esta feature (subconjunto del
 * catálogo completo de constitution.md).
 *
 * Nota: La lista completa de habilidades en la constitución incluye
 * `subtraction`, `multiplication`, `division`, `sequences`, `comparison`,
 * `problemSolving`, pero esta feature implementa solo estas 7.
 * Features posteriores (007, 009, etc.) pueden extender esta lista.
 */
export const SUPPORTED_SKILL_NAMES: readonly SkillName[] = [
    'counting',
    'addition',
    'memory',
    'logic',
    'reading',
    'spatialReasoning',
    'astronomy',
] as const;

/** Rango mínimo de nivel de habilidad (clarificación Q1). */
export const SKILL_LEVEL_MIN = 1;

/** Rango máximo de nivel de habilidad (clarificación Q1). */
export const SKILL_LEVEL_MAX = 10;

/**
 * Umbral de fallos acumulados antes de bajar de nivel.
 *
 * - Fallos 0-2 en `failureCount` no afectan el nivel.
 * - El tercer fallo (cuando `failureCount` ya era 2) dispara una bajada de -1 nivel
 *   (con suelo en 1) y reinicia el contador a 0 (clarificación Q2).
 */
export const SKILL_FAILURE_THRESHOLD = 3;

/**
 * Máximo de fallos acumulados antes de que el siguiente fallo penalice con -1 nivel.
 * (es decir, failureCount puede llegar a FAILURE_COUNT_MAX, y el siguiente fallo
 * dispara la penalización).
 */
export const FAILURE_COUNT_MAX = SKILL_FAILURE_THRESHOLD - 1;

/** Incremento de failureCount en cada fallo (siempre +1). */
export const FAILURE_COUNT_INCREMENT = 1;

/** Reset de failureCount a este valor (siempre 0). */
export const FAILURE_COUNT_RESET = 0;

/** Incremento de nivel en cada acierto (siempre +1). */
export const SKILL_LEVEL_INCREMENT_SUCCESS = 1;

/** Decremento de nivel en penalización por 3 fallos (siempre -1). */
export const SKILL_LEVEL_DECREMENT_PENALTY = 1;

/** Tipo TypeScript primitivo para validación en runtime. */
export const TYPE_STRING = 'string' as const;

/** Resultados de reto válidos. Cualquier otro valor dispara una excepción. */
export const SUPPORTED_SKILL_UPDATE_RESULTS: readonly SkillUpdateResult[] = [
    'success',
    'failure',
    'hint-used',
] as const;

/** Resultado de reto: acierto (level +1, failureCount reset a 0). */
export const SKILL_UPDATE_RESULT_SUCCESS = 'success' as const;

/** Resultado de reto: fallo (failureCount++, nivel sin cambios hasta 3 fallos). */
export const SKILL_UPDATE_RESULT_FAILURE = 'failure' as const;

/** Resultado de reto: pista usada (sin cambios en level ni failureCount). */
export const SKILL_UPDATE_RESULT_HINT_USED = 'hint-used' as const;

/**
 * Mensaje de error para habilidad no soportada.
 * Utilizado en getSkillLevel y updateSkillProgress (clarificación Q5, FR-008).
 */
export function makeUnsupportedSkillError(skill: unknown): Error {
    return new Error(`Habilidad no soportada: '${skill}'. Habilidades soportadas: ${SUPPORTED_SKILL_NAMES.join(', ')}`);
}

/**
 * Mensaje de error para resultado de reto no válido.
 * Utilizado en updateSkillProgress (clarificación Q5, FR-009).
 */
export function makeUnsupportedResultError(result: unknown): Error {
    return new Error(`Resultado de reto no válido: '${result}'. Resultados soportados: ${SUPPORTED_SKILL_UPDATE_RESULTS.join(', ')}`);
}
