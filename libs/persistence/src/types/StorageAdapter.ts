/**
 * Abstract interface for storage backend.
 * Allows localStorage implementations to be mocked in tests without browser APIs.
 * Matches browser localStorage API surface.
 */
export interface StorageAdapter {
  /**
   * Get value from storage by key.
   * Returns null if key not found.
   */
  getItem(key: string): string | null;

  /**
   * Set key-value pair in storage.
   * Overwrites existing value if key already exists.
   */
  setItem(key: string, value: string): void;

  /**
   * Remove key from storage.
   * No-op if key doesn't exist.
   */
  removeItem(key: string): void;

  /**
   * Clear all key-value pairs from storage.
   */
  clear(): void;
}
