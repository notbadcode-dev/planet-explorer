import type { BadgeVariant } from '../badge';
import type { IconName } from '../icon';

export interface CardTileProps {
    /** Título visible de la tarjeta. Obligatorio y no vacío (VAL-901). */
    title: string;

    /** Icono decorativo del catálogo local. Requerido si no se aporta `imageSrc` (VAL-902). */
    icon?: IconName;

    /** URL de imagen ilustrativa. Requerido si no se aporta `icon` (VAL-902). */
    imageSrc?: string;

    /** Texto alternativo de `imageSrc`. Si se omite, la imagen se trata como decorativa. */
    imageAlt?: string;

    /** Texto del `Badge` de estado (p. ej. "Descubierto"). Opcional. */
    statusLabel?: string;

    /** Variante visual del `Badge` de estado. Solo aplica si `statusLabel` está presente. */
    statusVariant?: BadgeVariant;

    /** Si es `true`, bloquea la activación y lo comunica vía `aria-disabled` (VAL-903). */
    locked?: boolean;

    /** Callback de activación por clic o teclado (Enter/Space) cuando no está bloqueada (VAL-904). */
    onSelect: () => void;

    /** Texto de ayuda contextual opcional. Si se informa, se adjunta como tooltip (hover/foco). */
    tooltip?: string;
}
