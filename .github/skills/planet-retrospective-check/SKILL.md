---
name: planet-retrospective-check
description: Evalúa, tras cerrar una feature de spec-kit, si el proyecto necesita una retrospectiva transversal de specs. Analiza número de specs implementadas desde la última retrospectiva, cambios en constitution.md, dependencias, contratos, modelos compartidos, decisiones arquitectónicas y posibles contradicciones entre specs. No modifica ficheros: devuelve únicamente NOT_REQUIRED, RECOMMENDED o REQUIRED con motivos y alcance recomendado. Use after `planet-finish-spec`, when the user asks whether a spec retrospective is needed, or before starting a new feature if consistency drift is suspected.
---

# Evaluar necesidad de retrospectiva (`planet-retrospective-check`)

Esta skill actúa como **quality gate transversal** del sistema de specs.

Su responsabilidad es exclusivamente determinar si el estado acumulado del proyecto justifica ejecutar una retrospectiva mediante `planet-spec-retrospective`.

**No realiza la retrospectiva, no modifica documentación, no crea specs, no hace commits y no ejecuta operaciones git destructivas.**

Debe ser una evaluación rápida, reproducible y basada prioritariamente en señales observables del repositorio.

## Cuándo usar esta skill

- Después de cerrar correctamente una feature mediante `planet-finish-spec`.
- Cuando el usuario pregunta si ya corresponde hacer una retrospectiva de specs.
- Antes de comenzar una nueva feature si existen indicios de drift entre specs.
- Después de un cambio significativo en `constitution.md`.
- Cuando una nueva feature haya modificado conceptos, contratos, modelos o decisiones utilizadas por otras specs.

Tras cada cierre mediante `planet-finish-spec`, esta evaluación es **obligatoria**, aunque el resultado pueda ser `NOT_REQUIRED`.

## Objetivo

Determinar uno de estos tres estados:

- `NOT_REQUIRED`: no existen señales suficientes para justificar una retrospectiva.
- `RECOMMENDED`: existen señales de drift o impacto transversal que hacen recomendable una retrospectiva, pero no existe un criterio obligatorio.
- `REQUIRED`: se ha alcanzado un criterio que obliga a realizar una retrospectiva antes de seguir acumulando specs.

## Principios

1. **No inventar problemas.** Solo considerar señales respaldadas por el repositorio.
2. **Preferir reglas objetivas.** Los criterios cuantificables tienen prioridad sobre inferencias.
3. **No confundir dependencia con contradicción.** Que dos specs estén relacionadas no significa que exista drift.
4. **No auditar profundamente.** Esta skill detecta la necesidad de retrospectiva; `planet-spec-retrospective` realiza la auditoría.
5. **Evitar burocracia.** Si no existen señales reales, devolver `NOT_REQUIRED`.
6. **Fallback periódico.** Incluso sin señales visibles, el proyecto debe someterse periódicamente a una revisión transversal para detectar drift silencioso.

---

## Fuentes que MUST inspeccionarse

Antes de emitir un resultado, identifica y revisa, cuando existan:

1. `.specify/memory/constitution.md` o la ubicación real de `constitution.md`.
2. `specs/*/spec.md`.
3. Front matter de:
    - `spec.md`
    - `plan.md`
    - `tasks.md`
4. Campos relevantes:
    - `status`
    - `created`
    - `updated`
    - `dependencies`
    - `related_specs`
    - `version`
    - cualquier metadata equivalente documentada por los templates.
5. Historial de retrospectivas del proyecto, si existe.
6. `contracts/`, `data-model.md`, `research.md` y otros artefactos únicamente cuando la feature recién cerrada indique impacto sobre ellos.
7. Historial git necesario para determinar cambios de `constitution.md` o del material transversal desde la última retrospectiva.

No es necesario leer exhaustivamente todas las implementaciones de código para este check.

---

## Identificar retrospectivas anteriores

Busca retrospectivas en este orden:

1. Ubicación formal definida por `planet-spec-retrospective`, si existe.
2. Directorios como:
    - `specs/reviews/`
    - `specs/retrospectives/`
    - `.specify/reviews/`
3. Metadata o documentos cuyo tipo indique explícitamente una retrospectiva global de specs.

No consideres una revisión individual de una única feature como retrospectiva transversal.

Determina:

```
LAST_RETROSPECTIVE
LAST_RETROSPECTIVE_DATE
LAST_RETROSPECTIVE_MAX_SPEC
SPECS_IMPLEMENTED_SINCE
```

Si nunca ha existido una retrospectiva:

```
LAST_RETROSPECTIVE = none
```

---

## Qué specs cuentan

Para los criterios numéricos, cuenta únicamente specs cuyo estado final sea:

```
status: "Implemented"
```

No cuentan:

- `Draft`
- `In Review`
- `Approved`
- `In Progress`
- `Deprecated`
- retrospectivas
- documentos auxiliares
- entradas de `specs_pending/`

---

