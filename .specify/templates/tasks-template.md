---

title: "[FEATURE NAME]"
feature: "[###-feature-name]"
type: "task-list"
version: "1.0" # 1.0 | 1.1 | 1.2
created: "[DATE]" # 2026-08-15T15:51:00+02:00
updated: "[DATE]" # 2026-08-15T15:51:00+02:00
status: "Draft" # Draft | In Review | Approved | In Progress | Implemented | Deprecated
spec: "./spec.md"
plan: "./plan.md"
tags: [] # frontend, backend, api, ui, ux, data, security, performance, accessibility, testing, infrastructure, documentation, game, education, authentication, users, progression, planets, reporting, invoicing
dependencies: [] # ["###-feature-name", "###-feature-name"]
related_specs: [] # ["###-feature-name", "###-feature-name"]
------------------------------------------------------------

# Tareas: [FEATURE NAME]

**Entrada**: Documentos de diseño de `/specs/[###-feature-name]/`

**Prerrequisitos**: `plan.md` y `spec.md` obligatorios; `research.md`, `data-model.md` y `contracts/` cuando apliquen.

**Organización**: Las tareas se agrupan por historia de usuario para permitir que cada historia pueda implementarse, probarse y validarse de forma independiente.

## Formato de tareas

<!--
  FORMATO:

  [ID] [P?] [Story?] [Requirement?] Descripción con ruta exacta

  Ejemplo:

  - [ ] T012 [P] [US1] [FR-001] Create Player model in src/models/player.ts

  Identificadores:

  - [ID]&#58;     Identificador secuencial único de tarea: T001, T002, T003...

  - [P]&#58;     La tarea puede ejecutarse en paralelo con otras tareas de la misma fase
    porque trabaja sobre ficheros distintos y no tiene dependencias pendientes.

  - [Story]&#58;     Historia de usuario a la que pertenece: US1, US2, US3...
    Es obligatorio para tareas específicas de una historia de usuario.
    No se utiliza para tareas globales de Setup o Foundational.

  - [Requirement]&#58;     Requisito funcional de spec.md al que implementa directamente:
    FR-001, FR-002...
    Debe incluirse cuando exista una relación directa y útil para trazabilidad.

  Reglas:

  - Cada tarea DEBE representar una unidad de trabajo concreta y ejecutable.
  - Cada tarea DEBE incluir rutas exactas de ficheros cuando sea aplicable.
  - Evita tareas vagas como "implement feature", "fix backend" o "add tests".
  - Divide tareas que impliquen comportamientos independientes.
  - No marques [P] si dos tareas modifican el mismo fichero o existe dependencia entre ellas.
  - Indica dependencias explícitamente cuando no sean evidentes por el orden de las tareas.
-->

## Convenciones de rutas

<!--
  Utiliza únicamente la estructura seleccionada en plan.md.

  Los ejemplos siguientes son orientativos y deben sustituirse
  por las rutas reales del proyecto.
-->

* **Single project**: `src/`, `tests/`
* **Web app**: `backend/src/`, `frontend/src/`
* **Mobile + API**: `api/src/`, `ios/` o `android/`

<!--
  ============================================================================
  IMPORTANTE: Todas las tareas incluidas a continuación son EJEMPLOS.

  El comando /speckit-tasks DEBE sustituirlas por tareas reales derivadas de:

  - Historias de usuario y prioridades de spec.md.
  - Escenarios de aceptación Gherkin de spec.md.
  - Requisitos funcionales EARS de spec.md.
  - Decisiones y estructura técnica de plan.md.
  - Estrategia de pruebas de plan.md.
  - Decisiones de research.md.
  - Entidades y relaciones de data-model.md.
  - Contratos definidos en contracts/.
  - Reglas y gates definidos en constitution.md.

  Las tareas DEBEN organizarse principalmente por historia de usuario.

  Cada historia debe poder:
  - Implementarse de forma independiente.
  - Probarse de forma independiente.
  - Validarse contra sus escenarios de aceptación.
  - Entregarse como incremento funcional cuando sea posible.

  NO conserves las tareas de ejemplo en el tasks.md generado.
  ============================================================================
-->

## Estrategia de pruebas

