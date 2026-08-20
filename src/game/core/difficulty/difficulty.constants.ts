/**
 * Constantes del módulo de dificultad adaptativa.
 * Parámetros de la fórmula de mapeo nivel → rango, y factorías de error.
 */

/**
 * Rango válido de niveles de dominio soportados por `getDifficultyConfig()`.
 *
 * El modelo de progresión (006-skill-progress-model) mantiene niveles 1-10
 * tras aplicar la lógica de subida/bajada según aciertos/fallos acumulados.
 */
export const DIFFICULTY_LEVEL_MIN = 1;
export const DIFFICULTY_LEVEL_MAX = 10;

/**
 * Parámetros de la fórmula de dificultad para el tipo "counting".
 *
 * Fórmula: min = DIFFICULTY_COUNTING_MIN_VALUE (constante)
 *          max = DIFFICULTY_COUNTING_MAX_BASE + (skillLevel - 1) * DIFFICULTY_COUNTING_MAX_STEP
 *
 * Ejemplos:
 * - Nivel 1: min=1, max=3
 * - Nivel 5: min=1, max=7
 * - Nivel 10: min=1, max=12
 *
 * Ver `research.md § Decisión 1` para justificación de por qué estos valores.
 */
export const DIFFICULTY_COUNTING_MIN_VALUE = 1;
export const DIFFICULTY_COUNTING_MAX_BASE = 3;
export const DIFFICULTY_COUNTING_MAX_STEP = 1;

/**
 * Crea un error para un `skillLevel` fuera del rango válido [DIFFICULTY_LEVEL_MIN, DIFFICULTY_LEVEL_MAX].
 *
 * Usado por `getDifficultyConfig()` cuando se llama con nivel inválido (FR-009).
 *
 * @param skillLevel El nivel proporcionado que está fuera de rango
 * @returns Error con descripción clara
 */
export function makeInvalidSkillLevelError(skillLevel: number): Error {
    return new Error(
        `Invalid skill level: ${skillLevel}. Must be between ${DIFFICULTY_LEVEL_MIN} and ${DIFFICULTY_LEVEL_MAX}.`
    );
}

/**
 * Crea un error para un tipo de reto sin mapeo de dificultad definido.
 *
 * Usado por `getDifficultyConfig()` cuando se solicita un tipo de reto que no
 * tiene una entrada en el registro interno de constructores de dificultad (FR-009a).
 *
 * @param challengeType El tipo de reto no registrado
 * @returns Error con descripción clara
 */
export function makeUnsupportedChallengeTypeForDifficultyError(challengeType: string): Error {
    return new Error(
        `Unsupported challenge type for difficulty mapping: "${challengeType}". ` +
        `Check that the challenge type has a registered difficulty builder in 'core/difficulty/'.`
    );
}
