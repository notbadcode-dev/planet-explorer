/**
 * Destinos seleccionables del mapa del sistema solar.
 *
 * Placeholder sin datos astronómicos reales ni contenido educativo (FR-010).
 * Colección abierta: preparada para que features futuras añadan más registros
 * sin cambiar la forma del dato (principio IX, `data-model.md`).
 */

import type { CountingChallengeConfig } from '../challenge-engine/challenge-engine.type';

export interface Destination {
    /** Identificador estable en kebab-case. */
    id: string;

    /** Nombre visible del destino en el mapa. */
    name: string;

    /** Configuración opcional de retos para este destino (spec 008). */
    challengeConfigs?: readonly CountingChallengeConfig[];
}

export { DESTINATIONS } from './destinations.constants';
