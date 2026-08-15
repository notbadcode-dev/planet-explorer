---
title: "Variantes del componente Button"
feature: "002-button-variants"
type: "task-list"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Draft"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, accessibility, testing]
dependencies: ["001-component-library-architecture"]
related_specs: ["001-component-library-architecture"]
---

# Tareas: Variantes del componente Button

**Entrada**: Documentos de diseño de `/specs/002-button-variants/`

**Prerrequisitos**: `plan.md` y `spec.md`; `research.md`, `data-model.md` y `contracts/` (todos disponibles).

**Organización**: Las tareas se agrupan por historia de usuario para permitir que cada historia pueda implementarse, probarse y validarse de forma independiente.

## Formato de tareas

`[ID] [P?] [Story?] [Requirement?] Descripción con ruta exacta`

- **[ID]**: Identificador secuencial único (T001, T002, ...).
- **[P]**: La tarea puede ejecutarse en paralelo (fichero distinto, sin dependencias pendientes).
- **[Story]**: Historia de usuario asociada (US1, US2, US3). No se usa en Foundational ni en la fase final.
- **[Requirement]**: Requisito funcional de `spec.md` implementado directamente (FR-xxx).

## Convenciones de rutas

Extiende el proyecto de paquete único ya existente (`001-component-library-architecture`):

- Componente: `libs/components/button/`
- Documentación de convención: `libs/components/README.md`

## Estrategia de pruebas

Las pruebas unitarias son obligatorias: `plan.md` (Estrategia de pruebas) exige verificar con Vitest + `happy-dom` las clases CSS aplicadas por `variant`/`size` y el comportamiento de fallback (FR-008), sobre el `Button.test.ts` ya existente. La verificación del área táctil mínima de 44×44 px (FR-011) NO es comprobable de forma fiable con `happy-dom` (no calcula layout real, ver `research.md` R-009): se valida manualmente en Storybook (tarea de la fase final) y mediante `quickstart.md`. No se generan pruebas de contrato/integración/E2E adicionales, en línea con `plan.md` de `001`.

---

## Fase 1: Setup

**Propósito**: N/A para esta funcionalidad. Toda la infraestructura necesaria (Vite con soporte nativo de imports CSS, Vitest + `happy-dom`, Storybook `@storybook/html-vite`, ESLint/Prettier) ya existe y fue creada en `001-component-library-architecture`; no se instala ninguna dependencia nueva (ver `plan.md`, Contexto técnico). No se generan tareas artificiales para esta fase.

---

## Fase 2: Foundational

**Propósito**: Ampliar `ButtonProps` con `variant`/`size`, con su guard de valores inválidos, e introducir el mecanismo de aplicación de clases CSS del que dependen ambas historias de usuario (US1 y US2).

**Gate**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [X] T001 [FR-001] [FR-002] [FR-003] [FR-004] [FR-008] Ampliar la interfaz `ButtonProps` en `libs/components/button/Button.ts` añadiendo `variant?: 'primary' | 'secondary' | 'danger'` y `size?: 'small' | 'medium' | 'large'`, junto con las constantes `VALID_VARIANTS`/`VALID_SIZES` y la lógica de resolución con fallback a `'primary'`/`'medium'` cuando el valor recibido no pertenece al catálogo cerrado, según `contracts/button-component.md` (R6, R7, R10) y `data-model.md` (VAL-005, VAL-006)
- [X] T002 [P] Crear `libs/components/button/Button.css` con la clase base `.button` (sin definir todavía reglas de variante/tamaño) e importarlo desde `libs/components/button/Button.ts` (`import './Button.css'`), según `contracts/component-library-convention-css.md` (R6, R7, R8)
- [X] T003 [FR-005] [FR-006] Aplicar en `createButton` (`libs/components/button/Button.ts`) las clases `button`, `` `button--${variant}` `` y `` `button--${size}` `` (tras la resolución/fallback de T001) al elemento devuelto, preservando el comportamiento existente de `disabled` para cualquier combinación (depende de T001, T002)

**Checkpoint**: `ButtonProps` acepta `variant`/`size` opcionales con fallback seguro, `Button.css` se carga correctamente vía Vite, y el elemento devuelto refleja las clases correspondientes en su `classList`.

---

## Fase 3: Historia de usuario 1 - Selección de variante visual (Prioridad: P1)

**Objetivo**: Que cualquier punto del juego pueda crear un `Button` con `variant: 'primary' | 'secondary' | 'danger'` y obtener un estilo visualmente distintivo y coherente, sin depender solo del color para `danger`.

