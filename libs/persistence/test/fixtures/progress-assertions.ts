import type { DestinationState, PlayerProgress, SkillProgress } from '../../src/types';
import {
    DESTINATION_NOT_FOUND_PREFIX,
    DESTINATION_NOT_FOUND_SUFFIX,
    SKILL_NOT_FOUND_PREFIX,
    SKILL_NOT_FOUND_SUFFIX,
} from './progress-assertions.constants';

/**
 * Accede a `progress.skills[skillId]` con garantía de presencia para tests.
 *
 * `SkillProgressMap` es un `Record<string, SkillProgress>`; con
 * `noUncheckedIndexedAccess` cualquier acceso (incluida la notación de punto
 * sobre un tipo de índice) es `SkillProgress | undefined`. Los tests conocen
 * de antemano qué claves existen (las acaban de guardar), así que en vez de
 * silenciar el tipo con `!` se falla rápido y con contexto si la clave
 * esperada no está presente.
 */
export function requireSkill(progress: PlayerProgress, skillId: string): SkillProgress {
    const skill = progress.skills[skillId];
    if (!skill) {
        throw new Error(SKILL_NOT_FOUND_PREFIX + skillId + SKILL_NOT_FOUND_SUFFIX);
    }
    return skill;
}

/**
 * Accede a `progress.destinations[destinationId]` con garantía de presencia
 * para tests. Ver `requireSkill` para la justificación del patrón.
 */
export function requireDestination(progress: PlayerProgress, destinationId: string): DestinationState {
    const destination = progress.destinations[destinationId];
    if (!destination) {
        throw new Error(DESTINATION_NOT_FOUND_PREFIX + destinationId + DESTINATION_NOT_FOUND_SUFFIX);
    }
    return destination;
}
