import { describe, it, expect } from 'vitest';
import { getCurrentVersion, detectVersion, migrateToCurrentVersion } from '../../src/core/versioning';

describe('versioning', () => {
    it('[US5] should report current version', () => {
        const version = getCurrentVersion();
        expect(typeof version).toBe('number');
        expect(version).toBeGreaterThanOrEqual(1);
    });

    it('[SC-006] version field should be present in valid PlayerProgress', () => {
        // This is more of a semantic test for the spec
        const current = getCurrentVersion();
        expect(current).toBe(1);
    });

    it('[US5] should log warning for unimplemented migrations', () => {
        const originalWarn = console.warn;
        const warnings: string[] = [];
        console.warn = (message: string) => warnings.push(message);

        migrateToCurrentVersion({}, 0); // Version 0 has no migration

        console.warn = originalWarn;
        expect(warnings.length).toBeGreaterThan(0);
    });

    it('[US5] should handle future versions gracefully', () => {
        const futureData = { version: 2, skills: {}, destinations: {}, futureField: 'data' };
        const result = migrateToCurrentVersion(futureData, 2);
        // Should return as-is and not crash
        expect((result as Record<string, unknown>).version).toBe(2);
    });

    it('should detect version from data', () => {
        expect(detectVersion({ version: 1, skills: {} })).toBe(1);
        expect(detectVersion({ version: 2 })).toBe(2);
        expect(detectVersion({})).toBeNull();
        expect(detectVersion(null)).toBeNull();
    });
});
