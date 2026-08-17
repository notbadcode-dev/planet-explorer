import './CheckboxGroup.css';

import { attachTooltip } from '../tooltip';
import {
    CHECKBOX_GROUP_ARIA_LABEL_ATTRIBUTE,
    CHECKBOX_GROUP_BASE_CLASS,
    CHECKBOX_GROUP_CHANGE_EVENT,
    CHECKBOX_GROUP_CONTROL_CLASS,
    CHECKBOX_GROUP_CONTROL_TAG,
    CHECKBOX_GROUP_FIELDSET_TAG,
    CHECKBOX_GROUP_ID_PREFIX,
    CHECKBOX_GROUP_ID_SEPARATOR,
    CHECKBOX_GROUP_INPUT_CLASS,
    CHECKBOX_GROUP_INPUT_TAG,
    CHECKBOX_GROUP_LABEL_CLASS,
    CHECKBOX_GROUP_LABEL_TAG,
    CHECKBOX_GROUP_LEGEND_CLASS,
    CHECKBOX_GROUP_LEGEND_TAG,
    CHECKBOX_GROUP_OPTION_CLASS,
    CHECKBOX_GROUP_OPTION_TAG,
    CHECKBOX_GROUP_TYPE_ATTRIBUTE,
    CHECKBOX_GROUP_TYPE_CHECKBOX,
} from './CheckboxGroup.constants';
import type { CheckboxGroupProps } from './CheckboxGroup.type';

export type { CheckboxGroupOption, CheckboxGroupProps } from './CheckboxGroup.type';

export function createCheckboxGroup(props: CheckboxGroupProps): HTMLFieldSetElement {
    const { options, values, legend, ariaLabel, onChange } = props;

    const selectedValues = new Set(values ?? []);

    const fieldset = document.createElement(CHECKBOX_GROUP_FIELDSET_TAG) as HTMLFieldSetElement;
    fieldset.classList.add(CHECKBOX_GROUP_BASE_CLASS);

    if (legend?.trim()) {
        const legendElement = document.createElement(CHECKBOX_GROUP_LEGEND_TAG);
        legendElement.classList.add(CHECKBOX_GROUP_LEGEND_CLASS);
        legendElement.textContent = legend;
        fieldset.append(legendElement);
    } else if (ariaLabel?.trim()) {
        fieldset.setAttribute(CHECKBOX_GROUP_ARIA_LABEL_ATTRIBUTE, ariaLabel);
    }

    for (const option of options) {
        const optionId = CHECKBOX_GROUP_ID_PREFIX + CHECKBOX_GROUP_ID_SEPARATOR + option.value;

        const optionElement = document.createElement(CHECKBOX_GROUP_OPTION_TAG);
        optionElement.classList.add(CHECKBOX_GROUP_OPTION_CLASS);

        const controlElement = document.createElement(CHECKBOX_GROUP_CONTROL_TAG) as HTMLLabelElement;
        controlElement.classList.add(CHECKBOX_GROUP_CONTROL_CLASS);

        const inputElement = document.createElement(CHECKBOX_GROUP_INPUT_TAG) as HTMLInputElement;
        inputElement.classList.add(CHECKBOX_GROUP_INPUT_CLASS);
        inputElement.setAttribute(CHECKBOX_GROUP_TYPE_ATTRIBUTE, CHECKBOX_GROUP_TYPE_CHECKBOX);
        inputElement.id = optionId;
        inputElement.value = option.value;
        inputElement.checked = selectedValues.has(option.value);

        inputElement.addEventListener(CHECKBOX_GROUP_CHANGE_EVENT, (event) => {
            const target = event.currentTarget as HTMLInputElement;
            if (target.checked) {
                selectedValues.add(option.value);
            } else {
                selectedValues.delete(option.value);
            }
            onChange(Array.from(selectedValues));
        });

        const labelElement = document.createElement(CHECKBOX_GROUP_LABEL_TAG);
        labelElement.classList.add(CHECKBOX_GROUP_LABEL_CLASS);
        labelElement.textContent = option.label;

        controlElement.append(inputElement, labelElement);
        optionElement.append(controlElement);
        fieldset.append(optionElement);

        if (option.tooltip?.trim()) {
            attachTooltip({ target: controlElement, content: option.tooltip });
        }
    }

    return fieldset;
}
