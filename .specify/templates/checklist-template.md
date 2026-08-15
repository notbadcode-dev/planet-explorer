---

title: "[CHECKLIST TYPE] Checklist: [FEATURE NAME]"
feature: "[###-feature-name]"
type: "checklist"
checklist_type: "[CHECKLIST TYPE]" # requirements | ux | security | accessibility | testing | release | performance | custom
version: "1.0" # 1.0 | 1.1 | 1.2
created: "[DATE]" # 2026-08-15T15:53:00+02:00
updated: "[DATE]" # 2026-08-15T15:53:00+02:00
status: "Draft" # Draft | In Review | Approved | Completed | Deprecated
spec: "./spec.md"
plan: "./plan.md"
tasks: "./tasks.md"
tags: [] # frontend, backend, api, ui, ux, data, security, performance, accessibility, testing, infrastructure, documentation, game, education, authentication, users, progression, planets, reporting, invoicing
dependencies: [] # ["###-feature-name", "###-feature-name"]
related_specs: [] # ["###-feature-name", "###-feature-name"]
------------------------------------------------------------

# [CHECKLIST TYPE] Checklist: [FEATURE NAME]

**Propósito**: [Brief description of what this checklist validates]

**Funcionalidad**: `[###-feature-name]`

**Documentación de referencia**: `/specs/[###-feature-name]/`

**Nota**: Esta checklist se genera mediante el comando `/speckit-checklist` a partir del contexto, requisitos y documentación disponible de la funcionalidad.

## Alcance

<!--
  Define exactamente QUÉ pretende validar esta checklist y qué queda fuera.

  La checklist debe centrarse en una preocupación concreta, por ejemplo:

  - Requirements
  - UX
  - Accessibility
  - Security
  - Testing
  - Performance
  - Release readiness
  - Data integrity
  - API consistency

  Evita crear una checklist genérica que mezcle preocupaciones sin relación.

  El alcance debe derivarse de la petición del usuario y del contexto
  de la funcionalidad.
-->

**Incluye**: [What this checklist covers]

**No incluye**: [What is explicitly out of scope]

## Fuentes

<!--
  La generación de la checklist DEBE utilizar únicamente las fuentes
  relevantes disponibles para el tipo de checklist solicitado.

  Posibles fuentes:

  - spec.md:
    Historias de usuario, escenarios Gherkin, requisitos EARS,
    casos límite y criterios de éxito.

  - plan.md:
    Decisiones técnicas, restricciones, estrategia de pruebas,
    riesgos, contratos y estructura.

  - research.md:
    Decisiones derivadas de investigación y alternativas descartadas.

  - data-model.md:
    Entidades, relaciones, estados, invariantes y reglas de datos.

  - contracts/:
    APIs, eventos, comandos, interfaces y contratos externos.

  - tasks.md:
    Cobertura de implementación, trazabilidad y trabajo planificado.

  - constitution.md:
    Principios, reglas obligatorias y gates globales.

  No todas las fuentes son necesarias para todos los tipos de checklist.
-->

* `spec.md`
* `plan.md`
* `tasks.md`
* [Additional relevant source]

<!--
  ============================================================================
  IMPORTANTE: Los elementos que aparecen a continuación son SOLO EJEMPLOS.

  El comando /speckit-checklist DEBE sustituirlos completamente por elementos
  reales derivados de:

  - La petición específica del usuario.
  - El tipo de checklist solicitado.
  - Los requisitos y escenarios de spec.md.
  - El contexto técnico de plan.md.
  - Las tareas de tasks.md.
  - Los artefactos complementarios relevantes.
  - Las reglas de constitution.md.

  NO conserves los elementos de ejemplo en la checklist generada.
  ============================================================================
-->

## Formato de los elementos

<!--
  FORMATO:

  - [ ] CHK001 [Reference?] Criterio verificable

  Ejemplos:

  - [ ] CHK001 [FR-001] El requisito define explícitamente el comportamiento esperado ante credenciales inválidas.
  - [ ] CHK002 [US1] Todos los escenarios de aceptación de US1 tienen un resultado observable.
  - [ ] CHK003 [T014] La tarea especifica el fichero exacto que debe modificarse.

  Referencias opcionales:

  - [FR-xxx] Requisito funcional de spec.md.
  - [SC-xxx] Criterio de éxito de spec.md.
  - [USx] Historia de usuario.
  - [Txxx] Tarea de tasks.md.
  - [CONTRACT] Contrato o interfaz relevante.
  - [CONSTITUTION] Regla o principio de constitution.md.

  Reglas:

  - Los IDs deben ser secuenciales: CHK001, CHK002, CHK003...
  - Cada elemento debe comprobar UNA sola condición.
  - Cada elemento debe ser verificable objetivamente.
  - Evita términos vagos como "correcto", "adecuado" o "bien definido"
    sin indicar qué condición concreta debe cumplirse.
  - Añade referencias cuando aporten trazabilidad útil.
  - No conviertas cada requisito o tarea automáticamente en un elemento.
    Incluye únicamente comprobaciones relevantes para el propósito de la checklist.
