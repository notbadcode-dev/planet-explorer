/**
 * Tipos para el motor genérico de retos.
 *
 * Ver `specs/007-challenge-engine-core/data-model.md` para definiciones y
 * `specs/007-challenge-engine-core/contracts/challenge-interface.md` para el
 * contrato público. Sin dependencias de Phaser (principio VII).
 */

import type { SkillUpdateResult } from '../progress/skill-progress-state.type';

export type { SkillUpdateResult };

/**
 * Pista progresiva para un reto (extensión por spec 010-hints-and-retry-flow).
 * Cada pista es una sugerencia ordenada que el jugador puede solicitar tras
 * fallar un reto, sin penalización.
 */
export interface Hint {
  readonly id: string;
  readonly order: number;
  readonly text: string;
}

/**
 * Reto genérico, independiente de su tipo específico.
 */
export interface Challenge {
  readonly id: string;
  readonly type: string;
  readonly question: string;
  readonly correctAnswer: unknown;
  readonly difficulty: number;
  readonly hints?: readonly Hint[];
}

/**
 * Configuración base para generar un reto. La propiedad `type` actúa como
 * discriminador para tipos específicos (ej. `CountingChallengeConfig`).
 */
export interface ChallengeConfig {
  type: string;
  difficulty?: number;
}

/**
 * Objeto individual a contar dentro de un `CountingChallenge`. `type` es un
 * descriptor agnóstico de renderizado (ej. "star") que la capa de
 * presentación interpreta para elegir cómo visualizarlo.
 */
export interface CountingChallengeItem {
  readonly id: string;
  readonly type: string;
}

/**
 * Reto de tipo `counting`: el jugador cuenta cuántos elementos hay en
 * `items`. `correctAnswer` siempre coincide con `items.length`.
 */
export interface CountingChallenge extends Challenge {
  readonly type: 'counting';
  readonly correctAnswer: number;
  readonly items: readonly CountingChallengeItem[];
}

/**
 * Configuración para generar un `CountingChallenge` mediante
 * `generateChallenge()`.
 */
export interface CountingChallengeConfig extends ChallengeConfig {
  type: 'counting';
  min: number;
  max: number;
  difficulty?: number;
}
