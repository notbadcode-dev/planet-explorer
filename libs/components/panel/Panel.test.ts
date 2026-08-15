import { describe, expect, it } from 'vitest';
import { createPanel } from './Panel';
import { PANEL_VARIANTS, PANEL_BASE_CLASS } from './Panel.constants';

describe('createPanel', () => {
    it('renderiza contenido compuesto preservando orden', () => {
        const first = document.createElement('div');
        first.textContent = 'Primero';

        const second = document.createElement('div');
        second.textContent = 'Segundo';

        const panel = createPanel({
            title: 'Resumen',
            content: [first, second],
        });

        const content = panel.querySelector('.panel__content');

        expect(content?.children[0]?.textContent).toBe('Primero');
        expect(content?.children[1]?.textContent).toBe('Segundo');
    });

    it('renderiza título cuando está presente', () => {
        const panel = createPanel({
            title: 'Encabezado del Panel',
            content: document.createElement('div'),
        });

        const header = panel.querySelector('.panel__header');

        expect(header?.textContent).toBe('Encabezado del Panel');
    });

    it('omite título cuando no está presente', () => {
        const panel = createPanel({
            content: document.createElement('div'),
        });

        const header = panel.querySelector('.panel__header');

        expect(header).toBeNull();
    });

    it('aplica clase de variante a la sección raíz', () => {
        const variantToTest = PANEL_VARIANTS[0];

        const panel = createPanel({
            variant: variantToTest,
            title: 'Test',
            content: document.createElement('div'),
        });

        expect(panel.classList.contains(PANEL_BASE_CLASS)).toBe(true);
        expect(panel.classList.contains(`panel--${variantToTest}`)).toBe(true);
    });

    it('renderiza contenido único o múltiple indistintamente', () => {
        const single = document.createElement('p');
        single.textContent = 'Contenido único';

        const panelSingle = createPanel({
            title: 'Simple',
            content: single,
        });

        const contentSingle = panelSingle.querySelector('.panel__content');

        expect(contentSingle?.children.length).toBe(1);
        expect(contentSingle?.children[0]?.textContent).toBe('Contenido único');

        const multi1 = document.createElement('p');
        multi1.textContent = 'Línea 1';
        const multi2 = document.createElement('p');
        multi2.textContent = 'Línea 2';

        const panelMulti = createPanel({
            title: 'Múltiple',
            content: [multi1, multi2],
        });

        const contentMulti = panelMulti.querySelector('.panel__content');

        expect(contentMulti?.children.length).toBe(2);
    });
});
