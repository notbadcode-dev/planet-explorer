import type { PlayerProgress } from '../../src/types';
import { createInitialState } from '../../src/core/initialState';
import { createSkillProgress, createDestinationState } from '../../src/core/factories';
import {
    TEST_SCENARIO_SCHEMA_VERSION,
    TEST_SCENARIO_SKILL_COUNTING,
    TEST_SCENARIO_SKILL_ADDITION,
    TEST_SCENARIO_DESTINATION_MOON,
    TEST_SCENARIO_DESTINATION_MARS,
    TEST_SCENARIO_COUNTING_LEVEL,
    TEST_SCENARIO_COUNTING_FAILURES,
    TEST_SCENARIO_ADDITION_LEVEL,
    TEST_SCENARIO_ADDITION_FAILURES,
    TEST_SCENARIO_MULTI_COUNTING_LEVEL,
    TEST_SCENARIO_MULTI_COUNTING_FAILURES,
    TEST_SCENARIO_DESTINATION_COMPLETED,
    TEST_SCENARIO_DESTINATION_NOT_COMPLETED,
} from './test-scenarios.constants';

/**
 * Realistic test scenarios covering the spec's main user stories (US1-US3).
 * Kept as ready-made fixtures so tests can build on realistic shapes without
 * duplicating the same literal objects across test files.
 */
export const testScenarios = {
    firstSession: (): PlayerProgress => createInitialState(),

    skillProgressionScenario: (): PlayerProgress => ({
        version: TEST_SCENARIO_SCHEMA_VERSION,
        skills: {
            counting: createSkillProgress(TEST_SCENARIO_SKILL_COUNTING, TEST_SCENARIO_COUNTING_LEVEL, TEST_SCENARIO_COUNTING_FAILURES),
            addition: createSkillProgress(TEST_SCENARIO_SKILL_ADDITION, TEST_SCENARIO_ADDITION_LEVEL, TEST_SCENARIO_ADDITION_FAILURES),
        },
        destinations: {},
        lastSavedTime: new Date().toISOString(),
    }),

    destinationProgressScenario: (): PlayerProgress => ({
        version: TEST_SCENARIO_SCHEMA_VERSION,
        skills: { counting: createSkillProgress(TEST_SCENARIO_SKILL_COUNTING, TEST_SCENARIO_COUNTING_LEVEL, TEST_SCENARIO_COUNTING_FAILURES) },
        destinations: {
            moon: createDestinationState(TEST_SCENARIO_DESTINATION_MOON, TEST_SCENARIO_DESTINATION_COMPLETED),
        },
        lastSavedTime: new Date().toISOString(),
    }),

    multiDestinationScenario: (): PlayerProgress => ({
        version: TEST_SCENARIO_SCHEMA_VERSION,
        skills: {
            counting: createSkillProgress(TEST_SCENARIO_SKILL_COUNTING, TEST_SCENARIO_MULTI_COUNTING_LEVEL, TEST_SCENARIO_MULTI_COUNTING_FAILURES),
        },
        destinations: {
            moon: createDestinationState(TEST_SCENARIO_DESTINATION_MOON, TEST_SCENARIO_DESTINATION_COMPLETED),
            mars: createDestinationState(TEST_SCENARIO_DESTINATION_MARS, TEST_SCENARIO_DESTINATION_NOT_COMPLETED),
        },
        lastSavedTime: new Date().toISOString(),
    }),
};
