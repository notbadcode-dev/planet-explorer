import type { PlayerProgress, SkillProgress, DestinationState } from '../types';
import { DEFAULT_SKILL_LEVEL, DEFAULT_FAILURE_COUNT, DEFAULT_COMPLETED, DEFAULT_MISSIONS } from './factories.constants';

/**
 * Factory: Create SkillProgress for a new skill.
 */
export function createSkillProgress(
    skillId: string,
    level: number = DEFAULT_SKILL_LEVEL,
    failureCount: number = DEFAULT_FAILURE_COUNT
): SkillProgress {
    return {
        skillId,
        skillLevel: level,
        failureCount,
        lastUpdateTime: new Date().toISOString(),
    };
}

/**
 * Factory: Create DestinationState for a new destination.
 */
export function createDestinationState(
    destinationId: string,
    completed: boolean = DEFAULT_COMPLETED
): DestinationState {
    return {
        destinationId,
        completed,
        missionsCompleted: [...DEFAULT_MISSIONS],
        lastVisitTime: new Date().toISOString(),
    };
}

/**
 * Update skill level in PlayerProgress.
 * Returns new PlayerProgress with updated skill (immutable).
 */
export function updateSkillLevel(
    progress: PlayerProgress,
    skillId: string,
    newLevel: number
): PlayerProgress {
    return {
        ...progress,
        skills: {
            ...progress.skills,
            [skillId]: {
                ...( progress.skills[skillId] || createSkillProgress(skillId)),
                skillLevel: newLevel,
                lastUpdateTime: new Date().toISOString(),
            },
        },
    };
}

/**
 * Add mission completion to destination.
 * Returns new PlayerProgress with updated destination (immutable).
 */
export function addMissionToDestination(
    progress: PlayerProgress,
    destinationId: string,
    missionId: string
): PlayerProgress {
    const existing = progress.destinations[destinationId];
    const missions = existing?.missionsCompleted || [];

    return {
        ...progress,
        destinations: {
            ...progress.destinations,
            [destinationId]: {
                ...(existing || createDestinationState(destinationId)),
                missionsCompleted: Array.from(new Set([...missions, missionId])), // Dedup
                lastVisitTime: new Date().toISOString(),
            },
        },
    };
}

/**
 * Mark destination as completed.
 * Returns new PlayerProgress with completed destination (immutable).
 */
export function completeDestination(
    progress: PlayerProgress,
    destinationId: string
): PlayerProgress {
    return {
        ...progress,
        destinations: {
            ...progress.destinations,
            [destinationId]: {
                ...(progress.destinations[destinationId] || createDestinationState(destinationId)),
                completed: true,
                lastVisitTime: new Date().toISOString(),
            },
        },
    };
}

/**
 * Update lastSavedTime to now.
 * Returns new PlayerProgress with updated timestamp (immutable).
 */
export function updateSaveTimestamp(progress: PlayerProgress): PlayerProgress {
    return {
        ...progress,
        lastSavedTime: new Date().toISOString(),
    };
}
