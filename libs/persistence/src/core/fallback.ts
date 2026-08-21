import type { PlayerProgress, SkillProgress, DestinationState, SkillProgressMap, DestinationStateMap } from '../types';
import { FALLBACK_VERSION, WARNING_MESSAGES } from './fallback.constants';

/**
 * Apply permissive fallback strategy.
 * Restores valid fields, fills missing/invalid with defaults.
 * Never throws — always returns valid PlayerProgress.
 * Logs warnings for each recovery action.
 */
export function applyFallback(data: unknown): PlayerProgress {
    const result: PlayerProgress = {
        version: FALLBACK_VERSION,
        skills: {},
        destinations: {},
        lastSavedTime: new Date().toISOString(),
    };

    if (!isObject(data)) {
        console.warn(WARNING_MESSAGES.NOT_OBJECT);
        return result;
    }

    // Try to restore version
    if (typeof data.version === 'number' && data.version >= 1) {
        result.version = data.version;
    } else {
        console.warn(WARNING_MESSAGES.INVALID_VERSION);
    }

    // Try to restore skills (permissive: only valid entries)
    if (isObject(data.skills)) {
        result.skills = restoreValidSkillMap(data.skills);
    } else {
        console.warn(WARNING_MESSAGES.INVALID_SKILLS);
    }

    // Try to restore destinations (permissive: only valid entries)
    if (isObject(data.destinations)) {
        result.destinations = restoreValidDestinationMap(data.destinations);
    } else {
        console.warn(WARNING_MESSAGES.INVALID_DESTINATIONS);
    }

    // Try to restore lastSavedTime
    if (typeof data.lastSavedTime === 'string' && isValidISODate(data.lastSavedTime)) {
        result.lastSavedTime = data.lastSavedTime;
    } else {
        console.warn(WARNING_MESSAGES.INVALID_TIME);
        result.lastSavedTime = new Date().toISOString();
    }

    return result;
}

function restoreValidSkillMap(skills: Record<string, unknown>): SkillProgressMap {
    const validSkills: SkillProgressMap = {};

    for (const [id, skill] of Object.entries(skills)) {
        if (isValidSkill(skill, id)) {
            validSkills[id] = skill as SkillProgress;
        } else {
            console.warn(`${WARNING_MESSAGES.INVALID_SKILL_ENTRY} '${id}' ${WARNING_MESSAGES.IS_INVALID}`);
        }
    }

    return validSkills;
}

function isValidSkill(skill: unknown, expectedId: string): skill is SkillProgress {
    return (
        isObject(skill) &&
    typeof skill.skillId === 'string' &&
    skill.skillId === expectedId &&
    typeof skill.skillLevel === 'number' &&
    typeof skill.failureCount === 'number' &&
    typeof skill.lastUpdateTime === 'string' &&
    isValidISODate(skill.lastUpdateTime)
    );
}

function restoreValidDestinationMap(destinations: Record<string, unknown>): DestinationStateMap {
    const validDestinations: DestinationStateMap = {};

    for (const [id, dest] of Object.entries(destinations)) {
        if (isValidDestination(dest, id)) {
            validDestinations[id] = dest as DestinationState;
        } else {
            console.warn(`${WARNING_MESSAGES.INVALID_DESTINATION_ENTRY} '${id}' ${WARNING_MESSAGES.IS_INVALID}`);
        }
    }

    return validDestinations;
}

function isValidDestination(dest: unknown, expectedId: string): dest is DestinationState {
    return (
        isObject(dest) &&
    typeof dest.destinationId === 'string' &&
    dest.destinationId === expectedId &&
    typeof dest.completed === 'boolean' &&
    Array.isArray(dest.missionsCompleted) &&
    dest.missionsCompleted.every((m: string | unknown) => typeof m === 'string') &&
    typeof dest.lastVisitTime === 'string' &&
    isValidISODate(dest.lastVisitTime)
    );
}

function isValidISODate(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
