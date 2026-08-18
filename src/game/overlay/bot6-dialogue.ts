/**
 * BOT-6 Dialogue Overlay Component
 *
 * Composes Dialog (modal, accessibility, focus management) + Icon ('robot' portrait)
 * into a single reusable overlay function for displaying BOT-6 narrative messages.
 *
 * Does NOT import Phaser (constraint R7 of game-engine-scenes.md).
 * Output element is NOT auto-mounted; consumers (MapScene/DestinationScene)
 * MUST append it to DOM and manage cleanup in handleShutdown.
 */

import { createDialog, type DialogProps } from '../../../libs/components/dialog';
import { createIcon } from '../../../libs/components/icon';
import type { Bot6Message } from '../core/content/bot6-messages';
import {
    BOT6_DIALOGUE_TITLE,
    BOT6_DIALOGUE_CLOSE_LABEL,
    BOT6_DIALOGUE_SIZE,
    BOT6_DIALOGUE_PORTRAIT_SIZE,
    BOT6_DIALOGUE_PORTRAIT_FILL,
    BOT6_DIALOGUE_PORTRAIT_ICON_NAME,
} from './bot6-dialogue.constants';

/**
 * Props for createBot6Dialogue function.
 * Defined locally here as extension of the public API contract.
 */
export interface Bot6DialogueProps {
  /**
   * Message to display (id + text).
   * Must not exceed BOT6_MESSAGE_MAX_LENGTH (tested in bot6-messages.test.ts).
   */
  message: Bot6Message;

  /**
   * Callback invoked when player closes the dialogue.
   * Scenes MUST use this to remove the dialogue element from DOM
   * and resume normal gameplay.
   */
  onClose: () => void;
}

/**
 * Create a BOT-6 dialogue overlay element.
 *
 * Composes createDialog + createIcon to present a modal narrative message
 * with BOT-6's portrait. Returns an HTMLElement ready to append to DOM
 * but NOT auto-mounted.
 *
 * Contract guarantees (G1-G6):
 * - G1: Title always 'BOT-6' (marks fiction, spec clarification Q3)
 * - G2: Single message per call (FR-003a), no chaining
 * - G3: Portrait via Icon 'robot' (FR-006)
 * - G4: One close action per call (FR-004, handled by Dialog internally)
 * - G5: No state/persistence (messages repeat on each visit, spec clarification Q1)
 * - G6: Element ready to mount, not auto-mounted (scenes handle DOM attachment/cleanup)
 */
export function createBot6Dialogue(props: Bot6DialogueProps): HTMLElement {
    const { message, onClose } = props;

    // Create portrait icon (larger than default UI icon for narrative prominence)
    const portraitIcon = createIcon({
        name: BOT6_DIALOGUE_PORTRAIT_ICON_NAME,
        size: BOT6_DIALOGUE_PORTRAIT_SIZE,
        fill: BOT6_DIALOGUE_PORTRAIT_FILL,
        ariaLabel: BOT6_DIALOGUE_TITLE, // Portrait is decorative but labeled for a11y
    });

    // Compose Dialog props: title (character name) + description (message text) + portrait content
    const dialogProps: DialogProps = {
        title: BOT6_DIALOGUE_TITLE,
        description: message.text,
        content: portraitIcon,
        closeLabel: BOT6_DIALOGUE_CLOSE_LABEL,
        size: BOT6_DIALOGUE_SIZE,
        onClose, // Pass through to Dialog; fired exactly once on user close action
    };

    // Compose Dialog and return (NOT auto-mounted; caller MUST append to DOM)
    return createDialog(dialogProps);
}
