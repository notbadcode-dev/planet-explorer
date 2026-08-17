import { describe, expect, it } from 'vitest';
import { appendFieldHelperText } from './FieldHelperText';

describe('appendFieldHelperText', () => {
    it('añade un párrafo de hint con la clase y el id indicados', () => {
        const container = document.createElement('div');
        const field = document.createElement('select');

        appendFieldHelperText({
            container,
            describedElement: field,
            hintClass: 'x__hint',
            errorClass: 'x__error',
            hintId: 'x-hint',
            errorId: 'x-error',
            hint: 'Ayuda',
            error: undefined,
        });

        const hintElement = container.querySelector('.x__hint');
        expect(hintElement?.id).toBe('x-hint');
        expect(hintElement?.textContent).toBe('Ayuda');
        expect(field.getAttribute('aria-describedby')).toBe('x-hint');
        expect(field.getAttribute('aria-invalid')).toBeNull();
    });

    it('añade un párrafo de error y activa aria-invalid en el elemento descrito', () => {
        const container = document.createElement('fieldset');

        appendFieldHelperText({
            container,
            describedElement: container,
            hintClass: 'x__hint',
            errorClass: 'x__error',
            hintId: 'x-hint',
            errorId: 'x-error',
            hint: undefined,
            error: 'Campo inválido',
        });

        const errorElement = container.querySelector('.x__error');
        expect(errorElement?.id).toBe('x-error');
        expect(errorElement?.textContent).toBe('Campo inválido');
        expect(container.getAttribute('aria-invalid')).toBe('true');
        expect(container.getAttribute('aria-describedby')).toBe('x-error');
    });

    it('vincula hint y error juntos en aria-describedby, hint primero', () => {
        const container = document.createElement('div');
        const field = document.createElement('input');

        appendFieldHelperText({
            container,
            describedElement: field,
            hintClass: 'x__hint',
            errorClass: 'x__error',
            hintId: 'x-hint',
            errorId: 'x-error',
            hint: 'Ayuda',
            error: 'Error',
        });

        expect(field.getAttribute('aria-describedby')).toBe('x-hint x-error');
    });

    it('no añade nada ni establece atributos cuando no hay hint ni error', () => {
        const container = document.createElement('div');
        const field = document.createElement('input');

        appendFieldHelperText({
            container,
            describedElement: field,
            hintClass: 'x__hint',
            errorClass: 'x__error',
            hintId: 'x-hint',
            errorId: 'x-error',
            hint: undefined,
            error: undefined,
        });

        expect(container.children).toHaveLength(0);
        expect(field.getAttribute('aria-describedby')).toBeNull();
        expect(field.getAttribute('aria-invalid')).toBeNull();
    });

    it('ignora hint/error compuestos solo por espacios en blanco', () => {
        const container = document.createElement('div');
        const field = document.createElement('input');

        appendFieldHelperText({
            container,
            describedElement: field,
            hintClass: 'x__hint',
            errorClass: 'x__error',
            hintId: 'x-hint',
            errorId: 'x-error',
            hint: '   ',
            error: '   ',
        });

        expect(container.children).toHaveLength(0);
        expect(field.getAttribute('aria-describedby')).toBeNull();
    });
});
