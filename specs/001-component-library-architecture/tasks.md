---
title: "Librería de componentes UI: arquitectura y componente Button"
feature: "001-component-library-architecture"
type: "task-list"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Draft"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, testing, documentation, architecture]
dependencies: []
related_specs: []
---

# Tareas: Librería de componentes UI: arquitectura y componente Button

**Entrada**: Documentos de diseño de `/specs/001-component-library-architecture/`

**Prerrequisitos**: `plan.md` y `spec.md`; `research.md`, `data-model.md` y `contracts/` (todos disponibles).

**Organización**: Las tareas se agrupan por historia de usuario para permitir que cada historia pueda implementarse, probarse y validarse de forma independiente.

## Formato de tareas

`[ID] [P?] [Story?] [Requirement?] Descripción con ruta exacta`

- **[ID]**: Identificador secuencial único (T001, T002, ...).
- **[P]**: La tarea puede ejecutarse en paralelo (fichero distinto, sin dependencias pendientes).
- **[Story]**: Historia de usuario asociada (US1, US2, US3). No se usa en Setup, Foundational ni Polish.
- **[Requirement]**: Requisito funcional de `spec.md` implementado directamente (FR-xxx).

## Convenciones de rutas

Proyecto de paquete único en la raíz del repositorio (ver "Estructura del proyecto" en `plan.md`):

- Librería de componentes: `libs/components/`
- Configuración de Storybook: `.storybook/`
- Scripts de utilidad: `scripts/`

## Estrategia de pruebas

Las pruebas unitarias son obligatorias para esta funcionalidad: FR-003 exige explícitamente que cada componente incluya su propia suite de pruebas con Vitest, y la Historia de usuario 2 completa está dedicada a ello. Las tareas de test se generan en la Fase 4 (US2), derivadas de los escenarios de aceptación de US2 y de FR-006, FR-007 y FR-011. No se generan pruebas de contrato/integración/E2E adicionales: `plan.md` establece que Contract se valida mediante revisión (no test automatizado) y que Integration/E2E no aplican en esta iteración.

---

## Fase 1: Setup

**Propósito**: Inicializar el proyecto (actualmente sin `package.json` ni configuración) con el stack base requerido por la constitución.

- [X] T001 Crear `package.json` en la raíz del repositorio con metadatos del proyecto y scripts iniciales vacíos (`test`, `lint`, `build`)
- [X] T002 Crear `tsconfig.json` en la raíz con modo `strict` habilitado, según constitución
- [X] T003 [P] Crear `vite.config.ts` en la raíz configurando Vite como build/dev server del proyecto
- [X] T004 [P] Crear `eslint.config.js` en la raíz con reglas para TypeScript strict
- [X] T005 [P] Crear `.prettierrc` en la raíz con las reglas de formato del proyecto
- [X] T006 Instalar dependencias de desarrollo (`typescript`, `vite`, `vitest`, `happy-dom`, `eslint`, `prettier`, `storybook`, `@storybook/html-vite`) vía `npm install` (depende de T001)

**Checkpoint**: El proyecto tiene un `package.json` instalable, TypeScript en modo estricto, Vite, Vitest, ESLint, Prettier y Storybook disponibles como dependencias de desarrollo.

---

## Fase 2: Foundational

**Propósito**: Preparar la infraestructura compartida que bloquea a las tres historias de usuario: la carpeta base de la librería y el entorno de pruebas DOM.

**Gate**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [X] T007 Crear la carpeta raíz `libs/components/` en el repositorio (ubicación única para componentes reutilizables, FR-001); al no rastrear git carpetas vacías, esta carpeta queda confirmada en control de versiones en cuanto T008 añada contenido
- [X] T008 Crear la carpeta `libs/components/button/` como contenedor del primer componente (depende de T007)
- [X] T009 Configurar el entorno de pruebas Vitest con `happy-dom` (bloque `test` en `vite.config.ts`, según la estructura definida en `plan.md`) para que cualquier componente de `libs/components/` pueda probarse sobre un DOM simulado (depende de T006)
- [X] T010 [P] Añadir los scripts `test` y `lint` reales en `package.json` (`vitest run`, `eslint .`) (depende de T006)

