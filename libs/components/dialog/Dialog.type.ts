import type { DIALOG_SIZES } from './Dialog.constants';

export type DialogSize = (typeof DIALOG_SIZES)[number];

export interface DialogProps {
    title: string;
    description?: string;
    content?: HTMLElement | SVGElement | (HTMLElement | SVGElement)[];
    actions?: HTMLElement | HTMLElement[];
    onClose: () => void;
    closeLabel?: string;

    /**
     * Tamaño relativo del diálogo. Catálogo cerrado, compartido con `ButtonSize`.
     * Por defecto `'medium'` si se omite o si se recibe un valor no soportado en runtime.
     */
    size?: DialogSize;
}
