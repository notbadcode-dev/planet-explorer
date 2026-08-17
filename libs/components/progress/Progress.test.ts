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

    it('representa un estado vacío', () => {
        const progress = createProgress({ value: 0, max: 10, ariaLabel: 'Carga' });

        const bar = progress.querySelector('progress') as HTMLProgressElement;

        expect(bar.value).toBe(0);
        expect(bar.max).toBe(10);
    });

    it('representa un estado parcial', () => {
        const progress = createProgress({ value: 4, max: 10, ariaLabel: 'Carga' });

        const bar = progress.querySelector('progress') as HTMLProgressElement;
        const valueText = progress.querySelector('.progress__value');

        expect(bar.value).toBe(4);
        expect(valueText?.textContent).toBe('40%');
    });

    it('representa un estado completo', () => {
        const progress = createProgress({ value: 10, max: 10, ariaLabel: 'Carga' });

        const bar = progress.querySelector('progress') as HTMLProgressElement;
        const valueText = progress.querySelector('.progress__value');

        expect(bar.value).toBe(10);
        expect(valueText?.textContent).toBe('100%');
    });

    it('normaliza max <= 0 al valor por defecto', () => {
        const progress = createProgress({ value: 5, max: 0, ariaLabel: 'Carga' });

        const bar = progress.querySelector('progress') as HTMLProgressElement;

        expect(bar.max).toBe(100);
    });

    it('normaliza valores negativos al mínimo permitido', () => {
        const progress = createProgress({ value: -20, max: 10, ariaLabel: 'Carga' });

        const bar = progress.querySelector('progress') as HTMLProgressElement;

        expect(bar.value).toBe(0);
    });

    it('expone nombre accesible solo mediante ariaLabel sin label visible', () => {
        const progress = createProgress({ value: 50, max: 100, label: undefined, ariaLabel: 'Progreso de descarga' });

        expect(progress.querySelector('.progress__label')).toBeNull();
        // aria-label se asigna al elemento <progress>, no al root
        const progressBar = progress.querySelector('progress');
        expect(progressBar?.getAttribute('aria-label')).toBe('Progreso de descarga');
    });

    it('tolera label y ariaLabel ambos ausentes usando nombre genérico', () => {
        const progress = createProgress({ value: 50, max: 100 });

        expect(progress.querySelector('.progress__label')).toBeNull();
    });
});
