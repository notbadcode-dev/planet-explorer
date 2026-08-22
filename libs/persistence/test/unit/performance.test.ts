import { describe, it, expect } from 'vitest';
import { PersistenceService } from '../../src/integration/PersistenceService';
import { MockStorageAdapter } from '../fixtures/MockStorageAdapter';
import { requireSkill } from '../fixtures/progress-assertions';
import { serialize } from '../../src/core/serialize';
import type { PlayerProgress, SkillProgressMap, DestinationStateMap } from '../../src/types';

const SKILL_IDS = ['counting', 'addition', 'subtraction', 'memory', 'sequence', 'reading', 'spatial'];
const DESTINATION_IDS = [
    'moon',
    'mars',
    'jupiter',
    'saturn',
    'asteroid-belt',
    'uranus',
    'neptune',
    'pluto',
    'ceres',
    'comets',
];

function buildRealisticProgress(): PlayerProgress {
    const skills: SkillProgressMap = {};
    SKILL_IDS.forEach((skillId, index) => {
        skills[skillId] = {
            skillId,
            skillLevel: index + 1,
            failureCount: index,
            lastUpdateTime: new Date().toISOString(),
        };
    });

    const destinations: DestinationStateMap = {};
    DESTINATION_IDS.forEach((destinationId, index) => {
        destinations[destinationId] = {
            destinationId,
            completed: index % 2 === 0,
            missionsCompleted: ['mission_1', 'mission_2', 'mission_3'],
            lastVisitTime: new Date().toISOString(),
        };
    });

    return {
        version: 1,
        skills,
        destinations,
        lastSavedTime: new Date().toISOString(),
    };
}

describe('Performance: single save/load cycle (NFR-001, SC-004)', () => {
    it('should complete a single save() call in under 10ms', () => {
        const adapter = new MockStorageAdapter();
        const service = new PersistenceService(adapter);
        const progress = buildRealisticProgress();

        const startTime = performance.now();
        service.save(progress);
        const elapsed = performance.now() - startTime;

        expect(elapsed).toBeLessThan(10);
    });

    it('should complete a single load() call in under 10ms', () => {
        const adapter = new MockStorageAdapter();
        const service = new PersistenceService(adapter);
        service.save(buildRealisticProgress());

        const startTime = performance.now();
        service.load();
        const elapsed = performance.now() - startTime;

        expect(elapsed).toBeLessThan(10);
    });

    it('should complete a full save+load round trip in under 50ms', () => {
        const adapter = new MockStorageAdapter();
        const service = new PersistenceService(adapter);
        const progress = buildRealisticProgress();

        const startTime = performance.now();
        service.save(progress);
        const restored = service.load();
        const elapsed = performance.now() - startTime;

        expect(elapsed).toBeLessThan(50);
        expect(requireSkill(restored, 'counting').skillLevel).toBe(1);
    });
});

describe('Payload size: serialized data stays within budget (NFR-003)', () => {
    it('should keep the serialized JSON payload under ~100KB for a realistic progress state', () => {
        const progress = buildRealisticProgress();
        const jsonString = serialize(progress);
        const sizeInBytes = new TextEncoder().encode(jsonString).length;
        const maxBytes = 100 * 1024;

        expect(sizeInBytes).toBeLessThan(maxBytes);
    });
});
