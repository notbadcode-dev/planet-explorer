import { describe, expect, it, vi } from 'vitest';
import { createAccordion } from './Accordion';

function createContent(text: string): HTMLElement {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
}

describe('createAccordion', () => {
    it('expone el estado expandido/colapsado de cada sección mediante aria-expanded (VAL-1701)', () => {
        const accordion = createAccordion({
            sections: [
                { id: 'moons', title: '¿Cuántas lunas tiene?', content: createContent('Tiene 2 lunas.') },
                { id: 'rings', title: '¿Tiene anillos?', content: createContent('No tiene anillos.') },
            ],
        });

        const triggers = accordion.querySelectorAll('button');
        expect(triggers).toHaveLength(2);
        expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false');

        triggers[0]?.dispatchEvent(new Event('click'));
        expect(triggers[0]?.getAttribute('aria-expanded')).toBe('true');
    });

    it('tolera una sección con content vacío, permaneciendo expandible/colapsable (VAL-1703)', () => {
        const emptyContent = document.createElement('div');

        const accordion = createAccordion({
            sections: [{ id: 'empty', title: 'Sección vacía', content: emptyContent }],
        });

        const trigger = accordion.querySelector('button');
        trigger?.dispatchEvent(new Event('click'));

        expect(trigger?.getAttribute('aria-expanded')).toBe('true');
        const panel = accordion.querySelector('[role="region"]');
        expect(panel?.hidden).toBe(false);
        expect(panel?.textContent).toBe('');
    });

    it('permite varias secciones expandidas simultáneamente de forma independiente por defecto (VAL-1702)', () => {
        const onToggle = vi.fn();

        const accordion = createAccordion({
            sections: [
                { id: 'a', title: 'A', content: createContent('Contenido A') },
                { id: 'b', title: 'B', content: createContent('Contenido B') },
                { id: 'c', title: 'C', content: createContent('Contenido C') },
            ],
            onToggle,
        });

        const triggers = accordion.querySelectorAll('button');
        triggers[0]?.dispatchEvent(new Event('click'));
        triggers[1]?.dispatchEvent(new Event('click'));

        expect(triggers[0]?.getAttribute('aria-expanded')).toBe('true');
        expect(triggers[1]?.getAttribute('aria-expanded')).toBe('true');
        expect(triggers[2]?.getAttribute('aria-expanded')).toBe('false');
        expect(onToggle).toHaveBeenCalledWith('a', true);
        expect(onToggle).toHaveBeenCalledWith('b', true);
    });

    it('respeta defaultExpandedIds al inicializar', () => {
        const accordion = createAccordion({
            sections: [
                { id: 'a', title: 'A', content: createContent('Contenido A') },
                { id: 'b', title: 'B', content: createContent('Contenido B') },
            ],
            defaultExpandedIds: ['b'],
        });

        const triggers = accordion.querySelectorAll('button');
        expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false');
        expect(triggers[1]?.getAttribute('aria-expanded')).toBe('true');
    });

    it('en modo exclusive, expandir una sección colapsa automáticamente el resto', () => {
        const onToggle = vi.fn();

        const accordion = createAccordion({
            sections: [
                { id: 'a', title: 'A', content: createContent('Contenido A') },
                { id: 'b', title: 'B', content: createContent('Contenido B') },
            ],
            exclusive: true,
            onToggle,
        });

        const triggers = accordion.querySelectorAll('button');
        triggers[0]?.dispatchEvent(new Event('click'));
        expect(triggers[0]?.getAttribute('aria-expanded')).toBe('true');

        triggers[1]?.dispatchEvent(new Event('click'));
        expect(triggers[1]?.getAttribute('aria-expanded')).toBe('true');
        expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false');
        expect(onToggle).toHaveBeenCalledWith('a', false);
    });

    it('sin exclusive (por defecto), expandir una sección no afecta a las demás', () => {
        const accordion = createAccordion({
            sections: [
                { id: 'a', title: 'A', content: createContent('Contenido A') },
                { id: 'b', title: 'B', content: createContent('Contenido B') },
            ],
        });

        const triggers = accordion.querySelectorAll('button');
        triggers[0]?.dispatchEvent(new Event('click'));
        triggers[1]?.dispatchEvent(new Event('click'));

        expect(triggers[0]?.getAttribute('aria-expanded')).toBe('true');
        expect(triggers[1]?.getAttribute('aria-expanded')).toBe('true');
    });

    it('cada cabecera incluye un icono indicador decorativo de expansión/colapso (FR-035)', () => {
        const accordion = createAccordion({
            sections: [{ id: 'a', title: 'A', content: createContent('Contenido A') }],
        });

        const trigger = accordion.querySelector('button');
        const icon = trigger?.querySelector('svg');
        expect(icon).not.toBeNull();
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('el panel expandido no se recrea al hacer toggle, permitiendo su transición CSS (FR-033)', () => {
        const accordion = createAccordion({
            sections: [{ id: 'a', title: 'A', content: createContent('Contenido A') }],
        });

        const trigger = accordion.querySelector('button');
        const panelBefore = accordion.querySelector('[role="region"]');
        trigger?.dispatchEvent(new Event('click'));
        const panelAfter = accordion.querySelector('[role="region"]');

        expect(panelAfter).toBe(panelBefore);
    });

    it('maneja sections vacío sin romper el renderizado', () => {
        const accordion = createAccordion({
            sections: [],
        });

        expect(accordion.childElementCount).toBe(0);
    });

    it('en modo exclusive sin secciones preexpandidas, el usuario puede expandir a su elección', () => {
        const onToggle = vi.fn();
        const accordion = createAccordion({
            sections: [
                { id: 'a', title: 'A', content: createContent('Contenido A') },
                { id: 'b', title: 'B', content: createContent('Contenido B') },
            ],
            exclusive: true,
            defaultExpandedIds: [],
            onToggle,
        });

        const triggerA = accordion.querySelectorAll('button')[0];
        triggerA?.dispatchEvent(new Event('click'));

        expect(onToggle).toHaveBeenCalledWith('a', true);
    });
});
