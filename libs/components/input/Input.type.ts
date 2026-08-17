import type { INPUT_SIZES } from './Input.constants';

export type InputSize = (typeof INPUT_SIZES)[number];

export interface InputProps {
    value?: string;
    placeholder?: string;
    label?: string;
    ariaLabel?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;

    /**
     * Tamaño relativo del input. Catálogo cerrado, compartido con `ButtonSize`.
     * Por defecto `'medium'` si se omite o si se recibe un valor no soportado en runtime.
     */
    size?: InputSize;
    onInput: (value: string) => void;
}
