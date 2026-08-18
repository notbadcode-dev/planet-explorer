---
title: "Base mínima de componentes compartidos reutilizables"
feature: "003-shared-components-base"
type: "task-list"
version: "2.5"
created: "2026-08-16"
updated: "2026-08-19T00:00:00Z"
status: "Implemented"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, accessibility, testing, architecture]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Tareas: Base mínima de componentes compartidos reutilizables

**Entrada**: Documentos de diseño de `/specs/003-shared-components-base/`

**Prerrequisitos**: `plan.md` y `spec.md` obligatorios; `research.md`, `data-model.md`, `contracts/` y `quickstart.md` disponibles.

**Organización**: Las tareas se agrupan por historia de usuario para permitir implementación, prueba y validación independiente por incremento.

**Nota de regeneración (2026-08-16)**: Este fichero fue regenerado por completo con `/speckit-tasks` a partir del estado actual de `spec.md`/`plan.md` (incluyendo las enmiendas de FR-003/SC-002 sobre historias de Storybook nombradas por estado, y el umbral cuantificado de SC-006). Tras la regeneración, `/speckit-implement` completó las 2 tareas restantes (T022, T032) añadiendo las historias nombradas por estado/variante; las 49 tareas están ahora `[X]`.

**Nota de ampliación (2026-08-19, Slider)**: Se añaden las Phase 19 y Phase 20 (T189-T203) para el componente `Slider` (FR-047 a FR-051, US12, DM-018, R-027), resuelto en `/speckit-clarify` y planificado en `/speckit-plan`. Estas tareas se completaron (`[X]`) mediante `/speckit-implement` el 2026-08-19, con evidencia real de `npm run lint`, `npm test` (144/144), `npm run build` y `npm run build-storybook`; el resto del fichero (T001-T188) permanece completado (`[X]`).

## Fase 1: Setup

**Propósito**: Preparar estructura mínima y puntos de entrada para los cinco componentes nuevos.

- [X] T001 Crear carpetas de componentes `input`, `panel`, `badge`, `progress`, `dialog` en libs/components/
- [X] T002 Crear esqueletos de archivos requeridos para cada componente en libs/components/input/, libs/components/panel/, libs/components/badge/, libs/components/progress/ y libs/components/dialog/
- [X] T003 [P] Definir exports públicos iniciales por componente en libs/components/input/index.ts, libs/components/panel/index.ts, libs/components/badge/index.ts, libs/components/progress/index.ts y libs/components/dialog/index.ts
- [X] T004 [P] Añadir historias base para registro en Storybook en libs/components/input/Input.stories.ts, libs/components/panel/Panel.stories.ts, libs/components/badge/Badge.stories.ts, libs/components/progress/Progress.stories.ts y libs/components/dialog/Dialog.stories.ts

**Checkpoint**: Estructura y puntos de entrada listos para comenzar implementación.

---

## Fase 2: Foundational

**Propósito**: Preparar reglas compartidas que bloquean o condicionan todas las historias.

- [X] T005 Auditar tokens reutilizables existentes y añadir faltantes de color en src/styles/_colors.css
- [X] T006 [P] Añadir tokens faltantes de spacing/radii/shadows/typography en src/styles/_spacing.css, src/styles/_radii.css, src/styles/_shadows.css y src/styles/_typography.css
- [X] T007 Integrar nuevos tokens globales en src/styles/index.css
- [X] T008 Definir convenciones compartidas de constantes de estado/accesibilidad en libs/components/input/Input.constants.ts, libs/components/panel/Panel.constants.ts, libs/components/badge/Badge.constants.ts, libs/components/progress/Progress.constants.ts y libs/components/dialog/Dialog.constants.ts
- [X] T009 Verificar y ampliar catálogo central de iconos cuando falte alguno requerido en libs/components/icon/Icon.constants.ts, libs/components/icon/Icon.type.ts y libs/components/icon/Icon.ts — ampliado con `check-circle`, `warning-circle`, `x-circle`, `info-circle`
- [X] T010 Ajustar contrato de validación visual/iconográfica para trazabilidad de implementación en specs/003-shared-components-base/contracts/shared-components-visual-rules.md

**Checkpoint**: Tokens, constantes base e iconografía central están preparados para desbloquear todas las historias.

---

## Fase 3: Historia de usuario 1 - Construir entradas y feedback consistentes (Prioridad: P1)

**Objetivo**: Entregar `Input`, `Badge` y `Progress` reutilizables con estados visuales y accesibilidad básica.

**Prueba independiente**: Montar una vista simple usando `Input`, `Badge` y `Progress` sin componentes locales duplicados, validando estados y anuncios accesibles.

**Requisitos relacionados**: FR-001, FR-002, FR-003, FR-009, FR-010, FR-012, FR-013

**Escenarios de aceptación relacionados**: US1-AC1, US1-AC2, US1-AC3

### Pruebas de US1

- [X] T011 [P] [US1] [FR-009] [FR-010] Implementar pruebas de `Input` para nombre accesible vía `label`/`ariaLabel`, `aria-invalid` cuando existe `error`, `aria-describedby` uniendo `hint`/`error`, y `onInput` con el valor actual en libs/components/input/Input.test.ts — 8 tests
- [X] T012 [P] [US1] [FR-012] Implementar pruebas de `Badge` para variantes distinguibles, icono de estado no-color por variante (`aria-hidden`) y distinción frente al icono opcional del consumidor en libs/components/badge/Badge.test.ts — 4 tests
- [X] T013 [P] [US1] [FR-013] Implementar pruebas de `Progress` para vacío/parcial/completo y normalización de `max <= 0`/`value` negativo en libs/components/progress/Progress.test.ts — 6 tests

### Implementación de US1

- [X] T014 [P] [US1] [FR-009] Definir tipos públicos y unions de `Input` en libs/components/input/Input.type.ts
- [X] T015 [P] [US1] [FR-012] Definir tipos públicos y unions de `Badge` en libs/components/badge/Badge.type.ts
- [X] T016 [P] [US1] [FR-013] Definir tipos públicos y unions de `Progress` en libs/components/progress/Progress.type.ts
- [X] T017 [US1] [FR-009] [FR-010] Implementar `Input` nativo con contrato accesible (nombre accesible, `aria-invalid`, `aria-describedby`) en libs/components/input/Input.ts
- [X] T018 [US1] [FR-012] Implementar `Badge` con variantes, icono de estado no-color por variante y consumo exclusivo de `Icon` en libs/components/badge/Badge.ts
- [X] T019 [US1] [FR-013] Implementar `Progress` accesible con clamp determinista en libs/components/progress/Progress.ts
- [X] T020 [P] [US1] [FR-007] Implementar estilos tokenizados de `Input`, `Badge` y `Progress` en libs/components/input/Input.css, libs/components/badge/Badge.css y libs/components/progress/Progress.css
- [X] T021 [US1] [FR-003] Completar historia `Playground` con controles interactivos (`argTypes`) de `Input`, `Badge` y `Progress` en libs/components/input/Input.stories.ts, libs/components/badge/Badge.stories.ts y libs/components/progress/Progress.stories.ts
- [X] T022 [P] [US1] [FR-003] [SC-002] Añadir historias de Storybook nombradas e individuales por cada estado/variante/rama visual distinguible, siguiendo la convención de `Button`: `Input` (`PorDefecto`, `ConAyuda`, `ConError`, `Deshabilitado`, `SinEtiquetaVisible`), `Badge` (`Default`, `Success`, `Warning`, `Danger`, `Info`), `Progress` (`Vacio`, `Parcial`, `Completo`, `FueraDeRango`) en libs/components/input/Input.stories.ts, libs/components/badge/Badge.stories.ts y libs/components/progress/Progress.stories.ts

**Checkpoint US1**: `Input`, `Badge` y `Progress` son reutilizables y verificables de forma independiente con sus pruebas e historias, incluyendo historias nombradas por estado/variante.

---

## Fase 4: Historia de usuario 2 - Componer bloques de contenido reutilizables (Prioridad: P2)

**Objetivo**: Entregar `Panel` y `Dialog` componibles con `HTMLElement | HTMLElement[]`, accesibles y listos para acciones reutilizables.

**Prueba independiente**: Renderizar `Panel` con contenido compuesto y `Dialog` con acciones de cierre y botones reutilizados, validando ciclo de foco.