**Checkpoint**: Existe `libs/components/button/` y Vitest puede ejecutar pruebas con DOM simulado sobre cualquier componente futuro.

---

## Fase 3: Historia de usuario 1 - Carpeta de componentes reutilizables (Prioridad: P1)

**Objetivo**: Disponer de una carpeta `libs/components` con una convención clara y de un primer componente (`Button`) importable desde el resto del proyecto sin duplicar código.

**Prueba independiente**: Comprobar que existe `libs/components/`, que la convención de organización está documentada, y que `Button` puede importarse desde otra ubicación del proyecto sin configuración adicional.

**Requisitos relacionados**: FR-001, FR-002, FR-005, FR-008, FR-009, FR-010

**Escenarios de aceptación relacionados**: US1-Escenario 1 (convención localizable), US1-Escenario 2 (componente importable sin configuración adicional)

### Implementación de US1

- [X] T011 [US1] [FR-001] Crear `libs/components/README.md` documentando la convención estructural por componente (carpeta con implementación, test, story e `index.ts`), enlazando a `contracts/component-library-convention.md` (depende de T007)
- [X] T012 [US1] [FR-005] [FR-002] [FR-006] [FR-007] [FR-011] Implementar la función factory `createButton(props: ButtonProps): HTMLButtonElement` en `libs/components/button/Button.ts`, según `contracts/button-component.md` y `data-model.md` (DM-001 `ButtonProps`): sin lógica de negocio, soporte de `disabled` y validación de que exista `label` o `ariaLabel` (depende de T008)
- [X] T013 [US1] [FR-008] Crear `libs/components/button/index.ts` reexportando `createButton` y el tipo `ButtonProps` como punto de entrada público del componente (depende de T012)
- [X] T014 [P] [US1] [FR-010] [FR-009] Crear `scripts/check-components.mjs`: script que recorre las carpetas de `libs/components/` y falla (código de salida distinto de cero) si detecta (a) nombres duplicados (comparación insensible a mayúsculas/minúsculas) o (b) una carpeta sin `*.test.ts` o sin `*.stories.ts` (componente incompleto) (depende de T008)
- [X] T015 [US1] [FR-010] Añadir el script `check:components` en `package.json` (ejecuta `scripts/check-components.mjs`) e integrarlo como paso previo dentro del script `lint` (depende de T010, T014)
- [X] T015b [US1] Añadir el script `build` funcional (`vite build`) en `package.json`, necesario para que el futuro pipeline de CI (T026) pueda ejecutarse (depende de T003)

**Checkpoint US1**:

- `libs/components/button/` contiene `Button.ts` e `index.ts`.
- `Button` puede importarse como `import { createButton } from 'libs/components/button'` sin duplicar código (FR-008).
- Un segundo componente con nombre duplicado es detectado por `npm run lint` (FR-010).
- US1 funciona de forma independiente (sin que existan todavía `Button.test.ts` ni `Button.stories.ts`).

---

## Fase 4: Historia de usuario 2 - Componentes cubiertos por pruebas unitarias (Prioridad: P2)

**Objetivo**: Que `Button` tenga su propia suite de pruebas unitarias con Vitest que detecte regresiones de comportamiento (renderizado, estado deshabilitado, etiqueta accesible).

**Prueba independiente**: Ejecutar `npm run test -- libs/components` y comprobar que las pruebas de `Button` validan renderizado, bloqueo de `onClick` en estado deshabilitado y presencia de etiqueta accesible.

**Requisitos relacionados**: FR-003, FR-006, FR-007, FR-011

**Escenarios de aceptación relacionados**: US2-Escenario 1 (pruebas verifican comportamiento esperado), US2-Escenario 2 (pruebas fallan ante una regresión)

### Pruebas de US2

