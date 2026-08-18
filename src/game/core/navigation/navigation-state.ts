/**
 * API pública del estado de navegación mapa↔destino.
 *
 * Funciones puras, sin dependencia de `phaser` (regla R1 de
 * `docs/conventions/architecture/game-engine-scenes.md`). Ver
 * `specs/004-core-game-loop/contracts/navigation-core-contract.md` (G1-G7).
 */

import { INITIAL_NAVIGATION_STATE, SCENE_ID_DESTINATION, SCENE_ID_MAP } from './navigation-state.constants';
import type { NavigationState } from './navigation-state.type';

/** G1: estado inicial determinista. */
export function createInitialNavigationState(): NavigationState {
    return { ...INITIAL_NAVIGATION_STATE };
}

/** G2 / G4: inicia la transición hacia el destino, o ignora la activación redundante. */
export function beginTransitionToDestination(
    state: NavigationState,
    destinationId: string,
): NavigationState {
    if (state.isTransitioning) {
        return state;
    }

    return {
        ...state,
        pendingScene: SCENE_ID_DESTINATION,
        selectedDestinationId: destinationId,
        isTransitioning: true,
    };
}

/** G3 / G4: inicia la transición de vuelta al mapa, o ignora la activación redundante. */
export function beginTransitionToMap(state: NavigationState): NavigationState {
    if (state.isTransitioning) {
        return state;
    }

    return {
        ...state,
        pendingScene: SCENE_ID_MAP,
        isTransitioning: true,
    };
}

/** G5 / G6: cierra la transición en curso, o no modifica el estado si no hay ninguna pendiente. */
export function completeTransition(state: NavigationState): NavigationState {
    if (!state.isTransitioning || state.pendingScene === null) {
        return state;
    }

    const nextActiveScene = state.pendingScene;
    const nextSelectedDestinationId =
        nextActiveScene === SCENE_ID_MAP ? null : state.selectedDestinationId;

    return {
        activeScene: nextActiveScene,
        pendingScene: null,
        selectedDestinationId: nextSelectedDestinationId,
        isTransitioning: false,
    };
}
