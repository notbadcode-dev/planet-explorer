---
title: "Contrato: Interfaz pública del componente Slider"
feature: "003-shared-components-base"
type: "contract"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19T00:00:00Z"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [frontend, ui, contract, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Contrato: Interfaz pública del componente `Slider`

**Trazabilidad**: FR-047, FR-048, FR-049, FR-050, FR-051, US12, DM-018 (`SliderProps`), R-027

## Propósito

Definir la API pública mínima y estable de `Slider` en `libs/components/slider/`, exponiendo un valor numérico continuo ajustable sobre el elemento nativo `<input type="range">`, con normalización de rango y tamaño/valor visible consistentes con el resto del catálogo.

## Punto de entrada

```ts
export { createSlider } from './Slider';
export type { SliderProps } from './Slider';
```

## Firma pública

```ts
interface SliderProps {
    value?: number;
    min: number;
    max: number;
    step?: number;
    label?: string;
    ariaLabel?: string;
    disabled?: boolean;
    showValue?: boolean;
    size?: 'small' | 'medium' | 'large';
    onChange: (value: number) => void;
}

function createSlider(props: SliderProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-1801)**: `createSlider` MUST garantizar nombre accesible efectivo mediante `label` o `ariaLabel`.
* **R2 (VAL-1802)**: `createSlider` MUST construirse sobre `<input type="range">` nativo, heredando teclado y accesibilidad del sistema (mismo criterio que Select, R-020).
* **R3 (VAL-1803)**: Si `value` se omite, MUST usarse `min` como valor por defecto.
* **R4 (VAL-1804)**: Todo `value` recibido fuera de `[min, max]` MUST normalizarse al límite válido más cercano.
* **R5 (VAL-1805)**: `showValue` por defecto es `true`; si es `false`, el valor MUST permanecer anunciable a tecnologías de asistencia aunque no se muestre visualmente (mismo patrón que Progress, VAL-604).
* **R6 (VAL-1806)**: `size` MUST reutilizar el catálogo cerrado `ComponentSize` (`small | medium | large`, por defecto `medium`).
* **R7 (VAL-1807)**: Si `disabled` es `true`, `onChange` MUST NOT dispararse y el estado MUST comunicarse a tecnologías de asistencia.
* **R8 (VAL-1808)**: Cuando `step` no divide exactamente `[min, max]`, `createSlider` MUST delegar el redondeo al valor alineado a `step` más cercano en el comportamiento nativo de `<input type="range">`, sin reimplementar lógica de redondeo propia.

## Ejemplo de uso

```ts
import { createSlider } from 'libs/components/slider';

const volumeSlider = createSlider({
    label: 'Volumen',
    min: 0,
    max: 100,
    step: 5,
    value: 80,
    onChange: (value) => setVolume(value),
});
```

## Fuera de alcance

* Control deslizante de doble manejador (rango con dos valores); el elemento nativo `<input type="range">` solo soporta un único valor (R-027).
* Posicionamiento/tematización avanzada del track más allá de lo que el elemento nativo permite estilizar de forma consistente entre navegadores.

## Evidencia de auditoría de ausencia de lógica de dominio (FR-048, T201)

Revisión de `libs/components/slider/Slider.ts` (2026-08-19): el componente delega exclusivamente en el navegador para el comportamiento propio de `<input type="range">` (paso, redondeo a `step`, interacción por teclado/puntero). La única lógica presente en el módulo es de presentación/estado de UI:

* `resolveSize` / `isSliderSize`: resolución de la clase modificadora de tamaño (catálogo cerrado `ComponentSize`), sin relación con ningún dominio del juego.
* `resolveAccessibleName`: selección de `label`/`ariaLabel` para el nombre accesible, patrón idéntico al usado en `Input`, `Select` y `Progress`.
* `clampValue`: normalización de `value` fuera de `[min, max]` al límite más cercano (VAL-1804); no reimplementa el redondeo a `step` (VAL-1808), que se delega íntegramente en el atributo `step` nativo del elemento `<input type="range">`.
* El listener del evento `input` reenvía el valor actual (`Number(target.value)`) a `onChange` y actualiza el texto visible (`showValue`); no aplica transformaciones, validaciones ni reglas específicas de ningún minijuego o entidad del dominio "Explorador Espacial".

No se identifican referencias a entidades de dominio (planetas, misiones, puntuaciones, etc.) ni lógica de negocio embebida. El componente cumple FR-048.

