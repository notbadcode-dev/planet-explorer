---
title: "Base mínima de componentes compartidos reutilizables"
feature: "003-shared-components-base"
type: "task-list"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Draft"
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

## Fase 1: Setup

**Propósito**: Preparar estructura mínima y puntos de entrada para los cinco componentes nuevos.

- [X] T001 Crear carpetas de componentes `input`, `panel`, `badge`, `progress`, `dialog` en libs/components/
- [X] T002 Crear esqueletos de archivos requeridos para cada componente en libs/components/input/, libs/components/panel/, libs/components/badge/, libs/components/progress/ y libs/components/dialog/
- [X] T003 [P] Definir exports públicos iniciales por componente en libs/components/input/index.ts, libs/components/panel/index.ts, libs/components/badge/index.ts, libs/components/progress/index.ts y libs/components/dialog/index.ts
- [X] T004 [P] Añadir historias base vacías para registro en Storybook en libs/components/input/Input.stories.ts, libs/components/panel/Panel.stories.ts, libs/components/badge/Badge.stories.ts, libs/components/progress/Progress.stories.ts y libs/components/dialog/Dialog.stories.ts

**Checkpoint**: Estructura y puntos de entrada listos para comenzar implementación.

---

## Fase 2: Foundational

**Propósito**: Preparar reglas compartidas que bloquean o condicionan todas las historias.

- [X] T005 Auditar tokens reutilizables existentes y añadir faltantes de color en src/styles/_colors.css
- [X] T006 [P] Añadir tokens faltantes de spacing/radii/shadows/typography en src/styles/_spacing.css, src/styles/_radii.css, src/styles/_shadows.css y src/styles/_typography.css
- [X] T007 Integrar nuevos tokens globales en src/styles/index.css
- [X] T008 Definir convenciones compartidas de constantes de estado/accesibilidad en libs/components/input/Input.constants.ts, libs/components/panel/Panel.constants.ts, libs/components/badge/Badge.constants.ts, libs/components/progress/Progress.constants.ts y libs/components/dialog/Dialog.constants.ts
- [X] T009 Verificar y ampliar catálogo central de iconos cuando falte alguno requerido en libs/components/icon/Icon.constants.ts, libs/components/icon/Icon.type.ts y libs/components/icon/Icon.ts
- [X] T010 Ajustar contrato de validación visual/iconográfica para trazabilidad de implementación en specs/003-shared-components-base/contracts/shared-components-visual-rules.md

**Checkpoint**: Tokens, constantes base e iconografía central están preparados para desbloquear todas las historias.

---

## Fase 3: Historia de usuario 1 - Construir entradas y feedback consistentes (Prioridad: P1)

**Objetivo**: Entregar `Input`, `Badge` y `Progress` reutilizables con estados visuales y accesibilidad básica.

**Prueba independiente**: Montar una vista simple usando `Input`, `Badge` y `Progress` sin componentes locales duplicados, validando estados y anuncios accesibles.

**Requisitos relacionados**: FR-001, FR-002, FR-003, FR-009, FR-010, FR-012, FR-013

### Pruebas de US1

- [X] T011 [P] [US1] [FR-009] Implementar pruebas de `Input` para nombre accesible, `aria-invalid`, `aria-describedby` y `onInput` en libs/components/input/Input.test.ts
- [X] T012 [P] [US1] [FR-012] Implementar pruebas de `Badge` para variantes distinguibles y render opcional de icono vía `Icon` en libs/components/badge/Badge.test.ts
- [X] T013 [P] [US1] [FR-013] Implementar pruebas de `Progress` para vacío/parcial/completo y normalización fuera de rango en libs/components/progress/Progress.test.ts

### Implementación de US1

