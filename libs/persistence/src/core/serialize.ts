import type { PlayerProgress } from '../types';

/**
 * Serialize PlayerProgress to JSON string.
 * Throws descriptive error if serialization fails.
 */
export function serialize(progress: PlayerProgress): string {
    try {
        const json = JSON.stringify(progress);
        if (typeof json !== 'string') {
            throw new Error('Serialization did not produce a string');
        }
        return json;
    } catch (error) {
        throw new Error(`Failed to serialize PlayerProgress: ${String(error)}`, { cause: error });
    }
}
