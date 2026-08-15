import { describe, expect, it } from 'vitest';
import { createBadge } from './Badge';

describe('createBadge', () => {
    it('renderiza etiqueta y icono opcional', () => {
        const badge = createBadge({
            label: 'Nuevo',
            icon: 'star',
        });

        expect(badge.textContent).toContain('Nuevo');
        expect(badge.querySelector('svg')).toBeInstanceOf(SVGElement);
    });

    it('renderiza un icono de estado decorativo distinto por variante, sin depender solo del color', () => {
        const variants = ['success', 'warning', 'danger', 'info'] as const;
        const statusIconMarkup = new Set<string>();

        for (const variant of variants) {
            const badge = createBadge({ label: 'Estado', variant });
            const statusIcon = badge.querySelector('.badge__status-icon');

            expect(statusIcon).toBeInstanceOf(SVGElement);
            expect(statusIcon?.getAttribute('aria-hidden')).toBe('true');
            statusIconMarkup.add(statusIcon?.innerHTML ?? '');
        }

        expect(statusIconMarkup.size).toBe(variants.length);
    });

    it('no renderiza icono de estado para la variante default', () => {
        const badge = createBadge({ label: 'Estado' });

        expect(badge.querySelector('.badge__status-icon')).toBeNull();
    });

    it('distingue el icono de estado del icono opcional del consumidor', () => {
        const badge = createBadge({ label: 'Estado', variant: 'danger', icon: 'star' });

        const statusIcon = badge.querySelector('.badge__status-icon');
        const consumerIcon = badge.querySelector('.badge__icon');

        expect(statusIcon).toBeInstanceOf(SVGElement);
        expect(consumerIcon).toBeInstanceOf(SVGElement);
        expect(statusIcon).not.toBe(consumerIcon);
    });
});
