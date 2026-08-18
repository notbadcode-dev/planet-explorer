/**
 * BOT-6 Dialogue Overlay: Constants
 *
 * Reusable configuration for bot6-dialogue.ts component.
 * Centralizes locale strings and size parameters to simplify
 * future localization or design adjustments.
 */

/**
 * Fixed title for BOT-6 dialogue (visible in Dialog header).
 * Marks the dialogue as fiction (Clarification Q3).
 */
export const BOT6_DIALOGUE_TITLE = 'BOT-6';

/**
 * Close button label for BOT-6 dialogue.
 * Locale: Spanish (child-appropriate, action-oriented).
 */
export const BOT6_DIALOGUE_CLOSE_LABEL = 'Continuar';

/**
 * Dialog size preset (maps to Dialog component's size: 'small' | 'medium' | 'large').
 * 'small' is appropriate for brief narrative messages (FR-005).
 */
export const BOT6_DIALOGUE_SIZE = 'small' as const;

/**
 * Portrait icon size (in CSS pixels).
 * Larger than typical UI icon (24px) to make BOT-6 portrait visually prominent.
 */
export const BOT6_DIALOGUE_PORTRAIT_SIZE = 64;

/**
 * Portrait icon fill color.
 * Inherits from Dialog's text color scheme (dark mode / light mode aware).
 */
export const BOT6_DIALOGUE_PORTRAIT_FILL = 'currentColor';

/**
 * Portrait icon name from Icon catalogue.
 * Robot icon placeholder until final BOT-6 character art is available.
 */
export const BOT6_DIALOGUE_PORTRAIT_ICON_NAME = 'robot' as const;
