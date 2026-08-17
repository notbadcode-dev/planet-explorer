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

    /** Callback invocado con el valor seleccionado al cambiar. */
    onChange: (value: string) => void;
}
