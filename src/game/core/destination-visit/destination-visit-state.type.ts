/**
 * Tipos para la gestión del estado de una visita a un destino.
 *
 * `DestinationVisitState` coordina la secuencia de retos de una visita,
 * sin dependencia de Phaser (principio VII).
 *
 * Ver `specs/008-moon-destination-counting/data-model.md` y
 * `specs/008-moon-destination-counting/contracts/destination-visit-contract.md`.
 */

import type { Challenge, SkillUpdateResult } from '../challenge-engine/challenge-engine.type';

/**
 * Estado en-memoria de una visita a un destino con contenido educativo.
 *
 * Propiedades:
 * - `destinationId`: Identificador del destino (p. ej. "moon").
 * - `challenges`: Secuencia de retos generada de una sola vez al entrar (G1).
 *   Nunca cambia durante la visita (FR-014).
 * - `currentIndex`: Posición 0-based del reto actual dentro de `challenges`.
 * - `status`: 'in-progress' mientras quedan retos; 'completed' tras el último acierto.
 * - `lastOutcome`: Resultado de la última llamada a `submitAnswer` (para feedback).
 */
export interface DestinationVisitState {
    readonly destinationId: string;
    readonly challenges: readonly Challenge[];
    readonly currentIndex: number;
    readonly status: 'in-progress' | 'completed';
    readonly lastOutcome: SkillUpdateResult | null;
}
