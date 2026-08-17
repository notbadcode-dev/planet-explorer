---
title: "Contrato: Interfaz pública del componente Toast"
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

# Contrato: Interfaz pública del componente `Toast`

**Trazabilidad**: FR-029, US8, DM-015 (`ToastProps`)

**Estado de implementación**: Implementado (oleada de prioridad P2, ampliación 2026-08-16; ver evidencia T148).

## Propósito

Definir la API pública mínima y estable de `Toast`/`Snackbar` en `libs/components/toast/`, para feedback transitorio no bloqueante (p. ej. "¡Correcto!", "Logro desbloqueado").

## Punto de entrada

```ts
export { showToast } from './Toast';
export type { ToastProps } from './Toast';
```

## Firma pública

```ts
interface ToastProps {
    message: string;
    variant?: 'info' | 'success' | 'warning' | 'danger';
    durationMs?: number;
    onDismiss?: () => void;
}

function showToast(props: ToastProps): void;
```

## Reglas del contrato

* **R1 (VAL-1502)**: MUST anunciarse mediante una región accesible en vivo (`aria-live="polite"`) sin mover el foco de la persona usuaria.
* **R2 (VAL-1501)**: `durationMs` MUST tener un valor por defecto de `4000` cuando no se especifique (decisión de `/speckit-clarify`, R-023).
* **R3 (VAL-1503)**: Múltiples instancias activas MUST apilarse simultáneamente sin descartar ni retrasar ninguna.
* **R4 (VAL-1504)**: MUST NOT exigir una interacción de cierre obligatoria ni atrapar el foco de teclado, a diferencia de `Dialog`.
* **R5 (FR-043)**: La aparición y el descarte MUST animarse mediante transición CSS de entrada/salida (tokens de movimiento compartidos), sin alterar el tiempo total de `durationMs` percibido por el consumidor.

## Ejemplo de uso

```ts
import { showToast } from 'libs/components/toast';

showToast({
    message: '¡Correcto! Has encontrado 3 muestras.',
    variant: 'success',
});
```

## Evidencia de cumplimiento (T148, auditoría de ausencia de lógica de dominio)

Verificado en `Toast.ts`: gestiona únicamente un contenedor de apilado `aria-live="polite"` compartido y el ciclo de vida temporal (`durationMs`/`onDismiss`) de cada aviso; el `message` es texto opaco proporcionado por el consumidor. Cobertura: `Toast.test.ts` (5 casos) sobre VAL-1501..VAL-1504. Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución (Phase 17, T152).

## Evidencia de cumplimiento — Fase 18 (T177-T179, 2026-08-19)

Verificado en `Toast.ts`/`Toast.css`: la entrada anima automáticamente mediante `@keyframes toast-enter` al insertar el nodo; la salida añade la clase `.toast--exit` en `resolvedDuration - TOAST_EXIT_DURATION_MS` (150 ms antes de la eliminación), dejando intacto el `setTimeout` de eliminación original en `resolvedDuration` (VAL-1501 no se ve afectado). Cobertura ampliada: `Toast.test.ts` (6 casos). Gates: `npm run lint`, `npm test` (129/129), `npm run build`, `npm run build-storybook` en verde.

## Fuera de alcance

* Acciones inline dentro del propio Toast (p. ej. botón "Deshacer"): fuera de alcance de esta versión.
