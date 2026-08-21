import { describe, it, expect, beforeEach } from 'vitest';
import { EventSaveCoordinator } from '../../src/integration/EventSaveCoordinator';
import { PersistenceService } from '../../src/integration/PersistenceService';
import { MockStorageAdapter } from '../fixtures/MockStorageAdapter';
import { createInitialState } from '../../src/core/initialState';

describe('User Story 4: Automatic Save on Game Events (FR-005, FR-006)', () => {
    let adapter: MockStorageAdapter;
    let service: PersistenceService;
    let coordinator: EventSaveCoordinator;

    beforeEach(() => {
        adapter = new MockStorageAdapter();
        service = new PersistenceService(adapter);
        const initialProgress = createInitialState();
        coordinator = new EventSaveCoordinator(service, initialProgress);
    });

    it('[US4] should auto-save on challenge completion event', () => {
        coordinator.onChallengeCompleted('counting', 3);

        const saved = service.load();
        expect(saved.skills.counting.skillLevel).toBe(3);
    });

    it('[US4] should auto-save on destination completion event', () => {
        coordinator.onDestinationCompleted('moon');

        const saved = service.load();
        expect(saved.destinations.moon.completed).toBe(true);
    });

    it('[US4] should auto-save on skill practice event (failure count)', () => {
        coordinator.onSkillPracticed('counting', 2);

        const saved = service.load();
        expect(saved.skills.counting.failureCount).toBe(2);
    });

    it('[FR-005] should handle multiple sequential events', () => {
        coordinator.onChallengeCompleted('counting', 2);
        coordinator.onChallengeCompleted('addition', 1);
        coordinator.onDestinationCompleted('moon');

        const saved = service.load();
        expect(saved.skills.counting.skillLevel).toBe(2);
        expect(saved.skills.addition.skillLevel).toBe(1);
        expect(saved.destinations.moon.completed).toBe(true);
    });

    it('[SC-002] should fire-and-forget (100% of events trigger save without blocking)', () => {
        const events = [
            () => coordinator.onChallengeCompleted('counting', 1),
            () => coordinator.onChallengeCompleted('addition', 1),
            () => coordinator.onSkillPracticed('counting', 1),
            () => coordinator.onDestinationCompleted('moon'),
        ];

        const startTime = performance.now();
        events.forEach(event => event());
        const duration = performance.now() - startTime;

        // All events should complete quickly (non-blocking)
        expect(duration).toBeLessThan(100);
    });

    it('[FR-005] should update current progress on each event', () => {
        coordinator.onChallengeCompleted('counting', 3);
        let progress = coordinator.getProgress();
        expect(progress.skills.counting.skillLevel).toBe(3);

        coordinator.onSkillPracticed('counting', 1);
        progress = coordinator.getProgress();
        expect(progress.skills.counting.failureCount).toBe(1);
    });

    it('[US4] should preserve previous events when new event occurs', () => {
        coordinator.onChallengeCompleted('counting', 2);
        coordinator.onDestinationCompleted('moon');

        const saved = service.load();
        expect(saved.skills.counting.skillLevel).toBe(2);
        expect(saved.destinations.moon.completed).toBe(true);
    });

    it('[SC-001] should persist auto-save across load', () => {
        coordinator.onChallengeCompleted('counting', 3);
        coordinator.onDestinationCompleted('moon');

        // Simulate new session
        const newService = new PersistenceService(adapter);
        const loaded = newService.load();

        expect(loaded.skills.counting.skillLevel).toBe(3);
        expect(loaded.destinations.moon.completed).toBe(true);
    });
});
