/**
 * Challenge Dialogue Overlay Component
 *
 * Composes Dialog (modal) + Icon ('star' for counting items) + Button (answer options)
 * into a single reusable overlay function for displaying counting challenges.
 *
 * Does NOT import Phaser (constraint R1 of game-engine-scenes.md).
 * Output element is NOT auto-mounted; consumers (DestinationScene) MUST append it
 * to DOM and manage cleanup in handleShutdown.
 */

import { createButton } from '../../../libs/components/button';
import { createDialog, type DialogProps } from '../../../libs/components/dialog';
import { createIcon } from '../../../libs/components/icon';
import type { Challenge, CountingChallenge, Hint } from '../core/challenge-engine/challenge-engine.type';
import {
    CHALLENGE_DIALOGUE_BUTTON_SIZE,
    CHALLENGE_DIALOGUE_BUTTON_VARIANT,
    CHALLENGE_DIALOGUE_EMPTY_LENGTH,
    CHALLENGE_DIALOGUE_HINT_BUTTON_LABEL,
    CHALLENGE_DIALOGUE_HINT_BUTTON_SIZE,
    CHALLENGE_DIALOGUE_HINT_BUTTON_VARIANT,
    CHALLENGE_DIALOGUE_HINT_COLOR,
    CHALLENGE_DIALOGUE_HINT_ELEMENT_TYPE,
    CHALLENGE_DIALOGUE_HINT_FONT_STYLE,
    CHALLENGE_DIALOGUE_HINT_MARGIN_BOTTOM,
    CHALLENGE_DIALOGUE_HINT_MARGIN_TOP,
    CHALLENGE_DIALOGUE_ICON_NAME,
    CHALLENGE_DIALOGUE_ICON_SIZE,
    CHALLENGE_DIALOGUE_NO_MORE_HINTS_COLOR,
    CHALLENGE_DIALOGUE_NO_MORE_HINTS_FONT_STYLE,
    CHALLENGE_DIALOGUE_NO_MORE_HINTS_MARGIN_BOTTOM,
    CHALLENGE_DIALOGUE_NO_MORE_HINTS_MARGIN_TOP,
    CHALLENGE_DIALOGUE_NO_MORE_HINTS_TEXT,
    CHALLENGE_DIALOGUE_SIZE,
    CHALLENGE_DIALOGUE_TITLE,
    CHALLENGE_DIALOGUE_TYPE_ERROR,
    CHALLENGE_TYPE_COUNTING,
} from './challenge-dialogue.constants';

/**
 * Props for createChallengeDialogue function.
 * Defined locally here as extension of the public API contract.
 */
export interface ChallengeDialogueProps {
    /**
     * Narrative message wrapping the challenge.
     * Expected to be a Bot6Message (string content).
     */
    description: string;

    /**
     * The current challenge to display.
     * Items will be rendered as 'star' icons; correctAnswer is used to
     * identify which answer option is correct (not displayed to player).
     */
    challenge: Challenge;

    /**
     * Array of answer options to present as buttons.
     * Typically [correctAnswer, distractor1, distractor2, distractor3] shuffled.
     */
    answerOptions: readonly number[];

    /**
     * Callback invoked when player selects an answer option.
     * Consumers MUST use this to validate the answer via submitAnswer()
     * and decide whether to display next challenge, retry, or completion.
     */
    onSelect: (answer: number) => void;

    /**
     * Array of hints for this challenge (spec 010, optional).
     * If provided with onRequestHint, the "Pedir pista" button will be shown on failure.
     */
    hints?: readonly Hint[];

    /**
     * Number of hints already revealed (spec 010, optional).
     * Used to display revealed hints and track progress through the hint sequence.
     */
    hintsRevealedCount?: number;

    /**
     * Callback invoked when player clicks the "Pedir pista" button (spec 010, optional).
     * Consumers MUST use this to call requestNextHint(), update state, and re-render.
     */
    onRequestHint?: () => void;
}

/**
 * Type guard to narrow a Challenge to CountingChallenge.
 * Checks if the challenge type is 'counting'.
 */
function isCountingChallenge(challenge: Challenge): challenge is CountingChallenge {
    return challenge.type === CHALLENGE_TYPE_COUNTING;
}

/**
 * Create a challenge dialogue overlay element.
 *
 * Composes createDialog + createIcon (for items to count) + createButton (for options)
 * to present a narrative-wrapped counting challenge with selectable answer buttons.
 * Returns an HTMLElement ready to append to DOM but NOT auto-mounted.
 *
 * Contract guarantees (derived from spec 008):
 * - 100% of challenges wrapped in narrative (SC-002), no bare arithmetic
 * - Items rendered as 'star' icons per item in challenge.items
 * - Answer options as primary buttons, selectable via click
 * - No direct display of challenge.question (that's for other challenge types)
 * - Immutable: no mutation of props or challenge
 *
 * Spec 010 extension (FR-003/FR-004/FR-005):
 * - If hints and onRequestHint provided, show revealed hints as additional content
 * - If more hints available, show "Pedir pista" button; else show "No more hints" message
 */