**Requisitos relacionados**: FR-001, FR-003, FR-011, FR-014, FR-018

**Escenarios de aceptación relacionados**: US2-AC1, US2-AC2, US2-AC3

### Pruebas de US2

- [X] T023 [P] [US2] [FR-011] Implementar pruebas de composición, variantes e icono de estado no-color (`highlight`/`danger`) de `Panel` en libs/components/panel/Panel.test.ts — 7 tests
- [X] T024 [P] [US2] [FR-014] Implementar pruebas de `Dialog` para render accesible y callback de cierre en libs/components/dialog/Dialog.test.ts
- [X] T025 [US2] [FR-018] Añadir pruebas de teclado en `Dialog` para foco inicial, trap Tab, Escape y retorno de foco en libs/components/dialog/Dialog.test.ts — 9 tests en total

### Implementación de US2

- [X] T026 [P] [US2] [FR-011] Definir tipos públicos y unions de `Panel` en libs/components/panel/Panel.type.ts
- [X] T027 [P] [US2] [FR-014] Definir tipos públicos y unions de `Dialog` en libs/components/dialog/Dialog.type.ts
- [X] T028 [US2] [FR-011] Implementar `Panel` componible con variantes visuales e icono de estado no-color en libs/components/panel/Panel.ts
- [X] T029 [US2] [FR-014] [FR-018] Implementar `Dialog` modal accesible con acción clara de cierre y ciclo completo de foco de teclado en libs/components/dialog/Dialog.ts
- [X] T030 [P] [US2] [FR-007] Implementar estilos tokenizados de `Panel` y `Dialog` en libs/components/panel/Panel.css y libs/components/dialog/Dialog.css
- [X] T031 [US2] [FR-003] Completar historia `Playground` con controles interactivos de `Panel` y `Dialog`, con acciones compuestas usando `Button`, en libs/components/panel/Panel.stories.ts y libs/components/dialog/Dialog.stories.ts
- [X] T032 [P] [US2] [FR-003] [SC-002] Añadir historias de Storybook nombradas e individuales por cada estado/variante/rama visual distinguible: `Panel` (`Default`, `Highlight`, `Danger`), `Dialog` (`Base` con acción de cierre, `ConAccionesCompuestas` usando `Button`, `SinDescripcion`) en libs/components/panel/Panel.stories.ts y libs/components/dialog/Dialog.stories.ts

**Checkpoint US2**: `Panel` y `Dialog` quedan listos y verificables de forma independiente, incluyendo accesibilidad de teclado de modal e historias nombradas por estado/variante.

---

## Fase 5: Historia de usuario 3 - Mantener coherencia del sistema de componentes (Prioridad: P3)

**Objetivo**: Asegurar coherencia transversal de API, iconografía, tokens y convenciones de librería en los cinco componentes.

**Prueba independiente**: Validar catálogo y contratos con lint, pruebas, revisión de stories y ausencia de imports de iconos prohibidos.

**Requisitos relacionados**: FR-004, FR-005, FR-006, FR-007, FR-008, FR-015, FR-016, FR-017

**Escenarios de aceptación relacionados**: US3-AC1, US3-AC2, US3-AC3

### Pruebas de US3

- [X] T033 [P] [US3] [FR-006] Añadir cobertura de iconografía decorativa/semántica (icono de estado `aria-hidden` vs. icono opcional con significado) en libs/components/badge/Badge.test.ts y libs/components/dialog/Dialog.test.ts
- [X] T034 [P] [US3] [FR-007] Añadir verificación de uso de tokens globales en estilos de componentes compartidos en scripts/check-components.mjs

### Implementación de US3

- [X] T035 [US3] [FR-015] Revisar y estabilizar exports públicos por componente en libs/components/input/index.ts, libs/components/panel/index.ts, libs/components/badge/index.ts, libs/components/progress/index.ts y libs/components/dialog/index.ts
- [X] T036 [US3] [FR-008] Eliminar valores mágicos de implementación moviéndolos a constantes en libs/components/input/Input.constants.ts, libs/components/panel/Panel.constants.ts, libs/components/badge/Badge.constants.ts, libs/components/progress/Progress.constants.ts y libs/components/dialog/Dialog.constants.ts
- [X] T037 [US3] [FR-005] Sustituir cualquier consumo directo de iconos por `Icon` en libs/components/badge/Badge.ts y libs/components/dialog/Dialog.ts
- [X] T038 [US3] [FR-007] Ajustar estilos finales para usar exclusivamente tokens globales en libs/components/input/Input.css, libs/components/panel/Panel.css, libs/components/badge/Badge.css, libs/components/progress/Progress.css y libs/components/dialog/Dialog.css
- [X] T039 [US3] [FR-017] Documentar el alcance y la matriz objetivo de compatibilidad en specs/003-shared-components-base/quickstart.md
- [X] T040 [US3] [FR-016] Mantener actualizada la trazabilidad de cumplimiento de contratos en specs/003-shared-components-base/contracts/{input,panel,badge,progress,dialog}-component.md y specs/003-shared-components-base/contracts/shared-components-visual-rules.md (nota: contratos reestructurados de un fichero consolidado a un `.md` por componente el 2026-08-16, alineado con la convención de 001/002)

**Checkpoint US3**: El sistema de componentes mantiene coherencia de arquitectura, iconografía, tokens y API estable.

---

## Fase 6: Integración y aspectos transversales

**Propósito**: Validación final completa de calidad, integración y gates de constitución.

- [X] T041 Ejecutar y resolver incidencias de `npm run lint` en libs/components/, src/styles/ y scripts/check-components.mjs — 0 incidencias, `check-components.mjs`: 7/7 componentes verificados
- [X] T042 Ejecutar y resolver incidencias de `npm test` en libs/components/input/Input.test.ts, libs/components/panel/Panel.test.ts, libs/components/badge/Badge.test.ts, libs/components/progress/Progress.test.ts y libs/components/dialog/Dialog.test.ts — 57/57 tests
- [X] T043 Ejecutar y resolver incidencias de `npm run build` con foco en imports y estilos de libs/components/
- [X] T044 Ejecutar y resolver incidencias de `npm run build-storybook` para historias de libs/components/input/Input.stories.ts, libs/components/panel/Panel.stories.ts, libs/components/badge/Badge.stories.ts, libs/components/progress/Progress.stories.ts y libs/components/dialog/Dialog.stories.ts — re-ejecutado tras completar T022/T032, build correcto
- [X] T045 Validar la guía de ejecución de specs/003-shared-components-base/quickstart.md y ajustar pasos si hay desviaciones
- [X] T046 Verificar que los gates de constitución siguen satisfechos y reflejar estado final en specs/003-shared-components-base/plan.md
- [X] T047 [FR-004] Ejecutar auditoría de ausencia de lógica de dominio en componentes compartidos y documentar evidencia en specs/003-shared-components-base/contracts/{input,panel,badge,progress,dialog}-component.md
- [X] T048 [FR-017] [SC-006] Ejecutar la matriz de validación técnica desktop/móvil (Chromium/Firefox/WebKit reales + emulación Pixel 7/iPhone 14) y registrar evidencia de latencia <= 100 ms en al menos 8 de 10 iteraciones por escenario crítico (Input al escribir, Progress al actualizar, Dialog abrir/cerrar) en specs/003-shared-components-base/quickstart.md
- [X] T049 [FR-016] Añadir evidencia/trazabilidad explícita de cumplimiento de reglas R1-R12/V1-V4/I1-I5 en specs/003-shared-components-base/contracts/{input,panel,badge,progress,dialog}-component.md y specs/003-shared-components-base/contracts/shared-components-visual-rules.md

**Checkpoint final**: La feature completa satisface spec, plan, contratos y quality gates. Todas las tareas (T001-T049) están completadas.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

