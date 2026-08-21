import { defineConfig } from 'vitest/config';

import {
    COVERAGE_EXCLUDE_PATTERNS,
    COVERAGE_INCLUDE_PATTERNS,
    COVERAGE_PROVIDER,
    COVERAGE_REPORTERS,
    TEST_EXCLUDE_PATTERNS,
    TEST_INCLUDE_PATTERNS,
    VITEST_ENVIRONMENT,
} from './vitest.config.constants';

export default defineConfig({
    test: {
        globals: true,
        environment: VITEST_ENVIRONMENT,
        include: [...TEST_INCLUDE_PATTERNS],
        exclude: [...TEST_EXCLUDE_PATTERNS],
        coverage: {
            provider: COVERAGE_PROVIDER,
            reporter: [...COVERAGE_REPORTERS],
            include: [...COVERAGE_INCLUDE_PATTERNS],
            exclude: [...COVERAGE_EXCLUDE_PATTERNS], // Index files don't need coverage
        },
    },
});
