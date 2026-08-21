import type { StorageAdapter } from '../../src/types';

/**
 * Mock implementation of StorageAdapter for testing.
 * Uses in-memory Map instead of browser localStorage.
 * Enables all tests to run in Node.js without browser APIs.
 */
export class MockStorageAdapter implements StorageAdapter {
    private data: Map<string, string> = new Map();

    constructor(initialData?: Record<string, string>) {
        if (initialData) {
            Object.entries(initialData).forEach(([key, value]) => {
                this.data.set(key, value);
            });
        }
    }

    getItem(key: string): string | null {
        return this.data.get(key) ?? null;
    }

    setItem(key: string, value: string): void {
        this.data.set(key, value);
    }

    removeItem(key: string): void {
        this.data.delete(key);
    }

    clear(): void {
        this.data.clear();
    }
}
