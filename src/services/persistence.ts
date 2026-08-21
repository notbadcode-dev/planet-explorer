/**
 * Wiring de persistencia local para el juego (spec 011).
 *
 * Único punto en `src/` que conoce `@planet-explorer/persistence`; expone
 * funciones para cargar el progreso guardado al arrancar y para obtener el
 * coordinador de autoguardado (`EventSaveCoordinator`) que las escenas usan
 * en sus puntos de finalización de reto/destino (FR-001, FR-003 a FR-006).
 */

import {
    EventSaveCoordinator,
    LocalStorageAdapter,
    PersistenceService,
    type PlayerProgress,
} from '../../libs/persistence/src';

import { createInitialSkillProgressState } from '../game/core/progress/skill-progress-state';
import { SUPPORTED_SKILL_NAMES } from '../game/core/progress/skill-progress-state.constants';
import type { SkillProgressState } from '../game/core/progress/skill-progress-state.type';

const adapter = new LocalStorageAdapter();
const persistenceService = new PersistenceService(adapter);

let loadedProgress: PlayerProgress | undefined;
let saveCoordinator: EventSaveCoordinator | undefined;

/**
 * Carga el `PlayerProgress` persistido y lo traduce al `SkillProgressState`
 * que consume el juego, usando el estado inicial por defecto para las
 * habilidades sin datos guardados. Debe llamarse una única vez al arrancar.
 */
export function loadSkillProgressState(): SkillProgressState {
    loadedProgress = persistenceService.load();
    const state = createInitialSkillProgressState();

    for (const skillName of SUPPORTED_SKILL_NAMES) {
        const persistedSkill = loadedProgress.skills[skillName];
        if (persistedSkill) {
            state[skillName] = {
                level: persistedSkill.skillLevel,
                failureCount: persistedSkill.failureCount,
            };
        }
    }

    return state;
}

/**
 * Devuelve el coordinador de autoguardado, creándolo la primera vez a partir
 * del progreso cargado por `loadSkillProgressState()` (o cargándolo de nuevo
 * si aún no se había hecho).
 */
export function getSaveCoordinator(): EventSaveCoordinator {
    if (!saveCoordinator) {
        saveCoordinator = new EventSaveCoordinator(persistenceService, loadedProgress ?? persistenceService.load());
    }

    return saveCoordinator;
}