## Reglas de decisión

Las reglas se evalúan en orden de severidad.

Si existe al menos una condición `REQUIRED`, el resultado final es `REQUIRED`.

Si no existe ninguna `REQUIRED` pero sí alguna `RECOMMENDED`, devuelve `RECOMMENDED`.

En cualquier otro caso devuelve `NOT_REQUIRED`.

---

### REQUIRED

#### R1. Primera retrospectiva pendiente

Si nunca se ha ejecutado una retrospectiva transversal y existen **5 o más specs implementadas**:

```
REQUIRED
reason: no_previous_retrospective
```

#### R2. Demasiadas specs desde la última retrospectiva

Si existen **5 o más specs implementadas** desde la última retrospectiva:

```
REQUIRED
reason: retrospective_interval_exceeded
```

Este criterio actúa como protección frente a drift silencioso.

#### R3. Constitution modificada significativamente

Si `constitution.md` ha cambiado después de la última retrospectiva y el cambio afecta:

- principios obligatorios;
- arquitectura;
- testing;
- contratos;
- estructura de specs;
- nomenclatura obligatoria;
- workflow;
- Definition of Done;
- reglas MUST/SHOULD/MUST NOT;
- cualquier norma aplicable retroactivamente a specs existentes.

Resultado:

```
REQUIRED
reason: constitution_changed
```

Cambios puramente tipográficos, ortográficos o de formato no activan esta regla.

#### R4. Contradicción confirmada entre specs

Si existe evidencia explícita de que dos o más specs implementadas establecen requisitos o decisiones incompatibles entre sí:

```
REQUIRED
reason: cross_spec_conflict
```

Debe poder indicarse qué specs están implicadas.

No conviertas una mera sospecha en contradicción confirmada.

#### R5. Nueva spec invalida decisiones anteriores

Si la última spec implementada reemplaza, invalida o hace incorrectas decisiones documentadas en varias specs anteriores:

```
REQUIRED
reason: previous_decisions_invalidated
```

Especialmente si afecta a:

- dominio compartido;
- contratos públicos;
- persistencia;
- seguridad;
- autenticación/autorización;
- arquitectura global;
- reglas de negocio reutilizadas.

---

## RECOMMENDED

Solo se evalúan estas reglas cuando ninguna regla `REQUIRED` se haya activado.

### W1. Impacto sobre múltiples specs

Si la última spec afecta significativamente a **3 o más specs anteriores**:

```
RECOMMENDED
reason: broad_cross_spec_impact
```

Las relaciones meramente documentales no cuentan.

### W2. Cambio en modelos compartidos

Si se han modificado entidades, value objects, DTOs, esquemas o conceptos de dominio usados por varias features:

```
RECOMMENDED
reason: shared_model_changed
```

### W3. Cambio en contratos compartidos

Si se introducen o modifican contratos consumidos por varias features:

```
RECOMMENDED
reason: shared_contract_changed
```

Incluye, según el proyecto:

- APIs;
- OpenAPI;
- eventos;
- interfaces públicas;
- comandos;
- DTOs compartidos;
- protocolos;
- formatos persistidos.

### W4. Decisión arquitectónica transversal

Si la feature introduce una decisión que condiciona cómo deberán diseñarse features posteriores o cómo deberían entenderse algunas anteriores:

```
RECOMMENDED
reason: cross_cutting_architecture_change
```

### W5. Divergencia terminológica observable

Si distintas specs utilizan nombres distintos para el mismo concepto o el mismo nombre para conceptos incompatibles:

```
RECOMMENDED
reason: terminology_drift
```

Solo debe activarse cuando existan ejemplos concretos.

### W6. Acumulación de excepciones

Si desde la última retrospectiva se han acumulado varias:

- excepciones a Constitution;
- warnings de convergencia;
- decisiones temporales;
- TODOs arquitectónicos;
- deuda documental explícita.

Resultado:

```
RECOMMENDED
reason: accumulated_exceptions
```

---

## NOT_REQUIRED

Devuelve `NOT_REQUIRED` cuando:

- no existe ningún criterio `REQUIRED`;
- no existe ningún criterio `RECOMMENDED`;
- el número de specs desde la última retrospectiva está por debajo del límite;
- la nueva feature es local y no altera decisiones compartidas;
- los cambios recientes son compatibles con Constitution y con las specs existentes.

No busques motivos adicionales únicamente para evitar devolver `NOT_REQUIRED`.

---

## Cálculo del alcance recomendado

La skill debe indicar qué specs debería revisar `planet-spec-retrospective`.

### Primera retrospectiva

Si nunca se ha realizado ninguna:

```
scope:
  from: first_implemented_spec
  to: latest_implemented_spec
```

Ejemplo:

```
scope:
  from: "001"
  to: "007"
```

### Retrospectivas posteriores

Revisa todas las specs implementadas desde la última retrospectiva y, además, las specs anteriores que estén relacionadas o potencialmente afectadas.

Ejemplo:

