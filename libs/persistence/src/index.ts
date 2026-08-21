// Core types and logic
export type { PlayerProgress, SkillProgress, DestinationState, SkillProgressMap, DestinationStateMap, StorageAdapter } from './types';
export { validatePlayerProgress, serialize, deserialize, applyFallback, createInitialState, createSkillProgress, createDestinationState, updateSkillLevel, addMissionToDestination, completeDestination, updateSaveTimestamp, detectVersion, migrateToCurrentVersion, getCurrentVersion } from './core';

// Storage adapters
export { LocalStorageAdapter } from './adapters';

// Integration layer
export { PersistenceService, EventSaveCoordinator } from './integration';
