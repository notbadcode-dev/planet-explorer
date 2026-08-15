---
title: "Contrato: Convención estructural de la librería de componentes"
feature: "001-component-library-architecture"
type: "contract"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [frontend, architecture, contract]
dependencies: []
related_specs: []
---

# Contrato: Convención estructural de la librería de componentes (`libs/components/`)

**Trazabilidad**: FR-001, FR-002, FR-003, FR-004, FR-008, FR-009, FR-010, DM-002 (`ComponentEntry`)

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

## Fuera de alcance de este contrato

* El proceso de aprobación previo para decidir si un componente nuevo debe ser compartido (ver constitución, sección "Componentes compartidos"): ese proceso es organizativo, no estructural, y no se automatiza en esta funcionalidad.
* Herramientas concretas de lint/CI que implementan R1: su implementación técnica se detalla en `tasks.md` (fase `/speckit-tasks`), no en este contrato.
