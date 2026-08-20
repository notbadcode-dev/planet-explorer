/**
 * Tipos del módulo de dificultad adaptativa.
 * Mapeo puro nivel de dominio (1-10) → configuración de reto.
 */

import type { ChallengeConfig } from '../challenge-engine/challenge-engine.type';

/**
 * Constructor de configuración de dificultad para un tipo de reto específico.
 *
 * Recibe el nivel de dominio actual (1-10) y devuelve una `ChallengeConfig`
 * completa lista para pasar a `generateChallenge()`.
 *
 * Garantías (contract: `difficulty-contract.md`):
 * - Determinismo: mismo nivel → siempre misma salida
 * - Monotonicidad: nivel superior → siempre parámetros más exigentes
 * - Pureza: sin efectos secundarios, sin Phaser/DOM, sin acoplamiento con `progress/`
 */
export type DifficultyConfigBuilder = (skillLevel: number) => ChallengeConfig;
