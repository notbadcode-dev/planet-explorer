import type { TOAST_VARIANTS } from './Toast.constants';

export type ToastVariant = (typeof TOAST_VARIANTS)[number];

export interface ToastProps {
    /** Mensaje breve de feedback transitorio. */
    message: string;

    /** Variante visual semántica. Por defecto `info`. */
    variant?: ToastVariant;

    /** Duración en milisegundos antes del auto-descarte. Por defecto `4000` (VAL-1501). */
    durationMs?: number;

    /** Callback invocado tras el auto-descarte. */
    onDismiss?: () => void;
}
