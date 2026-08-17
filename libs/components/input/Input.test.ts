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

    it('aplica el tamaño medium por defecto', () => {
        const component = createInput({
            label: 'Nombre',
            onInput: () => {},
        });

        expect(component.classList.contains('input--medium')).toBe(true);
    });

    it('aplica la clase modificadora para cada tamaño soportado', () => {
        const small = createInput({ label: 'Nombre', size: 'small', onInput: () => {} });
        const large = createInput({ label: 'Nombre', size: 'large', onInput: () => {} });

        expect(small.classList.contains('input--small')).toBe(true);
        expect(large.classList.contains('input--large')).toBe(true);
    });

    it('usa medium como fallback ante un tamaño no soportado', () => {
        const component = createInput({
            label: 'Nombre',
            // @ts-expect-error valor inválido a propósito para probar el fallback en runtime
            size: 'huge',
            onInput: () => {},
        });

        expect(component.classList.contains('input--medium')).toBe(true);
    });

    it('soporta required=true en el campo nativo', () => {
        const input = createInput({ label: 'Correo', required: true, onInput: () => {} });
        const field = input.querySelector('input') as HTMLInputElement;

        expect(field.required).toBe(true);
    });

    it('combina error y disabled sin conflictos visuales', () => {
        const input = createInput({
            label: 'Campo',
            disabled: true,
            error: 'Error presente',
            onInput: () => {},
        });
        const field = input.querySelector('input') as HTMLInputElement;

        expect(field.disabled).toBe(true);
        expect(field.getAttribute('aria-invalid')).toBe('true');
    });
});
