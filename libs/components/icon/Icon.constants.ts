import planetDuotoneSvg from '@phosphor-icons/core/duotone/planet-duotone.svg?raw';
import rocketLaunchDuotoneSvg from '@phosphor-icons/core/duotone/rocket-launch-duotone.svg?raw';
import sparkleDuotoneSvg from '@phosphor-icons/core/duotone/sparkle-duotone.svg?raw';
import starDuotoneSvg from '@phosphor-icons/core/duotone/star-duotone.svg?raw';
import trashDuotoneSvg from '@phosphor-icons/core/duotone/trash-duotone.svg?raw';

export const APP_ICON_NAMES = ['orbit', 'rocket', 'sparkles', 'star', 'trash'] as const;

export const APP_ICON_SVGS = {
    orbit: planetDuotoneSvg,
    rocket: rocketLaunchDuotoneSvg,
    sparkles: sparkleDuotoneSvg,
    star: starDuotoneSvg,
    trash: trashDuotoneSvg,
} as const;

export const ICON_BASE_CLASS = 'icon';
export const ICON_CLASS_SEPARATOR = ' ';
export const ICON_TEMPLATE_TAG = 'template';
export const ICON_SVG_SELECTOR = 'svg';
export const ICON_CLASS_ATTRIBUTE = 'class';
export const ICON_WIDTH_ATTRIBUTE = 'width';
export const ICON_HEIGHT_ATTRIBUTE = 'height';
export const ICON_FILL_ATTRIBUTE = 'fill';
export const ICON_ROLE_ATTRIBUTE = 'role';
export const ICON_ROLE_IMAGE_VALUE = 'img';
export const ICON_ARIA_LABEL_ATTRIBUTE = 'aria-label';
export const ICON_ARIA_HIDDEN_ATTRIBUTE = 'aria-hidden';
export const ICON_FOCUSABLE_ATTRIBUTE = 'focusable';
export const ICON_TRUE_ATTRIBUTE_VALUE = 'true';
export const ICON_FALSE_ATTRIBUTE_VALUE = 'false';
export const ICON_DEFAULT_SIZE = 24;
export const ICON_DEFAULT_FILL = 'currentColor';
export const ICON_PARSE_ERROR = 'createIcon: no se ha podido parsear el SVG de Phosphor.';