- [X] T016 [US2] [FR-003] [FR-006] Crear `libs/components/button/Button.test.ts` con pruebas de renderizado: el elemento devuelto es un `<button>`, muestra el `label` proporcionado y refleja el atributo `disabled` (depende de T012)
- [X] T017 [US2] [FR-007] Añadir en `libs/components/button/Button.test.ts` un test que verifique que, con `disabled: true`, activar el botón (clic) NO invoca `onClick` (depende de T016, mismo fichero)
- [X] T018 [US2] [FR-011] Añadir en `libs/components/button/Button.test.ts` dos tests: (1) sin `label`, el botón expone un nombre accesible a partir de `ariaLabel`; (2) sin `label` ni `ariaLabel`, `createButton` lanza un error de desarrollo (contrato R1 de `contracts/button-component.md`) (depende de T017, mismo fichero)

**Checkpoint US2**:

- `npm run test -- libs/components` ejecuta y pasa todos los tests de `Button`.
- Un cambio que rompa el estado deshabilitado o la etiqueta accesible haría fallar la suite (SC-004).
- US2 funciona de forma independiente de US3.

---

## Fase 5: Historia de usuario 3 - Presentación visual con Storybook (Prioridad: P3)

**Objetivo**: Poder visualizar `Button` y sus estados principales en Storybook sin integrarlo en el juego.

**Prueba independiente**: Ejecutar `npm run storybook` y comprobar que existe una historia navegable de `Button` que muestra sus estados principales.

**Requisitos relacionados**: FR-004

**Escenarios de aceptación relacionados**: US3-Escenario 1 (historia navegable con estados principales), US3-Escenario 2 (los controles reflejan cambios en la vista previa)

### Implementación de US3

- [X] T019 [P] [US3] Crear `.storybook/main.ts` configurando el framework `@storybook/html-vite` y la ruta de historias (`libs/components/**/*.stories.ts`) (depende de T006)
- [X] T020 [P] [US3] Crear `.storybook/preview.ts` con los parámetros globales de Storybook (depende de T006)
- [X] T021 [US3] Añadir los scripts `storybook` y `build-storybook` en `package.json` (depende de T019, T020)
- [X] T022 [US3] [FR-004] Crear `libs/components/button/Button.stories.ts` con una historia por defecto y controles (`label`, `ariaLabel`, `disabled`) que invoque `createButton` y muestre los estados habilitado y deshabilitado (depende de T013, T021)

**Checkpoint US3**:

- `npm run storybook` abre Storybook y muestra la historia de `Button`.
- Cambiar los controles (`label`, `disabled`) actualiza la vista previa (US3-Escenario 2).
- US3 funciona de forma independiente de US2.

---

## Fase Final: Integración y aspectos transversales

**Propósito**: Validar la funcionalidad completa contra `spec.md`, `plan.md` y `constitution.md`.

- [X] T023 [P] Revisar accesibilidad de `libs/components/button/Button.ts`: elemento `<button>` nativo, operable por teclado, estado deshabilitado comunicado de forma accesible (contrato R5 de `contracts/button-component.md`)
- [X] T024 Ejecutar y validar los 4 escenarios de `quickstart.md` (QS-001 a QS-004): estructura importable, tests en verde, historia de Storybook visible, bloqueo de nombre duplicado
- [X] T025 Verificar que se mantienen todos los gates de la Comprobación de la constitución de `plan.md` (sin frameworks de UI, sin lógica de negocio en `libs/components/`, compatibilidad con GitHub Pages)
- [X] T026 Crear `.github/workflows/ci.yml` ejecutando `install → lint → test → build` en cada push/PR, garantizando que el bloqueo de nombres duplicados/componentes incompletos (FR-010, FR-009) y la ejecución de tests (FR-003) sean automáticos antes de fusionar cualquier cambio (depende de T010, T015, T015b)

**Checkpoint final**: La funcionalidad completa satisface `spec.md`, `plan.md` y `constitution.md`.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

