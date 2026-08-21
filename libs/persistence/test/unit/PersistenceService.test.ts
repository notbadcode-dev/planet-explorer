import { describe, it, expect, vi } from 'vitest';
import { PersistenceService } from '../../src/integration/PersistenceService';
import { MockStorageAdapter } from '../fixtures/MockStorageAdapter';
import { createInitialState } from '../../src/core/initialState';
import type { StorageAdapter } from '../../src/types';

describe('PersistenceService error recovery (fire-and-forget)', () => {
    it('save() logs an error and does not throw when the adapter fails to set the item', () => {
        const adapter = new MockStorageAdapter();
        vi.spyOn(adapter, 'setItem').mockImplementation(() => {
            throw new Error('quota-exceeded');
        });
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const service = new PersistenceService(adapter);

        expect(() => service.save(createInitialState())).not.toThrow();
        expect(errorSpy).toHaveBeenCalledOnce();

        errorSpy.mockRestore();
    });

    it('save() logs an error and does not throw when serialization fails', () => {
        const adapter = new MockStorageAdapter();
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const service = new PersistenceService(adapter);
        // A circular reference makes JSON.stringify throw inside serialize().
        const circular: Record<string, unknown> = {};
        circular.self = circular;

        expect(() => service.save(circular as never)).not.toThrow();
        expect(errorSpy).toHaveBeenCalledOnce();

        errorSpy.mockRestore();
    });

    it('clear() logs an error and does not throw when the adapter fails to remove the item', () => {
        const brokenAdapter: StorageAdapter = {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => {
                throw new Error('boom');
            },
            clear: () => undefined,
        };
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const service = new PersistenceService(brokenAdapter);

        expect(() => service.clear()).not.toThrow();
        expect(errorSpy).toHaveBeenCalledOnce();

        errorSpy.mockRestore();
    });
});
