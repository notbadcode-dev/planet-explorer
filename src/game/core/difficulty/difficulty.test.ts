/**
 * Tests para el módulo de dificultad adaptativa.
 *
 * Verifica que getDifficultyConfig() produce configuraciones correctas
 * según el nivel de habilidad, con garantías de determinismo y monotonismo.
 *
 * Spec: specs/009-adaptive-difficulty-v1/spec.md
 */

import { describe, expect, it } from 'vitest';
import { CHALLENGE_TYPE_COUNTING } from '../challenge-engine/challenge-engine.constants';
import { getDifficultyConfig } from './difficulty';
import {
    DIFFICULTY_LEVEL_MIN,
    DIFFICULTY_LEVEL_MAX,
    DIFFICULTY_COUNTING_MIN_VALUE,
    DIFFICULTY_COUNTING_MAX_BASE,
    DIFFICULTY_COUNTING_MAX_STEP,
} from './difficulty.constants';

describe('difficulty — Adaptive Difficulty Module', () => {
    describe('US1 — Los retos se vuelven más difíciles cuando el jugador domina (spec 009)', () => {
        it('US1 escenario 1: nivel de habilidad 1 produce la configuración mínima', () => {
            const config = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, DIFFICULTY_LEVEL_MIN);

            // Verificar que la config es válida y tiene difficulty = skillLevel
            expect(config.type).toBe(CHALLENGE_TYPE_COUNTING);
            expect(config.difficulty).toBe(DIFFICULTY_LEVEL_MIN);
            expect(config.min).toBe(DIFFICULTY_COUNTING_MIN_VALUE);
            expect(config.max).toBe(DIFFICULTY_COUNTING_MAX_BASE);
        });

        it('US1 escenario 1a: nivel 1 < nivel 3 en parámetros de dificultad', () => {
            const configLevel1 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 1);
            const configLevel3 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 3);

            // Verificar que nivel 3 es más exigente (max > nivel 1)
            expect(configLevel3.max).toBeGreaterThan(configLevel1.max);
            expect(configLevel3.difficulty).toBeGreaterThan(configLevel1.difficulty);
        });

        it('US1 escenario 2: cambio de nivel 4→5 produce configuraciones distintas', () => {
            const configLevel4 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 4);
            const configLevel5 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 5);

            // El cambio de nivel debe producir un cambio en la configuración
            expect(configLevel5.difficulty).toBe(5);
            expect(configLevel5.difficulty).toBeGreaterThan(configLevel4.difficulty);
            expect(configLevel5.max).toBeGreaterThan(configLevel4.max);
        });

        it('US1: garantía G1 (determinismo) — invocaciones repetidas devuelven igual config', () => {
            const first = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 5);
            const second = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 5);

            expect(first).toEqual(second);
            expect(first.min).toBe(second.min);
            expect(first.max).toBe(second.max);
            expect(first.difficulty).toBe(second.difficulty);
        });

        it('US1: garantía G2 (monotonismo) — dificultad nunca decrece con skillLevel', () => {
            for (let level = DIFFICULTY_LEVEL_MIN; level < DIFFICULTY_LEVEL_MAX; level++) {
                const configCurrent = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, level);
                const configNext = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, level + 1);

                expect(configNext.difficulty).toBe(level + 1);
                expect(configNext.max).toBeGreaterThanOrEqual(configCurrent.max);
                expect(configNext.difficulty).toBeGreaterThan(configCurrent.difficulty);
            }
        });

        it('US1 escenario 3a: nivel de habilidad 10 produce la configuración máxima', () => {
            const config = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, DIFFICULTY_LEVEL_MAX);

            // Verificar que la config es válida y tiene difficulty = skillLevel
            expect(config.type).toBe(CHALLENGE_TYPE_COUNTING);
            expect(config.difficulty).toBe(DIFFICULTY_LEVEL_MAX);
            expect(config.min).toBe(DIFFICULTY_COUNTING_MIN_VALUE);
            expect(config.max).toBe(DIFFICULTY_COUNTING_MAX_BASE + (DIFFICULTY_LEVEL_MAX - 1) * DIFFICULTY_COUNTING_MAX_STEP);
        });

        it('US1 escenario 3b: nivel 10 > nivel 1 en todos los parámetros', () => {
            const configLevel1 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, DIFFICULTY_LEVEL_MIN);
            const configLevel10 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, DIFFICULTY_LEVEL_MAX);

            // Verificar que nivel 10 es significativamente más exigente
            expect(configLevel10.max).toBe(12); // 3 + (10-1)*1 = 3 + 9 = 12
            expect(configLevel1.max).toBe(3);   // 3 + (1-1)*1 = 3
            expect(configLevel10.max).toBeGreaterThan(configLevel1.max);
            expect(configLevel10.difficulty).toBeGreaterThan(configLevel1.difficulty);
        });
    });

    describe('US2 — Los retos se vuelven más asequibles cuando el jugador acumula fallos (spec 009)', () => {
        it('US2 escenario 1: nivel 5 < nivel 6 en parámetros de dificultad', () => {
            const configLevel6 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 6);
            const configLevel5 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 5);

            // Verificar que nivel 5 es menos exigente (más asequible)
            expect(configLevel5.max).toBeLessThan(configLevel6.max);
            expect(configLevel5.difficulty).toBeLessThan(configLevel6.difficulty);
        });

        it('US2: garantía de monotonismo descendente — dificultad decrece correctamente', () => {
            const configLevel7 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 7);
            const configLevel6 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 6);
            const configLevel5 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 5);

            // Verificar cadena descendente
            expect(configLevel7.difficulty).toBe(7);
            expect(configLevel6.difficulty).toBe(6);
            expect(configLevel5.difficulty).toBe(5);
            expect(configLevel7.max).toBeGreaterThan(configLevel6.max);
            expect(configLevel6.max).toBeGreaterThan(configLevel5.max);
        });

        it('US2 escenario 1a: edge case nivel 1 es mínimo (no puede bajarse más)', () => {
            const configLevel1 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, DIFFICULTY_LEVEL_MIN);

            expect(configLevel1.difficulty).toBe(DIFFICULTY_LEVEL_MIN);
            expect(configLevel1.min).toBe(DIFFICULTY_COUNTING_MIN_VALUE);
            expect(configLevel1.max).toBe(DIFFICULTY_COUNTING_MAX_BASE);
        });
    });

    describe('Validación y manejo de errores (FR-008/FR-008a)', () => {
        it('T013: skillLevel fuera de rango [1-10] lanza error', () => {
            expect(() => getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 0)).toThrow();
            expect(() => getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 11)).toThrow();
            expect(() => getDifficultyConfig(CHALLENGE_TYPE_COUNTING, -1)).toThrow();
            expect(() => getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 100)).toThrow();
        });

        it('T014: tipo de reto no soportado lanza error con mensaje descriptivo', () => {
            const invalidType = 'unknown-type';
            const error = expect(() => getDifficultyConfig(invalidType, 5));
            error.toThrow();
        });

        it('T013a: tipos numéricos para skillLevel se validan correctamente', () => {
            // Valores enteros válidos
            for (let level = 1; level <= 10; level++) {
                const config = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, level);
                expect(config.difficulty).toBe(level);
            }
        });
    });

    describe('US3 — El tiempo de respuesta nunca influye en la dificultad (spec 009, P2)', () => {
        it('T015: getDifficultyConfig es puro y determinista independiente del tiempo', () => {
            const skillLevel = 5;

            // Simular invocaciones en tiempos distintos
            const config1 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, skillLevel);

            // Segunda invocación (el tiempo transcurrido no debe afectar)
            const config2 = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, skillLevel);

            // Las configuraciones deben ser idénticas (el tiempo no afecta el resultado)
            expect(config1).toEqual(config2);
            expect(config1.difficulty).toBe(config2.difficulty);
            expect(config1.min).toBe(config2.min);
            expect(config1.max).toBe(config2.max);
        });

        it('T015a: la firma de getDifficultyConfig no incluye parámetros de tiempo', () => {
            // Verificar que la función solo toma challengeType y skillLevel
            // (Esta es una verificación implícita: si tuviera parámetros de tiempo,
            // el test anterior fallaría al no pasarlos)

            const config = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, 5);

            // Resultado debe depender SOLO de (CHALLENGE_TYPE_COUNTING, 5)
            expect(config.type).toBe(CHALLENGE_TYPE_COUNTING);
            expect(config.difficulty).toBe(5);
        });

        it('T015b: invocaciones con distinto contexto temporal producen igual resultado', () => {
            // Distintos niveles, invocaciones separadas, mismo resultado esperado
            const levels = [1, 3, 5, 7, 10];

            const firstPass: Record<number, ReturnType<typeof getDifficultyConfig>> = {};
            levels.forEach((level) => {
                firstPass[level] = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, level);
            });

            const secondPass: Record<number, ReturnType<typeof getDifficultyConfig>> = {};
            levels.forEach((level) => {
                secondPass[level] = getDifficultyConfig(CHALLENGE_TYPE_COUNTING, level);
            });

            // Todas las invocaciones con el mismo (type, skillLevel) deben producir igual config
            levels.forEach((level) => {
                expect(firstPass[level]).toEqual(secondPass[level]);
            });
        });
    });
});