- **Setup (Fase 1)**: Sin dependencias internas.
- **Foundational (Fase 2)**: Depende de T001 y T006 de Setup.
- **US1 (Fase 3)**: Depende de T007, T008 y T010 de Foundational.
- **US2 (Fase 4)**: Depende de T012 (Button.ts) de US1.
- **US3 (Fase 5)**: Depende de T006 (Foundational) y de T013 (index.ts) de US1.
- **Integración y aspectos transversales (Fase Final)**: Depende de US1, US2 y US3 (T026 depende además de T010 y T015/T015b).

### Dependencias entre historias de usuario

- **US1 (P1)**: Ninguna tras Foundational.
- **US2 (P2)**: Depende de la implementación de `Button.ts` creada en US1 (T012); no depende de US3.
- **US3 (P3)**: Depende de `index.ts` creado en US1 (T013) y de la configuración de Storybook (Foundational/Setup); no depende de US2.

US2 y US3 son mutuamente independientes entre sí: ambas parten de US1 pero no dependen la una de la otra, por lo que pueden implementarse en paralelo una vez completada US1.

### Orden dentro de cada historia

1. US1: documentación de convención → implementación de `Button.ts` → `index.ts` → script de detección de duplicados.
2. US2: tests de renderizado → tests de estado deshabilitado → tests de etiqueta accesible (todos sobre el mismo fichero, en orden).
3. US3: configuración de Storybook → scripts npm → historia de `Button`.

## Oportunidades de paralelización

- T003, T004 y T005 (Setup) pueden ejecutarse en paralelo: ficheros distintos, sin dependencias entre sí.
- T014 (US1, script de comprobación de componentes) puede ejecutarse en paralelo con T012/T013 (US1): ficheros distintos.
- T019 y T020 (US3, configuración de Storybook) pueden ejecutarse en paralelo: ficheros distintos.
- Tras completar US1, **US2 y US3 pueden implementarse en paralelo** por ser independientes entre sí.
- T023 (Fase Final) puede ejecutarse en paralelo con la preparación de T024/T025.

## Ejemplo de paralelización: Setup

```text
Task: "Crear vite.config.ts en la raíz configurando Vite como build/dev server del proyecto"
Task: "Crear eslint.config.js en la raíz con reglas para TypeScript strict"
Task: "Crear .prettierrc en la raíz con las reglas de formato del proyecto"
```

## Ejemplo de paralelización: US2 y US3 tras completar US1

```text
Task: "Crear libs/components/button/Button.test.ts con pruebas de renderizado (US2)"
Task: "Crear .storybook/main.ts configurando @storybook/html-vite (US3)"
```

## Estrategia de implementación

### MVP primero

1. Completar Setup (T001-T006).
2. Completar Foundational (T007-T010).
3. Implementar US1 (T011-T015b).
4. Validar US1 contra sus escenarios de aceptación (estructura documentada, `Button` importable, nombres duplicados bloqueados).
5. Detenerse aquí si US1 constituye el MVP: la arquitectura de la librería y el primer componente ya son utilizables por el resto del proyecto, aunque todavía sin tests ni Storybook (FR-009 los marcaría como "incompletos" hasta completar US2/US3).

### Entrega incremental

1. Setup + Foundational.
2. US1 → validar → entregar (arquitectura + `Button` básico).
3. US2 → validar → entregar (`Button` con pruebas unitarias).
4. US3 → validar → entregar (`Button` con historia de Storybook; componente completo según FR-009).
5. Fase Final de validación cruzada.

### Ejecución paralela

Con capacidad de equipo, tras completar US1, un desarrollador puede implementar US2 (T016-T018) mientras otro implementa US3 (T019-T022), ya que ambas historias son independientes entre sí y solo comparten como prerrequisito el `Button.ts`/`index.ts` de US1.

---

## Fase 6: Convergencia

- [X] T027 Documentar `index.html` en la sección "Estructura del proyecto" de `plan.md` (o justificar explícitamente su omisión), ya que se creó como entry point mínimo necesario para que `vite build` (T015b) funcione y no aparecía en el diagrama original per plan: Estructura del proyecto (unrequested)

