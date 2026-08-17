---
title: "Base ampliada de componentes compartidos reutilizables — Modelo de datos"
feature: "003-shared-components-base"
type: "data-model"
version: "1.3"
created: "2026-08-16"
updated: "2026-08-16T12:00:00Z"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
research: "./research.md"
tags: [frontend, ui, contract, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Modelo de datos: Base ampliada de componentes compartidos reutilizables

**Entrada**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md)

## Alcance del modelo

Esta funcionalidad no introduce persistencia. Define contratos de datos en memoria para cinco componentes compartidos base y nueve componentes adicionales de la ampliación 2026-08-16, más el componente `Slider` de la ampliación 2026-08-19, y reglas transversales de accesibilidad, composición e iconografía.

## Entidades y value objects

| ID | Entidad / Concepto | Tipo | Estado |
|----|---------------------|------|--------|
| DM-003 | InputProps | Value Object | New |
| DM-004 | PanelProps | Value Object | New |
| DM-005 | BadgeProps | Value Object | New |
| DM-006 | ProgressProps | Value Object | New |
| DM-007 | DialogProps | Value Object | New |
| DM-008 | Shared Visual Variant | Enum Family | New |
| DM-009 | CardTileProps | Value Object | New |
| DM-010 | SelectProps | Value Object | New |
| DM-011 | RadioGroupProps | Value Object | New |
| DM-012 | CheckboxGroupProps | Value Object | New |
| DM-013 | TabsProps | Value Object | New |
| DM-014 | TooltipProps | Value Object | New |
| DM-015 | ToastProps | Value Object | New |
| DM-016 | SpinnerProps | Value Object | New |
| DM-017 | AccordionProps | Value Object | New |
| DM-018 | SliderProps | Value Object | New |

## DM-003 — InputProps

**Atributos**:
- `value?: string`
- `placeholder?: string`
- `label?: string`
- `ariaLabel?: string`
- `hint?: string`
- `error?: string`
- `disabled?: boolean`
- `required?: boolean`
- `size?: 'small' | 'medium' | 'large'`
- `onInput: (value: string) => void`

**Reglas**:
- VAL-301: Debe existir nombre accesible efectivo (`label` no vacío o `ariaLabel` no vacío).
- VAL-302: Si `error` existe, el control expone estado inválido semántico.
- VAL-303: Si existe `hint` y/o `error`, ambos se vinculan como descripción accesible en orden estable, incluso cuando ambos están presentes simultáneamente.
- VAL-304: `onInput` recibe siempre el valor actual de texto del control nativo.
- VAL-305: `size` usa el mismo catálogo cerrado que `ButtonSize` (`small | medium | large`), por defecto `medium` para valores omitidos o no soportados en runtime.

## DM-004 — PanelProps

**Atributos**:
- `title?: string`
- `description?: string`
- `variant?: 'default' | 'highlight' | 'danger'`
- `content: HTMLElement | HTMLElement[]`

**Reglas**:
- VAL-401: `content` debe renderizarse preservando orden de entrada.
- VAL-402: `variant` controla apariencia visual del contenedor sin introducir lógica de dominio.

## DM-005 — BadgeProps

**Atributos**:
- `label: string`
- `variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'`
- `icon?: IconName`

**Reglas**:
- VAL-501: `label` es obligatorio y no vacío.
- VAL-502: Si hay icono, proviene del catálogo de `Icon`.
- VAL-503: Las variantes se distinguen por más de una señal visual (no solo color).

## DM-006 — ProgressProps

**Atributos**:
- `value: number`
- `max?: number`
- `label?: string`
- `ariaLabel?: string`
- `showValue?: boolean`

**Reglas**:
- VAL-601: Debe existir nombre accesible efectivo (`label` o `ariaLabel`).
- VAL-602: `value` efectivo se normaliza al rango `[0, maxEfectivo]`.
- VAL-603: `maxEfectivo` usa un mínimo válido seguro cuando `max` no es válido.
- VAL-604: El valor visible (si `showValue`) coincide con el valor semántico normalizado.

## DM-007 — DialogProps

**Atributos**:
- `title: string`
- `description?: string`
- `content?: HTMLElement | HTMLElement[]`
- `actions?: HTMLElement | HTMLElement[]`
- `onClose: () => void`
- `closeLabel?: string`
- `size?: 'small' | 'medium' | 'large'`

**Reglas**:
- VAL-701: `title` es obligatorio y define el nombre accesible principal del diálogo.
- VAL-702: Debe existir acción explícita de cierre.
- VAL-703: Al abrir, se establece foco inicial dentro del diálogo.
- VAL-704: Mientras está abierto, la navegación Tab queda contenida.
- VAL-705: Escape cierra y restaura foco al invocador, incluso cuando el invocador es un control distinto (botón, input) en cada demostración interactiva.
- VAL-706: `size` usa el mismo catálogo cerrado que `ButtonSize` (`small | medium | large`), por defecto `medium` para valores omitidos o no soportados en runtime.

