import './Input.css';

import { resolveAccessibleName } from '../../shared/accessible-name';
import { isInCatalog } from '../../shared/catalog-value';
import { appendFieldHelperText } from '../../shared/field-helper-text';
import {
    DEFAULT_INPUT_SIZE,
    INPUT_ARIA_LABEL_ATTRIBUTE,
    INPUT_BASE_CLASS,
    INPUT_EMPTY_VALUE,
    INPUT_ERROR_CLASS,
    INPUT_ERROR_ID,
    INPUT_EVENT,
    INPUT_FIELD_CLASS,
    INPUT_FIELD_ID,
    INPUT_FIELD_TAG,
    INPUT_HINT_CLASS,
    INPUT_HINT_ID,
    INPUT_LABEL_CLASS,
    INPUT_LABEL_TAG,
    INPUT_ROOT_TAG,
    INPUT_SIZES,
    INPUT_SIZE_CLASS_PREFIX,
    INPUT_TYPE_ATTRIBUTE,
    INPUT_TYPE_TEXT,
} from './Input.constants';
import type { InputProps, InputSize } from './Input.type';

export type { InputProps, InputSize } from './Input.type';

function isInputSize(size: unknown): size is InputSize {
    return isInCatalog(size, INPUT_SIZES);
}

function resolveSize(size: unknown): InputSize {
    return isInputSize(size) ? size : DEFAULT_INPUT_SIZE;
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
        size,
        onInput,
    } = props;

    const resolvedSize = resolveSize(size);

    const root = document.createElement(INPUT_ROOT_TAG);
    root.classList.add(INPUT_BASE_CLASS, `${INPUT_SIZE_CLASS_PREFIX}${resolvedSize}`);

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

    root.append(inputElement);

    appendFieldHelperText({
        container: root,
        describedElement: inputElement,
        hintClass: INPUT_HINT_CLASS,
        errorClass: INPUT_ERROR_CLASS,
        hintId: INPUT_HINT_ID,
        errorId: INPUT_ERROR_ID,
        hint,
        error,
    });

    inputElement.addEventListener(INPUT_EVENT, (event) => {
        const target = event.currentTarget as HTMLInputElement;
        onInput(target.value);
    });

    return root;
}
