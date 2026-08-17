import './Progress.css';

import {
    PROGRESS_ARIA_LABEL_ATTRIBUTE,
    PROGRESS_BAR_CLASS,
    PROGRESS_BAR_TAG,
    PROGRESS_BASE_CLASS,
    PROGRESS_DEFAULT_MAX,
    PROGRESS_FALLBACK_LABEL,
    PROGRESS_LABEL_CLASS,
    PROGRESS_LABEL_TAG,
    PROGRESS_MIN_VALUE,
    PROGRESS_PERCENT_SUFFIX,
    PROGRESS_ROOT_TAG,
    PROGRESS_VALUE_CLASS,
    PROGRESS_VALUE_TAG,
} from './Progress.constants';
import type { ProgressProps } from './Progress.type';

export type { ProgressProps } from './Progress.type';

function resolveMax(max: number | undefined): number {
    if (!Number.isFinite(max) || max === undefined || max <= PROGRESS_MIN_VALUE) {
        return PROGRESS_DEFAULT_MAX;
    }

    return max;
}

function clampValue(value: number, max: number): number {
    if (value < PROGRESS_MIN_VALUE) {
        return PROGRESS_MIN_VALUE;
    }

    if (value > max) {
        return max;
    }

    return value;
}

function resolveAccessibleLabel(label: string | undefined, ariaLabel: string | undefined): string {
    const trimmedLabel = label?.trim();
    if (trimmedLabel) {
        return trimmedLabel;
    }

    const trimmedAriaLabel = ariaLabel?.trim();
    if (trimmedAriaLabel) {
        return trimmedAriaLabel;
    }

    return PROGRESS_FALLBACK_LABEL;
}

export function createProgress(props: ProgressProps): HTMLElement {
    const { value, max, label, ariaLabel, showValue = true } = props;

    const safeMax = resolveMax(max);
    const safeValue = clampValue(value, safeMax);

    const root = document.createElement(PROGRESS_ROOT_TAG);
    root.classList.add(PROGRESS_BASE_CLASS);

    if (label?.trim()) {
        const labelElement = document.createElement(PROGRESS_LABEL_TAG);
        labelElement.classList.add(PROGRESS_LABEL_CLASS);
        labelElement.textContent = label;
        root.append(labelElement);
    }

    const progressElement = document.createElement(PROGRESS_BAR_TAG) as HTMLProgressElement;
    progressElement.classList.add(PROGRESS_BAR_CLASS);
    progressElement.max = safeMax;
    progressElement.value = safeValue;
    progressElement.setAttribute(PROGRESS_ARIA_LABEL_ATTRIBUTE, resolveAccessibleLabel(label, ariaLabel));
    root.append(progressElement);

    if (showValue) {
        const valueElement = document.createElement(PROGRESS_VALUE_TAG);
        valueElement.classList.add(PROGRESS_VALUE_CLASS);
        valueElement.textContent = String(Math.round((safeValue / safeMax) * PROGRESS_DEFAULT_MAX)) + PROGRESS_PERCENT_SUFFIX;
        root.append(valueElement);
    }

    return root;
}
