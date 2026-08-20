/**
 * Tipos del estado de navegación mapa↔destino.
 *
 * Ver `specs/004-core-game-loop/data-model.md` y
 * `specs/004-core-game-loop/contracts/navigation-core-contract.md`.
 */

import type { SkillProgressState } from '../progress/skill-progress-state.type';

export type SceneId = 'map' | 'destination';

export interface NavigationState {
    /** Escena actualmente activa. */
    activeScene: SceneId;

    /** Escena destino de una transición en curso; `null` si no hay transición activa. */
    pendingScene: SceneId | null;

    /** Id del destino seleccionado; `null` mientras el jugador está en el mapa sin selección. */
    selectedDestinationId: string | null;

    /** `true` mientras una transición de escena está en curso (guarda de FR-007). */
    isTransitioning: boolean;
}

/** Datos que cada escena recibe en su `init()` para arrancar con el `NavigationState` vigente y el estado de habilidades. */
export interface SceneInitData {
    navigationState: NavigationState;
    skillProgressState: SkillProgressState;
}
