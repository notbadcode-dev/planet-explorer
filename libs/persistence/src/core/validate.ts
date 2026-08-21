import type { PlayerProgress, SkillProgressMap, DestinationStateMap } from '../types';

/**
 * Validate PlayerProgress data structure.
 * Checks types and structure (NOT ranges — deferred to spec 030).
 * Returns true only if data is a valid PlayerProgress.
 */
export function validatePlayerProgress(data: unknown): data is PlayerProgress {
    if (!isObject(data)) return false;
    if (typeof data.version !== 'number' || data.version < 1) return false;
    if (!isValidSkillMap(data.skills)) return false;
    if (!isValidDestinationMap(data.destinations)) return false;
    if (!isValidISODate(data.lastSavedTime)) return false;
    return true;
}

function isValidSkillMap(skills: unknown): skills is SkillProgressMap {
    if (!isObject(skills)) return false;

    for (const [id, skill] of Object.entries(skills as Record<string, unknown>)) {
        if (typeof id !== 'string' || id.length === 0) return false;
        if (!isObject(skill)) return false;
        if (typeof skill.skillId !== 'string' || skill.skillId !== id) return false;
        if (typeof skill.skillLevel !== 'number') return false;
        if (typeof skill.failureCount !== 'number') return false;
        if (!isValidISODate(skill.lastUpdateTime)) return false;
    }

    return true;
}

function isValidDestinationMap(destinations: unknown): destinations is DestinationStateMap {
    if (!isObject(destinations)) return false;

    for (const [id, dest] of Object.entries(destinations as Record<string, unknown>)) {
        if (typeof id !== 'string' || id.length === 0) return false;
        if (!isObject(dest)) return false;
        if (typeof dest.destinationId !== 'string' || dest.destinationId !== id) return false;
        if (typeof dest.completed !== 'boolean') return false;
        if (!Array.isArray(dest.missionsCompleted)) return false;
        if (!dest.missionsCompleted.every((m: string | unknown) => typeof m === 'string')) return false;
        if (!isValidISODate(dest.lastVisitTime)) return false;
    }

    return true;
}

function isValidISODate(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
