import { describe, it, expect } from 'vitest';
import { serialize } from '../../src/core/serialize';
import type { PlayerProgress } from '../../src/types';

describe('serialize', () => {
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

    it('should serialize valid PlayerProgress to JSON string', () => {
        const json = serialize(validData);
        expect(typeof json).toBe('string');
        expect(json.length).toBeGreaterThan(0);
    });

    it('should produce valid JSON (round-trip via JSON.parse)', () => {
        const json = serialize(validData);
        const parsed = JSON.parse(json);
        expect(parsed).toEqual(validData);
    });

    it('should preserve all fields in round-trip', () => {
        const json = serialize(validData);
        const parsed = JSON.parse(json);
        expect(parsed.version).toBe(1);
        expect(parsed.skills.counting.skillLevel).toBe(3);
        expect(parsed.destinations.moon.completed).toBe(true);
    });

    it('should handle empty skills and destinations', () => {
        const emptyData: PlayerProgress = {
            version: 1,
            skills: {},
            destinations: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
        };
        const json = serialize(emptyData);
        const parsed = JSON.parse(json);
        expect(parsed.skills).toEqual({});
        expect(parsed.destinations).toEqual({});
    });

    it('should handle multiple skills', () => {
        const multiSkillData: PlayerProgress = {
            version: 1,
            skills: {
                counting: { skillId: 'counting', skillLevel: 2, failureCount: 0, lastUpdateTime: '2026-08-21T10:30:45Z' },
                addition: { skillId: 'addition', skillLevel: 1, failureCount: 2, lastUpdateTime: '2026-08-21T10:30:45Z' },
            },
            destinations: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
        };
        const json = serialize(multiSkillData);
        const parsed = JSON.parse(json);
        expect(Object.keys(parsed.skills).length).toBe(2);
    });

    it('should throw error on circular references', () => {
        const circularData: Record<string, unknown> = {
            version: 1,
            skills: {},
            destinations: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
        };
        circularData.self = circularData; // Create circular reference

        expect(() => serialize(circularData as unknown as PlayerProgress)).toThrow();
    });

    it('should throw with descriptive error message', () => {
        const circularData: Record<string, unknown> = {
            version: 1,
            skills: {},
            destinations: {},
            lastSavedTime: '2026-08-21T10:30:45Z',
            self: null,
        };
        circularData.self = circularData;

        expect(() => serialize(circularData)).toThrow(/Failed to serialize PlayerProgress/);
    });
});
