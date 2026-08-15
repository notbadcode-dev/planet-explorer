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
});
