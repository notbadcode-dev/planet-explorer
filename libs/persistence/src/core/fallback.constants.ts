/**
 * Constants for fallback.ts
 * Messages and default values for fallback strategy
 */

export const FALLBACK_VERSION = 1;

export const WARNING_MESSAGES = {
    NOT_OBJECT: 'PlayerProgress fallback: data is not an object, using clean state',
    INVALID_VERSION: 'PlayerProgress fallback: invalid or missing version, using 1',
    INVALID_SKILLS: 'PlayerProgress fallback: skills is not a map, using empty',
    INVALID_DESTINATIONS: 'PlayerProgress fallback: destinations is not a map, using empty',
    INVALID_TIME: 'PlayerProgress fallback: invalid or missing lastSavedTime, using now',
    INVALID_SKILL_ENTRY: 'PlayerProgress fallback: skill',
    INVALID_DESTINATION_ENTRY: 'PlayerProgress fallback: destination',
    IS_INVALID: 'is invalid, skipping',
} as const;
