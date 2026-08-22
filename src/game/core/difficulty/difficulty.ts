/**
 * Módulo puro de dificultad adaptativa.
 *
 * Mapeo determinista del nivel de dominio de una habilidad (1-10) a una
 * configuración de reto completa, lista para `generateChallenge()` (007).
 *
 * Puro: sin Phaser, sin DOM, sin acoplamiento con `progress/`.
 * Ver `specs/009-adaptive-difficulty-v1/` para diseño e implementación.
 */

import { CHALLENGE_TYPE_COUNTING } from '../challenge-engine/challenge-engine.constants';
import type { DifficultyConfig, DifficultyConfigBuilder } from './difficulty.type';
import {
    DIFFICULTY_LEVEL_MIN,
    DIFFICULTY_LEVEL_MAX,
    DIFFICULTY_COUNTING_MIN_VALUE,
    DIFFICULTY_COUNTING_MAX_BASE,
    DIFFICULTY_COUNTING_MAX_STEP,
    DIFFICULTY_LEVEL_OFFSET,
    makeInvalidSkillLevelError,
    makeUnsupportedChallengeTypeForDifficultyError,
} from './difficulty.constants';

/**
 * Constructor de configuración para el tipo de reto "counting".
 *
 * Fórmula: min = DIFFICULTY_COUNTING_MIN_VALUE (fijo en 1)
 *          max = DIFFICULTY_COUNTING_MAX_BASE + (skillLevel - 1) * DIFFICULTY_COUNTING_MAX_STEP
 *
 * El campo `difficulty` siempre se fija igual al `skillLevel` recibido (FR-002a).
 */
const buildCountingDifficultyConfig: DifficultyConfigBuilder = (skillLevel: number): DifficultyConfig => {
    const max = DIFFICULTY_COUNTING_MAX_BASE + (skillLevel - DIFFICULTY_LEVEL_OFFSET) * DIFFICULTY_COUNTING_MAX_STEP;
    return {
        type: CHALLENGE_TYPE_COUNTING,
        min: DIFFICULTY_COUNTING_MIN_VALUE,
        max,
        difficulty: skillLevel,
    };
};

/**
 * Registro de constructores de dificultad por tipo de reto.
 *
 * Cada entrada mapea un `challengeType` (ej. "counting") a una función que
 * genera la configuración de dificultad para ese tipo dado un `skillLevel`.
 *
 * Cuando se añada un nuevo tipo de reto (ej. en 010, 015, etc.), DEBE:
 * 1. Registrarse aquí con su propio constructor
 * 2. O bien `getDifficultyConfig` lanzará `makeUnsupportedChallengeTypeForDifficultyError` (FR-009a)
 *
 * Ver `specs/009-adaptive-difficulty-v1/research.md § Decisión 2` (patrón de registro
 * para corregir R2 de la retrospectiva R001).
 */
const DIFFICULTY_BUILDERS: Record<string, DifficultyConfigBuilder> = {
    [CHALLENGE_TYPE_COUNTING]: buildCountingDifficultyConfig,
};

/**
 * Mapea un nivel de dominio de habilidad a una configuración de reto específica
 * del tipo solicitado.
 *
 * Función pura, determinista, sin efectos secundarios.
 *
 * @param challengeType El tipo de reto (ej. "counting") para el cual se solicita dificultad
 * @param skillLevel El nivel de dominio actual del jugador (1-10)
 * @returns ChallengeConfig completa, lista para pasar a `generateChallenge()` (007)
 * @throws {Error} Si `skillLevel` está fuera del rango [DIFFICULTY_LEVEL_MIN, DIFFICULTY_LEVEL_MAX] (FR-009)
 * @throws {Error} Si `challengeType` no tiene un constructor registrado (FR-009a)
 *
 * Garantías (contract: `difficulty-contract.md`):
 * - G1: Determinismo — mismos argumentos, siempre mismo resultado
 * - G2: Monotonicidad — nivel superior produce parámetros de dificultad más exigentes
 * - G3: Campo `difficulty` siempre = `skillLevel` (FR-002a)
 * - G4: Resultado es directamente usable por `generateChallenge()` (007)
 * - G5: Pureza — sin Phaser, sin DOM, sin acoplamiento con `progress/`
 *
 * Ejemplos:
 * ```ts
 * const config1 = getDifficultyConfig('counting', 1);  // min:1, max:3, difficulty:1
 * const config5 = getDifficultyConfig('counting', 5);  // min:1, max:7, difficulty:5
 * const config10 = getDifficultyConfig('counting', 10); // min:1, max:12, difficulty:10
 *
 * // Errores
 * getDifficultyConfig('counting', 0);    // throws makeInvalidSkillLevelError
 * getDifficultyConfig('counting', 11);   // throws makeInvalidSkillLevelError
 * getDifficultyConfig('memory', 5);      // throws makeUnsupportedChallengeTypeForDifficultyError
 * ```
 */
export function getDifficultyConfig(challengeType: string, skillLevel: number): DifficultyConfig {
    // Validar rango de nivel de dominio (FR-009)
    if (skillLevel < DIFFICULTY_LEVEL_MIN || skillLevel > DIFFICULTY_LEVEL_MAX) {
        throw makeInvalidSkillLevelError(skillLevel);
    }

    // Buscar el constructor para este tipo de reto (FR-009a)
    const builder = DIFFICULTY_BUILDERS[challengeType];
    if (!builder) {
        throw makeUnsupportedChallengeTypeForDifficultyError(challengeType);
    }

    // Construir la configuración de dificultad
    return builder(skillLevel);
}
