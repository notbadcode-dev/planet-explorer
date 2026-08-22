/**
 * Tipos del módulo de dificultad adaptativa.
 * Mapeo puro nivel de dominio (1-10) → configuración de reto.
 */

import type { CountingChallengeConfig } from '../challenge-engine/challenge-engine.type';

/**
 * `CountingChallengeConfig` con `difficulty` garantizado (no opcional).
 *
 * En `CountingChallengeConfig` general `difficulty` es opcional (otros
 * llamadores de `generateChallenge()`, ej. `destinations.constants.ts`, pueden
 * omitirlo y dejar que se aplique `DEFAULT_DIFFICULTY`). Los builders de este
 * módulo, en cambio, garantizan `difficulty = skillLevel` (G3) — este tipo más
 * estricto refleja esa garantía para quien consuma `getDifficultyConfig()`.
 */
export type CountingDifficultyConfig = CountingChallengeConfig & { readonly difficulty: number };

/**
 * Config de dificultad devuelta por `getDifficultyConfig()`. Por ahora solo
 * existe el tipo de reto "counting"; al añadir un nuevo tipo a
 * `DIFFICULTY_BUILDERS` (`difficulty.ts`), extender esta unión con su propio
 * `XDifficultyConfig` análogo (mismo patrón que `AnyChallengeConfig`/registro
 * en `challenge-engine.type.ts`).
 */
export type DifficultyConfig = CountingDifficultyConfig;

/**
 * Constructor de configuración de dificultad para un tipo de reto específico.
 *
 * Recibe el nivel de dominio actual (1-10) y devuelve una `DifficultyConfig`
 * completa lista para pasar a `generateChallenge()`.
 *
 * Garantías (contract: `difficulty-contract.md`):
 * - Determinismo: mismo nivel → siempre misma salida
 * - Monotonicidad: nivel superior → siempre parámetros más exigentes
 * - Pureza: sin efectos secundarios, sin Phaser/DOM, sin acoplamiento con `progress/`
 */
export type DifficultyConfigBuilder = (skillLevel: number) => DifficultyConfig;
