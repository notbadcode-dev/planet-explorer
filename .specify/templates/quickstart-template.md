---

title: "[FEATURE NAME] Quickstart"
feature: "[###-feature-name]"
type: "quickstart"
version: "1.0" # 1.0 | 1.1 | 1.2
created: "[DATE]" # 2026-08-15T15:59:00+02:00
updated: "[DATE]" # 2026-08-15T15:59:00+02:00
status: "Draft" # Draft | In Review | Approved | Validated | Deprecated
spec: "./spec.md"
plan: "./plan.md"
research: "./research.md"
data_model: "./data-model.md"
contracts: "./contracts/"
tags: [] # frontend, backend, api, ui, ux, data, security, performance, accessibility, testing, infrastructure, documentation, game, education, authentication, users, progression, planets, reporting, invoicing
dependencies: [] # ["###-feature-name", "###-feature-name"]
related_specs: [] # ["###-feature-name", "###-feature-name"]
------------------------------------------------------------

# Guía de validación rápida: [FEATURE NAME]

**Entrada**: Artefactos de diseño disponibles en `/specs/[###-feature-name]/`

**Propósito**: Proporcionar el procedimiento mínimo, reproducible y verificable para preparar, ejecutar y validar la funcionalidad de extremo a extremo.

**Nota**: Este documento se genera durante la Fase 1 de `/speckit-plan`.

## Objetivo

<!--
  quickstart.md NO es documentación general del proyecto ni una guía
  completa de desarrollo.

  Su objetivo es permitir que una persona pueda:

  1. Preparar el entorno necesario.
  2. Ejecutar la funcionalidad.
  3. Recorrer los escenarios principales.
  4. Comprobar los resultados esperados.
  5. Detectar rápidamente si la implementación cumple spec.md.

  Debe ser:
  - Breve.
  - Reproducible.
  - Ejecutable.
  - Independiente de conocimiento implícito.
  - Coherente con spec.md y plan.md.

  NO debe:
  - Introducir requisitos nuevos.
  - Duplicar toda la documentación del proyecto.
  - Incluir decisiones de arquitectura ya explicadas en plan.md.
  - Sustituir tests automatizados.
  - Incluir pasos que no sean necesarios para validar la feature.
-->

[Describe what this quickstart validates]

## Alcance

<!--
  Define qué recorrido funcional cubre esta guía.

  Prioriza:
  - User Story P1 / MVP.
  - Flujos críticos.
  - Integraciones relevantes.
  - Casos de error importantes.
  - Requisitos que necesiten validación manual o end-to-end.

  No es necesario validar aquí todos los casos cubiertos por unit tests.
-->

**Incluye**:

* [IN_SCOPE_ITEM]
* [IN_SCOPE_ITEM]

**No incluye**:

* [OUT_OF_SCOPE_ITEM]
* [OUT_OF_SCOPE_ITEM]

## Fuentes

<!--
  La guía debe derivarse de:

  1. constitution.md
  2. spec.md
  3. plan.md
  4. research.md
  5. data-model.md
  6. contracts/
  7. Código y configuración existente cuando corresponda

  Los resultados esperados deben ser trazables a spec.md.
-->

* **Constitución**: `../../.specify/memory/constitution.md`
* **Especificación**: `./spec.md`
* **Plan**: `./plan.md`
* **Investigación**: `./research.md`
* **Modelo de datos**: `./data-model.md`
* **Contratos**: `./contracts/`

## Prerrequisitos

<!--
  Incluye únicamente requisitos previos necesarios para ejecutar esta feature.

  Ejemplos:
  - Runtime/version.
  - Package manager.
  - Database.
  - Browser.
  - Docker.
  - Environment variables.
  - External service.
  - Test account.

  Evita repetir herramientas que ya forman parte del proyecto
  y no requieren ninguna acción específica.
-->

### Software

* `[RUNTIME]` [VERSION]
* `[PACKAGE_MANAGER]` [VERSION]
* `[TOOL]` [VERSION]

### Servicios

* `[SERVICE]`: [Required state or configuration]
* `[SERVICE]`: [Required state or configuration]

### Acceso

* [Required account, permission or credential]
* [Required external resource]

## Configuración

<!--
  Documenta únicamente configuración necesaria para esta feature.

  Nunca incluyas secretos reales.

  Utiliza placeholders para:
  - API keys.
  - Passwords.
  - Tokens.
  - Connection strings.
-->

### Variables de entorno

```dotenv
[ENV_VARIABLE]=[VALUE]
[ENV_VARIABLE]=[VALUE]
```

