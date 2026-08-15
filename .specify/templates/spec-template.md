---
title: "[FEATURE NAME]"
feature: "[###-feature-name]"
type: "feature-spec"
version: "1.0" # 1.0 | 1.1 | 1.2
created: "[DATE]" # 2026-08-15T15:47:00+02:00
updated: "[DATE]" # 2026-08-15T15:47:00+02:00
status: "Draft" # Draft | In Review | Approved | Implemented | Deprecated
priority: "[PRIORITY]" # P0 | P1 | P2 | P3 | P4
tags: [] # frontend, backend, api, ui, ux, data, security, performance, accessibility, testing, infrastructure, documentation, game, education, authentication, users, progression, planets, reporting, invoicing
dependencies: [] # ["###-feature-name", "###-feature-name"]
related_specs: [] # ["###-feature-name", "###-feature-name"]
---

# Especificación de funcionalidad: [FEATURE NAME]

**Rama de la funcionalidad**: `[###-feature-name]`

**Creado**: [DATE]

**Estado**: Draft

**Entrada**: Descripción del usuario: "$ARGUMENTS"

## Escenarios de usuario y pruebas *(obligatorio)*

<!--
  IMPORTANTE: Las historias de usuario deben estar PRIORIZADAS como recorridos de usuario
  ordenados por importancia.

  Cada historia o recorrido de usuario debe poder PROBARSE DE FORMA INDEPENDIENTE.
  Esto significa que, si solo se implementa una de ellas, debe seguir existiendo un MVP
  (Producto Mínimo Viable) que aporte valor.

  Asigna prioridades (P1, P2, P3, etc.), donde P1 representa la prioridad más alta.

  Considera cada historia como una porción independiente de funcionalidad que pueda:
  - Desarrollarse de forma independiente
  - Probarse de forma independiente
  - Desplegarse de forma independiente
  - Demostrarse a los usuarios de forma independiente
-->

### Historia de usuario 1 - [Brief Title] (Prioridad: P1)

[Describe this user journey in plain language]

**Por qué tiene esta prioridad**: [Explain the value and why it has this priority level]

**Prueba independiente**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Escenarios de aceptación**:

<!--
  GHERKIN

  Los escenarios de aceptación DEBEN utilizar el estilo Gherkin
  Given / When / Then.

  Directrices:
  - Given describe el estado inicial o las precondiciones.
  - When describe la acción o evento.
  - Then describe el resultado observable esperado.
  - Usa And / But cuando las condiciones o resultados adicionales mejoren la claridad.
  - Describe comportamiento observable externamente.
  - Evita detalles de implementación.
  - Mantén cada escenario centrado en un único comportamiento.
-->

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **And** [additional context], **When** [action], **Then** [expected outcome]

---

### Historia de usuario 2 - [Brief Title] (Prioridad: P2)

[Describe this user journey in plain language]

**Por qué tiene esta prioridad**: [Explain the value and why it has this priority level]

**Prueba independiente**: [Describe how this can be tested independently]

**Escenarios de aceptación**:

<!--
  GHERKIN

  Usa la sintaxis Given / When / Then.
  Añade And / But únicamente cuando mejoren la claridad.
-->

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### Historia de usuario 3 - [Brief Title] (Prioridad: P3)

[Describe this user journey in plain language]

**Por qué tiene esta prioridad**: [Explain the value and why it has este nivel de prioridad]

**Prueba independiente**: [Describe how this can be tested independently]

**Escenarios de aceptación**:

<!--
  GHERKIN

  Usa la sintaxis Given / When / Then.
  Añade And / But únicamente cuando mejoren la claridad.
-->

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Casos límite

<!--
  ACCIÓN REQUERIDA: Identifica condiciones límite relevantes, estados inválidos,
  escenarios de fallo, estados vacíos, límites e interacciones poco habituales.

  Los casos límite que definan comportamiento obligatorio del sistema
  DEBERÍAN representarse también mediante un escenario de aceptación Gherkin
  dentro de la historia de usuario correspondiente.

  Presta especial atención a:
  - Valores mínimos y máximos
  - Datos vacíos o ausentes
  - Entradas inválidas
  - Acciones duplicadas
  - Operaciones interrumpidas
  - Condiciones de error
  - Transiciones de estado
-->

* ¿Qué sucede cuando [boundary condition]?
* ¿Cómo gestiona el sistema [error scenario]?
* ¿Qué sucede cuando [required data is missing or invalid]?
* ¿Qué sucede en [minimum/maximum supported value]?

## Requisitos *(obligatorio)*

<!--
  ACCIÓN REQUERIDA: Define los requisitos observables de la funcionalidad.

  Los requisitos describen QUÉ debe hacer el sistema, no CÓMO se implementa.

  Cada requisito DEBE ser:
  - Atómico
  - No ambiguo
  - Verificable
  - Identificable de forma independiente
  - Independiente de la tecnología, salvo que la tecnología sea en sí misma
    una restricción explícita del producto

  Usa MUST para comportamiento obligatorio.

  Evita combinar varios comportamientos independientes dentro del mismo requisito.
