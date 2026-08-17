---
title: "Contrato: Interfaz pública del componente Tabs"
feature: "003-shared-components-base"
type: "contract"
version: "1.1"
created: "2026-08-16"
updated: "2026-08-19T00:00:00Z"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [frontend, ui, contract, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Contrato: Interfaz pública del componente `Tabs`

**Trazabilidad**: FR-027, US7, DM-013 (`TabsProps`)

**Estado de implementación**: Implementado (oleada de prioridad P2, ampliación 2026-08-16; ver evidencia T148).

## Propósito

Definir la API pública mínima y estable de `Tabs` en `libs/components/tabs/`, para organizar secciones de contenido (p. ej. "Datos", "Curiosidades", "Quiz" en la ficha de un planeta).

## Punto de entrada

```ts
export { createTabs } from './Tabs';
export type { TabsProps } from './Tabs';
```

## Firma pública

```ts
interface TabsProps {
    tabs: { id: string; label: string; panel: HTMLElement; disabled?: boolean; icon?: IconName }[];
    activeTabId?: string;
    onChange?: (id: string) => void;
}

function createTabs(props: TabsProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-1301)**: Cada pestaña MUST asociarse con exactamente un panel mediante `aria-controls`/`aria-labelledby`, siguiendo el patrón WAI-ARIA APG de tabs/tabpanel (R-022).
* **R2 (VAL-1302)**: Solo el panel de la pestaña activa MUST ser visible y anunciado; los demás MUST permanecer ocultos.
* **R3 (VAL-1303)**: La navegación con flechas izquierda/derecha MUST mover el foco entre pestañas.
* **R4 (VAL-1304)**: Si una pestaña no tiene `panel` asociado, MUST renderizarse igualmente con su panel vacío, sin romper la navegación.
* **R5 (FR-041)**: Una pestaña con `disabled: true` MUST exponer `aria-disabled="true"`, MUST NOT activarse por clic ni teclado, y MUST omitirse en la navegación con flechas.
* **R6 (FR-042)**: Si alguna pestaña define `icon`, todas las demás MUST definirlo también (regla todo-o-nada); una configuración mixta MUST lanzar un error en tiempo de construcción, consistente con el patrón de `CardTile`.
* **R7 (FR-040)**: El cambio de panel activo MUST animarse mediante transición CSS (tokens de movimiento compartidos), salvo `prefers-reduced-motion: reduce`.

## Ejemplo de uso

```ts
import { createTabs } from 'libs/components/tabs';

const planetTabs = createTabs({
    tabs: [
        { id: 'facts', label: 'Datos', panel: factsPanelEl },
        { id: 'trivia', label: 'Curiosidades', panel: triviaPanelEl },
        { id: 'quiz', label: 'Quiz', panel: quizPanelEl },
    ],
});
```

## Evidencia de cumplimiento (T148, auditoría de ausencia de lógica de dominio)

Verificado en `Tabs.ts`: implementa el patrón WAI-ARIA `tablist`/`tab`/`tabpanel` con foco itinerante y activación automática con flechas, sin conocer el contenido de dominio de cada panel (recibido como `HTMLElement` opaco). Cobertura: `Tabs.test.ts` (5 casos). Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución (Phase 17, T152).

## Evidencia de cumplimiento — Fase 18 (T171-T176, 2026-08-19)

Verificado en `Tabs.ts`/`Tabs.css`: `tab.disabled` se refleja como `aria-disabled="true"` (no se usa `disabled` nativo, para mantenerse alineado con el patrón WAI-ARIA de foco itinerante); el manejador de clic ignora pestañas deshabilitadas y `findNextEnabledIndex()` las omite en la navegación con flechas; `validateIconConsistency()` lanza `TABS_MIXED_ICON_ERROR` ante una configuración mixta de `icon`; el panel activo anima su aparición mediante `@keyframes tabs-panel-reveal` consumiendo los tokens de movimiento. Historias nombradas añadidas: `ConPestanaDeshabilitada`, `ConIconos`. Cobertura ampliada: `Tabs.test.ts` (8 casos). Gates: `npm run lint`, `npm test` (129/129), `npm run build`, `npm run build-storybook` en verde.

## Fuera de alcance

* Pestañas verticales u orientación configurable: fuera de alcance de esta versión.
