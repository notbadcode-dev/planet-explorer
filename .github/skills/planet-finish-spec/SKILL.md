---
name: planet-finish-spec
description: Cierra formalmente una feature de spec-kit ya convergida (`/speckit-converge` = "✅ Converged"). Actualiza el front matter de spec.md/plan.md/tasks.md a status "Implemented", marca la entrada de specs_pending/ como hecha, commitea esos cambios, fusiona la rama de feature en develop siguiendo git-flow, sincroniza develop/master remotos y hace push. Use when the user asks to "cerrar/terminar/dar por completada la spec/feature", "mergear y cerrar la rama ya implementada", or right after /speckit-converge reports a clean "Converged" result.
---

# Cerrar una spec (`planet-finish-spec`)

Esta skill **no sustituye** a `planet-git-flow` ni a `planet-git-commit-policy`: los aplica, en orden, para dar por cerrada una feature de spec-kit ya implementada y convergida. Si esta skill y cualquiera de esas dos difieren en mecánica de git, **las otras dos mandan** — actualiza esta skill para que coincida.

## Cuándo usar esta skill

- El usuario pide explícitamente cerrar/terminar/dar por completada una spec o feature.
- `/speckit-converge` acaba de reportar **"✅ Converged"** para la feature activa (hook opcional `after_converge`, ver abajo) — en ese caso, ofrece esta skill como siguiente paso, no la ejecutes sin que el usuario lo confirme.

## Precondiciones (MUST verificar antes de escribir nada)

1. La rama actual coincide con `^[0-9]{3,}-` (rama de feature). Si no, STOP y pide al usuario que se sitúe en la rama de la feature a cerrar (`git checkout <###-feature-name>`).
2. Árbol de trabajo limpio (`git status --short --branch`), salvo los cambios de front matter que esta misma skill va a crear en los pasos 1-2.
3. Convergencia confirmada: si `/speckit-converge` no se ha ejecutado ya en esta sesión para esta feature, ejecútalo ahora.
   - Si devuelve `tasks_appended`, **STOP**: hay que ejecutar `/speckit-implement` para completar esas tareas nuevas antes de cerrar la spec.
   - Solo continúa si el resultado es `converged` ("✅ Converged").
4. Gate de CI en verde (`npm run lint && npm test && npm run build`, o el equivalente del stack que indique `plan.md` si difiere).

Si cualquier precondición falla, detente e informa exactamente qué falta. Nunca fuerces el cierre saltándote una precondición.

## Pasos

### 1. Front matter de `specs/<feature>/`

Para `spec.md`, `plan.md` y `tasks.md` (los que existan en `FEATURE_DIR`, obtenido igual que en el resto de comandos spec-kit vía `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks`):

- Cambia `status: "..."` a `status: "Implemented"` (enum ya documentado en `.specify/templates/spec-template.md` / `plan-template.md` / `tasks-template.md`: `Draft | In Review | Approved | In Progress | Implemented | Deprecated`).
- Actualiza `updated: "..."` a la fecha actual (`YYYY-MM-DD`, mismo formato que el resto del front matter de esa feature).
- No toques ningún otro campo (`version`, `tags`, `dependencies`, `related_specs`, etc.).

### 2. Marcar la entrada en `specs_pending/`

Busca `specs_pending/<feature>.md` (mismo id que la carpeta de `specs/<feature>/`). Si existe:

- Añade `status: "done"` al front matter YAML, sin tocar `id`/`name`/`phase`/`depends_on`.
- Justo debajo del título `# <id> — <name>`, añade una línea `**Implementado en**: specs/<feature>/` si no está ya presente.

Si no existe (la feature se creó sin pasar por `specs_pending/`), omite este paso silenciosamente — no es un error.

### 3. Commit de los cambios de documentación

Sigue `planet-git-commit-policy` (Conventional Commits): un único commit tipo `docs(<feature>): marcar spec como implementada`, que incluya **solo** los ficheros tocados en los pasos 1-2. Antes de commitear, enseña al usuario el mensaje propuesto y `git diff --stat`.

### 4. Cerrar la feature con git-flow

Sigue **al pie de la letra** la sección "Cerrar una feature" de `planet-git-flow`:

1. `git checkout develop && git pull`
2. `git merge --no-ff <###-feature-name> -m "merge: finish feature <###-feature-name> into develop"`
3. Revalida el gate tras el merge (`npm ci && npx tsc --noEmit && npm run lint && npm run test && npm run build` — recuerda que `tsc --noEmit` es un falso positivo conocido, no lo uses como bloqueante).
4. `git push origin develop`
5. Borra la rama de feature local y remota.

**Antes de ejecutar cualquier `git push` o borrado de rama, enseña los comandos exactos y pide confirmación explícita del usuario** — son operaciones sobre ramas compartidas, difíciles de revertir sin coordinación.

### 5. Sincronizar `develop` y `master`

En este repo `master` **solo** se actualiza mediante una release formal (`planet-git-flow`, sección "Cortar una release"), nunca en cada cierre de feature. Por tanto:

- Pregunta explícitamente al usuario (`vscode_askQuestions`): "¿Quieres cortar una release ahora (develop → master + tag semver) o dejar `develop` por delante de `master` hasta acumular más features?"
- Si confirma release: sigue la sección "Cortar una release" de `planet-git-flow` (bump de versión en `package.json` si aplica, merge `--no-ff` a `master`, tag `vX.Y.Z`, push de `master` y del tag). Recuerda que esto dispara el deploy automático a GitHub Pages.
- Si no: verifica igualmente que ambos remotos están sincronizados con sus locales (sección "Verificación de sincronización" de `planet-git-flow`: `git fetch origin --prune` + `git rev-parse`/`git rev-list --left-right --count`) y deja constancia en el informe final de que `master` sigue intencionalmente por detrás de `develop`.

### 6. Informe final

Resume en la respuesta: commit de documentación creado (hash + mensaje), merge a `develop` (hash), rama de feature borrada (local/remota, sí/no), estado de `master` (sincronizado / release cortada `vX.Y.Z` / dejado atrás a propósito), y próximos pasos si quedara algo pendiente.

## Registro como hook opcional

Esta skill está registrada como hook **opcional** `after_converge` en `.specify/extensions.yml` (`optional: true`): cuando `/speckit-converge` reporta "✅ Converged", debe sugerirse como siguiente paso posible, nunca ejecutarse automáticamente sin confirmación del usuario.

## Referencias cruzadas

- `.github/skills/planet-git-flow/SKILL.md` — mecánica exacta de merge de feature / release / hotfix / verificación de sincronización.
- `.github/skills/planet-git-commit-policy/SKILL.md` — formato del commit de documentación del paso 3.
- `.github/skills/speckit-converge/SKILL.md` — precondición de convergencia (paso 3 de precondiciones).
- `.specify/templates/spec-template.md`, `plan-template.md`, `tasks-template.md` — enum válido del campo `status`.