-->

### Requisitos funcionales

<!--
  EARS — Easy Approach to Requirements Syntax

  Los requisitos funcionales DEBEN seguir la sintaxis EARS cuando sea aplicable.

  Utiliza el patrón EARS más sencillo que permita expresar correctamente
  el requisito.

  Patrones EARS:

  1. Requisito ubicuo
     The system MUST [response].

  2. Requisito dirigido por evento
     WHEN [trigger], the system MUST [response].

  3. Requisito dirigido por estado
     WHILE [state], the system MUST [response].

  4. Requisito de funcionalidad opcional
     WHERE [feature or condition applies], the system MUST [response].

  5. Comportamiento no deseado
     IF [undesired condition], THEN the system MUST [response].

  6. Requisito complejo
     WHILE [state], WHEN [trigger], the system MUST [response].

  Directrices:
  - Prefiere un único comportamiento por requisito.
  - Expresa explícitamente los eventos y condiciones cuando sean relevantes.
  - Evita términos vagos como "normalmente", "rápidamente", "correctamente"
    o "cuando sea necesario".
  - No incluyas detalles de implementación salvo que sean una restricción explícita.
  - Cada requisito DEBERÍA poder trazarse hasta uno o más escenarios de aceptación.
-->

* **FR-001**: The system MUST [specific capability].
* **FR-002**: WHEN [trigger], the system MUST [expected response].
* **FR-003**: WHILE [state], the system MUST [expected behavior].
* **FR-004**: WHERE [feature or condition applies], the system MUST [expected behavior].
* **FR-005**: IF [undesired condition], THEN the system MUST [expected response].
* **FR-006**: WHILE [state], WHEN [trigger], the system MUST [expected response].

*Ejemplos:*

* **FR-007**: WHEN the user submits valid credentials, the system MUST authenticate the user.
* **FR-008**: WHILE the user session is active, the system MUST preserve the user's current progress.
* **FR-009**: IF authentication fails, THEN the system MUST display an error without exposing sensitive information.

*Ejemplos de requisitos que necesitan aclaración:*

* **FR-010**: WHEN the user authenticates, the system MUST use [NEEDS CLARIFICATION: authentication method not specified - email/password, SSO, OAuth?].
* **FR-011**: The system MUST retain user data for [NEEDS CLARIFICATION: retention period not specified].

### Entidades clave *(incluir si la funcionalidad implica datos)*

<!--
  Describe conceptualmente las entidades del dominio.

  Incluye:
  - Qué representa la entidad
  - Atributos importantes
  - Relaciones relevantes
  - Ciclo de vida o estados relevantes

  NO incluyas:
  - Tablas de base de datos
  - Modelos específicos de frameworks
  - Configuración de ORM
  - Tipos específicos de implementación
-->

* **[Entity 1]**: [What it represents, key attributes without implementation details]
* **[Entity 2]**: [What it represents, relationships to other entities]

## Criterios de éxito *(obligatorio)*

<!--
  ACCIÓN REQUERIDA: Define criterios de éxito medibles.

  Los criterios de éxito DEBEN:
  - Ser medibles
  - Ser independientes de la tecnología
  - Describir resultados y no detalles de implementación
  - Poder verificarse de forma independiente
  - Definir qué significa que la funcionalidad se ha entregado correctamente

  No dupliques aquí los requisitos funcionales.
-->

### Resultados medibles

* **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
* **SC-002**: [Measurable metric, e.g., "The system supports 1000 concurrent users without observable degradation"]
* **SC-003**: [User outcome, e.g., "90% of users successfully complete the primary task on their first attempt"]
* **SC-004**: [Business outcome, e.g., "Reduce support tickets related to [X] by 50%"]

## Suposiciones

<!--
  ACCIÓN REQUERIDA: Documenta las suposiciones razonables realizadas cuando
  la descripción de la funcionalidad no proporciona suficiente información.

  Las suposiciones NO DEBEN introducir silenciosamente decisiones críticas
  de producto.

  Si una incertidumbre puede modificar de forma significativa:
  - El alcance
  - La experiencia de usuario
  - La seguridad
  - El tratamiento de datos
  - Las reglas de negocio
  - La arquitectura
  - Los criterios de aceptación

  márcala como NEEDS CLARIFICATION en lugar de tratarla como una suposición.
-->

* [Assumption about target users, e.g., "Users have stable internet connectivity"]
* [Assumption about scope boundaries, e.g., "Mobile support is out of scope for v1"]
* [Assumption about data/environment, e.g., "Existing authentication system will be reused"]
* [Dependency on existing system/service, e.g., "Requires access to the existing user profile API"]