<!--
  Las tareas de prueba NO son opcionales por defecto ni obligatorias por defecto.

  Su inclusión debe derivarse, en este orden, de:

  1. Reglas obligatorias de constitution.md.
  2. Estrategia de pruebas definida en plan.md.
  3. Escenarios de aceptación de spec.md.
  4. Riesgo y criticidad del comportamiento.

  Si una historia requiere pruebas automatizadas:
  - Crea las tareas de prueba correspondientes.
  - Relaciónalas con la historia [USx].
  - Relaciónalas con [FR-xxx] cuando aplique.
  - Derívalas de los escenarios Gherkin sin duplicar literalmente la especificación.

  Si un nivel de prueba no aplica, no generes tareas artificiales para él.
-->

## Fase 1: Setup

**Propósito**: Preparar la estructura y configuración necesarias para implementar la funcionalidad.

<!--
  Incluye únicamente trabajo de preparación necesario para esta funcionalidad.

  No recrees infraestructura que ya exista en el proyecto.
-->

* [ ] T001 Create required project structure according to plan.md
* [ ] T002 Configure required [language/framework] dependencies
* [ ] T003 [P] Configure required linting, formatting or development tooling

**Checkpoint**: El entorno necesario para comenzar la implementación está preparado.

---

## Fase 2: Foundational

**Propósito**: Implementar los prerrequisitos compartidos que bloquean todas o varias historias de usuario.

<!--
  Esta fase debe contener únicamente trabajo realmente compartido.

  No muevas aquí código específico de una historia solo para implementarlo antes.

  Ejemplos:
  - Shared entities
  - Database migrations
  - Authentication infrastructure
  - Common routing
  - Shared state
  - Error handling
  - Cross-story services
-->

**Gate**: Ninguna historia de usuario que dependa de esta infraestructura puede comenzar hasta completar las tareas bloqueantes correspondientes.

* [ ] T004 Setup database schema and required migrations
* [ ] T005 [P] Configure shared authentication/authorization infrastructure
* [ ] T006 [P] Configure shared API routing and middleware
* [ ] T007 Create shared base models/entities
* [ ] T008 Configure shared error handling and logging
* [ ] T009 Configure required environment settings

**Checkpoint**: La infraestructura compartida necesaria está lista y las historias desbloqueadas pueden comenzar.

---

## Fase 3: Historia de usuario 1 - [Title] (Prioridad: P1)

**Objetivo**: [Brief description of the value delivered by this story]

**Prueba independiente**: [How this story can be validated independently]

**Requisitos relacionados**: [FR-001, FR-002]

**Escenarios de aceptación relacionados**: [Scenario references or short identifiers]

### Pruebas de US1 *(incluir cuando sean necesarias)*

<!--
  Las pruebas deben derivarse de los escenarios de aceptación y requisitos
  relacionados con esta historia.

  Cuando el proyecto utilice TDD o constitution.md lo exija,
  estas tareas deben ejecutarse antes de la implementación y fallar inicialmente.
-->

* [ ] T010 [P] [US1] [FR-001] Add contract test for [endpoint] in tests/contract/test_[name].py
* [ ] T011 [P] [US1] [FR-002] Add integration test for [user journey] in tests/integration/test_[name].py

### Implementación de US1

* [ ] T012 [P] [US1] [FR-001] Create [Entity1] model in src/models/[entity1].py
* [ ] T013 [P] [US1] [FR-001] Create [Entity2] model in src/models/[entity2].py
* [ ] T014 [US1] [FR-001] Implement [Service] in src/services/[service].py (depends on T012, T013)
* [ ] T015 [US1] [FR-002] Implement [endpoint/feature] in src/[location]/[file].py
* [ ] T016 [US1] [FR-002] Add required validation and error handling in src/[location]/[file].py
* [ ] T017 [US1] Add required observability for [operation] in src/[location]/[file].py

**Checkpoint US1**:

* Todos los requisitos asociados a US1 están implementados.
* Los escenarios de aceptación asociados pueden validarse.
* Las pruebas requeridas pasan.
* US1 funciona de forma independiente.
* US1 constituye el MVP cuando así se define en `spec.md`.

---

## Fase 4: Historia de usuario 2 - [Title] (Prioridad: P2)

**Objetivo**: [Brief description of the value delivered by this story]

