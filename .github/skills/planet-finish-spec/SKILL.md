---
name: planet-finish-spec
description: Cierra formalmente una feature de spec-kit ya convergida (`/speckit-converge` = "✅ Converged", ejecutado por el usuario). Actualiza el front matter de spec.md/plan.md/tasks.md a status "Implemented", marca la entrada de specs_pending/ como hecha, y en un único cierre fusiona la rama de feature con --no-ff tanto en develop como en master (sin proceso de release aparte), hace push, borra la rama e invoca `planet-retrospective-check` para evaluar si el proyecto necesita una retrospectiva transversal. Use when the user asks to "cerrar/terminar/dar por completada la spec/feature", "mergear y cerrar la rama ya implementada", or right after /speckit-converge reports a clean "Converged" result.
---

# Cerrar una spec (`planet-finish-spec`)

Esta skill **no sustituye** a `planet-git-flow` ni a `planet-git-commit-policy`: los aplica, en orden, para dar por cerrada una feature de spec-kit ya implementada y convergida. Si esta skill y cualquiera de esas dos difieren en mecánica de git, **las otras dos mandan** — actualiza esta skill para que coincida.

## Cuándo usar esta skill

- El usuario pide explícitamente cerrar/terminar/dar por completada una spec o feature.
- `/speckit-converge` acaba de reportar **"✅ Converged"** para la feature activa (hook opcional `after_converge`, ver abajo) — en ese caso, ofrece esta skill como siguiente paso, no la ejecutes sin que el usuario lo confirme.

## Precondiciones (MUST verificar antes de escribir nada)

1. La rama actual coincide con `^[0-9]{3,}-` (rama de feature). Si no, STOP y pide al usuario que se sitúe en la rama de la feature a cerrar (`git checkout <###-feature-name>`).
2. Árbol de trabajo limpio (`git status --short --branch`), salvo los cambios de front matter que esta misma skill va a crear en los pasos 1-2.
3. Convergencia confirmada: `/speckit-converge` es responsabilidad del usuario, **no lo ejecutes tú automáticamente**. Confirma con el usuario que ya lo ha ejecutado para esta feature y que el resultado fue `converged` ("✅ Converged"). Si no consta o el usuario indica que devolvió `tasks_appended`, **STOP** y pide que ejecute `/speckit-converge` (y, si aplica, `/speckit-implement`) antes de continuar.
4. Gate de CI en verde (`npm run lint && npm test && npm run build`, o el equivalente del stack que indique `plan.md` si difiere).

Si cualquier precondición falla, detente e informa exactamente qué falta. Nunca fuerces el cierre saltándote una precondición.

## Pasos

### 1. Front matter de `specs/<feature>/`

Para `spec.md`, `plan.md` y `tasks.md` (los que existan en `FEATURE_DIR`, obtenido igual que en el resto de comandos spec-kit vía `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks`):

- Cambia `status: "..."` a `status: "Implemented"` (enum ya documentado en `.specify/templates/spec-template.md` / `plan-template.md` / `tasks-template.md`: `Draft | In Review | Approved | In Progress | Implemented | Deprecated`).
- Actualiza `updated: "..."` a la fecha actual (`YYYY-MM-DD`, mismo formato que el resto del front matter de esa feature).
- No toques ningún otro campo (`version`, `tags`, `dependencies`, `related_specs`, etc.).

### 2. Eliminar la entrada en `specs_pending/`

Busca `specs_pending/<feature>.md` (mismo id que la carpeta de `specs/<feature>/`). Si existe:

- Elimina el fichero (`rm specs_pending/<feature>.md`) — `specs_pending/` es un backlog vivo de ideas sin spec formal. Una vez que una idea se implementa, deja de ser "pendiente" y vive únicamente en `specs/<feature>/`.

Si no existe (la feature se creó sin pasar por `specs_pending/`), omite este paso silenciosamente — no es un error.

### 3. Commitear y cerrar la feature en un solo cierre

Este repo **no mantiene un proceso de release aparte** (constitución § "Estrategia de release"): cerrar la feature la publica de inmediato en `master`, sin preguntar si se "corta" una release.

1. Commitea los cambios de front matter de los pasos 1-2 directamente en la rama de feature, sin ceremonia adicional: sigue `planet-git-commit-policy` (Conventional Commits) con un mensaje tipo `docs(<feature>): marcar spec como implementada` que incluya **solo** los ficheros tocados en los pasos 1-2. Enseña el mensaje y `git diff --stat` antes de commitear; no hace falta un paso de confirmación separado del resto del cierre.
2. Sigue **al pie de la letra** la sección "Cerrar una feature" de `planet-git-flow` (merge `--no-ff` a `develop`, revalidar el gate, push, merge `--no-ff` de `develop` a `master`, push de `master`, borrado de la rama de feature local y remota).

**Antes de ejecutar cualquier `git push` o borrado de rama, enseña los comandos exactos y pide confirmación explícita del usuario** — son operaciones sobre ramas compartidas, difíciles de revertir sin coordinación.

### 4. Informe final

Resume en la respuesta: commit de documentación creado (hash + mensaje), merge a `develop` y a `master` (hashes), push de `master` (dispara el deploy a GitHub Pages), rama de feature borrada (local/remota, sí/no), y próximos pasos si quedara algo pendiente.

### 5. Evaluar necesidad de retrospectiva

Una vez cerrada correctamente la feature, ejecuta `planet-retrospective-check`. Esta evaluación es **obligatoria** tras cada cierre de spec, pero no implica que deba crearse una retrospectiva — `planet-finish-spec` nunca realiza directamente la retrospectiva, solo invoca el check y reporta su resultado.

Resultados posibles:

- `NOT_REQUIRED`: finalizar normalmente, sin acción adicional.
- `RECOMMENDED`: informar al usuario de los motivos y el alcance sugerido, y ofrecer ejecutar `planet-spec-retrospective` — no ejecutarla sin confirmación.
- `REQUIRED`: informar de que se ha alcanzado un criterio obligatorio de retrospectiva y recomendar ejecutar `planet-spec-retrospective` antes de comenzar otra feature, salvo que el usuario indique explícitamente continuar.

Un resultado `RECOMMENDED` o `REQUIRED` de este paso **no deshace** el cierre de la feature ya completado en los pasos 1-4.

## Registro como hook opcional

Esta skill está registrada como hook **opcional** `after_converge` en `.specify/extensions.yml` (`optional: true`): cuando `/speckit-converge` reporta "✅ Converged", debe sugerirse como siguiente paso posible, nunca ejecutarse automáticamente sin confirmación del usuario.

## Referencias cruzadas

- `.github/skills/planet-git-flow/SKILL.md` — mecánica exacta de merge de feature (develop + master) / hotfix / verificación de sincronización.
- `.github/skills/planet-git-commit-policy/SKILL.md` — formato del commit de documentación del paso 3.
- `.github/skills/speckit-converge/SKILL.md` — convergencia que el usuario ejecuta antes de invocar esta skill (precondición 3).
- `.github/skills/planet-retrospective-check/SKILL.md` — determina si el proyecto requiere una retrospectiva transversal tras cerrar una spec (paso 5).
- `.github/skills/planet-spec-retrospective/SKILL.md` — ejecuta la auditoría transversal de las specs cuando el check anterior devuelve `RECOMMENDED` o `REQUIRED`.
- `.specify/templates/spec-template.md`, `plan-template.md`, `tasks-template.md` — enum válido del campo `status`.
- `.specify/memory/constitution.md` § "Control de ramas (Git)" y § "Estrategia de release" — master recibe el merge directo, sin proceso de release independiente.
