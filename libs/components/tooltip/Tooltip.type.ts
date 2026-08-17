import type { TOOLTIP_PLACEMENTS } from './Tooltip.constants';

export type TooltipPlacement = (typeof TOOLTIP_PLACEMENTS)[number];

export interface TooltipProps {
    /** Elemento sobre el que se ancla y describe el tooltip. */
    target: HTMLElement;

    /** Texto plano explicativo. */
    content: string;

    /** Posición preferida respecto al elemento asociado. Por defecto `top`. */
    placement?: TooltipPlacement;
}