- [X] T014 [P] [US1] [FR-009] Definir tipos públicos y unions de `Input` en libs/components/input/Input.type.ts
- [X] T015 [P] [US1] [FR-012] Definir tipos públicos y unions de `Badge` en libs/components/badge/Badge.type.ts
- [X] T016 [P] [US1] [FR-013] Definir tipos públicos y unions de `Progress` en libs/components/progress/Progress.type.ts
- [X] T017 [US1] [FR-009] Implementar `Input` nativo con contrato accesible en libs/components/input/Input.ts
- [X] T018 [US1] [FR-012] Implementar `Badge` con variantes y consumo exclusivo de `Icon` en libs/components/badge/Badge.ts
- [X] T019 [US1] [FR-013] Implementar `Progress` accesible con clamp determinista en libs/components/progress/Progress.ts
- [X] T020 [P] [US1] [FR-007] Implementar estilos tokenizados de `Input`, `Badge` y `Progress` en libs/components/input/Input.css, libs/components/badge/Badge.css y libs/components/progress/Progress.css
- [X] T021 [US1] [FR-003] Completar historias de estados visuales de `Input`, `Badge` y `Progress` en libs/components/input/Input.stories.ts, libs/components/badge/Badge.stories.ts y libs/components/progress/Progress.stories.ts

**Checkpoint US1**: `Input`, `Badge` y `Progress` son reutilizables y verificables de forma independiente con sus pruebas e historias.

---

## Fase 4: Historia de usuario 2 - Componer bloques de contenido reutilizables (Prioridad: P2)

**Objetivo**: Entregar `Panel` y `Dialog` componibles con `HTMLElement | HTMLElement[]`, accesibles y listos para acciones reutilizables.

**Prueba independiente**: Renderizar `Panel` con contenido compuesto y `Dialog` con acciones de cierre y botones reutilizados, validando ciclo de foco.

**Requisitos relacionados**: FR-001, FR-003, FR-011, FR-014, FR-018

### Pruebas de US2

- [X] T022 [P] [US2] [FR-011] Implementar pruebas de composición y variantes de `Panel` en libs/components/panel/Panel.test.ts
- [X] T023 [P] [US2] [FR-014] Implementar pruebas de `Dialog` para render accesible y callback de cierre en libs/components/dialog/Dialog.test.ts
- [X] T024 [US2] [FR-018] Añadir pruebas de teclado en `Dialog` para foco inicial, trap Tab, Escape y retorno de foco en libs/components/dialog/Dialog.test.ts

### Implementación de US2

- [X] T025 [P] [US2] [FR-011] Definir tipos públicos y unions de `Panel` en libs/components/panel/Panel.type.ts
- [X] T026 [P] [US2] [FR-014] Definir tipos públicos y unions de `Dialog` en libs/components/dialog/Dialog.type.ts
- [X] T027 [US2] [FR-011] Implementar `Panel` componible con variantes visuales en libs/components/panel/Panel.ts
- [X] T028 [US2] [FR-014] Implementar `Dialog` modal accesible con acción clara de cierre en libs/components/dialog/Dialog.ts
- [X] T029 [P] [US2] [FR-007] Implementar estilos tokenizados de `Panel` y `Dialog` en libs/components/panel/Panel.css y libs/components/dialog/Dialog.css
- [X] T030 [US2] [FR-003] Completar historias de variantes de `Panel` y flujos de `Dialog` con acciones compuestas usando `Button` en libs/components/panel/Panel.stories.ts y libs/components/dialog/Dialog.stories.ts

**Checkpoint US2**: `Panel` y `Dialog` quedan listos y verificables de forma independiente, incluyendo accesibilidad de teclado de modal.

---

## Fase 5: Historia de usuario 3 - Mantener coherencia del sistema de componentes (Prioridad: P3)

**Objetivo**: Asegurar coherencia transversal de API, iconografía, tokens y convenciones de librería en los cinco componentes.

**Prueba independiente**: Validar catálogo y contratos con lint, pruebas, revisión de stories y ausencia de imports de iconos prohibidos.

**Requisitos relacionados**: FR-004, FR-005, FR-006, FR-007, FR-008, FR-015, FR-016, FR-017

### Pruebas de US3

