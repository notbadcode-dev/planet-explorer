import type { PlayerProgress } from '../types';

/**
 * Create initial clean state for first session.
 * Returns PlayerProgress with no prior data (empty skills/destinations).
 * No assumptions about what skills or destinations exist in the game.
 */
export function createInitialState(): PlayerProgress {
    return {
        version: 1,
        skills: {},
        destinations: {},
        lastSavedTime: new Date().toISOString(),
    };
}
