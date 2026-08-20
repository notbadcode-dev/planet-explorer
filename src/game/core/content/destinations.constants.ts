import { CHALLENGE_TYPE_COUNTING } from '../challenge-engine/challenge-engine.constants';
import type { CountingChallengeConfig } from '../challenge-engine/challenge-engine.type';
import type { Destination } from './destinations';

/** Número de retos en la secuencia fija del destino Luna (spec 008). */
export const CHALLENGE_SEQUENCE_LENGTH = 3;

/** Rango mínimo de conteo para los retos del destino Luna. */
export const MOON_COUNTING_MIN = 2;

/** Rango máximo de conteo para los retos del destino Luna. */
export const MOON_COUNTING_MAX = 8;

/** Color de fondo para la escena del destino Luna (hexadecimal, spec 008 FR-010). */
export const MOON_DESTINATION_BACKGROUND_COLOR = '#1a1a2e';

/**
 * Destino Luna con secuencia de retos de conteo fija (spec 008).
 * La secuencia se genera una sola vez al entrar; no se regenera durante la visita (FR-014).
 */
function createMoonChallengeConfigs(): readonly CountingChallengeConfig[] {
    return Array.from({ length: CHALLENGE_SEQUENCE_LENGTH }, (): CountingChallengeConfig => ({
        type: CHALLENGE_TYPE_COUNTING,
        min: MOON_COUNTING_MIN,
        max: MOON_COUNTING_MAX,
    }));
}

export const DESTINATIONS: Destination[] = [
    {
        id: 'moon',
        name: 'Luna',
        challengeConfigs: createMoonChallengeConfigs(),
    },
];
