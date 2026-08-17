import { describe, expect, it, vi } from 'vitest';
import { createSelect } from './Select';

const OPTIONS = [
    { value: 'mars', label: 'Marte' },
    { value: 'venus', label: 'Venus' },
];

describe('createSelect', () => {
    it('garantiza nombre accesible efectivo vía "label" (VAL-1001)', () => {
        const select = createSelect({ options: OPTIONS, label: 'Planeta', onChange: () => {} });
        const field = select.querySelector('select') as HTMLSelectElement;

        expect(select.querySelector('label')?.textContent).toBe('Planeta');
        expect(field.getAttribute('aria-label')).toBe('Planeta');
    });

    it('garantiza nombre accesible efectivo vía "ariaLabel" cuando no hay "label" visible (VAL-1001)', () => {
        const select = createSelect({ options: OPTIONS, ariaLabel: 'Selecciona planeta', onChange: () => {} });
        const field = select.querySelector('select') as HTMLSelectElement;

        expect(select.querySelector('label')).toBeNull();
        expect(field.getAttribute('aria-label')).toBe('Selecciona planeta');
    });

    it('se implementa sobre el elemento <select> nativo (VAL-1002)', () => {
        const select = createSelect({ options: OPTIONS, label: 'Planeta', onChange: () => {} });

        expect(select.querySelector('select')).toBeInstanceOf(HTMLSelectElement);
        expect(select.querySelectorAll('option')).toHaveLength(OPTIONS.length);
    });

    it('refleja "value" preseleccionado cuando coincide con una opción existente (VAL-1004)', () => {
        const select = createSelect({ options: OPTIONS, value: 'venus', label: 'Planeta', onChange: () => {} });
        const field = select.querySelector('select') as HTMLSelectElement;

        expect(field.value).toBe('venus');
    });

    it('invoca "onChange" con el valor seleccionado al cambiar', () => {
        const onChange = vi.fn();
        const select = createSelect({ options: OPTIONS, label: 'Planeta', onChange });
        const field = select.querySelector('select') as HTMLSelectElement;

        field.value = 'venus';
        field.dispatchEvent(new Event('change', { bubbles: true }));

        expect(onChange).toHaveBeenCalledWith('venus');
    });

    it('renderiza deshabilitado con opción de marcador de posición si "options" está vacío, sin lanzar error (VAL-1003)', () => {
        expect(() =>
            createSelect({ options: [], label: 'Planeta', onChange: () => {} }),
        ).not.toThrow();

        const select = createSelect({ options: [], label: 'Planeta', onChange: () => {} });
        const field = select.querySelector('select') as HTMLSelectElement;

        expect(field.disabled).toBe(true);
        expect(field.querySelectorAll('option')).toHaveLength(1);
    });

    it('incluye un icono indicador decorativo junto al <select> nativo sin alterarlo (FR-038)', () => {
        const select = createSelect({ options: OPTIONS, label: 'Planeta', onChange: () => {} });

        const icon = select.querySelector('svg');
        expect(icon).not.toBeNull();
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
        expect(select.querySelector('select')).toBeInstanceOf(HTMLSelectElement);
    });

    it('renderiza con una única opción sin error', () => {
        const select = createSelect({
            options: [{ value: 'solo', label: 'Único' }],
            label: 'Opción',
            onChange: () => {},
        });
        const options = select.querySelectorAll('option');

        expect(options).toHaveLength(1); // una sola opción (sin placeholder)
    });

    it('tolera un value que no coincide con ninguna opción (fallback al primer valor)', () => {
        const select = createSelect({
            options: OPTIONS,
            value: 'no-existe',
            label: 'Planeta',
            onChange: () => {},
        });
        const field = select.querySelector('select') as HTMLSelectElement;

        expect(field).not.toBeNull();
        // El select nativo ignora valores no válidos y usa el primero (mars)
        expect(field.value).toBe('mars');
    });
});
