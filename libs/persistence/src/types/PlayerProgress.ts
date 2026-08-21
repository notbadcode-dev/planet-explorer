/**
 * Skill progress state for a single skill.
 * Tracks learning progression, failures, and timing.
 */
export interface SkillProgress {
  skillId: string;
  skillLevel: number;
  failureCount: number;
  lastUpdateTime: string; // ISO8601
}

/**
 * Map of skill progress entries: skillId → SkillProgress
 */
export type SkillProgressMap = Record<string, SkillProgress>;

/**
 * Destination completion state.
 * Tracks whether destination is unlocked and which missions completed.
 */
export interface DestinationState {
  destinationId: string;
  completed: boolean;
  missionsCompleted: string[];
  lastVisitTime: string; // ISO8601
}

/**
 * Map of destination state entries: destinationId → DestinationState
 */
export type DestinationStateMap = Record<string, DestinationState>;

/**
 * Root aggregate: Complete player progress state.
 * Stored as JSON in localStorage with version field for future migrations.
 */
export interface PlayerProgress {
  version: number;
  skills: SkillProgressMap;
  destinations: DestinationStateMap;
  lastSavedTime: string; // ISO8601
}
