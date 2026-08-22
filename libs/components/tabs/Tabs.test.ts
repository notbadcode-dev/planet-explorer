import { describe, expect, it, vi } from 'vitest';
import { createTabs } from './Tabs';

function createPanel(text: string): HTMLParagraphElement {
    const element = document.createElement('p');
    element.textContent = text;
    return element;
}

function buildTabs() {
    return [
        { id: 'facts', label: 'Datos', panel: createPanel('Contenido de datos') },
        { id: 'trivia', label: 'Curiosidades', panel: createPanel('Contenido de curiosidades') },
        { id: 'quiz', label: 'Quiz', panel: createPanel('Contenido de quiz') },
    ];
}

/**
 * Acceso indexado con garantía de presencia para arrays de elementos del DOM
 * construidos con longitud fija conocida en el propio test (ej. 3 pestañas).
 * Evita silenciar `noUncheckedIndexedAccess` con `!` y falla rápido y con
 * contexto si el índice esperado no existe.
 */
function nth<T>(items: readonly T[], index: number): T {
    const item = items[index];
    if (item === undefined) {
        throw new Error('Índice ' + index + ' fuera de rango (longitud ' + items.length + ')');
    }
    return item;
}

describe('createTabs', () => {
    it('asocia cada pestaña con exactamente un panel vía aria-controls/aria-labelledby (VAL-1301)', () => {
        const tabs = createTabs({ tabs: buildTabs() });
        const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];
        const panels = Array.from(tabs.querySelectorAll('[role="tabpanel"]')) as HTMLDivElement[];

        tabButtons.forEach((tabButton, index) => {
            const controlledId = tabButton.getAttribute('aria-controls');
            const panel = nth(panels, index);

            expect(controlledId).toBe(panel.id);
            expect(panel.getAttribute('aria-labelledby')).toBe(tabButton.id);
        });
    });

    it('solo el panel de la pestaña activa es visible; los demás permanecen ocultos (VAL-1302)', () => {
        const tabs = createTabs({ tabs: buildTabs(), activeTabId: 'trivia' });
        const panels = Array.from(tabs.querySelectorAll('[role="tabpanel"]')) as HTMLDivElement[];

        expect(nth(panels, 0).hidden).toBe(true);
        expect(nth(panels, 1).hidden).toBe(false);
        expect(nth(panels, 2).hidden).toBe(true);
    });

    it('tolera una pestaña sin panel asociado sin romper la navegación (VAL-1304)', () => {
        const tabsData = [
            { id: 'facts', label: 'Datos' },
            { id: 'trivia', label: 'Curiosidades' },
        ] as unknown as ReturnType<typeof buildTabs>;

        expect(() => createTabs({ tabs: tabsData })).not.toThrow();

        const tabs = createTabs({ tabs: tabsData });
        const panels = Array.from(tabs.querySelectorAll('[role="tabpanel"]')) as HTMLDivElement[];
        expect(nth(panels, 0).childElementCount).toBe(0);
    });

    it('actualiza aria-selected y visibilidad al hacer clic en una pestaña', () => {
        const onChange = vi.fn();
        const tabs = createTabs({ tabs: buildTabs(), onChange });
        const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];

        nth(tabButtons, 2).click();

        expect(nth(tabButtons, 2).getAttribute('aria-selected')).toBe('true');
        expect(nth(tabButtons, 0).getAttribute('aria-selected')).toBe('false');
        expect(onChange).toHaveBeenCalledWith('quiz');
    });

    it('mueve el foco entre pestañas con las flechas izquierda/derecha (VAL-1303)', () => {
        const tabs = createTabs({ tabs: buildTabs() });
        document.body.append(tabs);

        const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];
        const list = tabs.querySelector('[role="tablist"]') as HTMLDivElement;

        nth(tabButtons, 0).focus();
        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        expect(document.activeElement).toBe(nth(tabButtons, 1));
        expect(nth(tabButtons, 1).getAttribute('aria-selected')).toBe('true');

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        expect(document.activeElement).toBe(nth(tabButtons, 0));
        expect(nth(tabButtons, 0).getAttribute('aria-selected')).toBe('true');

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        expect(document.activeElement).toBe(nth(tabButtons, 2));

        tabs.remove();
    });

    it('omite las pestañas deshabilitadas en clic, teclado y navegación con flechas (FR-041)', () => {
        const onChange = vi.fn();
        const tabsData = [
            { id: 'facts', label: 'Datos', panel: createPanel('Contenido de datos') },
            { id: 'trivia', label: 'Curiosidades', panel: createPanel('Contenido de curiosidades'), disabled: true },
            { id: 'quiz', label: 'Quiz', panel: createPanel('Contenido de quiz') },
        ];

        const tabs = createTabs({ tabs: tabsData, onChange });
        document.body.append(tabs);

        const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];
        expect(nth(tabButtons, 1).getAttribute('aria-disabled')).toBe('true');

        nth(tabButtons, 1).dispatchEvent(new Event('click'));
        expect(onChange).not.toHaveBeenCalled();

        const list = tabs.querySelector('[role="tablist"]') as HTMLDivElement;
        nth(tabButtons, 0).focus();
        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

        expect(document.activeElement).toBe(nth(tabButtons, 2));
        expect(nth(tabButtons, 2).getAttribute('aria-selected')).toBe('true');

        tabs.remove();
    });

    it('permite navegar con Tab entre pestañas habilitadas y excluye las deshabilitadas del orden de tabulación', () => {
        const tabsData = [
            { id: 'facts', label: 'Datos', panel: createPanel('Contenido de datos') },
            { id: 'trivia', label: 'Curiosidades', panel: createPanel('Contenido de curiosidades'), disabled: true },
            { id: 'quiz', label: 'Quiz', panel: createPanel('Contenido de quiz') },
        ];

        const tabs = createTabs({ tabs: tabsData });
        const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];

        expect(nth(tabButtons, 0).tabIndex).toBe(0);
        expect(nth(tabButtons, 1).tabIndex).toBe(-1);
        expect(nth(tabButtons, 2).tabIndex).toBe(0);
    });

    it('mantiene el tabIndex de cada pestaña habilitada al cambiar la pestaña activa (no usa roving tabindex)', () => {
        const onChange = vi.fn();
        const tabs = createTabs({ tabs: buildTabs(), onChange });
        const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];

        nth(tabButtons, 2).click();

        expect(nth(tabButtons, 0).tabIndex).toBe(0);
        expect(nth(tabButtons, 1).tabIndex).toBe(0);
        expect(nth(tabButtons, 2).tabIndex).toBe(0);
    });

    it('renderiza un icono decorativo por pestaña cuando todas lo definen (FR-042)', () => {
        const tabsData = [
            { id: 'facts', label: 'Datos', panel: createPanel('Contenido'), icon: 'star' as const },
            { id: 'trivia', label: 'Curiosidades', panel: createPanel('Contenido'), icon: 'orbit' as const },
        ];

        const tabs = createTabs({ tabs: tabsData });
        const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];

        expect(nth(tabButtons, 0).querySelector('svg')).not.toBeNull();
        expect(nth(tabButtons, 1).querySelector('svg')).not.toBeNull();
    });

    it('lanza un error si solo algunas pestañas definen icon (validación todo-o-nada, FR-042)', () => {
        const tabsData = [
            { id: 'facts', label: 'Datos', panel: createPanel('Contenido'), icon: 'star' as const },
            { id: 'trivia', label: 'Curiosidades', panel: createPanel('Contenido') },
        ];

        expect(() => createTabs({ tabs: tabsData })).toThrow(
            'createTabs: todas las pestañas deben definir "icon", o ninguna debe hacerlo.',
        );
    });
});
