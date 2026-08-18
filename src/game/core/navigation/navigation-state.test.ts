import { describe, expect, it } from 'vitest';

import {
    beginTransitionToDestination,
    beginTransitionToMap,
    completeTransition,
    createInitialNavigationState,
} from './navigation-state';

const DESTINATION_ID = 'moon';

describe('navigation-state', () => {
    it('G1: createInitialNavigationState devuelve siempre el mismo estado inicial determinista', () => {
        expect(createInitialNavigationState()).toEqual({
            activeScene: 'map',
            pendingScene: null,
            selectedDestinationId: null,
            isTransitioning: false,
        });
    });

    it('G2: beginTransitionToDestination inicia la transición sin completar activeScene', () => {
        const initialState = createInitialNavigationState();

        const nextState = beginTransitionToDestination(initialState, DESTINATION_ID);

        expect(nextState).toEqual({
            activeScene: 'map',
            pendingScene: 'destination',
            selectedDestinationId: DESTINATION_ID,
            isTransitioning: true,
        });
    });

    it('G3: beginTransitionToMap inicia la transición sin completar activeScene', () => {
        const stateInDestination = completeTransition(
            beginTransitionToDestination(createInitialNavigationState(), DESTINATION_ID),
        );

        const nextState = beginTransitionToMap(stateInDestination);

        expect(nextState).toEqual({
            activeScene: 'destination',
            pendingScene: 'map',
            selectedDestinationId: DESTINATION_ID,
            isTransitioning: true,
        });
    });

    it('G4: ignora activaciones redundantes de beginTransitionToDestination durante una transición en curso', () => {
        const transitioningState = beginTransitionToDestination(createInitialNavigationState(), DESTINATION_ID);

        const result = beginTransitionToDestination(transitioningState, 'another-destination');

        expect(result).toBe(transitioningState);
    });

    it('G4: ignora activaciones redundantes de beginTransitionToMap durante una transición en curso', () => {
        const transitioningState = beginTransitionToDestination(createInitialNavigationState(), DESTINATION_ID);

        const result = beginTransitionToMap(transitioningState);

        expect(result).toBe(transitioningState);
    });

    it('G5: completeTransition cierra la transición hacia el destino preservando selectedDestinationId', () => {
        const transitioningState = beginTransitionToDestination(createInitialNavigationState(), DESTINATION_ID);

        const nextState = completeTransition(transitioningState);

        expect(nextState).toEqual({
            activeScene: 'destination',
            pendingScene: null,
            selectedDestinationId: DESTINATION_ID,
            isTransitioning: false,
        });
    });

    it('G5: completeTransition cierra la transición hacia el mapa y restablece selectedDestinationId a null', () => {
        const stateInDestination = completeTransition(
            beginTransitionToDestination(createInitialNavigationState(), DESTINATION_ID),
        );
        const transitioningToMap = beginTransitionToMap(stateInDestination);

        const nextState = completeTransition(transitioningToMap);

        expect(nextState).toEqual({
            activeScene: 'map',
            pendingScene: null,
            selectedDestinationId: null,
            isTransitioning: false,
        });
    });

    it('G6: completeTransition no modifica el estado si no hay ninguna transición pendiente', () => {
        const idleState = createInitialNavigationState();

        const result = completeTransition(idleState);

        expect(result).toBe(idleState);
    });

    it('G7: el ciclo mapa→destino→mapa es repetible indefinidamente sin residuo de estado', () => {
        let state = createInitialNavigationState();

        for (let cycle = 0; cycle < 50; cycle += 1) {
            state = completeTransition(beginTransitionToDestination(state, DESTINATION_ID));
            state = completeTransition(beginTransitionToMap(state));
        }

        expect(state).toEqual(createInitialNavigationState());
    });
});
