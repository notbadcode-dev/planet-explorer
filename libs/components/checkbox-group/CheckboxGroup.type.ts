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

    /** Callback invocado con el conjunto completo de valores seleccionados al cambiar. */
    onChange: (values: string[]) => void;
}
