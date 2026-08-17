import {
    FIELD_HELPER_ARIA_DESCRIBEDBY_ATTRIBUTE,
    FIELD_HELPER_ARIA_INVALID_ATTRIBUTE,
    FIELD_HELPER_ARIA_INVALID_TRUE_VALUE,
    FIELD_HELPER_DESCRIBEDBY_SEPARATOR,
    FIELD_HELPER_EMPTY_COLLECTION_LENGTH,
    FIELD_HELPER_TEXT_TAG,
} from './FieldHelperText.constants';

export interface AppendFieldHelperTextOptions {
    /** Elemento donde se insertan los párrafos de ayuda/error (p. ej. el div raíz de `Select` o el propio `<fieldset>`). */
    container: Element;
    /** Elemento que recibe `aria-invalid`/`aria-describedby` (p. ej. el `<select>`/`<input>` o el propio `<fieldset>`). */
    describedElement: Element;
    hintClass: string;
    errorClass: string;
    hintId: string;
    errorId: string;
    hint: string | undefined;
    error: string | undefined;
}

/**
 * Añade texto de ayuda (`hint`) y/o mensaje de error (`error`) a un control de formulario,
 * vinculándolos vía `aria-describedby` y marcando `aria-invalid="true"` cuando hay error.
 * Lógica compartida por `Select`, `RadioGroup` y `CheckboxGroup` (ver Input para el patrón original).
 */
export function appendFieldHelperText(options: AppendFieldHelperTextOptions): void {
    const { container, describedElement, hintClass, errorClass, hintId, errorId, hint, error } = options;
    const describedByIds: string[] = [];

    if (hint?.trim()) {
        const hintElement = document.createElement(FIELD_HELPER_TEXT_TAG);
        hintElement.classList.add(hintClass);
        hintElement.id = hintId;
        hintElement.textContent = hint;
        describedByIds.push(hintId);
        container.append(hintElement);
    }

    if (error?.trim()) {
        const errorElement = document.createElement(FIELD_HELPER_TEXT_TAG);
        errorElement.classList.add(errorClass);
        errorElement.id = errorId;
        errorElement.textContent = error;
        describedElement.setAttribute(FIELD_HELPER_ARIA_INVALID_ATTRIBUTE, FIELD_HELPER_ARIA_INVALID_TRUE_VALUE);
        describedByIds.push(errorId);
        container.append(errorElement);
    }

    if (describedByIds.length > FIELD_HELPER_EMPTY_COLLECTION_LENGTH) {
        describedElement.setAttribute(
            FIELD_HELPER_ARIA_DESCRIBEDBY_ATTRIBUTE,
            describedByIds.join(FIELD_HELPER_DESCRIBEDBY_SEPARATOR),
        );
    }
}