```
scope:
  from: "008"
  to: "012"
  additionally_review:
    - "003"
    - "005"
```

No incluyas todas las specs históricas por defecto si no existe motivo.

---

## Resultado obligatorio

Devuelve siempre un bloque estructurado equivalente a:

```
retrospective_check:
  result: REQUIRED | RECOMMENDED | NOT_REQUIRED
  evaluated_after: "007-feature-name"
  last_retrospective: null
  implemented_specs_total: 7
  implemented_specs_since_last_retrospective: 7

  reasons:
    - code: no_previous_retrospective
      evidence: "Existen 7 specs Implemented y no se ha encontrado ninguna retrospectiva transversal."

  scope:
    from: "001"
    to: "007"
    additionally_review: []

  recommended_action: planet-spec-retrospective
```

Para `NOT_REQUIRED`:

```
retrospective_check:
  result: NOT_REQUIRED
  evaluated_after: "008-feature-name"
  last_retrospective: "R001"
  implemented_specs_total: 8
  implemented_specs_since_last_retrospective: 1
  reasons: []
  scope: null
  recommended_action: null
```

---

## Evidencias

Cada motivo `REQUIRED` o `RECOMMENDED` debe incluir evidencia breve y verificable.

Correcto:

```
- code: shared_contract_changed
  evidence: "007-payment-flow modifica PaymentDto, utilizado también por 003-orders, 004-checkout y 006-history."
```

Incorrecto:

```
- code: shared_contract_changed
  evidence: "Parece que podría haber cambios importantes."
```

No uses lenguaje especulativo para justificar un resultado.

---

## Comportamiento según resultado

### NOT_REQUIRED

Informa brevemente:

```
Retrospectiva: NOT_REQUIRED

No se han detectado criterios que justifiquen una retrospectiva en este momento.
```

No propongas crear una retrospectiva por defecto.

### RECOMMENDED

Informa:

1. que la retrospectiva es recomendable;
2. qué señales la justifican;
3. qué alcance debería cubrir;
4. ofrece ejecutar `planet-spec-retrospective`.

No la ejecutes automáticamente.

### REQUIRED

Informa claramente que se ha alcanzado un criterio obligatorio.

Recomienda ejecutar `planet-spec-retrospective` **antes de comenzar otra feature**, salvo que el usuario indique explícitamente continuar.

No ejecutes automáticamente la retrospectiva sin confirmación del usuario.

---

## Integración con `planet-finish-spec`

`planet-finish-spec` debe ejecutar esta skill después de completar correctamente el cierre de la feature.

Flujo esperado:

```
/speckit-converge
        ↓
planet-finish-spec
        ↓
feature cerrada
        ↓
planet-retrospective-check
        ↓
 ┌───────────────┬─────────────────┬───────────────┐
 │ NOT_REQUIRED  │ RECOMMENDED     │ REQUIRED      │
 └───────────────┴─────────────────┴───────────────┘
                         ↓
               planet-spec-retrospective
               solo si el usuario acepta
```

Un fallo o advertencia de esta skill **no debe deshacer un cierre de feature ya completado**.

---

## Límites

Esta skill MUST NOT:

- modificar specs;
- modificar `constitution.md`;
- modificar código;
- crear una retrospectiva;
- crear nuevas tareas;
- cambiar estados;
- ejecutar merges;
- hacer commits;
- hacer push;
- borrar ramas;
- redefinir las reglas de Constitution;
- corregir automáticamente contradicciones.

Su única salida es una **decisión razonada sobre la necesidad de retrospectiva**.

---

## Caso inicial del proyecto

Si el proyecto tiene actualmente specs `001` a `007` implementadas y nunca se ha realizado una retrospectiva:

```
retrospective_check:
  result: REQUIRED
  evaluated_after: "007"
  last_retrospective: null
  implemented_specs_total: 7
  implemented_specs_since_last_retrospective: 7

  reasons:
    - code: no_previous_retrospective
      evidence: "El proyecto acumula 7 specs Implemented sin ninguna retrospectiva transversal previa."

    - code: retrospective_interval_exceeded
      evidence: "Se supera el máximo de 5 specs implementadas sin retrospectiva."

  scope:
    from: "001"
    to: "007"
    additionally_review: []

  recommended_action: planet-spec-retrospective
```

---

## Referencias cruzadas

- `.github/skills/planet-finish-spec/SKILL.md` — invoca esta evaluación después del cierre de cada feature.
- `.github/skills/planet-spec-retrospective/SKILL.md` — realiza la auditoría transversal cuando esta skill devuelve `RECOMMENDED` o `REQUIRED`.
- `.github/skills/speckit-converge/SKILL.md` — valida convergencia entre especificación, tareas e implementación antes del cierre.
- `.specify/memory/constitution.md` — fuente normativa principal del proyecto.
- `.specify/templates/spec-template.md`
- `.specify/templates/plan-template.md`
- `.specify/templates/tasks-template.md`
