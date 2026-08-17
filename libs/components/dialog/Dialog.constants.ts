export const DIALOG_OVERLAY_TAG = 'div';
export const DIALOG_CONTAINER_TAG = 'div';
export const DIALOG_TITLE_TAG = 'h2';
export const DIALOG_DESCRIPTION_TAG = 'p';
export const DIALOG_SECTION_TAG = 'div';

export const DIALOG_OVERLAY_CLASS = 'dialog';
export const DIALOG_CONTAINER_CLASS = 'dialog__container';
export const DIALOG_TITLE_CLASS = 'dialog__title';
export const DIALOG_DESCRIPTION_CLASS = 'dialog__description';
export const DIALOG_CONTENT_CLASS = 'dialog__content';
export const DIALOG_ACTIONS_CLASS = 'dialog__actions';
export const DIALOG_CONFIRM_ACTIONS_CLASS = 'dialog__confirm-actions';

export const DIALOG_ROLE_ATTRIBUTE = 'role';
export const DIALOG_ROLE_VALUE = 'dialog';
export const DIALOG_MODAL_ATTRIBUTE = 'aria-modal';
export const DIALOG_LABEL_ATTRIBUTE = 'aria-label';
export const DIALOG_TRUE_VALUE = 'true';

export const DIALOG_CANCEL_BUTTON_VARIANT = 'secondary';
export const DIALOG_CLOSE_TEXT_DEFAULT = 'Cerrar';

export const DIALOG_ESCAPE_KEY = 'Escape';
export const DIALOG_TAB_KEY = 'Tab';
export const DIALOG_KEYDOWN_EVENT = 'keydown';
export const DIALOG_EMPTY_COLLECTION_LENGTH = 0;
export const DIALOG_FIRST_FOCUSABLE_INDEX = 0;
export const DIALOG_INITIAL_SCROLL_TOP = 0;
export const DIALOG_LAST_FOCUSABLE_OFFSET = 1;
export const DIALOG_FOCUSABLE_SELECTOR =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const DIALOG_SIZES = ['small', 'medium', 'large'] as const;
export const DEFAULT_DIALOG_SIZE = DIALOG_SIZES[1];
export const DIALOG_SIZE_CLASS_PREFIX = 'dialog--';
