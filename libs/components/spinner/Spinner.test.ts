import { describe, expect, it } from 'vitest';
import { createSpinner } from './Spinner';

describe('createSpinner', () => {
    it('expone semántica accesible de carga indeterminada role="status" + aria-busy="true" (VAL-1601)', () => {
        const spinner = createSpinner({ label: 'Cargando misión…' });

        expect(spinner.getAttribute('role')).toBe('status');
        expect(spinner.getAttribute('aria-busy')).toBe('true');
    });

    it('deja de anunciarse como estado de carga activo al retirarse del DOM (VAL-1602)', () => {
        const spinner = createSpinner({ label: 'Cargando' });
        document.body.append(spinner);

        expect(document.body.contains(spinner)).toBe(true);
        expect(document.querySelector('[role="status"]')).not.toBeNull();

        spinner.remove();

        expect(document.body.contains(spinner)).toBe(false);
        expect(document.querySelector('[role="status"]')).toBeNull();
    });

    it('reutiliza el catálogo cerrado ComponentSize compartido con Button (VAL-1603)', () => {
        const small = createSpinner({ size: 'small' });
        const medium = createSpinner({ size: 'medium' });
        const large = createSpinner({ size: 'large' });

        expect(small.classList.contains('spinner--small')).toBe(true);
        expect(medium.classList.contains('spinner--medium')).toBe(true);
        expect(large.classList.contains('spinner--large')).toBe(true);
    });

    it('usa "medium" por defecto cuando se omite size o se recibe un valor no soportado', () => {
        const withoutSize = createSpinner({});
        const withInvalidSize = createSpinner({ size: 'huge' as never });

        expect(withoutSize.classList.contains('spinner--medium')).toBe(true);
        expect(withInvalidSize.classList.contains('spinner--medium')).toBe(true);
    });

    it('usa un nombre accesible genérico cuando no se proporciona label ni ariaLabel', () => {
        const spinner = createSpinner({});

        expect(spinner.getAttribute('aria-label')).toBe('Cargando');
    });

    it('conserva un nombre accesible sin renderizar texto visible cuando se omite "label" (FR-039)', () => {
        const spinner = createSpinner({});

        expect(spinner.querySelector('.spinner__label')).toBeNull();
        expect(spinner.getAttribute('aria-label')?.trim()).not.toBe('');
    });

    it('soporta ariaLabel sin label visible', () => {
        const spinner = createSpinner({ ariaLabel: 'Cargando datos del servidor', size: 'medium' });

        expect(spinner.querySelector('.spinner__label')).toBeNull();
        expect(spinner.getAttribute('aria-label')).toBe('Cargando datos del servidor');
    });

    it('combina label y ariaLabel, mostrando label y usando ariaLabel como accesible', () => {
        const spinner = createSpinner({ label: 'Procesando...', ariaLabel: 'Procesando tu solicitud' });

        expect(spinner.querySelector('.spinner__label')?.textContent).toBe('Procesando...');
        expect(spinner.getAttribute('aria-label')).toBe('Procesando tu solicitud');
    });
});
