---
title: "Convención: Estructura de la librería de componentes"
type: "convention"
version: "1.1"
created: "2026-08-15"
updated: "2026-08-16"
status: "Approved"
source: "specs/001-component-library-architecture/"
tags: [frontend, architecture, convention]
---

# Convención: Estructura de la librería de componentes (`libs/components/`)

**Fuente**: FR-001, FR-002, FR-003, FR-004, FR-008, FR-009, FR-010, DM-002 (`ComponentEntry`) de `specs/001-component-library-architecture/`.

> Migrado desde `specs/001-component-library-architecture/contracts/component-library-convention.md`
> (2026-08-16) a `docs/` por ser una convención transversal consumida por múltiples features
> (`001`, `002`, `003`), no un contrato específico de una única feature.

## Propósito

Definir la estructura mínima que MUST cumplir cualquier componente añadido a `libs/components/` para considerarse completo, reutilizable y libre de conflictos de nombres, de forma verificable por cualquier desarrollador o por herramientas automáticas (lint/CI).

## Ubicación

Todo componente compartido y reutilizable del proyecto MUST vivir dentro de `libs/components/` (FR-001), en una carpeta propia nombrada con el nombre del componente en `kebab-case` (p. ej. `button`, `icon-badge`).

## Estructura mínima por componente

```text
libs/components/<component-name>/
├── <ComponentName>.ts          # Implementación (función factory pública)
├── <ComponentName>.test.ts     # Pruebas unitarias con Vitest (FR-003)
├── <ComponentName>.stories.ts  # Historia de Storybook (FR-004)
└── index.ts                    # Punto de entrada público (reexporta la API)
```

## Reglas del contrato

* **R1 (FR-010 / VAL-003)**: El nombre de la carpeta del componente (`<component-name>`) MUST ser único dentro de `libs/components/`. Un intento de crear un componente con un nombre ya existente MUST bloquearse automáticamente mediante lint o CI antes de fusionarse.
* **R2 (FR-003 / FR-009 / VAL-004)**: Un componente sin `<ComponentName>.test.ts` MUST considerarse incompleto (`status = "incomplete"`) y no listo para su uso por otras features.
* **R3 (FR-004 / FR-009 / VAL-004)**: Un componente sin `<ComponentName>.stories.ts` MUST considerarse incompleto (`status = "incomplete"`) y no listo para su uso por otras features.
* **R4 (FR-008)**: El componente MUST ser importable desde `libs/components/<component-name>` (vía `index.ts`) sin necesidad de duplicar su código en la feature consumidora.
* **R5 (FR-002)**: La implementación (`<ComponentName>.ts`) MUST limitarse a lógica presentacional ("dummy"); MUST NOT contener lógica de negocio del juego (reglas de puntuación, progresión, persistencia, etc.).

## Verificación de completitud (checklist)

Un componente se considera **completo** (`ComponentEntry.status = "complete"`) si, y solo si, cumple todo lo siguiente:

- [ ] Existe `<ComponentName>.ts` con una función factory exportada.
- [ ] Existe `<ComponentName>.test.ts` con al menos un test por estado relevante del componente (p. ej., habilitado/deshabilitado para `Button`).
- [ ] Existe `<ComponentName>.stories.ts` con al menos una historia de Storybook.
- [ ] Existe `index.ts` que reexporta la API pública del componente.
- [ ] El nombre de la carpeta no colisiona con ningún otro componente existente.

## Fuera de alcance de esta convención

* El proceso de aprobación previo para decidir si un componente nuevo debe ser compartido (ver constitución, sección "Componentes compartidos"): ese proceso es organizativo, no estructural.
* Herramientas concretas de lint/CI que implementan R1: su implementación técnica vive en `scripts/check-components.mjs`.
* La forma de la API pública (función factory, validación en runtime, callbacks, tipos derivados de catálogos cerrados): vive en [`api-patterns.md`](./api-patterns.md).
* El contenido opcional de `<ComponentName>.css`: vive en [`css.md`](./css.md).
* El entorno y los selectores usados en `<ComponentName>.test.ts`: viven en [`testing.md`](./testing.md).
* La nomenclatura y cobertura de `<ComponentName>.stories.ts`: viven en [`storybook.md`](./storybook.md).
