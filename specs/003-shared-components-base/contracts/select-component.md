---
title: "Contrato: Interfaz pública del componente Select"
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

# Contrato: Interfaz pública del componente `Select`

**Trazabilidad**: FR-025, US5, DM-010 (`SelectProps`)

**Estado de implementación**: Implementado (oleada de prioridad P1, ampliación 2026-08-16; ver evidencia T148).

## Propósito

Definir la API pública mínima y estable de `Select` en `libs/components/select/`, para elegir exactamente una opción de un conjunto cerrado (planeta, categoría, dificultad).

## Punto de entrada

```ts
export { createSelect } from './Select';
export type { SelectProps } from './Select';
```

## Firma pública

```ts
interface SelectProps {
    options: { value: string; label: string }[];
    value?: string;
    label?: string;
    ariaLabel?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
}

function createSelect(props: SelectProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-1001)**: `createSelect` MUST garantizar nombre accesible efectivo mediante `label` o `ariaLabel`.
* **R2 (VAL-1002)**: `Select` MUST implementarse sobre el elemento `<select>` nativo del navegador (decisión de `/speckit-clarify`, R-020), no como listbox personalizado con ARIA.
* **R3 (VAL-1003)**: Si `options` está vacío, el control MUST renderizarse deshabilitado con una opción de marcador de posición, sin lanzar error en runtime.
* **R4 (VAL-1004)**: Si `value` coincide con una opción existente, esa opción MUST reflejarse como seleccionada al renderizar.
* **R5 (FR-038)**: El indicador visual de apertura MUST renderizarse mediante el catálogo `Icon` (no un marcador de navegador por defecto), posicionado sobre el `<select>` nativo sin alterar su comportamiento ni interceptar sus eventos.

## Ejemplo de uso

```ts
import { createSelect } from 'libs/components/select';

const difficultySelect = createSelect({
    label: 'Dificultad',
    options: [
        { value: 'easy', label: 'Fácil' },
        { value: 'medium', label: 'Media' },
    ],
    onChange: (value) => setDifficulty(value),
});
```

## Evidencia de cumplimiento (T148, auditoría de ausencia de lógica de dominio)

Verificado en `Select.ts`: el componente envuelve un `<select>` nativo, resuelve nombre accesible y refleja `options`/`value`/`onChange` sin conocer el significado de dominio de las opciones recibidas. Cobertura: `Select.test.ts` (6 casos). Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución (Phase 17, T152).

## Evidencia de cumplimiento — Fase 18 (T164-T166, 2026-08-19)

Verificado en `Select.ts`/`Select.css`: el `<select>` nativo se envuelve en `.select__control`, con un icono `caret-down` (`Icon`, decorativo) posicionado de forma absoluta con `pointer-events: none`, y `appearance: none` en `.select__field` para ocultar el marcador nativo del navegador sin afectar la interacción del `<select>`. Cobertura ampliada: `Select.test.ts` (7 casos). Gates: `npm run lint`, `npm test` (129/129), `npm run build`, `npm run build-storybook` en verde.

## Fuera de alcance

* Búsqueda/filtrado de opciones (autocomplete): fuera de alcance de esta versión.
* Selección múltiple (ver `CheckboxGroup`, componente distinto — FR-026).
