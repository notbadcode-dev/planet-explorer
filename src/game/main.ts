/**
 * Arranque del motor de juego (Phaser).
 *
 * Único punto en `src/game/` que conoce a la vez `Phaser` y las escenas
 * concretas; registra el listado de escenas y mantiene visible un indicador
 * de carga (`Spinner` de `libs/components/`) hasta que Phaser dispara su
 * evento `ready` (FR-011).
 */

import Phaser from 'phaser';

import { createSpinner } from '../../libs/components/spinner';
import { createInitialNavigationState } from './core/navigation/navigation-state';
import { SCENE_ID_DESTINATION, SCENE_ID_MAP } from './core/navigation/navigation-state.constants';
import type { SceneInitData } from './core/navigation/navigation-state.type';
import {
    GAME_BACKGROUND_COLOR,
    GAME_PARENT_ELEMENT_ID,
    GAME_SCALE_DIMENSION,
    LOADING_SPINNER_LABEL,
    POPSTATE_EVENT,
} from './main.constants';
import { DestinationScene } from './scenes/DestinationScene';
import { MapScene } from './scenes/MapScene';

/** Arranca el juego dentro de `#app`. No hace nada si el contenedor no existe. */
export function startGame(): void {
    const parent = document.getElementById(GAME_PARENT_ELEMENT_ID);
    if (!parent) {
        return;
    }

    const loadingIndicator = createSpinner({ label: LOADING_SPINNER_LABEL });
    parent.append(loadingIndicator);

    const game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: GAME_PARENT_ELEMENT_ID,
        backgroundColor: GAME_BACKGROUND_COLOR,
        scale: {
            mode: Phaser.Scale.RESIZE,
            width: GAME_SCALE_DIMENSION,
            height: GAME_SCALE_DIMENSION,
        },
    });

    game.events.once(Phaser.Core.Events.READY, () => {
        loadingIndicator.remove();

        game.scene.add(SCENE_ID_MAP, MapScene, false);
        game.scene.add(SCENE_ID_DESTINATION, DestinationScene, false);
        game.scene.start(SCENE_ID_MAP, {
            navigationState: createInitialNavigationState(),
        } satisfies SceneInitData);
    });

    // FR-012: si el jugador dispara `popstate` (navegación con el botón "atrás"
    // del navegador), no existe un historial de rutas real que deshacer — nos
    // limitamos a volver a renderizar la escena activa con su mismo estado en
    // vez de dejar una pantalla en blanco.
    window.addEventListener(POPSTATE_EVENT, () => {
        const [activeScene] = game.scene.getScenes(true) as Array<MapScene | DestinationScene>;
        if (!activeScene) {
            return;
        }

        activeScene.scene.restart({ navigationState: activeScene.navigationState } satisfies SceneInitData);
    });
}

