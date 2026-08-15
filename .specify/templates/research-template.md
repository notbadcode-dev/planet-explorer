---

title: "[FEATURE NAME] Research"
feature: "[###-feature-name]"
type: "research"
version: "1.0" # 1.0 | 1.1 | 1.2
created: "[DATE]" # 2026-08-15T15:56:00+02:00
updated: "[DATE]" # 2026-08-15T15:56:00+02:00
status: "Draft" # Draft | In Review | Approved | Deprecated
spec: "./spec.md"
plan: "./plan.md"
tags: [] # frontend, backend, api, ui, ux, data, security, performance, accessibility, testing, infrastructure, documentation, architecture, integration, storage
dependencies: [] # ["###-feature-name", "###-feature-name"]
related_specs: [] # ["###-feature-name", "###-feature-name"]
------------------------------------------------------------

# Investigación técnica: [FEATURE NAME]

**Entrada**: `spec.md`, `plan.md` y contexto técnico disponible en `/specs/[###-feature-name]/`

**Propósito**: Resolver incertidumbres técnicas relevantes antes de cerrar el diseño de implementación.

**Nota**: Este documento se genera durante la Fase 0 de `/speckit-plan`.

## Objetivo de la investigación

<!--
  Define qué incertidumbres deben resolverse para poder completar el diseño.

  research.md NO debe:
  - Repetir spec.md.
  - Introducir nuevos requisitos funcionales.
  - Convertirse en documentación general del stack.
  - Registrar decisiones triviales ya establecidas por constitution.md
    o por la arquitectura existente.

  Cada investigación debe existir porque una decisión pendiente afecta a:
  - Arquitectura.
  - Diseño.
  - Rendimiento.
  - Seguridad.
  - Persistencia.
  - Integración.
  - Testing.
  - Compatibilidad.
  - Mantenibilidad.
-->

[Describe the technical uncertainties that must be resolved]

## Fuentes y restricciones

<!--
  Registra las fuentes normativas o técnicas que condicionan la investigación.

  Prioridad recomendada:

  1. constitution.md
  2. spec.md
  3. Código y arquitectura existentes
  4. Documentación oficial
  5. Estándares o especificaciones técnicas
  6. Evidencia experimental
  7. Otras fuentes técnicas fiables

  Evita basar decisiones importantes únicamente en preferencias personales
  o ejemplos aislados.
-->

* **Constitución**: `../../.specify/memory/constitution.md`
* **Especificación**: `./spec.md`
* **Plan**: `./plan.md`
* **Código existente**: [Relevant paths or N/A]
* **Documentación oficial**: [Relevant sources or N/A]
* **Restricciones aplicables**: [Relevant constraints]

## Resumen de decisiones

<!--
  Esta tabla proporciona una vista rápida de las decisiones cerradas.

  Una decisión debe aparecer aquí únicamente cuando la investigación
  haya concluido.

  No dupliques todo el análisis; enlaza con la sección correspondiente.
-->

| ID    | Tema             | Decisión            | Estado     |
| ----- | ---------------- | ------------------- | ---------- |
| R-001 | [RESEARCH TOPIC] | [SELECTED DECISION] | [Resolved] |
| R-002 | [RESEARCH TOPIC] | [SELECTED DECISION] | [Resolved] |

## R-001 — [RESEARCH TOPIC]

### Pregunta

<!--
  Formula una pregunta técnica concreta.

  Evita preguntas demasiado amplias como:
  "¿Qué arquitectura usamos?"

  Prefiere:
  "¿Debe el progreso persistirse en localStorage o IndexedDB para cumplir
  los requisitos offline definidos en FR-004?"
-->

[TECHNICAL QUESTION]

### Contexto

<!--
  Explica únicamente el contexto necesario para comprender por qué
  esta decisión debe tomarse.

  Cuando sea posible, referencia:
  - FR-xxx
  - SC-xxx
  - USx
  - restricciones de constitution.md
  - decisiones existentes del proyecto
-->

[Relevant context and constraints]

### Criterios de decisión

<!--
  Define los factores que realmente pueden cambiar la decisión.

  Ejemplos:
  - Compatibilidad con requisitos.
  - Simplicidad.
  - Coste de mantenimiento.
  - Rendimiento.
  - Seguridad.
  - Experiencia de usuario.
  - Compatibilidad con arquitectura existente.
  - Dependencias adicionales.
  - Testabilidad.

  No añadas criterios irrelevantes solo para hacer una comparación
  artificialmente equilibrada.
