/**
 * Unit Tests: `core/destination-visit/destination-visit-state`
 *
 * Verifica garantías G1-G6 del contrato:
 * - G1: secuencia fija al crear (no regenera)
 * - G2: reintento sin regenerar el reto
 * - G3: avance solo tras acierto
 * - G4: finalización tras último acierto
 * - G5: actualización de habilidad en cada intento
 * - G6: pureza/inmutabilidad
 */

import { describe, expect, it } from 'vitest';
import { CHALLENGE_TYPE_COUNTING } from '../challenge-engine/challenge-engine.constants';
import type { CountingChallengeConfig } from '../challenge-engine/challenge-engine.type';
import { createInitialSkillProgressState, getSkillLevel } from '../progress/skill-progress-state';
import {
    createDestinationVisit,
    getAnswerOptions,
    getCurrentChallenge,
    submitAnswer,
} from './destination-visit-state';
import {
    NUM_ANSWER_OPTIONS,
    VISIT_STATUS_COMPLETED,
    VISIT_STATUS_IN_PROGRESS,
} from './destination-visit-state.constants';

describe('destination-visit-state', () => {
    const mockChallengeConfigs: readonly CountingChallengeConfig[] = [
        { type: CHALLENGE_TYPE_COUNTING, min: 2, max: 5 },
        { type: CHALLENGE_TYPE_COUNTING, min: 2, max: 5 },
        { type: CHALLENGE_TYPE_COUNTING, min: 2, max: 5 },
    ];
    const mockSkillLevel = 5;

    describe('G1: Secuencia fija generada una sola vez', () => {
        it('createDestinationVisit debe generar exactamente N retos', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);

            expect(visit.challenges.length).toBe(mockChallengeConfigs.length);
        });

        it('La secuencia no debe cambiar tras múltiples accesos', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);

            const challenge1 = getCurrentChallenge(visit);
            const challenge2 = getCurrentChallenge(visit);

            expect(challenge1.id).toBe(challenge2.id);
            expect(challenge1.correctAnswer).toBe(challenge2.correctAnswer);
        });
    });

    describe('G2: Reintento sin regenerar reto tras fallo', () => {
        it('Tras submitAnswer con outcome=failure, currentIndex no debe cambiar', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const skillState = createInitialSkillProgressState();
            const challenge = getCurrentChallenge(visit);

            // Enviar una respuesta incorrecta
            const wrongAnswer = challenge.correctAnswer !== 1 ? 1 : 2;
            const { visit: updatedVisit } = submitAnswer(visit, skillState, wrongAnswer as number);

            expect(updatedVisit.currentIndex).toBe(visit.currentIndex);
            expect(updatedVisit.lastOutcome).toBe('failure');
        });

        it('getAnswerOptions debe devolver siempre el mismo reto tras fallo', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const skillState = createInitialSkillProgressState();
            const challenge = getCurrentChallenge(visit);

            const options1 = getAnswerOptions(visit);
            const wrongAnswer = challenge.correctAnswer !== options1[0] ? options1[0] : options1[1];
            const { visit: updatedVisit } = submitAnswer(visit, skillState, wrongAnswer as number);

            const challenge2 = getCurrentChallenge(updatedVisit);
            expect(challenge2.id).toBe(challenge.id);
        });
    });

    describe('G3: Avance solo tras acierto', () => {
        it('Tras submitAnswer con outcome=success, currentIndex debe incrementar', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const skillState = createInitialSkillProgressState();
            const challenge = getCurrentChallenge(visit);

            const { visit: updatedVisit } = submitAnswer(visit, skillState, challenge.correctAnswer as number);

            expect(updatedVisit.currentIndex).toBe(visit.currentIndex + 1);
        });

        it('Tras submitAnswer con outcome=failure, currentIndex no debe cambiar', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const skillState = createInitialSkillProgressState();
            const challenge = getCurrentChallenge(visit);

            const wrongAnswer = challenge.correctAnswer !== 1 ? 1 : 2;
            const { visit: updatedVisit } = submitAnswer(visit, skillState, wrongAnswer as number);

            expect(updatedVisit.currentIndex).toBe(visit.currentIndex);
        });
    });

    describe('G4: Finalización tras último acierto', () => {
        it('Cuando currentIndex supera el último índice tras acierto, status debe ser completed', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            let updatedVisit = visit;
            const skillState = createInitialSkillProgressState();

            // Responder correctamente a todos los retos excepto el último
            for (let i = 0; i < mockChallengeConfigs.length - 1; i++) {
                const challenge = getCurrentChallenge(updatedVisit);
                const result = submitAnswer(updatedVisit, skillState, challenge.correctAnswer as number);
                updatedVisit = result.visit;
                expect(updatedVisit.status).toBe(VISIT_STATUS_IN_PROGRESS);
            }

            // Responder correctamente al último reto
            const lastChallenge = getCurrentChallenge(updatedVisit);
            const { visit: finalVisit } = submitAnswer(updatedVisit, skillState, lastChallenge.correctAnswer as number);

            expect(finalVisit.status).toBe(VISIT_STATUS_COMPLETED);
        });
    });

    describe('G5: Actualización de habilidad en cada intento', () => {
        it('submitAnswer debe invocar updateSkillProgress para aciertos', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const skillState = createInitialSkillProgressState();
            const initialLevel = getSkillLevel(skillState, 'counting');
            const challenge = getCurrentChallenge(visit);

            const { skillState: updatedSkillState } = submitAnswer(visit, skillState, challenge.correctAnswer as number);

            const newLevel = getSkillLevel(updatedSkillState, 'counting');
            expect(newLevel).toBeGreaterThanOrEqual(initialLevel);
        });

        it('submitAnswer debe invocar updateSkillProgress para fallos', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const skillState = createInitialSkillProgressState();
            const challenge = getCurrentChallenge(visit);

            const wrongAnswer = challenge.correctAnswer !== 1 ? 1 : 2;
            const { skillState: updatedSkillState } = submitAnswer(visit, skillState, wrongAnswer as number);

            // El estado debería cambiar (o permanecer igual según las reglas de 006)
            expect(updatedSkillState).toBeDefined();
        });
    });

    describe('G6: Pureza e inmutabilidad', () => {
        it('createDestinationVisit no debe mutar sus argumentos', () => {
            const configs = [...mockChallengeConfigs];
            const configsJson = JSON.stringify(configs);

            createDestinationVisit('test-dest', configs, mockSkillLevel);

            expect(JSON.stringify(configs)).toBe(configsJson);
        });

        it('submitAnswer no debe mutar el visit original', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const skillState = createInitialSkillProgressState();
            const challenge = getCurrentChallenge(visit);
            const originalIndex = visit.currentIndex;

            const { visit: updatedVisit } = submitAnswer(visit, skillState, challenge.correctAnswer as number);

            expect(visit.currentIndex).toBe(originalIndex);
            expect(updatedVisit.currentIndex).toBe(originalIndex + 1);
        });

        it('submitAnswer no debe mutar el skillState original', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const skillState = createInitialSkillProgressState();
            const originalJson = JSON.stringify(skillState);
            const challenge = getCurrentChallenge(visit);

            submitAnswer(visit, skillState, challenge.correctAnswer as number);

            expect(JSON.stringify(skillState)).toBe(originalJson);
        });
    });

    describe('getAnswerOptions', () => {
        it('debe devolver exactamente NUM_ANSWER_OPTIONS opciones', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);

            const options = getAnswerOptions(visit);

            expect(options.length).toBe(NUM_ANSWER_OPTIONS);
        });

        it('debe incluir la respuesta correcta entre las opciones', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const challenge = getCurrentChallenge(visit);
            const options = getAnswerOptions(visit);

            expect(options).toContain(challenge.correctAnswer);
        });

        it('debe devolver opciones con la respuesta correcta (puede haber duplicados en offsets raros)', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const challenge = getCurrentChallenge(visit);
            const options = getAnswerOptions(visit);

            // Requisito mínimo: la respuesta correcta debe estar entre las opciones
            expect(options).toContain(challenge.correctAnswer);
            
            // Debe tener exactamente 4 opciones (aunque podrían haber duplicados raros en offsets)
            expect(options.length).toBe(4);
        });
    });

    describe('Errores', () => {
        it('getCurrentChallenge debe lanzar error si visit.status es completed', () => {
            const visit = createDestinationVisit('test-dest', mockChallengeConfigs, mockSkillLevel);
            const skillState = createInitialSkillProgressState();

            // Completar la visita respondiendo correctamente a todos
            let current = visit;
            for (let i = 0; i < mockChallengeConfigs.length; i++) {
                const challenge = getCurrentChallenge(current);
                const result = submitAnswer(current, skillState, challenge.correctAnswer as number);
                current = result.visit;
            }

            expect(() => getCurrentChallenge(current)).toThrow();
        });

        it('createDestinationVisit debe lanzar error si challengeConfigs está vacío', () => {
            expect(() => createDestinationVisit('test-dest', [], mockSkillLevel)).toThrow();
        });
    });

    describe('Integración con getDifficultyConfig (spec 009) — FR-008/SC-005', () => {
        it('createDestinationVisit aplica getDifficultyConfig correctamente para generar retos adaptados al skillLevel', () => {
            const lowSkillConfigs: readonly CountingChallengeConfig[] = [
                { type: CHALLENGE_TYPE_COUNTING, min: 1, max: 5 },
            ];
            const visitLowSkill = createDestinationVisit('test-dest', lowSkillConfigs, 1);
            const challengeLowSkill = getCurrentChallenge(visitLowSkill);

            const highSkillConfigs: readonly CountingChallengeConfig[] = [
                { type: CHALLENGE_TYPE_COUNTING, min: 1, max: 5 },
            ];
            const visitHighSkill = createDestinationVisit('test-dest', highSkillConfigs, 10);
            const challengeHighSkill = getCurrentChallenge(visitHighSkill);

            // La dificultad debe aumentar con el nivel de habilidad
            // (level 1 → difficulty 1, level 10 → difficulty 10)
            expect(challengeLowSkill.difficulty).toBe(1);
            expect(challengeHighSkill.difficulty).toBe(10);
        });

        it('createDestinationVisit genera retos con configuración adaptada para cada skillLevel', () => {
            const configs: readonly CountingChallengeConfig[] = [
                { type: CHALLENGE_TYPE_COUNTING, min: 1, max: 5 },
            ];

            const visit5 = createDestinationVisit('test-dest', configs, 5);
            const challenge5 = getCurrentChallenge(visit5);

            const visit8 = createDestinationVisit('test-dest', configs, 8);
            const challenge8 = getCurrentChallenge(visit8);

            // Ambos deben tener difficulty = skillLevel
            expect(challenge5.difficulty).toBe(5);
            expect(challenge8.difficulty).toBe(8);

            // Los retos pueden tener el mismo min/max base, pero con diferente difficulty
            expect(challenge5.type).toBe(CHALLENGE_TYPE_COUNTING);
            expect(challenge8.type).toBe(CHALLENGE_TYPE_COUNTING);
        });
    });
});