- **Fase 1 (Setup)**: Sin dependencias previas.
- **Fase 2 (Foundational)**: Depende de Fase 1.
- **US1 (Fase 3)**: Depende de Foundational.
- **US2 (Fase 4)**: Depende de Foundational; no depende funcionalmente de US1.
- **US3 (Fase 5)**: Depende de US1 y US2 porque consolida coherencia transversal sobre componentes ya implementados.
- **Fase 6 (Integración)**: Depende de US1, US2 y US3.
- **Phase 8 (revisión manual)**: Depende de Fase 6; añade tamaños y correcciones sobre `Input`/`Dialog` ya implementados.
- **US4/US5 (Phase 9/10, P1 ampliación)**: Depende de Foundational (Fase 2) y de `Badge`/`Icon` (US1) para composición interna de `CardTile`; no dependen entre sí.
- **US6 (Phase 11, P2 ampliación)**: Depende de Foundational; no depende de US4/US5.
- **US7 (Phase 12, P2 ampliación)**: Depende de Foundational; no depende de US4/US5/US6.
- **US8 (Phase 13, P2 ampliación)**: Depende de Foundational; no depende de US4/US5/US6/US7.
- **US9/US10/US11 (Phase 14/15/16, P3 ampliación)**: Dependen de Foundational; independientes entre sí y de US4-US8.
- **Phase 17 (Integración final de la ampliación)**: Depende de US4 a US11 (Phase 9-16).
- **Phase 18 (Refinamiento de interacción y microanimaciones)**: Depende de Phase 17; el bloque fundacional de tokens de movimiento (T155-T156) bloquea las tareas de transición CSS de Accordion, RadioGroup/CheckboxGroup, Tabs, Toast y Tooltip dentro de la misma fase.
- **US12/Phase 19 (Slider)**: Depende de Foundational (Fase 2); reutiliza `ComponentSize` (R-018) y el patrón `showValue` de `Progress` (US1), pero no depende funcionalmente de ninguna otra historia de usuario.
- **Phase 20 (Integración final de Slider)**: Depende de Phase 19.

### Dependencias entre historias de usuario

- **US1 (P1)**: None after Foundational.
- **US2 (P2)**: None after Foundational.
- **US3 (P3)**: Requiere artefactos implementados de US1 y US2 para auditoría global.
- **US12 (P3)**: None after Foundational.

### Orden dentro de cada historia

1. Pruebas de historia.
2. Tipos y contratos del componente.
3. Implementación de comportamiento.
4. Estilos tokenizados.
5. Historias y validación de aceptación (playground + historias nombradas por estado).

## Oportunidades de paralelización

- En Setup: T003 y T004 pueden ejecutarse en paralelo tras T001-T002.
- En Foundational: T006 puede ejecutarse en paralelo con T005; T009 puede empezar tras T008.
- En US1: T011, T012 y T013 en paralelo; también T014, T015 y T016 en paralelo; T022 es paralelizable entre los 3 componentes.
- En US2: T023 y T024 en paralelo; T026 y T027 en paralelo; T032 es paralelizable entre los 2 componentes.
- En US3: T033 y T034 en paralelo.
- **US4/US5 (Phase 9/10, P1 ampliación)**: pueden ejecutarse en paralelo entre sí al no compartir ficheros ni depender una de otra; T071/T072 en paralelo, T074/T075 en paralelo, T080/T081 en paralelo, T083/T084 en paralelo.
- **US6 (Phase 11)**: T089/T090 en paralelo; T092/T093 en paralelo; T094/T095 en paralelo; T098/T099 en paralelo.
- **US7 (Phase 12)**: T103/T104 en paralelo; T106/T107 en paralelo.
- **US8 (Phase 13)**: T112/T113 en paralelo; T115/T116 en paralelo.
- **US9/US10/US11 (Phase 14/15/16, P3 ampliación)**: pueden ejecutarse en paralelo entre sí; dentro de cada una, las tareas de tipos/constantes y de pruebas marcadas [P] son paralelizables.
- En Fase 6 (Integración base): T048 y T049 pueden ejecutarse en paralelo tras T041-T044.
- **Phase 18 (Refinamiento de interacción)**: T157/T161/T162 (Accordion) pueden ejecutarse en paralelo con T164/T166 (Select), T167/T168/T169/T170 (RadioGroup/CheckboxGroup), T171/T175 (Tabs), T177/T179 (Toast) y T180 (Tooltip), ya que no comparten ficheros; todas dependen de T155/T156 (tokens de movimiento) cuando consumen esos tokens.
- **US12 (Phase 19, Slider)**: T193/T194 en paralelo (ficheros distintos); T197 es paralelizable con la implementación de comportamiento (T195/T196) al no compartir fichero; T189/T190/T191 comparten fichero (`Slider.test.ts`) y se ejecutan en secuencia.

## Ejemplo de paralelización: US1

```text
Task: "Implementar pruebas de Input en libs/components/input/Input.test.ts"
Task: "Implementar pruebas de Badge en libs/components/badge/Badge.test.ts"
Task: "Implementar pruebas de Progress en libs/components/progress/Progress.test.ts"
```

```text
Task: "Añadir historias nombradas por estado de Input en libs/components/input/Input.stories.ts"
Task: "Añadir historias nombradas por variante de Badge en libs/components/badge/Badge.stories.ts"
Task: "Añadir historias nombradas por estado de Progress en libs/components/progress/Progress.stories.ts"
```

## Estrategia de implementación

### MVP primero

1. Completar Fase 1 y Fase 2.
2. Implementar y validar US1 (Fase 3).
3. Confirmar quickstart mínimo con Input + Badge + Progress.
4. Detenerse para entrega MVP si se requiere release incremental.

### Entrega incremental

1. Setup + Foundational.
2. US1 → validar → entregar.
3. US2 → validar → entregar.
4. US3 → validar → entregar.
5. Integración final y quality gates (5 componentes base).
6. Phase 8 → validar tamaños/correcciones de revisión manual → entregar.
7. Ampliación 2026-08-16, oleada P1: US4 (`CardTile`) + US5 (`Select`) → validar → entregar (desbloquea pantalla principal de selección de planetas).
8. Ampliación, oleada P2: US6 (`RadioGroup`/`CheckboxGroup`) + US7 (`Tabs`) + US8 (`Toast`) → validar → entregar (desbloquea quiz y ficha de planeta).
9. Ampliación, oleada P3: US9 (`Tooltip`) + US10 (`Spinner`) + US11 (`Accordion`) → validar → entregar (según necesidad).
10. Phase 17 → integración final y quality gates de la ampliación completa.
11. Phase 18 → refinamiento de interacción y microanimaciones (tokens de movimiento, transiciones de Accordion/RadioGroup/CheckboxGroup/Tabs/Toast, retardo de Tooltip, pestañas deshabilitadas/iconos en Tabs, icono de Select, iframe de Storybook ajustado al contenido) → validar → entregar.

### Ejecución paralela

1. Completar prerrequisitos compartidos.
2. Dividir trabajo por archivos/componentes marcados con [P].
3. Ejecutar validación por historia antes de integración final.
4. Dentro de cada oleada de la ampliación (P1/P2/P3), las historias de usuario correspondientes son independientes entre sí y pueden repartirse en paralelo.

## Validación de trazabilidad

- [x] Todas las historias de usuario están cubiertas (US1-US11).
- [x] Todos los requisitos funcionales están cubiertos (FR-001 a FR-046).
- [x] Todos los escenarios de aceptación pueden validarse.
- [x] Los cambios de modelo de datos necesarios están cubiertos (DM-003 a DM-017).
- [x] Los contratos necesarios están cubiertos (14 contratos por componente + convención transversal).
- [x] La estrategia de pruebas está cubierta.
- [x] Los gates de constitution.md están cubiertos.

**Nota de alcance (2026-08-16)**: Las fases 9-17 (T071-T154) fueron generadas por `/speckit-tasks` para cubrir US4-US11 (los 9 componentes de la ampliación 2026-08-16), regeneradas a partir del estado actual de spec.md/plan.md/research.md/data-model.md/contracts/. Las fases 1-8 (T001-T070) reflejan el estado ya implementado de los 5 componentes base; Phase 8 (T054-T070) se completó en esta sesión de `/speckit-implement` (gates lint/test/build/build-storybook en verde, 63/63 tests).

## Phase 7: Convergence

- [X] T050 Add catalog entries for `input`, `panel`, `badge`, `progress`, and `dialog` under `## Componentes disponibles` in libs/components/README.md, matching the existing `button/`/`icon/` entries per FR-002 / SC-001 (partial) — ya presentes en libs/components/README.md, verificado sin cambios

---

## Phase 8: Revisión manual de Storybook — bugs y ampliación de tamaños (2026-08-17)

**Propósito**: Corregir defectos detectados en revisión manual de Storybook y cubrir la ampliación de alcance acordada (tamaños en `Input`/`Dialog`, cobertura de combinaciones de casos límite y demostración interactiva de apertura/cierre de `Dialog`), añadida a `spec.md` (FR-019 a FR-021, SC-008, SC-009) y a `research.md`/`data-model.md`/contratos (R-018, R-019).

