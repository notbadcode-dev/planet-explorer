---
title: "Contrato: Interfaz pública del componente Tooltip"
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

# Contrato: Interfaz pública del componente `Tooltip`

**Trazabilidad**: FR-028, US9, DM-014 (`TooltipProps`)

**Estado de implementación**: Implementado (oleada de prioridad P3, ampliación 2026-08-16; ver evidencia T148).

## Propósito

Definir la API pública mínima y estable de `Tooltip` en `libs/components/tooltip/`, para mostrar texto explicativo bajo demanda sobre un elemento asociado.

## Punto de entrada

```ts
export { attachTooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';
```

## Firma pública

```ts
interface TooltipProps {
    target: HTMLElement;
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

function attachTooltip(props: TooltipProps): void;
```

## Reglas del contrato

* **R1 (VAL-1401)**: `content` MUST exponerse a tecnologías de asistencia mediante `aria-describedby` sobre `target`.
* **R2 (VAL-1402)**: En desktop, MUST revelarse con hover de puntero o foco de teclado sobre `target`, y MUST ocultarse al perderlos.
* **R3 (VAL-1403)**: En dispositivos táctiles, MUST revelarse/ocultarse mediante tap-to-toggle sobre `target` (decisión de `/speckit-clarify`, R-024).
* **R4 (VAL-1404)**: MUST soportarse sobre elementos deshabilitados sin bloquear la lectura de su contenido por tecnologías de asistencia.
* **R5**: MUST NOT bloquear la interacción con el resto de la página mientras está visible.
* **R6 (FR-044)**: En hover/foco, MUST aplicarse un retardo por defecto de 300 ms antes de revelarse; el ocultado (perder hover/foco) MUST seguir siendo inmediato.
* **R7 (FR-045)**: Cuando `prefers-reduced-motion: reduce` esté activo, el retardo MUST reducirse a 0 ms.

## Ejemplo de uso

```ts
import { attachTooltip } from 'libs/components/tooltip';

attachTooltip({
    target: helpIconEl,
    content: 'Un planeta enano es más pequeño que un planeta pero orbita el Sol.',
});
```

## Evidencia de cumplimiento (T148, auditoría de ausencia de lógica de dominio)

Verificado en `Tooltip.ts`: `attachTooltip` solo gestiona asociación `aria-describedby`, revelado/ocultado por hover/foco/tap-to-toggle y posicionamiento; `content` es texto plano opaco. Cobertura: `Tooltip.test.ts` (4 casos) sobre VAL-1401..VAL-1404. Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución (Phase 17, T152).

## Evidencia de cumplimiento — Fase 18 (T180-T182, 2026-08-19)

Verificado en `Tooltip.ts`: `scheduleShow()`/`cancelScheduledShow()` retrasan el revelado en `TOOLTIP_SHOW_DELAY_MS` (300 ms) tras `mouseenter`/`focus`, y `mouseleave`/`blur` cancelan el temporizador pendiente u ocultan de inmediato; `prefersReducedMotion()` consulta `window.matchMedia('(prefers-reduced-motion: reduce)')` (con guarda defensiva `typeof window.matchMedia === 'function'` para entornos sin soporte) y reduce el retardo a `TOOLTIP_REDUCED_MOTION_SHOW_DELAY_MS` (0 ms). El comportamiento táctil (tap-to-toggle, VAL-1403) permanece inmediato sin retardo. Cobertura ampliada: `Tooltip.test.ts` (6 casos, con `vi.useFakeTimers()` y stub manual de `matchMedia`). Gates: `npm run lint`, `npm test` (129/129), `npm run build`, `npm run build-storybook` en verde.

## Fuera de alcance

* Tooltips con contenido HTML enriquecido (solo texto plano en esta versión).
