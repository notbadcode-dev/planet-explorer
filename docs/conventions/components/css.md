---
title: "Convención: CSS opcional co-localizado por componente"
type: "convention"
version: "1.3"
created: "2026-08-15"
updated: "2026-08-16"
status: "Approved"
source: "specs/002-button-variants/"
tags: [frontend, architecture, convention]
---

# Convención: CSS opcional co-localizado por componente

**Fuente**: FR-001 a FR-011, DM-001 (`ButtonProps`, ampliado) de `specs/002-button-variants/`.

**Amplía**: [`structure.md`](./structure.md) (v1.0), que se mantiene vigente en todo lo demás. Esta versión añade únicamente la posibilidad de un fichero `.css` opcional por componente; no modifica ninguna otra regla de la v1.0.

> Migrado desde `specs/002-button-variants/contracts/component-library-convention-css.md`
> (2026-08-16) a `docs/` por ser una convención transversal aplicable a toda la librería de
> componentes, no un contrato específico de una única feature.

## Propósito

Documentar, a raíz de la introducción del primer CSS real del proyecto (`Button.css`), que cualquier componente de `libs/components/` MAY incluir opcionalmente un fichero de estilos co-localizado, y fijar la regla mínima que evita colisiones entre componentes a medida que la librería crezca.

**Alternativa descartada**: CSS-in-JS (`specs/002-button-variants/research.md`) — "sería una dependencia nueva sin justificación (viola Simplicidad primero, VI); los estilos inline dificultan expresar variantes combinables (`variant` × `size`) sin duplicar lógica condicional en TypeScript". No reconsiderar sin una justificación de feature explícita.

## Estructura ampliada por componente

```text
libs/components/<component-name>/
├── <ComponentName>.ts          # Implementación (función factory pública)
├── <ComponentName>.css         # OPCIONAL: estilos del componente
├── <ComponentName>.test.ts     # Pruebas unitarias con Vitest
├── <ComponentName>.stories.ts  # Historia de Storybook
└── index.ts                    # Punto de entrada público (reexporta la API)
```

`<ComponentName>.css` es **opcional**: un componente sin estilos propios sigue siendo válido y completo sin él. Su ausencia MUST NOT afectar a `status = "complete"` (definido en `structure.md`, DM-002).

## Reglas del contrato

* **R6**: Si un componente incluye `<ComponentName>.css`, MUST importarlo desde `<ComponentName>.ts` (p. ej. `import './Button.css'`), de forma que Vite lo procese automáticamente tanto en la build de producción como en Storybook (`@storybook/html-vite`).
* **R7**: Todas las clases CSS definidas en `<ComponentName>.css` MUST prefijarse de forma que identifiquen inequívocamente al componente o a un nombre de clase suficientemente específico (p. ej. `button`, `button--danger`), para evitar colisiones con estilos de otros componentes de `libs/components/` a medida que la librería crezca.
* **R8**: `<ComponentName>.css` MUST NOT definir selectores globales no prefijados (p. ej. un selector `button` o `*` sin cualificar) que puedan afectar a elementos fuera del propio componente.
* **R9**: Las reglas R1–R5 de [`structure.md`](./structure.md) se mantienen sin cambios y se aplican igual con o sin `<ComponentName>.css`.
* **R10**: Si un componente con `size` acepta contenido de longitud variable que puede no caber en el ancho objetivo de la talla elegida (p. ej. un número variable de botones de acción en `Dialog`), el `size` MUST tratarse como un ancho objetivo, no como una cota estricta: el componente MUST definir un `min-inline-size` adicional (vía selectores CSS como `:has()`, sin JavaScript de medición de layout) que calcule el ancho mínimo real necesario a partir de tokens existentes (p. ej. `--size-button-min-width`, `--space-3`, `--space-6`), de forma que el ancho real solo pueda crecer respecto al de la talla elegida, nunca reducirse. Ver `Dialog.css` (`.dialog__container:has(.dialog__confirm-actions > :nth-child(N))`) como precedente.

## Verificación de completitud (sin cambios respecto a v1.0)

La checklist de completitud de `ComponentEntry` no se modifica: `<ComponentName>.css` no es un requisito de completitud, es un artefacto opcional adicional.

## Fuera de alcance de esta convención

* Un sistema de theming o variables CSS compartidas entre componentes (p. ej. `:root` con tokens de color): no existe todavía una necesidad concreta que lo justifique (YAGNI); se abordaría en una futura funcionalidad si varios componentes necesitan compartir tokens visuales.
* Preprocesadores CSS (Sass, Less, PostCSS más allá de lo que Vite ya incluye): fuera de alcance; no hay necesidad demostrada actualmente.