**Prueba independiente**: [How this story can be validated independently]

**Requisitos relacionados**: [FR-003, FR-004]

**Escenarios de aceptación relacionados**: [Scenario references or short identifiers]

### Pruebas de US2 *(incluir cuando sean necesarias)*

* [ ] T018 [P] [US2] [FR-003] Add contract test for [endpoint] in tests/contract/test_[name].py
* [ ] T019 [P] [US2] [FR-004] Add integration test for [user journey] in tests/integration/test_[name].py

### Implementación de US2

* [ ] T020 [P] [US2] [FR-003] Create [Entity] model in src/models/[entity].py
* [ ] T021 [US2] [FR-003] Implement [Service] in src/services/[service].py
* [ ] T022 [US2] [FR-004] Implement [endpoint/feature] in src/[location]/[file].py
* [ ] T023 [US2] Integrate with existing components where required

**Checkpoint US2**:

* Todos los requisitos asociados a US2 están implementados.
* Los escenarios de aceptación asociados pueden validarse.
* Las pruebas requeridas pasan.
* US2 funciona de forma independiente de US1 siempre que el dominio lo permita.

---

## Fase 5: Historia de usuario 3 - [Title] (Prioridad: P3)

**Objetivo**: [Brief description of the value delivered by this story]

**Prueba independiente**: [How this story can be validated independently]

**Requisitos relacionados**: [FR-005]

**Escenarios de aceptación relacionados**: [Scenario references or short identifiers]

### Pruebas de US3 *(incluir cuando sean necesarias)*

* [ ] T024 [P] [US3] [FR-005] Add contract test for [endpoint] in tests/contract/test_[name].py
* [ ] T025 [P] [US3] [FR-005] Add integration test for [user journey] in tests/integration/test_[name].py

### Implementación de US3

* [ ] T026 [P] [US3] [FR-005] Create [Entity] model in src/models/[entity].py
* [ ] T027 [US3] [FR-005] Implement [Service] in src/services/[service].py
* [ ] T028 [US3] [FR-005] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint US3**:

* Todos los requisitos asociados a US3 están implementados.
* Los escenarios de aceptación asociados pueden validarse.
* Las pruebas requeridas pasan.
* US3 funciona de acuerdo con su prueba independiente.

---

[Añade más fases de historias de usuario según sea necesario siguiendo el mismo patrón]

---

## Fase N: Integración y aspectos transversales

**Propósito**: Completar únicamente trabajo que afecte a varias historias o a la funcionalidad en su conjunto.

<!--
  Esta fase NO debe utilizarse como contenedor para tareas que podrían
  haberse asociado claramente a una historia concreta.

  Incluye únicamente aspectos realmente transversales como:
  - Integración entre historias
  - Performance
  - Security
  - Accessibility
  - Observability
  - Documentation
  - Refactoring compartido
  - Validación final
-->

* [ ] TXXX [P] Update required documentation in docs/
* [ ] TXXX Refactor duplicated cross-story code in src/[location]/
* [ ] TXXX Validate performance requirements from plan.md
* [ ] TXXX Validate security requirements from spec.md and plan.md
* [ ] TXXX Validate accessibility requirements where applicable
* [ ] TXXX [P] Add additional cross-story tests in tests/[type]/
* [ ] TXXX Run and validate quickstart.md
* [ ] TXXX Verify all Constitution Check gates remain satisfied

**Checkpoint final**: La funcionalidad completa satisface `spec.md`, `plan.md` y `constitution.md`.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

* **Setup (Fase 1)**: Sin dependencias internas de la funcionalidad.
* **Foundational (Fase 2)**: Depende de las tareas necesarias de Setup.
* **Historias de usuario (Fase 3+)**: Dependen únicamente de las tareas Foundational que realmente necesiten.
* **Integración y aspectos transversales (Fase final)**: Depende de las historias afectadas por cada tarea.

<!--
  No declares una dependencia global si no existe realmente.

  El objetivo es maximizar la independencia de las historias y permitir
  implementación incremental o paralela cuando sea posible.
-->

### Dependencias entre historias de usuario

* **US1 (P1)**: [Dependencies or "None after Foundational"]
* **US2 (P2)**: [Dependencies or "None after Foundational"]
* **US3 (P3)**: [Dependencies or "None after Foundational"]

