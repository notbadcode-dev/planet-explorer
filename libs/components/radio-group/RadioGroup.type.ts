import type { RADIO_GROUP_SIZES } from './RadioGroup.constants';

export type RadioGroupSize = (typeof RADIO_GROUP_SIZES)[number];

export interface RadioGroupOption {
    value: string;
    label: string;

    /** Texto de ayuda contextual opcional. Si se informa, se adjunta como tooltip (hover/foco). */
    tooltip?: string;
}

export interface RadioGroupProps {
    /** Nombre nativo compartido por todas las opciones, garantiza exclusividad (VAL-1101). */
    name: string;

    /** Conjunto de opciones de selección única. */
    options: RadioGroupOption[];

    /** Valor preseleccionado. Si se omite, ninguna opción se marca por defecto (VAL-1103). */
    value?: string;

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
    size?: RadioGroupSize;

    /** Callback invocado con el valor seleccionado al cambiar. */
    onChange: (value: string) => void;
}
