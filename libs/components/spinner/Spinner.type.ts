import type { SPINNER_SIZES } from './Spinner.constants';

export type SpinnerSize = (typeof SPINNER_SIZES)[number];

export interface SpinnerProps {
    /** Texto visible junto al indicador de carga. */
    label?: string;

    /** Nombre accesible alternativo. Por defecto usa `label` o un texto genérico. */
    ariaLabel?: string;

    /** Tamaño relativo. Catálogo cerrado compartido con `Button`. Por defecto `medium`. */
    size?: SpinnerSize;
}
