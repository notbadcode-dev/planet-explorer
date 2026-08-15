export const PANEL_ROOT_TAG = 'section';
export const PANEL_HEADER_TAG = 'header';
export const PANEL_TITLE_TAG = 'h3';
export const PANEL_DESCRIPTION_TAG = 'p';
export const PANEL_CONTENT_TAG = 'div';

export const PANEL_BASE_CLASS = 'panel';
export const PANEL_HEADER_CLASS = 'panel__header';
export const PANEL_TITLE_CLASS = 'panel__title';
export const PANEL_DESCRIPTION_CLASS = 'panel__description';
export const PANEL_CONTENT_CLASS = 'panel__content';
export const PANEL_VARIANT_CLASS_PREFIX = 'panel--';

export const PANEL_STATUS_ICON_CLASS = 'panel__status-icon';

export const PANEL_VARIANTS = ['default', 'highlight', 'danger'] as const;
export const DEFAULT_PANEL_VARIANT = PANEL_VARIANTS[0];
export const PANEL_EMPTY_COLLECTION_LENGTH = 0;

/**
 * Diferenciador visual no dependiente del color: cada variante semántica
 * incorpora un icono de estado propio para que la información no se
 * comunique únicamente mediante el color (ver constitution: Accesibilidad).
 */
export const PANEL_VARIANT_STATUS_ICON = {
    default: undefined,
    highlight: 'sparkles',
    danger: 'x-circle',
} as const;