## DM-008 — Shared Visual Variant

Familia de enums visuales por componente:
- `PanelVariant`: `default | highlight | danger`
- `BadgeVariant`: `default | success | warning | danger | info`
- `ComponentSize` (compartido por `Button`, `Input`, `Dialog`): `small | medium | large`, por defecto `medium`.

**Regla**:
- VAL-801: Cada variante visual debe mapearse a tokens globales y señales no cromáticas cuando comunica estado.
- VAL-802: Todo componente que declare `size` reutiliza el mismo catálogo cerrado `ComponentSize` que `Button`, sin definir escalas propias divergentes.

## DM-009 — CardTileProps

**Atributos**:
- `title: string`
- `icon?: IconName`
- `imageSrc?: string`
- `imageAlt?: string`
- `statusLabel?: string`
- `statusVariant?: BadgeVariant`
- `locked?: boolean`
- `onSelect: () => void`

**Reglas**:
- VAL-901: `title` es obligatorio y no vacío.
- VAL-902: Debe existir `icon` o `imageSrc` (al menos uno de los dos).
- VAL-903: Si `locked` es `true`, `onSelect` MUST NOT dispararse y el estado bloqueado se comunica a tecnologías de asistencia (p. ej. `aria-disabled="true"`).
- VAL-904: Si no está bloqueada, la activación por clic o por teclado (Enter/Space) dispara `onSelect` exactamente una vez por interacción.
- VAL-905: No existe atributo de estado "seleccionado" persistente en la API; corresponde al consumidor.

## DM-010 — SelectProps

**Atributos**:
- `options: { value: string; label: string }[]`
- `value?: string`
- `label?: string`
- `ariaLabel?: string`
- `disabled?: boolean`
- `onChange: (value: string) => void`

**Reglas**:
- VAL-1001: Debe existir nombre accesible efectivo (`label` o `ariaLabel`).
- VAL-1002: Se implementa sobre `<select>` nativo (R-020).
- VAL-1003: Si `options` está vacío, el control se renderiza deshabilitado con una opción de marcador de posición, sin lanzar error en runtime.
- VAL-1004: Si `value` coincide con una opción existente, esa opción se refleja como seleccionada al renderizar.

## DM-011 — RadioGroupProps

**Atributos**:
- `name: string`
- `options: { value: string; label: string }[]`
- `value?: string`
- `legend?: string`
- `ariaLabel?: string`
- `onChange: (value: string) => void`

**Reglas**:
- VAL-1101: Todas las opciones comparten el mismo `name` nativo para garantizar exclusividad mutua.
- VAL-1102: Debe existir nombre de grupo accesible efectivo (`legend` o `ariaLabel`).
- VAL-1103: Si ninguna opción está marcada por defecto, el grupo se renderiza sin selección inicial (sin forzar una opción arbitraria).

## DM-012 — CheckboxGroupProps

**Atributos**:
- `options: { value: string; label: string }[]`
- `values?: string[]`
- `legend?: string`
- `ariaLabel?: string`
- `onChange: (values: string[]) => void`

**Reglas**:
- VAL-1201: Debe existir nombre de grupo accesible efectivo (`legend` o `ariaLabel`).
- VAL-1202: Cada opción mantiene su estado de selección de forma independiente de las demás.
- VAL-1203: Si ninguna opción está marcada por defecto, el grupo se renderiza con todas las opciones deseleccionadas.

## DM-013 — TabsProps

**Atributos**:
- `tabs: { id: string; label: string; panel: HTMLElement }[]`
- `activeTabId?: string`
- `onChange?: (id: string) => void`

**Reglas**:
- VAL-1301: Cada `tab` se asocia con exactamente un `panel` mediante `aria-controls`/`aria-labelledby`.
- VAL-1302: Solo el panel de la pestaña activa es visible y anunciado; los demás permanecen ocultos (`hidden`).
- VAL-1303: La navegación con flechas izquierda/derecha mueve el foco entre pestañas siguiendo el patrón WAI-ARIA APG (R-022).
- VAL-1304: Si una pestaña no tiene `panel` asociado, se renderiza igualmente pero su panel queda vacío sin romper la navegación.

## DM-014 — TooltipProps

**Atributos**:
- `target: HTMLElement`
- `content: string`
- `placement?: 'top' | 'bottom' | 'left' | 'right'`

**Reglas**:
- VAL-1401: `content` se expone a tecnologías de asistencia mediante `aria-describedby` sobre `target`.
- VAL-1402: En desktop, se revela con hover de puntero o foco de teclado sobre `target`, y se oculta al perderlos.
- VAL-1403: En dispositivos táctiles, se revela/oculta mediante tap-to-toggle sobre `target` (R-024).
- VAL-1404: Se soporta sobre elementos deshabilitados sin bloquear la lectura de su contenido por tecnologías de asistencia.

