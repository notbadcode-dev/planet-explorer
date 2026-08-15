---
title: "Base mínima de componentes compartidos reutilizables — Modelo de datos"
feature: "003-shared-components-base"
type: "data-model"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
research: "./research.md"
tags: [frontend, ui, contract, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Modelo de datos: Base mínima de componentes compartidos reutilizables

**Entrada**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md)

## Alcance del modelo

Esta funcionalidad no introduce persistencia. Define contratos de datos en memoria para cinco componentes compartidos y reglas transversales de accesibilidad, composición e iconografía.

## Entidades y value objects

| ID | Entidad / Concepto | Tipo | Estado |
|----|---------------------|------|--------|
| DM-003 | InputProps | Value Object | New |
| DM-004 | PanelProps | Value Object | New |
| DM-005 | BadgeProps | Value Object | New |
| DM-006 | ProgressProps | Value Object | New |
| DM-007 | DialogProps | Value Object | New |
| DM-008 | Shared Visual Variant | Enum Family | New |

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
- `onInput: (value: string) => void`

**Reglas**:
- VAL-301: Debe existir nombre accesible efectivo (`label` no vacío o `ariaLabel` no vacío).
- VAL-302: Si `error` existe, el control expone estado inválido semántico.
- VAL-303: Si existe `hint` y/o `error`, ambos se vinculan como descripción accesible en orden estable.
- VAL-304: `onInput` recibe siempre el valor actual de texto del control nativo.

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

**Reglas**:
- VAL-701: `title` es obligatorio y define el nombre accesible principal del diálogo.
- VAL-702: Debe existir acción explícita de cierre.
- VAL-703: Al abrir, se establece foco inicial dentro del diálogo.
- VAL-704: Mientras está abierto, la navegación Tab queda contenida.
- VAL-705: Escape cierra y restaura foco al invocador.

## DM-008 — Shared Visual Variant

Familia de enums visuales por componente:
- `PanelVariant`: `default | highlight | danger`
- `BadgeVariant`: `default | success | warning | danger | info`

**Regla**:
- VAL-801: Cada variante visual debe mapearse a tokens globales y señales no cromáticas cuando comunica estado.

## Relaciones

- REL-01: `BadgeProps.icon` referencia el catálogo `IconName` del componente `Icon`.
- REL-02: `DialogProps.actions` se compone preferentemente con elementos creados por `Button` para acciones primarias/secundarias.
- REL-03: Todos los value objects consumen tokens globales como dependencia de presentación (no como campo de API).

## Invariantes transversales

- INV-301: Ningún contrato incluye lógica de dominio de features.
- INV-302: Toda API pública permanece pequeña y estable; opciones avanzadas quedan fuera de alcance.
- INV-303: No existen magic strings/numbers productivos fuera de `*.constants.ts`.
- INV-304: Toda iconografía compartida pasa por el componente `Icon`.

## Trazabilidad

- Historias: US1, US2, US3 en [spec.md](./spec.md)
- Requisitos: FR-001 a FR-018 en [spec.md](./spec.md)
- Decisiones: R-010 a R-016 en [research.md](./research.md)