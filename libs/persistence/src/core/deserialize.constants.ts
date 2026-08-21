/**
 * Constants for deserialize.ts
 * Error messages and logging strings
 */

export const COLON_SPACE = ': ';

export const ERROR_MESSAGES = {
    PARSE_FAILED: 'Failed to parse PlayerProgress JSON',
    VALIDATION_FAILED: 'PlayerProgress validation failed, applying permissive fallback',
} as const;
