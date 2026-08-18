import type { NavigationState, SceneId } from './navigation-state.type';

export const SCENE_ID_MAP: SceneId = 'map';
export const SCENE_ID_DESTINATION: SceneId = 'destination';

export const INITIAL_NAVIGATION_STATE: NavigationState = {
    activeScene: SCENE_ID_MAP,
    pendingScene: null,
    selectedDestinationId: null,
    isTransitioning: false,
};
