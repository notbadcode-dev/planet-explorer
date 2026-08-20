/**
 * Constantes para DestinationScene.
 *
 * Centraliza literales mágicos usados en la lógica de escena de destino.
 */

/** Identificador de habilidad "counting" para skill progression. */
export const SKILL_ID_COUNTING = 'counting' as const;

/** Resultado de validación: acierto. */
export const VALIDATE_OUTCOME_SUCCESS = 'success' as const;

/** Longitud mínima para colección (0 elementos — colección vacía). */
export const MIN_COLLECTION_LENGTH = 0;

/** Offset de índice inicial (primer elemento de la secuencia = índice 0 + 1 para display). */
export const PROGRESS_DISPLAY_OFFSET = 1;
