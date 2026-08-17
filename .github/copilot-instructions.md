# Instrucciones para agentes IA — planet-explorer

"Explorador Espacial": juego educativo de astronomía para niños. Hoy es una
librería de componentes UI (Storybook, DOM vanilla) sobre la que se construirá
más adelante un motor de juego con Phaser.

## Fuente de la verdad (en este orden)

1. `.specify/memory/constitution.md` — principios y reglas vinculantes (autoridad máxima).
2. `docs/index.md` — mapa de toda la documentación del proyecto (convenciones, specs, skills).
3. `specs/NNN-feature/` — spec/plan/tasks de cada feature ya construida o en curso.

Flujo de trabajo por feature (spec-kit): `/speckit-specify` → `/speckit-plan` →
`/speckit-tasks` → `/speckit-implement`. Ideas todavía sin spec formal viven en
`specs_pending/`.

## Stack y comandos

- TypeScript + Vite + Vitest + Storybook (`@storybook/html-vite`). Sin framework de
  UI: componentes en DOM vanilla.
- `npm run lint` (`scripts/check-components.mjs` + eslint), `npm test` (vitest run),
  `npm run build`, `npm run storybook`, `npm run build-storybook`.
- `npx tsc --noEmit` da un falso positivo (`TS2882`) por los imports de efecto
  lateral `import './X.css'` — NO usarlo como gate. El gate real es
  `npm run lint && npm test && npm run build` (igual que CI).
- CI: `.github/workflows/ci.yml` (lint+test+build en push a `develop`/`master`;
  deploy a GitHub Pages desde `master`).

## Estructura

- `libs/components/<component>/` — cada componente de la librería sigue el mismo
  patrón: `Component.ts`, `Component.type.ts`, `Component.constants.ts`,
  `Component.css`, `Component.test.ts`, `Component.stories.ts`. Ver
  `libs/components/README.md`.
- `src/` — futura app/juego. Cuando exista lógica de juego (Phaser): separar en
  lógica pura testeable sin Phaser/DOM vs escenas Phaser (presentación/input/
  render). NO introducir Clean Architecture completa (capas, puertos, DI, event
  bus formal) — descartado explícitamente por el Principio VI ("Simplicidad
  primero") de la constitución.

## Convenciones clave (no obvias)

- **Idioma**: identificadores de código, nombres de fichero/carpeta y exports de
  stories de Storybook → **inglés**. Documentación (specs/plans/docs,
  descripciones `it()/describe()` en tests, contenido visible al jugador) →
  **castellano**.
- **Sin literales mágicos**: `scripts/check-components.mjs` falla con strings/
  números sueltos en `.ts` productivo fuera de `*.constants.ts` (incluye
  template literals con texto literal entre expresiones — usar concatenación
  `+` o `classList.add()` por separado).
- Cada componente define sus propios catálogos (tamaños/variantes) en su propio
  `*.constants.ts`; no existe un módulo compartido `ComponentSize`.
- **Git-flow simplificado**: ramas de feature desde `develop`; al terminar,
  merge `--no-ff` de vuelta a `develop`. `master` solo se actualiza en releases
  (merge `develop`→`master` + tag semver). Ver skill `planet-git-flow`.

## Skills disponibles (`.github/skills/`)

- `speckit-*` — flujo spec-kit (specify, plan, tasks, implement, analyze,
  clarify, checklist, constitution, converge, taskstoissues, branch-create).
- `planet-*` — convenciones propias del repo: `planet-git-flow`,
  `planet-git-commit-policy`, `planet-docs-conventions`,
  `planet-storybook-conventions`.
