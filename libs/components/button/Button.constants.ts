export const BUTTON_VARIANTS = ['primary', 'secondary', 'danger'] as const;
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export const BUTTON_ICON_POSITIONS = ['start', 'end'] as const;

export const DEFAULT_BUTTON_VARIANT = BUTTON_VARIANTS[0];
export const DEFAULT_BUTTON_SIZE = BUTTON_SIZES[1];
export const DEFAULT_BUTTON_ICON_POSITION = BUTTON_ICON_POSITIONS[0];

export const BUTTON_ELEMENT_TAG = 'button';
export const BUTTON_LABEL_ELEMENT_TAG = 'span';
export const BUTTON_TYPE_ATTRIBUTE_VALUE = 'button';
export const BUTTON_ARIA_LABEL_ATTRIBUTE = 'aria-label';
export const BUTTON_CLICK_EVENT = 'click';
export const BUTTON_BASE_CLASS = 'button';
export const BUTTON_ICON_CLASS = 'button__icon';
export const BUTTON_LABEL_CLASS = 'button__label';
export const BUTTON_MODIFIER_CLASS_PREFIX = 'button--';
export const BUTTON_ACCESSIBLE_NAME_ERROR =
    'createButton: se requiere "label" o "ariaLabel" para que el botón tenga un nombre accesible.';
