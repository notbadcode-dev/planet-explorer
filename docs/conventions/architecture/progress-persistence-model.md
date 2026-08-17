---
title: "Convención: Modelo de progreso por habilidad y persistencia"
type: "convention"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Draft"
source: "constitution.md (principio IV 'Progresión adaptativa y por habilidades'; sección 'CI/CD y despliegue', compatibilidad GitHub Pages)"
tags: [architecture, game-engine, progress, persistence]
---

# Convención: Modelo de progreso por habilidad y persistencia

**Fuente**: `constitution.md` (principio IV; sección "Compatibilidad con GitHub Pages").

> Documento de **decisión anticipada**: fija el modelo de datos y la estrategia de
> almacenamiento antes de implementarlos, para que `specs_pending/006-skill-progress-model.md`
> y `specs_pending/011-save-progress-local.md` los implementen directamente en lugar
> de decidirlos desde cero, y para que specs posteriores (`012-player-name-identity.md`,
> `029-multi-profile-support.md`, `049-analytics-privacy-safe.md`) sepan qué pueden
> extender sin rediseñar la base.

## Propósito

Fijar cómo se modela el dominio del jugador por habilidad, cómo se persiste
localmente sin backend (requisito de GitHub Pages) y cómo se garantiza que este
modelo pueda crecer (nuevas habilidades, multi-perfil) sin romper el contenido ya
guardado.

## Reglas de la convención

* **R1**: El progreso se modela por habilidad (`skill`), identificada por una clave
  de un catálogo cerrado y extensible (`counting`, `addition`, `subtraction`,
  `multiplication`, `division`, `sequences`, `comparison`, `memory`, `logic`,
  `reading`, `problemSolving`, `spatialReasoning`, `astronomy`, según la lista de la
  constitución) — nunca por destino, expedición o misión (principio IV).
* **R2**: El esquema persistido MUST incluir un campo de versión de esquema
  (`schemaVersion`) explícito. Cualquier cambio de forma del dato MUST acompañarse
  de una función de migración; nunca se asume que los datos existentes ya tienen la
  forma nueva.
* **R3**: Ante datos ausentes (primera sesión) o corruptos, la carga MUST devolver
  de forma segura un estado inicial válido — nunca MUST NOT romper el arranque del
  juego (alineado con principio I, ausencia de frustración).
* **R4**: El mecanismo de almacenamiento es local al navegador (`localStorage` u
  equivalente), sin backend ni sincronización remota, en coherencia con la
  compatibilidad obligatoria con GitHub Pages (hosting estático, sin ejecución
  server-side).
* **R5**: Los datos de progreso educativo (dominio por habilidad, destinos
  completados) MUST mantenerse en una estructura separada de los datos cosméticos/
  de recompensas (`specs_pending/024`, `054`, `055`), para que extender uno no
  requiera tocar el otro.
* **R6**: Las funciones de lectura/escritura de progreso MUST ser puras y testeables
  con Vitest sin necesidad de un navegador real (mock de storage), coherente con el
  principio VII (separación lógica/renderizado).
* **R7**: El modelo MUST diseñarse desde el inicio para admitir múltiples perfiles
  bajo una misma instalación (namespacing por `profileId`) aunque el soporte
  multi-perfil en sí (`specs_pending/029-multi-profile-support.md`) se implemente
  después — evita un rediseño estructural posterior no justificado por YAGNI, ya que
  es un caso de uso ya previsto explícitamente en el roadmap.
* **R8**: El nombre del jugador y un puntero mínimo a la última ubicación de
  navegación conocida (para reanudar la sesión, `specs_pending/012-player-name-identity.md`)
  se guardan con este mismo mecanismo de persistencia, bajo el mismo `profileId`
  (R7) — no se introduce un almacenamiento paralelo solo para la identidad.

## Fuera de alcance

* El algoritmo de ajuste de dificultad que consume este modelo — ver
  `specs_pending/009-adaptive-difficulty-v1.md` / `042-difficulty-tuning-v2.md` y el
  contrato del motor de retos en
  [`challenge-engine-contract.md`](./challenge-engine-contract.md).
* La gestión completa de perfiles (creación, borrado, selección visual) — ver
  `specs_pending/029-multi-profile-support.md`.
* Sincronización remota entre dispositivos o backend propio — explícitamente fuera
  de alcance mientras el hosting sea GitHub Pages estático (ver constitución,
  "Compatibilidad con GitHub Pages").
* Analítica agregada sobre estos datos — ver
  `specs_pending/049-analytics-privacy-safe.md`.
