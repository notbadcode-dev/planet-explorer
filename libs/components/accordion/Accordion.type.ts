export interface AccordionSection {
    id: string;
    title: string;
    content: HTMLElement;
}

export interface AccordionProps {
    /** Secciones expandibles/colapsables independientes entre sí. */
    sections: AccordionSection[];

    /** Identificadores de las secciones expandidas por defecto. */
    defaultExpandedIds?: string[];

    /**
     * Cuando es `true`, expandir una sección colapsa automáticamente el resto
     * (modo exclusivo). Por defecto `false`: expansión múltiple independiente.
     */
    exclusive?: boolean;

    /** Callback invocado cuando una sección cambia de estado. */
    onToggle?: (id: string, expanded: boolean) => void;
}

export interface AccordionEntry {
    id: string;
    isExpanded: () => boolean;
    collapse: () => void;
}
