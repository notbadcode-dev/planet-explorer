/**
 * Constants for versioning.ts
 * Runtime type-string literals, current schema version, and warning messages.
 */

export const TYPE_OBJECT = 'object' as const;
export const TYPE_NUMBER = 'number' as const;

export const CURRENT_VERSION = 1;

export const WARNING_MESSAGES = {
    NEWER_VERSION_PREFIX: 'PlayerProgress version ',
    NEWER_VERSION_MIDDLE: ' is newer than supported ',
    NEWER_VERSION_SUFFIX: '. Some features may not work.',
    MIGRATION_NOT_IMPLEMENTED_PREFIX: 'PlayerProgress version ',
    MIGRATION_NOT_IMPLEMENTED_SUFFIX: ' migration not implemented. Using data as-is.',
} as const;
