---
name: planet-docs-conventions
description: Apply this repository's docs/ conventions when creating, editing, or reviewing files under docs/conventions/, or when deciding whether a technical rule belongs in the constitution, in docs/, or in a feature's specs/NNN-feature/contracts/. Use when asked to "document a convention", "add to docs", "extract a rule from the constitution", or when a *.md file is created inside docs/.
---

# Convenciones de documentación interna (`docs/`)

Este repositorio usa tres capas de documentación normativa, cada una con una
responsabilidad distinta. Antes de crear o editar cualquier documento, decide en
cuál de las tres encaja:

| Capa | Contenido | Ejemplo |
|---|---|---|
| `.specify/memory/constitution.md` | Principios estables y transversales del proyecto (autoridad máxima). Reglas de gobernanza, no material de referencia consultable. | "MUST usar Phosphor Icons como librería principal" |
| `docs/conventions/<tema>/*.md` | Convenciones técnicas transversales (aplican a 2+ features o a toda una librería/sistema), agrupadas en subcarpetas por temática (`components/`, `design-system/`, ...), material de referencia consultable, no gobernanza. | Checklist técnico de SVG, mapa de tokens tipográficos, estructura mínima de un componente |
| `specs/NNN-feature/contracts/*.md` | Contratos específicos de una única feature o componente concreto. | API de props de un componente `Dialog` |

**Regla de decisión**: si el contenido es una regla de principio (por qué existe algo,
cuándo aplicarla, con qué criterio) → constitución. Si es una regla técnica concreta,
verificable, consumida por más de una feature (checklist, tabla de tokens, estructura
de carpetas con ejemplos) → `docs/conventions/`. Si es específico de una única feature
o componente → `contracts/` de esa feature.

Cuando dudes, aplica el mismo test que usa la propia constitución en su sección
"Precedencia documental": ¿esto es estable y transversal, o es detalle de una sola
feature? Lo primero puede quedarse en la constitución si es corto; si es extenso y
consultable (checklist, tabla, ejemplos), migra a `docs/` y deja solo un puntero +
la regla de principio en la constitución.

## Crear un nuevo documento en `docs/conventions/`

1. Decide la subcarpeta temática dentro de `docs/conventions/` (p. ej. `components/`
   para la librería de componentes, `design-system/` para identidad visual
   transversal, `architecture/` para decisiones de arquitectura y alternativas
   descartadas). Crea una subcarpeta nueva solo si el tema no encaja en ninguna
   existente; consulta [`docs/index.md`](../../../docs/index.md) para ver la
   estructura actual.
2. Copia la plantilla [`docs/templates/convention-template.md`](../../../docs/templates/convention-template.md)
   a `docs/conventions/<tema>/<nombre-en-kebab-case>.md`. El nombre del fichero MUST NOT
   repetir el nombre de la subcarpeta ni la palabra "convention(s)" (p. ej.
   `components/structure.md`, no `components/component-library-convention.md`).
3. Rellena el frontmatter con el esquema unificado (ver más abajo). No inventes
   campos nuevos: todos los documentos de `docs/conventions/` MUST compartir el
   mismo esquema para que sean intercambiables y fáciles de indexar.
4. Mantén la misma estructura de cuerpo que el resto de documentos de la carpeta:
   H1 → `**Fuente**` → (opcional `**Amplía**`) → (opcional cita de migración) →
   `## Propósito` → secciones de reglas → `## Fuera de alcance`.
5. Añade el nuevo fichero al índice de [`docs/index.md`](../../../docs/index.md).
6. Si el documento sustituye o extrae contenido de la constitución, dicha extracción
   MUST dejar en la constitución solo la regla de principio + un enlace relativo al
   nuevo documento, y MUST ir acompañada del bump de versión y el "Sync Impact
   Report" correspondientes (ver skill/flujo de `/speckit-constitution`).
7. Si el documento migra contenido desde `specs/NNN-feature/contracts/`, deja en el
   fichero original solo lo que sea específico de esa feature (p. ej. evidencia de
   auditoría), y documenta la migración con la cita `> Migrado desde ... el [fecha]`.

## Esquema de frontmatter unificado

```yaml
---
title: "Convención: <Título>"
type: "convention"
version: "1.0"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
status: "Draft" # Draft | In Review | Approved | Deprecated
source: "specs/NNN-feature-name/" # o "constitution.md (sección X)"
tags: [] # p. ej. frontend, architecture, design-system, accessibility
---
```

* `source` es el único campo de procedencia: no uses `origin`, `origin_feature` ni
  variantes — unifícalas siempre a `source`.
* `version` sube en MINOR cuando el documento amplía una convención existente sin
  romperla (usa `**Amplía**: [otro-doc.md](./otro-doc.md) (vX.Y)` en el cuerpo).
* `status` empieza en `"Draft"` hasta que el usuario confirme el contenido; solo
  entonces pasa a `"Approved"`.

## Al versionar un documento existente

* Actualiza `version` y `updated` en el frontmatter.
* Si el cambio amplía sin romper, añade/actualiza la línea `**Amplía**`.
* No reescribas retroactivamente evidencia histórica (p. ej. registros de auditoría
  dentro de `specs/NNN-feature/contracts/`): eso se conserva tal cual, solo se
  actualizan documentos "vivos" (README, quickstart, plan, docs/).

## Al mover o renombrar un documento

* Usa el terminal (`mv`/`git mv`), nunca recrees el fichero por otra vía.
* Actualiza todos los enlaces relativos afectados: dentro del propio `docs/conventions/`
  (enlaces entre documentos hermanos), en [`docs/index.md`](../../../docs/index.md), en
  la constitución si la referencia, y en cualquier `plan.md`/`quickstart.md`/`research.md`/
  `spec.md`/`README.md` "vivo" que lo enlace (usa una búsqueda de texto por el nombre
  antiguo del fichero para no dejar ninguno desactualizado).
* MUST NOT reescribir `tasks.md`: son historial de tareas ya completadas y conservan
  las rutas vigentes en el momento en que se ejecutaron.

## Verificación tras cualquier cambio

Ejecuta `npm run lint` y `npm test` tras migrar o crear documentos que referencien
rutas de código (p. ej. tokens CSS, estructura de ficheros), para confirmar que las
rutas y nombres citados siguen existiendo.
