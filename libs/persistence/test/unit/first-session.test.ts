import { describe, it, expect } from 'vitest';
import { PersistenceService } from '../../src/integration/PersistenceService';
import { MockStorageAdapter } from '../fixtures/MockStorageAdapter';

describe('User Story 1: First Session Load (FR-001, FR-002)', () => {
    it('[US1] should load clean state on empty storage (first session)', () => {
        const adapter = new MockStorageAdapter();
        const service = new PersistenceService(adapter);

        const progress = service.load();

        expect(progress.version).toBe(1);
        expect(progress.skills).toEqual({});
        expect(progress.destinations).toEqual({});
        expect(typeof progress.lastSavedTime).toBe('string');
    });

    it('[US1] should NOT throw on corrupted data', () => {
        const adapter = new MockStorageAdapter({ 'planet-explorer:progress': 'corrupted {json' });
        const service = new PersistenceService(adapter);

        expect(() => service.load()).not.toThrow();

        const progress = service.load();
        expect(progress.version).toBe(1);
    });

    it('[US1] should recover valid data and skip invalid fields', () => {
        const corruptedData = {
            version: 1,
            skills: {
                counting: {
                    skillId: 'counting',
                    skillLevel: 3,
                    failureCount: 1,
                    lastUpdateTime: '2026-08-21T10:30:45Z',
                },
                addition: {
                    skillId: 'addition',
                    skillLevel: 'invalid', // Corrupted
                },
            },
            destinations: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
        };
        const adapter = new MockStorageAdapter({
            'planet-explorer:progress': JSON.stringify(corruptedData),
        });
        const service = new PersistenceService(adapter);

        const progress = service.load();
        expect(progress.skills.counting).toBeDefined();
        expect(progress.skills.addition).toBeUndefined();
    });

    it('[SC-003] should NOT crash application on corrupted data', () => {
        const adapter = new MockStorageAdapter({
            'planet-explorer:progress': JSON.stringify({
                invalid: 'structure',
                data: null,
            }),
        });
        const service = new PersistenceService(adapter);

        // This should not throw and should return valid state
        const progress = service.load();
        expect(progress.version).toBe(1);
        expect(progress.skills).toEqual({});
    });
});
