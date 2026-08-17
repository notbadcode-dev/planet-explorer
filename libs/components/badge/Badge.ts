import './Badge.css';

import { createIcon } from '../icon';
import { attachTooltip } from '../tooltip';
import {
    BADGE_BASE_CLASS,
    BADGE_ICON_CLASS,
    BADGE_LABEL_CLASS,
    BADGE_LABEL_TAG,
    BADGE_ROOT_TAG,
    BADGE_STATUS_ICON_CLASS,
    BADGE_VARIANT_CLASS_PREFIX,
    BADGE_VARIANT_STATUS_ICON,
    BADGE_VARIANTS,
    DEFAULT_BADGE_VARIANT,
} from './Badge.constants';
import type { BadgeProps, BadgeVariant } from './Badge.type';

export type { BadgeProps, BadgeVariant } from './Badge.type';

function isBadgeVariant(value: unknown): value is BadgeVariant {
    return BADGE_VARIANTS.includes(value as BadgeVariant);
}

function resolveVariant(value: unknown): BadgeVariant {
    return isBadgeVariant(value) ? value : DEFAULT_BADGE_VARIANT;
}

export function createBadge(props: BadgeProps): HTMLElement {
    const { label, variant, icon, tooltip } = props;
    const resolvedVariant = resolveVariant(variant);

    const badge = document.createElement(BADGE_ROOT_TAG);
    badge.classList.add(BADGE_BASE_CLASS, BADGE_VARIANT_CLASS_PREFIX + resolvedVariant);

    const statusIconName = BADGE_VARIANT_STATUS_ICON[resolvedVariant];
    if (statusIconName) {
        const statusIconElement = createIcon({ name: statusIconName, className: BADGE_STATUS_ICON_CLASS });
        badge.append(statusIconElement);
    }

    if (icon) {
        const iconElement = createIcon({ name: icon, className: BADGE_ICON_CLASS });
        badge.append(iconElement);
    }

    const labelElement = document.createElement(BADGE_LABEL_TAG);
    labelElement.classList.add(BADGE_LABEL_CLASS);
    labelElement.textContent = label;
    badge.append(labelElement);

    if (tooltip?.trim()) {
        attachTooltip({ target: badge, content: tooltip });
    }

    return badge;
}
