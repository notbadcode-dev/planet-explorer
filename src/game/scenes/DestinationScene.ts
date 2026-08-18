/**
 * Escena de destino (placeholder).
 *
 * Presentación pura: al llegar, cierra la transición iniciada por `MapScene`
 * (`completeTransition`, T013) y muestra el overlay HTML del HUD (T016). Al
 * volver, inicia y cierra la transición de regreso (`beginTransitionToMap` +
 * `completeTransition`, T017) antes de arrancar `MapScene`.
 */

import Phaser from 'phaser';

import { beginTransitionToMap, completeTransition } from '../core/navigation/navigation-state';
import { SCENE_ID_DESTINATION, SCENE_ID_MAP } from '../core/navigation/navigation-state.constants';
import type { NavigationState, SceneInitData } from '../core/navigation/navigation-state.type';
import { createHud } from '../overlay/hud';

export class DestinationScene extends Phaser.Scene {
    /** Público para que el listener de `popstate` de `main.ts` (T025) pueda leerlo. */
    navigationState!: NavigationState;

    private hudElement: HTMLElement | null = null;

    constructor() {
        super(SCENE_ID_DESTINATION);
    }

    init(data: SceneInitData): void {
        this.navigationState = data.navigationState;
    }

    create(): void {
        this.navigationState = completeTransition(this.navigationState);

        this.hudElement = createHud({
            onReturnToMap: () => this.handleReturnToMap(),
        });
        this.game.canvas.parentElement?.append(this.hudElement);

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
    }

    private handleReturnToMap(): void {
        const transitioningState = beginTransitionToMap(this.navigationState);
        if (transitioningState === this.navigationState) {
            // FR-007: activación redundante mientras una transición ya está en curso.
            return;
        }

        const completedState = completeTransition(transitioningState);
        this.scene.start(SCENE_ID_MAP, { navigationState: completedState } satisfies SceneInitData);
    }

    private handleShutdown(): void {
        this.hudElement?.remove();
        this.hudElement = null;
    }
}