**Requisitos relacionados**: FR-007, FR-009, FR-019, FR-020, FR-021

### Correcciones (bugs sobre requisitos ya existentes, sin cambio de spec)

- [X] T051 [FR-007] Corregir estilo de `Progress`: añadir `appearance: none` y reglas `::-webkit-progress-bar`, `::-webkit-progress-value`, `::-moz-progress-bar` basadas en tokens existentes (`--color-surface-muted`, `--color-primary`, `--radius-pill`) para que la barra nativa `<progress>` deje de mostrar la apariencia por defecto del navegador en libs/components/progress/Progress.css
- [X] T052 [FR-009] Añadir tratamiento visual explícito de estado deshabilitado (opacidad/color/cursor con tokens), análogo a `.button:disabled`, en libs/components/input/Input.css
- [X] T053 Corregir la historia `Danger` de `Icon`, que referencia el token inexistente `--color-danger-text`, sustituyéndolo por un token real (`--color-danger`) en libs/components/icon/Icon.stories.ts (defecto fuera del alcance formal de esta feature, pero detectado en la misma revisión manual)

### Tamaños en Input y Dialog (FR-019)

- [X] T054 [P] [FR-019] Definir catálogo cerrado de tamaños reutilizando la convención de `Button` (`small | medium | large`, por defecto `medium`) en libs/components/input/Input.constants.ts y libs/components/input/Input.type.ts
- [X] T055 [P] [FR-019] Definir catálogo cerrado de tamaños en libs/components/dialog/Dialog.constants.ts y libs/components/dialog/Dialog.type.ts
- [X] T056 [FR-019] Aplicar clase modificadora de tamaño (`input--small|medium|large`) en la implementación de libs/components/input/Input.ts
- [X] T057 [FR-019] Aplicar clase modificadora de tamaño (`dialog--small|medium|large`) en la implementación de libs/components/dialog/Dialog.ts
- [X] T058 [P] [FR-007] [FR-019] Añadir estilos tokenizados por tamaño en libs/components/input/Input.css
- [X] T059 [P] [FR-007] [FR-019] Añadir estilos tokenizados por tamaño en libs/components/dialog/Dialog.css
- [X] T060 [P] [FR-019] Añadir pruebas de `size` (valor por defecto `medium`, clase aplicada por tamaño, fallback ante valor no soportado) en libs/components/input/Input.test.ts
- [X] T061 [P] [FR-019] Añadir pruebas de `size` en libs/components/dialog/Dialog.test.ts

### Cobertura de combinaciones de casos límite en Storybook (FR-020, SC-009)

- [X] T062 [P] [FR-020] Añadir historia nombrada de `Input` que combine `hint` y `error` simultáneamente en libs/components/input/Input.stories.ts
- [X] T063 [P] [FR-020] Añadir historia nombrada de `Badge` con icono provisto por el consumidor (`icon`) junto a su variante semántica, distinta del icono de estado automático, en libs/components/badge/Badge.stories.ts
- [X] T064 [P] [FR-020] Añadir historias nombradas de `Progress` para `showValue=false` y para `value` negativo en libs/components/progress/Progress.stories.ts
- [X] T065 [P] [FR-020] Añadir historia nombrada de `Panel` con contenido compuesto por múltiples elementos (`content` como arreglo) en libs/components/panel/Panel.stories.ts
- [X] T066 [P] [FR-020] Añadir historias nombradas de `Dialog` con contenido/acciones múltiples (`content`/`actions` como arreglo) y con `closeLabel` personalizado en libs/components/dialog/Dialog.stories.ts
- [X] T067 [FR-019] [FR-020] Añadir historias nombradas de tamaño (`small`/`medium`/`large`) de `Input` y `Dialog` en libs/components/input/Input.stories.ts y libs/components/dialog/Dialog.stories.ts

### Demostración interactiva de apertura/cierre de Dialog (FR-021, SC-009)

- [X] T068 [FR-021] Implementar historia interactiva de `Dialog` con `render` personalizado que monta un botón invocador real, abre el diálogo al activarlo y demuestra visualmente el retorno de foco al botón al cerrar, en libs/components/dialog/Dialog.stories.ts
- [X] T069 [FR-021] Implementar historia interactiva de `Dialog` con `render` personalizado que monta un input invocador real, abre el diálogo al activarlo y demuestra visualmente el retorno de foco al input al cerrar, en libs/components/dialog/Dialog.stories.ts

### Validación final de Phase 8

- [X] T070 Ejecutar `npm run lint`, `npm test`, `npm run build` y `npm run build-storybook`, y actualizar evidencia de cumplimiento (R1-R13/V1-V4/I1-I5/Q1-Q7) en specs/003-shared-components-base/contracts/{input,dialog}-component.md, specs/003-shared-components-base/contracts/shared-components-visual-rules.md y specs/003-shared-components-base/quickstart.md

**Checkpoint Phase 8**: Los defectos detectados en revisión manual están corregidos, `Input`/`Dialog` soportan tamaños consistentes con `Button`, y Storybook demuestra todas las combinaciones de casos límite y el ciclo interactivo completo de apertura/cierre de `Dialog` desde invocadores reales.

---

## Phase 9: Historia de usuario 4 - Construir la cuadrícula de selección de planetas (Prioridad: P1)

**Objetivo**: Entregar `CardTile`, la unidad clicable/seleccionable de cuadrícula (icono/imagen + título + `Badge` de estado) que bloquea la pantalla principal del juego.

**Prueba independiente**: Renderizar una cuadrícula de tarjetas con estados bloqueado/descubierto, verificando activación por clic/teclado y anuncio accesible del estado.

**Requisitos relacionados**: FR-022, FR-023, FR-024, FR-032

**Escenarios de aceptación relacionados**: US4-AC1, US4-AC2, US4-AC3

**Contrato**: [contracts/card-tile-component.md](./contracts/card-tile-component.md) · **Modelo de datos**: DM-009 (`CardTileProps`) · **Decisiones**: R-025

### Pruebas de US4

- [X] T071 [P] [US4] [FR-022] Implementar pruebas de `CardTile` para `title` obligatorio (VAL-901), exigencia de `icon` o `imageSrc` (VAL-902) y ausencia de estado "seleccionado" persistente en la API (VAL-905) en libs/components/card-tile/CardTile.test.ts
- [X] T072 [P] [US4] [FR-023] [FR-024] Añadir pruebas de `CardTile` para bloqueo de `onSelect` y comunicación `aria-disabled` en estado `locked` (VAL-903), activación exactamente una vez por clic/teclado (Enter/Space) cuando no está bloqueada (VAL-904), y verificación de que el icono se renderiza exclusivamente mediante `Icon` marcado como decorativo o con nombre accesible no redundante con `title` (FR-005, FR-006) en libs/components/card-tile/CardTile.test.ts

### Implementación de US4

- [X] T073 [US4] Crear carpeta y esqueleto de archivos de `card-tile` en libs/components/card-tile/
- [X] T074 [P] [US4] [FR-022] Definir tipos públicos `CardTileProps` en libs/components/card-tile/CardTile.type.ts
- [X] T075 [P] [US4] [FR-022] Definir constantes de estado/accesibilidad en libs/components/card-tile/CardTile.constants.ts
- [X] T076 [US4] [FR-022] [FR-023] [FR-024] Implementar `CardTile` componiendo `Badge` (estado) e `Icon`/`imageSrc`, con activación por clic/teclado y bloqueo accesible en libs/components/card-tile/CardTile.ts
- [X] T077 [P] [US4] [FR-007] Implementar estilos tokenizados de `CardTile` en libs/components/card-tile/CardTile.css
- [X] T078 [US4] Definir exports públicos en libs/components/card-tile/index.ts
- [X] T079 [US4] [FR-003] Añadir historias nombradas de `CardTile` (`Default`, `Bloqueada`, `ConImagen`, `SinEstado`) en libs/components/card-tile/CardTile.stories.ts

**Checkpoint US4**: `CardTile` es reutilizable y verificable de forma independiente, con activación accesible por clic/teclado y bloqueo comunicado a tecnologías de asistencia.

---

