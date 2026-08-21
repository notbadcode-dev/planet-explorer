import { describe, it, expect } from 'vitest';
import { validatePlayerProgress } from '../../src/core/validate';
import type { PlayerProgress } from '../../src/types';

describe('validatePlayerProgress', () => {
    const validData: PlayerProgress = {
        version: 1,
        skills: {
            counting: {
                skillId: 'counting',
                skillLevel: 3,
                failureCount: 1,
                lastUpdateTime: new Date().toISOString(),
            },
        },
        destinations: {
            moon: {
                destinationId: 'moon',
                completed: true,
                missionsCompleted: ['mission-1', 'mission-2'],
                lastVisitTime: new Date().toISOString(),
            },
        },
        lastSavedTime: new Date().toISOString(),
    };

    it('should validate correct PlayerProgress', () => {
        expect(validatePlayerProgress(validData)).toBe(true);
    });

    it('should reject null', () => {
        expect(validatePlayerProgress(null)).toBe(false);
    });

    it('should reject undefined', () => {
        expect(validatePlayerProgress(undefined)).toBe(false);
    });

    it('should reject array', () => {
        expect(validatePlayerProgress([])).toBe(false);
    });

    it('should reject missing version', () => {
        const data = { ...validData };
        delete (data as Record<string, unknown>).version;
        expect(validatePlayerProgress(data)).toBe(false);
    });

    it('should reject invalid version type', () => {
        expect(validatePlayerProgress({ ...validData, version: 'v1' } as unknown as PlayerProgress)).toBe(false);
    });

    it('should reject version < 1', () => {
        expect(validatePlayerProgress({ ...validData, version: 0 })).toBe(false);
    });

    it('should reject missing skills map', () => {
        const data = { ...validData };
        delete (data as Record<string, unknown>).skills;
        expect(validatePlayerProgress(data as unknown as PlayerProgress)).toBe(false);
    });

    it('should reject invalid skill type (string skillLevel)', () => {
        const invalidData = {
            ...validData,
            skills: {
                counting: {
                    ...validData.skills.counting,
                    skillLevel: '3' as unknown as number,
                },
            },
        };
        expect(validatePlayerProgress(invalidData)).toBe(false);
    });

    it('should reject invalid skill type (string completed)', () => {
        const invalidData = {
            ...validData,
            destinations: {
                moon: {
                    ...validData.destinations.moon,
                    completed: 'true' as unknown as boolean,
                },
            },
        };
        expect(validatePlayerProgress(invalidData)).toBe(false);
    });

    it('should reject missing destinations map', () => {
        const data = { ...validData };
        delete (data as Record<string, unknown>).destinations;
        expect(validatePlayerProgress(data as unknown as PlayerProgress)).toBe(false);
    });

    it('should reject invalid mission type (non-string in array)', () => {
        const invalidData = {
            ...validData,
            destinations: {
                moon: {
                    ...validData.destinations.moon,
                    missionsCompleted: ['mission-1', 123] as unknown as string[],
                },
            },
        };
        expect(validatePlayerProgress(invalidData)).toBe(false);
    });

    it('should accept empty skills map', () => {
        expect(validatePlayerProgress({ ...validData, skills: {} })).toBe(true);
    });

    it('should accept empty destinations map', () => {
        expect(validatePlayerProgress({ ...validData, destinations: {} })).toBe(true);
    });

    it('should reject invalid ISO date in lastSavedTime', () => {
        expect(validatePlayerProgress({ ...validData, lastSavedTime: 'invalid-date' } as unknown as PlayerProgress)).toBe(false);
    });

    it('should reject invalid ISO date in skill.lastUpdateTime', () => {
        expect(
            validatePlayerProgress({
                ...validData,
                skills: {
                    counting: { ...validData.skills.counting, lastUpdateTime: 'invalid' } as unknown as Record<string, unknown>,
                },
            } as unknown as PlayerProgress)
        ).toBe(false);
    });

    it('should allow version > 1 (for future migrations)', () => {
        expect(validatePlayerProgress({ ...validData, version: 2 })).toBe(true);
    });

    it('[SC-006] version field should be present in valid PlayerProgress', () => {
        // This is more of a semantic test for the spec
        const data = validatePlayerProgress(validData);
        expect(data).toBe(true);
    });

    it('should NOT validate out-of-range skillLevel (deferred to spec 030)', () => {
        // skillLevel -1 and 999 should pass structure validation
        expect(
            validatePlayerProgress({
                ...validData,
                skills: {
                    counting: { ...validData.skills.counting, skillLevel: -1 },
                },
            })
        ).toBe(true);

        expect(
            validatePlayerProgress({
                ...validData,
                skills: {
                    counting: { ...validData.skills.counting, skillLevel: 999 },
                },
            })
        ).toBe(true);
    });
});
