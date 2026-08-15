import type { APP_ICON_NAMES } from './Icon.constants';

export type IconName = (typeof APP_ICON_NAMES)[number];

export interface IconProps {
    /** Nombre del icono dentro del catálogo local del proyecto. */
    name: IconName;

    /** Clase CSS adicional para adaptar el icono al componente consumidor. */
    className?: string;

    /** Tamaño cuadrado del SVG en px CSS. */
    size?: number;

    /** Color de relleno del SVG. Por defecto hereda `currentColor`. */
    fill?: string;

    /** Nombre accesible. Si se omite, el icono se renderiza como decorativo. */
    ariaLabel?: string;
}
