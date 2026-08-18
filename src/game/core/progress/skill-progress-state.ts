/**
 * API pública del modelo de progreso por habilidades.
 *
 * Funciones puras sin dependencias de `phaser` (regla R1 de
 * `docs/conventions/architecture/game-engine-scenes.md`). Testeable con Vitest
 * sin renderizado (principio VII de constitution).
 *
 * Ver `specs/006-skill-progress-model/contracts/skill-progress-contract.md`
 * para el contrato de API (garantías G1-G9).
 */

import {
    FAILURE_COUNT_INCREMENT,
    FAILURE_COUNT_MAX,
    FAILURE_COUNT_RESET,
    SKILL_LEVEL_DECREMENT_PENALTY,
    SKILL_LEVEL_INCREMENT_SUCCESS,
    SKILL_LEVEL_MAX,
    SKILL_LEVEL_MIN,
    SKILL_UPDATE_RESULT_HINT_USED,
    SKILL_UPDATE_RESULT_SUCCESS,
    SUPPORTED_SKILL_NAMES,
    SUPPORTED_SKILL_UPDATE_RESULTS,
    TYPE_STRING,
    makeUnsupportedResultError,
    makeUnsupportedSkillError,
} from './skill-progress-state.constants';
import type { SkillName, SkillProgressState, SkillUpdateResult } from './skill-progress-state.type';

/**
 * G1 — Estado inicial determinista.
 *
 * Devuelve un nuevo `SkillProgressState` con las 7 habilidades soportadas en
 * `{ level: 1, failureCount: 0 }` (FR-006, N7).
 */
export function createInitialSkillProgressState(): SkillProgressState {
    const state: SkillProgressState = {} as SkillProgressState;

    for (const skill of SUPPORTED_SKILL_NAMES) {
        state[skill] = {
            level: SKILL_LEVEL_MIN,
            failureCount: FAILURE_COUNT_RESET,
        };
    }

    return state;
}

/**
 * G2 — Lectura independiente.
 *
 * Devuelve `state[skill].level` sin efectos secundarios. Lanza `Error` si
 * `skill` no pertenece a `SUPPORTED_SKILL_NAMES` (FR-002, FR-008, Q5).
 *
 * @param state — `SkillProgressState` actual
 * @param skill — clave de habilidad a consultar
 * @returns nivel actual de la habilidad
 * @throws Error si `skill` no es soportada
 */
export function getSkillLevel(state: SkillProgressState, skill: SkillName): number {
    if (!isValidSkillName(skill)) {
        throw makeUnsupportedSkillError(skill);
    }

    return state[skill].level;
}

/**
 * G3-G9 — Actualización determinista.
 *
 * Actualiza el nivel de dominio de una habilidad según el resultado,
 * devolviendo un nuevo `SkillProgressState` sin mutar el argumento.
 *
 * - `'success'`: +1 nivel (techo 10), `failureCount` reset a 0 (G5, N1, N2)
 * - `'failure'`: `failureCount++` si < 2; al alcanzar 2, próximo fallo →
 *   -1 nivel (suelo 1) + reset a 0 (G6, N1, N3)
 * - `'hint-used'`: sin cambios (G7, N4)
 *
 * Valida que `skill` y `result` sean válidos, lanzando `Error` en caso
 * contrario (FR-008, FR-009, Q5).
 *
 * @param state — `SkillProgressState` actual
 * @param skill — clave de habilidad a actualizar
 * @param result — resultado de un reto
 * @returns nuevo `SkillProgressState` con la habilidad actualizada
 * @throws Error si `skill` o `result` no son válidos
 */
export function updateSkillProgress(
    state: SkillProgressState,
    skill: SkillName,
    result: SkillUpdateResult,
): SkillProgressState {
    if (!isValidSkillName(skill)) {
        throw makeUnsupportedSkillError(skill);
    }

    if (!isValidUpdateResult(result)) {
        throw makeUnsupportedResultError(result);
    }

    const currentDomain = state[skill];

    if (result === SKILL_UPDATE_RESULT_HINT_USED) {
    // Sin cambios (G7, N4)
        return state;
    }

    if (result === SKILL_UPDATE_RESULT_SUCCESS) {
    // +1 nivel (techo 10), reset failureCount (G5, N1, N2)
        const newLevel = Math.min(currentDomain.level + SKILL_LEVEL_INCREMENT_SUCCESS, SKILL_LEVEL_MAX);
        return {
            ...state,
            [skill]: { level: newLevel, failureCount: FAILURE_COUNT_RESET },
        };
    }

    // result === SKILL_UPDATE_RESULT_FAILURE
    if (currentDomain.failureCount < FAILURE_COUNT_MAX) {
    // Incrementar failureCount, nivel sin cambios (G6, N3)
        return {
            ...state,
            [skill]: { level: currentDomain.level, failureCount: currentDomain.failureCount + FAILURE_COUNT_INCREMENT },
        };
    }

    // failureCount ya es FAILURE_COUNT_MAX (es decir, 2); este fallo es el 3ro
    // → -1 nivel (suelo 1) + reset a 0 (G6, N1, N3)
    const newLevel = Math.max(currentDomain.level - SKILL_LEVEL_DECREMENT_PENALTY, SKILL_LEVEL_MIN);
    return {
        ...state,
        [skill]: { level: newLevel, failureCount: FAILURE_COUNT_RESET },
    };
}

/**
 * Validación interna: ¿`skill` es una clave válida de `SkillName`?
 */
function isValidSkillName(skill: unknown): skill is SkillName {
    return typeof skill === TYPE_STRING && SUPPORTED_SKILL_NAMES.includes(skill as SkillName);
}

/**
 * Validación interna: ¿`result` es un valor válido de `SkillUpdateResult`?
 */
function isValidUpdateResult(result: unknown): result is SkillUpdateResult {
    return typeof result === TYPE_STRING && SUPPORTED_SKILL_UPDATE_RESULTS.includes(result as SkillUpdateResult);
}
