---
title: "Convención: Historias de Storybook (nomenclatura y cobertura)"
type: "convention"
version: "1.1"
created: "2026-08-16"
updated: "2026-08-17"
status: "Approved"
source: "libs/components/**/*.stories.ts, specs/003-shared-components-base/research.md (R-017)"
tags: [convention, frontend, storybook, documentation]
---

# Convención: Historias de Storybook (nomenclatura y cobertura)

**Fuente**: patrón repetido en los `*.stories.ts` de los 16 componentes, más la
decisión explícita de `specs/003-shared-components-base/research.md` (R-017)
sobre cobertura de historias nombradas.

**Amplía**: elabora las reglas Q5/Q8 de [`visual-rules.md`](./visual-rules.md)
("Storybook MUST cubrir cada estado/variante/rama visual distinguible mediante
una historia nombrada e individual").

## Propósito

Fijar cómo se nombra y organiza el fichero `*.stories.ts` de un componente para
que Storybook sea consultable de forma homogénea y para que un componente nuevo
no reintroduzca decisiones ya tomadas (título, tags, cobertura de historias).

## Nomenclatura y metadatos

* **S1**: El `title` de cada fichero de historias MUST seguir el formato
  `'Componentes/{NombreComponente}'` (PascalCase, prefijo fijo `Componentes/`).
* **S2**: `tags: ['autodocs']` MUST declararse para habilitar la documentación
  automática de Storybook.
* **S3**: `@storybook/html-vite` no genera `argTypes` automáticamente a partir de
  tipos TypeScript (no hay docgen); por tanto cada prop pública, y en particular
  cada callback `on{Action}`, MUST declararse explícitamente en `argTypes` (p.
  ej. `{ action: 'clicked', control: false }` para callbacks).

## Cobertura de historias

* **S4**: Cada estado/variante/rama visual distinguible de la API pública MUST
  tener una historia nombrada e individual (p. ej. `Enabled`, `Disabled`,
  `Secondary`, `Danger`, `AccessibleLabelOnly`), no solo un `Playground` con
  controles interactivos. `Playground` MAY conservarse como complemento.
* **S5**: Un componente tipo overlay/modal (`Dialog` u equivalente futuro) MUST
  incluir al menos dos historias completamente interactivas que lo abran desde un
  control real distinto, para demostrar visualmente el retorno de foco al
  invocador al cerrarse (ver también R2 en
  [`interaction-patterns.md`](./interaction-patterns.md)).
* **S6**: El identificador `export const {Nombre}` de cada historia MUST
  escribirse en inglés (p. ej. `Disabled`, `WithoutVisibleLabel`,
  `WithTooltipOnOption`), igual que cualquier otro elemento técnico de código
  (constitution.md, sección "Documentación"). El castellano se reserva para lo
  que el usuario final o el equipo lee como contenido: `args` (p. ej.
  `label: 'Explorar planeta'`), el texto libre de
  `parameters.docs.description.story`, y las descripciones `it()`/`describe()`
  de los ficheros `*.test.ts` asociados (estas últimas MAY seguir en castellano
  por funcionar como documentación legible, no como identificador).

## Fuera de alcance

* El gotcha de implementación sobre acciones de Storybook duplicándose o no
  disparándose (`argTypesRegex`, `.storybook/preview.ts`) — es una peculiaridad
  operativa para quien escribe/depura historias con ayuda de IA, documentada en
  la skill [`planet-storybook-conventions`](../../../.github/skills/planet-storybook-conventions/SKILL.md),
  no en este documento.
* Los patrones de API que las historias ejercitan (factory, callbacks,
  catálogos cerrados) — viven en [`api-patterns.md`](./api-patterns.md).
