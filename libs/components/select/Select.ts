import './Select.css';

import { resolveAccessibleName } from '../../shared/accessible-name';
import { isInCatalog } from '../../shared/catalog-value';
import { appendFieldHelperText } from '../../shared/field-helper-text';
import { createIcon } from '../icon';
import {
    DEFAULT_SELECT_SIZE,
    SELECT_ARIA_LABEL_ATTRIBUTE,
    SELECT_BASE_CLASS,
    SELECT_CHANGE_EVENT,
    SELECT_CONTROL_CLASS,
    SELECT_CONTROL_TAG,
    SELECT_EMPTY_OPTIONS_LENGTH,
    SELECT_EMPTY_VALUE,
    SELECT_ERROR_CLASS,
    SELECT_ERROR_ID,
    SELECT_FIELD_CLASS,
    SELECT_FIELD_ID,
    SELECT_FIELD_TAG,
    SELECT_HINT_CLASS,
    SELECT_HINT_ID,
    SELECT_ICON_CLASS,
    SELECT_ICON_NAME,
    SELECT_LABEL_CLASS,
    SELECT_LABEL_TAG,
    SELECT_OPTION_TAG,
    SELECT_PLACEHOLDER_TEXT,
    SELECT_ROOT_TAG,
    SELECT_SIZES,
    SELECT_SIZE_CLASS_PREFIX,
} from './Select.constants';
import type { SelectProps, SelectSize } from './Select.type';

export type { SelectOption, SelectProps } from './Select.type';

function isSelectSize(size: unknown): size is SelectSize {
    return isInCatalog(size, SELECT_SIZES);
}

function resolveSize(size: unknown): SelectSize {
    return isSelectSize(size) ? size : DEFAULT_SELECT_SIZE;
}

export function createSelect(props: SelectProps): HTMLDivElement {
    const { options, value = SELECT_EMPTY_VALUE, label, ariaLabel, disabled = false, hint, error, size, onChange } =
        props;

    const hasOptions = options.length > SELECT_EMPTY_OPTIONS_LENGTH;
    const resolvedSize = resolveSize(size);

    const root = document.createElement(SELECT_ROOT_TAG);
    root.classList.add(SELECT_BASE_CLASS, `${SELECT_SIZE_CLASS_PREFIX}${resolvedSize}`);

    if (label?.trim()) {
        const labelElement = document.createElement(SELECT_LABEL_TAG);
        labelElement.classList.add(SELECT_LABEL_CLASS);
        labelElement.htmlFor = SELECT_FIELD_ID;
        labelElement.textContent = label;
        root.append(labelElement);
    }

    const selectElement = document.createElement(SELECT_FIELD_TAG) as HTMLSelectElement;
    selectElement.classList.add(SELECT_FIELD_CLASS);
    selectElement.id = SELECT_FIELD_ID;

    const accessibleName = resolveAccessibleName(label, ariaLabel);
    if (accessibleName) {
        selectElement.setAttribute(SELECT_ARIA_LABEL_ATTRIBUTE, accessibleName);
    }

    const control = document.createElement(SELECT_CONTROL_TAG);
    control.classList.add(SELECT_CONTROL_CLASS);
    const icon = createIcon({ name: SELECT_ICON_NAME, className: SELECT_ICON_CLASS });

    if (!hasOptions) {
        const placeholderOption = document.createElement(SELECT_OPTION_TAG) as HTMLOptionElement;
        placeholderOption.value = SELECT_EMPTY_VALUE;
        placeholderOption.textContent = SELECT_PLACEHOLDER_TEXT;
        selectElement.append(placeholderOption);
        selectElement.disabled = true;
        control.append(selectElement, icon);
        root.append(control);
        appendFieldHelperText({
            container: root,
            describedElement: selectElement,
            hintClass: SELECT_HINT_CLASS,
            errorClass: SELECT_ERROR_CLASS,
            hintId: SELECT_HINT_ID,
            errorId: SELECT_ERROR_ID,
            hint,
            error,
        });
        return root;
    }

    for (const option of options) {
        const optionElement = document.createElement(SELECT_OPTION_TAG) as HTMLOptionElement;
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        selectElement.append(optionElement);
    }

    selectElement.disabled = disabled;
    selectElement.value = value;

    selectElement.addEventListener(SELECT_CHANGE_EVENT, (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        onChange(target.value);
    });

    control.append(selectElement, icon);
    root.append(control);
    appendFieldHelperText({
        container: root,
        describedElement: selectElement,
        hintClass: SELECT_HINT_CLASS,
        errorClass: SELECT_ERROR_CLASS,
        hintId: SELECT_HINT_ID,
        errorId: SELECT_ERROR_ID,
        hint,
        error,
    });

    return root;
}
