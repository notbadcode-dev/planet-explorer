import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SUPPORTED_SKILL_NAMES } from '../game/core/progress/skill-progress-state.constants';

/**
 * Estas pruebas usan `vi.resetModules()` + `import()` dinámico en cada caso
 * porque `src/services/persistence.ts` mantiene estado de módulo (adapter,
 * PersistenceService y el EventSaveCoordinator cacheado como singleton).
 */
describe('src/services/persistence', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.resetModules();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('loadSkillProgressState() returns the default state when nothing is persisted', async () => {
        const { loadSkillProgressState } = await import('./persistence');

        const state = loadSkillProgressState();

        for (const skillName of SUPPORTED_SKILL_NAMES) {
            expect(state[skillName]).toEqual({ level: 1, failureCount: 0 });
        }
    });

    it('restores a previously auto-saved skill level on the next load', async () => {
        const { loadSkillProgressState, getSaveCoordinator } = await import('./persistence');
        loadSkillProgressState();
        getSaveCoordinator().onChallengeCompleted('counting', 5);

        vi.resetModules();
        const { loadSkillProgressState: reload } = await import('./persistence');
        const restored = reload();

        expect(restored.counting.level).toBe(5);
    });

    it('restores a previously auto-saved failure count on the next load', async () => {
        const { loadSkillProgressState, getSaveCoordinator } = await import('./persistence');
        loadSkillProgressState();
        getSaveCoordinator().onSkillPracticed('counting', 2);

        vi.resetModules();
        const { loadSkillProgressState: reload } = await import('./persistence');
        const restored = reload();

        expect(restored.counting.failureCount).toBe(2);
    });

    it('getSaveCoordinator() returns the same cached instance on repeated calls', async () => {
        const { getSaveCoordinator } = await import('./persistence');

        expect(getSaveCoordinator()).toBe(getSaveCoordinator());
    });
});
