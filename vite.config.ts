/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

// Configuración base de Vite para planet-explorer.
export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
    },
    test: {
        environment: 'happy-dom',
        include: ['libs/**/*.test.ts'],
    },
});
