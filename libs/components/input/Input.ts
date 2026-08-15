import './Input.css';

import {
    INPUT_ARIA_DESCRIBEDBY_ATTRIBUTE,
    INPUT_ARIA_INVALID_ATTRIBUTE,
    INPUT_ARIA_LABEL_ATTRIBUTE,
    INPUT_BASE_CLASS,
    INPUT_EMPTY_COLLECTION_LENGTH,
    INPUT_EMPTY_VALUE,
    INPUT_ERROR_CLASS,
    INPUT_ERROR_ID,
    INPUT_EVENT,
    INPUT_FIELD_CLASS,
    INPUT_FIELD_ID,
    INPUT_FIELD_TAG,
    INPUT_HELPER_TAG,
    INPUT_HINT_CLASS,
    INPUT_HINT_ID,
    INPUT_LABEL_CLASS,
    INPUT_LABEL_TAG,
    INPUT_ROOT_TAG,
    INPUT_SPACE_SEPARATOR,
    INPUT_TRUE_VALUE,
    INPUT_TYPE_ATTRIBUTE,
    INPUT_TYPE_TEXT,
} from './Input.constants';
import type { InputProps } from './Input.type';

export type { InputProps } from './Input.type';

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

export function createInput(props: InputProps): HTMLDivElement {
    const {
        value = INPUT_EMPTY_VALUE,
        placeholder = INPUT_EMPTY_VALUE,
        label,
        ariaLabel,
        hint,
        error,
        disabled = false,
        required = false,
        onInput,
    } = props;

    const root = document.createElement(INPUT_ROOT_TAG);
    root.classList.add(INPUT_BASE_CLASS);

    if (label?.trim()) {
        const labelElement = document.createElement(INPUT_LABEL_TAG);
        labelElement.classList.add(INPUT_LABEL_CLASS);
        labelElement.htmlFor = INPUT_FIELD_ID;
        labelElement.textContent = label;
        root.append(labelElement);
    }

    const inputElement = document.createElement(INPUT_FIELD_TAG) as HTMLInputElement;
    inputElement.classList.add(INPUT_FIELD_CLASS);
    inputElement.id = INPUT_FIELD_ID;
    inputElement.setAttribute(INPUT_TYPE_ATTRIBUTE, INPUT_TYPE_TEXT);
    inputElement.value = value;
    inputElement.placeholder = placeholder;
    inputElement.disabled = disabled;
    inputElement.required = required;

    const accessibleName = resolveAccessibleName(label, ariaLabel);
    if (accessibleName) {
        inputElement.setAttribute(INPUT_ARIA_LABEL_ATTRIBUTE, accessibleName);
    }

    const describedByIds: string[] = [];

    if (hint?.trim()) {
        const hintElement = document.createElement(INPUT_HELPER_TAG);
        hintElement.classList.add(INPUT_HINT_CLASS);
        hintElement.id = INPUT_HINT_ID;
        hintElement.textContent = hint;
        describedByIds.push(INPUT_HINT_ID);
        root.append(hintElement);
    }

    if (error?.trim()) {
        const errorElement = document.createElement(INPUT_HELPER_TAG);
        errorElement.classList.add(INPUT_ERROR_CLASS);
        errorElement.id = INPUT_ERROR_ID;
        errorElement.textContent = error;
        inputElement.setAttribute(INPUT_ARIA_INVALID_ATTRIBUTE, INPUT_TRUE_VALUE);
        describedByIds.push(INPUT_ERROR_ID);
        root.append(errorElement);
    }

    if (describedByIds.length > INPUT_EMPTY_COLLECTION_LENGTH) {
        inputElement.setAttribute(INPUT_ARIA_DESCRIBEDBY_ATTRIBUTE, describedByIds.join(INPUT_SPACE_SEPARATOR));
    }

    inputElement.addEventListener(INPUT_EVENT, (event) => {
        const target = event.currentTarget as HTMLInputElement;
        onInput(target.value);
    });

    root.prepend(inputElement);

    return root;
}
