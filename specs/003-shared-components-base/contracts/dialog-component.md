---
title: "Contrato: Interfaz pública del componente Dialog"
feature: "003-shared-components-base"
type: "contract"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16T12:00:00Z"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [frontend, ui, contract, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Contrato: Interfaz pública del componente `Dialog`

**Trazabilidad**: FR-014, FR-018, FR-019, FR-020, FR-021, US2, DM-007 (`DialogProps`)

## Propósito

Definir la API pública mínima y estable de `Dialog` en `libs/components/dialog/`, exponiendo semántica modal accesible con ciclo completo de foco de teclado.

## Punto de entrada

```ts
export { createDialog } from './Dialog';
export type { DialogProps } from './Dialog';
```

## Firma pública

```ts
interface DialogProps {
    title: string;
    description?: string;
    content?: HTMLElement | HTMLElement[];
    actions?: HTMLElement | HTMLElement[];
    onClose: () => void;
    closeLabel?: string;
    size?: 'small' | 'medium' | 'large';
}

function createDialog(props: DialogProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-701)**: `title` MUST ser obligatorio y define el nombre accesible principal del diálogo.
* **R2 (VAL-702)**: MUST existir una acción explícita de cierre.
* **R3 (VAL-703/704)**: Al abrir, MUST establecerse foco inicial dentro del diálogo; mientras está abierto, la navegación Tab MUST quedar contenida (trap).
* **R4 (VAL-705)**: Escape MUST cerrar el diálogo y restaurar el foco al invocador, incluso cuando el invocador es un control distinto (botón, input) en cada demostración interactiva.
* **R5**: `content` y `actions` MUST aceptar `HTMLElement | HTMLElement[]`, preservando orden.
* **R6 (VAL-706)**: `size` MUST aceptar el mismo catálogo cerrado que `ButtonSize` (`'small' | 'medium' | 'large'`), aplicando `'medium'` por defecto para valores omitidos o no soportados en runtime.

## Ejemplo de uso

```ts
import { createDialog } from 'libs/components/dialog';

const confirmDialog = createDialog({
    title: 'Confirmar salida',
    content: warningTextEl,
    actions: [cancelButton, confirmButton],
    onClose: () => hideDialog(),
});
```

## Evidencia de cumplimiento (auditoría T038/T045, ampliada T070)

Verificado en `Dialog.ts`: `role="dialog"` + `aria-modal` + `aria-label`; foco inicial, trap de `Tab`/`Shift+Tab` y restauración de foco al invocador; `content`/`actions` aceptan `HTMLElement | HTMLElement[]`. **R6/FR-019 (T055/T057/T059/T061)**: `size` implementado con catálogo cerrado `small|medium|large`, `medium` por defecto, con clase modificadora `dialog--<size>` que controla el ancho del contenedor. Historias interactivas `InteractivoDesdeBoton`/`InteractivoDesdeInput` (T068/T069) demuestran el ciclo completo abrir/cerrar desde un invocador real y el retorno de foco (FR-021). Storybook cubre contenido/acciones múltiples y `closeLabel` personalizado (FR-020) y los tres tamaños. Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución.

## Fuera de alcance

* Posicionamiento avanzado (anclaje a elemento, offsets configurables).
* Diálogos no modales (ver `Toast`/`Snackbar`, componente distinto — FR-029).

## Evidencia de cumplimiento — Fase 18 (T184-T185, 2026-08-19, FR-036)

`.storybook/preview.ts` incorpora `keepDocumentHeightInSyncWithContent()`: sincroniza `document.body.style.minHeight` con `document.documentElement.scrollHeight` mediante `MutationObserver` (observando `childList`/`subtree`/`attributes` sobre `document.body`) y un listener de `resize`, invocado vía `requestAnimationFrame` en el decorador global. Verificación visual: se construyó Storybook (`npm run build-storybook`) y se inspeccionó la historia `componentes-dialog--base` en un viewport reducido (800×400) con Playwright; `document.documentElement.scrollHeight` (496px) excede la altura del viewport y el modal se renderiza completo dentro del área visible sin recorte (screenshot verificado). Considerado verificado para FR-036/US2-AC4.
