import type { BUTTON_ICON_POSITIONS, BUTTON_SIZES, BUTTON_VARIANTS } from './Button.constants';
import type { IconName } from '../icon';

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonIconPosition = (typeof BUTTON_ICON_POSITIONS)[number];

export interface ButtonProps {
    /** Texto visible del botón. Opcional si se proporciona `ariaLabel`. */
    label?: string;

    /**
     * Etiqueta accesible alternativa para tecnologías de asistencia.
     * Obligatoria si `label` no está presente o está vacío.
     */
    ariaLabel?: string;

    /** Acción a ejecutar cuando el botón se activa (clic, o Enter/Espacio con foco). */
    onClick: () => void;

    /** Indica si el botón está deshabilitado. Por defecto `false`. */
    disabled?: boolean;

    /**
     * Énfasis visual/semántico del botón. Catálogo cerrado.
     * Por defecto `'primary'` si se omite o si se recibe un valor no soportado en runtime.
     */
    variant?: ButtonVariant;

    /**
     * Tamaño relativo del botón. Catálogo cerrado.
     * Por defecto `'medium'` si se omite o si se recibe un valor no soportado en runtime.
     */
    size?: ButtonSize;

    /** Icono decorativo opcional del catálogo local de iconos. */
    icon?: IconName;

    /** Posición del icono respecto al texto visible. Por defecto `'start'`. */
    iconPosition?: ButtonIconPosition;

    /** Texto de ayuda contextual opcional. Si se informa, se adjunta como tooltip (hover/foco). */
    tooltip?: string;
}
