import { describe, expect, it, vi } from 'vitest';
import { createRadioGroup } from './RadioGroup';

const OPTIONS = [
    { value: 'jupiter', label: 'Júpiter' },
    { value: 'saturn', label: 'Saturno' },
];

describe('createRadioGroup', () => {
    it('todas las opciones comparten el mismo "name" nativo garantizando exclusividad (VAL-1101)', () => {
        const group = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            legend: 'Pregunta',
            onChange: () => {},
        });

        const inputs = Array.from(group.querySelectorAll('input[type="radio"]')) as HTMLInputElement[];
        expect(inputs).toHaveLength(OPTIONS.length);
        expect(inputs.every((input) => input.name === 'quiz-1')).toBe(true);
    });

    it('expone nombre de grupo accesible efectivo vía "legend" (VAL-1102)', () => {
        const group = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            legend: '¿Cuál es el más grande?',
            onChange: () => {},
        });

        expect(group.querySelector('legend')?.textContent).toBe('¿Cuál es el más grande?');
    });

    it('expone nombre de grupo accesible efectivo vía "ariaLabel" cuando no hay "legend" (VAL-1102)', () => {
        const group = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            ariaLabel: 'Pregunta de quiz',
            onChange: () => {},
        });

        expect(group.querySelector('legend')).toBeNull();
        expect(group.getAttribute('aria-label')).toBe('Pregunta de quiz');
    });

    it('no fuerza selección por defecto si "value" está ausente (VAL-1103)', () => {
        const group = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            legend: 'Pregunta',
            onChange: () => {},
        });

        const inputs = Array.from(group.querySelectorAll('input[type="radio"]')) as HTMLInputElement[];
        expect(inputs.every((input) => !input.checked)).toBe(true);
    });

    it('refleja "value" preseleccionado cuando coincide con una opción existente', () => {
        const group = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            value: 'saturn',
            legend: 'Pregunta',
            onChange: () => {},
        });

        const saturnInput = group.querySelector('input[value="saturn"]') as HTMLInputElement;
        expect(saturnInput.checked).toBe(true);
    });

    it('invoca "onChange" con el valor seleccionado al cambiar', () => {
        const onChange = vi.fn();
        const group = createRadioGroup({ name: 'quiz-1', options: OPTIONS, legend: 'Pregunta', onChange });

        const saturnInput = group.querySelector('input[value="saturn"]') as HTMLInputElement;
        saturnInput.checked = true;
        saturnInput.dispatchEvent(new Event('change', { bubbles: true }));

        expect(onChange).toHaveBeenCalledWith('saturn');
    });

    it('mantiene el mismo nodo DOM al marcar una opción, permitiendo su transición CSS (FR-037)', () => {
        const group = createRadioGroup({ name: 'quiz-1', options: OPTIONS, legend: 'Pregunta', onChange: () => {} });

        const inputBefore = group.querySelector('input[value="saturn"]') as HTMLInputElement;
        inputBefore.checked = true;
        inputBefore.dispatchEvent(new Event('change', { bubbles: true }));
        const inputAfter = group.querySelector('input[value="saturn"]') as HTMLInputElement;

        expect(inputAfter).toBe(inputBefore);
        expect(inputAfter.classList.contains('radio-group__input')).toBe(true);
    });

    it('aplica el tamaño medium por defecto', () => {
        const group = createRadioGroup({ name: 'quiz-1', options: OPTIONS, legend: 'Pregunta', onChange: () => {} });

        expect(group.classList.contains('radio-group--medium')).toBe(true);
    });

    it('aplica la clase modificadora para cada tamaño soportado', () => {
        const small = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            legend: 'Pregunta',
            size: 'small',
            onChange: () => {},
        });
        const large = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            legend: 'Pregunta',
            size: 'large',
            onChange: () => {},
        });

        expect(small.classList.contains('radio-group--small')).toBe(true);
        expect(large.classList.contains('radio-group--large')).toBe(true);
    });

    it('usa medium como fallback ante un tamaño no soportado', () => {
        const group = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            legend: 'Pregunta',
            // @ts-expect-error valor inválido a propósito para probar el fallback en runtime
            size: 'huge',
            onChange: () => {},
        });

        expect(group.classList.contains('radio-group--medium')).toBe(true);
    });

    it('activa aria-invalid en el fieldset cuando existe error', () => {
        const group = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            legend: 'Pregunta',
            error: 'Debes seleccionar una opción',
            onChange: () => {},
        });

        expect(group.getAttribute('aria-invalid')).toBe('true');
    });

    it('no activa aria-invalid cuando no hay error', () => {
        const group = createRadioGroup({ name: 'quiz-1', options: OPTIONS, legend: 'Pregunta', onChange: () => {} });

        expect(group.getAttribute('aria-invalid')).toBeNull();
    });

    it('vincula hint y error mediante aria-describedby', () => {
        const group = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            legend: 'Pregunta',
            hint: 'Solo se admite una respuesta',
            error: 'Debes seleccionar una opción',
            onChange: () => {},
        });

        const hintElement = group.querySelector('.radio-group__hint');
        const errorElement = group.querySelector('.radio-group__error');

        expect(group.getAttribute('aria-describedby')).toBe(`${hintElement?.id} ${errorElement?.id}`);
        expect(hintElement?.textContent).toBe('Solo se admite una respuesta');
        expect(errorElement?.textContent).toBe('Debes seleccionar una opción');
    });

    it('no expone aria-describedby cuando no hay hint ni error', () => {
        const group = createRadioGroup({ name: 'quiz-1', options: OPTIONS, legend: 'Pregunta', onChange: () => {} });

        expect(group.getAttribute('aria-describedby')).toBeNull();
    });

    it('deshabilita el fieldset y todas las opciones cuando "disabled" es true', () => {
        const group = createRadioGroup({
            name: 'quiz-1',
            options: OPTIONS,
            legend: 'Pregunta',
            disabled: true,
            onChange: () => {},
        });

        const inputs = Array.from(group.querySelectorAll('input[type="radio"]')) as HTMLInputElement[];
        expect(group.disabled).toBe(true);
        expect(inputs.every((input) => input.disabled)).toBe(true);
    });

    it('no deshabilita el fieldset cuando "disabled" está ausente', () => {
        const group = createRadioGroup({ name: 'quiz-1', options: OPTIONS, legend: 'Pregunta', onChange: () => {} });

        expect(group.disabled).toBe(false);
    });
});
