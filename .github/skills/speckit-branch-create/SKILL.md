---
name: "speckit-branch-create"
description: "Hook before_specify: crea la rama de git para una nueva feature, exigiendo que siempre se parta de develop/main/master salvo que la nueva feature esté explícitamente relacionada con la spec de la rama actual."
compatibility: "Requiere estructura de spec-kit (.specify/) y un repositorio git"
metadata:
  author: "local"
  source: "hook personalizado registrado en .specify/extensions.yml (hooks.before_specify)"
---

## Propósito

Este comando es un **hook `before_specify` obligatorio**. Se ejecuta automáticamente antes de que `/speckit-specify` escriba ningún fichero de spec. Su única responsabilidad es decidir la rama base y crear la rama de la nueva feature, aplicando esta regla:

> Las ramas de feature nuevas SIEMPRE deben crearse desde la única rama base del
> repositorio (`develop` cuando existe —modelo git-flow—, si no `main`/`master`,
> autodetectada; nunca varias a la vez).
> Solo se permite crear una rama de feature partiendo de otra rama `###-feature-name`
> cuando la nueva feature está **explícitamente** relacionada/depende de esa spec
> (por ejemplo, aparecerá en `dependencies` o `related_specs` en su front-matter).

## Pasos

1. Toma `$ARGUMENTS` (la misma descripción de la feature que se pasó a `/speckit-specify`).
2. Ejecuta `git rev-parse --abbrev-ref HEAD` desde la raíz del repo para obtener `CURRENT_BRANCH`. Si falla (no es un repo git o no tiene commits), informa el error al usuario y detente — no crees ninguna spec.
3. Clasifica `CURRENT_BRANCH` (la rama base se autodetecta: `develop` local → `origin/HEAD` → `main` local → `master` local; ver `create-feature-branch.sh`):
   - **Es la rama base**: ve directamente al paso 5, sin `--related-feature`.
   - **Rama de feature** (coincide con `^[0-9]{3,}-`): ve al paso 4.
   - **Cualquier otro caso** (HEAD desacoplado, rama sin ese patrón): detente y pide al usuario que vuelva a la rama base (`git checkout develop`, o `main`/`master` si `develop` no existe) antes de volver a ejecutar `/speckit-specify`. No crees la spec.
4. Cuando `CURRENT_BRANCH` es una rama de feature, decide si la nueva feature está relacionada:
   - Si `$ARGUMENTS` (o el contexto previo de la conversación) indica claramente que la nueva feature depende de, extiende, o forma parte de la spec de `CURRENT_BRANCH` (por ejemplo menciona su número o nombre), trátala como relacionada sin preguntar.
   - Si es ambiguo, usa `vscode_askQuestions` con una única pregunta, por ejemplo:
     - **Pregunta**: "Estás en la rama `CURRENT_BRANCH`. ¿La nueva funcionalidad está directamente relacionada con esa spec?"
     - **Opciones**: "Sí, está relacionada" (recommended: false) / "No, crear desde master/develop" (recommended: true)
   - Si está relacionada → continúa al paso 5 con `--related-feature "$CURRENT_BRANCH"`.
   - Si NO está relacionada → dile al usuario que vuelva a la rama base (`git checkout develop`, o `main`/`master` si no existe `develop`) y vuelva a lanzar `/speckit-specify`, y detente sin crear la spec.
5. Ejecuta el script de creación de rama desde la raíz del repo, reenviando la descripción original y cualquier `--short-name` / `--number` / `--timestamp` que el usuario haya indicado, más `--related-feature` si aplica según el paso 4:
   ```bash
   .specify/scripts/bash/create-feature-branch.sh --json [--related-feature "$CURRENT_BRANCH"] "$ARGUMENTS"
   ```
6. Analiza la salida JSON: `BRANCH_NAME`, `FEATURE_NUM`, `BASE_BRANCH`. Estos son los valores que `/speckit-specify` espera recibir de un hook `before_specify`.
7. Si el script termina con código distinto de cero, muestra su mensaje de error (stderr) tal cual al usuario y detente — `/speckit-specify` NO debe continuar creando el directorio de la spec si la rama fue rechazada.

## Contrato de salida (para el comando que invoca el hook)

Tras una ejecución exitosa, este hook deja disponibles:
- `BRANCH_NAME` — el nombre de la rama de git creada (p. ej. `005-planet-filter`)
- `FEATURE_NUM` — el prefijo numérico o de timestamp (p. ej. `005`)
- `BASE_BRANCH` — la rama desde la que se creó (p. ej. `master`, o la rama de la feature relacionada)

## Notas

- Este hook nunca decide él mismo la relación entre specs sin evidencia: ante la duda, siempre pregunta o exige `develop` (o `master`/`main` si no existe) como base. Esto evita crear árboles de ramas encadenadas por error.
- La numeración y el nombre de la rama siguen calculándose en `create-new-feature.sh` (vía `--dry-run`); este hook no duplica esa lógica.
