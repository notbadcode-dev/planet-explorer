import type { PANEL_VARIANTS } from './Panel.constants';

export type PanelVariant = (typeof PANEL_VARIANTS)[number];

export interface PanelProps {
    title?: string;
    description?: string;
    variant?: PanelVariant;
    content: HTMLElement | HTMLElement[];
}
