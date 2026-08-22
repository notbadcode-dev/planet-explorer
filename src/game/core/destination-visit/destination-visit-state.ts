/**
 * Módulo puro para gestionar el estado de una visita a un destino.
 *
 * Coordina la secuencia de retos, opciones de respuesta y resultados sin
 * dependencia de Phaser (principio VII). Reutiliza generateChallenge/validateAnswer
 * (spec 007) y updateSkillProgress (spec 006) sin acoplarlos.
 *
 * Ver `specs/008-moon-destination-counting/data-model.md` y
 * `specs/008-moon-destination-counting/contracts/destination-visit-contract.md`.
 */

import { generateChallenge, validateAnswer, requestHint } from '../challenge-engine/challenge-engine';
import type { Challenge, ChallengeConfig, Hint, SkillUpdateResult } from '../challenge-engine/challenge-engine.type';
import { getDifficultyConfig } from '../difficulty/difficulty';
import { updateSkillProgress } from '../progress/skill-progress-state';
import type { SkillProgressState } from '../progress/skill-progress-state.type';
import {
    ANSWER_OUTCOME_SUCCESS,
    DISTRACTOR_OFFSET_1,
    DISTRACTOR_OFFSET_2,
    DISTRACTOR_OFFSET_3,
    INITIAL_CHALLENGE_INDEX,
    LAST_OUTCOME_INITIAL,
    MIN_DISTRACTOR_VALUE,
    NEXT_CHALLENGE_OFFSET,
    SHUFFLE_START_FACTOR,
    SHUFFLE_ZERO_FACTOR,
    SKILL_COUNTING_ID,
    VISIT_STATUS_COMPLETED,
    VISIT_STATUS_IN_PROGRESS,
    INITIAL_HINTS_REVEALED_COUNT,
    HINTS_REVEALED_INCREMENT,
    HINT_USED_RESULT,
    makeCompletedVisitAccessError,
    makeEmptyChallengeConfigsError,
    makeInvalidCurrentIndexError
} from './destination-visit-state.constants';
import type { DestinationVisitState } from './destination-visit-state.type';

/**
 * Crea una nueva visita a un destino (G1: secuencia fija generada una sola vez).
 *
 * NOTA (spec 009-adaptive-difficulty-v1): La firma de esta función fue ampliada
 * en la spec 009 para aceptar configs de cualquier tipo de reto (ChallengeConfig en lugar
 * de CountingChallengeConfig) y para aplicar automáticamente la dificultad adaptativa
 * por nivel de habilidad usando getDifficultyConfig().
 *
 * @param destinationId Identificador del destino (p. ej. "moon")
 * @param challengeConfigs Configuración de retos a generar (usualmente 3 para Luna), ampliado para aceptar cualquier ChallengeConfig
 * @param skillLevel Nivel actual de la habilidad, usado para calcular dificultad adaptativa via getDifficultyConfig()
 * @returns DestinationVisitState nuevo con secuencia generada e índice 0
 * @throws Error si challengeConfigs está vacío
 */
export function createDestinationVisit(
    destinationId: string,
    challengeConfigs: readonly ChallengeConfig[],
    skillLevel: number,
): DestinationVisitState {
    if (!challengeConfigs || challengeConfigs.length === SHUFFLE_ZERO_FACTOR) {
        throw makeEmptyChallengeConfigsError(destinationId);
    }

    const challenges = challengeConfigs.map((config) => {
        const difficultyAdjustedConfig = getDifficultyConfig(config.type, skillLevel);
        return generateChallenge(difficultyAdjustedConfig);
    }) as Challenge[];

    return {
        destinationId,
        challenges: challenges,
        currentIndex: INITIAL_CHALLENGE_INDEX,
        status: VISIT_STATUS_IN_PROGRESS,
        lastOutcome: LAST_OUTCOME_INITIAL,
        hintsRevealedCount: INITIAL_HINTS_REVEALED_COUNT,
    };
}

/**
 * Obtiene el reto actual (correspondiente a currentIndex).
 *
 * @param visit Estado de la visita
 * @returns El Challenge en position currentIndex
 * @throws Error si visit.status es 'completed' (uso indebido de API)
 */
export function getCurrentChallenge(visit: DestinationVisitState): Challenge {
    if (visit.status === VISIT_STATUS_COMPLETED) {
        throw makeCompletedVisitAccessError();
    }
    const challenge = visit.challenges[visit.currentIndex];
    if (!challenge) {
        throw makeInvalidCurrentIndexError();
    }
    return challenge;
}

/**
 * Calcula las opciones de respuesta para el reto actual (4 opciones: 1 correcta + 3 distractores).
 *
 * Generación de distractores: usa offsets respecto a correctAnswer.
 * Los distractores pueden repetirse si hay colisiones, pero esto es raro en rangos típicos.
 *
 * @param visit Estado de la visita
 * @returns Array de 4 opciones numéricas, una de las cuales es correctAnswer
 */
