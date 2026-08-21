import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LocalStorageAdapter } from '../../src/adapters/LocalStorageAdapter';

interface FakeLocalStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
}

function createFakeLocalStorage(): FakeLocalStorage {
    let store: Record<string, string> = {};

    return {
        getItem: (key) => (key in store ? store[key] : null),
        setItem: (key, value) => {
            store[key] = value;
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
}

describe('LocalStorageAdapter', () => {
    describe('when window/localStorage is unavailable', () => {
        // Fuerza `window` a `undefined` explícitamente en el global, en vez de
        // depender de que el entorno de test (node vs. happy-dom) no lo defina:
        // el gate real (`npm test`, raíz) corre con `environment: 'happy-dom'`,
        // que sí expone un `window.localStorage` funcional por defecto.
        beforeEach(() => {
            vi.stubGlobal('window', undefined);
        });

        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it('returns null from getItem and warns instead of throwing', () => {
            const adapter = new LocalStorageAdapter();
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

            expect(adapter.getItem('any-key')).toBeNull();
            expect(warnSpy).toHaveBeenCalledOnce();

            warnSpy.mockRestore();
        });

        it('no-ops on setItem and warns instead of throwing', () => {
            const adapter = new LocalStorageAdapter();
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

            expect(() => adapter.setItem('any-key', 'value')).not.toThrow();
            expect(warnSpy).toHaveBeenCalledOnce();

            warnSpy.mockRestore();
        });

        it('no-ops on removeItem and warns instead of throwing', () => {
            const adapter = new LocalStorageAdapter();
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

            expect(() => adapter.removeItem('any-key')).not.toThrow();
            expect(warnSpy).toHaveBeenCalledOnce();

            warnSpy.mockRestore();
        });

        it('no-ops on clear and warns instead of throwing', () => {
            const adapter = new LocalStorageAdapter();
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

            expect(() => adapter.clear()).not.toThrow();
            expect(warnSpy).toHaveBeenCalledOnce();

            warnSpy.mockRestore();
        });
    });

    describe('when window.localStorage is available', () => {
        let fakeLocalStorage: FakeLocalStorage;

        beforeEach(() => {
            fakeLocalStorage = createFakeLocalStorage();
            (globalThis as unknown as { window: unknown }).window = { localStorage: fakeLocalStorage };
        });

        afterEach(() => {
            delete (globalThis as unknown as { window?: unknown }).window;
        });

        it('gets, sets, removes and clears items via the real localStorage API', () => {
            const adapter = new LocalStorageAdapter();

            adapter.setItem('progress', 'value-1');
            expect(adapter.getItem('progress')).toBe('value-1');

            adapter.removeItem('progress');
            expect(adapter.getItem('progress')).toBeNull();

            adapter.setItem('progress', 'value-2');
            adapter.clear();
            expect(adapter.getItem('progress')).toBeNull();
        });

        it('recovers from a getItem failure by returning null and logging an error', () => {
            const adapter = new LocalStorageAdapter();
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            fakeLocalStorage.getItem = () => {
                throw new Error('boom');
            };

            expect(adapter.getItem('progress')).toBeNull();
            expect(errorSpy).toHaveBeenCalledOnce();

            errorSpy.mockRestore();
        });

        it('recovers from a setItem failure (e.g. quota exceeded) without throwing', () => {
            const adapter = new LocalStorageAdapter();
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            fakeLocalStorage.setItem = () => {
                throw new Error('quota-exceeded');
            };

            expect(() => adapter.setItem('progress', 'value')).not.toThrow();
            expect(errorSpy).toHaveBeenCalledOnce();

            errorSpy.mockRestore();
        });

        it('recovers from a removeItem failure without throwing', () => {
            const adapter = new LocalStorageAdapter();
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            fakeLocalStorage.removeItem = () => {
                throw new Error('boom');
            };

            expect(() => adapter.removeItem('progress')).not.toThrow();
            expect(errorSpy).toHaveBeenCalledOnce();

            errorSpy.mockRestore();
        });

        it('recovers from a clear failure without throwing', () => {
            const adapter = new LocalStorageAdapter();
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            fakeLocalStorage.clear = () => {
                throw new Error('boom');
            };

            expect(() => adapter.clear()).not.toThrow();
            expect(errorSpy).toHaveBeenCalledOnce();

            errorSpy.mockRestore();
        });
    });
});