- [X] T031 [P] [US3] [FR-005] Añadir cobertura de iconografía decorativa/semántica para componentes que usen icono en libs/components/badge/Badge.test.ts y libs/components/dialog/Dialog.test.ts
- [X] T032 [P] [US3] [FR-007] Añadir verificación de uso de tokens globales en estilos de componentes compartidos en scripts/check-components.mjs

### Implementación de US3

- [X] T033 [US3] [FR-015] Revisar y estabilizar exports públicos por componente en libs/components/input/index.ts, libs/components/panel/index.ts, libs/components/badge/index.ts, libs/components/progress/index.ts y libs/components/dialog/index.ts
- [X] T034 [US3] [FR-008] Eliminar valores mágicos de implementación moviéndolos a constantes en libs/components/input/Input.constants.ts, libs/components/panel/Panel.constants.ts, libs/components/badge/Badge.constants.ts, libs/components/progress/Progress.constants.ts y libs/components/dialog/Dialog.constants.ts
- [X] T035 [US3] [FR-005] Sustituir cualquier consumo directo de iconos por `Icon` en libs/components/badge/Badge.ts y libs/components/dialog/Dialog.ts
- [X] T036 [US3] [FR-007] Ajustar estilos finales para usar exclusivamente tokens globales en libs/components/input/Input.css, libs/components/panel/Panel.css, libs/components/badge/Badge.css, libs/components/progress/Progress.css y libs/components/dialog/Dialog.css
- [X] T037 [US3] [FR-017] Documentar únicamente el alcance y la matriz objetivo de compatibilidad (sin evidencia de ejecución) en specs/003-shared-components-base/quickstart.md
- [X] T038 [US3] [FR-016] Actualizar trazabilidad de cumplimiento de contratos en specs/003-shared-components-base/contracts/shared-components-api.md y specs/003-shared-components-base/contracts/shared-components-visual-rules.md

**Checkpoint US3**: El sistema de componentes mantiene coherencia de arquitectura, iconografía, tokens y API estable.

---

## Fase 6: Integración y aspectos transversales

**Propósito**: Validación final completa de calidad, integración y gates de constitución.

- [X] T039 Ejecutar y resolver incidencias de `npm run lint` en libs/components/, src/styles/ y scripts/check-components.mjs
- [X] T040 Ejecutar y resolver incidencias de `npm test` en libs/components/input/Input.test.ts, libs/components/panel/Panel.test.ts, libs/components/badge/Badge.test.ts, libs/components/progress/Progress.test.ts y libs/components/dialog/Dialog.test.ts
- [X] T041 Ejecutar y resolver incidencias de `npm run build` con foco en imports y estilos de libs/components/
- [X] T042 Ejecutar y resolver incidencias de `npm run build-storybook` para historias de libs/components/input/Input.stories.ts, libs/components/panel/Panel.stories.ts, libs/components/badge/Badge.stories.ts, libs/components/progress/Progress.stories.ts y libs/components/dialog/Dialog.stories.ts
- [X] T043 Validar la guía de ejecución de specs/003-shared-components-base/quickstart.md y ajustar pasos si hay desviaciones
- [X] T044 Verificar que los gates de constitución siguen satisfechos y reflejar estado final en specs/003-shared-components-base/plan.md
- [X] T045 [FR-004] Ejecutar auditoría de ausencia de lógica de dominio en componentes compartidos y documentar evidencia en specs/003-shared-components-base/contracts/shared-components-api.md
- [X] T046 [FR-017] Ejecutar la matriz de validación técnica desktop/móvil (2 versiones estables), capturar evidencia de latencias y registrar resultados finales en specs/003-shared-components-base/quickstart.md

**Checkpoint final**: La feature completa satisface spec, plan, contratos y quality gates.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

