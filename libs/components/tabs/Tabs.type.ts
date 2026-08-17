import type { IconName } from '../icon';

export interface TabItem {
    id: string;
    label: string;
    panel: HTMLElement;

    /** Deshabilita esta pestaña: se omite en clic, teclado y navegación con flechas. */
    disabled?: boolean;

    /**
     * Icono decorativo junto a la etiqueta. Todas las pestañas del conjunto
     * deben definirlo, o ninguna debe hacerlo (validación todo-o-nada).
     */
    icon?: IconName;

    /** Texto de ayuda contextual opcional. Si se informa, se adjunta como tooltip (hover/foco). */
    tooltip?: string;
}

export interface TabsProps {
    /** Conjunto de pestañas con su panel de contenido asociado. */
    tabs: TabItem[];

    /** Id de la pestaña activa inicialmente. Si no coincide con ninguna, se activa la primera. */
    activeTabId?: string;

    /** Callback invocado con el id de la pestaña activada al cambiar. */
    onChange?: (id: string) => void;
}