export function getAnswerOptions(visit: DestinationVisitState): readonly number[] {
    const challenge = getCurrentChallenge(visit);
    const correctAnswer = challenge.correctAnswer as number;

    // Generar 3 distractores
    const distractor1 = Math.max(MIN_DISTRACTOR_VALUE, correctAnswer + DISTRACTOR_OFFSET_1);
    const distractor2 = correctAnswer + DISTRACTOR_OFFSET_2;
    const distractor3 = correctAnswer + DISTRACTOR_OFFSET_3;

    // Mezclar en un array de 4 opciones
    const options = [correctAnswer, distractor1, distractor2, distractor3];

    // Barajar para que la respuesta correcta no siempre esté en la misma posición
    return shuffleArray(options);
}

/**
 * Solicita la siguiente pista para el reto actual.
 *
 * Si el reto tiene pistas disponibles en la posición `visit.hintsRevealedCount`,
 * devuelve esa pista, registra el uso vía `updateSkillProgress(..., 'hint-used')`,
 * e incrementa `hintsRevealedCount`. Si no hay más pistas, devuelve `undefined` sin
 * modificar el estado de progresión.
 *
 * @param visit Estado actual de la visita
 * @param skillState Estado actual de habilidades
 * @returns Objeto con visit/skillState actualizados, y la hint devuelta (o undefined)
 *
 * Ver `specs/010-hints-and-retry-flow/contracts/hint-contract.md` (garantías H1-H7).
 */
export function requestNextHint(
    visit: DestinationVisitState,
    skillState: SkillProgressState,
): {
    visit: DestinationVisitState;
    skillState: SkillProgressState;
    hint: Hint | undefined;
} {
    const challenge = getCurrentChallenge(visit);
    const hint = requestHint(challenge, visit.hintsRevealedCount);

    if (!hint) {
        // Sin pistas disponibles: devolver state sin cambios
        return {
            visit,
            skillState,
            hint: undefined,
        };
    }

    // Pista disponible: registrar uso y actualizar estado
    const updatedSkillState = updateSkillProgress(skillState, SKILL_COUNTING_ID, HINT_USED_RESULT);
    const updatedVisit = {
        ...visit,
        hintsRevealedCount: visit.hintsRevealedCount + HINTS_REVEALED_INCREMENT,
    };

    return {
        visit: updatedVisit,
        skillState: updatedSkillState,
        hint,
    };
}

/**
 * Procesa la respuesta del jugador: valida, actualiza visita y habilidad.
 *
 * @param visit Estado actual de la visita
 * @param skillState Estado actual de habilidades
 * @param answer Opción numérica seleccionada
 * @returns Objeto con visit actualizada, skillState actualizado, y outcome
 */
export function submitAnswer(
    visit: DestinationVisitState,
    skillState: SkillProgressState,
    answer: number,
): {
    visit: DestinationVisitState;
    skillState: SkillProgressState;
    outcome: SkillUpdateResult;
} {
    const challenge = getCurrentChallenge(visit);

    // Validar respuesta contra el reto actual
    const outcome = validateAnswer(challenge, answer);

    // Actualizar habilidad "counting" según el resultado (G5)
    const updatedSkillState = updateSkillProgress(skillState, SKILL_COUNTING_ID, outcome);

    // Avanzar o finalizar según el resultado (G3, G4)
    let updatedVisit: DestinationVisitState;
    if (outcome === ANSWER_OUTCOME_SUCCESS) {
        const nextIndex = visit.currentIndex + NEXT_CHALLENGE_OFFSET;
        const isCompleted = nextIndex >= visit.challenges.length;

        updatedVisit = {
            ...visit,
            currentIndex: nextIndex,
            status: isCompleted ? VISIT_STATUS_COMPLETED : VISIT_STATUS_IN_PROGRESS,
            lastOutcome: outcome,
            hintsRevealedCount: INITIAL_HINTS_REVEALED_COUNT,
        };
    } else {
        // Fallo: mantener índice, solo actualizar lastOutcome (G2)
        // hintsRevealedCount se preserva automáticamente via el spread operator
        updatedVisit = {
            ...visit,
            lastOutcome: outcome,
        };
    }

    return {
        visit: updatedVisit,
        skillState: updatedSkillState,
        outcome,
    };
}

/**
 * Baraja un array in-place (Fisher-Yates shuffle).
 * Usado para que las opciones de respuesta no sigan un patrón predecible.
 */
function shuffleArray<T>(array: readonly T[]): readonly T[] {
    const arr = [...array];
    for (let i = arr.length - SHUFFLE_START_FACTOR; i > SHUFFLE_ZERO_FACTOR; i--) {
        const j = Math.floor(Math.random() * (i + SHUFFLE_START_FACTOR));
        const current = arr[i];
        const swapped = arr[j];
        if (current === undefined || swapped === undefined) {
            continue;
        }
        arr[i] = swapped;
        arr[j] = current;
    }
    return arr;
}
