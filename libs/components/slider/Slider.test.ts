import { describe, expect, it, vi } from 'vitest';
import { createSlider } from './Slider';

describe('createSlider', () => {
    it('expone nombre accesible efectivo mediante label (VAL-1801)', () => {
        const slider = createSlider({ label: 'Volumen', min: 0, max: 100, onChange: () => {} });

        const field = slider.querySelector('input') as HTMLInputElement;

        expect(field.getAttribute('aria-label')).toBe('Volumen');
    });

    it('expone nombre accesible efectivo mediante ariaLabel cuando no hay label visible (VAL-1801)', () => {
        const slider = createSlider({ ariaLabel: 'Volumen del HUD', min: 0, max: 100, onChange: () => {} });

        const field = slider.querySelector('input') as HTMLInputElement;

        expect(slider.querySelector('label')).toBeNull();
        expect(field.getAttribute('aria-label')).toBe('Volumen del HUD');
    });

    it('se construye sobre un <input type="range"> nativo (VAL-1802)', () => {
        const slider = createSlider({ label: 'Volumen', min: 0, max: 100, onChange: () => {} });

        const field = slider.querySelector('input') as HTMLInputElement;

        expect(field.type).toBe('range');
    });

    it('usa min como valor por defecto cuando value se omite (VAL-1803)', () => {
        const slider = createSlider({ label: 'Volumen', min: 10, max: 100, onChange: () => {} });

        const field = slider.querySelector('input') as HTMLInputElement;

        expect(field.value).toBe('10');
    });

    it('normaliza un value por debajo de min al límite inferior (VAL-1804)', () => {
        const slider = createSlider({ label: 'Volumen', min: 0, max: 100, value: -20, onChange: () => {} });

        const field = slider.querySelector('input') as HTMLInputElement;

        expect(field.value).toBe('0');
    });

    it('normaliza un value por encima de max al límite superior (VAL-1804)', () => {
        const slider = createSlider({ label: 'Volumen', min: 0, max: 100, value: 999, onChange: () => {} });

        const field = slider.querySelector('input') as HTMLInputElement;

        expect(field.value).toBe('100');
    });

    it('delega en el navegador el redondeo a step cuando este no divide exactamente el rango (VAL-1808)', () => {
        const slider = createSlider({ label: 'Volumen', min: 0, max: 10, step: 3, onChange: () => {} });

        const field = slider.querySelector('input') as HTMLInputElement;

        expect(field.step).toBe('3');
        expect(field.min).toBe('0');
        expect(field.max).toBe('10');
    });

    it('muestra el valor visible por defecto (showValue=true, VAL-1805)', () => {
        const slider = createSlider({ label: 'Volumen', min: 0, max: 100, value: 35, onChange: () => {} });

        const valueText = slider.querySelector('.slider__value');

        expect(valueText?.textContent).toBe('35');
    });

    it('oculta el valor visible cuando showValue es false pero lo mantiene anunciable (VAL-1805)', () => {
        const slider = createSlider({
            label: 'Volumen',
            min: 0,
            max: 100,
            value: 35,
            showValue: false,
            onChange: () => {},
        });

        const field = slider.querySelector('input') as HTMLInputElement;

        expect(slider.querySelector('.slider__value')).toBeNull();
        expect(field.value).toBe('35');
        expect(field.getAttribute('aria-label')).toBe('Volumen');
    });

    it('aplica el tamaño medium por defecto (VAL-1806)', () => {
        const slider = createSlider({ label: 'Volumen', min: 0, max: 100, onChange: () => {} });

        expect(slider.classList.contains('slider--medium')).toBe(true);
    });

    it('aplica la clase modificadora para cada tamaño soportado (VAL-1806)', () => {
        const small = createSlider({ label: 'Volumen', min: 0, max: 100, size: 'small', onChange: () => {} });
        const large = createSlider({ label: 'Volumen', min: 0, max: 100, size: 'large', onChange: () => {} });

        expect(small.classList.contains('slider--small')).toBe(true);
        expect(large.classList.contains('slider--large')).toBe(true);
    });

    it('usa medium como fallback ante un tamaño no soportado (VAL-1806)', () => {
        const slider = createSlider({
            label: 'Volumen',
            min: 0,
            max: 100,
            // @ts-expect-error valor inválido a propósito para probar el fallback en runtime
            size: 'huge',
            onChange: () => {},
        });

        expect(slider.classList.contains('slider--medium')).toBe(true);
    });

    it('invoca onChange con el valor numérico actual del control', () => {
        const onChange = vi.fn();
        const slider = createSlider({ label: 'Volumen', min: 0, max: 100, onChange });

        const field = slider.querySelector('input') as HTMLInputElement;
        field.value = '60';
        field.dispatchEvent(new Event('input'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(60);
    });

    it('actualiza el valor visible al recibir un evento input', () => {
        const slider = createSlider({ label: 'Volumen', min: 0, max: 100, value: 10, onChange: () => {} });

        const field = slider.querySelector('input') as HTMLInputElement;
        field.value = '80';
        field.dispatchEvent(new Event('input'));

        const valueText = slider.querySelector('.slider__value');

        expect(valueText?.textContent).toBe('80');
    });

    it('deshabilita el control y comunica el estado a tecnologías de asistencia (VAL-1807)', () => {
        const onChange = vi.fn();
        const slider = createSlider({ label: 'Volumen', min: 0, max: 100, disabled: true, onChange });

        const field = slider.querySelector('input') as HTMLInputElement;

        expect(field.disabled).toBe(true);

        field.dispatchEvent(new Event('input'));

        expect(onChange).not.toHaveBeenCalled();
    });

    it('normaliza un value por debajo de min (rama value < min)', () => {
        const slider = createSlider({ label: 'Volumen', min: 10, max: 100, value: 5, onChange: () => {} });
        const field = slider.querySelector('input') as HTMLInputElement;

        expect(field.value).toBe('10');
    });

    it('expone nombre accesible solo mediante ariaLabel sin label visible', () => {
        const slider = createSlider({
            label: undefined,
            ariaLabel: 'Volumen de música',
            min: 0,
            max: 100,
            onChange: () => {},
        });
        const field = slider.querySelector('input') as HTMLInputElement;

        expect(slider.querySelector('.slider__label')).toBeNull();
        expect(field.getAttribute('aria-label')).toBe('Volumen de música');
    });
});
