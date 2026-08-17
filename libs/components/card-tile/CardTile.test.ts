import { describe, expect, it, vi } from 'vitest';
import { createCardTile } from './CardTile';

describe('createCardTile', () => {
    it('lanza error si "title" está vacío o ausente (VAL-901)', () => {
        expect(() =>
            createCardTile({ title: '', icon: 'orbit', onSelect: () => {} }),
        ).toThrow();
        expect(() =>
            // @ts-expect-error prueba deliberada de ausencia de "title" en runtime
            createCardTile({ icon: 'orbit', onSelect: () => {} }),
        ).toThrow();
    });

    it('lanza error si no se aporta "icon" ni "imageSrc" (VAL-902)', () => {
        expect(() => createCardTile({ title: 'Marte', onSelect: () => {} })).toThrow();
    });

    it('no expone estado "seleccionado" persistente propio (VAL-905)', () => {
        const tile = createCardTile({ title: 'Marte', icon: 'orbit', onSelect: () => {} });

        expect(tile.hasAttribute('aria-pressed')).toBe(false);
        expect(tile.hasAttribute('aria-selected')).toBe(false);
        expect(tile.hasAttribute('aria-checked')).toBe(false);
    });

    it('bloquea "onSelect" y comunica "aria-disabled" cuando "locked" es true (VAL-903)', () => {
        const onSelect = vi.fn();
        const tile = createCardTile({ title: 'Marte', icon: 'orbit', locked: true, onSelect });

        expect(tile.getAttribute('aria-disabled')).toBe('true');

        tile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        tile.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        tile.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

        expect(onSelect).not.toHaveBeenCalled();
    });

    it('activa "onSelect" exactamente una vez por clic cuando no está bloqueada (VAL-904)', () => {
        const onSelect = vi.fn();
        const tile = createCardTile({ title: 'Marte', icon: 'orbit', onSelect });

        tile.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('activa "onSelect" exactamente una vez por teclado (Enter/Space) cuando no está bloqueada (VAL-904)', () => {
        const onSelectEnter = vi.fn();
        const tileEnter = createCardTile({ title: 'Marte', icon: 'orbit', onSelect: onSelectEnter });
        tileEnter.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        expect(onSelectEnter).toHaveBeenCalledTimes(1);

        const onSelectSpace = vi.fn();
        const tileSpace = createCardTile({ title: 'Marte', icon: 'orbit', onSelect: onSelectSpace });
        tileSpace.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        expect(onSelectSpace).toHaveBeenCalledTimes(1);
    });

    it('no está bloqueada por defecto (locked omitido)', () => {
        const onSelect = vi.fn();
        const tile = createCardTile({ title: 'Marte', icon: 'orbit', onSelect });

        expect(tile.hasAttribute('aria-disabled')).toBe(false);
        tile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('renderiza el icono exclusivamente mediante Icon, marcado como decorativo (FR-005/FR-006)', () => {
        const tile = createCardTile({ title: 'Marte', icon: 'orbit', onSelect: () => {} });
        const icon = tile.querySelector('svg');

        expect(icon).toBeInstanceOf(SVGElement);
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
        expect(icon?.hasAttribute('aria-label')).toBe(false);
    });

    it('renderiza imagen con "imageSrc" priorizada sobre "icon" cuando ambos están presentes', () => {
        const tile = createCardTile({
            title: 'Marte',
            icon: 'orbit',
            imageSrc: '/marte.png',
            imageAlt: 'Ilustración de Marte',
            onSelect: () => {},
        });

        const image = tile.querySelector('img');
        expect(image).toBeInstanceOf(HTMLImageElement);
        expect(image?.getAttribute('src')).toBe('/marte.png');
        expect(image?.getAttribute('alt')).toBe('Ilustración de Marte');
        expect(tile.querySelector('svg')).toBeNull();
    });

    it('renderiza el Badge de estado cuando se aporta "statusLabel"', () => {
        const tile = createCardTile({
            title: 'Marte',
            icon: 'orbit',
            statusLabel: 'Descubierto',
            statusVariant: 'success',
            onSelect: () => {},
        });

        expect(tile.textContent).toContain('Descubierto');
    });

    it('no renderiza Badge de estado cuando "statusLabel" está ausente', () => {
        const tile = createCardTile({ title: 'Marte', icon: 'orbit', onSelect: () => {} });

        expect(tile.querySelector('.card-tile__status')).toBeNull();
    });

    it('es enfocable mediante teclado (role="button" y tabindex="0")', () => {
        const tile = createCardTile({ title: 'Marte', icon: 'orbit', onSelect: () => {} });

        expect(tile.getAttribute('role')).toBe('button');
        expect(tile.getAttribute('tabindex')).toBe('0');
    });

    it('prioriza imageSrc sobre icon cuando ambos están presentes', () => {
        const tile = createCardTile({
            title: 'Tierra',
            icon: 'orbit',
            imageSrc: 'https://example.com/earth.jpg',
            imageAlt: 'Tierra',
            onSelect: () => {},
        });

        const image = tile.querySelector('img');
        const icon = tile.querySelector('.card-tile__icon');

        expect(image).not.toBeNull();
        expect(icon).toBeNull();
    });

    it('renderiza statusVariant warning', () => {
        const tile = createCardTile({
            title: 'Venus',
            icon: 'orbit',
            statusLabel: 'Progreso limitado',
            statusVariant: 'warning',
            onSelect: () => {},
        });

        const badge = tile.querySelector('.card-tile__status');
        expect(badge?.classList.contains('badge--warning')).toBe(true);
    });

    it('renderiza statusVariant danger', () => {
        const tile = createCardTile({
            title: 'Plutón',
            icon: 'orbit',
            statusLabel: 'No explorado',
            statusVariant: 'danger',
            onSelect: () => {},
        });

        const badge = tile.querySelector('.card-tile__status');
        expect(badge?.classList.contains('badge--danger')).toBe(true);
    });

    it('renderiza statusVariant info', () => {
        const tile = createCardTile({
            title: 'Mercurio',
            icon: 'orbit',
            statusLabel: 'En investigación',
            statusVariant: 'info',
            onSelect: () => {},
        });

        const badge = tile.querySelector('.card-tile__status');
        expect(badge?.classList.contains('badge--info')).toBe(true);
    });

    it('tolera statusLabel sin statusVariant (undefined)', () => {
        const tile = createCardTile({
            title: 'Júpiter',
            icon: 'orbit',
            statusLabel: 'Descubierto',
            statusVariant: undefined,
            onSelect: () => {},
        });

        const badge = tile.querySelector('.card-tile__status');
        expect(badge).not.toBeNull();
    });

    it('adjunta tooltip cuando se proporciona', () => {
        const tile = createCardTile({
            title: 'Marte',
            icon: 'orbit',
            onSelect: () => {},
            tooltip: 'Cuarto planeta',
        });

        expect(tile.getAttribute('aria-describedby')).not.toBeNull();
    });
});
