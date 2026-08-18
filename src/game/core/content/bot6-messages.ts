/**
 * BOT-6 Message Interface
 *
 * Defines the contract for messages displayed by BOT-6 narrative companion.
 * Data-driven approach (Principle IX of constitution) allows adding future
 * messages without modifying display logic.
 */

export interface Bot6Message {
  /**
   * Stable identifier for the message (e.g., 'map-welcome', 'destination-transition')
   * Used for routing and testing.
   */
  id: string;

  /**
   * Message text displayed to the player.
   * Must not exceed BOT6_MESSAGE_MAX_LENGTH characters (verified in tests).
   * Appropriate for ~6-year-old audience (FR-005).
   */
  text: string;
}
