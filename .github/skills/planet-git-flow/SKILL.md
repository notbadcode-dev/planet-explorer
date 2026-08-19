---
name: planet-git-flow
description: Apply this repository's simplified git-flow branch model. Use when finishing a feature branch (merge into develop AND master in the same operation, no separate release step), performing a hotfix (master -> hotfix/* -> master + develop), or deciding/creating a new branch outside the automated /speckit-specify flow.
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

El proyecto no mantiene un proceso de release independiente: cerrar una feature la publica de inmediato en `master`, en la misma operación que la integra en `develop`.

1. Verifica que la rama de feature pasa el Gate de finalización de la constitución.
2. Fusiona en `develop` con `--no-ff` (preserva el historial de la feature):
    ```bash
    git checkout develop && git pull
    git merge --no-ff <###-feature-name> -m "merge: finish feature <###-feature-name> into develop"
    ```
3. Valida tras el merge (`npm ci && npx tsc --noEmit && npm run lint && npm run test && npm run build`).
4. Push de `develop`:
    ```bash
    git push origin develop
    ```
5. Fusiona el mismo estado en `master` con `--no-ff` y publica:
    ```bash
    git checkout master && git pull
    git merge --no-ff develop -m "merge: finish feature <###-feature-name> into master"
    git push origin master
    ```
    Esto dispara el deploy automático a GitHub Pages (`.github/workflows/ci.yml`, job `deploy`). No se necesita ninguna acción manual adicional salvo que `Settings → Pages → Source` no esté configurado como "GitHub Actions".
6. Borra la rama de feature (local + remota):
    ```bash
    git branch -d <###-feature-name>
    git push origin --delete <###-feature-name>
    ```
7. Vuelve a `develop` al terminar: `git checkout develop`.

El campo `version` de `package.json` y los tags de Git (`vX.Y.Z`) MAY actualizarse puntualmente para marcar un hito, pero no son un requisito de este flujo.

## Hotfix

1. Rama desde `master` (ver arriba, `hotfix/<descripcion-corta>`).
2. Aplica y valida la corrección (tests + lint + build).
3. Fusiona a `master` y fusiona el mismo commit/rama también a `develop` para mantener ambas ramas sincronizadas (el tag `vX.Y.(Z+1)` es opcional, ver "Estrategia de release" de la constitución):
    ```bash
    git checkout master && git merge --no-ff hotfix/<descripcion> -m "fix: <resumen>"
    git push origin master

    git checkout develop && git merge --no-ff hotfix/<descripcion> -m "merge: bring hotfix <descripcion> into develop"
    git push origin develop
    ```
4. Borra la rama `hotfix/*` (local + remota) tras fusionar en ambas.

## Verificación de sincronización

Como `develop` y `master` se fusionan en la misma operación al cerrar cada feature, no debería existir divergencia entre ambas salvo un hotfix a medio aplicar. Para comprobarlo:

```bash
git fetch origin --prune
git rev-parse master origin/master
git rev-parse develop origin/develop
git rev-list --left-right --count master...develop   # divergencia esperada: ninguna (0 0); si aparece, sincroniza develop y master antes de continuar
```

## Referencias cruzadas

- Mensajes de commit: usa el formato de `.github/skills/planet-git-commit-policy/SKILL.md` (Conventional Commits) para cualquier commit que no sea el propio merge.
- Creación de ramas de feature: `.github/skills/speckit-branch-create/SKILL.md`.
- Reglas normativas completas: `.specify/memory/constitution.md` § "Control de ramas (Git)" y § "Estrategia de release".
