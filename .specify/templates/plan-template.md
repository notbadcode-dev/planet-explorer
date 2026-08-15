---

title: "[FEATURE]"
feature: "[###-feature-name]"
type: "implementation-plan"
version: "1.0" # 1.0 | 1.1 | 1.2
created: "[DATE]" # 2026-08-15T15:49:00+02:00
updated: "[DATE]" # 2026-08-15T15:49:00+02:00
status: "Draft" # Draft | In Review | Approved | Implemented | Deprecated
spec: "./spec.md"
tags: [] # frontend, backend, api, ui, ux, data, security, performance, accessibility, testing, infrastructure, documentation, game, education, authentication, users, progression, planets, reporting, invoicing
dependencies: [] # ["###-feature-name", "###-feature-name"]
related_specs: [] # ["###-feature-name", "###-feature-name"]
------------------------------------------------------------

# Plan de implementación: [FEATURE]

**Rama**: `[###-feature-name]` | **Fecha**: [DATE] | **Especificación**: [link]

**Entrada**: Especificación de funcionalidad de `/specs/[###-feature-name]/spec.md`

**Nota**: Esta plantilla se completa mediante el comando `/speckit-plan`; su definición describe el flujo de ejecución.

## Resumen

<!--
  Resume:
  - El objetivo funcional principal definido en spec.md.
  - El enfoque técnico seleccionado para implementarlo.

  No repitas toda la especificación.
  No introduzcas nuevos requisitos funcionales.
-->

[Summarize the primary requirement from spec.md and the selected technical approach]

## Contexto técnico

<!--
  ACCIÓN REQUERIDA: Sustituye los placeholders de esta sección por los detalles
  técnicos concretos del proyecto.

  Esta sección define el contexto técnico en el que se implementará la funcionalidad.
  Utiliza NEEDS CLARIFICATION únicamente cuando una decisión necesaria no pueda
  deducirse de la especificación, la constitución o el proyecto existente.
-->

**Lenguaje/Versión**: [e.g., TypeScript 7, .NET 9, Python 3.13 or NEEDS CLARIFICATION]

**Dependencias principales**: [e.g., Angular 21, ASP.NET Core, EF Core or NEEDS CLARIFICATION]

**Almacenamiento**: [e.g., MySQL, PostgreSQL, IndexedDB, files or N/A]

**Testing**: [e.g., Vitest, Playwright, xUnit or NEEDS CLARIFICATION]

**Plataforma objetivo**: [e.g., modern browsers, Linux server, iOS 18+ or NEEDS CLARIFICATION]

**Tipo de proyecto**: [e.g., spa, web-app, web-service, library, cli, mobile-app or NEEDS CLARIFICATION]

**Objetivos de rendimiento**: [domain-specific, e.g., 60 fps, <200 ms interaction latency or NEEDS CLARIFICATION]

**Restricciones**: [domain-specific, e.g., offline-capable, GitHub Pages compatible, <100 MB memory or NEEDS CLARIFICATION]

**Escala/Alcance**: [domain-specific, e.g., 10 screens, 100 concurrent users, 5 game modes or NEEDS CLARIFICATION]

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

<!--
  Evalúa esta funcionalidad contra constitution.md.

  Para cada principio o regla relevante:
  - Confirma cumplimiento.
  - Identifica cualquier desviación.
  - No justifiques una violación aquí; utiliza Complexity Tracking para ello.

  Si no existen incumplimientos, indícalo explícitamente.
-->

[Gates determined based on constitution.md]

## Investigación técnica

<!--
  Resume únicamente las áreas que requieren investigación antes de cerrar el diseño.

  La investigación detallada debe almacenarse en research.md.

  Esta sección debe indicar:
  - Qué necesita investigarse.
  - Por qué afecta al diseño.
  - Qué decisión debe obtenerse como resultado.

  Si no se requiere investigación, indica N/A.
-->

* **[RESEARCH TOPIC]**: [What must be determined and why]
* **[RESEARCH TOPIC]**: [What must be determined and why]

## Decisiones técnicas

