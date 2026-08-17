import './Select.css';

import { createIcon } from '../icon';
import {
    SELECT_ARIA_LABEL_ATTRIBUTE,
    SELECT_BASE_CLASS,
    SELECT_CHANGE_EVENT,
    SELECT_CONTROL_CLASS,
    SELECT_CONTROL_TAG,
    SELECT_EMPTY_OPTIONS_LENGTH,
    SELECT_EMPTY_VALUE,
    SELECT_FIELD_CLASS,
    SELECT_FIELD_ID,
    SELECT_FIELD_TAG,
    SELECT_ICON_CLASS,
    SELECT_ICON_NAME,
    SELECT_LABEL_CLASS,
    SELECT_LABEL_TAG,
    SELECT_OPTION_TAG,
    SELECT_PLACEHOLDER_TEXT,
    SELECT_ROOT_TAG,
} from './Select.constants';
import type { SelectProps } from './Select.type';

export type { SelectOption, SelectProps } from './Select.type';

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

export function createSelect(props: SelectProps): HTMLDivElement {
    const { options, value = SELECT_EMPTY_VALUE, label, ariaLabel, disabled = false, onChange } = props;

    const hasOptions = options.length > SELECT_EMPTY_OPTIONS_LENGTH;

    const root = document.createElement(SELECT_ROOT_TAG);
    root.classList.add(SELECT_BASE_CLASS);

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

    return root;
}
