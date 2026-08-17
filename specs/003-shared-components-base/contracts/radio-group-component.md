---
title: "Contrato: Interfaz pública del componente RadioGroup"
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

# Contrato: Interfaz pública del componente `RadioGroup`

**Trazabilidad**: FR-026, US6, DM-011 (`RadioGroupProps`)

**Estado de implementación**: Implementado (oleada de prioridad P2, ampliación 2026-08-16; ver evidencia T148).

## Propósito

Definir la API pública mínima y estable de `RadioGroup` en `libs/components/radio-group/`, para capturar una respuesta de selección única entre varias alternativas (p. ej. respuestas de quiz).

## Punto de entrada

```ts
export { createRadioGroup } from './RadioGroup';
export type { RadioGroupProps } from './RadioGroup';
```

## Firma pública

```ts
interface RadioGroupProps {
    name: string;
    options: { value: string; label: string }[];
    value?: string;
    legend?: string;
    ariaLabel?: string;
    onChange: (value: string) => void;
}

function createRadioGroup(props: RadioGroupProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-1101)**: Todas las opciones MUST compartir el mismo `name` nativo para garantizar exclusividad mutua.
* **R2 (VAL-1102)**: MUST existir nombre de grupo accesible efectivo mediante `legend` o `ariaLabel`.
* **R3 (VAL-1103)**: Si ninguna opción está marcada por defecto, el grupo MUST renderizarse sin selección inicial, sin forzar una opción arbitraria.
* **R4 (FR-037)**: El cambio de estado marcado/desmarcado MUST animarse mediante transición CSS (tokens de movimiento compartidos), salvo `prefers-reduced-motion: reduce`.

## Ejemplo de uso

```ts
import { createRadioGroup } from 'libs/components/radio-group';

const quizAnswer = createRadioGroup({
    name: 'quiz-question-1',
    legend: '¿Cuál es el planeta más grande?',
    options: [
        { value: 'jupiter', label: 'Júpiter' },
        { value: 'saturn', label: 'Saturno' },
    ],
    onChange: (value) => setAnswer(value),
});
```

## Evidencia de cumplimiento (T148, auditoría de ausencia de lógica de dominio)

Verificado en `RadioGroup.ts`: el componente construye un `<fieldset>` con entradas `radio` nativas agrupadas por `name` y expone `onChange`, sin reglas de negocio propias. Cobertura: `RadioGroup.test.ts` (6 casos). Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución (Phase 17, T152).

## Evidencia de cumplimiento — Fase 18 (T167, T169, 2026-08-19)

Verificado en `RadioGroup.css`: cada `input[type="radio"]` aplica `transform: scale(1.15)` con `transition` sobre `:checked`, consumiendo `--motion-duration-fast`/`--motion-easing-standard`; el nodo `<input>` nativo se preserva sin rediseño de checkbox personalizado (verificado con prueba de identidad de nodo DOM). Cobertura ampliada: `RadioGroup.test.ts` (7 casos). Gates: `npm run lint`, `npm test` (129/129), `npm run build`, `npm run build-storybook` en verde.

## Fuera de alcance

* Selección múltiple (ver `CheckboxGroup`, componente independiente — R-021).
