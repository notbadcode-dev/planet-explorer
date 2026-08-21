import { describe, it, expect, beforeEach } from 'vitest';
import { PersistenceService } from '../../src/integration/PersistenceService';
import { MockStorageAdapter } from '../fixtures/MockStorageAdapter';
import { updateSkillLevel } from '../../src/core/factories';
import { createInitialState } from '../../src/core/initialState';

describe('User Story 2: Save Skill Progress (FR-003, FR-005, FR-007)', () => {
    let adapter: MockStorageAdapter;
    let service: PersistenceService;

    beforeEach(() => {
        adapter = new MockStorageAdapter();
        service = new PersistenceService(adapter);
    });

    it('[US2] should save and restore skill level', () => {
        let progress = createInitialState();
        progress = updateSkillLevel(progress, 'counting', 3);

        service.save(progress);

        const loaded = service.load();
        expect(loaded.skills.counting).toBeDefined();
        expect(loaded.skills.counting.skillLevel).toBe(3);
    });

    it('[US2] should handle multiple skills', () => {
        let progress = createInitialState();
        progress = updateSkillLevel(progress, 'counting', 2);
        progress = updateSkillLevel(progress, 'addition', 1);

        service.save(progress);

        const loaded = service.load();
        expect(loaded.skills.counting.skillLevel).toBe(2);
        expect(loaded.skills.addition.skillLevel).toBe(1);
    });

    it('[US2] should update existing skill level', () => {
        let progress = createInitialState();
        progress = updateSkillLevel(progress, 'counting', 2);
        service.save(progress);

        progress = service.load();
        progress = updateSkillLevel(progress, 'counting', 3);
        service.save(progress);

        const loaded = service.load();
        expect(loaded.skills.counting.skillLevel).toBe(3);
    });

    it('[SC-001] should persist skill across load/save cycles', () => {
        let progress = createInitialState();
        progress = updateSkillLevel(progress, 'counting', 5);
        service.save(progress);

        const session1 = service.load();
        expect(session1.skills.counting.skillLevel).toBe(5);

        let session2Progress = session1;
        session2Progress = updateSkillLevel(session2Progress, 'counting', 6);
        service.save(session2Progress);

        const session3 = service.load();
        expect(session3.skills.counting.skillLevel).toBe(6);
    });

    it('[FR-007] should serialize/deserialize correctly (round-trip)', () => {
        let progress = createInitialState();
        progress = updateSkillLevel(progress, 'counting', 3);
        progress = updateSkillLevel(progress, 'addition', 1);

        service.save(progress);
        const loaded = service.load();

        // Re-save and re-load should be identical
        service.save(loaded);
        const reloaded = service.load();

        expect(reloaded).toEqual(loaded);
    });

    it('[FR-005] should NOT block (fire-and-forget pattern)', () => {
        let progress = createInitialState();
        progress = updateSkillLevel(progress, 'counting', 3);

        // save() should complete synchronously (not return promise)
        const startTime = performance.now();
        service.save(progress);
        const duration = performance.now() - startTime;

        // Fire-and-forget should be nearly instant
        expect(duration).toBeLessThan(100); // Should be < 1ms typically
    });

    it('[SC-004] should handle save/load cycle in < 50ms', () => {
        let progress = createInitialState();
        progress = updateSkillLevel(progress, 'counting', 3);

        const startTime = performance.now();
        service.save(progress);
        const loaded = service.load();
        const duration = performance.now() - startTime;

        expect(duration).toBeLessThan(50);
        expect(loaded.skills.counting.skillLevel).toBe(3);
    });

    it('[FR-003] should mark skill as updated with timestamp', () => {
        let progress = createInitialState();
        progress = updateSkillLevel(progress, 'counting', 3);
        service.save(progress);

        const loaded = service.load();
        const updateTime = new Date(loaded.skills.counting.lastUpdateTime);
        const now = new Date();

        // Timestamp should be recent (within 5 seconds)
        expect(now.getTime() - updateTime.getTime()).toBeLessThan(5000);
    });
});