## Phase 10: Historia de usuario 5 - Elegir planeta, categoría o dificultad desde una lista (Prioridad: P1)

**Objetivo**: Entregar `Select`, construido sobre el `<select>` nativo, para elegir una opción de un conjunto cerrado.

**Prueba independiente**: Renderizar `Select` con una lista de opciones y verificar selección por teclado/puntero y anuncio accesible de la opción elegida.

**Requisitos relacionados**: FR-025, FR-032

**Escenarios de aceptación relacionados**: US5-AC1, US5-AC2, US5-AC3

**Contrato**: [contracts/select-component.md](./contracts/select-component.md) · **Modelo de datos**: DM-010 (`SelectProps`) · **Decisiones**: R-020

### Pruebas de US5

- [X] T080 [P] [US5] [FR-025] Implementar pruebas de `Select` para nombre accesible vía `label`/`ariaLabel` (VAL-1001), uso del elemento `<select>` nativo (VAL-1002) y reflejo de `value` preseleccionado (VAL-1004) en libs/components/select/Select.test.ts
- [X] T081 [P] [US5] [FR-025] Añadir prueba de `Select` para `options` vacío: control deshabilitado con marcador de posición, sin error en runtime (VAL-1003) en libs/components/select/Select.test.ts

### Implementación de US5

- [X] T082 [US5] Crear carpeta y esqueleto de archivos de `select` en libs/components/select/
- [X] T083 [P] [US5] [FR-025] Definir tipos públicos `SelectProps` en libs/components/select/Select.type.ts
- [X] T084 [P] [US5] [FR-025] Definir constantes en libs/components/select/Select.constants.ts
- [X] T085 [US5] [FR-025] Implementar `Select` sobre `<select>` nativo con placeholder deshabilitado ante `options` vacío en libs/components/select/Select.ts
- [X] T086 [P] [US5] [FR-007] Implementar estilos tokenizados de `Select` en libs/components/select/Select.css
- [X] T087 [US5] Definir exports públicos en libs/components/select/index.ts
- [X] T088 [US5] [FR-003] Añadir historias nombradas de `Select` (`Default`, `ConValorPreseleccionado`, `SinEtiquetaVisible`, `SinOpciones`) en libs/components/select/Select.stories.ts

**Checkpoint US5**: `Select` es reutilizable y verificable de forma independiente. Junto con `CardTile` (US4), la oleada P1 queda completa y desbloquea la pantalla principal de selección de planetas.

---

## Phase 11: Historia de usuario 6 - Capturar respuestas de quiz de opción única o múltiple (Prioridad: P2)

**Objetivo**: Entregar `RadioGroup` y `CheckboxGroup` como componentes independientes para selección única y múltiple respectivamente.

**Prueba independiente**: Renderizar un grupo de opción única y otro de opción múltiple, verificando exclusividad/no exclusividad de selección y agrupación accesible.

**Requisitos relacionados**: FR-026, FR-032

**Escenarios de aceptación relacionados**: US6-AC1, US6-AC2, US6-AC3

**Contratos**: [contracts/radio-group-component.md](./contracts/radio-group-component.md), [contracts/checkbox-group-component.md](./contracts/checkbox-group-component.md) · **Modelo de datos**: DM-011 (`RadioGroupProps`), DM-012 (`CheckboxGroupProps`) · **Decisiones**: R-021

### Pruebas de US6

- [X] T089 [P] [US6] [FR-026] Implementar pruebas de `RadioGroup` para `name` compartido garantizando exclusividad (VAL-1101), nombre de grupo accesible (VAL-1102) y ausencia de selección forzada por defecto (VAL-1103) en libs/components/radio-group/RadioGroup.test.ts
- [X] T090 [P] [US6] [FR-026] Implementar pruebas de `CheckboxGroup` para nombre de grupo accesible (VAL-1201), selección independiente por opción (VAL-1202) y ausencia de defaults forzados (VAL-1203) en libs/components/checkbox-group/CheckboxGroup.test.ts

### Implementación de US6

- [X] T091 [US6] Crear carpetas y esqueletos de archivos de `radio-group` y `checkbox-group` en libs/components/radio-group/ y libs/components/checkbox-group/
- [X] T092 [P] [US6] [FR-026] Definir tipos públicos `RadioGroupProps` en libs/components/radio-group/RadioGroup.type.ts
- [X] T093 [P] [US6] [FR-026] Definir tipos públicos `CheckboxGroupProps` en libs/components/checkbox-group/CheckboxGroup.type.ts
- [X] T094 [P] [US6] Definir constantes en libs/components/radio-group/RadioGroup.constants.ts
- [X] T095 [P] [US6] Definir constantes en libs/components/checkbox-group/CheckboxGroup.constants.ts
- [X] T096 [US6] [FR-026] Implementar `RadioGroup` con `name` compartido y agrupación accesible en libs/components/radio-group/RadioGroup.ts
- [X] T097 [US6] [FR-026] Implementar `CheckboxGroup` con selección independiente por opción en libs/components/checkbox-group/CheckboxGroup.ts
- [X] T098 [P] [US6] [FR-007] Implementar estilos tokenizados en libs/components/radio-group/RadioGroup.css
- [X] T099 [P] [US6] [FR-007] Implementar estilos tokenizados en libs/components/checkbox-group/CheckboxGroup.css
- [X] T100 [US6] Definir exports públicos en libs/components/radio-group/index.ts y libs/components/checkbox-group/index.ts
- [X] T101 [US6] [FR-003] Añadir historias nombradas de `RadioGroup` (`Default`, `ConSeleccionPrevia`) en libs/components/radio-group/RadioGroup.stories.ts
- [X] T102 [US6] [FR-003] Añadir historias nombradas de `CheckboxGroup` (`Default`, `ConSeleccionesPrevias`) en libs/components/checkbox-group/CheckboxGroup.stories.ts

**Checkpoint US6**: `RadioGroup` y `CheckboxGroup` son reutilizables y verificables de forma independiente para la pantalla de quiz.

---

## Phase 12: Historia de usuario 7 - Organizar secciones de la ficha de un planeta (Prioridad: P2)

**Objetivo**: Entregar `Tabs` siguiendo el patrón WAI-ARIA APG de tabs/tabpanel.

**Prueba independiente**: Renderizar pestañas con varias secciones y verificar navegación por teclado y asociación accesible pestaña/panel.

**Requisitos relacionados**: FR-027, FR-032

**Escenarios de aceptación relacionados**: US7-AC1, US7-AC2

**Contrato**: [contracts/tabs-component.md](./contracts/tabs-component.md) · **Modelo de datos**: DM-013 (`TabsProps`) · **Decisiones**: R-022

### Pruebas de US7

- [X] T103 [P] [US7] [FR-027] Implementar pruebas de `Tabs` para asociación `aria-controls`/`aria-labelledby` entre pestaña y panel (VAL-1301), visibilidad exclusiva del panel activo (VAL-1302) y tolerancia a pestaña sin panel asociado (VAL-1304) en libs/components/tabs/Tabs.test.ts
- [X] T104 [P] [US7] [FR-027] Añadir prueba de navegación con flechas izquierda/derecha moviendo el foco entre pestañas (VAL-1303) en libs/components/tabs/Tabs.test.ts

### Implementación de US7

- [X] T105 [US7] Crear carpeta y esqueleto de archivos de `tabs` en libs/components/tabs/
- [X] T106 [P] [US7] [FR-027] Definir tipos públicos `TabsProps` en libs/components/tabs/Tabs.type.ts
- [X] T107 [P] [US7] Definir constantes en libs/components/tabs/Tabs.constants.ts
- [X] T108 [US7] [FR-027] Implementar `Tabs` siguiendo el patrón WAI-ARIA APG (asociación, panel único visible, navegación por flechas) en libs/components/tabs/Tabs.ts
- [X] T109 [P] [US7] [FR-007] Implementar estilos tokenizados de `Tabs` en libs/components/tabs/Tabs.css
- [X] T110 [US7] Definir exports públicos en libs/components/tabs/index.ts
- [X] T111 [US7] [FR-003] Añadir historias nombradas de `Tabs` (`Default`, `TresSecciones`, `PanelVacio`) en libs/components/tabs/Tabs.stories.ts

**Checkpoint US7**: `Tabs` es reutilizable y verificable de forma independiente para la ficha de detalle de planeta.

---

## Phase 13: Historia de usuario 8 - Comunicar feedback inmediato no bloqueante (Prioridad: P2)

