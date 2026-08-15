import { describe, expect, it, vi } from 'vitest';
import { createInput } from './Input';

describe('createInput', () => {
    it('crea la estructura base del input', () => {
        const onInput = vi.fn();
        const component = createInput({
            label: 'Nombre',
            onInput,
        });

        const field = component.querySelector('input');

        expect(component.classList.contains('input')).toBe(true);
        expect(field).toBeInstanceOf(HTMLInputElement);
    });

    it('expone nombre accesible a partir de label', () => {
        const component = createInput({
            label: 'Nombre de planeta',
            onInput: () => {},
        });

        const field = component.querySelector('input') as HTMLInputElement;
        const labelElement = component.querySelector('label');

        expect(field.getAttribute('aria-label')).toBe('Nombre de planeta');
        expect(labelElement?.textContent).toBe('Nombre de planeta');
        expect(labelElement?.htmlFor).toBe(field.id);
    });

    it('expone nombre accesible a partir de ariaLabel cuando no hay label visible', () => {
        const component = createInput({
            ariaLabel: 'Buscar planeta',
            onInput: () => {},
        });

        const field = component.querySelector('input') as HTMLInputElement;

        expect(field.getAttribute('aria-label')).toBe('Buscar planeta');
        expect(component.querySelector('label')).toBeNull();
    });

    it('activa aria-invalid cuando existe error', () => {
        const component = createInput({
            label: 'Correo',
            error: 'Correo inválido',
            onInput: () => {},
        });

        const field = component.querySelector('input') as HTMLInputElement;

        expect(field.getAttribute('aria-invalid')).toBe('true');
    });

    it('no activa aria-invalid cuando no hay error', () => {
        const component = createInput({
            label: 'Correo',
            onInput: () => {},
        });

        const field = component.querySelector('input') as HTMLInputElement;

        expect(field.getAttribute('aria-invalid')).toBeNull();
    });

    it('vincula hint y error mediante aria-describedby', () => {
        const component = createInput({
            label: 'Correo',
            hint: 'Usa tu correo institucional',
            error: 'Correo inválido',
            onInput: () => {},
        });

        const field = component.querySelector('input') as HTMLInputElement;
        const hintElement = component.querySelector('.input__hint');
        const errorElement = component.querySelector('.input__error');

        expect(field.getAttribute('aria-describedby')).toBe(`${hintElement?.id} ${errorElement?.id}`);
        expect(hintElement?.textContent).toBe('Usa tu correo institucional');
        expect(errorElement?.textContent).toBe('Correo inválido');
    });

    it('no expone aria-describedby cuando no hay hint ni error', () => {
        const component = createInput({
            label: 'Correo',
            onInput: () => {},
        });

        const field = component.querySelector('input') as HTMLInputElement;

        expect(field.getAttribute('aria-describedby')).toBeNull();
    });

    it('invoca onInput con el valor actual del campo', () => {
        const onInput = vi.fn();
        const component = createInput({
            label: 'Nombre',
            onInput,
        });

        const field = component.querySelector('input') as HTMLInputElement;
        field.value = 'Marte';
        field.dispatchEvent(new Event('input'));

        expect(onInput).toHaveBeenCalledTimes(1);
        expect(onInput).toHaveBeenCalledWith('Marte');
    });
});
