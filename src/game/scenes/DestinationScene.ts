/**
 * Escena de destino (placeholder).
 *
 * Presentación pura: al llegar, cierra la transición iniciada por `MapScene`
 * (`completeTransition`, T013) y muestra el overlay HTML del HUD (T016). Al
 * volver, inicia y cierra la transición de regreso (`beginTransitionToMap` +
 * `completeTransition`, T017) antes de arrancar `MapScene`.
 *
 * Si el destino tiene retos (challengeConfigs), también monta el challenge-dialogue
 * y maneja la secuencia de respuestas (T014-T019).
 */

import Phaser from 'phaser';

import {
    DESTINATION_TRANSITION_MESSAGE,
    MOON_CHALLENGE_INTRO_MESSAGE,
    MOON_CHALLENGE_NEXT_MESSAGE,
    MOON_CHALLENGE_RETRY_MESSAGE,
    MOON_CHALLENGE_SUCCESS_MESSAGE,
    MOON_DESTINATION_COMPLETE_MESSAGE
} from '../core/content/bot6-messages.constants';
import { DESTINATIONS } from '../core/content/destinations';
import { MOON_DESTINATION_BACKGROUND_COLOR } from '../core/content/destinations.constants';
import {
    createDestinationVisit,
    getAnswerOptions,
    getCurrentChallenge,
    requestNextHint,
    submitAnswer,
} from '../core/destination-visit/destination-visit-state';
import { VISIT_STATUS_COMPLETED } from '../core/destination-visit/destination-visit-state.constants';
import type { DestinationVisitState } from '../core/destination-visit/destination-visit-state.type';
import { beginTransitionToMap, completeTransition } from '../core/navigation/navigation-state';
import { SCENE_ID_DESTINATION, SCENE_ID_MAP } from '../core/navigation/navigation-state.constants';
import type { NavigationState, SceneInitData } from '../core/navigation/navigation-state.type';
import { getSkillLevel } from '../core/progress/skill-progress-state';
import type { SkillProgressState } from '../core/progress/skill-progress-state.type';
import { createBot6Dialogue } from '../overlay/bot6-dialogue';
import { createChallengeDialogue } from '../overlay/challenge-dialogue';
import { createHud, type HudInstance } from '../overlay/hud';
import { MIN_COLLECTION_LENGTH, PROGRESS_DISPLAY_OFFSET, SKILL_ID_COUNTING, VALIDATE_OUTCOME_SUCCESS } from './DestinationScene.constants';

export class DestinationScene extends Phaser.Scene {
    /** Público para que el listener de `popstate` de `main.ts` (T025) pueda leerlo. */
    navigationState!: NavigationState;

    /** Público para que el listener de `popstate` de `main.ts` (T025) pueda leerlo. */
    skillProgressState!: SkillProgressState;

    private hudElement: HudInstance | null = null;
    private bot6DialogueElement?: HTMLElement;
    private challengeDialogueElement?: HTMLElement;
    private destinationVisitState?: DestinationVisitState;

    constructor() {
        super(SCENE_ID_DESTINATION);
    }

    init(data: SceneInitData): void {
        this.navigationState = data.navigationState;
        this.skillProgressState = data.skillProgressState;
    }

    create(): void {
        this.navigationState = completeTransition(this.navigationState);

        const hudInstance = createHud({
            onReturnToMap: () => this.handleReturnToMap(),
        });
        this.hudElement = hudInstance;
        this.game.canvas.parentElement?.append(hudInstance.element);

        // Obtener el destino actual desde navigationState para saber si tiene retos
        const currentDestinationId = this.navigationState.selectedDestinationId;
        const destination = DESTINATIONS.find((d) => d.id === currentDestinationId);

        // Si el destino tiene retos, crear la secuencia y mostrar el primer reto
        if (destination && destination.challengeConfigs && destination.challengeConfigs.length > MIN_COLLECTION_LENGTH) {
            const countingSkillLevel = getSkillLevel(this.skillProgressState, SKILL_ID_COUNTING);
            this.destinationVisitState = createDestinationVisit(
                destination.id,
                destination.challengeConfigs,
                countingSkillLevel,
            );

            // Establecer el color de fondo del destino
            this.cameras.main.setBackgroundColor(MOON_DESTINATION_BACKGROUND_COLOR);

            // Actualizar progreso inicial (0/N)
            this.hudElement.updateProgress(PROGRESS_DISPLAY_OFFSET, this.destinationVisitState.challenges.length);

            // T035: Mostrar el primer reto con narrativa envolvente
            this.handleShowChallenge(MOON_CHALLENGE_INTRO_MESSAGE.text);
        } else {
            // Sin retos: solo mostrar el mensaje de transición estándar
            this.bot6DialogueElement = createBot6Dialogue({
                message: DESTINATION_TRANSITION_MESSAGE,
                onClose: () => this.handleBot6DialogueClose(),
            });
            this.game.canvas.parentElement?.append(this.bot6DialogueElement);
        }

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
    }

    private handleReturnToMap(): void {
        const transitioningState = beginTransitionToMap(this.navigationState);
        if (transitioningState === this.navigationState) {
            // FR-007: activación redundante mientras una transición ya está en curso.
            return;
        }

        const completedState = completeTransition(transitioningState);
        this.scene.start(SCENE_ID_MAP, {
            navigationState: completedState,
            skillProgressState: this.skillProgressState,
        } satisfies SceneInitData);
    }

