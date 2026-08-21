/**
 * API pública del motor genérico de retos.
 *
 * Funciones puras sin dependencias de `phaser` (principio VII de
 * constitution, regla R1 de `docs/conventions/architecture/game-engine-scenes.md`).
 * Testeable con Vitest sin renderizado ni DOM.
 *
 * Ver `specs/007-challenge-engine-core/contracts/challenge-interface.md`
 * para el contrato de API.
 */

import {
    CHALLENGE_ID_PREFIX,
    CHALLENGE_TYPE_COUNTING,
    COUNTING_HINTS,
    COUNTING_ITEM_TYPE,
    COUNTING_QUESTION_TEXT,
    DEFAULT_DIFFICULTY,
    INCLUSIVE_RANGE_OFFSET,
    ITEM_ID_PREFIX,
    ITEM_INDEX_OFFSET,
    MAX_DIFFICULTY,
    MIN_COUNTING_VALUE,
    MIN_DIFFICULTY,
    SUPPORTED_CHALLENGE_TYPES,
    TYPE_NUMBER,
    makeInvalidAnswerTypeError,
    makeInvalidDifficultyError,
    makeInvalidMinError,
    makeInvalidRangeError,
    makeNullAnswerError,
    makeUnsupportedChallengeTypeError,
} from './challenge-engine.constants';
import type {
    Challenge,
    ChallengeConfig,
    CountingChallenge,
    CountingChallengeConfig,
    CountingChallengeItem,
    Hint,
    SkillUpdateResult,
} from './challenge-engine.type';

/**
 * Constantes de resultado de validación.
 * 
 * Corección R5 de la retrospectiva R001: estas constantes ahora se definen aquí
 * (`challenge-engine.constants.ts`) en vez de importarse desde
 * `../progress/skill-progress-state.constants`, desacoplando el módulo de motor
 * de retos de la lógica de progresión.
 */
import { CHALLENGE_RESULT_FAILURE, CHALLENGE_RESULT_SUCCESS } from './challenge-engine.constants';

/**
 * Registro de generadores de retos por tipo de reto.
 *
 * Cada entrada mapea un `type` a una función que genera un `Challenge` específico
 * de ese tipo. Cuando se añada un nuevo tipo de reto, debe:
 * 1. Implementar su función generadora (ej. `generateMemoryChallenge`)
 * 2. Registrarla aquí con la clave correspondiente (ej. `CHALLENGE_TYPE_MEMORY`)
 *
 * Si no se registra, `generateChallenge()` lanzará `makeUnsupportedChallengeTypeError`.
 *
 * Ver `specs/009-adaptive-difficulty-v1/research.md § Decisión 2` (corrección R2
 * de la retrospectiva R001: patrón de registro en vez de if/switch).
 */
type ChallengeGenerator = (config: ChallengeConfig) => Challenge;
const CHALLENGE_GENERATORS: Record<string, ChallengeGenerator> = {
    [CHALLENGE_TYPE_COUNTING]: (config) => generateCountingChallenge(config as CountingChallengeConfig),
};

/**
 * Genera un nuevo reto según la configuración proporcionada.
 *
 * Función pura y pseudoaleatoria (sin semilla): invocaciones repetidas con la
 * misma config pueden producir retos distintos (FR-004).
 *
 * @param config — configuración del reto a generar, discriminada por `type`
 * @returns un nuevo `Challenge` inmutable
 * @throws Error si `config` no es válida o `type` no está soportado (FR-008)
 */
export function generateChallenge(config: ChallengeConfig): Challenge {
    if (!isSupportedChallengeType(config.type)) {
        throw makeUnsupportedChallengeTypeError(config.type);
    }

    const generator = CHALLENGE_GENERATORS[config.type];
    if (!generator) {
        throw makeUnsupportedChallengeTypeError(config.type);
    }

    return generator(config);
}