<!--
  Si no existen variables específicas:

  N/A — La funcionalidad no requiere configuración adicional.
-->

### Datos de configuración

```text
[CONFIGURATION STEP]
```

## Preparación del entorno

<!--
  Los comandos deben poder copiarse y ejecutarse.

  Mantén comandos, rutas, nombres de paquetes y parámetros en inglés.

  Elimina los pasos que no apliquen.
-->

### 1. Instalar dependencias

```bash
[INSTALL_COMMAND]
```

### 2. Preparar servicios

```bash
[SERVICE_SETUP_COMMAND]
```

### 3. Preparar datos

```bash
[DATA_SETUP_COMMAND]
```

### 4. Verificar configuración

```bash
[VALIDATION_COMMAND]
```

**Resultado esperado**: [EXPECTED RESULT]

## Ejecutar la aplicación

<!--
  Incluye el conjunto mínimo de comandos necesario.

  Si existen frontend y backend, sepáralos claramente.
-->

### Backend

```bash
[BACKEND_START_COMMAND]
```

**Disponible en**: `[BACKEND_URL]`

### Frontend

```bash
[FRONTEND_START_COMMAND]
```

**Disponible en**: `[FRONTEND_URL]`

<!--
  Para un único proceso:

  ```bash
  [START_COMMAND]
  ```

  Disponible en: [APP_URL]
-->

## Verificación inicial

<!--
  Antes de ejecutar escenarios funcionales, confirma que el sistema
  está preparado.

  Incluye solo comprobaciones rápidas y objetivas.
-->

* [ ] La aplicación arranca sin errores bloqueantes.
* [ ] Los servicios necesarios están disponibles.
* [ ] La configuración requerida está cargada.
* [ ] Los datos iniciales necesarios existen.
* [ ] No existen errores relevantes en consola o logs.

## Datos de prueba

<!--
  Define el mínimo conjunto de datos necesario para reproducir los escenarios.

  Utiliza valores ficticios y seguros.

  Los datos deben ser deterministas siempre que sea posible.
-->

### [TEST DATA SET]

| Campo     | Valor     |
| --------- | --------- |
| `[field]` | `[value]` |
| `[field]` | `[value]` |

### Preparación

```bash
[TEST_DATA_SETUP_COMMAND]
```

<!--
  Si no se necesitan datos específicos:

  N/A — Los escenarios pueden validarse sin preparación adicional.
-->

## Escenarios de validación

<!--
  Esta es la sección principal de quickstart.md.

  Cada escenario debe derivarse de una historia o escenario de aceptación
  de spec.md.

  Utiliza identificadores estables QS-xxx.

  No es necesario copiar literalmente Gherkin.

  Cada escenario debe indicar:
  - Qué se valida.
  - Prerrequisitos.
  - Pasos.
  - Resultado esperado.
  - Trazabilidad.

  Prioriza primero P1/MVP.
-->

### QS-001 — [SCENARIO NAME]

**Objetivo**: [What this scenario validates]

**Prerrequisitos**:

* [PRECONDITION]
* [PRECONDITION]

**Pasos**:

1. [ACTION]
2. [ACTION]
3. [ACTION]

**Resultado esperado**:

* [EXPECTED OUTCOME]
* [EXPECTED OUTCOME]

**Trazabilidad**:

* **Historia**: [US1]
* **Requisitos**: [FR-001, FR-002]
* **Escenarios de aceptación**: [Scenario reference]
* **Criterios de éxito**: [SC-001 or N/A]

**Resultado**: [RESULT] # Pending | Passed | Failed

---

### QS-002 — [SCENARIO NAME]

**Objetivo**: [What this scenario validates]

**Prerrequisitos**:

* [PRECONDITION]

**Pasos**:

1. [ACTION]
2. [ACTION]

**Resultado esperado**:

* [EXPECTED OUTCOME]

**Trazabilidad**:

* **Historia**: [US2]
* **Requisitos**: [FR-xxx]
* **Escenarios de aceptación**: [Scenario reference]
* **Criterios de éxito**: [SC-xxx or N/A]

**Resultado**: [RESULT] # Pending | Passed | Failed

---

[Añade más escenarios `QS-xxx` únicamente cuando aporten una validación distinta y relevante]

## Casos límite

<!--
  Incluye únicamente casos límite relevantes para validación manual,
  integración o end-to-end.

  Los casos puramente unitarios no necesitan aparecer aquí.

  Derívalos de Edge Cases y escenarios Gherkin de spec.md.
-->

### QS-XXX — [EDGE CASE NAME]

