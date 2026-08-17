---
title: "Convención: Arquitectura del proyecto (visión general)"
type: "convention"
version: "1.1"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
source: "package.json, vite.config.ts, tsconfig.json, .github/workflows/ci.yml, constitution.md (sección Arquitectura y tecnología)"
tags: [convention, architecture]
---

# Convención: Arquitectura del proyecto (visión general)

**Fuente**: configuración real del repositorio (`package.json`, `vite.config.ts`,
`tsconfig.json`, `.github/workflows/ci.yml`) y `constitution.md` (sección
"Arquitectura y tecnología").

## Propósito

Fijar, en un único documento consultable, cómo está organizado el repositorio, qué
vive en cada carpeta de primer nivel, qué tooling gobierna cada parte y cuál es el
estado real de implementación — para que ninguna feature, componente ni agente IA
introduzca una estructura, dependencia o capa alternativa sin pasar antes por este
documento (o por una spec que lo modifique explícitamente). Este documento es la
**referencia de arquitectura**; cualquier duda sobre "dónde va esto" se resuelve
aquí antes que por precedente ad hoc.

## Regla de autoridad

* **G1**: Ninguna carpeta de primer nivel nueva, dependencia de producción nueva, ni
  capa de arquitectura nueva (routing, estado global, framework de UI, ORM, backend,
  etc.) MUST introducirse sin que quede reflejada primero en este documento **y**
  justificada en el `plan.md`/`research.md` de la feature que la introduce (ver
  también constitución, "Arquitectura y tecnología" y "Simplicidad primero").
* **G2**: Si el código diverge de lo descrito aquí, el código MUST corregirse o este
  documento MUST actualizarse explícitamente como parte de la misma feature — nunca
  queda la divergencia sin resolver.

## Stack tecnológico obligatorio

TypeScript (`strict` mode) + Phaser + Vite + HTML + CSS + Vitest + ESLint + Prettier
(constitución, "Arquitectura y tecnología"). Angular/React/Vue MUST NOT
incorporarse sin spec explícita; Three.js MUST NOT incorporarse salvo necesidad
concreta de renderizado 3D (ver constitución para el detalle completo — este
documento no repite esas reglas de principio, solo referencia dónde viven).

**Estado real (2026-08-16)**: `package.json` todavía **no** declara `phaser` como
dependencia; el repositorio contiene únicamente la librería de componentes UI
(`libs/components/`) y los tokens de diseño (`src/styles/`). El motor de juego y
las escenas de Phaser son trabajo futuro (ver `specs_pending/004-core-game-loop.md`
en adelante). Este documento MUST actualizarse en cuanto exista una feature que
introduzca la primera escena Phaser.

## Layout del repositorio

```text
planet-explorer/
├── .specify/memory/constitution.md   # Principios y reglas de gobernanza (autoridad máxima)
├── docs/                             # Convenciones técnicas transversales (este documento vive aquí)
├── specs/NNN-feature/                # Spec, plan, research, contratos y tareas por feature ya construida
├── specs_pending/                    # Ideas de features futuras, sin spec formal todavía (NNN-*.md sueltos)
├── .github/skills/planet-*.md        # Conocimiento operativo para agentes IA (git, storybook, docs...)
├── libs/components/<name>/           # Librería de componentes UI reutilizables ("dummy", sin lógica de negocio)
├── src/
│   ├── assets/fonts/                 # Assets estáticos empaquetados por Vite (fuentes locales, sin CDN)
│   └── styles/                       # Tokens de diseño globales (_colors, _spacing, _radii, _shadows, _typography, _motion) + index.css
├── scripts/check-components.mjs      # Verificación de convención estructural de libs/components/ (parte de `npm run lint`)
├── .storybook/                       # Configuración de Storybook (@storybook/html-vite, sin adaptador de framework)
├── vite.config.ts                    # Build (dist/) + entorno de test Vitest (happy-dom)
├── tsconfig.json                     # Compila libs/, scripts/, vite.config.ts, .storybook/ — NO compila src/ (aún sin .ts)
└── .github/workflows/ci.yml          # lint → test → build → deploy a GitHub Pages (solo rama master)
```