-->

* [DECISION CRITERION]
* [DECISION CRITERION]
* [DECISION CRITERION]

### Opciones consideradas

#### Opción A — [OPTION NAME]

**Descripción**: [Brief description]

**Ventajas**:

* [Relevant advantage]

**Inconvenientes**:

* [Relevant disadvantage]

**Impacto**: [Relevant technical or product impact]

#### Opción B — [OPTION NAME]

**Descripción**: [Brief description]

**Ventajas**:

* [Relevant advantage]

**Inconvenientes**:

* [Relevant disadvantage]

**Impacto**: [Relevant technical or product impact]

<!--
  Añade más opciones solo cuando sean realmente plausibles.

  No incluyas alternativas claramente inviables únicamente para justificar
  la opción seleccionada.
-->

### Decisión

**Decisión seleccionada**: [SELECTED DECISION]

**Motivo**: [Why this option best satisfies the relevant criteria]

**Alternativas descartadas**:

* **[OPTION NAME]**: [Why it was rejected]
* **[OPTION NAME]**: [Why it was rejected]

### Evidencia

<!--
  Registra la evidencia que respalda la decisión cuando sea relevante.

  Puede incluir:
  - Documentación oficial.
  - Estándares.
  - Comportamiento comprobado del código existente.
  - Benchmarks.
  - Prototipos.
  - Pruebas técnicas.
  - Restricciones verificadas.

  No es obligatorio incluir evidencia externa para decisiones simples
  derivadas directamente de la arquitectura existente.
-->

* [EVIDENCE OR SOURCE]
* [EVIDENCE OR SOURCE]

### Consecuencias

<!--
  Documenta únicamente consecuencias relevantes de adoptar esta decisión.

  Distingue entre:
  - Consecuencias positivas.
  - Costes o compromisos aceptados.
  - Restricciones que introduce.

  No conviertas esta sección en una lista genérica de riesgos.
-->

* [CONSEQUENCE]
* [CONSEQUENCE]

### Impacto en el diseño

<!--
  Indica qué artefactos o partes de plan.md deben reflejar esta decisión.

  Ejemplos:
  - data-model.md
  - contracts/
  - testing strategy
  - project structure
  - dependencies
  - persistence
-->

* [DESIGN IMPACT]

### Trazabilidad

* **Historias relacionadas**: [US1, US2 or N/A]
* **Requisitos relacionados**: [FR-001, FR-002 or N/A]
* **Criterios de éxito relacionados**: [SC-001 or N/A]

---

## R-002 — [RESEARCH TOPIC]

### Pregunta

[TECHNICAL QUESTION]

### Contexto

[Relevant context and constraints]

### Criterios de decisión

* [DECISION CRITERION]
* [DECISION CRITERION]

### Opciones consideradas

#### Opción A — [OPTION NAME]

**Descripción**: [Brief description]

**Ventajas**:

* [Relevant advantage]

**Inconvenientes**:

* [Relevant disadvantage]

#### Opción B — [OPTION NAME]

**Descripción**: [Brief description]

**Ventajas**:

* [Relevant advantage]

**Inconvenientes**:

* [Relevant disadvantage]

### Decisión

**Decisión seleccionada**: [SELECTED DECISION]

**Motivo**: [Why this option was selected]

**Alternativas descartadas**:

* **[OPTION NAME]**: [Why it was rejected]

### Evidencia

* [EVIDENCE OR SOURCE]

### Consecuencias

* [CONSEQUENCE]

### Impacto en el diseño

* [DESIGN IMPACT]

### Trazabilidad

* **Historias relacionadas**: [USx or N/A]
* **Requisitos relacionados**: [FR-xxx or N/A]
* **Criterios de éxito relacionados**: [SC-xxx or N/A]

---

[Añade más bloques `R-xxx` únicamente cuando exista una decisión técnica real que resolver]

## Validaciones experimentales

<!--
  Incluir únicamente cuando una decisión requiera una prueba práctica,
  benchmark, spike o prototipo.

  Ejemplos:
  - Verificar compatibilidad de una librería.
  - Medir rendimiento.
  - Validar comportamiento offline.
  - Probar una API externa.
  - Confirmar una limitación del navegador.

  Los experimentos deben ser mínimos y estar orientados a resolver
  una pregunta concreta.

  Si no se requieren experimentos, indica N/A.
