---
name: planet-spec-retrospective
description: Ejecuta la auditoría transversal de las specs implementadas en el alcance (`scope`) indicado por `planet-retrospective-check`. Detecta contradicciones confirmadas, cambios en modelos/contratos compartidos, decisiones arquitectónicas transversales, drift terminológico y deuda acumulada; produce un informe de retrospectiva en `specs/retrospectives/`. No modifica specs, plan.md, tasks.md ni la constitution — solo escribe el informe y sugiere las vías de acción (nueva spec, enmienda de constitution, actualización de docs). Use after `planet-retrospective-check` returns RECOMMENDED or REQUIRED and the user confirms, or when the user explicitly asks to run a cross-spec retrospective/audit.
---

# Auditoría transversal de specs (`planet-spec-retrospective`)

Esta skill **ejecuta** la retrospectiva que `planet-retrospective-check` decide que hace falta. No sustituye a esa skill: al contrario, depende de su `scope` (o de uno equivalente indicado por el usuario) para saber qué specs auditar.

Es una auditoría de **lectura + informe**, no una herramienta de corrección automática. Cualquier cambio real (enmendar una spec, tocar la constitution, crear una spec nueva) queda como una acción **sugerida**, nunca ejecutada por esta skill.

## Cuándo usar esta skill

- `planet-retrospective-check` devolvió `RECOMMENDED` o `REQUIRED` y el usuario confirma que quiere ejecutarla ahora (nunca se dispara sola).
- El usuario pide explícitamente "haz la retrospectiva/auditoría de specs" o equivalente, con o sin haber pasado antes por `planet-retrospective-check`.

## Entradas

- **`scope`** (`from`, `to`, `additionally_review`): tómalo del resultado de `planet-retrospective-check` si está disponible en la sesión actual.
    - Si no hay un `scope` reciente, pregunta al usuario o derívalo tú mismo: `from` = primera spec con `status: "Implemented"`, `to` = la más reciente con ese mismo estado.
- Si el usuario pide una retrospectiva "parcial" (solo unas specs concretas), respeta ese alcance explícito en vez de recalcularlo.

## Precondiciones

1. Rama actual: normalmente `develop` (donde viven las specs ya cerradas vía `planet-finish-spec`). Si el usuario está en otra rama, confírmalo antes de continuar — no cambies de rama sin avisar.
2. Árbol de trabajo limpio, salvo el nuevo fichero de retrospectiva que esta misma skill va a crear.

## Proceso

### 1. Recopilar fuentes

Para cada spec dentro de `scope.from`..`scope.to` y cada id en `scope.additionally_review`:

- `specs/<id>/spec.md` (siempre).
- `specs/<id>/plan.md`, `data-model.md`, `contracts/`, `research.md` — solo cuando el análisis de un hallazgo concreto lo requiera (no hace falta leer exhaustivamente cada artefacto de cada spec si no hay señal de impacto).

Lee también `.specify/memory/constitution.md` completa (o al menos las secciones relevantes a los hallazgos que vayan apareciendo) para contrastar las specs contra las reglas vigentes.

### 2. Analizar por categoría

Usa las mismas categorías que `planet-retrospective-check` usó para recomendar la retrospectiva, pero ahora con evidencia verificada, no solo la señal que disparó el check:

- **Contradicciones confirmadas** entre specs (cita el requisito/decisión exacto de cada spec implicada).
- **Modelos/entidades/DTOs compartidos** modificados de forma incompatible entre features.
- **Contratos compartidos** (APIs, eventos, formatos persistidos) modificados de forma incompatible.
- **Decisiones arquitectónicas transversales** que condicionan specs futuras o reinterpretan specs anteriores.
- **Drift terminológico**: mismo concepto con nombres distintos, o mismo nombre para conceptos distintos — solo con ejemplos concretos citables.
- **Deuda acumulada**: excepciones a la constitution, warnings de convergencia sin resolver, TODOs arquitectónicos, decisiones temporales documentadas.

No inventes hallazgos para justificar el informe: si una categoría no tiene evidencia, se reporta como "sin hallazgos".

### 3. Clasificar severidad

Para cada hallazgo real:

