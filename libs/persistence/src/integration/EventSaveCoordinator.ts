import type { PlayerProgress } from '../types';
import { completeDestination, createSkillProgress, updateSkillLevel } from '../core/factories';
import { PersistenceService } from './PersistenceService';

/**
 * Event-driven auto-save coordinator.
 * Listens for 3 game events and triggers fire-and-forget saves:
 * 1. Challenge completion (skill level change)
 * 2. Destination completion (destination marked complete)
 * 3. Skill practice event (failureCount updated)
 *
 * Principle I (UX centrada en el niño): Non-blocking, no lag
 * Principle V (Contenido dirigido por datos): Responds to well-defined events
 */
export class EventSaveCoordinator {
    private persistence: PersistenceService;
    private currentProgress: PlayerProgress;

    constructor(persistence: PersistenceService, initialProgress: PlayerProgress) {
        this.persistence = persistence;
        this.currentProgress = initialProgress;
    }

    /**
   * Event: Player completed a challenge (skill level increased).
   * Triggered by game loop when challenge is passed.
   */
    onChallengeCompleted(skillId: string, newLevel: number): void {
    // Update internal state (reuses the same factory logic as libs/persistence core)
        this.currentProgress = updateSkillLevel(this.currentProgress, skillId, newLevel);

        // Fire-and-forget save
        this.persistence.save(this.currentProgress);
    }

    /**
   * Event: Player completed a destination (unlocked next area).
   * Triggered by game loop when destination is marked complete.
   */
    onDestinationCompleted(destinationId: string): void {
    // Update internal state (reuses the same factory logic as libs/persistence core)
        this.currentProgress = completeDestination(this.currentProgress, destinationId);

        // Fire-and-forget save
        this.persistence.save(this.currentProgress);
    }

    /**
   * Event: Player practice session on skill (failure count updated).
   * Triggered by game loop after each challenge attempt.
   */
    onSkillPracticed(skillId: string, failureCount: number): void {
    // Update internal state
        this.currentProgress = {
            ...this.currentProgress,
            skills: {
                ...this.currentProgress.skills,
                [skillId]: {
                    ...(this.currentProgress.skills[skillId] || createSkillProgress(skillId)),
                    failureCount,
                    lastUpdateTime: new Date().toISOString(),
                },
            },
        };

        // Fire-and-forget save
        this.persistence.save(this.currentProgress);
    }

    /**
   * Get current progress state (for game loop queries).
   */
    getProgress(): PlayerProgress {
        return this.currentProgress;
    }

    /**
   * Update internal progress (e.g., from external game state).
   */
    updateProgress(newProgress: PlayerProgress): void {
        this.currentProgress = newProgress;
    }
}
