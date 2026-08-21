import { describe, it, expect } from 'vitest';
import { deserialize } from '../../src/core/deserialize';
import { serialize } from '../../src/core/serialize';
import type { PlayerProgress } from '../../src/types';

describe('deserialize', () => {
    const validData: PlayerProgress = {
        version: 1,
        skills: {
            counting: {
                skillId: 'counting',
                skillLevel: 3,
                failureCount: 1,
                lastUpdateTime: '2026-08-21T10:30:45Z',
            },
        },
        destinations: {
            moon: {
                destinationId: 'moon',
                completed: true,
                missionsCompleted: ['mission-1'],
                lastVisitTime: '2026-08-21T10:25:00Z',
            },
        },
        lastSavedTime: '2026-08-21T10:30:45Z',
    };

    it('should deserialize valid JSON to PlayerProgress', () => {
        const json = serialize(validData);
        const result = deserialize(json);
        expect(result).toEqual(validData);
    });

    it('should handle null input (empty storage)', () => {
        const result = deserialize(null);
        expect(result.version).toBe(1);
        expect(result.skills).toEqual({});
        expect(result.destinations).toEqual({});
    });

    it('should handle empty string', () => {
        const result = deserialize('');
        expect(result.version).toBe(1);
    });

    it('should recover from malformed JSON', () => {
        const result = deserialize('{ invalid json }');
        expect(result.version).toBe(1);
        expect(result.skills).toEqual({});
    });

    it('should never throw error', () => {
        expect(() => deserialize('garbage data')).not.toThrow();
        expect(() => deserialize('null')).not.toThrow();
        expect(() => deserialize('{}' )).not.toThrow();
    });

    it('should apply fallback on validation failure', () => {
        const invalidData = {
            version: 1,
            skills: {
                counting: {
                    skillId: 'counting',
                    skillLevel: 'three', // Invalid: string instead of number
                },
            },
            destinations: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
        };
        const json = JSON.stringify(invalidData);
        const result = deserialize(json);
        // Fallback should return clean state
        expect(result.version).toBe(1);
        expect(result.skills).toEqual({}); // Invalid skill was skipped
    });

    it('should preserve valid entries and skip invalid ones', () => {
        const mixedData = {
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
                    skillLevel: 'invalid', // Invalid
                },
            },
            destinations: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
        };
        const json = JSON.stringify(mixedData);
        const result = deserialize(json);
        // Valid skill preserved, invalid skill skipped
        expect(result.skills.counting).toEqual(mixedData.skills.counting);
        expect(result.skills.addition).toBeUndefined();
    });

    it('should round-trip: serialize → deserialize → serialize should be identical', () => {
        const json1 = serialize(validData);
        const deserialized = deserialize(json1);
        const json2 = serialize(deserialized);
        expect(json1).toBe(json2);
    });

    it('should handle missing version field and use default 1', () => {
        const data = {
            skills: {},
            destinations: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
        };
        const json = JSON.stringify(data);
        const result = deserialize(json);
        expect(result.version).toBe(1);
    });

    it('should handle missing lastSavedTime and create new one', () => {
        const data = {
            version: 1,
            skills: {},
            destinations: {},
        };
        const json = JSON.stringify(data);
        const result = deserialize(json);
        expect(typeof result.lastSavedTime).toBe('string');
        expect(new Date(result.lastSavedTime).getTime()).toBeGreaterThan(0);
    });

    it('should handle null JSON string "null"', () => {
        const result = deserialize('null');
        expect(result.version).toBe(1);
        expect(result.skills).toEqual({});
    });

    it('should handle JSON empty object {}', () => {
        const result = deserialize('{}');
        expect(result.version).toBe(1);
        expect(result.skills).toEqual({});
        expect(result.destinations).toEqual({});
    });
});
