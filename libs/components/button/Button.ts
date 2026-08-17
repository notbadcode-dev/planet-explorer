/**
 * Button — componente "dummy" reutilizable de `libs/components/`.
 *
 * Contrato público: ver
 * `specs/002-button-variants/contracts/button-component.md` (v1.1).
 */

import './Button.css';

import { isInCatalog } from '../../shared/catalog-value';
import {
    BUTTON_ACCESSIBLE_NAME_ERROR,
    BUTTON_ARIA_LABEL_ATTRIBUTE,
    BUTTON_BASE_CLASS,
    BUTTON_CLICK_EVENT,
    BUTTON_ELEMENT_TAG,
    BUTTON_ICON_CLASS,
    BUTTON_ICON_POSITIONS,
    BUTTON_LABEL_CLASS,
    BUTTON_LABEL_ELEMENT_TAG,
    BUTTON_MODIFIER_CLASS_PREFIX,
    BUTTON_SIZES,
    BUTTON_TYPE_ATTRIBUTE_VALUE,
    BUTTON_VARIANTS,
    DEFAULT_BUTTON_ICON_POSITION,
    DEFAULT_BUTTON_SIZE,
    DEFAULT_BUTTON_VARIANT,
} from './Button.constants';
import { createIcon } from '../icon';
import { attachTooltip } from '../tooltip';
import type { ButtonIconPosition, ButtonProps, ButtonSize, ButtonVariant } from './Button.type';

export type { ButtonIconPosition, ButtonProps, ButtonSize, ButtonVariant } from './Button.type';

function isButtonVariant(variant: unknown): variant is ButtonVariant {
    return isInCatalog(variant, BUTTON_VARIANTS);
}

function isButtonSize(size: unknown): size is ButtonSize {
    return isInCatalog(size, BUTTON_SIZES);
}

function isButtonIconPosition(iconPosition: unknown): iconPosition is ButtonIconPosition {
    return isInCatalog(iconPosition, BUTTON_ICON_POSITIONS);
}

function resolveVariant(variant: unknown): ButtonVariant {
    return isButtonVariant(variant) ? variant : DEFAULT_BUTTON_VARIANT;
}

function resolveSize(size: unknown): ButtonSize {
    return isButtonSize(size) ? size : DEFAULT_BUTTON_SIZE;
}

function resolveIconPosition(iconPosition: unknown): ButtonIconPosition {
    return isButtonIconPosition(iconPosition) ? iconPosition : DEFAULT_BUTTON_ICON_POSITION;
}

/**
 * Crea un elemento `<button>` HTML nativo a partir de `ButtonProps`.
 *
 * No contiene lógica de negocio: es una función pura respecto a sus props.
 */
export function createButton(props: ButtonProps): HTMLButtonElement {
    const {
        label,
        ariaLabel,
        onClick,
        disabled = false,
        variant,
        size,
        icon,
        iconPosition,
        tooltip,
    } = props;

    const hasLabel = Boolean(label?.trim());
    const hasAriaLabel = Boolean(ariaLabel?.trim());

    if (!hasLabel && !hasAriaLabel) {
        throw new Error(BUTTON_ACCESSIBLE_NAME_ERROR);
    }

    const resolvedVariant = resolveVariant(variant);
    const resolvedSize = resolveSize(size);
    const resolvedIconPosition = resolveIconPosition(iconPosition);

    const button = document.createElement(BUTTON_ELEMENT_TAG);
    button.type = BUTTON_TYPE_ATTRIBUTE_VALUE;

    const iconElement = icon ? createIcon({ name: icon, className: BUTTON_ICON_CLASS }) : undefined;
    const labelElement = hasLabel ? document.createElement(BUTTON_LABEL_ELEMENT_TAG) : undefined;

    if (labelElement) {
        labelElement.textContent = label as string;
    }

    if (hasAriaLabel) {
        button.setAttribute(BUTTON_ARIA_LABEL_ATTRIBUTE, ariaLabel as string);
    }

    button.disabled = disabled;

    button.classList.add(
        BUTTON_BASE_CLASS,
        `${BUTTON_MODIFIER_CLASS_PREFIX}${resolvedVariant}`,
        `${BUTTON_MODIFIER_CLASS_PREFIX}${resolvedSize}`,
    );

    if (iconElement && resolvedIconPosition === DEFAULT_BUTTON_ICON_POSITION) {
        button.append(iconElement);
    }

    if (labelElement) {
        labelElement.classList.add(BUTTON_LABEL_CLASS);
        button.append(labelElement);
    }

    if (iconElement && resolvedIconPosition !== DEFAULT_BUTTON_ICON_POSITION) {
        button.append(iconElement);
    }

    button.addEventListener(BUTTON_CLICK_EVENT, () => {
        if (button.disabled) {
            return;
        }
        onClick();
    });

    if (tooltip?.trim()) {
        attachTooltip({ target: button, content: tooltip });
    }

    return button;
}
