import './Badge.css';

import {
    BADGE_BASE_CLASS,
    BADGE_ICON_CLASS,
    BADGE_LABEL_CLASS,
    BADGE_LABEL_TAG,
    BADGE_ROOT_TAG,
    BADGE_VARIANT_CLASS_PREFIX,
    BADGE_VARIANTS,
    DEFAULT_BADGE_VARIANT,
} from './Badge.constants';
import { createIcon } from '../icon';
import type { BadgeProps, BadgeVariant } from './Badge.type';

export type { BadgeProps, BadgeVariant } from './Badge.type';

function isBadgeVariant(value: unknown): value is BadgeVariant {
    return BADGE_VARIANTS.includes(value as BadgeVariant);
}

function resolveVariant(value: unknown): BadgeVariant {
    return isBadgeVariant(value) ? value : DEFAULT_BADGE_VARIANT;
}

export function createBadge(props: BadgeProps): HTMLElement {
    const { label, variant, icon } = props;

    const badge = document.createElement(BADGE_ROOT_TAG);
    badge.classList.add(BADGE_BASE_CLASS, BADGE_VARIANT_CLASS_PREFIX + resolveVariant(variant));

    if (icon) {
        const iconElement = createIcon({ name: icon, className: BADGE_ICON_CLASS });
        badge.append(iconElement);
    }

    const labelElement = document.createElement(BADGE_LABEL_TAG);
    labelElement.classList.add(BADGE_LABEL_CLASS);
    labelElement.textContent = label;
    badge.append(labelElement);

    return badge;
}
