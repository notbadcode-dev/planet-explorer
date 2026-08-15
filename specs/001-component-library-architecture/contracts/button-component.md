---
title: "Contrato: Interfaz pública del componente Button"
feature: "001-component-library-architecture"
type: "contract"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [frontend, ui, contract]
dependencies: []
related_specs: []
---

# Contrato: Interfaz pública del componente `Button`

**Trazabilidad**: FR-005, FR-006, FR-007, FR-011, US1, US2, US3, DM-001 (`ButtonProps`)

## Propósito

Definir la API pública mínima y estable del componente `Button` de `libs/components/`, de forma que cualquier consumidor del proyecto pueda instanciarlo sin conocer detalles de implementación, y que una futura reimplementación (p. ej. si se adoptara un framework de UI) pueda respetar el mismo contrato.

## Punto de entrada

El componente se expone a través de `libs/components/button/index.ts`, que reexporta al menos:

```ts
export { createButton } from './Button';
export type { ButtonProps } from './Button';
```

## Firma pública

```ts
interface ButtonProps {
  /** Texto visible del botón. Opcional si se proporciona `ariaLabel`. */
  label?: string;

  /**
   * Etiqueta accesible alternativa para tecnologías de asistencia.
   * Obligatoria si `label` no está presente o está vacío (ver Reglas).
   */
  ariaLabel?: string;

  /** Acción a ejecutar cuando el botón se activa (clic, o Enter/Espacio con foco). */
  onClick: () => void;

  /** Indica si el botón está deshabilitado. Por defecto `false`. */
  disabled?: boolean;
}

function createButton(props: ButtonProps): HTMLButtonElement;
```

## Reglas del contrato

* **R1 (FR-011 / VAL-001)**: `createButton` MUST lanzar un error de desarrollo (o, como mínimo, documentarlo como precondición) si tanto `label` como `ariaLabel` están ausentes o vacíos: el botón resultante siempre MUST tener un nombre accesible.
* **R2 (FR-006)**: El elemento devuelto MUST reflejar el estado `disabled` mediante el atributo nativo `disabled` del elemento `<button>`.
* **R3 (FR-007 / VAL-002)**: Cuando `disabled` es `true`, activar el botón (clic, teclado) MUST NOT invocar `onClick`.
* **R4**: `createButton` MUST ser una función pura respecto a sus props: no lee ni escribe estado global, no realiza llamadas de red ni contiene lógica de negocio (FR-002).
* **R5**: El elemento devuelto MUST ser un `<button>` HTML nativo (no un `<div>` con manejadores simulados), para heredar la accesibilidad y el comportamiento de teclado nativos del navegador.

## Ejemplo de uso

```ts
import { createButton } from 'libs/components/button';

const button = createButton({
  label: 'Explorar planeta',
  onClick: () => startExploration(),
});

document.body.appendChild(button);
```

```ts
// Botón solo con icono: requiere ariaLabel (R1)
const iconButton = createButton({
  ariaLabel: 'Cerrar',
  onClick: () => closeDialog(),
});
```

## Fuera de alcance de este contrato

* Estilos visuales concretos (colores, tipografía): se definen en la implementación y no forman parte de la API pública.
* Variantes adicionales de `Button` (p. ej. tamaños, iconos incorporados): fuera de alcance de esta primera versión, según Suposiciones de `spec.md`.