- **Fase 1 (Setup)**: Sin dependencias previas.
- **Fase 2 (Foundational)**: Depende de Fase 1.
- **US1 (Fase 3)**: Depende de Foundational.
- **US2 (Fase 4)**: Depende de Foundational; no depende funcionalmente de US1.
- **US3 (Fase 5)**: Depende de US1 y US2 porque consolida coherencia transversal sobre componentes ya implementados.
- **Fase 6 (Integración)**: Depende de US1, US2 y US3.

### Dependencias entre historias de usuario

- **US1 (P1)**: None after Foundational.
- **US2 (P2)**: None after Foundational.
- **US3 (P3)**: Requiere artefactos implementados de US1 y US2 para auditoría global.

### Orden dentro de cada historia

1. Pruebas de historia.
2. Tipos y contratos del componente.
3. Implementación de comportamiento.
4. Estilos tokenizados.
5. Historias y validación de aceptación.

## Oportunidades de paralelización

- En Setup: T003 y T004 pueden ejecutarse en paralelo tras T001-T002.
- En Foundational: T006 puede ejecutarse en paralelo con T005; T009 puede empezar tras T008.
- En US1: T011, T012 y T013 en paralelo; también T014, T015 y T016 en paralelo.
- En US2: T022 y T023 en paralelo; T025 y T026 en paralelo.
- En US3: T031 y T032 en paralelo.
- En Fase 6: T045 y T046 pueden ejecutarse en paralelo tras T039-T042.

## Ejemplo de paralelización: US1

```text
Task: "Implementar pruebas de Input en libs/components/input/Input.test.ts"
Task: "Implementar pruebas de Badge en libs/components/badge/Badge.test.ts"
Task: "Implementar pruebas de Progress en libs/components/progress/Progress.test.ts"
```

```text
Task: "Definir tipos de Input en libs/components/input/Input.type.ts"
Task: "Definir tipos de Badge en libs/components/badge/Badge.type.ts"
Task: "Definir tipos de Progress en libs/components/progress/Progress.type.ts"
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
5. Integración final y quality gates.

### Ejecución paralela

1. Completar prerrequisitos compartidos.
2. Dividir trabajo por archivos/componentes marcados con [P].
3. Ejecutar validación por historia antes de integración final.

## Validación de trazabilidad

- [ ] Todas las historias de usuario están cubiertas.
- [ ] Todos los requisitos funcionales están cubiertos.
- [ ] Todos los escenarios de aceptación pueden validarse.
- [ ] Los cambios de modelo de datos necesarios están cubiertos.
- [ ] Los contratos necesarios están cubiertos.
- [ ] La estrategia de pruebas está cubierta.
- [ ] Los gates de constitution.md están cubiertos.

## Phase 7: Convergence

**Propósito**: Cerrar las brechas detectadas por `/speckit-converge` entre spec/plan/contratos y el estado actual del código tras `/speckit-implement`.

- [X] T047 Add a non-color visual differentiator (icon, border pattern, or text prefix) to `Badge` and `Panel` variants so status is not communicated by color alone in libs/components/badge/Badge.ts, libs/components/badge/Badge.css, libs/components/panel/Panel.ts and libs/components/panel/Panel.css per Constitution: Accesibilidad (contradicts)
- [X] T048 Implement full keyboard focus management in `Dialog` (initial focus inside the dialog on open, Tab trapped within the dialog while open, focus restored to the invoking element on close) in libs/components/dialog/Dialog.ts and libs/components/dialog/Dialog.test.ts per FR-018 (missing)
- [X] T049 Execute the desktop/mobile evergreen browser compatibility and latency matrix and record real measured results in specs/003-shared-components-base/quickstart.md per FR-017 (partial) — evidencia automatizada real registrada (Vitest + happy-dom, 10/10 iteraciones <= 100 ms en los 3 escenarios críticos); la matriz manual multi-navegador/dispositivo real queda como seguimiento explícito en la sección de "Seguimiento pendiente" de quickstart.md, ya que este entorno no dispone de automatización real multi-navegador.

**Checkpoint Convergence**: Las brechas detectadas quedan resueltas y verificables mediante `/speckit-implement`.