**Objetivo**: Entregar `Toast`/`Snackbar` con apilado simultáneo y auto-descarte a los 4000 ms por defecto.

**Prueba independiente**: Disparar la notificación y verificar que se anuncia por tecnologías de asistencia sin robar el foco ni bloquear el resto de la pantalla.

**Requisitos relacionados**: FR-029, FR-032

**Escenarios de aceptación relacionados**: US8-AC1, US8-AC2

**Contrato**: [contracts/toast-component.md](./contracts/toast-component.md) · **Modelo de datos**: DM-015 (`ToastProps`) · **Decisiones**: R-023

### Pruebas de US8

- [X] T112 [P] [US8] [FR-029] Implementar pruebas de `Toast` para región accesible en vivo `aria-live="polite"` sin robo de foco (VAL-1502) y ausencia de cierre obligatorio/focus trap (VAL-1504) en libs/components/toast/Toast.test.ts
- [X] T113 [P] [US8] [FR-029] Añadir pruebas de `Toast` para duración por defecto de 4000 ms (VAL-1501) y apilado simultáneo de múltiples instancias sin descartar ninguna (VAL-1503) en libs/components/toast/Toast.test.ts

### Implementación de US8

- [X] T114 [US8] Crear carpeta y esqueleto de archivos de `toast` en libs/components/toast/
- [X] T115 [P] [US8] [FR-029] Definir tipos públicos `ToastProps` en libs/components/toast/Toast.type.ts
- [X] T116 [P] [US8] [FR-029] Definir constantes (duración por defecto 4000 ms) en libs/components/toast/Toast.constants.ts
- [X] T117 [US8] [FR-029] Implementar `Toast`/`showToast` con contenedor de apilado compartido en libs/components/toast/Toast.ts
- [X] T118 [P] [US8] [FR-007] Implementar estilos tokenizados de `Toast` en libs/components/toast/Toast.css
- [X] T119 [US8] Definir exports públicos en libs/components/toast/index.ts
- [X] T120 [US8] [FR-003] Añadir historias nombradas de `Toast` (`Info`, `Success`, `Warning`, `Danger`, `Apilado`) en libs/components/toast/Toast.stories.ts

**Checkpoint US8**: `Toast`/`Snackbar` es reutilizable y verificable de forma independiente para feedback no bloqueante en quiz/progreso.

---

## Phase 14: Historia de usuario 9 - Mostrar ayuda contextual bajo demanda (Prioridad: P3)

**Objetivo**: Entregar `Tooltip` con soporte hover/foco en desktop y tap-to-toggle en táctil.

**Prueba independiente**: Enfocar/pasar el puntero sobre un elemento asociado y verificar aparición, anuncio accesible y desaparición al perder foco/hover.

**Requisitos relacionados**: FR-028, FR-032

**Escenarios de aceptación relacionados**: US9-AC1, US9-AC2

**Contrato**: [contracts/tooltip-component.md](./contracts/tooltip-component.md) · **Modelo de datos**: DM-014 (`TooltipProps`) · **Decisiones**: R-024

### Pruebas de US9

- [X] T121 [P] [US9] [FR-028] Implementar pruebas de `Tooltip` para `aria-describedby` sobre el elemento asociado (VAL-1401), revelado/ocultado por hover y foco de teclado en desktop (VAL-1402) y soporte sobre elementos deshabilitados (VAL-1404) en libs/components/tooltip/Tooltip.test.ts
- [X] T122 [P] [US9] [FR-028] Añadir prueba de `Tooltip` para tap-to-toggle en dispositivos táctiles (VAL-1403) en libs/components/tooltip/Tooltip.test.ts

### Implementación de US9

- [X] T123 [US9] Crear carpeta y esqueleto de archivos de `tooltip` en libs/components/tooltip/
- [X] T124 [P] [US9] [FR-028] Definir tipos públicos `TooltipProps` en libs/components/tooltip/Tooltip.type.ts
- [X] T125 [P] [US9] Definir constantes en libs/components/tooltip/Tooltip.constants.ts
- [X] T126 [US9] [FR-028] Implementar `attachTooltip` con detección de hover/foco (desktop) y tap-to-toggle (táctil) en libs/components/tooltip/Tooltip.ts
- [X] T127 [P] [US9] [FR-007] Implementar estilos tokenizados de `Tooltip` en libs/components/tooltip/Tooltip.css
- [X] T128 [US9] Definir exports públicos en libs/components/tooltip/index.ts
- [X] T129 [US9] [FR-003] Añadir historias nombradas de `Tooltip` (`Default`, `Placements`, `SobreElementoDeshabilitado`) en libs/components/tooltip/Tooltip.stories.ts

**Checkpoint US9**: `Tooltip` es reutilizable y verificable de forma independiente.

---

## Phase 15: Historia de usuario 10 - Indicar carga indeterminada (Prioridad: P3)

**Objetivo**: Entregar `Spinner`/`Loader` con semántica accesible de carga indeterminada, distinta de `Progress`.

**Prueba independiente**: Renderizar el componente durante una carga simulada y verificar semántica accesible de estado ocupado/indeterminado.

**Requisitos relacionados**: FR-030, FR-032

**Escenarios de aceptación relacionados**: US10-AC1, US10-AC2

**Contrato**: [contracts/spinner-component.md](./contracts/spinner-component.md) · **Modelo de datos**: DM-016 (`SpinnerProps`)

### Pruebas de US10

- [X] T130 [P] [US10] [FR-030] Implementar pruebas de `Spinner` para semántica `role="status"`/`aria-busy="true"` (VAL-1601) y cese de anuncio de carga activa al retirarse del DOM (VAL-1602) en libs/components/spinner/Spinner.test.ts
- [X] T131 [P] [US10] [FR-030] Añadir prueba de `Spinner` para reutilización del catálogo `ComponentSize` compartido con `Button` (VAL-1603) en libs/components/spinner/Spinner.test.ts

### Implementación de US10

- [X] T132 [US10] Crear carpeta y esqueleto de archivos de `spinner` en libs/components/spinner/
- [X] T133 [P] [US10] [FR-030] Definir tipos públicos `SpinnerProps` en libs/components/spinner/Spinner.type.ts
- [X] T134 [P] [US10] Definir constantes en libs/components/spinner/Spinner.constants.ts
- [X] T135 [US10] [FR-030] Implementar `Spinner` con semántica de carga indeterminada en libs/components/spinner/Spinner.ts
- [X] T136 [P] [US10] [FR-007] Implementar estilos tokenizados de `Spinner` en libs/components/spinner/Spinner.css
- [X] T137 [US10] Definir exports públicos en libs/components/spinner/index.ts
- [X] T138 [US10] [FR-003] Añadir historias nombradas de `Spinner` (`Small`, `Medium`, `Large`, `ConEtiqueta`) en libs/components/spinner/Spinner.stories.ts

**Checkpoint US10**: `Spinner`/`Loader` es reutilizable y verificable de forma independiente.

---

## Phase 16: Historia de usuario 11 - Exponer contenido expandible/colapsable (Prioridad: P3)

**Objetivo**: Entregar `Accordion` con expansión múltiple independiente por defecto.

**Prueba independiente**: Renderizar varias secciones y verificar expansión/colapso accesible por teclado y puntero.

**Requisitos relacionados**: FR-031, FR-032

**Escenarios de aceptación relacionados**: US11-AC1, US11-AC2

**Contrato**: [contracts/accordion-component.md](./contracts/accordion-component.md) · **Modelo de datos**: DM-017 (`AccordionProps`) · **Decisiones**: R-026

### Pruebas de US11

- [X] T139 [P] [US11] [FR-031] Implementar pruebas de `Accordion` para `aria-expanded` por encabezado de sección (VAL-1701) y tolerancia a `content` vacío (VAL-1703) en libs/components/accordion/Accordion.test.ts
- [X] T140 [P] [US11] [FR-031] Añadir prueba de `Accordion` para expansión simultánea e independiente de varias secciones por defecto (VAL-1702) en libs/components/accordion/Accordion.test.ts

### Implementación de US11

