/**
 * Schema versioning utilities.
 * Supports future migrations when data structure changes (specs 012, 030, etc).
 *
 * Current: Version 1 (skills map, destinations map)
 * Future v2: Add playerName field (spec 012)
 * Future v3: Add encryption key (spec 030)
 */

import { CURRENT_VERSION, TYPE_NUMBER, TYPE_OBJECT, WARNING_MESSAGES } from './versioning.constants';

/**
 * Detect version of saved data.
 * Returns version number from data, or null if unversioned.
 */
export function detectVersion(data: unknown): number | null {
    if (typeof data === TYPE_OBJECT && data !== null && !Array.isArray(data)) {
        const version = (data as Record<string, unknown>).version;
        if (typeof version === TYPE_NUMBER) {
            return version;
        }
    }
    return null;
}

/**
 * Migrate data from older version to current version.
 * Currently only v1 → v1 (no migrations yet).
 * As future versions are added, add migration logic here.
 *
 * Example (future):
 * if (fromVersion === 1) {
 *   return migrateV1toV2(data);
 * }
 */
export function migrateToCurrentVersion(data: unknown, fromVersion: number): Record<string, unknown> {
    // V1 is current; no migrations yet
    if (fromVersion === CURRENT_VERSION) {
        return data;
    }

    if (fromVersion > CURRENT_VERSION) {
        console.warn(WARNING_MESSAGES.NEWER_VERSION_PREFIX + fromVersion + WARNING_MESSAGES.NEWER_VERSION_MIDDLE + CURRENT_VERSION + WARNING_MESSAGES.NEWER_VERSION_SUFFIX);
        return data;
    }

    // Future: Add migration logic as new versions are defined
    // if (fromVersion === 1) return migrateV1toV2(data);

    console.warn(WARNING_MESSAGES.MIGRATION_NOT_IMPLEMENTED_PREFIX + fromVersion + WARNING_MESSAGES.MIGRATION_NOT_IMPLEMENTED_SUFFIX);
    return data;
}

/**
 * Get current schema version.
 */
export function getCurrentVersion(): number {
    return CURRENT_VERSION;
}

/**
 * Schema documentation (for future reference).
 *
 * Version 1 (Current):
 * {
 *   version: 1,
 *   skills: { skillId: { skillId, skillLevel, failureCount, lastUpdateTime } },
 *   destinations: { destId: { destinationId, completed, missionsCompleted[], lastVisitTime } },
 *   lastSavedTime: ISO8601
 * }
 *
 * Version 2 (Planned - Spec 012: Player Name):
 * Extends v1 with playerName field at root level
 *
 * Version 3 (Planned - Spec 030: Encryption):
 * Adds encryptionKey field, encrypts sensitive data
 */
