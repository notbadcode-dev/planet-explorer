/**
 * Constants for vitest.config.ts
 * Vitest/coverage configuration literals for libs/persistence.
 */

export const VITEST_ENVIRONMENT = 'node' as const;

export const TEST_INCLUDE_PATTERNS = ['test/**/*.test.ts'] as const;
export const TEST_EXCLUDE_PATTERNS = ['node_modules', 'dist'] as const;

export const COVERAGE_PROVIDER = 'v8' as const;
export const COVERAGE_REPORTERS = ['text', 'json', 'html'] as const;
export const COVERAGE_INCLUDE_PATTERNS = ['src/**/*.ts'] as const;
export const COVERAGE_EXCLUDE_PATTERNS = ['src/types/index.ts'] as const;
