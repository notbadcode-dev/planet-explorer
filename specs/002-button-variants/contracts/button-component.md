---
title: "Contrato: Interfaz pública ampliada del componente Button"
feature: "002-button-variants"
type: "contract"
version: "1.1"
created: "2026-08-15"
updated: "2026-08-15"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [frontend, ui, contract, accessibility]
dependencies: ["001-component-library-architecture"]
related_specs: ["001-component-library-architecture"]
---

# Contrato: Interfaz pública ampliada del componente `Button` (v1.1)

**Trazabilidad**: FR-001 a FR-011, US1, US2, US3, DM-001 (`ButtonProps`, ampliado)

**Supersede**: `../../001-component-library-architecture/contracts/button-component.md` (v1.0). La v1.0 se conserva como registro histórico y no se modifica; este documento es la referencia vigente de la API pública de `Button` a partir de `002-button-variants`.

## Propósito

Definir la API pública ampliada de `Button` tras añadir las props `variant` y `size`, preservando íntegramente el contrato v1.0 (nombre accesible, `disabled`, `onClick`, elemento nativo).

## Punto de entrada

Sin cambios respecto a v1.0: `libs/components/button/index.ts` reexporta al menos:

```ts
export { createButton } from './Button';
export type { ButtonProps } from './Button';
```

## Firma pública

```ts
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  /** Texto visible del botón. Opcional si se proporciona `ariaLabel`. */
  label?: string;

  /**
   * Etiqueta accesible alternativa para tecnologías de asistencia.
   * Obligatoria si `label` no está presente o está vacío.
   */
  ariaLabel?: string;

  /** Acción a ejecutar cuando el botón se activa (clic, o Enter/Espacio con foco). */
  onClick: () => void;

  /** Indica si el botón está deshabilitado. Por defecto `false`. */
  disabled?: boolean;

  /**
   * Énfasis visual/semántico del botón. Catálogo cerrado.
   * Por defecto `'primary'` si se omite o si se recibe un valor no soportado en runtime.
   */
  variant?: ButtonVariant;

  /**
   * Tamaño relativo del botón. Catálogo cerrado.
   * Por defecto `'medium'` si se omite o si se recibe un valor no soportado en runtime.
   */
  size?: ButtonSize;
}

function createButton(props: ButtonProps): HTMLButtonElement;
```

## Reglas del contrato

Las reglas **R1**–**R5** del contrato v1.0 (nombre accesible obligatorio, `disabled` nativo, bloqueo de `onClick` en `disabled`, función pura, elemento `<button>` nativo) se mantienen **sin cambios** y se aplican para cualquier combinación de `variant`/`size`.

Reglas nuevas de esta versión:

* **R6 (FR-001 / FR-002)**: `variant` MUST aceptar, como mínimo, `'primary'`, `'secondary'` y `'danger'`. Si se omite, el sistema MUST aplicar `'primary'`.
* **R7 (FR-003 / FR-004)**: `size` MUST aceptar, como mínimo, `'small'`, `'medium'` y `'large'`. Si se omite, el sistema MUST aplicar `'medium'`.
* **R8 (FR-005)**: `variant` y `size` MUST poder combinarse libremente; ninguna combinación está prohibida.
* **R9 (FR-006)**: Cuando `disabled` es `true`, el tratamiento visual de deshabilitado MUST aplicarse de forma consistente, sea cual sea la combinación de `variant`/`size`.
* **R10 (FR-008)**: Si `variant` o `size` reciben en tiempo de ejecución un valor fuera del catálogo cerrado (por ejemplo, desde JavaScript sin tipos), `createButton` MUST aplicar el valor por defecto correspondiente (`'primary'`/`'medium'`) en lugar de lanzar un error o producir un elemento sin estilo.
* **R11 (FR-009)**: La variante `'danger'` MUST distinguirse de `'primary'` y `'secondary'` mediante al menos un rasgo visual adicional al color (p. ej. borde, marcador, tipografía), de forma que no dependa exclusivamente del color.
* **R12 (FR-011, aclaración de `/speckit-clarify`)**: Cuando `size` es `'small'`, el elemento devuelto MUST mantener un área táctil (hit area) mínima de 44×44 px CSS, incluso si su contenido visible es más compacto.
* **R13**: `createButton` MUST seguir siendo una función pura respecto a sus props (R4 de v1.0): la resolución de `variant`/`size` (incluido el fallback de R10) MUST NOT depender de estado global ni de I/O.

## Ejemplo de uso

```ts
import { createButton } from 'libs/components/button';

// Compatibilidad retro: comportamiento idéntico a v1.0 (primary/medium implícitos)
const legacyButton = createButton({
  label: 'Explorar planeta',
  onClick: () => startExploration(),
});

// Acción secundaria
const cancelButton = createButton({
  label: 'Cancelar',
  variant: 'secondary',
  onClick: () => closeDialog(),
});

// Acción destructiva, tamaño pequeño (mantiene 44×44 px de área táctil)
const deleteButton = createButton({
  label: 'Eliminar',
  variant: 'danger',
  size: 'small',
  onClick: () => deleteProgress(),
});
```

## Fuera de alcance de este contrato

* Estilos visuales concretos (colores exactos, tipografía): la elección de qué rasgo no-color distingue `danger` (R11) es una decisión de implementación de `Button.css`, no de esta API pública.
* Ampliar el catálogo de `variant`/`size` más allá de los valores mínimos listados (ver Suposiciones de `spec.md`): fuera de alcance de esta versión.
* Botones con icono incorporado: sigue fuera de alcance (ver contrato v1.0 y Suposiciones de `spec.md`).
