import { describe, expect, it } from 'vitest';
import { createProgress } from './Progress';

describe('createProgress', () => {
    it('normaliza valores fuera de rango', () => {
        const progress = createProgress({
            value: 999,
            max: 10,
            ariaLabel: 'Carga',
        });

        const bar = progress.querySelector('progress') as HTMLProgressElement;

        expect(bar.max).toBe(10);
        expect(bar.value).toBe(10);
    });
});
