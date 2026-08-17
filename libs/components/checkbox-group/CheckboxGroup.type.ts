import type { CHECKBOX_GROUP_SIZES } from './CheckboxGroup.constants';

export type CheckboxGroupSize = (typeof CHECKBOX_GROUP_SIZES)[number];

export interface CheckboxGroupOption {
    value: string;
    label: string;

    /** Texto de ayuda contextual opcional. Si se informa, se adjunta como tooltip (hover/foco). */
    tooltip?: string;
}

export interface CheckboxGroupProps {
    /** Conjunto de opciones de selección múltiple independiente. */
    options: CheckboxGroupOption[];

    /** Valores preseleccionados. Si se omite, ninguna opción se marca por defecto (VAL-1203). */
    values?: string[];

    /** Texto de agrupación visible (`<legend>`). */
    legend?: string;

    /** Nombre accesible alternativo cuando no hay `legend` visible. */
    ariaLabel?: string;

    /** Deshabilita todas las opciones del grupo explícitamente. */
    disabled?: boolean;

    /** Texto de ayuda contextual bajo las opciones. */
    hint?: string;

    /** Mensaje de error. Si se informa, marca el grupo como inválido (`aria-invalid`). */
    error?: string;

    /**
     * Tamaño relativo de cada opción (control + etiqueta). Catálogo cerrado, compartido con `ButtonSize`.
     * Por defecto `'medium'` si se omite o si se recibe un valor no soportado en runtime.
     */
    size?: CheckboxGroupSize;

    /** Callback invocado con el conjunto completo de valores seleccionados al cambiar. */
    onChange: (values: string[]) => void;
}