**Prueba independiente**: Ejecutar `npm run test -- Button` y comprobar que cada `variant` aplica su clase; abrir Storybook y comprobar visualmente que las 3 variantes son distinguibles entre sí y que `danger` no depende solo del color.

**Requisitos relacionados**: FR-001, FR-002, FR-008, FR-009

**Escenarios de aceptación relacionados**: US1-Escenario 1 (variant aplicado visualmente), US1-Escenario 2 (variant por defecto = primary), US1-Escenario 3 (danger distinguible sin depender solo del color)

### Pruebas de US1

- [X] T004 [US1] [FR-001] [FR-002] Añadir en `libs/components/button/Button.test.ts` pruebas que verifiquen que `createButton({ variant: 'primary' | 'secondary' | 'danger', ... })` añade la clase `` `button--${variant}` `` correspondiente en el `classList` del elemento devuelto (depende de T003)
- [X] T005 [US1] [FR-008] Añadir en `libs/components/button/Button.test.ts` una prueba que, forzando un valor de `variant` fuera del catálogo (cast de tipos), verifique que `createButton` aplica `button--primary` en lugar de lanzar un error (depende de T004, mismo fichero)
- [X] T006 [US1] [FR-007] Añadir en `libs/components/button/Button.test.ts` una prueba que verifique que `createButton` sigue exigiendo `label` o `ariaLabel` (lanzando el error existente si faltan ambos) al combinarse con cualquier `variant`/`size`, confirmando que las reglas de contrato de `001` se preservan sin cambios (depende de T005, mismo fichero)

### Implementación de US1

- [X] T007 [US1] [FR-009] Definir en `libs/components/button/Button.css` las reglas `.button--primary`, `.button--secondary` y `.button--danger`, garantizando que `danger` incluye al menos un rasgo visual distintivo adicional al color (p. ej. borde), según `contracts/button-component.md` (R11) (depende de T002)
- [X] T008 [US1] Añadir en `libs/components/button/Button.stories.ts` el `argType` `variant` (`control: 'select'`, `options: ['primary', 'secondary', 'danger']`) en `meta.argTypes` (depende de T003)
- [X] T009 [US1] [FR-001] Añadir en `libs/components/button/Button.stories.ts` las historias `Secondary` y `Danger` (análogas a `Enabled`, fijando `variant: 'secondary'` y `variant: 'danger'` respectivamente) (depende de T008, mismo fichero)

**Checkpoint US1**:

- `npm run test -- Button` pasa, incluidas las pruebas de `variant` y su fallback.
- Storybook muestra las 3 variantes con controles funcionales.
- US1 funciona de forma independiente (sin que `size` tenga todavía reglas CSS propias más allá de la clase base).

---

## Fase 4: Historia de usuario 2 - Selección de tamaño (Prioridad: P2)

**Objetivo**: Que cualquier punto del juego pueda crear un `Button` con `size: 'small' | 'medium' | 'large'`, manteniendo en todos los casos un área táctil cómoda, especialmente en `small` (mínimo 44×44 px CSS).

**Prueba independiente**: Ejecutar `npm run test -- Button` y comprobar que cada `size` aplica su clase; abrir Storybook e inspeccionar con las herramientas de desarrollador que un botón `small` mide al menos 44×44 px CSS.

**Requisitos relacionados**: FR-003, FR-004, FR-008, FR-011

**Escenarios de aceptación relacionados**: US2-Escenario 1 (size aplicado visualmente), US2-Escenario 2 (size por defecto = medium, 44×44 px CSS), US2-Escenario 3 (small combinado con cualquier variant mantiene el área táctil)

### Pruebas de US2

- [X] T010 [US2] [FR-003] [FR-004] Añadir en `libs/components/button/Button.test.ts` pruebas que verifiquen que `createButton({ size: 'small' | 'medium' | 'large', ... })` añade la clase `` `button--${size}` `` correspondiente en el `classList` del elemento devuelto (depende de T003)
- [X] T011 [US2] [FR-008] Añadir en `libs/components/button/Button.test.ts` una prueba que, forzando un valor de `size` fuera del catálogo (cast de tipos), verifique que `createButton` aplica `button--medium` en lugar de lanzar un error (depende de T010, mismo fichero)

### Implementación de US2

