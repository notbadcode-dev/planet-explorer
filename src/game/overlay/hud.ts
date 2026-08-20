/**
 * Overlay HTML del HUD de la escena de destino.
 *
 * HTML real montado como hermano DOM del `<canvas>` de Phaser (regla R7/R8 de
 * `game-engine-scenes.md`) — nunca Game Objects de Phaser. Reutiliza `Button`
 * y `Progress` de `libs/components/` (regla de reutilización de componentes).
 */

import { createButton } from '../../../libs/components/button';
import { createProgress } from '../../../libs/components/progress';
import {
    HUD_CLASS,
    HUD_ROOT_ELEMENT_TAG,
    PROGRESS_ARIA_LABEL_ATTR,
    PROGRESS_CSS_PERCENT_SUFFIX,
    PROGRESS_CSS_VAR_NAME,
    PROGRESS_DISPLAY_SEPARATOR,
    PROGRESS_PERCENTAGE_MULTIPLIER,
    PROGRESS_PLACEHOLDER_LABEL,
    PROGRESS_PLACEHOLDER_VALUE,
    PROGRESS_TITLE_ATTR,
    PROGRESS_ZERO_CHECK,
    RETURN_TO_MAP_BUTTON_SIZE,
    RETURN_TO_MAP_LABEL,
} from './hud.constants';
import './hud.css';

export interface HudProps {
    onReturnToMap: () => void;
}

export interface HudInstance {
    element: HTMLElement;
    updateProgress: (current: number, total: number) => void;
}

export function createHud(props: HudProps): HudInstance {
    const { onReturnToMap } = props;

    const root = document.createElement(HUD_ROOT_ELEMENT_TAG);
    root.classList.add(HUD_CLASS);

    const returnButton = createButton({
        label: RETURN_TO_MAP_LABEL,
        size: RETURN_TO_MAP_BUTTON_SIZE,
        onClick: onReturnToMap,
    });

    const progressElement = createProgress({
        value: PROGRESS_PLACEHOLDER_VALUE,
        label: PROGRESS_PLACEHOLDER_LABEL,
        showValue: false,
    });

    root.append(returnButton, progressElement);

    const updateProgress = (current: number, total: number) => {
        // Update the progress element's label to show current/total
        const label = current + PROGRESS_DISPLAY_SEPARATOR + total;
        progressElement.setAttribute(PROGRESS_ARIA_LABEL_ATTR, label);
        progressElement.setAttribute(PROGRESS_TITLE_ATTR, label);
        // Update progress value as percentage
        const percentage = total > PROGRESS_ZERO_CHECK ? (current / total) * PROGRESS_PERCENTAGE_MULTIPLIER : PROGRESS_PLACEHOLDER_VALUE;
        progressElement.style.setProperty(PROGRESS_CSS_VAR_NAME, percentage + PROGRESS_CSS_PERCENT_SUFFIX);
    };

    return {
        element: root,
        updateProgress,
    };
}