    // T012 [FR-004]: Close BOT-6 dialogue and restore normal destination HUD interaction
    private handleBot6DialogueClose(): void {
        this.bot6DialogueElement?.remove();
        this.bot6DialogueElement = undefined;
    }

    // T035: Show challenge with narrative description
    private handleShowChallenge(description: string): void {
        if (!this.destinationVisitState) {
            return;
        }

        const challenge = getCurrentChallenge(this.destinationVisitState);
        const options = getAnswerOptions(this.destinationVisitState);

        this.challengeDialogueElement = createChallengeDialogue({
            description,
            challenge,
            answerOptions: options,
            onSelect: (answer: number) => this.handleAnswerSelected(answer),
        });
        this.game.canvas.parentElement?.append(this.challengeDialogueElement);
    }

    // T015 [FR-013]: Process answer selection (success path for now, failure handled in T017)
    private handleAnswerSelected(answer: number): void {
        if (!this.destinationVisitState) {
            return;
        }

        const { visit: updatedVisit, skillState: updatedSkillState, outcome } = submitAnswer(
            this.destinationVisitState,
            this.skillProgressState,
            answer,
        );

        this.destinationVisitState = updatedVisit;
        this.skillProgressState = updatedSkillState;

        if (outcome === VALIDATE_OUTCOME_SUCCESS) {
            // T015: Success branch
            this.challengeDialogueElement?.remove();
            this.challengeDialogueElement = undefined;

            // T016: Update progress display
            const progressCurrent = updatedVisit.currentIndex + PROGRESS_DISPLAY_OFFSET;
            this.hudElement?.updateProgress(progressCurrent, updatedVisit.challenges.length);

            // T034: Show success message before advancing
            if (updatedVisit.status === VISIT_STATUS_COMPLETED) {
                // T018: All challenges completed - show success then completion message
                this.bot6DialogueElement = createBot6Dialogue({
                    message: MOON_CHALLENGE_SUCCESS_MESSAGE,
                    onClose: () => {
                        this.bot6DialogueElement?.remove();
                        this.bot6DialogueElement = undefined;
                        this.bot6DialogueElement = createBot6Dialogue({
                            message: MOON_DESTINATION_COMPLETE_MESSAGE,
                            onClose: () => this.handleReturnToMap(),
                        });
                        this.game.canvas.parentElement?.append(this.bot6DialogueElement);
                    },
                });
                this.game.canvas.parentElement?.append(this.bot6DialogueElement);
            } else {
                // Show success message then next challenge
                this.bot6DialogueElement = createBot6Dialogue({
                    message: MOON_CHALLENGE_SUCCESS_MESSAGE,
                    onClose: () => {
                        this.bot6DialogueElement?.remove();
                        this.bot6DialogueElement = undefined;
                        this.handleShowChallenge(MOON_CHALLENGE_NEXT_MESSAGE.text);
                    },
                });
                this.game.canvas.parentElement?.append(this.bot6DialogueElement);
            }
        } else {
            // T017: Failure branch (retry)
            this.challengeDialogueElement?.remove();
            this.challengeDialogueElement = undefined;

            const currentChallenge = getCurrentChallenge(updatedVisit);
            const retryOptions = getAnswerOptions(updatedVisit);

            // Show retry message and re-display the same challenge with hints (spec 010, T014)
            this.challengeDialogueElement = createChallengeDialogue({
                description: MOON_CHALLENGE_RETRY_MESSAGE.text,
                challenge: currentChallenge,
                answerOptions: retryOptions,
                onSelect: (retryAnswer: number) => this.handleAnswerSelected(retryAnswer),
                hints: currentChallenge.hints,
                hintsRevealedCount: updatedVisit.hintsRevealedCount,
                onRequestHint: () => this.handleRequestHint(),
            });
            this.game.canvas.parentElement?.append(this.challengeDialogueElement);
        }
    }

    private handleRequestHint(): void {
        if (!this.destinationVisitState) {
            return;
        }

        // Request next hint and update state (spec 010, T015)
        const { visit: updatedVisit, skillState: updatedSkillState } = requestNextHint(
            this.destinationVisitState,
            this.skillProgressState,
        );

        this.destinationVisitState = updatedVisit;
        this.skillProgressState = updatedSkillState;

        // Re-render challenge dialogue with updated hints (spec 010, FR-004)
        this.challengeDialogueElement?.remove();
        this.challengeDialogueElement = undefined;

        const currentChallenge = getCurrentChallenge(updatedVisit);
        const retryOptions = getAnswerOptions(updatedVisit);

        this.challengeDialogueElement = createChallengeDialogue({
            description: MOON_CHALLENGE_RETRY_MESSAGE.text,
            challenge: currentChallenge,
            answerOptions: retryOptions,
            onSelect: (retryAnswer: number) => this.handleAnswerSelected(retryAnswer),
            hints: currentChallenge.hints,
            hintsRevealedCount: updatedVisit.hintsRevealedCount,
            onRequestHint: () => this.handleRequestHint(),
        });
        this.game.canvas.parentElement?.append(this.challengeDialogueElement);
    }

    private handleShutdown(): void {
        this.hudElement?.element.remove();
        this.hudElement = null;
        // T013: Clean up BOT-6 dialogue if still mounted when scene shuts down
        this.bot6DialogueElement?.remove();
        this.bot6DialogueElement = undefined;
        // T019: Clean up challenge dialogue if still mounted
        this.challengeDialogueElement?.remove();
        this.challengeDialogueElement = undefined;
    }
}
