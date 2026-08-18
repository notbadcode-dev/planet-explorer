/**
 * Escena del mapa del sistema solar.
 *
 * Presentación pura: renderiza el destino placeholder con Game Objects nativos
 * (círculo + texto) y delega toda la lógica de navegación en `core/navigation`
 * (principio VII; regla R1/R2 de `game-engine-scenes.md`). Esta escena solo
 * inicia la transición (`beginTransitionToDestination`); es `DestinationScene`
 * quien la completa al llegar (T013/T017), por lo que aquí no se llama a
 * `completeTransition`.
 */

import Phaser from 'phaser';

import { DESTINATIONS } from '../core/content/destinations';
import { MAP_WELCOME_MESSAGE } from '../core/content/bot6-messages.constants';
import { beginTransitionToDestination } from '../core/navigation/navigation-state';
import { SCENE_ID_DESTINATION, SCENE_ID_MAP } from '../core/navigation/navigation-state.constants';
import type { NavigationState, SceneInitData } from '../core/navigation/navigation-state.type';
import { createBot6Dialogue } from '../overlay/bot6-dialogue';
import {
    CENTER_DIVISOR,
    DESTINATION_LABEL_COLOR,
    DESTINATION_LABEL_FONT_SIZE,
    DESTINATION_LABEL_OFFSET_Y,
    DESTINATION_MARKER_COLOR,
    DESTINATION_MARKER_RADIUS,
    FIRST_DESTINATION_INDEX,
    LABEL_ORIGIN_CENTER,
} from './MapScene.constants';

export class MapScene extends Phaser.Scene {
    /** Público para que el listener de `popstate` de `main.ts` (T025) pueda leerlo. */
    navigationState!: NavigationState;

    private marker?: Phaser.GameObjects.Arc;
    private label?: Phaser.GameObjects.Text;
    private bot6DialogueElement?: HTMLElement;

    constructor() {
        super(SCENE_ID_MAP);
    }

    init(data: SceneInitData): void {
        this.navigationState = data.navigationState;
    }

    create(): void {
        const destination = DESTINATIONS[FIRST_DESTINATION_INDEX];
        if (!destination) {
            return;
        }

        const { width, height } = this.scale;

        this.marker = this.add.circle(
            width / CENTER_DIVISOR,
            height / CENTER_DIVISOR,
            DESTINATION_MARKER_RADIUS,
            DESTINATION_MARKER_COLOR,
        );
        this.marker.setInteractive({ useHandCursor: true });

        this.label = this.add.text(
            width / CENTER_DIVISOR,
            height / CENTER_DIVISOR + DESTINATION_LABEL_OFFSET_Y,
            destination.name,
            {
                fontSize: DESTINATION_LABEL_FONT_SIZE,
                color: DESTINATION_LABEL_COLOR,
            },
        );
        this.label.setOrigin(LABEL_ORIGIN_CENTER, LABEL_ORIGIN_CENTER);

        this.marker.on(Phaser.Input.Events.POINTER_DOWN, () => {
            const nextState = beginTransitionToDestination(this.navigationState, destination.id);
            if (nextState === this.navigationState) {
                // FR-007: activación redundante mientras una transición ya está en curso.
                return;
            }

            this.navigationState = nextState;
            this.scene.start(SCENE_ID_DESTINATION, { navigationState: nextState } satisfies SceneInitData);
        });

        // T008 [FR-001]: Mount BOT-6 dialogue overlay on map entry (repeated each visit)
        this.bot6DialogueElement = createBot6Dialogue({
            message: MAP_WELCOME_MESSAGE,
            onClose: () => this.handleBot6DialogueClose(),
        });
        this.game.canvas.parentElement?.append(this.bot6DialogueElement);

        this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
    }

    private handleResize(gameSize: Phaser.Structs.Size): void {
        const centerX = gameSize.width / CENTER_DIVISOR;
        const centerY = gameSize.height / CENTER_DIVISOR;

        this.marker?.setPosition(centerX, centerY);
        this.label?.setPosition(centerX, centerY + DESTINATION_LABEL_OFFSET_Y);
    }

    // T009 [FR-004]: Close BOT-6 dialogue and restore normal map interaction
    private handleBot6DialogueClose(): void {
        this.bot6DialogueElement?.remove();
        this.bot6DialogueElement = undefined;
    }

    private handleShutdown(): void {
        this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
        // T010: Clean up BOT-6 dialogue if still mounted when scene shuts down
        this.bot6DialogueElement?.remove();
        this.bot6DialogueElement = undefined;
    }
}

