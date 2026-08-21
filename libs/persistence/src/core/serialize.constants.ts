/**
 * Constants for serialize.ts
 * Error messages and runtime type-string literal.
 */

export const TYPE_STRING = 'string' as const;

export const ERROR_MESSAGES = {
    NOT_A_STRING: 'Serialization did not produce a string',
    SERIALIZE_FAILED_PREFIX: 'Failed to serialize PlayerProgress: ',
} as const;