-->

### EXP-001 — [EXPERIMENT NAME]

**Objetivo**: [What must be validated]

**Hipótesis**: [Expected result]

**Método**: [Minimal validation approach]

**Resultado**: [Observed result]

**Conclusión**: [What the result implies for the design]

**Decisión relacionada**: [R-xxx]

## Riesgos identificados

<!--
  Incluye únicamente riesgos descubiertos durante la investigación
  que puedan afectar realmente al diseño o implementación.

  Los riesgos ya conocidos y gestionados en plan.md no necesitan duplicarse
  salvo que la investigación añada información nueva.
-->

| ID       | Riesgo | Impacto               | Probabilidad          | Mitigación   |
| -------- | ------ | --------------------- | --------------------- | ------------ |
| RISK-001 | [RISK] | [Low / Medium / High] | [Low / Medium / High] | [MITIGATION] |

## Incertidumbres pendientes

<!--
  Toda incertidumbre necesaria para cerrar el diseño debe resolverse
  antes de considerar finalizada la Fase 0.

  Si una cuestión no puede resolverse y afecta materialmente a la feature,
  debe convertirse en NEEDS CLARIFICATION.

  No mantengas incertidumbres críticas ocultas dentro del texto.
-->

* [ ] [OPEN QUESTION]
* [ ] [OPEN QUESTION]

Si no existen incertidumbres pendientes:

`N/A — Todas las decisiones necesarias para continuar con el diseño están resueltas.`

## Decisiones descartadas para futuro

<!--
  OPCIONAL.

  Utiliza esta sección únicamente cuando una alternativa descartada pueda
  volver a ser relevante bajo una condición concreta futura.

  No documentes funcionalidades especulativas ni roadmaps no acordados.
-->

* **[OPTION]**: reconsiderar únicamente si [FUTURE CONDITION].

## Conclusión de la Fase 0

<!--
  Resume si existe suficiente información para continuar con la Fase 1.

  No repitas todas las decisiones.

  Debe quedar claro:
  - Si las incertidumbres críticas están resueltas.
  - Si existe algún bloqueo.
  - Qué decisiones deben trasladarse a plan.md, data-model.md o contracts/.
-->

**Estado**: [RESULT] # Ready for Phase 1 | Blocked

**Decisiones cerradas**: [COUNT]

**Incertidumbres bloqueantes**: [COUNT]

**Resultado**: [Brief conclusion]

## Validación de completitud

<!--
  Antes de considerar research.md completado:

  - Todas las preguntas necesarias para el diseño están resueltas.
  - Cada decisión relevante tiene una justificación.
  - Las alternativas plausibles han sido evaluadas cuando era necesario.
  - No existen NEEDS CLARIFICATION técnicos ocultos.
  - Las decisiones respetan constitution.md.
  - Las consecuencias relevantes están identificadas.
  - plan.md puede actualizarse con decisiones concretas.
-->

* [ ] Todas las incertidumbres técnicas bloqueantes están resueltas.
* [ ] Todas las decisiones relevantes tienen una justificación clara.
* [ ] Las alternativas relevantes han sido consideradas.
* [ ] Las decisiones respetan `constitution.md`.
* [ ] Los riesgos relevantes están identificados.
* [ ] Los impactos en diseño están documentados.
* [ ] Las decisiones necesarias pueden trasladarse a `plan.md`.
* [ ] No quedan `NEEDS CLARIFICATION` técnicos ocultos.

## Notas

* Cada investigación debe tener un identificador estable `R-xxx`.
* Cada experimento debe tener un identificador estable `EXP-xxx`.
* Los parámetros, identificadores, nombres de ficheros, rutas y elementos técnicos se mantienen en inglés.
* El contenido documental se redacta en castellano.
* Prioriza documentación oficial y evidencia directa para decisiones técnicas.
* No investigues decisiones que ya estén establecidas por `constitution.md` o por la arquitectura existente.
* No añadas complejidad únicamente porque una alternativa sea técnicamente más sofisticada.
* Una decisión debe cerrarse cuando exista evidencia suficiente; no es necesario analizar alternativas marginales.