## DM-015 — ToastProps

**Atributos**:
- `message: string`
- `variant?: 'info' | 'success' | 'warning' | 'danger'`
- `durationMs?: number`
- `onDismiss?: () => void`

**Reglas**:
- VAL-1501: `durationMs` por defecto es `4000` (R-023).
- VAL-1502: Se anuncia mediante región accesible en vivo (`aria-live="polite"`) sin mover el foco del usuario.
- VAL-1503: Múltiples instancias activas se apilan simultáneamente sin descartar ni retrasar ninguna (R-023).
- VAL-1504: No exige interacción de cierre obligatoria ni atrapa el foco de teclado.

## DM-016 — SpinnerProps

**Atributos**:
- `label?: string`
- `ariaLabel?: string`
- `size?: 'small' | 'medium' | 'large'`

**Reglas**:
- VAL-1601: Expone semántica accesible de carga indeterminada (p. ej. `role="status"` + `aria-busy="true"`), distinta de la semántica determinada de `Progress`.
- VAL-1602: Al retirarse del DOM, deja de anunciarse como estado de carga activo.
- VAL-1603: `size` reutiliza el mismo catálogo cerrado `ComponentSize` que `Button` cuando se declara.

## DM-017 — AccordionProps

**Atributos**:
- `sections: { id: string; title: string; content: HTMLElement }[]`
- `defaultExpandedIds?: string[]`
- `onToggle?: (id: string, expanded: boolean) => void`

**Reglas**:
- VAL-1701: Cada sección expone su estado expandido/colapsado mediante `aria-expanded` sobre su encabezado activable.
- VAL-1702: Varias secciones pueden estar expandidas simultáneamente de forma independiente por defecto (R-026).
- VAL-1703: Una sección con `content` vacío se renderiza igualmente expandible/colapsable, sin contenido visible al expandirse.

## DM-018 — SliderProps

**Atributos**:
- `value?: number`
- `min: number`
- `max: number`
- `step?: number`
- `label?: string`
- `ariaLabel?: string`
- `disabled?: boolean`
- `showValue?: boolean`
- `size?: 'small' | 'medium' | 'large'`
- `onChange: (value: number) => void`

**Reglas**:
- VAL-1801: Debe existir nombre accesible efectivo (`label` o `ariaLabel`).
- VAL-1802: Se implementa sobre `<input type="range">` nativo (R-027).
- VAL-1803: Si `value` se omite, el componente usa `min` como valor por defecto.
- VAL-1804: Todo `value` recibido fuera de `[min, max]` se normaliza al límite válido más cercano.
- VAL-1805: `showValue` por defecto es `true` (mismo patrón que `ProgressProps.showValue`, VAL-604); si es `false`, el valor permanece anunciable a tecnologías de asistencia aunque no se muestre visualmente.
- VAL-1806: `size` reutiliza el mismo catálogo cerrado `ComponentSize` que `Button` (VAL-802), por defecto `medium`.
- VAL-1807: Si `disabled` es `true`, `onChange` MUST NOT dispararse y el estado se comunica a tecnologías de asistencia.
- VAL-1808: Cuando `step` no divide exactamente `[min, max]`, el redondeo al valor alineado a `step` más cercano se delega en el comportamiento nativo de `<input type="range">` (sin lógica de redondeo propia).

## Relaciones

- REL-01: `BadgeProps.icon` referencia el catálogo `IconName` del componente `Icon`.
- REL-02: `DialogProps.actions` se compone preferentemente con elementos creados por `Button` para acciones primarias/secundarias.
- REL-03: Todos los value objects consumen tokens globales como dependencia de presentación (no como campo de API).
- REL-04: `CardTileProps.statusVariant`/`statusLabel` se renderizan internamente componiendo `Badge`; `CardTileProps.icon` referencia `IconName` de `Icon`.
- REL-05: `TooltipProps.target` referencia un `HTMLElement` externo ya renderizado por el consumidor (Tooltip no crea el elemento que decora).
- REL-06: `ToastProps` se monta dentro de un contenedor de apilado compartido a nivel de aplicación, no dentro del flujo normal del documento del componente que lo dispara.

## Invariantes transversales

- INV-301: Ningún contrato incluye lógica de dominio de features.
- INV-302: Toda API pública permanece pequeña y estable; opciones avanzadas quedan fuera de alcance.
- INV-303: No existen magic strings/numbers productivos fuera de `*.constants.ts`.
- INV-304: Toda iconografía compartida pasa por el componente `Icon`.
- INV-305: Ninguno de los 9 componentes de la ampliación 2026-08-16 incorpora lógica de juego/educación/astronomía (FR-032).

## Trazabilidad

- Historias: US1 a US12 en [spec.md](./spec.md)
- Requisitos: FR-001 a FR-051 en [spec.md](./spec.md)
- Decisiones: R-010 a R-027 en [research.md](./research.md)