<!--
  Documenta únicamente las decisiones técnicas relevantes para esta funcionalidad.

  research.md contiene el análisis y las alternativas estudiadas.
  Esta sección conserva las decisiones finales que afectan a la implementación.

  Para cada decisión indica:
  - Decisión adoptada.
  - Motivo.
  - Alternativas relevantes descartadas.

  No documentes decisiones triviales o ya establecidas globalmente
  por constitution.md o por la arquitectura existente.
-->

### [DECISION TITLE]

**Decisión**: [Selected approach]

**Motivo**: [Why this approach was selected]

**Alternativas descartadas**: [Relevant alternatives and why they were rejected]

## Estrategia de pruebas

<!--
  Define cómo se validará técnicamente la funcionalidad.

  La estrategia DEBE derivarse de:
  - Los escenarios de aceptación de spec.md.
  - Los requisitos funcionales.
  - Los casos límite relevantes.

  No copies los escenarios Gherkin aquí.
  Indica qué niveles de pruebas son necesarios y qué responsabilidad tiene cada uno.
-->

* **Unit**: [scope or N/A]
* **Integration**: [scope or N/A]
* **Contract**: [scope or N/A]
* **E2E**: [scope or N/A]

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/[###-feature-name]/
├── spec.md              # Especificación funcional (/speckit-specify)
├── plan.md              # Este fichero (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/           # Fase 1 (/speckit-plan)
└── tasks.md             # Fase 2 (/speckit-tasks - NO creado por /speckit-plan)
```

### Código fuente (raíz del repositorio)

<!--
  ACCIÓN REQUERIDA: Sustituye las estructuras de ejemplo por la estructura
  real que utilizará esta funcionalidad.

  Reglas:
  - Elimina todas las opciones que no se utilicen.
  - El plan final NO DEBE contener etiquetas "Option".
  - Utiliza rutas reales del repositorio.
  - Incluye únicamente directorios relevantes para la funcionalidad.
  - Mantén nombres de ficheros, carpetas e identificadores técnicos en inglés.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project

src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/


# [REMOVE IF UNUSED] Option 2: Web application

backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/


# [REMOVE IF UNUSED] Option 3: Mobile + API

api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Decisión de estructura**: [Document the selected structure and reference the real directories captured above]

## Modelo de datos

<!--
  Resume únicamente los cambios de modelo de datos relevantes para entender
  el plan de implementación.

  El diseño completo debe documentarse en data-model.md.

  Incluye, cuando aplique:
  - Entidades nuevas o modificadas.
  - Relaciones.
  - Estados relevantes.
  - Persistencia.
  - Migraciones necesarias.

  No incluyas detalles innecesarios de implementación.

  Si la funcionalidad no modifica datos persistentes, indica N/A.
-->

[Summarize relevant data model changes or N/A]

## Contratos e interfaces

<!--
  Identifica contratos nuevos o modificados entre componentes o sistemas.

  Ejemplos:
  - REST APIs
  - Events
  - Commands
  - Messages
  - Public interfaces
  - External integrations

  Los contratos detallados deben almacenarse en contracts/.

  Si no existen contratos nuevos o modificados, indica N/A.
-->

* **[CONTRACT]**: [Description]
* **[CONTRACT]**: [Description]

## Riesgos y compromisos

<!--
  Incluye únicamente riesgos técnicos o compromisos relevantes que puedan
  afectar al desarrollo, mantenimiento, rendimiento, seguridad o experiencia.

  Evita riesgos hipotéticos de baja probabilidad sin impacto real.

  Si no existen riesgos relevantes, indica N/A.
-->

* **[RISK]**: [Impact and mitigation]
* **[TRADE-OFF]**: [Accepted compromise and rationale]

## Seguimiento de complejidad

> **Completar SOLO si Constitution Check detecta violaciones que deban justificarse.**

<!--
  Cada violación de constitution.md debe:
  - Estar identificada explícitamente.
  - Tener una necesidad concreta.
  - Explicar por qué una alternativa más simple no es suficiente.

  Si no existen violaciones, elimina esta tabla o indica N/A.
-->

| Violación                  | Por qué es necesaria | Alternativa más simple rechazada porque |
| -------------------------- | -------------------- | --------------------------------------- |
| [e.g., 4th project]        | [current need]       | [why 3 projects are insufficient]       |
| [e.g., Repository pattern] | [specific problem]   | [why direct DB access is insufficient]  |
