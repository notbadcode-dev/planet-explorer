/**
 * Tipos para el modelo de progreso por habilidades.
 *
 * Ver `specs/006-skill-progress-model/data-model.md` para definiciones,
 * `docs/conventions/architecture/game-engine-scenes.md` (regla R1: sin import de Phaser),
 * y `docs/conventions/architecture/progress-persistence-model.md` (requisitos de persistencia).
 */

/**
 * Catálogo cerrado de habilidades soportadas en esta feature (subconjunto de
 * constitution.md principio IV: lista completa más amplia, pero esta feature
 * implementa solo estas 7).
 */
export type SkillName =
  | 'counting'
  | 'addition'
  | 'memory'
  | 'logic'
  | 'reading'
  | 'spatialReasoning'
  | 'astronomy';

/**
 * Resultado de un reto que afecta al dominio de una habilidad.
 *
 * - `'success'`: acierto → +1 nivel (capped at 10), failureCount reset a 0
 * - `'failure'`: fallo → failureCount++; al alcanzar 3, -1 nivel (capped at 1) + reset
 * - `'hint-used'`: pista → sin cambios en level ni failureCount
 */
export type SkillUpdateResult = 'success' | 'failure' | 'hint-used';

/**
 * Estado de dominio de una única habilidad.
 *
 * - `level`: entero en rango [1, 10] (clarificación Q1)
 * - `failureCount`: entero en rango [0, 2] (clarificación Q2); se reinicia a 0
 *   automáticamente cuando `level` cambia (clarificación Q4)
 */
export interface SkillDomain {
  /** Nivel de dominio actual, rango 1-10. Inicial: 1. */
  level: number;

  /** Contador de fallos acumulados al nivel actual, rango 0-2. Inicial: 0. Resets automáticamente en cambio de nivel. */
  failureCount: number;
}

/**
 * Estado completo del progreso por habilidades de un jugador.
 *
 * Objeto plano (`Record<SkillName, SkillDomain>`), serializable a JSON sin
 * transformación, para que `011-save-progress-local` lo persista directamente.
 *
 * Ejemplo:
 * ```ts
 * {
 *   counting: { level: 5, failureCount: 1 },
 *   addition: { level: 3, failureCount: 0 },
 *   memory: { level: 6, failureCount: 2 },
 *   logic: { level: 1, failureCount: 0 },
 *   reading: { level: 4, failureCount: 0 },
 *   spatialReasoning: { level: 1, failureCount: 0 },
 *   astronomy: { level: 2, failureCount: 1 },
 * }
 * ```
 */
export type SkillProgressState = Record<SkillName, SkillDomain>;
