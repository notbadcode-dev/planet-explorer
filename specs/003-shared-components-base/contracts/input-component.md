---
title: "Contrato: Interfaz pública del componente Input"
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

# Contrato: Interfaz pública del componente `Input`

**Trazabilidad**: FR-009, FR-010, FR-019, US1, DM-003 (`InputProps`)

## Propósito

Definir la API pública mínima y estable de `Input` en `libs/components/input/`, garantizando captura de texto libre con estados de ayuda/error/deshabilitado y nombre accesible efectivo.

## Punto de entrada

```ts
export { createInput } from './Input';
export type { InputProps } from './Input';
```

## Firma pública

```ts
interface InputProps {
    value?: string;
    placeholder?: string;
    label?: string;
    ariaLabel?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    size?: 'small' | 'medium' | 'large';
    onInput: (value: string) => void;
}

function createInput(props: InputProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-301)**: `createInput` MUST renderizar un `<input>` nativo y garantizar nombre accesible efectivo mediante `label` no vacío o `ariaLabel` no vacío.
* **R2 (VAL-302)**: Si `error` está presente, el control MUST exponer `aria-invalid="true"`.
* **R3 (VAL-303)**: Si existen `hint` y/o `error`, ambos MUST vincularse como descripción accesible vía `aria-describedby` en orden estable, incluso cuando ambos están presentes simultáneamente.
* **R4 (VAL-304)**: `onInput` MUST recibir siempre el valor actual de texto del control nativo.
* **R5 (VAL-305)**: `size` MUST aceptar el mismo catálogo cerrado que `ButtonSize` (`'small' | 'medium' | 'large'`), aplicando `'medium'` por defecto para valores omitidos o no soportados en runtime.

## Ejemplo de uso

```ts
import { createInput } from 'libs/components/input';

const nameInput = createInput({
    label: 'Nombre de planeta',
    hint: 'Usa solo letras y espacios',
    onInput: (value) => setPlanetName(value),
});
```

## Evidencia de cumplimiento (auditoría T038/T045, ampliada T070)

Verificado en `Input.ts`: nombre accesible vía `label`/`ariaLabel`, `aria-invalid` cuando existe `error`, `aria-describedby` uniendo `hint`/`error` en orden estable. **R5/FR-019 (T054/T056/T058/T060)**: `size` implementado con catálogo cerrado `small|medium|large`, `medium` por defecto, con clase modificadora `input--<size>` y estilos tokenizados por tamaño; probado con fallback ante valores no soportados. Storybook cubre `hint`+`error` simultáneos (`ConAyudaYError`, FR-020) y los tres tamaños (`TamanoPequeno`/`TamanoMedio`/`TamanoGrande`). Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución.

## Fuera de alcance

* Theming dinámico por consumidor.
* Máscaras de entrada, autocompletado avanzado o validación asíncrona.
