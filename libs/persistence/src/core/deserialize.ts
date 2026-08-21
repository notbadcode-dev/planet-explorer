import type { PlayerProgress } from '../types';
import { validatePlayerProgress } from './validate';
import { applyFallback } from './fallback';
import { COLON_SPACE, ERROR_MESSAGES } from './deserialize.constants';

/**
 * Deserialize JSON string to PlayerProgress.
 * Returns valid PlayerProgress or applies permissive fallback.
 * Never throws — always returns a valid PlayerProgress.
 */
export function deserialize(jsonString: string | null): PlayerProgress {
    if (!jsonString) {
        return applyFallback(null);
    }

    let data: unknown;
    try {
        data = JSON.parse(jsonString);
    } catch (error) {
    // JSON parsing failed — apply fallback
        console.error(`${ERROR_MESSAGES.PARSE_FAILED}${COLON_SPACE}${String(error)}`);
        return applyFallback(null);
    }

    if (validatePlayerProgress(data)) {
        return data;
    }

    // Validation failed — apply fallback with partial data
    console.warn(ERROR_MESSAGES.VALIDATION_FAILED);
    return applyFallback(data);
}
