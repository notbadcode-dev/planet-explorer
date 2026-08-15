---
name: planet-git-flow
description: Apply this repository's simplified git-flow branch and release model. Use when finishing a feature branch (merge into develop), cutting a release (develop -> master + semver tag), performing a hotfix (master -> hotfix/* -> master + develop), or deciding/creating a new branch outside the automated /speckit-specify flow.
---

# Git-Flow (simplificado) de planet-explorer

Fuente normativa: `.specify/memory/constitution.md`, secciones **"Control de ramas (Git)"** y **"Estrategia de release"**. Si esta skill y la constitución difieren, la constitución manda — actualiza esta skill para que coincida.

Ramas: `develop` (integración), `master` (estable/release), `###-feature-name` (features), `hotfix/*` (parches urgentes). No existen ramas `release/*`.

## Antes de cualquier operación

1. `git fetch origin --prune`.
2. `git status --short --branch` — el árbol de trabajo MUST estar limpio (sin cambios sin commitear) antes de fusionar, taguear o borrar ramas.
3. Confirma que la rama a fusionar tiene su CI en verde (lint + test + build) si es observable; si no lo es, ejecuta localmente `npm run lint && npm run test && npm run build` antes de continuar.
4. No fuerces (`--force`, `push --force`, `reset --hard`) nada en `master` o `develop` sin confirmación explícita del usuario.

## Crear una rama nueva

La creación de ramas de **feature** (`###-feature-name`) está automatizada por el hook `before_specify` (`speckit-branch-create`, ver `.github/skills/speckit-branch-create/SKILL.md` + `.specify/scripts/bash/create-feature-branch.sh`). No la repliques manualmente: se dispara sola al ejecutar `/speckit-specify`.

Para `hotfix/*` (no automatizado), créala manualmente desde `master`:

```bash
git checkout master && git pull
git checkout -b hotfix/<descripcion-corta>
```

## Cerrar una feature ("feature finish")

1. Verifica que la rama de feature pasa el Gate de finalización de la constitución.
2. Fusiona en `develop` con `--no-ff` (preserva el historial de la feature):
   ```bash
   git checkout develop && git pull
   git merge --no-ff <###-feature-name> -m "merge: finish feature <###-feature-name> into develop"
   ```
3. Valida tras el merge (`npm ci && npx tsc --noEmit && npm run lint && npm run test && npm run build`).
4. Push y borrado de la rama (local + remota):
   ```bash
   git push origin develop
   git branch -d <###-feature-name>
   git push origin --delete <###-feature-name>
   ```
5. **`master` MUST NOT recibir este merge directamente** — solo se actualiza mediante una release (ver abajo).

## Cortar una release

1. `develop` MUST haber superado el Gate de finalización (todas las features incluidas ya validadas).
2. Decide el bump de versión (SemVer, `MAJOR.MINOR.PATCH`):
   - `MAJOR`: cambio de ruptura o hito mayor.
   - `MINOR`: nuevas funcionalidades completas (caso habitual).
   - `PATCH`: solo hotfixes.
3. Actualiza `version` en `package.json` si aún no coincide con la versión objetivo (commit `chore(release): bump version to vX.Y.Z` si hace falta, o inclúyelo en el propio merge commit).
4. Fusiona `develop` en `master` y tagea:
   ```bash
   git checkout master && git pull
   git merge --no-ff develop -m "release: vX.Y.Z"
   git tag -a vX.Y.Z -m "vX.Y.Z: <resumen breve>"
   git push origin master
   git push origin vX.Y.Z
   ```
5. El push a `master` dispara el deploy automático a GitHub Pages (`.github/workflows/ci.yml`, job `deploy`). No se necesita ninguna acción manual adicional salvo que `Settings → Pages → Source` no esté configurado como "GitHub Actions".
6. Vuelve a `develop` al terminar: `git checkout develop`.

## Hotfix

1. Rama desde `master` (ver arriba, `hotfix/<descripcion-corta>`).
2. Aplica y valida la corrección (tests + lint + build).
3. Fusiona a `master`, tagea PATCH, y fusiona el mismo commit/rama también a `develop` para que la corrección no se pierda en la siguiente release:
   ```bash
   git checkout master && git merge --no-ff hotfix/<descripcion> -m "fix: <resumen>"
   git tag -a vX.Y.(Z+1) -m "vX.Y.(Z+1): hotfix <resumen>"
   git push origin master && git push origin vX.Y.(Z+1)

   git checkout develop && git merge --no-ff hotfix/<descripcion> -m "merge: bring hotfix <descripcion> into develop"
   git push origin develop
   ```
4. Borra la rama `hotfix/*` (local + remota) tras fusionar en ambas.

## Verificación de sincronización

Para comprobar que `master`/`develop` locales y remotos están al día:

```bash
git fetch origin --prune
git rev-parse master origin/master
git rev-parse develop origin/develop
git rev-list --left-right --count master...develop   # divergencia esperada: develop puede ir por delante, master nunca debería ir por delante de develop
```

## Referencias cruzadas

- Mensajes de commit: usa el formato de `.github/skills/planet-git-commit-policy/SKILL.md` (Conventional Commits) para cualquier commit que no sea el propio merge/tag de release.
- Creación de ramas de feature: `.github/skills/speckit-branch-create/SKILL.md`.
- Reglas normativas completas: `.specify/memory/constitution.md` § "Control de ramas (Git)" y § "Estrategia de release".
