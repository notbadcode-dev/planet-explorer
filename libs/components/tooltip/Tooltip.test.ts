import { afterEach, describe, expect, it, vi } from 'vitest';
import { attachTooltip } from './Tooltip';
import { TOOLTIP_SHOW_DELAY_MS } from './Tooltip.constants';

function createTarget(): HTMLButtonElement {
    const target = document.createElement('button');
    target.textContent = 'Ayuda';
    document.body.append(target);
    return target;
}

function getTooltipFor(target: HTMLElement): HTMLElement | null {
    const describedById = target.getAttribute('aria-describedby');
    return describedById ? document.getElementById(describedById) : null;
}

describe('attachTooltip', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.useRealTimers();
    });

    it('expone el contenido mediante aria-describedby sobre el elemento asociado (VAL-1401)', () => {
        const target = createTarget();

        attachTooltip({ target, content: 'Un planeta enano es más pequeño que un planeta.' });

        const tooltip = getTooltipFor(target);
        expect(tooltip).not.toBeNull();
        expect(tooltip?.getAttribute('role')).toBe('tooltip');
        expect(tooltip?.textContent).toBe('Un planeta enano es más pequeño que un planeta.');
    });

    it('se revela con hover de puntero y foco de teclado tras un retraso de 300ms, y se oculta de inmediato al perderlos (VAL-1402, FR-044)', () => {
        vi.useFakeTimers();
        const target = createTarget();
        attachTooltip({ target, content: 'Ayuda contextual' });
        const tooltip = getTooltipFor(target);

        expect(tooltip?.hidden).toBe(true);

        target.dispatchEvent(new Event('mouseenter'));
        expect(tooltip?.hidden).toBe(true);
        vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY_MS);
        expect(tooltip?.hidden).toBe(false);

        target.dispatchEvent(new Event('mouseleave'));
        expect(tooltip?.hidden).toBe(true);

        target.dispatchEvent(new Event('focus'));
        vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY_MS);
        expect(tooltip?.hidden).toBe(false);

        target.dispatchEvent(new Event('blur'));
        expect(tooltip?.hidden).toBe(true);
    });

    it('cancela la revelación programada si el puntero se retira antes de que transcurra el retraso', () => {
        vi.useFakeTimers();
        const target = createTarget();
        attachTooltip({ target, content: 'Ayuda contextual' });
        const tooltip = getTooltipFor(target);

        target.dispatchEvent(new Event('mouseenter'));
        target.dispatchEvent(new Event('mouseleave'));
        vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY_MS);

        expect(tooltip?.hidden).toBe(true);
    });

    it('reduce el retraso a 0 cuando prefers-reduced-motion:reduce está activo (FR-045)', () => {
        vi.useFakeTimers();
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = ((query: string) => ({
            matches: true,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        })) as unknown as typeof window.matchMedia;

        const target = createTarget();
        attachTooltip({ target, content: 'Ayuda contextual' });
        const tooltip = getTooltipFor(target);

        target.dispatchEvent(new Event('mouseenter'));
        vi.advanceTimersByTime(0);
        expect(tooltip?.hidden).toBe(false);

        window.matchMedia = originalMatchMedia;
    });

    it('se soporta sobre elementos deshabilitados sin bloquear la lectura de su contenido (VAL-1404)', () => {
        vi.useFakeTimers();
        const target = createTarget();
        target.disabled = true;

        attachTooltip({ target, content: 'Disponible próximamente' });
        const tooltip = getTooltipFor(target);

        target.dispatchEvent(new Event('mouseenter'));
        vi.advanceTimersByTime(TOOLTIP_SHOW_DELAY_MS);

        expect(tooltip?.hidden).toBe(false);
        expect(tooltip?.textContent).toBe('Disponible próximamente');
        expect(target.getAttribute('aria-describedby')).toBe(tooltip?.id);
    });

    it('se revela/oculta mediante tap-to-toggle en dispositivos táctiles de forma inmediata (VAL-1403)', () => {
        const target = createTarget();
        attachTooltip({ target, content: 'Toca para ver más' });
        const tooltip = getTooltipFor(target);

        expect(tooltip?.hidden).toBe(true);

        target.dispatchEvent(new Event('touchstart', { cancelable: true }));
        expect(tooltip?.hidden).toBe(false);

        target.dispatchEvent(new Event('touchstart', { cancelable: true }));
        expect(tooltip?.hidden).toBe(true);
    });
});