- **Bloqueante**: exige una nueva spec, una enmienda de la constitution, o corrección antes de seguir acumulando features (p. ej. contradicción confirmada, contrato compartido roto).
- **Importante**: conviene resolverlo pronto, pero no bloquea la siguiente feature.
- **Informativo**: deja constancia (p. ej. drift terminológico menor) sin exigir acción inmediata.

### 4. Redactar el informe

Ubicación canónica: `specs/retrospectives/R<NNN>-<slug-fecha>.md` (numeración incremental; mira el último `R###` existente en ese directorio — créalo si no existe).

Front matter:

```yaml
---
id: 'R<NNN>'
type: 'retrospective'
date: 'YYYY-MM-DD'
scope:
    from: '<primera-spec>'
    to: '<ultima-spec>'
    additionally_review: []
specs_reviewed:
    - '<id>'
status: 'Completed'
---
```

Cuerpo del informe:

1. **Resumen ejecutivo**: 2-4 frases con el veredicto general (¿el proyecto está razonablemente consistente, o hay deuda relevante?).
2. **Hallazgos por categoría**: uno por categoría de la sección 2, con severidad, specs implicadas y evidencia citada (nada especulativo).
3. **Acciones recomendadas**: una lista con, para cada hallazgo Bloqueante o Importante, la vía de acción sugerida (ver sección 5) — sin ejecutarla.
4. **Baseline para la próxima retrospectiva**: deja constancia explícita de `to` (última spec revisada), para que la próxima ejecución de `planet-retrospective-check` calcule `SPECS_IMPLEMENTED_SINCE` a partir de aquí.

### 5. Sugerir, no ejecutar

Para cada acción recomendada, indica el comando/skill correspondiente sin invocarlo tú mismo:

- Hallazgo requiere nueva funcionalidad o corrección de producto → sugiere `/speckit-specify`.
- Hallazgo requiere cambiar una regla `MUST`/`SHOULD` transversal → sugiere `/speckit-constitution`.
- Hallazgo es puramente documental (convención mal ubicada, falta de doc) → sugiere `planet-docs-conventions`.
- Hallazgo afecta a una spec concreta ya implementada (p. ej. su decisión quedó invalidada) → sugiere revisarla manualmente con el usuario; **no** cambies su `status` ni su contenido desde esta skill.

### 6. Commit del informe

Sigue `planet-git-commit-policy` (Conventional Commits): un único commit `docs(retrospective): registrar retrospectiva R<NNN>` que incluya **solo** el fichero nuevo de `specs/retrospectives/`. Enseña el mensaje y `git diff --stat` antes de commitear.

El push queda a discreción del usuario — pregunta si quiere subirlo ya o dejarlo commiteado en local.

### 7. Informe final

Resume en la respuesta: ruta del fichero de retrospectiva creado, número de hallazgos por severidad, y la lista de acciones recomendadas con su comando/skill sugerido. Dile al usuario que el `to` de este informe pasa a ser el baseline para la próxima vez que `planet-retrospective-check` calcule `SPECS_IMPLEMENTED_SINCE`.

## Límites

Esta skill MUST NOT:

- modificar `spec.md`, `plan.md` o `tasks.md` de ninguna spec existente (ni su `status`);
- modificar `.specify/memory/constitution.md`;
- crear nuevas specs, tareas o issues por sí misma — solo sugerirlas;
- ejecutar merges, borrar ramas, o hacer `push` sin confirmación explícita;
- corregir automáticamente ninguna contradicción o drift detectado.

Su única escritura real es el fichero nuevo en `specs/retrospectives/` (y el commit que lo registra).

## Referencias cruzadas

- `.github/skills/planet-retrospective-check/SKILL.md` — decide si esta skill debe ejecutarse y calcula el `scope` de entrada.
- `.github/skills/planet-finish-spec/SKILL.md` — invoca `planet-retrospective-check` tras cada cierre de feature, que a su vez puede recomendar esta skill.
- `.github/skills/planet-git-commit-policy/SKILL.md` — formato del commit del informe (paso 6).
- `.github/skills/speckit-specify/SKILL.md`, `speckit-constitution/SKILL.md` — vías de acción sugeridas para hallazgos Bloqueantes/Importantes.
- `.github/skills/planet-docs-conventions/SKILL.md` — vía de acción sugerida para hallazgos puramente documentales.
- `.specify/memory/constitution.md` — fuente normativa contra la que se contrastan las specs.