* **G3**: El código del **juego** (escenas Phaser, lógica educativa, progresión,
  persistencia) MUST vivir bajo `src/`, nunca dentro de `libs/components/` (ver
  constitución, "Componentes compartidos": `libs/components/` es exclusivamente
  presentacional).
* **G4**: Cuando exista código de juego en `src/`, `tsconfig.json` MUST ampliar su
  `include` para compilarlo; hasta entonces, `src/` solo contiene CSS/assets y no
  participa en la compilación TypeScript.
* **G5**: Una feature nueva MUST documentarse primero en `specs/NNN-feature-name/`
  (vía `/speckit-specify` → `/speckit-plan`) antes de escribir código; no MUST
  añadirse código directamente a `libs/` o `src/` sin spec asociada (salvo fixes
  triviales sin impacto de diseño).

## Arquitectura de la librería de componentes

Los componentes son funciones TypeScript puras sobre `HTMLElement` nativo, sin
Virtual DOM, sin Web Components/Shadow DOM y sin framework de UI, construidas
sobre elementos nativos en lugar de reimplementar patrones ARIA cuando el
navegador ya los resuelve — ver los patrones concretos de API y sus alternativas
descartadas (Web Components, listbox personalizado, `mode` compartido) en
[`../components/api-patterns.md`](../components/api-patterns.md), y la
alternativa CSS-in-JS descartada en [`../components/css.md`](../components/css.md).

## Tooling y pipeline

* **Build**: Vite (`vite.config.ts`), salida en `dist/`, `base: './'` (compatible
  con hosting estático en subruta de GitHub Pages).
* **Test**: Vitest sobre entorno `happy-dom`, alcance `libs/**/*.test.ts` (ver
  [`../components/testing.md`](../components/testing.md)).
* **Documentación visual**: Storybook (`@storybook/html-vite`, sin adaptador de
  framework), herramienta de desarrollo local — MUST NOT desplegarse como parte
  del sitio de producción salvo que una spec lo decida explícitamente (ver
  [`../components/storybook.md`](../components/storybook.md)).
* **Calidad**: `npm run lint` = `scripts/check-components.mjs` (estructura de
  `libs/components/`, ver [`../components/structure.md`](../components/structure.md))
  + ESLint (TypeScript strict, flat config en `eslint.config.js`).
* **CI/CD**: `.github/workflows/ci.yml` ejecuta `lint` → `test` → `build` en cada
  push/PR a `master`/`develop`; el despliegue a GitHub Pages solo se dispara en
  push a `master`. No hay backend ni SSR: todo el pipeline asume salida estática
  desplegable en `dist/`.
* **Gestión de dependencias**: un único `package.json` en la raíz (no monorepo,
  no workspaces); ver `dependencies` (runtime, hoy solo `@phosphor-icons/core`)
  vs. `devDependencies` (build/test/lint, no afectan al bundle de producción).

## Fuera de alcance

* El razonamiento de principio de por qué se exige este stack y por qué
  simplicidad primero — vive en la constitución.
* Los patrones concretos de API de componente, testing, Storybook, tokens de
  diseño y decisiones/alternativas descartadas — viven en sus propios documentos
  dentro de `docs/conventions/` (enlazados arriba).
* La arquitectura interna del motor de juego/Phaser (escenas, gestión de estado,
  progresión, persistencia) — el código todavía no existe, pero la decisión
  arquitectónica ya está fijada por anticipado en
  [`game-engine-scenes.md`](./game-engine-scenes.md) (layout `src/game/`),
  [`content-model.md`](./content-model.md) (jerarquía de contenido),
  [`challenge-engine-contract.md`](./challenge-engine-contract.md) (motor de
  retos) y [`progress-persistence-model.md`](./progress-persistence-model.md)
  (progreso y persistencia). `specs_pending/004-core-game-loop.md` y siguientes
  MUST seguir estas decisiones en lugar de re-decidirlas; este documento se
  actualizará (nunca se contradirá silenciosamente) si la primera
  implementación real revela un ajuste necesario.