**Condición**: [BOUNDARY OR ERROR CONDITION]

**Pasos**:

1. [ACTION]
2. [ACTION]

**Resultado esperado**:

* [EXPECTED BEHAVIOR]

**Trazabilidad**:

* **Requisitos**: [FR-xxx]
* **Escenario de aceptación**: [Scenario reference]

## Validación de contratos

<!--
  Incluir cuando la feature exponga o consuma contratos.

  Puede incluir:
  - REST API.
  - Event.
  - Command.
  - Message.
  - Public interface.

  No dupliques la definición del contrato: referencia contracts/.
-->

### [CONTRACT NAME]

**Contrato**: `./contracts/[CONTRACT_FILE]`

**Validación**:

```bash
[CONTRACT_VALIDATION_COMMAND]
```

**Resultado esperado**: [EXPECTED RESULT]

## Validación de persistencia

<!--
  Incluir únicamente cuando el comportamiento dependa de datos persistidos.

  Comprueba:
  - Creación.
  - Actualización.
  - Recuperación.
  - Eliminación cuando corresponda.
  - Persistencia entre sesiones si es requisito.

  No conviertas esta sección en documentación de base de datos.
-->

### [PERSISTENCE SCENARIO]

1. [ACTION]
2. [ACTION]
3. [VERIFY DATA]

**Resultado esperado**: [EXPECTED RESULT]

**Modelo relacionado**: [DM-xxx]

## Validación de estados

<!--
  Incluir cuando data-model.md defina transiciones de estado relevantes.
-->

| Estado inicial | Acción     | Estado esperado | Resultado                   |
| -------------- | ---------- | --------------- | --------------------------- |
| `[STATE]`      | `[ACTION]` | `[STATE]`       | [Pending / Passed / Failed] |

## Validación de errores

<!--
  Incluye errores relevantes para experiencia, seguridad o integridad.

  No es necesario probar manualmente cada excepción interna.
-->

### [ERROR CASE]

**Acción**: [ACTION THAT TRIGGERS ERROR]

**Resultado esperado**:

* [EXPECTED USER-FACING RESULT]
* [EXPECTED SYSTEM BEHAVIOR]

**No debe ocurrir**:

* [UNWANTED OUTCOME]

## Validación de rendimiento

<!--
  Incluir únicamente cuando spec.md o plan.md defina objetivos
  de rendimiento verificables mediante este quickstart.

  Las pruebas de carga formales pueden vivir en tooling específico,
  pero quickstart debe indicar cómo verificar el criterio cuando sea práctico.
-->

**Objetivo**: [PERFORMANCE TARGET]

```bash
[PERFORMANCE_VALIDATION_COMMAND]
```

**Criterio de aceptación**: [EXPECTED THRESHOLD]

**Resultado**: [RESULT]

## Validación de accesibilidad

<!--
  Incluir cuando aplique a la feature.

  Prioriza comprobaciones manuales o automáticas relevantes:
  - Keyboard navigation.
  - Focus.
  - Labels.
  - Contrast.
  - Screen reader semantics.
  - Reduced motion.
-->

* [ ] [ACCESSIBILITY CHECK]
* [ ] [ACCESSIBILITY CHECK]

## Validación de seguridad

<!--
  Incluir únicamente comprobaciones seguras y apropiadas
  derivadas de spec.md, plan.md o constitution.md.

  Ejemplos:
  - Unauthorized access is rejected.
  - Sensitive information is not exposed.
  - Input validation behaves correctly.
  - Required permissions are enforced.
-->

* [ ] [SECURITY CHECK]
* [ ] [SECURITY CHECK]

## Validación multiplataforma

<!--
  Incluir cuando la feature tenga requisitos explícitos de compatibilidad.

  No generes una matriz completa de navegadores/dispositivos
  sin un requisito que la justifique.
-->

| Plataforma   | Versión     | Resultado                   |
| ------------ | ----------- | --------------------------- |
| `[PLATFORM]` | `[VERSION]` | [Pending / Passed / Failed] |

## Validación automatizada

<!--
  Incluye los comandos principales para ejecutar las pruebas relacionadas
  con esta feature.

  No enumeres todos los test cases.
-->

### Unit

```bash
[UNIT_TEST_COMMAND]
```

### Integration

```bash
[INTEGRATION_TEST_COMMAND]
```

### Contract

```bash
[CONTRACT_TEST_COMMAND]
```

### E2E

```bash
[E2E_TEST_COMMAND]
```

<!--
  Elimina los niveles que no apliquen.
-->

## Validación completa

