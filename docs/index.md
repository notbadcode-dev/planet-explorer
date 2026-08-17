# Documentación del proyecto (`docs/`)

Esta carpeta es la **matriz de la información del proyecto**: el punto de entrada
para saber qué documentación existe, dónde vive y por qué, enlazando el resto de
capas documentales en lugar de duplicarlas. El contenido normativo propio de
`docs/` sigue siendo únicamente documentación técnica **transversal**
(convenciones que aplican a más de una feature); el mapa de abajo sitúa esa
documentación dentro del conjunto completo del proyecto.

## Mapa de la documentación del proyecto

* `.specify/memory/constitution.md` — **raíz
  del flujo de speckit**: principios y reglas estables que gobiernan `spec.md`,
  `plan.md`, `tasks.md` y el resto de artefactos de cada feature (autoridad
  máxima del proyecto). Solo apunta a `docs/` de forma genérica, sin enlazar
  ficheros concretos, para no requerir una revisión de versión cada vez que se
  añade un documento aquí.
* **`docs/conventions/`** (este directorio) — convenciones técnicas transversales,
  consultables, indexadas más abajo en "Contenido".
* **`specs/NNN-feature/`** — spec, plan, research, contratos y tareas de cada
  feature ya construida o en construcción, generados por `/speckit-specify` →
  `/speckit-plan` → `/speckit-tasks`. `contracts/` documenta API específicas de
  una feature o componente concreto; no se migran a `docs/` salvo que la
  convención sea realmente transversal.
* **`specs_pending/`** — ideas de features futuras todavía sin spec formal.
* **`.github/skills/`** — conocimiento operativo para agentes IA: cómo ejecutar
  el flujo de speckit (`speckit-*`) y convenciones operativas del repositorio no
  cubiertas por principios ni por convenciones técnicas (`planet-git-flow`,
  `planet-storybook-conventions`, `planet-git-commit-policy`,
  `planet-docs-conventions`).

## Cómo crear un nuevo documento

Todos los documentos de `docs/conventions/` comparten el mismo frontmatter y la misma
estructura (`Propósito` → reglas → `Fuera de alcance`). Usa la plantilla
[`templates/convention-template.md`](./templates/convention-template.md) como punto de
partida y sigue la skill [`planet-docs-conventions`](../.github/skills/planet-docs-conventions/SKILL.md)
para decidir si el contenido va en la constitución, en `docs/` o en `specs/NNN-feature/contracts/`,
y en qué subcarpeta temática de `docs/conventions/` debe vivir.

## Estructura

```text
docs/
├── index.md                          # este índice
├── templates/
│   └── convention-template.md        # plantilla para nuevos documentos de convención
└── conventions/
    ├── components/                   # librería de componentes (libs/components/)
    │   ├── structure.md
    │   ├── css.md
    │   ├── api-patterns.md
    │   ├── testing.md
    │   ├── storybook.md
    │   ├── interaction-patterns.md
    │   └── visual-rules.md
    ├── design-system/                # identidad visual transversal (iconos, tipografía, tokens)
    │   ├── icon-assets.md
    │   ├── typography.md
    │   └── design-tokens.md
    ├── architecture/                 # arquitectura del proyecto
    │   ├── overview.md
    │   ├── game-engine-scenes.md
    │   ├── content-model.md
    │   ├── challenge-engine-contract.md
    │   └── progress-persistence-model.md
    └── process/                      # convenciones del flujo de speckit (no gobernanza)
        └── contracts.md
```

## Contenido

* [`templates/convention-template.md`](./templates/convention-template.md) — plantilla
  de referencia para nuevos documentos de convención.

### `conventions/components/` — librería de componentes (`libs/components/`)

* [`structure.md`](./conventions/components/structure.md) — estructura mínima
  obligatoria de todo componente.
* [`css.md`](./conventions/components/css.md) — convención de CSS opcional
  co-localizado por componente (amplía `structure.md`).
* [`api-patterns.md`](./conventions/components/api-patterns.md) — patrones de API
  de componente: función factory, validación en runtime con fallback silencioso,
  nomenclatura de callbacks, tipos derivados de catálogos cerrados, composición
  de contenido y normalización numérica.
* [`testing.md`](./conventions/components/testing.md) — entorno de test
  (`happy-dom`) y estrategia de selectores (clases BEM + atributos ARIA, sin
  `data-testid`).
* [`storybook.md`](./conventions/components/storybook.md) — nomenclatura de
  historias, `autodocs` y cobertura de estados/variantes.
* [`interaction-patterns.md`](./conventions/components/interaction-patterns.md) —
  comportamiento de accesibilidad por tipo de componente (form controls,
  modales, pestañas, notificaciones, tooltips).
* [`visual-rules.md`](./conventions/components/visual-rules.md) — reglas
  transversales de estilos/tokens, iconografía, estabilidad de API y quality gates.

### `conventions/design-system/` — identidad visual transversal

* [`icon-assets.md`](./conventions/design-system/icon-assets.md) — checklist
  técnico y organización de ficheros para SVG personalizados (extraído de la
  constitución, sección Iconografía).
* [`typography.md`](./conventions/design-system/typography.md) — familias
  tipográficas, mapa de uso semántico y tokens de `src/styles/_typography.css`
  (extraído de la constitución, sección Tipografía).
* [`design-tokens.md`](./conventions/design-system/design-tokens.md) — catálogo
  de tokens de color, espaciado, radios, sombras y movimiento de `src/styles/`.

### `conventions/architecture/` — arquitectura del proyecto

* [`overview.md`](./conventions/architecture/overview.md) — visión general de la
  arquitectura: stack, layout de carpetas, límites de responsabilidad,
  tooling/pipeline de CI y estado real de implementación (documento de
  referencia; cualquier estructura/dependencia nueva pasa por aquí primero).
* [`game-engine-scenes.md`](./conventions/architecture/game-engine-scenes.md) —
  decisión anticipada: layout de `src/game/` (core vs. scenes) y separación
  lógica/renderizado del motor de juego (Phaser), antes de que exista código.
* [`content-model.md`](./conventions/architecture/content-model.md) — decisión
  anticipada: esquema conceptual `System > Destination > Expedition > Mission >
  Challenge` y cómo se referencian sus niveles entre sí.
* [`challenge-engine-contract.md`](./conventions/architecture/challenge-engine-contract.md) —
  decisión anticipada: contrato genérico de generación/validación de retos y
  registro de nuevos tipos de reto.
* [`progress-persistence-model.md`](./conventions/architecture/progress-persistence-model.md) —
  decisión anticipada: modelo de progreso por habilidad, versionado del esquema
  persistido y estrategia de almacenamiento local (sin backend).

### `conventions/process/` — convenciones del flujo de speckit

* [`contracts.md`](./conventions/process/contracts.md) — formato según la
  naturaleza del contrato (OpenAPI/GraphQL SDL/AsyncAPI/Markdown) y estructura
  obligatoria de los contratos Markdown: front matter, idioma, trazabilidad
  (extraído de la constitución, sección Contratos).

