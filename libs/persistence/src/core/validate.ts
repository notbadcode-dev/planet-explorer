import type { PlayerProgress, SkillProgressMap, DestinationStateMap } from '../types';
import { EMPTY_LENGTH, MIN_VERSION, TYPE_BOOLEAN, TYPE_NUMBER, TYPE_OBJECT, TYPE_STRING } from './validate.constants';

/**
 * Validate PlayerProgress data structure.
 * Checks types and structure (NOT ranges — deferred to spec 030).
 * Returns true only if data is a valid PlayerProgress.
 */
export function validatePlayerProgress(data: unknown): data is PlayerProgress {
    if (!isObject(data)) return false;
    if (!isNumber(data.version) || data.version < MIN_VERSION) return false;
    if (!isValidSkillMap(data.skills)) return false;
    if (!isValidDestinationMap(data.destinations)) return false;
    if (!isValidISODate(data.lastSavedTime)) return false;
    return true;
}

function isValidSkillMap(skills: unknown): skills is SkillProgressMap {
    if (!isObject(skills)) return false;

    for (const [id, skill] of Object.entries(skills as Record<string, unknown>)) {
        if (typeof id !== TYPE_STRING || id.length === EMPTY_LENGTH) return false;
        if (!isObject(skill)) return false;
        if (typeof skill.skillId !== TYPE_STRING || skill.skillId !== id) return false;
        if (typeof skill.skillLevel !== TYPE_NUMBER) return false;
        if (typeof skill.failureCount !== TYPE_NUMBER) return false;
        if (!isValidISODate(skill.lastUpdateTime)) return false;
    }

    return true;
}

function isValidDestinationMap(destinations: unknown): destinations is DestinationStateMap {
    if (!isObject(destinations)) return false;

    for (const [id, dest] of Object.entries(destinations as Record<string, unknown>)) {
        if (typeof id !== TYPE_STRING || id.length === EMPTY_LENGTH) return false;
        if (!isObject(dest) || !Array.isArray(dest.missionsCompleted)) return false;
        if (typeof dest.destinationId !== TYPE_STRING || dest.destinationId !== id) return false;
        if (typeof dest.completed !== TYPE_BOOLEAN) return false;
        if (!dest.missionsCompleted.every((m: string | unknown) => typeof m === TYPE_STRING)) return false;
        if (!isValidISODate(dest.lastVisitTime)) return false;
    }

    return true;
}

function isValidISODate(value: unknown): boolean {
    if (!isString(value)) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
}

function isNumber(value: unknown): value is number {
    return typeof value === TYPE_NUMBER;
}

function isString(value: unknown): value is string {
    return typeof value === TYPE_STRING;
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === TYPE_OBJECT && value !== null && !Array.isArray(value);
}
