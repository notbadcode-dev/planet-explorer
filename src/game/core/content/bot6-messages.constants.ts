/**
 * BOT-6 Messages: Content Records
 *
 * Central registry of BOT-6 messages shown to the player.
 * Follows same data-driven pattern as destinations.ts (004-core-game-loop).
 *
 * Each message is a stable record with id + text; adding new destinations/events
 * only requires adding a new record here, without touching display logic.
 *
 * Constraints (FR-005, FR-007, Clarification Q4):
 * - Text must not exceed BOT6_MESSAGE_MAX_LENGTH characters (proxy for ~2 visual lines)
 * - No real astronomy data
 * - No audio/voice
 * - No dialogue branching
 * - No character customization or player name interpolation
 * - BOT-6 name already marks it as fiction (Clarification Q3)
 */

import type { Bot6Message } from './bot6-messages';

/**
 * Maximum character length for a BOT-6 message.
 * Proxy for ~2 visual lines at typical screen widths (research.md section 4).
 * Verified in bot6-messages.test.ts via character count.
 */
export const BOT6_MESSAGE_MAX_LENGTH = 80;

/**
 * Welcome message shown in MapScene on entry.
 * Introduces BOT-6 as the narrative companion (FR-001).
 * Repeated on every visit without session state (Clarification Q1).
 */
export const MAP_WELCOME_MESSAGE: Bot6Message = {
    id: 'map-welcome',
    text: '¡Hola! Soy BOT-6, tu acompañante en esta aventura espacial.',
};

/**
 * Transition message shown in DestinationScene on entry.
 * Accompanies the player as they enter a destination (FR-002).
 * Distinct from welcome message; repeated on every visit (Clarification Q1).
 */
export const DESTINATION_TRANSITION_MESSAGE: Bot6Message = {
    id: 'destination-transition',
    text: '¡Bienvenido! Estamos explorando el espacio. ¿Listo para aprender?',
};
