import './Accordion.css';

import { createIcon } from '../icon';
import {
    ACCORDION_ARIA_CONTROLS_ATTRIBUTE,
    ACCORDION_ARIA_EXPANDED_ATTRIBUTE,
    ACCORDION_ARIA_LABELLEDBY_ATTRIBUTE,
    ACCORDION_ARROW_DOWN_KEY,
    ACCORDION_ARROW_UP_KEY,
    ACCORDION_BASE_CLASS,
    ACCORDION_BUTTON_TYPE_VALUE,
    ACCORDION_CLICK_EVENT,
    ACCORDION_FALSE_VALUE,
    ACCORDION_HEADING_CLASS,
    ACCORDION_HEADING_TAG,
    ACCORDION_ICON_CLASS,
    ACCORDION_ICON_NAME,
    ACCORDION_ITEM_CLASS,
    ACCORDION_ITEM_TAG,
    ACCORDION_KEYDOWN_EVENT,
    ACCORDION_NEXT_DIRECTION,
    ACCORDION_NOT_FOUND_INDEX,
    ACCORDION_PANEL_CLASS,
    ACCORDION_PANEL_ID_PREFIX,
    ACCORDION_PANEL_TAG,
    ACCORDION_PREVIOUS_DIRECTION,
    ACCORDION_ROLE_ATTRIBUTE,
    ACCORDION_ROLE_REGION,
    ACCORDION_ROOT_TAG,
    ACCORDION_TITLE_CLASS,
    ACCORDION_TITLE_TAG,
    ACCORDION_TRIGGER_CLASS,
    ACCORDION_TRIGGER_ID_PREFIX,
    ACCORDION_TRIGGER_TAG,
    ACCORDION_TRUE_VALUE,
    ACCORDION_TYPE_ATTRIBUTE,
} from './Accordion.constants';
import type { AccordionEntry, AccordionProps } from './Accordion.type';

export type { AccordionProps, AccordionSection } from './Accordion.type';

/**
 * Crea un `Accordion` con secciones expandibles/colapsables. Por defecto
 * permite expansión múltiple independiente (R-026); con `exclusive: true`,
 * expandir una sección colapsa automáticamente el resto.
 */
export function createAccordion(props: AccordionProps): HTMLElement {
    const { sections, defaultExpandedIds = [], exclusive = false, onToggle } = props;

    const root = document.createElement(ACCORDION_ROOT_TAG);
    root.classList.add(ACCORDION_BASE_CLASS);

    const entries: AccordionEntry[] = [];
    const triggers: HTMLButtonElement[] = [];

    function collapseOthers(exceptId: string): void {
        for (const entry of entries) {
            if (entry.id !== exceptId && entry.isExpanded()) {
                entry.collapse();
            }
        }
    }

    for (const section of sections) {
        const { id, title, content } = section;
        const triggerId = ACCORDION_TRIGGER_ID_PREFIX + id;
        const panelId = ACCORDION_PANEL_ID_PREFIX + id;
        let expanded = defaultExpandedIds.includes(id);

        const item = document.createElement(ACCORDION_ITEM_TAG);
        item.classList.add(ACCORDION_ITEM_CLASS);

        const heading = document.createElement(ACCORDION_HEADING_TAG);
        heading.classList.add(ACCORDION_HEADING_CLASS);

        const trigger = document.createElement(ACCORDION_TRIGGER_TAG) as HTMLButtonElement;
        trigger.id = triggerId;
        trigger.classList.add(ACCORDION_TRIGGER_CLASS);
        trigger.setAttribute(ACCORDION_TYPE_ATTRIBUTE, ACCORDION_BUTTON_TYPE_VALUE);
        trigger.setAttribute(ACCORDION_ARIA_CONTROLS_ATTRIBUTE, panelId);
        triggers.push(trigger);

        const titleElement = document.createElement(ACCORDION_TITLE_TAG);
        titleElement.classList.add(ACCORDION_TITLE_CLASS);
        titleElement.textContent = title;

        const icon = createIcon({ name: ACCORDION_ICON_NAME, className: ACCORDION_ICON_CLASS });

        trigger.append(titleElement, icon);

        const panel = document.createElement(ACCORDION_PANEL_TAG);
        panel.id = panelId;
        panel.classList.add(ACCORDION_PANEL_CLASS);
        panel.setAttribute(ACCORDION_ROLE_ATTRIBUTE, ACCORDION_ROLE_REGION);
        panel.setAttribute(ACCORDION_ARIA_LABELLEDBY_ATTRIBUTE, triggerId);
        panel.append(content);

        function render(): void {
            trigger.setAttribute(
                ACCORDION_ARIA_EXPANDED_ATTRIBUTE,
                expanded ? ACCORDION_TRUE_VALUE : ACCORDION_FALSE_VALUE,
            );
            panel.hidden = !expanded;
        }

        trigger.addEventListener(ACCORDION_CLICK_EVENT, () => {
            expanded = !expanded;

            if (exclusive && expanded) {
                collapseOthers(id);
            }

            render();
            onToggle?.(id, expanded);
        });

        entries.push({
            id,
            isExpanded: () => expanded,
            collapse: () => {
                expanded = false;
                render();
                onToggle?.(id, false);
            },
        });

        render();

        heading.append(trigger);
        item.append(heading, panel);
        root.append(item);
    }

    root.addEventListener(ACCORDION_KEYDOWN_EVENT, (event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key !== ACCORDION_ARROW_DOWN_KEY && keyboardEvent.key !== ACCORDION_ARROW_UP_KEY) {
            return;
        }

        const currentIndex = triggers.indexOf(document.activeElement as HTMLButtonElement);
        if (currentIndex === ACCORDION_NOT_FOUND_INDEX) {
            return;
        }

        keyboardEvent.preventDefault();

        const direction =
            keyboardEvent.key === ACCORDION_ARROW_DOWN_KEY ? ACCORDION_NEXT_DIRECTION : ACCORDION_PREVIOUS_DIRECTION;
        const nextIndex = (currentIndex + direction + triggers.length) % triggers.length;
        triggers[nextIndex]?.focus();
    });

    return root;
}
