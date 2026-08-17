import './Slider.css';

import {
    DEFAULT_SLIDER_SIZE,
    SLIDER_ARIA_LABEL_ATTRIBUTE,
    SLIDER_BASE_CLASS,
    SLIDER_DEFAULT_STEP,
    SLIDER_FIELD_CLASS,
    SLIDER_FIELD_ID,
    SLIDER_FIELD_TAG,
    SLIDER_INPUT_EVENT,
    SLIDER_LABEL_CLASS,
    SLIDER_LABEL_TAG,
    SLIDER_ROOT_TAG,
    SLIDER_SIZES,
    SLIDER_SIZE_CLASS_PREFIX,
    SLIDER_TYPE_ATTRIBUTE,
    SLIDER_TYPE_RANGE_VALUE,
    SLIDER_VALUE_CLASS,
    SLIDER_VALUE_TAG,
} from './Slider.constants';
import { attachTooltip } from '../tooltip';
import type { SliderProps, SliderSize } from './Slider.type';

export type { SliderProps } from './Slider.type';

function isSliderSize(size: unknown): size is SliderSize {
    return SLIDER_SIZES.includes(size as SliderSize);
}

function resolveSize(size: unknown): SliderSize {
    return isSliderSize(size) ? size : DEFAULT_SLIDER_SIZE;
}

function resolveAccessibleName(label: string | undefined, ariaLabel: string | undefined): string | undefined {
    const trimmedLabel = label?.trim();
    if (trimmedLabel) {
        return trimmedLabel;
    }

    const trimmedAriaLabel = ariaLabel?.trim();
    if (trimmedAriaLabel) {
        return trimmedAriaLabel;
    }

    return undefined;
}

function clampValue(value: number, min: number, max: number): number {
    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }

    return value;
}

export function createSlider(props: SliderProps): HTMLDivElement {
    const {
        value,
        min,
        max,
        step = SLIDER_DEFAULT_STEP,
        label,
        ariaLabel,
        disabled = false,
        showValue = true,
        size,
        onChange,
        tooltip,
    } = props;

    const resolvedSize = resolveSize(size);
    const safeValue = clampValue(value ?? min, min, max);

    const root = document.createElement(SLIDER_ROOT_TAG);
    root.classList.add(SLIDER_BASE_CLASS, `${SLIDER_SIZE_CLASS_PREFIX}${resolvedSize}`);

    if (label?.trim()) {
        const labelElement = document.createElement(SLIDER_LABEL_TAG);
        labelElement.classList.add(SLIDER_LABEL_CLASS);
        labelElement.htmlFor = SLIDER_FIELD_ID;
        labelElement.textContent = label;
        root.append(labelElement);
    }

    const fieldElement = document.createElement(SLIDER_FIELD_TAG) as HTMLInputElement;
    fieldElement.classList.add(SLIDER_FIELD_CLASS);
    fieldElement.id = SLIDER_FIELD_ID;
    fieldElement.setAttribute(SLIDER_TYPE_ATTRIBUTE, SLIDER_TYPE_RANGE_VALUE);
    fieldElement.min = String(min);
    fieldElement.max = String(max);
    fieldElement.step = String(step);
    fieldElement.value = String(safeValue);
    fieldElement.disabled = disabled;

    const accessibleName = resolveAccessibleName(label, ariaLabel);
    if (accessibleName) {
        fieldElement.setAttribute(SLIDER_ARIA_LABEL_ATTRIBUTE, accessibleName);
    }

    root.append(fieldElement);

    let valueElement: HTMLParagraphElement | undefined;
    if (showValue) {
        valueElement = document.createElement(SLIDER_VALUE_TAG);
        valueElement.classList.add(SLIDER_VALUE_CLASS);
        valueElement.textContent = fieldElement.value;
        root.append(valueElement);
    }

    fieldElement.addEventListener(SLIDER_INPUT_EVENT, (event) => {
        const target = event.currentTarget as HTMLInputElement;
        if (target.disabled) {
            return;
        }

        const nextValue = Number(target.value);

        if (valueElement) {
            valueElement.textContent = target.value;
        }

        onChange(nextValue);
    });

    if (tooltip?.trim()) {
        attachTooltip({ target: root, content: tooltip });
    }

    return root;
}