- [X] T012 [US2] [FR-011] Definir en `libs/components/button/Button.css` las reglas `.button--small` (incluyendo `min-width: 44px` y `min-height: 44px`), `.button--medium` y `.button--large`, según `contracts/button-component.md` (R12) y `research.md` (R-009) (depende de T002)
- [X] T013 [US2] Añadir en `libs/components/button/Button.stories.ts` el `argType` `size` (`control: 'select'`, `options: ['small', 'medium', 'large']`) en `meta.argTypes` (depende de T003)
- [X] T014 [US2] [FR-003] Añadir en `libs/components/button/Button.stories.ts` las historias `Small` y `Large` (análogas a `Enabled`, fijando `size: 'small'` y `size: 'large'` respectivamente) (depende de T013, mismo fichero)

**Checkpoint US2**:

- `npm run test -- Button` pasa, incluidas las pruebas de `size` y su fallback.
- Storybook muestra los 3 tamaños con controles funcionales.
- US2 funciona de forma independiente de US1 (cada historia puede validarse por separado aunque comparten la infraestructura de Foundational).

---

## Fase 5: Historia de usuario 3 - Compatibilidad retroactiva (Prioridad: P3)

**Objetivo**: Que todo el código existente que ya usa `createButton` sin `variant`/`size` siga funcionando exactamente igual, obteniendo de forma implícita `primary`/`medium`.

**Prueba independiente**: Ejecutar la suite completa de tests y las historias de Storybook previas a esta funcionalidad sin modificarlas, y comprobar que un `Button` creado sin `variant`/`size` recibe las clases `button--primary button--medium`.

**Requisitos relacionados**: FR-002, FR-004, FR-006

**Escenarios de aceptación relacionados**: US3-Escenario 1 (comportamiento idéntico a v1.0 sin `variant`/`size`), US3-Escenario 2 (`disabled` sigue funcionando igual con cualquier combinación)

### Pruebas de US3

- [X] T015 [US3] [FR-002] [FR-004] Añadir en `libs/components/button/Button.test.ts` una prueba que verifique que `createButton({ label, onClick })` (sin `variant`/`size`) aplica exactamente `button--primary` y `button--medium` en el `classList` (depende de T003)
- [X] T016 [US3] [FR-006] Añadir en `libs/components/button/Button.test.ts` una prueba que verifique que `disabled: true` sigue bloqueando `onClick` para al menos una combinación de `variant`/`size` no por defecto (p. ej. `variant: 'danger', size: 'small'`) (depende de T015, mismo fichero)

### Implementación de US3

- [X] T017 [US3] [FR-002] [FR-004] Confirmar que las historias de Storybook previas a esta funcionalidad (`Enabled`, `Disabled`, `SoloEtiquetaAccesible` en `libs/components/button/Button.stories.ts`) siguen existiendo sin modificarse y se renderizan con las clases por defecto `button--primary button--medium` (depende de T009, T014, mismo fichero; verificación, no implementación nueva)

**Checkpoint US3**:

- Todos los tests previos a esta funcionalidad (`001`) y los nuevos pasan sin cambios de comportamiento no deseados.
- Las historias `Enabled`, `Disabled` y `SoloEtiquetaAccesible` siguen intactas y funcionando.
- US3 queda validada como una propiedad transversal (no requiere código de producción nuevo, solo pruebas que la confirmen).

---

## Fase Final: Integración y aspectos transversales

**Propósito**: Validar la funcionalidad completa contra `spec.md`, `plan.md` y `constitution.md`, y dejar documentada la nueva convención de CSS opcional.

- [X] T018 [P] Actualizar `libs/components/README.md` para documentar que un componente MAY incluir opcionalmente un fichero `<ComponentName>.css` co-localizado (con clases prefijadas), enlazando a `contracts/component-library-convention-css.md`
- [X] T019 [FR-011] Revisar manualmente en Storybook (`npm run storybook`) que (a) un botón `size: 'small'` mide al menos 44×44 px CSS con las herramientas de desarrollador del navegador para las 3 variantes (FR-011, no verificable con `happy-dom`, ver `research.md` R-009), y (b) las 3 variantes son distinguibles entre sí por una persona con daltonismo sin depender únicamente del color (SC-003) (depende de T007, T012)
- [X] T020 [P] Añadir en `libs/components/button/Button.stories.ts` una historia que combine `disabled: true` con una variante/tamaño no por defecto (p. ej. `variant: 'danger', size: 'small', disabled: true`) para verificar visualmente que el tratamiento de deshabilitado es consistente en cualquier combinación (FR-006) (depende de T009, T014)
- [X] T021 Ejecutar y validar los 4 escenarios de `quickstart.md` (tests, Storybook, compatibilidad retro, build de producción), incluyendo la comprobación de SC-003 y SC-004
- [X] T022 [FR-010] Verificar que se mantienen todos los gates de la Comprobación de la constitución de `plan.md` (sin frameworks de UI, CSS con clases prefijadas sin fugas globales, compatibilidad con GitHub Pages, accesibilidad no dependiente solo del color), y confirmar que `contracts/button-component.md` documenta el catálogo cerrado completo de `variant`/`size` (FR-010)

