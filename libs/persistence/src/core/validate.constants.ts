/**
 * Constants for validate.ts
 * Runtime type-string literals and numeric bounds used for structural validation.
 */

export const TYPE_STRING = 'string' as const;
export const TYPE_NUMBER = 'number' as const;
export const TYPE_BOOLEAN = 'boolean' as const;
export const TYPE_OBJECT = 'object' as const;

export const MIN_VERSION = 1;
export const EMPTY_LENGTH = 0;
