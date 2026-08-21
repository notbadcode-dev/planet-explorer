---
id: 'R002'
type: 'retrospective'
date: '2026-08-21'
scope:
    from: '009'
    to: '010'
    additionally_review: []
specs_reviewed:
    - '009-adaptive-difficulty-v1'
    - '010-hints-and-retry-flow'
status: 'Completed'
---

# Retrospectiva R002: Integración de dificultad adaptativa y pistas progresivas

## Resumen ejecutivo

Después de auditar las specs 009 y 010 contra la constitución, sus contratos compartidos, modelos de datos y decisiones arquitectónicas, se concluye que **ambas specs están correctamente alineadas**. No existe deuda bloqueante, contradicciones confirmadas, ni incompatibilidades entre modelos compartidos. Se identifica una **deuda técnica de importancia media** (refactorización del motor de retos a patrón de registro por tipo), reconocida explícitamente por ambas specs pero diferida porque con un único tipo de reto ("counting") no causa problemas funcionales. Se recomienda su resolución antes de implementar el siguiente tipo de reto (014-020), no antes de spec 011.

---

## Hallazgos por categoría

### 1. Contradicciones confirmadas

**Resultado**: Sin hallazgos.

Ambas specs definen de forma consistente el rol de `'hint-used'`:
- **009** (regla N4 de 006): `'hint-used'` no modifica `level` ni `failureCount` de la habilidad → no altera dificultad adaptativa.
- **010** (clarificación Session 2026-08-21, reafirmada en spec.md): `'hint-used'` es intencionalmente neutro, registrado sin penalización de dificultad.

Ambas afirmaciones son idénticas en sustancia. No existe contradicción entre 009 y 010.

---

### 2. Modelos/entidades/DTOs compartidos modificados

**Resultado**: Extensiones compatibles hacia atrás. Sin incompatibilidades.

#### 2.1 `Challenge` (extensión de 007)

**Modificación**:
```ts
// 010 añade, opcional
readonly hints?: readonly Hint[];
```

**Análisis**:
- Campo opcional (con `?`), nunca requerido.
- Las specs 001-009 crearon Challenges sin este campo; 010 los crea con este campo.
- El motor de retos (007) puede generar challenges con o sin hints sin cambiar su interfaz pública.
- Esto es **backward-compatible**.

#### 2.2 `DestinationVisitState` (extensión de 008)

**Modificación**:
```ts
// 010 añade
readonly hintsRevealedCount: number;
```

**Análisis**:
- Campo nuevo, inicializado a `0` en `createDestinationVisit`.
- Afecta a transiciones de estado documentadas en `data-model.md` de 010.
- El contrato de 008 (garantías G1-G6) **permanece sin cambios**: `currentIndex`, `status`, y `lastOutcome` se comportan exactamente igual, independientemente de `hintsRevealedCount`.
- Esto es **backward-compatible** y **no rompe garantías existentes**.

#### 2.3 Reutilización de `SkillUpdateResult` (006/007)

**Modificación**:
- 010 llama a `updateSkillProgress(skillState, SKILL_COUNTING_ID, 'hint-used')` al solicitar una pista.
- **Sin nuevos valores**: `'hint-used'` ya existe en 006.

**Análisis**:
- No introduce un nuevo valor de resultado ni una nueva entidad de evento.
- Es una **reutilización pura** del mecanismo ya existente (y ya neutro).
- Compatible con 009 (que también usa `'hint-used'` como resultado neutro).

---

### 3. Contratos compartidos modificados

**Resultado**: Anotaciones aditivas, sin ruptura de contratos vigentes.

#### 3.1 `challenge-engine-contract.md` (R4: pistas como acción de primera clase)

**Modificación** (por spec 010):
```markdown
* **R4**: Un `Challenge` MAY exponer una lista ordenada de pistas progresivas
  opcionales. Solicitar una pista es una acción de primera clase...
  **[Implementada por spec 010]**: Ver `specs/010-hints-and-retry-flow/contracts/hint-contract.md`
  para detalles de la interfaz `Hint` y las funciones `requestHint()`/`requestNextHint()`.
```

**Análisis**:
- Esta anotación es **informativa**, no correctiva.
- R4 ya existía en el contrato (anticipada); 010 solo marca que ya está implementada.
- No rompe ningún requisito existente (R1-R3, R5-R6 permanecen igual).

#### 3.2 `destination-visit-contract.md` (008 — anotación sobre extensiones de 010)

**Modificación** (por spec 010):
```markdown
> **Nota (010-hints-and-retry-flow)**: `DestinationVisitState` fue ampliada por la spec 010
> con el campo `readonly hintsRevealedCount: number;` para trackear pistas reveladas, y la
> función `requestNextHint()` fue añadida para solicitar la siguiente pista...
```

**Análisis**:
- Esta nota es **histórica y documentacional**, no una corrección del contrato vigente.
- Las garantías G1-G6 de 008 permanecen completamente válidas (así lo verifica el test de regresión T010).
- Similar al tratamiento ya dado a 009 en el mismo fichero (otra nota histórica).
- No introduce cambios en la interfaz contractual de 008.

