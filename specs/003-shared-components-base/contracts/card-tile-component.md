---
title: "Contrato: Interfaz pública del componente Card/Tile"
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

# Contrato: Interfaz pública del componente `CardTile`

**Trazabilidad**: FR-022, FR-023, FR-024, US4, DM-009 (`CardTileProps`)

**Estado de implementación**: Implementado (oleada de prioridad P1, ampliación 2026-08-16; ver evidencia T148).

## Propósito

Definir la API pública mínima y estable de `CardTile` en `libs/components/card-tile/`, una unidad clicable y seleccionable en cuadrícula compuesta por icono/imagen, título y `Badge` de estado (p. ej. bloqueado/descubierto).

## Punto de entrada

```ts
export { createCardTile } from './CardTile';
export type { CardTileProps } from './CardTile';
```

## Firma pública

```ts
interface CardTileProps {
    title: string;
    icon?: IconName;
    imageSrc?: string;
    imageAlt?: string;
    statusLabel?: string;
    statusVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    locked?: boolean;
    onSelect: () => void;
}

function createCardTile(props: CardTileProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-901)**: `title` MUST ser obligatorio y no vacío.
* **R2 (VAL-902)**: MUST existir `icon` o `imageSrc` (al menos uno de los dos).
* **R3 (VAL-903)**: Si `locked` es `true`, `onSelect` MUST NOT dispararse, y el estado bloqueado MUST comunicarse a tecnologías de asistencia (p. ej. `aria-disabled="true"`).
* **R4 (VAL-904)**: Si no está bloqueada, la activación por clic o por teclado (Enter/Space) MUST invocar `onSelect` exactamente una vez por interacción.
* **R5 (VAL-905)**: `CardTile` MUST NOT exponer un atributo de estado "seleccionado" persistente propio; esa responsabilidad corresponde al consumidor (decisión de `/speckit-clarify`, R-025).

## Ejemplo de uso

```ts
import { createCardTile } from 'libs/components/card-tile';

const marsTile = createCardTile({
    title: 'Marte',
    icon: 'planet-mars',
    statusLabel: 'Descubierto',
    statusVariant: 'success',
    onSelect: () => selectPlanet('mars'),
});
```

## Evidencia de cumplimiento (T148, auditoría de ausencia de lógica de dominio)

Verificado en `CardTile.ts`: el componente solo gestiona presentación (icono/imagen, título, `Badge` de estado), estado `locked` y despacho de `onSelect`; no contiene reglas de negocio del dominio astronómico/quiz (nombres de planetas, condiciones de desbloqueo, puntuaciones), que permanecen en la vista consumidora. Cobertura: `CardTile.test.ts` (12 casos) sobre VAL-901..VAL-905. Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución (Phase 17, T152).

## Fuera de alcance

* Estado visual "seleccionado/actualmente activo" persistente (responsabilidad del consumidor, R-025).
* Layout de cuadrícula responsivo (queda a cargo de la vista consumidora).
