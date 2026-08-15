---
title: "Contrato: Convención estructural de la librería de componentes — CSS opcional co-localizado"
feature: "002-button-variants"
type: "contract"
version: "1.1"
created: "2026-08-15"
updated: "2026-08-15"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [frontend, architecture, contract]
dependencies: ["001-component-library-architecture"]
related_specs: ["001-component-library-architecture"]
---

# Contrato: Convención estructural de la librería de componentes — CSS opcional co-localizado (v1.1)

**Trazabilidad**: FR-001 a FR-011, DM-001 (`ButtonProps`, ampliado)

**Amplía**: `../../001-component-library-architecture/contracts/component-library-convention.md` (v1.0), que se mantiene vigente en todo lo demás. Esta versión añade únicamente la posibilidad de un fichero `.css` opcional por componente; no modifica ninguna otra regla de la v1.0.

## Propósito

Documentar, a raíz de la introducción del primer CSS real del proyecto (`Button.css`), que cualquier componente de `libs/components/` MAY incluir opcionalmente un fichero de estilos co-localizado, y fijar la regla mínima que evita colisiones entre componentes a medida que la librería crezca.

## Estructura ampliada por componente

```text
libs/components/<component-name>/
├── <ComponentName>.ts          # Implementación (función factory pública)
├── <ComponentName>.css         # NUEVO, OPCIONAL: estilos del componente
├── <ComponentName>.test.ts     # Pruebas unitarias con Vitest
├── <ComponentName>.stories.ts  # Historia de Storybook
└── index.ts                    # Punto de entrada público (reexporta la API)
```

`<ComponentName>.css` es **opcional**: un componente sin estilos propios (como `Button` antes de esta funcionalidad) sigue siendo válido y completo sin él. Su ausencia MUST NOT afectar a `status = "complete"` (definido en `001`, DM-002).

## Reglas del contrato

* **R6 (nuevo)**: Si un componente incluye `<ComponentName>.css`, MUST importarlo desde `<ComponentName>.ts` (p. ej. `import './Button.css'`), de forma que Vite lo procese automáticamente tanto en la build de producción como en Storybook (`@storybook/html-vite`).
* **R7 (nuevo)**: Todas las clases CSS definidas en `<ComponentName>.css` MUST prefijarse de forma que identifiquen inequívocamente al componente o a un nombre de clase suficientemente específico (p. ej. `button`, `button--danger`), para evitar colisiones con estilos de otros componentes de `libs/components/` a medida que la librería crezca.
* **R8 (nuevo)**: `<ComponentName>.css` MUST NOT definir selectores globales no prefijados (p. ej. un selector `button` o `*` sin cualificar) que puedan afectar a elementos fuera del propio componente.
* **R9 (nuevo)**: Las reglas R1–R5 de la convención v1.0 (unicidad de nombre de carpeta, obligatoriedad de test/story, importabilidad vía `index.ts`, ausencia de lógica de negocio) se mantienen sin cambios y se aplican igual con o sin `<ComponentName>.css`.

## Verificación de completitud (sin cambios respecto a v1.0)

La checklist de completitud de `ComponentEntry` (`001`, DM-002) no se modifica: `<ComponentName>.css` no es un requisito de completitud, es un artefacto opcional adicional.

## Fuera de alcance de este contrato

* Un sistema de theming o variables CSS compartidas entre componentes (p. ej. `:root` con tokens de color): no existe todavía una necesidad concreta que lo justifique (YAGNI); se abordaría en una futura funcionalidad si varios componentes necesitan compartir tokens visuales.
* Preprocesadores CSS (Sass, Less, PostCSS más allá de lo que Vite ya incluye): fuera de alcance; no hay necesidad demostrada actualmente.
