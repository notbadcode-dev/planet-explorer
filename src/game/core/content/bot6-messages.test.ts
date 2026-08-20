/**
 * Unit Tests: BOT-6 Messages
 *
 * Verifies message content constraints per FR-005 (text length), SC-004 (≤2 lines),
 * and data integrity (non-empty, unique IDs).
 *
 * Character-count proxy for line limit (research.md section 4):
 * 80 characters as proxy for ~2 visual lines at typical screen widths.
 */

import { describe, expect, it } from 'vitest';
import {
    BOT6_MESSAGE_MAX_LENGTH,
    DESTINATION_TRANSITION_MESSAGE,
    MAP_WELCOME_MESSAGE,
    MOON_CHALLENGE_INTRO_MESSAGE,
    MOON_CHALLENGE_NEXT_MESSAGE,
    MOON_CHALLENGE_RETRY_MESSAGE,
    MOON_CHALLENGE_SUCCESS_MESSAGE,
    MOON_DESTINATION_COMPLETE_MESSAGE,
} from './bot6-messages.constants';

describe('bot6-messages', () => {
    describe('Message constraints', () => {
        const messages = [
            MAP_WELCOME_MESSAGE,
            DESTINATION_TRANSITION_MESSAGE,
            MOON_CHALLENGE_INTRO_MESSAGE,
            MOON_CHALLENGE_NEXT_MESSAGE,
            MOON_CHALLENGE_RETRY_MESSAGE,
            MOON_CHALLENGE_SUCCESS_MESSAGE,
            MOON_DESTINATION_COMPLETE_MESSAGE,
        ];

        it('should not have empty text', () => {
            messages.forEach((msg) => {
                expect(msg.text).toBeTruthy();
                expect(msg.text.trim().length).toBeGreaterThan(0);
            });
        });

        it('should not exceed BOT6_MESSAGE_MAX_LENGTH characters (proxy for ~2 visual lines)', () => {
            messages.forEach((msg) => {
                expect(msg.text.length).toBeLessThanOrEqual(BOT6_MESSAGE_MAX_LENGTH);
            });
        });

        it('should have non-empty, stable IDs', () => {
            messages.forEach((msg) => {
                expect(msg.id).toBeTruthy();
                expect(msg.id.trim().length).toBeGreaterThan(0);
            });
        });

        it('should have unique IDs across all messages', () => {
            const ids = messages.map((msg) => msg.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });
    });

    describe('Specific messages', () => {
        it('MAP_WELCOME_MESSAGE should be defined and valid', () => {
            expect(MAP_WELCOME_MESSAGE).toBeDefined();
            expect(MAP_WELCOME_MESSAGE.id).toBe('map-welcome');
            expect(MAP_WELCOME_MESSAGE.text.length).toBeGreaterThan(0);
            expect(MAP_WELCOME_MESSAGE.text.length).toBeLessThanOrEqual(BOT6_MESSAGE_MAX_LENGTH);
        });

        it('DESTINATION_TRANSITION_MESSAGE should be defined and valid', () => {
            expect(DESTINATION_TRANSITION_MESSAGE).toBeDefined();
            expect(DESTINATION_TRANSITION_MESSAGE.id).toBe('destination-transition');
            expect(DESTINATION_TRANSITION_MESSAGE.text.length).toBeGreaterThan(0);
            expect(DESTINATION_TRANSITION_MESSAGE.text.length).toBeLessThanOrEqual(BOT6_MESSAGE_MAX_LENGTH);
        });

        it('MOON_CHALLENGE_INTRO_MESSAGE should be defined and valid', () => {
            expect(MOON_CHALLENGE_INTRO_MESSAGE).toBeDefined();
            expect(MOON_CHALLENGE_INTRO_MESSAGE.id).toBe('moon-challenge-intro');
            expect(MOON_CHALLENGE_INTRO_MESSAGE.text.length).toBeGreaterThan(0);
            expect(MOON_CHALLENGE_INTRO_MESSAGE.text.length).toBeLessThanOrEqual(BOT6_MESSAGE_MAX_LENGTH);
        });

        it('MOON_CHALLENGE_NEXT_MESSAGE should be defined and valid', () => {
            expect(MOON_CHALLENGE_NEXT_MESSAGE).toBeDefined();
            expect(MOON_CHALLENGE_NEXT_MESSAGE.id).toBe('moon-challenge-next');
            expect(MOON_CHALLENGE_NEXT_MESSAGE.text.length).toBeGreaterThan(0);
            expect(MOON_CHALLENGE_NEXT_MESSAGE.text.length).toBeLessThanOrEqual(BOT6_MESSAGE_MAX_LENGTH);
        });

        it('MOON_CHALLENGE_RETRY_MESSAGE should be defined and valid', () => {
            expect(MOON_CHALLENGE_RETRY_MESSAGE).toBeDefined();
            expect(MOON_CHALLENGE_RETRY_MESSAGE.id).toBe('moon-challenge-retry');
            expect(MOON_CHALLENGE_RETRY_MESSAGE.text.length).toBeGreaterThan(0);
            expect(MOON_CHALLENGE_RETRY_MESSAGE.text.length).toBeLessThanOrEqual(BOT6_MESSAGE_MAX_LENGTH);
        });

        it('MOON_CHALLENGE_SUCCESS_MESSAGE should be defined and valid', () => {
            expect(MOON_CHALLENGE_SUCCESS_MESSAGE).toBeDefined();
            expect(MOON_CHALLENGE_SUCCESS_MESSAGE.id).toBe('moon-challenge-success');
            expect(MOON_CHALLENGE_SUCCESS_MESSAGE.text.length).toBeGreaterThan(0);
            expect(MOON_CHALLENGE_SUCCESS_MESSAGE.text.length).toBeLessThanOrEqual(BOT6_MESSAGE_MAX_LENGTH);
        });

        it('MOON_DESTINATION_COMPLETE_MESSAGE should be defined and valid', () => {
            expect(MOON_DESTINATION_COMPLETE_MESSAGE).toBeDefined();
            expect(MOON_DESTINATION_COMPLETE_MESSAGE.id).toBe('moon-destination-complete');
            expect(MOON_DESTINATION_COMPLETE_MESSAGE.text.length).toBeGreaterThan(0);
            expect(MOON_DESTINATION_COMPLETE_MESSAGE.text.length).toBeLessThanOrEqual(BOT6_MESSAGE_MAX_LENGTH);
        });
    });

    describe('BOT6_MESSAGE_MAX_LENGTH constant', () => {
        it('should be a reasonable proxy for ~2 visual lines', () => {
            // 80 chars: typical for ~40-50 chars per line at mobile widths,
            // ~50-60 chars per line at desktop (see research.md section 4)
            expect(BOT6_MESSAGE_MAX_LENGTH).toBe(80);
        });

        it('should be positive integer', () => {
            expect(BOT6_MESSAGE_MAX_LENGTH).toBeGreaterThan(0);
            expect(Number.isInteger(BOT6_MESSAGE_MAX_LENGTH)).toBe(true);
        });
    });
});
