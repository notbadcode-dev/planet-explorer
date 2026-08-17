export const TOAST_VARIANTS = ['info', 'success', 'warning', 'danger'] as const;
export const DEFAULT_TOAST_VARIANT = TOAST_VARIANTS[0];
export const DEFAULT_TOAST_DURATION_MS = 4000;

export const TOAST_ROOT_TAG = 'div';
export const TOAST_MESSAGE_TAG = 'p';

export const TOAST_CONTAINER_ID = 'toast-container';
export const TOAST_CONTAINER_CLASS = 'toast-container';
export const TOAST_BASE_CLASS = 'toast';
export const TOAST_VARIANT_CLASS_PREFIX = 'toast--';
export const TOAST_MESSAGE_CLASS = 'toast__message';
export const TOAST_STATUS_ICON_CLASS = 'toast__status-icon';
export const TOAST_EXIT_CLASS = 'toast--exit';

/**
 * Diferenciador visual no dependiente del color: cada variante semántica
 * incorpora un icono de estado propio, igual que en Badge (ver constitution:
 * Accesibilidad).
 */
export const TOAST_VARIANT_STATUS_ICON = {
    info: 'info-circle',
    success: 'check-circle',
    warning: 'warning-circle',
    danger: 'x-circle',
} as const;

/** Debe coincidir con `--motion-duration-fast` en `src/styles/_motion.css` (FR-046). */
export const TOAST_EXIT_DURATION_MS = 150;
export const TOAST_MIN_DELAY_MS = 0;

export const TOAST_ROLE_ATTRIBUTE = 'role';
export const TOAST_ROLE_STATUS = 'status';
export const TOAST_ARIA_LIVE_ATTRIBUTE = 'aria-live';
export const TOAST_ARIA_LIVE_POLITE = 'polite';
export const TOAST_TYPEOF_NUMBER = 'number';