-->

## [CATEGORY 1]

<!--
  Agrupa los elementos por áreas conceptuales relevantes.

  Los nombres de categoría deben derivarse del tipo de checklist.

  Ejemplos:

  Requirements checklist:
  - Completeness
  - Clarity
  - Consistency
  - Traceability
  - Edge Cases

  Security checklist:
  - Authentication
  - Authorization
  - Input Validation
  - Data Protection
  - Error Handling

  UX checklist:
  - Navigation
  - Feedback
  - Error States
  - Responsiveness
  - Accessibility
-->

* [ ] CHK001 [REFERENCE] [First specific and verifiable criterion]
* [ ] CHK002 [REFERENCE] [Second specific and verifiable criterion]
* [ ] CHK003 [REFERENCE] [Third specific and verifiable criterion]

## [CATEGORY 2]

* [ ] CHK004 [REFERENCE] [Specific criterion]
* [ ] CHK005 [REFERENCE] [Specific criterion]
* [ ] CHK006 [REFERENCE] [Specific criterion]

## Casos límite y excepciones

<!--
  Incluye esta sección únicamente cuando el tipo de checklist lo requiera.

  Comprueba aspectos como:

  - Boundary conditions
  - Empty states
  - Invalid inputs
  - Failure paths
  - Interrupted operations
  - Duplicate actions
  - Unexpected states
  - Recovery behavior

  Cuando sea posible, referencia los escenarios Gherkin o requisitos EARS
  correspondientes de spec.md.
-->

* [ ] CHKXXX [REFERENCE] [Boundary or exception criterion]

## Consistencia y trazabilidad

<!--
  Comprueba únicamente relaciones relevantes para el propósito de esta checklist.

  Posibles comprobaciones:

  - Requisitos ↔ historias de usuario
  - Requisitos ↔ escenarios de aceptación
  - Requisitos ↔ tareas
  - Contratos ↔ implementación
  - Modelo de datos ↔ requisitos
  - Plan ↔ constitución
  - Criterios de éxito ↔ comportamiento definido

  No añadas comprobaciones de trazabilidad que no aporten valor al tipo
  concreto de checklist.
-->

* [ ] CHKXXX [REFERENCE] [Traceability criterion]

## Gates críticos

<!--
  Utiliza esta sección para condiciones que DEBEN cumplirse antes de considerar
  superada la checklist.

  Incluye únicamente gates reales derivados de:

  - constitution.md
  - requisitos críticos
  - seguridad
  - integridad de datos
  - criterios de aceptación obligatorios
  - restricciones técnicas no negociables

  Si no existen gates críticos específicos, elimina esta sección.
-->

* [ ] CHKXXX [CONSTITUTION] [Critical gate]
* [ ] CHKXXX [REFERENCE] [Critical feature-specific gate]

## Resultado

<!--
  Completar durante la revisión.

  Estado recomendado:

  - Passed: todos los elementos obligatorios están satisfechos.
  - Passed with findings: existen observaciones no bloqueantes.
  - Failed: existe al menos un incumplimiento bloqueante.
-->

**Resultado**: [RESULT] # Passed | Passed with findings | Failed

**Elementos completados**: [COMPLETED]/[TOTAL]

**Elementos bloqueantes pendientes**: [COUNT]

## Hallazgos

<!--
  Registra únicamente hallazgos que requieran contexto adicional.

  No es necesario añadir una entrada para cada checkbox completado.

  Formato recomendado:

  - CHKxxx: hallazgo, impacto y acción necesaria.
-->

* **[CHKxxx]**: [Finding, impact and required action]

## Notas

* Marca un elemento completado utilizando `[x]`.
* Mantén `[ ]` para elementos pendientes.
* Los IDs `CHKxxx` no deben reutilizarse.
* Añade comentarios o hallazgos únicamente cuando aporten contexto relevante.
* Utiliza referencias `[FR-xxx]`, `[SC-xxx]`, `[USx]` o `[Txxx]` cuando mejoren la trazabilidad.
* Cada elemento debe expresar una condición concreta y verificable.
* No añadas elementos genéricos que no puedan validarse objetivamente.
* No dupliques requisitos, escenarios o tareas sin aportar una comprobación adicional.
* La checklist debe validar la calidad o cumplimiento del artefacto, no sustituir `spec.md`, `plan.md` o `tasks.md`.
