import type { SLIDER_SIZES } from './Slider.constants';

export type SliderSize = (typeof SLIDER_SIZES)[number];

export interface SliderProps {
    /** Valor numérico actual. Opcional; si se omite, se usa `min` como valor por defecto. */
    value?: number;

    /** Límite inferior del rango. Obligatorio. */
    min: number;

    /** Límite superior del rango. Obligatorio. */
    max: number;

    /**
     * Incremento entre valores válidos. Por defecto `1`.
     * Cuando no divide exactamente `[min, max]`, el redondeo al valor alineado
     * más cercano se delega en el comportamiento nativo de `<input type="range">`.
     */
    step?: number;

    /** Texto visible asociado al control. Opcional si se proporciona `ariaLabel`. */
    label?: string;

    /**
     * Etiqueta accesible alternativa para tecnologías de asistencia.
     * Obligatoria si `label` no está presente o está vacío.
     */
    ariaLabel?: string;

    /** Indica si el control está deshabilitado. Por defecto `false`. */
    disabled?: boolean;

    /**
     * Muestra el valor numérico actual como texto visible junto al control.
     * Por defecto `true`. Si es `false`, el valor sigue siendo anunciable
     * por tecnologías de asistencia aunque no se muestre visualmente.
     */
    showValue?: boolean;

    /** Texto de ayuda contextual opcional. Si se informa, se adjunta como tooltip (hover/foco). */
    tooltip?: string;

    /**
     * Tamaño relativo del control. Catálogo cerrado.
     * Por defecto `'medium'` si se omite o si se recibe un valor no soportado en runtime.
     */
    size?: SliderSize;

    /** Notifica el nuevo valor cuando la persona usuaria ajusta el control. */
    onChange: (value: number) => void;
}
