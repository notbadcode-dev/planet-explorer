import { describe, it, expect } from 'vitest';
import { applyFallback } from '../../src/core/fallback';

describe('applyFallback', () => {
    it('should return clean state on null input', () => {
        const result = applyFallback(null);
        expect(result.version).toBe(1);
        expect(result.skills).toEqual({});
        expect(result.destinations).toEqual({});
    });

    it('should return clean state on undefined input', () => {
        const result = applyFallback(undefined);
        expect(result.version).toBe(1);
    });

    it('should return clean state on non-object input', () => {
        expect(applyFallback('string').version).toBe(1);
        expect(applyFallback(123).version).toBe(1);
        expect(applyFallback([])).toEqual(
            expect.objectContaining({ version: 1, skills: {}, destinations: {} })
        );
    });

    it('should preserve valid version field', () => {
        const result = applyFallback({ version: 2, skills: {}, destinations: {}, lastSavedTime: '2026-08-21T10:30:45Z' });
        expect(result.version).toBe(2);
    });

    it('should use default version 1 if invalid', () => {
        expect(applyFallback({ version: 0 }).version).toBe(1);
        expect(applyFallback({ version: -1 }).version).toBe(1);
        expect(applyFallback({ version: 'v1' }).version).toBe(1);
    });

    it('should restore valid skills and skip invalid ones', () => {
        const data = {
            skills: {
                counting: {
                    skillId: 'counting',
                    skillLevel: 3,
                    failureCount: 1,
                    lastUpdateTime: '2026-08-21T10:30:45Z',
                },
                addition: {
                    skillId: 'addition',
                    skillLevel: 'invalid', // Missing failureCount, invalid lastUpdateTime
                },
            },
            destinations: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
        };
        const result = applyFallback(data);
        expect(result.skills.counting).toEqual(data.skills.counting);
        expect(result.skills.addition).toBeUndefined();
    });

    it('should restore valid destinations and skip invalid ones', () => {
        const data = {
            skills: {},
            destinations: {
                moon: {
                    destinationId: 'moon',
                    completed: true,
                    missionsCompleted: ['mission-1'],
                    lastVisitTime: '2026-08-21T10:25:00Z',
                },
                mars: {
                    destinationId: 'mars',
                    completed: 'true', // Invalid: string instead of boolean
                },
            },
            lastSavedTime: '2026-08-21T10:30:45Z',
        };
        const result = applyFallback(data);
        expect(result.destinations.moon).toEqual(data.destinations.moon);
        expect(result.destinations.mars).toBeUndefined();
    });

    it('should handle empty skills and destinations maps', () => {
        const result = applyFallback({ skills: {}, destinations: {}, version: 1, lastSavedTime: '2026-08-21T10:30:45Z' });
        expect(result.skills).toEqual({});
        expect(result.destinations).toEqual({});
    });

    it('should create fresh lastSavedTime if missing', () => {
        const result = applyFallback({ skills: {}, destinations: {} });
        expect(typeof result.lastSavedTime).toBe('string');
        expect(new Date(result.lastSavedTime).getTime()).toBeGreaterThan(0);
    });

    it('should preserve valid lastSavedTime', () => {
        const validTime = '2026-08-20T15:00:00Z';
        const result = applyFallback({ skills: {}, destinations: {}, lastSavedTime: validTime });
        expect(result.lastSavedTime).toBe(validTime);
    });

    it('should use default lastSavedTime if invalid ISO date', () => {
        const result = applyFallback({ skills: {}, destinations: {}, lastSavedTime: 'invalid-date' });
        expect(typeof result.lastSavedTime).toBe('string');
        expect(/^\d{4}-\d{2}-\d{2}T/.test(result.lastSavedTime)).toBe(true); // ISO8601 format
    });

    it('should handle missing skills field', () => {
        const result = applyFallback({ destinations: {}, version: 1, lastSavedTime: '2026-08-21T10:30:45Z' });
        expect(result.skills).toEqual({});
    });

    it('should handle missing destinations field', () => {
        const result = applyFallback({ skills: {}, version: 1, lastSavedTime: '2026-08-21T10:30:45Z' });
        expect(result.destinations).toEqual({});
    });

    it('should handle non-object skills field', () => {
        const result = applyFallback({
            skills: 'not-a-map',
            destinations: {},
            version: 1,
            lastSavedTime: '2026-08-21T10:30:45Z',
        } as unknown);
        expect(result.skills).toEqual({});
    });

    it('should handle missions array validation', () => {
        const data = {
            destinations: {
                moon: {
                    destinationId: 'moon',
                    completed: true,
                    missionsCompleted: ['mission-1', 123], // Invalid: number in array
                    lastVisitTime: '2026-08-21T10:25:00Z',
                },
            },
            skills: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
        };
        const result = applyFallback(data);
        // Invalid destination should be skipped
        expect(result.destinations.moon).toBeUndefined();
    });

    it('should accept new fields in future versions (extensible)', () => {
        const data = {
            version: 1,
            skills: {},
            destinations: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
            playerName: 'Alice', // Future field from spec 012
        } as unknown;
        const result = applyFallback(data);
        // Fallback should not crash on unknown fields
        expect(result.version).toBe(1);
    });
});
