import './Dialog.css';

import {
    DIALOG_ACTIONS_CLASS,
    DIALOG_CLICK_EVENT,
    DIALOG_CLOSE_CLASS,
    DIALOG_CLOSE_TAG,
    DIALOG_CLOSE_TEXT_DEFAULT,
    DIALOG_CLOSE_TYPE_ATTRIBUTE,
    DIALOG_CLOSE_TYPE_BUTTON,
    DIALOG_CONTAINER_CLASS,
    DIALOG_CONTAINER_TAG,
    DIALOG_CONTENT_CLASS,
    DIALOG_DESCRIPTION_CLASS,
    DIALOG_DESCRIPTION_TAG,
    DIALOG_EMPTY_COLLECTION_LENGTH,
    DIALOG_ESCAPE_KEY,
    DIALOG_KEYDOWN_EVENT,
    DIALOG_LABEL_ATTRIBUTE,
    DIALOG_MODAL_ATTRIBUTE,
    DIALOG_OVERLAY_CLASS,
    DIALOG_OVERLAY_TAG,
    DIALOG_ROLE_ATTRIBUTE,
    DIALOG_ROLE_VALUE,
    DIALOG_SECTION_TAG,
    DIALOG_TITLE_CLASS,
    DIALOG_TITLE_TAG,
    DIALOG_TRUE_VALUE,
} from './Dialog.constants';
import type { DialogProps } from './Dialog.type';

export type { DialogProps } from './Dialog.type';

function toNodes(content: HTMLElement | HTMLElement[] | undefined): HTMLElement[] {
    if (!content) {
        return [];
    }

    return Array.isArray(content) ? content : [content];
}

export function createDialog(props: DialogProps): HTMLElement {
    const { title, description, content, actions, onClose, closeLabel = DIALOG_CLOSE_TEXT_DEFAULT } = props;

    const overlay = document.createElement(DIALOG_OVERLAY_TAG);
    overlay.classList.add(DIALOG_OVERLAY_CLASS);

    const dialog = document.createElement(DIALOG_CONTAINER_TAG);
    dialog.classList.add(DIALOG_CONTAINER_CLASS);
    dialog.setAttribute(DIALOG_ROLE_ATTRIBUTE, DIALOG_ROLE_VALUE);
    dialog.setAttribute(DIALOG_MODAL_ATTRIBUTE, DIALOG_TRUE_VALUE);
    dialog.setAttribute(DIALOG_LABEL_ATTRIBUTE, title);

    const titleElement = document.createElement(DIALOG_TITLE_TAG);
    titleElement.classList.add(DIALOG_TITLE_CLASS);
    titleElement.textContent = title;
    dialog.append(titleElement);

    if (description?.trim()) {
        const descriptionElement = document.createElement(DIALOG_DESCRIPTION_TAG);
        descriptionElement.classList.add(DIALOG_DESCRIPTION_CLASS);
        descriptionElement.textContent = description;
        dialog.append(descriptionElement);
    }

    const contentElements = toNodes(content);
    if (contentElements.length > DIALOG_EMPTY_COLLECTION_LENGTH) {
        const contentContainer = document.createElement(DIALOG_SECTION_TAG);
        contentContainer.classList.add(DIALOG_CONTENT_CLASS);
        contentContainer.append(...contentElements);
        dialog.append(contentContainer);
    }

    const actionsContainer = document.createElement(DIALOG_SECTION_TAG);
    actionsContainer.classList.add(DIALOG_ACTIONS_CLASS);

    const closeButton = document.createElement(DIALOG_CLOSE_TAG);
    closeButton.classList.add(DIALOG_CLOSE_CLASS);
    closeButton.setAttribute(DIALOG_CLOSE_TYPE_ATTRIBUTE, DIALOG_CLOSE_TYPE_BUTTON);
    closeButton.textContent = closeLabel;
    closeButton.addEventListener(DIALOG_CLICK_EVENT, () => onClose());
    actionsContainer.append(closeButton);

    const actionElements = toNodes(actions);
    if (actionElements.length > DIALOG_EMPTY_COLLECTION_LENGTH) {
        actionsContainer.append(...actionElements);
    }

    dialog.append(actionsContainer);

    dialog.addEventListener(DIALOG_KEYDOWN_EVENT, (event) => {
        if (event.key === DIALOG_ESCAPE_KEY) {
            onClose();
        }
    });

    overlay.append(dialog);

    return overlay;
}
