// eslint.config.js
// Configuración ESLint (flat config) para planet-explorer: TypeScript strict.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['dist/', 'storybook-static/', 'node_modules/', '.storybook/main.ts', 'coverage/', '**/coverage/'],
    },
    {
        languageOptions: {
            parserOptions: {
                project: false,
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            indent: ['error', 4, { SwitchCase: 1 }],
        },
    },
    {
        files: ['scripts/**/*.mjs', '*.config.ts', '*.config.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
);
