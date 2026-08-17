---
title: "Convención: Patrones de interacción y accesibilidad por tipo de componente"
type: "convention"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
source: "specs/003-shared-components-base/research.md (R-010, R-011, R-022, R-023, R-024)"
tags: [convention, accessibility, frontend]
---

# Convención: Patrones de interacción y accesibilidad por tipo de componente

**Fuente**: decisiones de `specs/003-shared-components-base/research.md`,
generalizadas como precedente para cualquier componente futuro del mismo tipo
(form control, modal, tabs, notificación, tooltip).

**Amplía**: elabora las reglas Q9/Q10 de [`visual-rules.md`](./visual-rules.md)
("componentes de selección MUST ser operables por teclado"; "componentes con
patrones WAI-ARIA específicos MUST cumplir el patrón correspondiente").

## Propósito

Describir el comportamiento concreto de accesibilidad/interacción que ya se
exige a los componentes existentes, para que un componente futuro del mismo tipo
(otro form control, otro modal, otro grupo de pestañas) siga el mismo patrón en
lugar de que cada feature reinterprete WCAG/WAI-ARIA desde cero.

## Nombre accesible e iconos decorativos (cualquier componente)

* **R1**: Todo icono puramente decorativo (sin significado propio) MUST
  renderizarse con `aria-hidden="true"`, tanto si se consume vía `Icon` (ver I4 en
  [`visual-rules.md`](./visual-rules.md)) como si es un icono inline del propio
  componente.
* **R2**: Todo elemento interactivo MUST tener un nombre accesible mediante,
  según aplique, `aria-label`, `<label>` asociado por `for`/`id`, o `<legend>`
  (para agrupaciones tipo `fieldset`).

## Form controls (`Input` y futuros form controls)

* **R3**: Un form control con `hint` y/o `error` MUST construir una cadena
  estable para `aria-describedby` que enlace ambos textos cuando existan.
* **R4**: Un form control con `error` activo MUST establecer
  `aria-invalid="true"`.

## Modales (`Dialog` y futuros overlays modales)

* **R5**: Un componente modal MUST implementar el ciclo completo de foco: foco
  inicial dentro del diálogo al abrirse, navegación `Tab` contenida dentro del
  diálogo (focus trap), cierre con `Escape`, y retorno del foco al elemento que
  lo invocó al cerrarse.

## Pestañas (`Tabs` y futuros componentes de pestañas)

* **R6**: Un componente de pestañas MUST implementar el patrón WAI-ARIA
  Authoring Practices Guide (APG) estándar: `role="tablist"` en el contenedor,
  `role="tab"` en cada pestaña, `role="tabpanel"` en cada panel, asociación por
  `aria-controls`/`aria-labelledby`, navegación entre pestañas con flechas
  izquierda/derecha, y activación automática del panel al navegar.

## Notificaciones (`Toast`/`Snackbar` y futuros sistemas de notificación)

* **R7**: Un sistema de notificaciones MUST usar una región en vivo
  (`aria-live="polite"`) y MUST apilar todas las notificaciones activas
  simultáneamente (no en cola secuencial), cada una con autodescarte tras un
  tiempo por defecto, sin bloquear el foco ni exigir cierre manual.

## Tooltips (`Tooltip` y futuros componentes con revelado por hover)

* **R8**: Un componente que revele contenido con hover de puntero en escritorio
  MUST ofrecer una alternativa equivalente en dispositivos táctiles (p. ej.
  tap-to-toggle) y MUST también revelarse con foco de teclado; MUST NOT asumir
  que el hover está siempre disponible, dado el público objetivo infantil en
  tablet/móvil.

## Fuera de alcance

* Los criterios de aceptación específicos y su evidencia de cumplimiento para
  la feature `003-shared-components-base` — viven en
  `specs/003-shared-components-base/contracts/`.
* Las reglas de estilo/tokens visuales — viven en
  [`visual-rules.md`](./visual-rules.md).
* La estrategia de testing/selectores usada para verificar estos patrones —
  vive en [`testing.md`](./testing.md).