/**
 * Valida la respuesta del jugador contra un reto generado.
 *
 * Función pura: no muta `challenge` ni depende de estado global (FR-009).
 * Acepta números fuera del rango esperado como `'failure'` sin lanzar
 * excepción.
 *
 * @param challenge — reto generado por `generateChallenge()`
 * @param answer — respuesta del jugador
 * @returns `'success'` si `answer === challenge.correctAnswer`, si no `'failure'`
 * @throws Error si `answer` es `null`/`undefined` o no es un número
 */
export function validateAnswer(challenge: Challenge, answer: unknown): SkillUpdateResult {
    if (answer === null || answer === undefined) {
        throw makeNullAnswerError();
    }

    if (typeof answer !== TYPE_NUMBER) {
        throw makeInvalidAnswerTypeError(answer);
    }

    return answer === challenge.correctAnswer ? CHALLENGE_RESULT_SUCCESS : CHALLENGE_RESULT_FAILURE;
}

/**
 * Obtiene una pista de un reto por índice.
 *
 * Función pura y genérica: funciona con cualquier `Challenge` que tenga
 * definidas pistas, sin dependencia del tipo específico de reto.
 *
 * @param challenge — reto generado por `generateChallenge()`
 * @param hintIndex — índice de la pista a obtener (0-based)
 * @returns la `Hint` en position `hintIndex`, o `undefined` si no existe
 *
 * Ver `specs/010-hints-and-retry-flow/contracts/hint-contract.md`
 * (garantías H1-H2).
 */
export function requestHint(challenge: Challenge, hintIndex: number): Hint | undefined {
    return challenge.hints?.[hintIndex];
}

/**
 * Genera un `CountingChallenge` válido a partir de una `CountingChallengeConfig`.
 */
function generateCountingChallenge(config: CountingChallengeConfig): CountingChallenge {
    validateCountingConfig(config);
    const difficulty = validateDifficulty(config.difficulty);
    const correctAnswer = randomIntInRange(config.min, config.max);

    return {
        id: createChallengeId(),
        type: CHALLENGE_TYPE_COUNTING,
        question: COUNTING_QUESTION_TEXT,
        correctAnswer,
        difficulty,
        items: buildCountingItems(correctAnswer),
        hints: COUNTING_HINTS,
    };
}

/**
 * Valida `min`/`max` de una `CountingChallengeConfig` (FR-008).
 */
function validateCountingConfig(config: CountingChallengeConfig): void {
    if (config.min < MIN_COUNTING_VALUE) {
        throw makeInvalidMinError(config.min);
    }

    if (config.min > config.max) {
        throw makeInvalidRangeError(config.min, config.max);
    }
}

/**
 * Valida y normaliza `difficulty`, aplicando `DEFAULT_DIFFICULTY` si no se
 * especifica (FR-008).
 */
function validateDifficulty(difficulty: number | undefined): number {
    const value = difficulty ?? DEFAULT_DIFFICULTY;

    if (value < MIN_DIFFICULTY || value > MAX_DIFFICULTY) {
        throw makeInvalidDifficultyError(difficulty);
    }

    return value;
}

/**
 * Entero pseudoaleatorio en `[min, max]` inclusive, sin semilla.
 */
function randomIntInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + INCLUSIVE_RANGE_OFFSET)) + min;
}

/**
 * Construye `count` elementos de conteo con `id`/`type` únicos.
 */
function buildCountingItems(count: number): readonly CountingChallengeItem[] {
    return Array.from({ length: count }, (_value, index) => ({
        id: createItemId(index),
        type: COUNTING_ITEM_TYPE,
    }));
}

/**
 * Identificador único de reto (basado en UUID).
 */
function createChallengeId(): string {
    return CHALLENGE_ID_PREFIX + crypto.randomUUID();
}

/**
 * Identificador único de elemento dentro de un reto, base-1.
 */
function createItemId(index: number): string {
    return ITEM_ID_PREFIX + (index + ITEM_INDEX_OFFSET);
}

/**
 * ¿`type` pertenece a `SUPPORTED_CHALLENGE_TYPES`?
 */
function isSupportedChallengeType(type: string): boolean {
    return SUPPORTED_CHALLENGE_TYPES.includes(type);
}
