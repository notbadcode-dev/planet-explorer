import { describe, it, expect, beforeEach } from 'vitest';
import { PersistenceService } from '../../src/integration/PersistenceService';
import { MockStorageAdapter } from '../fixtures/MockStorageAdapter';
import { completeDestination, addMissionToDestination } from '../../src/core/factories';
import { createInitialState } from '../../src/core/initialState';

describe('User Story 3: Save Destination Completion (FR-004, FR-005)', () => {
    let adapter: MockStorageAdapter;
    let service: PersistenceService;

    beforeEach(() => {
        adapter = new MockStorageAdapter();
        service = new PersistenceService(adapter);
    });

    it('[US3] should save and restore destination completed state', () => {
        let progress = createInitialState();
        progress = completeDestination(progress, 'moon');

        service.save(progress);

        const loaded = service.load();
        expect(loaded.destinations.moon).toBeDefined();
        expect(loaded.destinations.moon.completed).toBe(true);
    });

    it('[US3] should save and restore missions completed list', () => {
        let progress = createInitialState();
        progress = addMissionToDestination(progress, 'moon', 'mission-1');
        progress = addMissionToDestination(progress, 'moon', 'mission-2');

        service.save(progress);

        const loaded = service.load();
        expect(loaded.destinations.moon.missionsCompleted).toContain('mission-1');
        expect(loaded.destinations.moon.missionsCompleted).toContain('mission-2');
    });

    it('[US3] should handle multiple destinations', () => {
        let progress = createInitialState();
        progress = completeDestination(progress, 'moon');
        progress = completeDestination(progress, 'mars');

        service.save(progress);

        const loaded = service.load();
        expect(loaded.destinations.moon.completed).toBe(true);
        expect(loaded.destinations.mars.completed).toBe(true);
    });

    it('[US3] should not duplicate missions', () => {
        let progress = createInitialState();
        progress = addMissionToDestination(progress, 'moon', 'mission-1');
        progress = addMissionToDestination(progress, 'moon', 'mission-1'); // Add same mission again

        service.save(progress);

        const loaded = service.load();
        const count = loaded.destinations.moon.missionsCompleted.filter(m => m === 'mission-1').length;
        expect(count).toBe(1); // Should only appear once
    });

    it('[SC-001] should persist destination across sessions', () => {
        let progress = createInitialState();
        progress = completeDestination(progress, 'moon');
        service.save(progress);

        const session1 = service.load();
        expect(session1.destinations.moon.completed).toBe(true);

        // Simulate new session but data persists
        const session2 = service.load();
        expect(session2.destinations.moon.completed).toBe(true);
    });

    it('[FR-004] should mark destination with visit timestamp', () => {
        let progress = createInitialState();
        progress = completeDestination(progress, 'moon');
        service.save(progress);

        const loaded = service.load();
        const visitTime = new Date(loaded.destinations.moon.lastVisitTime);
        const now = new Date();

        expect(now.getTime() - visitTime.getTime()).toBeLessThan(5000);
    });

    it('[FR-005] should fire-and-forget save destinations', () => {
        let progress = createInitialState();
        progress = completeDestination(progress, 'moon');

        const startTime = performance.now();
        service.save(progress);
        const duration = performance.now() - startTime;

        expect(duration).toBeLessThan(100);
    });
});
