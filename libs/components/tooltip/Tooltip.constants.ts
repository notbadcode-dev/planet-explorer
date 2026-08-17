export const TOOLTIP_ROOT_TAG = 'div';

export const TOOLTIP_BASE_CLASS = 'tooltip';
export const TOOLTIP_PLACEMENT_CLASS_PREFIX = 'tooltip--';

export const TOOLTIP_PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const;
export const DEFAULT_TOOLTIP_PLACEMENT = TOOLTIP_PLACEMENTS[0];
export const [TOOLTIP_PLACEMENT_TOP, TOOLTIP_PLACEMENT_BOTTOM, TOOLTIP_PLACEMENT_LEFT, TOOLTIP_PLACEMENT_RIGHT] =
    TOOLTIP_PLACEMENTS;

export const TOOLTIP_ID_PREFIX = 'tooltip-';
export const TOOLTIP_ROLE_ATTRIBUTE = 'role';
export const TOOLTIP_ROLE_VALUE = 'tooltip';
export const TOOLTIP_DESCRIBEDBY_ATTRIBUTE = 'aria-describedby';

export const TOOLTIP_EVENT_MOUSEENTER = 'mouseenter';
export const TOOLTIP_EVENT_MOUSELEAVE = 'mouseleave';
export const TOOLTIP_EVENT_FOCUS = 'focus';
export const TOOLTIP_EVENT_BLUR = 'blur';
export const TOOLTIP_EVENT_TOUCHSTART = 'touchstart';
export const TOOLTIP_EVENT_KEYDOWN = 'keydown';
export const TOOLTIP_ESCAPE_KEY = 'Escape';

export const TOOLTIP_COUNTER_START = 0;
export const TOOLTIP_COUNTER_INCREMENT = 1;
export const TOOLTIP_GAP_PX = 8;
export const TOOLTIP_POSITION_UNIT = 'px';
export const TOOLTIP_POSITION_DIVISOR = 2;

/** Debe coincidir con `--motion-delay-tooltip` en `src/styles/_motion.css` (FR-046). */
export const TOOLTIP_SHOW_DELAY_MS = 300;
export const TOOLTIP_REDUCED_MOTION_SHOW_DELAY_MS = 0;
export const TOOLTIP_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const TOOLTIP_TYPEOF_FUNCTION = 'function';
