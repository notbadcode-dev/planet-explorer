import type { IconName } from '../icon';
import type { BADGE_VARIANTS } from './Badge.constants';

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    icon?: IconName;
}
