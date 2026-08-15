---
title: "Variantes del componente Button — Modelo de datos"
feature: "002-button-variants"
type: "data-model"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
research: "./research.md"
tags: [frontend, ui, accessibility]
dependencies: ["001-component-library-architecture"]
related_specs: ["001-component-library-architecture"]
---

# Modelo de datos: Variantes del componente Button

**Entrada**: `spec.md`, `plan.md`, `research.md` y el modelo de datos existente de `/specs/001-component-library-architecture/data-model.md`

**Propósito**: Documentar cómo se amplía `ButtonProps` (DM-001, definido en `001-component-library-architecture`) con las nuevas dimensiones `variant` y `size`.

**Nota**: Este documento se genera durante la Fase 1 de `/speckit-plan`. No se introducen entidades nuevas; se amplía DM-001.

## Alcance del modelo

Esta funcionalidad no introduce datos persistentes ni entidades nuevas. Amplía la forma de `ButtonProps` (Value Object ya existente, DM-001) con dos atributos opcionales adicionales, ambos enumeraciones cerradas.

## Fuentes

* **Constitución**: `../../.specify/memory/constitution.md`
* **Especificación**: `./spec.md`
* **Plan**: `./plan.md`
* **Investigación**: `./research.md`
* **Modelo existente**: `../001-component-library-architecture/data-model.md` (DM-001 — `ButtonProps`)

## Resumen del modelo

| ID       | Entidad / Concepto | Tipo         | Estado    |
| -------- | ------------------- | ------------ | --------- |
| DM-001   | ButtonProps          | Value Object | Modified (ampliado por esta funcionalidad) |

## DM-001 — ButtonProps (ampliación)

**Tipo**: Value Object

**Estado**: Modified — se conservan `label`, `ariaLabel`, `onClick`, `disabled` tal cual (ver `001-component-library-architecture/data-model.md`); se añaden `variant` y `size`.

### Nuevos atributos

| Atributo  | Tipo conceptual                              | Obligatorio | Valor por defecto | Descripción                                                                                   |
| --------- | --------------------------------------------- | ----------: | ------------------ | ------------------------------------------------------------------------------------------------ |
| `variant` | enum cerrado (`primary` \| `secondary` \| `danger`) | No | `primary`           | Énfasis visual/semántico del botón: acción principal, secundaria o destructiva/irreversible.      |
| `size`    | enum cerrado (`small` \| `medium` \| `large`)       | No | `medium`            | Tamaño relativo del botón, independiente de `variant`; `small` mantiene un área táctil mínima.     |

### Reglas de validación (nuevas)

* **VAL-005**: WHERE `variant` no se proporciona o no pertenece al catálogo cerrado (`primary`/`secondary`/`danger`), el sistema MUST usar `primary` (FR-002, FR-008).
* **VAL-006**: WHERE `size` no se proporciona o no pertenece al catálogo cerrado (`small`/`medium`/`large`), el sistema MUST usar `medium` (FR-004, FR-008).
* **VAL-007**: WHEN `size` es `small`, el elemento resultante MUST mantener un área táctil mínima de 44×44 px CSS (FR-011).
* **VAL-008**: La combinación de `variant` y `size` MUST ser libre: cualquier `variant` es válido con cualquier `size` (FR-005).

### Invariantes (nuevos)

* **INV-003**: Un `Button` siempre tiene exactamente un `variant` efectivo y un `size` efectivo (nunca ambos ausentes ni múltiples simultáneos), derivado de VAL-005/VAL-006.
* **INV-004**: Las reglas de accesibilidad ya existentes de `ButtonProps` (INV-001: nombre accesible obligatorio) se mantienen sin cambios para cualquier combinación de `variant`/`size`.

### Reglas de negocio asociadas

* **FR-001 / FR-002**: Catálogo cerrado de `variant`, con `primary` por defecto.
* **FR-003 / FR-004**: Catálogo cerrado de `size`, con `medium` por defecto.
* **FR-005**: `variant` y `size` se aplican de forma independiente y combinable.
* **FR-006**: `disabled` prevalece visualmente sobre cualquier `variant`/`size`.
* **FR-008**: Fallback a los valores por defecto ante valores no soportados en runtime.
* **FR-009**: `danger` no depende solo del color.
* **FR-011**: Área táctil mínima de `small`.

### Persistencia

Sin cambios respecto a DM-001 original: N/A — `ButtonProps` sigue existiendo únicamente en memoria mientras el componente está montado/renderizado.

### Trazabilidad

* **Historias relacionadas**: US1, US2, US3 (`spec.md` de `002-button-variants`)
* **Requisitos relacionados**: FR-001 a FR-011 (`spec.md` de `002-button-variants`)
* **Decisiones relacionadas**: R-006, R-007, R-008, R-009 (`research.md` de `002-button-variants`)
* **Modelo base**: DM-001 (`001-component-library-architecture/data-model.md`)