- [X] T141 [US11] Crear carpeta y esqueleto de archivos de `accordion` en libs/components/accordion/
- [X] T142 [P] [US11] [FR-031] Definir tipos públicos `AccordionProps` en libs/components/accordion/Accordion.type.ts
- [X] T143 [P] [US11] Definir constantes en libs/components/accordion/Accordion.constants.ts
- [X] T144 [US11] [FR-031] Implementar `Accordion` con expansión múltiple independiente en libs/components/accordion/Accordion.ts
- [X] T145 [P] [US11] [FR-007] Implementar estilos tokenizados de `Accordion` en libs/components/accordion/Accordion.css
- [X] T146 [US11] Definir exports públicos en libs/components/accordion/index.ts
- [X] T147 [US11] [FR-003] Añadir historias nombradas de `Accordion` (`Default`, `MultipleExpandido`, `SeccionVacia`) en libs/components/accordion/Accordion.stories.ts

**Checkpoint US11**: `Accordion` es reutilizable y verificable de forma independiente. Con esta fase se completan los 9 componentes de la ampliación 2026-08-16.

---

## Phase 17: Integración final de la ampliación 2026-08-16

**Propósito**: Validación final completa de calidad, coherencia transversal y evidencia de cumplimiento para los 9 componentes nuevos.

- [X] T148 [FR-004] [FR-032] Auditar ausencia de lógica de dominio en los 9 componentes nuevos y documentar evidencia en specs/003-shared-components-base/contracts/{card-tile,select,radio-group,checkbox-group,tabs,toast,tooltip,spinner,accordion}-component.md
- [X] T149 [FR-002] Añadir entradas de catálogo para los 9 componentes nuevos bajo `## Componentes disponibles` en libs/components/README.md (junto con la entrada pendiente de T050 para los 5 componentes base)
- [X] T150 [SC-012] Verificar operabilidad completa por teclado y exposición accesible de estado de selección/bloqueo en `CardTile`, `Select`, `RadioGroup` y `CheckboxGroup`
- [X] T151 [SC-013] Verificar cumplimiento de los patrones de accesibilidad WAI-ARIA correspondientes (pestaña/panel, región en vivo, expandido/colapsado) en `Tabs`, `Toast` y `Accordion`
- [X] T152 Ejecutar `npm run lint`, `npm test`, `npm run build` y `npm run build-storybook` para los 9 componentes nuevos y resolver cualquier incidencia (incluye verificar ausencia de magic values sin constante asociada, FR-008)
- [X] T153 [SC-011] Actualizar la sección 7 de specs/003-shared-components-base/quickstart.md con evidencia real de ejecución (sustituyendo el checklist teórico) tras validar T152
- [X] T154 [FR-016] Actualizar evidencia de cumplimiento de reglas Q8/Q9/Q10 en specs/003-shared-components-base/contracts/shared-components-visual-rules.md reflejando el estado final de la ampliación

**Checkpoint final de la ampliación**: Los 9 componentes de la ampliación 2026-08-16 (Card/Tile, Select, RadioGroup, CheckboxGroup, Tabs, Toast, Tooltip, Spinner, Accordion) están implementados, probados, documentados y validados en 3 oleadas de prioridad (P1→P2→P3), sin romper la funcionalidad ya entregada de los 5 componentes base.

---

**Nota de alcance (2026-08-19)**: La Phase 18 (T155-T188) fue generada por `/speckit-tasks` para cubrir el refinamiento de interacción y microanimaciones acordado en `spec.md` (FR-033 a FR-046, SC-014 a SC-020, sesiones de clarificación 2026-08-18 y 2026-08-19). Afecta a componentes ya implementados (Accordion, Select, RadioGroup, CheckboxGroup, Tabs, Toast, Tooltip, Spinner, Dialog/Storybook) sin introducir componentes nuevos ni romper su API pública existente.

## Phase 18: Refinamiento de interacción y microanimaciones (2026-08-19)

**Propósito**: Añadir transiciones CSS consistentes (basadas en un nuevo token de movimiento compartido), un modo de expansión exclusiva opcional en `Accordion`, pestañas deshabilitadas y la regla todo-o-nada de iconos en `Tabs`, un icono de indicador en `Select`, un retardo por defecto en `Tooltip` (con soporte de `prefers-reduced-motion`), y un iframe de Storybook que se ajuste al contenido para no recortar `Dialog`.

**Requisitos relacionados**: FR-007, FR-033 a FR-046

**Escenarios de aceptación relacionados**: US2-AC4 (nuevo), US5-AC4, US6-AC4, US7-AC3 a AC6, US8-AC3, US9-AC3, US10-AC3, US11-AC3 a AC6

### Fundacional: tokens de movimiento (bloquea el resto de la fase)

- [X] T155 [FR-007] [FR-046] Crear tokens de movimiento reutilizables (duración y easing, p. ej. `--motion-duration-fast`, `--motion-easing-standard`) en un nuevo archivo src/styles/_motion.css e integrarlo en src/styles/index.css
- [X] T156 [FR-045] Añadir un bloque `@media (prefers-reduced-motion: reduce)` en src/styles/_motion.css que reduzca a `0s` los tokens de duración de movimiento definidos en T155

### Accordion (US11) — transición, expansión exclusiva y affordance visual

- [X] T157 [P] [US11] [FR-033] [FR-034] [FR-035] Añadir pruebas de transición CSS al expandir/colapsar, de modo de expansión exclusiva opcional (`exclusive`, colapsando otras secciones) y de icono indicador de estado en el encabezado en libs/components/accordion/Accordion.test.ts
- [X] T158 [US11] [FR-034] Extender `AccordionProps` con la propiedad opcional `exclusive` (por defecto `false`) en libs/components/accordion/Accordion.type.ts
- [X] T159 [US11] [FR-034] Implementar la lógica de expansión exclusiva (colapsar las demás secciones al expandir una cuando `exclusive` está activo) preservando el modo múltiple por defecto en libs/components/accordion/Accordion.ts
- [X] T160 [US11] [FR-035] Añadir icono indicador de expandido/colapsado vía `Icon` en el encabezado de cada sección en libs/components/accordion/Accordion.ts
- [X] T161 [P] [US11] [FR-033] [FR-046] Añadir transición CSS de expandir/colapsar consumiendo los tokens de movimiento de T155 en libs/components/accordion/Accordion.css
- [X] T162 [P] [US11] [FR-035] Reforzar contraste y jerarquía visual del encabezado (icono indicador, color/peso) en libs/components/accordion/Accordion.css
- [X] T163 [US11] [FR-003] Añadir historia nombrada `ExpansionExclusiva` que demuestre el nuevo modo en libs/components/accordion/Accordion.stories.ts

### Select (US5) — icono de indicador de apertura

- [X] T164 [P] [US5] [FR-038] Añadir prueba de que el indicador de apertura se renderiza mediante el catálogo `Icon` en libs/components/select/Select.test.ts
- [X] T165 [US5] [FR-038] Sustituir el marcador nativo del `<select>` por un icono `Icon` posicionado con separación consistente respecto al borde derecho, sin alterar el `<select>` nativo subyacente, en libs/components/select/Select.ts
- [X] T166 [P] [US5] [FR-038] Añadir estilos de posicionamiento y espaciado del icono indicador en libs/components/select/Select.css

### RadioGroup y CheckboxGroup (US6) — transición al marcar/desmarcar

- [X] T167 [P] [US6] [FR-037] Añadir prueba de transición CSS al marcar/desmarcar una opción en libs/components/radio-group/RadioGroup.test.ts
- [X] T168 [P] [US6] [FR-037] Añadir prueba de transición CSS al marcar/desmarcar una opción en libs/components/checkbox-group/CheckboxGroup.test.ts
- [X] T169 [P] [US6] [FR-037] [FR-046] Añadir transición CSS consumiendo los tokens de movimiento de T155 al marcar/desmarcar en libs/components/radio-group/RadioGroup.css
- [X] T170 [P] [US6] [FR-037] [FR-046] Añadir transición CSS consumiendo los tokens de movimiento de T155 al marcar/desmarcar en libs/components/checkbox-group/CheckboxGroup.css

### Tabs (US7) — transición, pestañas deshabilitadas y regla todo-o-nada de iconos

