---
title: "Convención: Testing de componentes (entorno y selectores)"
type: "convention"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
source: "vite.config.ts, libs/components/**/*.test.ts"
tags: [convention, frontend, testing, accessibility]
---

# Convención: Testing de componentes (entorno y selectores)

**Fuente**: configuración de `vite.config.ts` y patrón repetido sin variación en
los `*.test.ts` de los 16 componentes de `libs/components/`.

**Amplía**: elabora la regla Q2 de [`visual-rules.md`](./visual-rules.md)
("`npm run test` MUST pasar con foco en comportamiento y accesibilidad básica").

## Propósito

Fijar el entorno de test y la estrategia de selección de elementos en el DOM para
que los tests de un componente nuevo sean consistentes con los existentes y no
introduzcan una estrategia de testing divergente (otro entorno, otra librería de
aserciones DOM, otro tipo de selector).

## Entorno de test

* **T1**: Los tests de componentes MUST ejecutarse sobre el entorno `happy-dom`
  configurado en `vite.config.ts` (`test.environment: 'happy-dom'`). MUST NOT
  introducirse `jsdom` ni otro entorno DOM alternativo sin una justificación
  explícita en una spec.
* **T2**: El proyecto MUST NOT depender de librerías de aserciones de
  accesibilidad automatizadas (p. ej. `jest-axe`, `vitest-axe`); la verificación
  de accesibilidad se hace mediante aserciones explícitas sobre atributos ARIA y
  comportamiento de teclado (ver T4).
* **T3**: Los callbacks/eventos MUST mockearse con `vi.fn()` de Vitest; MUST NOT
  introducirse una librería de mocking adicional.

## Selectores en tests

* **T4**: Los tests MUST localizar elementos mediante:
  * clases CSS en formato BEM ya definidas por el componente (p. ej.
    `.dialog__container`, `.badge__status-icon`), consistentes con
    [`css.md`](./css.md);
  * atributos de rol/ARIA (p. ej. `[role="tab"]`, `[role="dialog"]`,
    `getAttribute('aria-expanded')`);
  * selectores de atributo de valor o tipo cuando aplique (p. ej.
    `input[value="saturn"]`, `input[type="radio"]`);
  * etiquetas nativas cuando sean suficientemente específicas (`button`, `label`,
    `legend`, `select`).
* **T5**: Los tests MUST NOT usar atributos `data-testid`; el proyecto no los
  utiliza en ningún componente y MUST mantenerse esa consistencia para no mezclar
  dos estrategias de selección.

## Fuera de alcance

* Los patrones de API que estos tests verifican (factory, validación,
  callbacks) — viven en [`api-patterns.md`](./api-patterns.md).
* El comportamiento de accesibilidad concreto que se testea (foco, ARIA live,
  teclado) — vive en [`interaction-patterns.md`](./interaction-patterns.md).
* Los criterios de aceptación específicos de un componente — viven en su
  contrato individual dentro de `specs/NNN-feature/contracts/`.