export function createChallengeDialogue(props: ChallengeDialogueProps): HTMLElement {
    const { description, challenge, answerOptions, onSelect, hints, hintsRevealedCount, onRequestHint } = props;

    // Create icon elements for each item to count (one 'star' per item)
    if (!isCountingChallenge(challenge)) {
        throw new Error(CHALLENGE_DIALOGUE_TYPE_ERROR);
    }
    const itemElements = challenge.items.map(() =>
        createIcon({ name: CHALLENGE_DIALOGUE_ICON_NAME, size: CHALLENGE_DIALOGUE_ICON_SIZE }),
    ) ?? [];

    // Create button elements for each answer option
    const buttonElements = answerOptions.map((option) =>
        createButton({
            label: option.toString(),
            onClick: () => onSelect(option),
            variant: CHALLENGE_DIALOGUE_BUTTON_VARIANT,
            size: CHALLENGE_DIALOGUE_BUTTON_SIZE,
        }),
    );

    // Build content array: items + revealed hints + hint button/message
    const contentElements: HTMLElement[] = [];

    // Add item icons to content
    if (itemElements.length > CHALLENGE_DIALOGUE_EMPTY_LENGTH) {
        contentElements.push(...itemElements);
    }

    // Add revealed hints as text content (spec 010, FR-004)
    if (hints && hintsRevealedCount && hintsRevealedCount > CHALLENGE_DIALOGUE_EMPTY_LENGTH) {
        const revealedHints = hints.slice(CHALLENGE_DIALOGUE_EMPTY_LENGTH, hintsRevealedCount);
        revealedHints.forEach((hint) => {
            const hintElement = document.createElement(CHALLENGE_DIALOGUE_HINT_ELEMENT_TYPE);
            hintElement.style.marginTop = CHALLENGE_DIALOGUE_HINT_MARGIN_TOP;
            hintElement.style.marginBottom = CHALLENGE_DIALOGUE_HINT_MARGIN_BOTTOM;
            hintElement.style.fontStyle = CHALLENGE_DIALOGUE_HINT_FONT_STYLE;
            hintElement.style.color = CHALLENGE_DIALOGUE_HINT_COLOR;
            hintElement.textContent = hint.text;
            contentElements.push(hintElement);
        });
    }

    // Add hint button or "no more hints" message (spec 010, FR-005)
    if (onRequestHint && hints && hintsRevealedCount !== undefined) {
        if (hintsRevealedCount < hints.length) {
            // More hints available: add button to request next hint
            buttonElements.push(
                createButton({
                    label: CHALLENGE_DIALOGUE_HINT_BUTTON_LABEL,
                    onClick: onRequestHint,
                    variant: CHALLENGE_DIALOGUE_HINT_BUTTON_VARIANT,
                    size: CHALLENGE_DIALOGUE_HINT_BUTTON_SIZE,
                }),
            );
        } else {
            // No more hints: show friendly message
            const noMoreHintsElement = document.createElement(CHALLENGE_DIALOGUE_HINT_ELEMENT_TYPE);
            noMoreHintsElement.style.marginTop = CHALLENGE_DIALOGUE_NO_MORE_HINTS_MARGIN_TOP;
            noMoreHintsElement.style.marginBottom = CHALLENGE_DIALOGUE_NO_MORE_HINTS_MARGIN_BOTTOM;
            noMoreHintsElement.style.fontStyle = CHALLENGE_DIALOGUE_NO_MORE_HINTS_FONT_STYLE;
            noMoreHintsElement.style.color = CHALLENGE_DIALOGUE_NO_MORE_HINTS_COLOR;
            noMoreHintsElement.textContent = CHALLENGE_DIALOGUE_NO_MORE_HINTS_TEXT;
            contentElements.push(noMoreHintsElement);
        }
    }

    // Combine into dialog
    const dialogProps: DialogProps = {
        title: CHALLENGE_DIALOGUE_TITLE,
        description,
        content: contentElements.length > CHALLENGE_DIALOGUE_EMPTY_LENGTH ? contentElements : undefined,
        actions: buttonElements,
        onClose: () => {
            // Challenge dialogue doesn't auto-close on button selection
            // DestinationScene must manually remove it after handling the selection
        },
        size: CHALLENGE_DIALOGUE_SIZE,
    };

    return createDialog(dialogProps);
}
