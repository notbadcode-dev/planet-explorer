import './Panel.css';

import {
    DEFAULT_PANEL_VARIANT,
    PANEL_BASE_CLASS,
    PANEL_CONTENT_CLASS,
    PANEL_CONTENT_TAG,
    PANEL_DESCRIPTION_CLASS,
    PANEL_DESCRIPTION_TAG,
    PANEL_HEADER_CLASS,
    PANEL_HEADER_TAG,
    PANEL_ROOT_TAG,
    PANEL_TITLE_CLASS,
    PANEL_TITLE_TAG,
    PANEL_VARIANT_CLASS_PREFIX,
    PANEL_VARIANTS,
} from './Panel.constants';
import type { PanelProps, PanelVariant } from './Panel.type';

export type { PanelProps, PanelVariant } from './Panel.type';

function isPanelVariant(value: unknown): value is PanelVariant {
    return PANEL_VARIANTS.includes(value as PanelVariant);
}

function resolveVariant(value: unknown): PanelVariant {
    return isPanelVariant(value) ? value : DEFAULT_PANEL_VARIANT;
}

function toNodes(content: HTMLElement | HTMLElement[]): HTMLElement[] {
    return Array.isArray(content) ? content : [content];
}

export function createPanel(props: PanelProps): HTMLElement {
    const { title, description, variant, content } = props;

    const panel = document.createElement(PANEL_ROOT_TAG);
    panel.classList.add(PANEL_BASE_CLASS, PANEL_VARIANT_CLASS_PREFIX + resolveVariant(variant));

    if (title?.trim() || description?.trim()) {
        const header = document.createElement(PANEL_HEADER_TAG);
        header.classList.add(PANEL_HEADER_CLASS);

        if (title?.trim()) {
            const titleElement = document.createElement(PANEL_TITLE_TAG);
            titleElement.classList.add(PANEL_TITLE_CLASS);
            titleElement.textContent = title;
            header.append(titleElement);
        }

        if (description?.trim()) {
            const descriptionElement = document.createElement(PANEL_DESCRIPTION_TAG);
            descriptionElement.classList.add(PANEL_DESCRIPTION_CLASS);
            descriptionElement.textContent = description;
            header.append(descriptionElement);
        }

        panel.append(header);
    }

    const contentElement = document.createElement(PANEL_CONTENT_TAG);
    contentElement.classList.add(PANEL_CONTENT_CLASS);
    contentElement.append(...toNodes(content));
    panel.append(contentElement);

    return panel;
}