- [X] T171 [P] [US7] [FR-041] [FR-042] Añadir pruebas de pestaña deshabilitada (no activable por clic/teclado, omitida en navegación por flechas, `aria-disabled`) y de validación todo-o-nada de iconos por pestaña (lanza error ante configuración mixta) en libs/components/tabs/Tabs.test.ts
- [X] T172 [US7] [FR-041] Extender `TabItem`/`TabsProps` con la propiedad `disabled` por pestaña en libs/components/tabs/Tabs.type.ts
- [X] T173 [US7] [FR-041] Implementar la omisión de pestañas deshabilitadas en la activación por clic/teclado y en la navegación por flechas en libs/components/tabs/Tabs.ts
- [X] T174 [US7] [FR-042] Implementar la validación todo-o-nada de iconos por pestaña (lanzar error de configuración, consistente con el patrón de `CardTile`) en libs/components/tabs/Tabs.ts y libs/components/tabs/Tabs.constants.ts
- [X] T175 [P] [US7] [FR-040] [FR-046] Añadir transición CSS del panel activo consumiendo los tokens de movimiento de T155 en libs/components/tabs/Tabs.css
- [X] T176 [US7] [FR-003] Añadir historias nombradas `ConPestanaDeshabilitada` y `ConIconos` en libs/components/tabs/Tabs.stories.ts

### Toast (US8) — transición de entrada/salida

- [X] T177 [P] [US8] [FR-043] Añadir prueba de transición de entrada/salida al aparecer y descartarse en libs/components/toast/Toast.test.ts
- [X] T178 [US8] [FR-043] Ajustar el ciclo de vida de descarte para permitir que la animación de salida se complete antes de eliminar el nodo en libs/components/toast/Toast.ts
- [X] T179 [P] [US8] [FR-043] [FR-046] Añadir transición CSS de entrada/salida consumiendo los tokens de movimiento de T155 en libs/components/toast/Toast.css

### Tooltip (US9) — retardo por defecto y prefers-reduced-motion

- [X] T180 [P] [US9] [FR-044] [FR-045] Añadir prueba del retardo de 300 ms por defecto antes de mostrarse (con temporizadores simulados) y de su reducción a 0 cuando se simula `prefers-reduced-motion: reduce` en libs/components/tooltip/Tooltip.test.ts
- [X] T181 [US9] [FR-044] Definir la constante de retardo por defecto (300 ms) en libs/components/tooltip/Tooltip.constants.ts e implementarla en libs/components/tooltip/Tooltip.ts
- [X] T182 [US9] [FR-045] Implementar la detección de `prefers-reduced-motion: reduce` para reducir el retardo a 0 en libs/components/tooltip/Tooltip.ts

### Spinner (US10) — verificación de texto opcional

- [X] T183 [P] [US10] [FR-039] Añadir prueba explícita de que `Spinner` sin `label` conserva un nombre accesible sin renderizar texto visible en libs/components/spinner/Spinner.test.ts

### Storybook — iframe ajustado al contenido (US2, Dialog)

- [X] T184 [US2] [FR-036] Configurar el iframe de cada historia para ajustar su altura al contenido renderizado en lugar de una altura fija en .storybook/preview.ts
- [X] T185 [US2] [FR-036] Verificar visualmente que las historias de `Dialog` ya no recortan el modal dentro del iframe

### Validación final de Phase 18

- [X] T186 Ejecutar `npm run lint`, `npm test`, `npm run build` y `npm run build-storybook`, resolviendo cualquier incidencia derivada del refinamiento de interacción
- [X] T187 Actualizar evidencia de cumplimiento de FR-033 a FR-046 en specs/003-shared-components-base/contracts/{accordion,select,radio-group,checkbox-group,tabs,toast,tooltip,dialog}-component.md y en specs/003-shared-components-base/contracts/shared-components-visual-rules.md
- [X] T188 Actualizar specs/003-shared-components-base/quickstart.md con evidencia real de ejecución del refinamiento de interacción tras validar T186

**Checkpoint Phase 18**: Las transiciones de Accordion, RadioGroup/CheckboxGroup, Tabs y Toast, el retardo de Tooltip, el modo de expansión exclusiva de Accordion, las pestañas deshabilitadas y la regla todo-o-nada de iconos en Tabs, el icono de indicador de Select, y el iframe de Storybook ajustado al contenido, están implementados, probados y documentados sin romper la funcionalidad ya entregada.

---

## Phase 19: Historia de usuario 12 - Ajustar un valor numérico continuo, como el volumen (Prioridad: P3)

**Objetivo**: Entregar `Slider`, construido sobre `<input type="range">` nativo, para ajustar un valor numérico continuo (p. ej. volumen) con límites configurables.

**Prueba independiente**: Renderizar un Slider de volumen (0-100, paso 5) y verificar arrastre/clic dentro de rango, ajuste por flechas de teclado, normalización de valores fuera de rango, y bloqueo accesible en estado deshabilitado.

**Requisitos relacionados**: FR-047, FR-048, FR-049, FR-050, FR-051

**Escenarios de aceptación relacionados**: US12-AC1 a US12-AC7

**Contrato**: [contracts/slider-component.md](./contracts/slider-component.md) · **Modelo de datos**: DM-018 (`SliderProps`) · **Decisiones**: R-027

### Pruebas de US12

- [X] T189 [US12] [FR-047] Implementar pruebas de `Slider` para nombre accesible efectivo (`label`/`ariaLabel`, VAL-1801), construcción sobre `<input type="range">` nativo (VAL-1802), y `value` por defecto `min` cuando se omite (VAL-1803) en libs/components/slider/Slider.test.ts
- [X] T190 [US12] [FR-047] [FR-050] Añadir pruebas de normalización de `value` fuera de `[min, max]` al límite más cercano (VAL-1804), del redondeo nativo a `step` cuando este no divide exactamente el rango (VAL-1808), y del comportamiento por defecto/desactivado de `showValue` (VAL-1805) en libs/components/slider/Slider.test.ts
- [X] T191 [US12] [FR-049] [FR-051] Añadir pruebas del catálogo de tamaños `ComponentSize` (VAL-1806) y del bloqueo de `onChange` con comunicación accesible en estado `disabled` (VAL-1807) en libs/components/slider/Slider.test.ts

### Implementación de US12

- [X] T192 [US12] Crear carpeta y esqueleto de archivos de `slider` en libs/components/slider/
- [X] T193 [P] [US12] [FR-047] Definir tipos públicos `SliderProps` en libs/components/slider/Slider.type.ts
- [X] T194 [P] [US12] [FR-047] Definir constantes de estado/accesibilidad y catálogo `size` en libs/components/slider/Slider.constants.ts
- [X] T195 [US12] [FR-047] [FR-048] [FR-051] Implementar `Slider` sobre `<input type="range">` nativo con normalización de rango, valor por defecto `min` y ausencia de lógica de dominio en libs/components/slider/Slider.ts
- [X] T196 [US12] [FR-050] Implementar el readout de valor visible (`showValue`) en libs/components/slider/Slider.ts
- [X] T197 [P] [US12] [FR-007] [FR-049] Implementar estilos tokenizados de `Slider` (incluyendo variantes de tamaño) en libs/components/slider/Slider.css
- [X] T198 [US12] Definir exports públicos en libs/components/slider/index.ts
- [X] T199 [US12] [FR-003] Añadir historias nombradas de `Slider` (`Default`, `Small`, `Medium`, `Large`, `SinValorVisible`, `Deshabilitado`, `FueraDeRango`, `SinEtiquetaVisible`) en libs/components/slider/Slider.stories.ts

**Checkpoint US12**: `Slider` es reutilizable y verificable de forma independiente, con normalización de rango, tamaños y valor visible opcional consistentes con el resto del catálogo.

---

## Phase 20: Integración final de Slider (ampliación 2026-08-19)

**Propósito**: Validación final completa de calidad, integración y gates de constitución para el componente `Slider`.

- [X] T200 Ejecutar `npm run lint`, `npm test`, `npm run build` y `npm run build-storybook`, resolviendo cualquier incidencia derivada de `Slider`
- [X] T201 [FR-048] Ejecutar auditoría de ausencia de lógica de dominio en `Slider` y documentar evidencia en specs/003-shared-components-base/contracts/slider-component.md
- [X] T202 Actualizar specs/003-shared-components-base/quickstart.md (sección 9) con evidencia real de ejecución tras validar T200
- [X] T203 Verificar que los gates de constitución siguen satisfechos y reflejar estado final en specs/003-shared-components-base/plan.md

**Checkpoint final Slider**: El componente `Slider` satisface spec, plan, contrato y quality gates, completando el catálogo de 15 componentes nuevos de esta feature (SC-001).

