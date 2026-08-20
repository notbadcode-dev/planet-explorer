/**
 * Constantes para el overlay de reto (composición de Dialog + Button + Icon).
 *
 * Mismo patrón que bot6-dialogue.constants.ts (spec 005).
 * Sin nuevas dependencias npm, reutiliza Dialog/Button/Icon de libs/components/.
 */

/** Tipo de reto para verificación de type narrowing en isCountingChallenge. */
export const CHALLENGE_TYPE_COUNTING = 'counting' as const;

/** Título fijo del diálogo de reto, marca a BOT-6 como narrador. */
export const CHALLENGE_DIALOGUE_TITLE = 'BOT-6';

/** Tamaño del diálogo de reto (parámetro DialogProps.size). */
export const CHALLENGE_DIALOGUE_SIZE = 'medium' as const;

/** Tamaño para los iconos de elementos a contar (en px CSS). */
export const CHALLENGE_DIALOGUE_ICON_SIZE = 32;

/** Nombre del icono para representar cada elemento a contar. */
export const CHALLENGE_DIALOGUE_ICON_NAME = 'star' as const;

/** Longitud vacía para comparación de arrays (0 elementos). */
export const CHALLENGE_DIALOGUE_EMPTY_LENGTH = 0;

/** Variante de botón para las opciones de respuesta. */
export const CHALLENGE_DIALOGUE_BUTTON_VARIANT = 'primary' as const;

/** Tamaño de botón para las opciones de respuesta. */
export const CHALLENGE_DIALOGUE_BUTTON_SIZE = 'medium' as const;

/** Mensaje de error cuando se pasa un challenge que no es CountingChallenge. */
export const CHALLENGE_DIALOGUE_TYPE_ERROR = 'createChallengeDialogue: expected a CountingChallenge but received a different type.';