**Checkpoint final**: La funcionalidad completa satisface `spec.md`, `plan.md` y `constitution.md`.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

- **Setup (Fase 1)**: N/A, sin tareas.
- **Foundational (Fase 2)**: Sin dependencias internas de esta funcionalidad (parte del código ya existente de `001`).
- **US1 (Fase 3)** y **US2 (Fase 4)**: Dependen únicamente de T001–T003 de Foundational; son independientes entre sí.
- **US3 (Fase 5)**: Depende de T003 (Foundational) para sus pruebas; T017 depende además de que existan las historias de US1 (T009) y US2 (T014) para poder confirmarlas sin modificarlas.
- **Integración y aspectos transversales (Fase Final)**: Depende de US1, US2 y US3.

### Dependencias entre historias de usuario

- **US1 (P1)**: Ninguna tras Foundational.
- **US2 (P2)**: Ninguna tras Foundational; independiente de US1.
- **US3 (P3)**: Depende de que existan las historias de Storybook de US1 y US2 para su tarea de verificación (T017), pero no depende de su lógica de negocio.

### Orden dentro de cada historia

1. US1: tests de clases de variant → test de fallback → reglas CSS de variant → argType de Storybook → historias `Secondary`/`Danger`.
2. US2: tests de clases de size → test de fallback → reglas CSS de size (incluido el área táctil) → argType de Storybook → historias `Small`/`Large`.
3. US3: test de clases por defecto → test de `disabled` combinado → verificación de historias previas intactas.

## Oportunidades de paralelización

- T002 (Foundational, `Button.css` base) puede ejecutarse en paralelo con la parte de T001 que no dependa de él (en la práctica, ambas tareas son pequeñas y secuenciales por tocar `Button.ts`/`Button.css` de forma coordinada; se marca `[P]` porque son ficheros distintos).
- Tras completar Foundational, **US1 y US2 pueden implementarse en paralelo** por ser independientes entre sí.
- T018 (documentación) y T020 (historia de Storybook) en la Fase Final pueden ejecutarse en paralelo con otras tareas finales al tocar ficheros distintos.

## Ejemplo de paralelización: tras Foundational

```text
Task: "Añadir pruebas de clases de variant en Button.test.ts (T004, T005)"
Task: "Añadir pruebas de clases de size en Button.test.ts (T010, T011)"
```

> Nota: aunque ambas tareas tocan el mismo fichero (`Button.test.ts`), pertenecen a historias independientes y pueden asignarse en paralelo a distintas personas si se coordina el orden de merge; no se marcan `[P]` porque comparten fichero.

## Estrategia de implementación

### MVP primero

1. Completar T001–T003 de Foundational.
2. Implementar US1 (variant) completa.
3. Validar US1 contra sus escenarios de aceptación y ejecutar `npm run test -- Button`.
4. Detenerse aquí si US1 (selección de variante) se considera el MVP de esta funcionalidad.

### Entrega incremental

1. Foundational.
2. US1 → validar → entregar.
3. US2 → validar → entregar.
4. US3 → validar (no añade funcionalidad nueva, solo garantías de no-regresión) → entregar.
5. Fase Final → validar toda la funcionalidad contra `spec.md`, `plan.md` y `constitution.md`.

### Ejecución paralela

Tras Foundational, US1 y US2 pueden implementarse en paralelo por dos personas distintas trabajando sobre secciones separadas de `Button.css`, `Button.test.ts` y `Button.stories.ts`, coordinando el orden de merge para evitar conflictos en los ficheros compartidos.

---

## Phase 6: Convergence

- [X] T023 Añadir en `libs/components/button/Button.css` una regla `.button:disabled` (opacidad reducida y `cursor: not-allowed`) que garantice un tratamiento visual de deshabilitado consistente para cualquier combinación de `variant`/`size`, y confirmar visualmente en Storybook que se aplica sobre las 3 variantes y los 3 tamaños per FR-006 (partial)
- [X] T024 Reexportar los tipos `ButtonVariant` y `ButtonSize` desde `libs/components/button/index.ts` para que un consumidor pueda referenciarlos sin importar directamente `Button.ts` per contracts/button-component.md (partial)
