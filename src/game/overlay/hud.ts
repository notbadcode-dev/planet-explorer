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
    PROGRESS_PLACEHOLDER_LABEL,
    PROGRESS_PLACEHOLDER_VALUE,
    RETURN_TO_MAP_BUTTON_SIZE,
    RETURN_TO_MAP_LABEL,
} from './hud.constants';
import './hud.css';

export interface HudProps {
    onReturnToMap: () => void;
}

export function createHud(props: HudProps): HTMLElement {
    const { onReturnToMap } = props;

    const root = document.createElement(HUD_ROOT_ELEMENT_TAG);
    root.classList.add(HUD_CLASS);

    const returnButton = createButton({
        label: RETURN_TO_MAP_LABEL,
        size: RETURN_TO_MAP_BUTTON_SIZE,
        onClick: onReturnToMap,
    });

    const progress = createProgress({
        value: PROGRESS_PLACEHOLDER_VALUE,
        label: PROGRESS_PLACEHOLDER_LABEL,
        showValue: false,
    });

    root.append(returnButton, progress);

    return root;
}
