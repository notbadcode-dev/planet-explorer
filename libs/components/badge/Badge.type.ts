import type { BADGE_VARIANTS } from './Badge.constants';
import type { IconName } from '../icon';

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    icon?: IconName;
}
