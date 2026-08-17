---
title: "Contrato: Interfaz pública del componente CheckboxGroup"
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

# Contrato: Interfaz pública del componente `CheckboxGroup`

**Trazabilidad**: FR-026, US6, DM-012 (`CheckboxGroupProps`)

**Estado de implementación**: Implementado (oleada de prioridad P2, ampliación 2026-08-16; ver evidencia T148).

## Propósito

Definir la API pública mínima y estable de `CheckboxGroup` en `libs/components/checkbox-group/`, para capturar respuestas de selección múltiple entre varias alternativas.

## Punto de entrada

```ts
export { createCheckboxGroup } from './CheckboxGroup';
export type { CheckboxGroupProps } from './CheckboxGroup';
```

## Firma pública

```ts
interface CheckboxGroupProps {
    options: { value: string; label: string }[];
    values?: string[];
    legend?: string;
    ariaLabel?: string;
    onChange: (values: string[]) => void;
}

function createCheckboxGroup(props: CheckboxGroupProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-1201)**: MUST existir nombre de grupo accesible efectivo mediante `legend` o `ariaLabel`.
* **R2 (VAL-1202)**: Cada opción MUST mantener su estado de selección de forma independiente de las demás.
* **R3 (VAL-1203)**: Si ninguna opción está marcada por defecto, el grupo MUST renderizarse con todas las opciones deseleccionadas.
* **R4 (FR-037)**: El cambio de estado marcado/desmarcado MUST animarse mediante transición CSS (tokens de movimiento compartidos), salvo `prefers-reduced-motion: reduce`.

## Ejemplo de uso

```ts
import { createCheckboxGroup } from 'libs/components/checkbox-group';

const multiAnswer = createCheckboxGroup({
    legend: 'Selecciona todos los planetas rocosos',
    options: [
        { value: 'mercury', label: 'Mercurio' },
        { value: 'venus', label: 'Venus' },
        { value: 'earth', label: 'Tierra' },
    ],
    onChange: (values) => setSelectedPlanets(values),
});
```

## Evidencia de cumplimiento (T148, auditoría de ausencia de lógica de dominio)

Verificado en `CheckboxGroup.ts`: el componente gestiona un conjunto (`Set<string>`) de valores seleccionados de forma independiente y expone `onChange`, sin reglas de negocio propias. Cobertura: `CheckboxGroup.test.ts` (5 casos). Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución (Phase 17, T152).

## Evidencia de cumplimiento — Fase 18 (T168, T170, 2026-08-19)

Verificado en `CheckboxGroup.css`: cada `input[type="checkbox"]` aplica `transform: scale(1.15)` con `transition` sobre `:checked`, consumiendo `--motion-duration-fast`/`--motion-easing-standard`; el nodo `<input>` nativo se preserva sin rediseño de checkbox personalizado (verificado con prueba de identidad de nodo DOM). Cobertura ampliada: `CheckboxGroup.test.ts` (6 casos). Gates: `npm run lint`, `npm test` (129/129), `npm run build`, `npm run build-storybook` en verde.

## Fuera de alcance

* Selección única (ver `RadioGroup`, componente independiente — R-021).
