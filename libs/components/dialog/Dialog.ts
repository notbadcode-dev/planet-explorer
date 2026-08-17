import './Dialog.css';

import {
    DEFAULT_DIALOG_SIZE,
    DIALOG_ACTIONS_CLASS,
    DIALOG_CANCEL_BUTTON_VARIANT,
    DIALOG_CLOSE_TEXT_DEFAULT,
    DIALOG_CONFIRM_ACTIONS_CLASS,
    DIALOG_CONTAINER_CLASS,
    DIALOG_CONTAINER_TAG,
    DIALOG_CONTENT_CLASS,
    DIALOG_DESCRIPTION_CLASS,
    DIALOG_DESCRIPTION_TAG,
    DIALOG_EMPTY_COLLECTION_LENGTH,
    DIALOG_ESCAPE_KEY,
    DIALOG_FIRST_FOCUSABLE_INDEX,
    DIALOG_FOCUSABLE_SELECTOR,
    DIALOG_INITIAL_SCROLL_TOP,
    DIALOG_KEYDOWN_EVENT,
    DIALOG_LABEL_ATTRIBUTE,
    DIALOG_LAST_FOCUSABLE_OFFSET,
    DIALOG_MODAL_ATTRIBUTE,
    DIALOG_OVERLAY_CLASS,
    DIALOG_OVERLAY_TAG,
    DIALOG_ROLE_ATTRIBUTE,
    DIALOG_ROLE_VALUE,
    DIALOG_SECTION_TAG,
    DIALOG_SIZES,
    DIALOG_SIZE_CLASS_PREFIX,
    DIALOG_TAB_KEY,
    DIALOG_TITLE_CLASS,
    DIALOG_TITLE_TAG,
    DIALOG_TRUE_VALUE,
} from './Dialog.constants';
import type { DialogProps, DialogSize } from './Dialog.type';
import { createButton } from '../button';

export type { DialogProps, DialogSize } from './Dialog.type';

function toNodes(content: HTMLElement | HTMLElement[] | undefined): HTMLElement[] {
    if (!content) {
        return [];
    }

    return Array.isArray(content) ? content : [content];
}

function isDialogSize(size: unknown): size is DialogSize {
    return DIALOG_SIZES.includes(size as DialogSize);
}

function resolveSize(size: unknown): DialogSize {
    return isDialogSize(size) ? size : DEFAULT_DIALOG_SIZE;
}

export function createDialog(props: DialogProps): HTMLElement {
    const { title, description, content, actions, onClose, closeLabel = DIALOG_CLOSE_TEXT_DEFAULT, size } = props;
    const invokerElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const resolvedSize = resolveSize(size);

    const overlay = document.createElement(DIALOG_OVERLAY_TAG);
    overlay.classList.add(DIALOG_OVERLAY_CLASS);

    const dialog = document.createElement(DIALOG_CONTAINER_TAG);
    dialog.classList.add(DIALOG_CONTAINER_CLASS, `${DIALOG_SIZE_CLASS_PREFIX}${resolvedSize}`);
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

    function restoreFocusToInvoker(): void {
        if (invokerElement && document.contains(invokerElement)) {
            invokerElement.focus();
        }
    }

    function handleClose(): void {
        onClose();
        restoreFocusToInvoker();
    }

    const closeButton = createButton({
        label: closeLabel,
        variant: DIALOG_CANCEL_BUTTON_VARIANT,
        onClick: handleClose,
    });
    actionsContainer.append(closeButton);

    const actionElements = toNodes(actions);
    if (actionElements.length > DIALOG_EMPTY_COLLECTION_LENGTH) {
        const confirmActionsContainer = document.createElement(DIALOG_SECTION_TAG);
        confirmActionsContainer.classList.add(DIALOG_CONFIRM_ACTIONS_CLASS);
        confirmActionsContainer.append(...actionElements);
        actionsContainer.append(confirmActionsContainer);
    }

    dialog.append(actionsContainer);

    function getFocusableElements(): HTMLElement[] {
        return Array.from(dialog.querySelectorAll<HTMLElement>(DIALOG_FOCUSABLE_SELECTOR));
    }

    function trapFocus(event: KeyboardEvent): void {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === DIALOG_EMPTY_COLLECTION_LENGTH) {
            return;
        }

        const firstFocusable = focusableElements[DIALOG_FIRST_FOCUSABLE_INDEX];
        const lastFocusable = focusableElements[focusableElements.length - DIALOG_LAST_FOCUSABLE_OFFSET];

        if (event.shiftKey && document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
        }
    }

    dialog.addEventListener(DIALOG_KEYDOWN_EVENT, (event) => {
        if (event.key === DIALOG_ESCAPE_KEY) {
            handleClose();
            return;
        }

        if (event.key === DIALOG_TAB_KEY) {
            trapFocus(event);
        }
    });

    overlay.append(dialog);

    queueMicrotask(() => {
        if (dialog.isConnected) {
            const focusableElements = getFocusableElements();
            // `preventScroll` evita que el foco inicial (a menudo el botón de
            // cierre, al final del contenido) arrastre el scroll interno del
            // diálogo hacia abajo, ocultando el título cuando el contenido no
            // cabe entero. El diálogo debe abrirse siempre mostrando su parte
            // superior.
            (focusableElements[DIALOG_FIRST_FOCUSABLE_INDEX] ?? closeButton).focus({ preventScroll: true });
            dialog.scrollTop = DIALOG_INITIAL_SCROLL_TOP;
        }
    });

    return overlay;
}
