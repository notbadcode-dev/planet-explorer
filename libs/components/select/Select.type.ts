export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps {
    /** Conjunto cerrado de opciones a elegir. Si está vacío, el control se deshabilita (VAL-1003). */
    options: SelectOption[];

    /** Valor preseleccionado. Se refleja como seleccionado si coincide con una opción existente (VAL-1004). */
    value?: string;

    /** Etiqueta visible asociada al control. */
    label?: string;

    /** Nombre accesible alternativo cuando no hay `label` visible. */
    ariaLabel?: string;

    /** Deshabilita el control explícitamente. */
    disabled?: boolean;

    /** Callback invocado con el valor seleccionado al cambiar. */
    onChange: (value: string) => void;
}