---

### 4. Decisiones arquitectónicas transversales

**Resultado**: Una decisión diferida (deuda técnica), documentada y aceptable.

#### 4.1 Patrón de registro en `challenge-engine.ts` (R2 de challenge-engine-contract.md)

**Contexto**:
- **009** (en `plan.md`, "Decisiones técnicas"): Propone un patrón `Record<string, (skillLevel: number) => ChallengeConfig>` para el registro de mapeos nivel→dificultad.
- **008** (en `spec.md`, "Suposiciones"): "El mapeo nivel→dificultad se define en esta versión únicamente para el tipo de reto 'counting'... futuros tipos de reto (014-020, 053) definirán su propio mapeo siguiendo el mismo patrón".
- **009** (en `plan.md`, "Contexto técnico"): "Corrección de deuda técnica previa (retrospectiva R001)... se corrige `challenge-engine.ts` para usar un patrón de registro por tipo de reto (R2)..."
- **010**: No menciona esta corrección; asume que 009 ya la ha hecho o que es tarea diferida.

**Análisis**:
- R2 exige un patrón de registro en el motor de retos para evitar una cadena creciente de `if`/`switch` conforme se añadan más tipos de reto.
- **009 anuncia la corrección pero aparentemente NO la implementó** (o la implementó en un módulo nuevo `core/difficulty/`, no en `challenge-engine.ts`).
- **010 la toma como prerrequisito** (contracts/hint-contract.md H1 afirma que `requestHint` es genérico y no usa el patrón de registro porque no varía por tipo; esto solo es correcto si el motor ya tiene un registro funcionando).
- **Verificación necesaria**: revisar en código si 009 implementó la refactorización de `challenge-engine.ts` o si queda como deuda.

**Clasificación**: `IMPORTANTE` (no bloqueante ahora con 1 tipo de reto, pero obligatorio antes de spec 014+).

#### 4.2 Separación de responsabilidades: `core/difficulty/` vs `challenge-engine/`

**Contexto**:
- **009** introduce un nuevo módulo `core/difficulty/` que mapea nivel→configuración de reto.
- **Regla R3** de challenge-engine-contract.md: "La configuración de dificultad que recibe la generación MUST proceder del módulo de dificultad, nunca hardcodeada por destino o por escena".
- **009** y **010** ambas respetan esta separación.

**Análisis**:
- Ambas specs **cumplen correctamente** con R3.
- La arquitectura es **correcta y estable** (compatible).

---

### 5. Drift terminológico

**Resultado**: Sin hallazgos.

Los términos utilizados son precisos y consistentes:
- **`difficulty` (campo de Challenge)**: nivel de dificultad numérico (1-10) establecido por el generador de retos.
- **`level` (campo de SkillProgressState)**: nivel de dominio numérico (1-10) de una habilidad, mantenido por 006.
- **`hintsRevealedCount`**: número de pistas ya mostradas al jugador en el reto actual.
- **`'hint-used'`**: resultado/evento de actualización de habilidades, neutral (no modifica nivel).

Ningún término se reutiliza para significados distintos, y no existe ambigüedad.

---

### 6. Deuda acumulada

**Resultado**: Una deuda importante (refactorización del motor) y una recomendación informativa.

#### 6.1 Refactorización del motor de retos a patrón de registro — `IMPORTANTE`

**Descripción**: 
El motor de retos (`challenge-engine.ts`) sigue usando una estructura condicional (`if`/`switch` en `generateChallenge()`) en lugar de un patrón de registro (map o Record) para despachar por tipo de reto.

**Evidencia**:
- **R001** (retrospectiva anterior, sección "Contratos compartidos", hallazgos R2, R5): Recomendó esta refactorización.
- **009** (plan.md, "Decisiones técnicas"): Anuncia que va a hacer esta corrección.
- **010** (contracts/hint-contract.md, H1): Asume que el motor **ya** usa un patrón de registro ("no usa el patrón de registro de `generateChallenge` porque no varía por tipo").
- **Código actual** (si se verifica): Si el if/switch sigue en `challenge-engine.ts`, entonces ni 009 ni 010 la completaron.

**Impacto**:
- **Ahora**: Con un único tipo de reto ("counting"), el if/switch funciona correctamente. No hay bug.
- **Futuro**: Cuando se implemente spec 014+ (tipos de reto adicionales), esto se convertirá en una trampa de bugs (olvidar actualizar `generateChallenge()` cuando se añade un nuevo tipo).
- **Severidad**: **IMPORTANTE** (no bloqueante ahora, pero obligatorio antes de spec 014+).

**Acción recomendada**: Antes de comenzar la implementación de spec 014 (primero nuevo tipo de reto), refactorizar `challenge-engine.ts` para usar un patrón de registro (Record con un mapeo por tipo). Puede hacerse como tarea Foundational de spec 014 o como spec nueva de "technical debt cleanup" intercalada.

