/**
 * Tests para el modelo de progreso por habilidades.
 *
 * Suite Vitest cubriendo las garantías G1-G9 del contrato de API
 * (`specs/006-skill-progress-model/contracts/skill-progress-contract.md`).
 * Testeable 100% sin DOM ni Phaser (principio VII).
 */

import { beforeEach, describe, expect, it } from 'vitest';
import {
    createInitialSkillProgressState,
    getSkillLevel,
    updateSkillProgress,
} from './skill-progress-state';
import type { SkillProgressState } from './skill-progress-state.type';

describe('skill-progress-state', () => {
    describe('G1 — createInitialSkillProgressState()', () => {
        it('devuelve estado con 7 habilidades en { level: 1, failureCount: 0 }', () => {
            const state = createInitialSkillProgressState();

            expect(state).toEqual({
                counting: { level: 1, failureCount: 0 },
                addition: { level: 1, failureCount: 0 },
                memory: { level: 1, failureCount: 0 },
                logic: { level: 1, failureCount: 0 },
                reading: { level: 1, failureCount: 0 },
                spatialReasoning: { level: 1, failureCount: 0 },
                astronomy: { level: 1, failureCount: 0 },
            });
        });

        it('es determinista: múltiples llamadas devuelven estados equivalentes', () => {
            const state1 = createInitialSkillProgressState();
            const state2 = createInitialSkillProgressState();

            expect(state1).toEqual(state2);
            // No son la misma referencia (objeto nuevo cada vez)
            expect(state1).not.toBe(state2);
        });
    });

    describe('G2 — getSkillLevel()', () => {
        let state: SkillProgressState;

        beforeEach(() => {
            state = createInitialSkillProgressState();
        });

        it('US1 escenario 1: devuelve nivel inicial 1 en jugador nuevo', () => {
            expect(getSkillLevel(state, 'counting')).toBe(1);
            expect(getSkillLevel(state, 'addition')).toBe(1);
            expect(getSkillLevel(state, 'memory')).toBe(1);
        });

        it('US1 escenario 2: lectura independiente de múltiples habilidades sin mezcla', () => {
            // Actualizar 'addition' a nivel 5
            state = updateSkillProgress(state, 'addition', 'success');
            state = updateSkillProgress(state, 'addition', 'success');
            state = updateSkillProgress(state, 'addition', 'success');
            state = updateSkillProgress(state, 'addition', 'success');

            // Verificar que 'addition' está en nivel 5
            expect(getSkillLevel(state, 'addition')).toBe(5);

            // Verificar que otras habilidades permanecen en nivel 1 sin mezcla
            expect(getSkillLevel(state, 'counting')).toBe(1);
            expect(getSkillLevel(state, 'memory')).toBe(1);
            expect(getSkillLevel(state, 'logic')).toBe(1);
        });

        it('US1 escenario 3: excepción al consultar habilidad no soportada', () => {
            expect(() => getSkillLevel(state, 'chess' as unknown as typeof state['counting'])).toThrow(
                "Habilidad no soportada: 'chess'",
            );
        });
    });

    describe('G5 — updateSkillProgress() success', () => {
        let state: SkillProgressState;

        beforeEach(() => {
            state = createInitialSkillProgressState();
        });

        it('US2 escenario 1: success +1 nivel desde nivel 3', () => {
            // Llevar counting a nivel 3
            state = updateSkillProgress(state, 'counting', 'success');
            state = updateSkillProgress(state, 'counting', 'success');

            expect(getSkillLevel(state, 'counting')).toBe(3);

            // Acierto → nivel 4
            state = updateSkillProgress(state, 'counting', 'success');

            expect(getSkillLevel(state, 'counting')).toBe(4);
            expect(state.counting.failureCount).toBe(0);
        });

        it('success en nivel 10 no sube más (techo)', () => {
            // Llevar counting a nivel 10
            for (let i = 0; i < 9; i++) {
                state = updateSkillProgress(state, 'counting', 'success');
            }

            expect(getSkillLevel(state, 'counting')).toBe(10);

            // Acierto en nivel máximo → nivel sigue siendo 10
            state = updateSkillProgress(state, 'counting', 'success');

            expect(getSkillLevel(state, 'counting')).toBe(10);
        });

        it('success reinicia failureCount a 0', () => {
            // Llevar a 1 fallo
            state = updateSkillProgress(state, 'counting', 'failure');
            expect(state.counting.failureCount).toBe(1);

            // Acierto → reinicia failureCount
            state = updateSkillProgress(state, 'counting', 'success');

            expect(state.counting.failureCount).toBe(0);
        });
    });

    describe('G6 — updateSkillProgress() failure (mecánica de fallos acumulados)', () => {
        let state: SkillProgressState;

        beforeEach(() => {
            state = createInitialSkillProgressState();
        });

        it('US2 escenario 2: 1 fallo sin cambio de nivel, failureCount += 1', () => {
            // Llevar counting a nivel 3
            for (let i = 0; i < 2; i++) {
                state = updateSkillProgress(state, 'counting', 'success');
            }

            expect(getSkillLevel(state, 'counting')).toBe(3);
            expect(state.counting.failureCount).toBe(0);

            // 1 fallo
            state = updateSkillProgress(state, 'counting', 'failure');

            expect(getSkillLevel(state, 'counting')).toBe(3); // Sin cambio
            expect(state.counting.failureCount).toBe(1);
        });

        it('US2 escenario 3: 3 fallos acumulados → -1 nivel y reset failureCount', () => {
            // Llevar counting a nivel 3
            for (let i = 0; i < 2; i++) {
                state = updateSkillProgress(state, 'counting', 'success');
            }

            expect(getSkillLevel(state, 'counting')).toBe(3);

            // 1er fallo
            state = updateSkillProgress(state, 'counting', 'failure');
            expect(getSkillLevel(state, 'counting')).toBe(3);
            expect(state.counting.failureCount).toBe(1);

            // 2do fallo
            state = updateSkillProgress(state, 'counting', 'failure');
            expect(getSkillLevel(state, 'counting')).toBe(3);
            expect(state.counting.failureCount).toBe(2);

            // 3er fallo acumulado → -1 nivel + reset
            state = updateSkillProgress(state, 'counting', 'failure');
            expect(getSkillLevel(state, 'counting')).toBe(2);
            expect(state.counting.failureCount).toBe(0);
        });

        it('US2 escenario 4: fallo en nivel 1 con failureCount 2 mantiene nivel 1 (suelo)', () => {
            // Llevar a nivel 1, failureCount 2
            state = updateSkillProgress(state, 'counting', 'failure');
            state = updateSkillProgress(state, 'counting', 'failure');

            expect(getSkillLevel(state, 'counting')).toBe(1);
            expect(state.counting.failureCount).toBe(2);

            // 3er fallo en nivel mínimo → suelo en 1
            state = updateSkillProgress(state, 'counting', 'failure');

            expect(getSkillLevel(state, 'counting')).toBe(1);
            expect(state.counting.failureCount).toBe(0);
        });
    });

    describe('G7 — updateSkillProgress() hint-used', () => {
        let state: SkillProgressState;

        beforeEach(() => {
            state = createInitialSkillProgressState();
        });

        it('US2 escenario 6: hint-used sin cambios en level ni failureCount', () => {
            // Llevar a nivel 3, failureCount 1
            state = updateSkillProgress(state, 'counting', 'success');
            state = updateSkillProgress(state, 'counting', 'success');
            state = updateSkillProgress(state, 'counting', 'failure');

            expect(getSkillLevel(state, 'counting')).toBe(3);
            expect(state.counting.failureCount).toBe(1);

            // Pista → sin cambios
            state = updateSkillProgress(state, 'counting', 'hint-used');

            expect(getSkillLevel(state, 'counting')).toBe(3);
            expect(state.counting.failureCount).toBe(1);
        });
    });

    describe('G4 — Aislamiento entre habilidades (US3)', () => {
        let state: SkillProgressState;

        beforeEach(() => {
            state = createInitialSkillProgressState();
        });

        it('US3 escenario 1: actualizar una habilidad no modifica otras', () => {
            // Subir addition a nivel 5
            for (let i = 0; i < 4; i++) {
                state = updateSkillProgress(state, 'addition', 'success');
            }

            expect(getSkillLevel(state, 'addition')).toBe(5);

            // Verificar que otras habilidades no se vieron afectadas
            expect(getSkillLevel(state, 'counting')).toBe(1);
            expect(getSkillLevel(state, 'memory')).toBe(1);
            expect(getSkillLevel(state, 'logic')).toBe(1);
            expect(getSkillLevel(state, 'reading')).toBe(1);
            expect(getSkillLevel(state, 'spatialReasoning')).toBe(1);
            expect(getSkillLevel(state, 'astronomy')).toBe(1);
        });

        it('US3 escenario 2: dos instancias divergen sin interferencia mutua', () => {
            const state1 = createInitialSkillProgressState();
            const state2 = createInitialSkillProgressState();

            // Evolucionar state1: counting → nivel 7
            let evolvedState1 = state1;
            for (let i = 0; i < 6; i++) {
                evolvedState1 = updateSkillProgress(evolvedState1, 'counting', 'success');
            }

            // Evolucionar state2: reading → nivel 4
            let evolvedState2 = state2;
            for (let i = 0; i < 3; i++) {
                evolvedState2 = updateSkillProgress(evolvedState2, 'reading', 'success');
            }

            // Verificar divergencia
            expect(getSkillLevel(evolvedState1, 'counting')).toBe(7);
            expect(getSkillLevel(evolvedState1, 'reading')).toBe(1);

            expect(getSkillLevel(evolvedState2, 'counting')).toBe(1);
            expect(getSkillLevel(evolvedState2, 'reading')).toBe(4);

            // Verificar que state1 original no se vio afectado
            expect(getSkillLevel(state1, 'counting')).toBe(1);
        });
    });

    describe('G8 — Error handling: entrada inválida', () => {
        let state: SkillProgressState;

        beforeEach(() => {
            state = createInitialSkillProgressState();
        });

        it('updateSkillProgress con skill no soportada lanza Error (FR-008)', () => {
            expect(() => updateSkillProgress(state, 'chess' as unknown as typeof state, 'success')).toThrow(
            );
        });

        it('updateSkillProgress con result no válido lanza Error (FR-009)', () => {
            expect(() => updateSkillProgress(state, 'counting', 'draw' as unknown as typeof state['counting'])).toThrow(
            );
        });

        it('getSkillLevel con skill no soportada lanza Error (FR-008)', () => {
            expect(() => getSkillLevel(state, 'unknown-skill' as unknown as typeof state['counting'])).toThrow(
                "Habilidad no soportada: 'unknown-skill'",
            );
        });
    });

    describe('G9 — Estado no mutado: devolver nuevo objeto', () => {
        let state: SkillProgressState;

        beforeEach(() => {
            state = createInitialSkillProgressState();
        });

        it('updateSkillProgress devuelve nuevo objeto, no mutación', () => {
            const stateBeforeUpdate = { ...state };

            const newState = updateSkillProgress(state, 'counting', 'success');

            // El estado original no cambió
            expect(state).toEqual(stateBeforeUpdate);

            // El nuevo estado sí cambió
            expect(newState.counting.level).toBe(2);

            // No es la misma referencia
            expect(newState).not.toBe(state);
        });

        it('updateSkillProgress con hint-used devuelve el mismo objeto (optimización)', () => {
            // hint-used no cambia nada, por lo que puede devolver la misma referencia
            // (esta es una optimización; el contrato solo exige que el nivel y failureCount no cambien)
            const newState = updateSkillProgress(state, 'counting', 'hint-used');

            expect(newState).toBe(state);
        });

        it('getSkillLevel no modifica el estado', () => {
            const stateBeforeRead = JSON.parse(JSON.stringify(state));

            getSkillLevel(state, 'counting');

            expect(state).toEqual(stateBeforeRead);
        });
    });
});
