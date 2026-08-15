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
});
