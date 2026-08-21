import type { PlayerProgress } from '../types';
import { ERROR_MESSAGES, TYPE_STRING } from './serialize.constants';

/**
 * Serialize PlayerProgress to JSON string.
 * Throws descriptive error if serialization fails.
 */
export function serialize(progress: PlayerProgress): string {
    try {
        const json = JSON.stringify(progress);
        if (typeof json !== TYPE_STRING) {
            throw new Error(ERROR_MESSAGES.NOT_A_STRING);
        }
        return json;
    } catch (error) {
        throw new Error(ERROR_MESSAGES.SERIALIZE_FAILED_PREFIX + String(error), { cause: error });
    }
}
