/**
 * Constants for PersistenceService.ts
 * Storage key and error messages.
 */

export const STORAGE_KEY = 'planet-explorer:progress';

export const ERROR_MESSAGES = {
    SAVE_FAILED_PREFIX: 'Failed to save PlayerProgress: ',
    CLEAR_FAILED_PREFIX: 'Failed to clear PlayerProgress: ',
} as const;
