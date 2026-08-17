import './Spinner.css';

import {
    DEFAULT_SPINNER_SIZE,
    SPINNER_ARIA_BUSY_ATTRIBUTE,
    SPINNER_ARIA_BUSY_TRUE,
    SPINNER_ARIA_LABEL_ATTRIBUTE,
    SPINNER_BASE_CLASS,
    SPINNER_DEFAULT_ARIA_LABEL,
    SPINNER_LABEL_CLASS,
    SPINNER_LABEL_TAG,
    SPINNER_ROLE_ATTRIBUTE,
    SPINNER_ROLE_STATUS,
    SPINNER_ROOT_TAG,
    SPINNER_SIZES,
    SPINNER_SIZE_CLASS_PREFIX,
    SPINNER_VISUAL_CLASS,
    SPINNER_VISUAL_TAG,
} from './Spinner.constants';
import type { SpinnerProps, SpinnerSize } from './Spinner.type';

export type { SpinnerProps, SpinnerSize } from './Spinner.type';

function isSpinnerSize(size: unknown): size is SpinnerSize {
    return SPINNER_SIZES.includes(size as SpinnerSize);
}

function resolveSize(size: unknown): SpinnerSize {
    return isSpinnerSize(size) ? size : DEFAULT_SPINNER_SIZE;
}

/**
 * Crea un indicador de carga indeterminada (`role="status"` + `aria-busy="true"`),
 * distinto de la semántica determinada de `Progress`.
 */
export function createSpinner(props: SpinnerProps): HTMLElement {
    const { label, ariaLabel, size } = props;
    const resolvedSize = resolveSize(size);
    const accessibleName = ariaLabel || label || SPINNER_DEFAULT_ARIA_LABEL;

    const root = document.createElement(SPINNER_ROOT_TAG);
    root.classList.add(SPINNER_BASE_CLASS, SPINNER_SIZE_CLASS_PREFIX + resolvedSize);
    root.setAttribute(SPINNER_ROLE_ATTRIBUTE, SPINNER_ROLE_STATUS);
    root.setAttribute(SPINNER_ARIA_BUSY_ATTRIBUTE, SPINNER_ARIA_BUSY_TRUE);
    root.setAttribute(SPINNER_ARIA_LABEL_ATTRIBUTE, accessibleName);

    const visual = document.createElement(SPINNER_VISUAL_TAG);
    visual.classList.add(SPINNER_VISUAL_CLASS);
    root.append(visual);

    if (label) {
        const labelElement = document.createElement(SPINNER_LABEL_TAG);
        labelElement.classList.add(SPINNER_LABEL_CLASS);
        labelElement.textContent = label;
        root.append(labelElement);
    }

    return root;
}