<!--
  Cuando exista un comando capaz de ejecutar toda la validación relevante,
  inclúyelo aquí.
-->

```bash
[FULL_VALIDATION_COMMAND]
```

**Resultado esperado**:

* Todos los tests requeridos pasan.
* No existen errores bloqueantes.
* Los escenarios `QS-xxx` incluidos en alcance son verificables.
* Los gates aplicables de `constitution.md` se cumplen.

## Limpieza

<!--
  Incluye únicamente pasos necesarios para devolver el entorno
  a un estado limpio después de la validación.
-->

```bash
[CLEANUP_COMMAND]
```

**Elimina/restaura**:

* [TEST DATA]
* [TEMPORARY RESOURCE]

## Resolución rápida de problemas

<!--
  Incluye solo problemas previsibles y directamente relacionados
  con la ejecución de esta feature.

  No conviertas esta sección en un FAQ general del proyecto.
-->

### [PROBLEM]

**Síntoma**: [SYMPTOM]

**Causa probable**: [CAUSE]

**Solución**:

```bash
[FIX_COMMAND]
```

### [PROBLEM]

**Síntoma**: [SYMPTOM]

**Solución**: [SOLUTION]

## Resultado de validación

<!--
  Completar tras ejecutar el quickstart.

  Passed:
  Todos los escenarios obligatorios y gates aplicables se cumplen.

  Passed with findings:
  La feature es válida pero existen observaciones no bloqueantes.

  Failed:
  Existe al menos un incumplimiento bloqueante.
-->

**Estado**: [RESULT] # Pending | Passed | Passed with findings | Failed

**Escenarios ejecutados**: [COUNT]

**Escenarios superados**: [COUNT]

**Escenarios fallidos**: [COUNT]

**Bloqueos**: [COUNT]

## Hallazgos

<!--
  Registra únicamente incidencias o diferencias relevantes encontradas
  durante la ejecución.

  Referencia QS-xxx, FR-xxx o SC-xxx cuando sea posible.
-->

* **[QS-xxx]**: [Finding, impact and required action]

## Matriz de trazabilidad

<!--
  Esta matriz permite verificar que los escenarios principales de quickstart
  cubren el comportamiento que se pretende validar.

  No debe sustituir la trazabilidad de tasks.md.
-->

| Quickstart | Historia | Requisitos       | Criterios de éxito |
| ---------- | -------- | ---------------- | ------------------ |
| `QS-001`   | [US1]    | [FR-001, FR-002] | [SC-001]           |
| `QS-002`   | [US2]    | [FR-003]         | [SC-002]           |

## Validación de completitud

<!--
  Antes de considerar quickstart.md finalizado:

  - Los prerrequisitos son suficientes y reproducibles.
  - Los comandos son ejecutables.
  - Los escenarios principales de la feature están cubiertos.
  - El MVP puede validarse de extremo a extremo.
  - Los resultados esperados son objetivos.
  - Los escenarios tienen trazabilidad con spec.md.
  - No se introducen requisitos nuevos.
  - No se depende de conocimiento no documentado.
-->

* [ ] Los prerrequisitos están documentados.
* [ ] La configuración necesaria está documentada.
* [ ] Los comandos utilizan rutas y parámetros reales.
* [ ] La aplicación puede iniciarse siguiendo únicamente esta guía.
* [ ] El MVP puede validarse de extremo a extremo.
* [ ] Los escenarios críticos están cubiertos.
* [ ] Los casos límite relevantes están cubiertos.
* [ ] Los contratos relevantes pueden validarse.
* [ ] Los resultados esperados son objetivos y verificables.
* [ ] Todos los escenarios tienen trazabilidad suficiente.
* [ ] La guía es coherente con `spec.md`.
* [ ] La guía es coherente con `plan.md`.
* [ ] La guía respeta `constitution.md`.
* [ ] No se han introducido requisitos nuevos.
* [ ] No existen pasos que dependan de conocimiento implícito.

## Notas

* Los escenarios de validación utilizan identificadores `QS-xxx`.
* El contenido documental se redacta en castellano.
* Los parámetros, comandos, rutas, nombres de ficheros, identificadores y elementos técnicos se mantienen en inglés.
* Utiliza datos ficticios en ejemplos y nunca incluyas secretos reales.
* Mantén esta guía centrada en la validación, no en explicar la arquitectura.
* Prioriza el recorrido P1/MVP antes de escenarios secundarios.
* No dupliques pruebas automatizadas si no aportan valor como validación end-to-end.
* Cada paso debe poder ejecutarse sin necesidad de interpretar qué pretendía el autor.
