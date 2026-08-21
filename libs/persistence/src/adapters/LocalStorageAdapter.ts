import type { StorageAdapter } from '../types';
import { ERROR_MESSAGES, TEST_KEY } from './LocalStorageAdapter.constants';

/**
 * Production implementation of StorageAdapter using browser localStorage.
 * Used in actual game; MockStorageAdapter used in tests.
 *
 * Principle I (UX niño-céntrica): Gracefully handles unavailable localStorage
 * Principle VII (Separación): StorageAdapter interface enables transparent swapping
 */
export class LocalStorageAdapter implements StorageAdapter {
    private isAvailable: boolean;

    constructor() {
        this.isAvailable = this.checkAvailability();
    }

    private checkAvailability(): boolean {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return false;
            }
            window.localStorage.setItem(TEST_KEY, TEST_KEY);
            window.localStorage.removeItem(TEST_KEY);
            return true;
        } catch {
            // localStorage unavailable (quota exceeded, permissions, etc)
            return false;
        }
    }

    getItem(key: string): string | null {
        if (!this.isAvailable) {
            console.warn(`${ERROR_MESSAGES.STORAGE_UNAVAILABLE}, ${ERROR_MESSAGES.CANNOT_GET} ${key}`);
            return null;
        }

        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            console.error(`${ERROR_MESSAGES.GET_FAILED}: ${String(error)}`);
            return null;
        }
    }

    setItem(key: string, value: string): void {
        if (!this.isAvailable) {
            console.warn(`${ERROR_MESSAGES.STORAGE_UNAVAILABLE}, ${ERROR_MESSAGES.CANNOT_SET} ${key}`);
            return;
        }

        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            // Quota exceeded or other error
            console.error(`${ERROR_MESSAGES.SET_FAILED}: ${String(error)}`);
            // Fire-and-forget: game continues without saving
        }
    }

    removeItem(key: string): void {
        if (!this.isAvailable) {
            console.warn(`${ERROR_MESSAGES.STORAGE_UNAVAILABLE}, ${ERROR_MESSAGES.CANNOT_REMOVE} ${key}`);
            return;
        }

        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(`${ERROR_MESSAGES.REMOVE_FAILED}: ${String(error)}`);
        }
    }

    clear(): void {
        if (!this.isAvailable) {
            console.warn(`${ERROR_MESSAGES.STORAGE_UNAVAILABLE}, ${ERROR_MESSAGES.CANNOT_CLEAR}`);
            return;
        }

        try {
            window.localStorage.clear();
        } catch (error) {
            console.error(`${ERROR_MESSAGES.CLEAR_FAILED}: ${String(error)}`);
        }
    }
}
