import type { StorageAdapter, PlayerProgress } from '../types';
import { serialize } from '../core/serialize';
import { deserialize } from '../core/deserialize';
import { updateSaveTimestamp } from '../core/factories';

const STORAGE_KEY = 'planet-explorer:progress';

/**
 * PersistenceService: Main API for loading/saving player progress.
 * Wraps StorageAdapter to provide high-level load() and save() methods.
 * save() is fire-and-forget (async non-blocking, no awaited promises).
 */
export class PersistenceService {
    private adapter: StorageAdapter;

    constructor(adapter: StorageAdapter) {
        this.adapter = adapter;
    }

    /**
   * Load PlayerProgress from storage.
   * Returns valid PlayerProgress (never throws).
   * On first session (empty storage): returns clean state.
   * On corrupted data: applies permissive fallback.
   */
    load(): PlayerProgress {
        const jsonString = this.adapter.getItem(STORAGE_KEY);
        return deserialize(jsonString);
    }

    /**
   * Save PlayerProgress to storage.
   * Fire-and-forget: logs errors but never throws.
   * Updates lastSavedTime before serializing.
   */
    save(progress: PlayerProgress): void {
        try {
            const withTimestamp = updateSaveTimestamp(progress);
            const jsonString = serialize(withTimestamp);
            this.adapter.setItem(STORAGE_KEY, jsonString);
        } catch (error) {
            // Fire-and-forget: log error but don't throw
            // Game continues; recovery on next event
            console.error(`Failed to save PlayerProgress: ${String(error)}`);
        }
    }

    /**
   * Clear all progress from storage.
   * Used for testing or if user deletes data.
   */
    clear(): void {
        try {
            this.adapter.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error(`Failed to clear PlayerProgress: ${String(error)}`);
        }
    }
}