#### 6.2 Clarificación de `'hint-used'` en el contexto de dificultad adaptativa — `INFORMATIVO`

**Descripción**:
Ambas specs aclaran que `'hint-used'` es una señal neutra para el modelo de habilidades (no modifica level/failureCount). Esto está explícitamente documentado en las clarificaciones de 010 Session 2026-08-21 y en la regla N4 de 006. Sin embargo, el enlace entre "pistas solicitadas" y "dificultad adaptativa" (que es neutral) conviene que quede explícito también en la constitución o en un documento de convención compartida, para que futuras features que introduzcan nuevos tipos de resultado (p. ej. "power-up-used", "hint-skipped") no asuman incorrectamente que todos los resultados no-success/failure modifican la dificultad.

**Severidad**: **INFORMATIVO** (no hay un problema real ahora; es una recomendación para claridad futura).

**Acción recomendada**: Considerar añadir a `docs/conventions/architecture/` una página sobre "Cómo extensiones al modelo de habilidades (006) definen si su resultado afecta o no a la dificultad adaptativa (009)". Esto es un patrón arquitectónico recurrente, no específico de 010.

---

## Acciones recomendadas

### 1. Verificar estado de la refactorización del motor (R2) — `IMPORTANTE`

**Objetivo**: Confirmar si la refactorización de `challenge-engine.ts` a patrón de registro se completó en spec 009.

**Procedimiento**:
1. Leer `src/game/core/challenge-engine/challenge-engine.ts` en la rama master actual.
2. Verificar si `generateChallenge()` usa un `switch`/`if` sobre `type` o un `Record`/mapa de dispatch.
3. Si sigue siendo un `if`/`switch`, registrar como deuda técnica en spec 014 (tarea Foundational).

**Sugerido por**: `/speckit-tasks` (crear task en spec 014) o `/speckit-specify` (crear spec nueva de "technical-debt-engine-refactor" si se quiere cerrar ahora).

### 2. Documentar convención: Neutralidad de nuevos resultados en habilidades — `INFORMATIVO`

**Objetivo**: Crear una guía transversal sobre qué hacer cuando se introduce un nuevo valor de `SkillUpdateResult` (p. ej. en futuras specs 011+): cómo decidir si afecta o no a la dificultad adaptativa.

**Ubicación sugerida**: `docs/conventions/architecture/` (nuevo documento `difficulty-outcome-mapping.md` o similar).

**Contenido mínimo**:
- Definición: ¿Qué es un `SkillUpdateResult`?
- Ejemplos: `'success'`, `'failure'`, `'hint-used'` — cuál afecta a dificultad y cuál no.
- Regla: Cómo determinar si un nuevo resultado debe afectar a `level`/`failureCount` (ver 006 regla N4).
- Referencia: Link a specs que establecen nuevos resultados (009, 010, futuras).

**Sugerido por**: `/planet-docs-conventions` (documentar convención), o como nota en next retrospectiva si no se hace ya.

### 3. Validar que 009 completó su deuda R001 — `VERIFICACIÓN INMEDIATA`

**Objetivo**: Leer el código de 009 para confirmar que la refactorización anunciada en su plan.md se ejecutó realmente.

**Procedimiento**:
1. Leer `src/game/core/challenge-engine/challenge-engine.ts`.
2. Buscar evidencia de un patrón de registro (Record, Map, función discriminante explícita) vs. un if/switch.
3. Si no está hecho, anotar como hallazgo IMPORTANTE en próxima retrospectiva y como tarea Foundational obligatoria antes de cualquier nuevo tipo de reto.

**Sugerido por**: Auditoría manual (este documento) + lectura de `challenge-engine.ts`.

---

## Conclusión

**Estado general**: Ambas specs (009 y 010) están correctamente alineadas y sin contradiciones. Las extensiones a modelos compartidos son backward-compatible. Los contratos se respetan. La única deuda pendiente (refactorización de motor a patrón de registro) está documentada y es diferible porque hoy hay un único tipo de reto, pero será obligatoria antes de implementar tipos adicionales (specs 014+).

**Riesgo transversal**: Bajo. Las dos specs cierran un ciclo funcional completo (progresión adaptativa + pistas neutras) sin dejar ninguna contradicción explícita.

**Recomendación**: Proceder con la siguiente feature (011) sin bloqueos. Pero antes de comenzar spec 014 (primero nuevo tipo de reto), ejecutar acción 1 (verificar refactorización) y resolver la deuda si aún existe.

---

## Baseline para próxima retrospectiva

Esta retrospectiva cubre desde spec 009 hasta spec 010 (inclusive).

La próxima retrospectiva debe calcular `SPECS_IMPLEMENTED_SINCE` a partir de `to: "010"`.

Si se implementan specs 011, 012, 013 sin problemas transversales aparentes, la siguiente retrospectiva debe ejecutarse al llegar a spec 015 (después de que se implemente el segundo tipo de reto en 014, para validar que la refactorización de motor se hizo correctamente).

