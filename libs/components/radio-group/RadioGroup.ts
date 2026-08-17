import './RadioGroup.css';

import { attachTooltip } from '../tooltip';
import {
    RADIO_GROUP_ARIA_LABEL_ATTRIBUTE,
    RADIO_GROUP_BASE_CLASS,
    RADIO_GROUP_CHANGE_EVENT,
    RADIO_GROUP_CONTROL_CLASS,
    RADIO_GROUP_CONTROL_TAG,
    RADIO_GROUP_FIELDSET_TAG,
    RADIO_GROUP_ID_SEPARATOR,
    RADIO_GROUP_INPUT_CLASS,
    RADIO_GROUP_INPUT_TAG,
    RADIO_GROUP_LABEL_CLASS,
    RADIO_GROUP_LABEL_TAG,
    RADIO_GROUP_LEGEND_CLASS,
    RADIO_GROUP_LEGEND_TAG,
    RADIO_GROUP_OPTION_CLASS,
    RADIO_GROUP_OPTION_TAG,
    RADIO_GROUP_TYPE_ATTRIBUTE,
    RADIO_GROUP_TYPE_RADIO,
} from './RadioGroup.constants';
import type { RadioGroupProps } from './RadioGroup.type';

export type { RadioGroupOption, RadioGroupProps } from './RadioGroup.type';

export function createRadioGroup(props: RadioGroupProps): HTMLFieldSetElement {
    const { name, options, value, legend, ariaLabel, onChange } = props;

    const fieldset = document.createElement(RADIO_GROUP_FIELDSET_TAG) as HTMLFieldSetElement;
    fieldset.classList.add(RADIO_GROUP_BASE_CLASS);

    if (legend?.trim()) {
        const legendElement = document.createElement(RADIO_GROUP_LEGEND_TAG);
        legendElement.classList.add(RADIO_GROUP_LEGEND_CLASS);
        legendElement.textContent = legend;
        fieldset.append(legendElement);
    } else if (ariaLabel?.trim()) {
        fieldset.setAttribute(RADIO_GROUP_ARIA_LABEL_ATTRIBUTE, ariaLabel);
    }

    for (const option of options) {
        const optionId = name + RADIO_GROUP_ID_SEPARATOR + option.value;

        const optionElement = document.createElement(RADIO_GROUP_OPTION_TAG);
        optionElement.classList.add(RADIO_GROUP_OPTION_CLASS);

        const controlElement = document.createElement(RADIO_GROUP_CONTROL_TAG) as HTMLLabelElement;
        controlElement.classList.add(RADIO_GROUP_CONTROL_CLASS);

        const inputElement = document.createElement(RADIO_GROUP_INPUT_TAG) as HTMLInputElement;
        inputElement.classList.add(RADIO_GROUP_INPUT_CLASS);
        inputElement.setAttribute(RADIO_GROUP_TYPE_ATTRIBUTE, RADIO_GROUP_TYPE_RADIO);
        inputElement.name = name;
        inputElement.id = optionId;
        inputElement.value = option.value;
        inputElement.checked = option.value === value;

        inputElement.addEventListener(RADIO_GROUP_CHANGE_EVENT, (event) => {
            const target = event.currentTarget as HTMLInputElement;
            onChange(target.value);
        });

        const labelElement = document.createElement(RADIO_GROUP_LABEL_TAG);
        labelElement.classList.add(RADIO_GROUP_LABEL_CLASS);
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
