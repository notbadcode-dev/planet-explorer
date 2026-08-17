import './CardTile.css';

import { createBadge } from '../badge';
import { createIcon } from '../icon';
import { attachTooltip } from '../tooltip';
import {
    CARD_TILE_ALT_ATTRIBUTE_EMPTY_VALUE,
    CARD_TILE_ARIA_DISABLED_ATTRIBUTE,
    CARD_TILE_BASE_CLASS,
    CARD_TILE_CLICK_EVENT,
    CARD_TILE_ENTER_KEY,
    CARD_TILE_ICON_CLASS,
    CARD_TILE_IMAGE_CLASS,
    CARD_TILE_IMAGE_TAG,
    CARD_TILE_KEYDOWN_EVENT,
    CARD_TILE_LOCKED_CLASS,
    CARD_TILE_MEDIA_CLASS,
    CARD_TILE_MEDIA_ERROR,
    CARD_TILE_ROLE_ATTRIBUTE,
    CARD_TILE_ROLE_VALUE,
    CARD_TILE_ROOT_TAG,
    CARD_TILE_SPACE_KEY,
    CARD_TILE_STATUS_CLASS,
    CARD_TILE_TABINDEX_ATTRIBUTE,
    CARD_TILE_TABINDEX_VALUE,
    CARD_TILE_TITLE_CLASS,
    CARD_TILE_TITLE_ERROR,
    CARD_TILE_TITLE_TAG,
    CARD_TILE_TRUE_ATTRIBUTE_VALUE,
} from './CardTile.constants';
import type { CardTileProps } from './CardTile.type';

export type { CardTileProps } from './CardTile.type';

export function createCardTile(props: CardTileProps): HTMLElement {
    const { title, icon, imageSrc, imageAlt, statusLabel, statusVariant, locked, onSelect, tooltip } = props;

    if (!title?.trim()) {
        throw new Error(CARD_TILE_TITLE_ERROR);
    }

    if (!icon && !imageSrc) {
        throw new Error(CARD_TILE_MEDIA_ERROR);
    }

    const isLocked = Boolean(locked);

    const tile = document.createElement(CARD_TILE_ROOT_TAG);
    tile.classList.add(CARD_TILE_BASE_CLASS);
    tile.setAttribute(CARD_TILE_ROLE_ATTRIBUTE, CARD_TILE_ROLE_VALUE);
    tile.setAttribute(CARD_TILE_TABINDEX_ATTRIBUTE, CARD_TILE_TABINDEX_VALUE);

    if (isLocked) {
        tile.classList.add(CARD_TILE_LOCKED_CLASS);
        tile.setAttribute(CARD_TILE_ARIA_DISABLED_ATTRIBUTE, CARD_TILE_TRUE_ATTRIBUTE_VALUE);
    }

    if (imageSrc) {
        const image = document.createElement(CARD_TILE_IMAGE_TAG) as HTMLImageElement;
        image.src = imageSrc;
        image.alt = imageAlt ?? CARD_TILE_ALT_ATTRIBUTE_EMPTY_VALUE;
        image.classList.add(CARD_TILE_MEDIA_CLASS, CARD_TILE_IMAGE_CLASS);
        tile.append(image);
    } else if (icon) {
        const iconElement = createIcon({ name: icon, className: CARD_TILE_ICON_CLASS });
        iconElement.classList.add(CARD_TILE_MEDIA_CLASS);
        tile.append(iconElement);
    }

    const titleElement = document.createElement(CARD_TILE_TITLE_TAG);
    titleElement.classList.add(CARD_TILE_TITLE_CLASS);
    titleElement.textContent = title;
    tile.append(titleElement);

    if (statusLabel) {
        const badge = createBadge({ label: statusLabel, variant: statusVariant });
        badge.classList.add(CARD_TILE_STATUS_CLASS);
        tile.append(badge);
    }

    function activate(): void {
        if (isLocked) {
            return;
        }
        onSelect();
    }

    tile.addEventListener(CARD_TILE_CLICK_EVENT, () => {
        activate();
    });

    tile.addEventListener(CARD_TILE_KEYDOWN_EVENT, (event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key !== CARD_TILE_ENTER_KEY && keyboardEvent.key !== CARD_TILE_SPACE_KEY) {
            return;
        }
        keyboardEvent.preventDefault();
        activate();
    });

    if (tooltip?.trim()) {
        attachTooltip({ target: tile, content: tooltip });
    }

    return tile;
}