Si una historia depende funcionalmente de otra, debe indicarse explícitamente y justificarse.

### Orden dentro de cada historia

Como regla general:

1. Pruebas previas, cuando TDD o la estrategia de pruebas lo requieran.
2. Modelos y contratos necesarios.
3. Servicios y lógica de dominio.
4. Interfaces, endpoints o UI.
5. Integración.
6. Validación de escenarios de aceptación.

Este orden puede modificarse cuando la arquitectura definida en `plan.md` requiera otro flujo.

## Oportunidades de paralelización

<!--
  Identifica paralelismo REAL, no teórico.

  Una tarea solo puede marcarse [P] cuando:
  - No depende de otra tarea pendiente.
  - No modifica el mismo fichero que otra tarea paralela.
  - No requiere primero una decisión o contrato compartido.
-->

* Las tareas `[P]` de Setup pueden ejecutarse en paralelo cuando sean independientes.
* Las tareas `[P]` de Foundational pueden ejecutarse en paralelo cuando no compartan dependencias.
* Las historias independientes pueden ejecutarse en paralelo después de sus prerrequisitos.
* Las pruebas independientes de una misma historia pueden ejecutarse en paralelo.
* Las tareas sobre modelos o componentes distintos pueden ejecutarse en paralelo.

## Ejemplo de paralelización: US1

```text
Task: "Add contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Add integration test for [user journey] in tests/integration/test_[name].py"
```

```text
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

## Estrategia de implementación

### MVP primero

1. Completar las tareas necesarias de Setup.
2. Completar los prerrequisitos Foundational necesarios para US1.
3. Implementar US1.
4. Validar US1 contra sus escenarios de aceptación.
5. Ejecutar las pruebas requeridas.
6. Detenerse en este punto si US1 constituye el MVP definido en `spec.md`.

### Entrega incremental

1. Setup + Foundational necesarios.
2. US1 → validar → entregar.
3. US2 → validar → entregar.
4. US3 → validar → entregar.
5. Continuar en orden de prioridad mientras cada incremento mantenga funcionales los anteriores.

### Ejecución paralela

Cuando exista capacidad de equipo y las historias sean independientes:

1. Completar los prerrequisitos compartidos.
2. Asignar historias independientes en paralelo.
3. Validar cada historia de forma independiente.
4. Realizar únicamente la integración transversal necesaria.

## Validación de trazabilidad

<!--
  Antes de considerar tasks.md completo, comprobar:

  - Cada historia de usuario de spec.md tiene tareas suficientes para implementarse.
  - Cada FR de spec.md está cubierto por al menos una tarea de implementación.
  - Cada escenario de aceptación relevante puede validarse mediante las tareas generadas.
  - Los elementos de data-model.md necesarios aparecen en tareas concretas.
  - Los contratos de contracts/ necesarios aparecen en tareas concretas.
  - La estrategia de pruebas definida en plan.md está representada.
  - No existen tareas sin una razón derivable de spec.md, plan.md o constitution.md.
-->

* [ ] Todas las historias de usuario están cubiertas.
* [ ] Todos los requisitos funcionales están cubiertos.
* [ ] Todos los escenarios de aceptación pueden validarse.
* [ ] Los cambios de modelo de datos necesarios están cubiertos.
* [ ] Los contratos necesarios están cubiertos.
* [ ] La estrategia de pruebas está cubierta.
* [ ] Los gates de constitution.md están cubiertos.

## Notas

* `[P]` significa que la tarea puede ejecutarse realmente en paralelo.
* `[USx]` relaciona una tarea con una historia de usuario de `spec.md`.
* `[FR-xxx]` proporciona trazabilidad con los requisitos EARS de `spec.md`.
* Las rutas de ficheros deben ser exactas.
* Una tarea debe ser suficientemente concreta para poder ejecutarse sin reinterpretar su objetivo.
* Evita dependencias entre historias cuando no sean necesarias.
* No generes tareas de infraestructura que ya estén resueltas por el proyecto.
* No generes tareas de pruebas que contradigan la estrategia definida en `plan.md` o `constitution.md`.
* Valida cada historia en su checkpoint antes de considerarla completada.
