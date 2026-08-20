/**
 * Tests para el motor genérico de retos.
 *
 * Cubre las historias de usuario US1 (generación), US2 (validación) y US3
 * (integración con el modelo de progreso 006), según
 * `specs/007-challenge-engine-core/spec.md` y `quickstart.md`.
 * Testeable 100% sin DOM ni Phaser (principio VII).
 */

import { describe, expect, it } from 'vitest';
import { generateChallenge, validateAnswer } from './challenge-engine';
import type { Challenge, ChallengeConfig, CountingChallenge, CountingChallengeConfig } from './challenge-engine.type';
import { createInitialSkillProgressState, updateSkillProgress } from '../progress/skill-progress-state';

describe('challenge-engine', () => {
    describe('generateChallenge() — US1 generación de reto de conteo', () => {
        it('US1 escenario 1: config válida (rango 1-10) genera un CountingChallenge completo', () => {
            const config: CountingChallengeConfig = { type: 'counting', min: 1, max: 10 };

            const challenge = generateChallenge(config) as CountingChallenge;

            expect(challenge.id).toBeTruthy();
            expect(challenge.type).toBe('counting');
            expect(challenge.question).toBeTruthy();
            expect(challenge.correctAnswer).toBeGreaterThanOrEqual(config.min);
            expect(challenge.correctAnswer).toBeLessThanOrEqual(config.max);
            expect(challenge.items).toHaveLength(challenge.correctAnswer);
            expect(challenge.difficulty).toBeGreaterThanOrEqual(1);
            expect(challenge.difficulty).toBeLessThanOrEqual(10);

            for (const item of challenge.items) {
                expect(item.id).toBeTruthy();
                expect(item.type).toBeTruthy();
            }
        });

        it('US1 escenario 2: múltiples invocaciones producen retos válidos e independientes', () => {
            const config: CountingChallengeConfig = { type: 'counting', min: 1, max: 10 };

            const first = generateChallenge(config) as CountingChallenge;
            const second = generateChallenge(config) as CountingChallenge;

            expect(first.id).not.toBe(second.id);
            expect(first.items).toHaveLength(first.correctAnswer);
            expect(second.items).toHaveLength(second.correctAnswer);
        });

        it('variabilidad pseudoaleatoria: múltiples invocaciones producen al menos 2 valores distintos de correctAnswer', () => {
            const config: CountingChallengeConfig = { type: 'counting', min: 1, max: 10 };

            const results = new Set<number>();
            for (let i = 0; i < 20; i++) {
                const challenge = generateChallenge(config) as CountingChallenge;
                results.add(challenge.correctAnswer);
            }

            expect(results.size).toBeGreaterThan(1);
        });

        it('US1 escenario 3: config inválida lanza excepción (min < 1)', () => {
            const config: CountingChallengeConfig = { type: 'counting', min: 0, max: 5 };

            expect(() => generateChallenge(config)).toThrow('min must be >= 1');
        });

        it('caso límite: min > max lanza excepción', () => {
            const config: CountingChallengeConfig = { type: 'counting', min: 10, max: 5 };

            expect(() => generateChallenge(config)).toThrow('min cannot exceed max');
        });

        it('difficulty fuera de rango [1,10] lanza excepción (por encima)', () => {
            const config: CountingChallengeConfig = { type: 'counting', min: 1, max: 5, difficulty: 11 };

            expect(() => generateChallenge(config)).toThrow('difficulty must be between 1 and 10');
        });

        it('difficulty fuera de rango [1,10] lanza excepción (por debajo, quickstart escenario 6)', () => {
            const config: CountingChallengeConfig = { type: 'counting', min: 1, max: 5, difficulty: 0 };

            expect(() => generateChallenge(config)).toThrow('difficulty must be between 1 and 10');
        });

        it('type no soportado lanza excepción', () => {
            const config: ChallengeConfig = { type: 'unknown-type' };

            expect(() => generateChallenge(config)).toThrow('unsupported challenge type');
        });

        it('no importa Phaser: el módulo es 100% ejecutable en Node.js sin DOM', () => {
            expect(typeof generateChallenge).toBe('function');
        });
    });

    describe('validateAnswer() — US2 validación de la respuesta del jugador', () => {
        function makeChallenge(): CountingChallenge {
            return generateChallenge({ type: 'counting', min: 5, max: 5 }) as CountingChallenge;
        }

        it('US2 escenario 1: respuesta correcta devuelve success', () => {
            const challenge = makeChallenge();

            expect(validateAnswer(challenge, challenge.correctAnswer)).toBe('success');
        });

        it('US2 escenario 2: respuesta incorrecta devuelve failure', () => {
            const challenge = makeChallenge();

            expect(validateAnswer(challenge, challenge.correctAnswer + 1)).toBe('failure');
        });

        it('caso límite: respuesta fuera de rango devuelve failure sin excepción', () => {
            const challenge = makeChallenge();

            expect(validateAnswer(challenge, 999)).toBe('failure');
        });

        it('US2 escenario 3: respuesta null o undefined lanza excepción', () => {
            const challenge = makeChallenge();

            expect(() => validateAnswer(challenge, null)).toThrow('answer cannot be null or undefined');
            expect(() => validateAnswer(challenge, undefined)).toThrow('answer cannot be null or undefined');
        });

        it('respuesta de tipo inválido (string, objeto, array) lanza excepción', () => {
            const challenge = makeChallenge();

            expect(() => validateAnswer(challenge, 'five')).toThrow('answer must be a number');
            expect(() => validateAnswer(challenge, {})).toThrow('answer must be a number');
            expect(() => validateAnswer(challenge, [])).toThrow('answer must be a number');
        });

        it('pureza: no muta el reto original tras validar', () => {
            const challenge = makeChallenge();
            const snapshot = JSON.parse(JSON.stringify(challenge)) as Challenge;

            validateAnswer(challenge, challenge.correctAnswer);

            expect(challenge).toEqual(snapshot);
        });

        it('US2 escenario 4: validaciones repetidas en secuencia con retos distintos son independientes', () => {
            const challengeA = makeChallenge();
            const challengeB = generateChallenge({ type: 'counting', min: 1, max: 1 }) as CountingChallenge;

            expect(validateAnswer(challengeA, challengeA.correctAnswer)).toBe('success');
            expect(validateAnswer(challengeB, challengeB.correctAnswer)).toBe('success');
            expect(validateAnswer(challengeA, challengeA.correctAnswer + 1)).toBe('failure');
        });
    });

    describe('Integración con updateSkillProgress() — US3', () => {
        it('US3: acierto sube el nivel de counting y fallo sube el failureCount', () => {
            const challenge = generateChallenge({ type: 'counting', min: 3, max: 3 }) as CountingChallenge;
            let state = createInitialSkillProgressState();

            const successResult = validateAnswer(challenge, challenge.correctAnswer);
            state = updateSkillProgress(state, 'counting', successResult);

            expect(state.counting.level).toBe(2);
            expect(state.counting.failureCount).toBe(0);

            const failureChallenge = generateChallenge({ type: 'counting', min: 3, max: 3 }) as CountingChallenge;
            const failureResult = validateAnswer(failureChallenge, failureChallenge.correctAnswer + 1);
            state = updateSkillProgress(state, 'counting', failureResult);

            expect(state.counting.level).toBe(2);
            expect(state.counting.failureCount).toBe(1);
        });
    });

    describe('Extensibilidad — FR-007/SC-004', () => {
        it('un tipo simulado que extiende Challenge es asignable sin modificar los ficheros existentes', () => {
            interface AdditionChallenge extends Challenge {
                readonly type: 'addition';
                readonly operand1: number;
                readonly operand2: number;
                readonly correctAnswer: number;
            }

            const simulated: AdditionChallenge = {
                id: 'challenge-simulated',
                type: 'addition',
                question: 'texto de prueba',
                operand1: 2,
                operand2: 3,
                correctAnswer: 5,
                difficulty: 1,
            };

            const asGeneric: Challenge = simulated;

            expect(asGeneric.type).toBe('addition');
        });
    });

    describe('Correcciones R2/R5 (spec 009) — patrón de registro y desacoplamiento de progress/', () => {
        it('R2: generateChallenge() sigue generando retos counting correctamente con el patrón de registro (no if/switch)', () => {
            const config: CountingChallengeConfig = { type: 'counting', min: 2, max: 8 };
            const challenge = generateChallenge(config) as CountingChallenge;

            expect(challenge.type).toBe('counting');
            expect(challenge.correctAnswer).toBeGreaterThanOrEqual(2);
            expect(challenge.correctAnswer).toBeLessThanOrEqual(8);
        });

        it('R2: tipo de reto no registrado lanza error (mismo comportamiento que antes)', () => {
            const unsupportedConfig: ChallengeConfig = { type: 'memory', difficulty: 5 };

            expect(() => generateChallenge(unsupportedConfig)).toThrow(/unsupported challenge type/i);
        });

        it('R5: validateAnswer() devuelve "success"/"failure" correctamente tras desacoplamiento de progress/', () => {
            const challenge = generateChallenge({ type: 'counting', min: 5, max: 5 }) as CountingChallenge;

            const successResult = validateAnswer(challenge, 5);
            const failureResult = validateAnswer(challenge, 3);

            expect(successResult).toBe('success');
            expect(failureResult).toBe('failure');
        });
    });
});
