import { describe, expect, it, vi } from 'vitest';
import { createCheckboxGroup } from './CheckboxGroup';

const OPTIONS = [
    { value: 'mercury', label: 'Mercurio' },
    { value: 'venus', label: 'Venus' },
    { value: 'earth', label: 'Tierra' },
];

describe('createCheckboxGroup', () => {
    it('expone nombre de grupo accesible efectivo vía "legend" (VAL-1201)', () => {
        const group = createCheckboxGroup({ options: OPTIONS, legend: 'Planetas rocosos', onChange: () => {} });

        expect(group.querySelector('legend')?.textContent).toBe('Planetas rocosos');
    });

    it('expone nombre de grupo accesible efectivo vía "ariaLabel" cuando no hay "legend" (VAL-1201)', () => {
        const group = createCheckboxGroup({ options: OPTIONS, ariaLabel: 'Planetas rocosos', onChange: () => {} });

        expect(group.querySelector('legend')).toBeNull();
        expect(group.getAttribute('aria-label')).toBe('Planetas rocosos');
    });

    it('mantiene el estado de selección de cada opción de forma independiente (VAL-1202)', () => {
        const onChange = vi.fn();
        const group = createCheckboxGroup({ options: OPTIONS, legend: 'Planetas rocosos', onChange });

        const venusInput = group.querySelector('input[value="venus"]') as HTMLInputElement;
        venusInput.checked = true;
        venusInput.dispatchEvent(new Event('change', { bubbles: true }));

        expect(onChange).toHaveBeenLastCalledWith(['venus']);

        const earthInput = group.querySelector('input[value="earth"]') as HTMLInputElement;
        earthInput.checked = true;
        earthInput.dispatchEvent(new Event('change', { bubbles: true }));

        expect(onChange).toHaveBeenLastCalledWith(['venus', 'earth']);

        venusInput.checked = false;
        venusInput.dispatchEvent(new Event('change', { bubbles: true }));

        expect(onChange).toHaveBeenLastCalledWith(['earth']);
    });

    it('renderiza todas las opciones deseleccionadas si "values" está ausente (VAL-1203)', () => {
        const group = createCheckboxGroup({ options: OPTIONS, legend: 'Planetas rocosos', onChange: () => {} });

        const inputs = Array.from(group.querySelectorAll('input[type="checkbox"]')) as HTMLInputElement[];
        expect(inputs.every((input) => !input.checked)).toBe(true);
    });

    it('refleja "values" preseleccionados cuando coinciden con opciones existentes', () => {
        const group = createCheckboxGroup({
            options: OPTIONS,
            values: ['mercury', 'earth'],
            legend: 'Planetas rocosos',
            onChange: () => {},
        });

        expect((group.querySelector('input[value="mercury"]') as HTMLInputElement).checked).toBe(true);
        expect((group.querySelector('input[value="venus"]') as HTMLInputElement).checked).toBe(false);
        expect((group.querySelector('input[value="earth"]') as HTMLInputElement).checked).toBe(true);
    });

    it('mantiene el mismo nodo DOM al marcar una opción, permitiendo su transición CSS (FR-037)', () => {
        const group = createCheckboxGroup({ options: OPTIONS, legend: 'Planetas rocosos', onChange: () => {} });

        const inputBefore = group.querySelector('input[value="venus"]') as HTMLInputElement;
        inputBefore.checked = true;
        inputBefore.dispatchEvent(new Event('change', { bubbles: true }));
        const inputAfter = group.querySelector('input[value="venus"]') as HTMLInputElement;

        expect(inputAfter).toBe(inputBefore);
        expect(inputAfter.classList.contains('checkbox-group__input')).toBe(true);
    });
});
