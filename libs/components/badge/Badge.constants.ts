export const BADGE_ROOT_TAG = 'span';
export const BADGE_LABEL_TAG = 'span';

export const BADGE_BASE_CLASS = 'badge';
export const BADGE_LABEL_CLASS = 'badge__label';
export const BADGE_ICON_CLASS = 'badge__icon';
export const BADGE_STATUS_ICON_CLASS = 'badge__status-icon';
export const BADGE_VARIANT_CLASS_PREFIX = 'badge--';

export const BADGE_VARIANTS = ['default', 'success', 'warning', 'danger', 'info'] as const;
export const DEFAULT_BADGE_VARIANT = BADGE_VARIANTS[0];

/**
 * Diferenciador visual no dependiente del color: cada variante semántica
 * incorpora un icono de estado propio para que la información no se
 * comunique únicamente mediante el color (ver constitution: Accesibilidad).
 */
export const BADGE_VARIANT_STATUS_ICON = {
    default: undefined,
    success: 'check-circle',
    warning: 'warning-circle',
    danger: 'x-circle',
    info: 'info-circle',
} as const;
