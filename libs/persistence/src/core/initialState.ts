import type { PlayerProgress } from '../types';
import { INITIAL_VERSION } from './initialState.constants';

/**
 * Create initial clean state for first session.
 * Returns PlayerProgress with no prior data (empty skills/destinations).
 * No assumptions about what skills or destinations exist in the game.
 */
export function createInitialState(): PlayerProgress {
    return {
        version: INITIAL_VERSION,
        skills: {},
        destinations: {},
        lastSavedTime: new Date().toISOString(),
    };
}
