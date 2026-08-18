# Roadmap de `specs_pending/`

Este documento es el índice de navegación de los pre-specs (`specs_pending/*.md`) del proyecto "Explorador Espacial". No es una `spec.md` formal; es la entrada previa a `/speckit-specify` para cada slice, organizada en una Fase 0 (fundamentos ya construidos en `specs/`) más 8 fases de `specs_pending/`.

**Cómo leer este roadmap**: las fases son estrictamente secuenciales en su justificación (cada una asume que la anterior está terminada), pero dentro de una misma fase el orden numérico es solo una sugerencia razonable, no una dependencia rígida — consulta siempre el `depends_on` de cada fichero para el orden real vinculante.

**Hito crítico**: la **Fase 4** es el *gate* de publicación estable. Al completarla (spec 036), el proyecto alcanza la definición de "estable para publicar y jugar" (release `v1.0.0`). Las Fases 5-8 son expansión de contenido y calidad a largo plazo, explícitamente **no bloqueantes** para esa primera publicación.

**Leyenda de estado** (checkbox de cada spec, mismo formato que las tareas de `/speckit-tasks`, actualizar manualmente al avanzar):

- `[ ]` Pendiente — no iniciada
- `[X]` Hecha — mergeada en `develop`/`master` (o, si va acompañada de una nota "en progreso", con rama abierta y trabajo parcial — ver la nota junto al ítem)

## Fase 0 — Fundamentos ya construidos (fuera de `specs_pending/`, en `specs/`)

Estas specs viven en `specs/` (no en `specs_pending/`) porque ya pasaron por el ciclo completo de Spec Kit y son prerrequisito técnico de `004-core-game-loop` (librería de componentes `libs/components` reutilizada como UI fuera de canvas). Para cada una existe además una ficha retroactiva en formato `specs_pending/` (pre-spec), escrita a posteriori solo para que el roadmap tenga una entrada consistente:

- [X] [001-component-library-architecture.md](001-component-library-architecture.md) — Arquitectura de la librería de componentes ([spec.md](../specs/001-component-library-architecture/spec.md)) — Hecha
- [X] [002-button-variants.md](002-button-variants.md) — Variantes del componente Button ([spec.md](../specs/002-button-variants/spec.md)) — Hecha
- [ ] [003-shared-components-base.md](003-shared-components-base.md) — Base de 14 componentes compartidos ([spec.md](../specs/003-shared-components-base/spec.md)) — 🔄 En progreso (rama `003-crear-una-base`, Fases 1-6 y convergencia de accesibilidad completas; pendiente de mergear a `develop` y cerrar tareas menores de Phase 8 — tamaños/demos)

**Ninguna spec de `specs_pending/` numerada 004 en adelante tiene todavía código implementado** (no existe `src/game/`, ni dependencia de Phaser en `package.json`): todo el roadmap de abajo está pendiente.

---

## Fase 1 — Motor de juego base y primer destino jugable

Bucle de juego mínimo jugable de principio a fin, con un único destino real (la Luna) y persistencia.

- [ ] [004-core-game-loop.md](004-core-game-loop.md) — Bucle de juego base
- [ ] [005-bot6-narrative-shell.md](005-bot6-narrative-shell.md) — Cascarón narrativo de BOT-6 ([spec.md](../specs/005-bot6-narrative-shell/spec.md)) — 🔄 En progreso (rama `005-quiero-adir-bot`, tasks.md generado (18 tareas, US1+US2), pendiente `/speckit-implement`)
- [ ] [006-skill-progress-model.md](006-skill-progress-model.md) — Modelo de progreso por habilidades
- [ ] [007-challenge-engine-core.md](007-challenge-engine-core.md) — Motor genérico de retos
- [ ] [008-moon-destination-counting.md](008-moon-destination-counting.md) — Destino: la Luna con retos de conteo
- [ ] [009-adaptive-difficulty-v1.md](009-adaptive-difficulty-v1.md) — Dificultad adaptativa v1
- [ ] [010-hints-and-retry-flow.md](010-hints-and-retry-flow.md) — Pistas y reintento sin penalización
- [ ] [011-save-progress-local.md](011-save-progress-local.md) — Persistencia local de progreso
- [ ] [012-player-name-identity.md](012-player-name-identity.md) — Identidad del jugador: nombre y pantalla de bienvenida

## Fase 2 — Catálogo de retos por materia, audio y segundo destino

Ampliación del catálogo de tipos de reto (resta, memoria, secuencias, lógica, lectura, orientación espacial), audio, y un segundo destino (Marte) que valida que el motor de retos generaliza más allá de la Luna.

- [ ] [013-mars-destination-addition.md](013-mars-destination-addition.md) — Destino: Marte con retos de suma
- [ ] [014-subtraction-challenges.md](014-subtraction-challenges.md) — Reto de resta
- [ ] [015-memory-challenge-type.md](015-memory-challenge-type.md) — Reto de memoria
- [ ] [016-sequence-pattern-challenges.md](016-sequence-pattern-challenges.md) — Reto de patrones y secuencias
- [ ] [017-logic-challenges.md](017-logic-challenges.md) — Reto de lógica
- [ ] [018-audio-and-sound-design.md](018-audio-and-sound-design.md) — Audio y diseño de sonido
- [ ] [019-reading-challenges.md](019-reading-challenges.md) — Reto de lectura y lenguaje
- [ ] [020-spatial-reasoning-challenges.md](020-spatial-reasoning-challenges.md) — Reto de orientación espacial

## Fase 3 — Estructura de contenido, recompensas, rejugabilidad y experiencia de entrada

Formalización de la jerarquía System > Destination > Expedition > Mission > Challenge, rejugabilidad, recompensas no manipulativas, mapa como interfaz central, onboarding, auditoría de accesibilidad infantil, y herramientas para adultos (panel parental, multi-perfil).

- [ ] [021-expedition-mission-structure.md](021-expedition-mission-structure.md) — Estructura Destino > Expedición > Misión > Reto
- [ ] [022-destination-replayability.md](022-destination-replayability.md) — Rejugabilidad de destinos
- [ ] [023-astronomy-facts-module.md](023-astronomy-facts-module.md) — Módulo de datos astronómicos reales
- [ ] [024-reward-system-non-manipulative.md](024-reward-system-non-manipulative.md) — Sistema de recompensas no manipulativo
- [ ] [025-map-navigation-ui.md](025-map-navigation-ui.md) — Mejora del mapa como interfaz central
- [ ] [026-onboarding-first-session.md](026-onboarding-first-session.md) — Onboarding de primera sesión
- [ ] [027-accessibility-child-ux.md](027-accessibility-child-ux.md) — Auditoría de accesibilidad infantil
- [ ] [028-parental-dashboard.md](028-parental-dashboard.md) — Panel parental
- [ ] [029-multi-profile-support.md](029-multi-profile-support.md) — Soporte multi-perfil

## Fase 4 — Gate de publicación estable (MVP)

**Hito de publicación.** Ninguna funcionalidad nueva de producto; esta fase endurece lo construido en las Fases 1-3 para una primera exposición pública responsable, y cierra con un checklist explícito de "Definition of Done". Al completar 036, el proyecto está en `v1.0.0`.

- [ ] [030-security-and-privacy-baseline.md](030-security-and-privacy-baseline.md) — Línea base de seguridad y privacidad
- [ ] [031-responsive-cross-device-support.md](031-responsive-cross-device-support.md) — Soporte responsive multi-dispositivo
- [ ] [032-legal-credits-attribution.md](032-legal-credits-attribution.md) — Créditos y atribuciones legales
- [ ] [033-error-monitoring.md](033-error-monitoring.md) — Monitorización de errores
- [ ] [034-automated-e2e-testing.md](034-automated-e2e-testing.md) — Testing E2E de flujos de juego
- [ ] [035-ci-cd-pipeline.md](035-ci-cd-pipeline.md) — Pipeline de CI/CD
- [ ] [036-mvp-release-checklist.md](036-mvp-release-checklist.md) — **Checklist de release estable (MVP)** — cierre de fase

## Fase 5 — Expansión del sistema solar

Con el producto ya publicado y endurecido, se amplía el contenido dentro del sistema solar real: Júpiter, Saturno, cinturón de asteroides, Urano, Neptuno, cometas y nebulosas.

- [ ] [037-jupiter-saturn-destinations.md](037-jupiter-saturn-destinations.md) — Destinos: Júpiter y Saturno
- [ ] [038-asteroid-belt-expedition.md](038-asteroid-belt-expedition.md) — Expedición: cinturón de asteroides
- [ ] [039-outer-planets-uranus-neptune.md](039-outer-planets-uranus-neptune.md) — Destinos: Urano y Neptuno
- [ ] [040-dwarf-planets-pluto-ceres.md](040-dwarf-planets-pluto-ceres.md) — Destinos: planetas enanos (Plutón, Ceres)
- [ ] [041-comets-and-nebulae-content.md](041-comets-and-nebulae-content.md) — Cometas y nebulosas como expediciones especiales

## Fase 6 — Progresión avanzada y contenido data-driven

Con más contenido ya construido a mano en la Fase 5, se invierte en escalar el *cómo* se genera y ajusta ese contenido: dificultad adaptativa v2, variabilidad de misiones, misiones multi-habilidad, pipeline data-driven, e internacionalización.

- [ ] [042-difficulty-tuning-v2.md](042-difficulty-tuning-v2.md) — Dificultad adaptativa v2
- [ ] [043-mission-variability-engine.md](043-mission-variability-engine.md) — Motor de variabilidad de misiones
- [ ] [044-cross-skill-missions.md](044-cross-skill-missions.md) — Misiones que combinan varias habilidades
- [ ] [045-data-driven-content-pipeline.md](045-data-driven-content-pipeline.md) — Pipeline de contenido data-driven
- [ ] [046-localization-i18n.md](046-localization-i18n.md) — Internacionalización (i18n)

## Fase 7 — Calidad avanzada y escala

Con el volumen de contenido y de usuarios potencialmente mayor (i18n en 046), se invierte en calidad no bloqueante para el MVP pero relevante a escala: rendimiento, offline/PWA, analítica respetuosa con la privacidad, y regresión visual.

- [ ] [047-performance-optimization-phaser.md](047-performance-optimization-phaser.md) — Optimización de rendimiento (Phaser)
- [ ] [048-offline-pwa-support.md](048-offline-pwa-support.md) — Soporte offline / PWA
- [ ] [049-analytics-privacy-safe.md](049-analytics-privacy-safe.md) — Analítica de uso respetuosa con la privacidad
- [ ] [050-visual-regression-testing.md](050-visual-regression-testing.md) — Testing de regresión visual

## Fase 8 — Herramientas y crecimiento a largo plazo

Crecimiento de largo plazo del producto: herramientas de autoría, expansión más allá del sistema solar (exoplanetas), profundidad educativa avanzada, personalización cosmética, eventos, modo docente, y accesibilidad asistiva.

- [ ] [051-content-authoring-tools.md](051-content-authoring-tools.md) — Herramientas de autoría de contenido
- [ ] [052-exoplanet-systems-trappist1.md](052-exoplanet-systems-trappist1.md) — Sistemas exoplanetarios (TRAPPIST-1)
- [ ] [053-advanced-skill-tiers.md](053-advanced-skill-tiers.md) — Niveles de habilidad avanzados
- [ ] [054-ship-customization.md](054-ship-customization.md) — Personalización cosmética de la nave
- [ ] [055-companion-customization-bot6.md](055-companion-customization-bot6.md) — Personalización cosmética de BOT-6
- [ ] [056-seasonal-events-content.md](056-seasonal-events-content.md) — Eventos temporales de contenido
- [ ] [057-teacher-classroom-mode.md](057-teacher-classroom-mode.md) — Modo aula para docentes
- [ ] [058-accessibility-assistive-tech.md](058-accessibility-assistive-tech.md) — Accesibilidad avanzada (tecnologías de asistencia)

---

## Historial de cambios relevantes de este roadmap

- **Reordenación completa** (2026, sesión de auditoría): se pasó de una numeración plana 004-053 sin fases explícitas a la estructura de 8 fases anterior, con renumerado íntegro de los 50 ficheros originales y actualización de todas las referencias cruzadas (`depends_on`, prosa, y las 5 guías de arquitectura en `docs/conventions/architecture/`).
- **4 specs nuevas añadidas** en la Fase 4 (gate de publicación), identificadas como huecos reales para poder llamar al proyecto "estable para publicar y jugar": `029-security-and-privacy-baseline`, `030-responsive-cross-device-support`, `031-legal-credits-attribution`, `035-mvp-release-checklist` (numeración de esa sesión, antes de la inserción de 012 descrita más abajo).
- **Correcciones semánticas** aplicadas tras la reordenación para eliminar dependencias hacia adelante y referencias rotas (ver commits/historial de `specs_pending/` para el detalle línea a línea), incluyendo el rediseño de `024-map-navigation-ui` (numeración de esa misma sesión) para ser genérico/data-driven desde el principio en vez de depender de contenido de la Fase 5.
- **Spec adicional insertada** (2026-08-17): `012-player-name-identity` (nombre del jugador + pantalla de bienvenida/"Seguir jugando" en sesiones posteriores), al final de la Fase 1 justo después de `011-save-progress-local`. Esto desplazó en bloque toda la numeración desde `012` en adelante en una unidad (antiguo `012` → `013`, ..., antiguo `057` → `058`; los nombres citados en los dos puntos anteriores de este historial usan la numeración previa a este desplazamiento), sin alterar el orden relativo de fases ni de dependencias; verificado sin dependencias hacia adelante ni referencias huérfanas tras el desplazamiento.
- **Seguimiento de estado añadido** (2026-08-17): columna `Estado` en cada tabla (⬜/🔄/✅) y nueva sección "Fundamentos ya construidos" listando 001-003 (`specs/`, fuera de `specs_pending/`). A esta fecha, 001 y 002 están ✅ hechas, 003 está 🔄 en progreso (rama `003-crear-una-base`, pendiente de merge), y **ninguna** spec de `specs_pending/` (004-058) tiene código implementado todavía. Actualizar manualmente el símbolo de `Estado` de cada fila conforme se abra rama/PR o se mergee cada spec.
- **Fichas retroactivas 001-003** (2026-08-17): se crearon `001-component-library-architecture.md`, `002-button-variants.md` y `003-shared-components-base.md` dentro de `specs_pending/`, en el mismo formato de plantilla que el resto (pero marcadas explícitamente como reconstrucción retroactiva, escritas después de la implementación), cada una enlazando a su `spec.md` real en `specs/` como fuente vinculante. Solo documentan/resumen lo ya construido; no sustituyen ni reemplazan las specs formales en `specs/`.
- **Checkboxes de estado** (2026-08-17): las tablas con columna `Estado` (⬜/🔄/✅) se sustituyeron por listas de checklist `- [ ]`/`- [X]`, el mismo formato que usan los ficheros `tasks.md` generados por `/speckit-tasks`, para que marcar una spec como completada sea un simple `[ ]` → `[X]` consistente con el resto del proyecto.
- **Sección renombrada a "Fase 0"** (2026-08-17): "Fundamentos ya construidos" pasó a titularse "Fase 0 — Fundamentos ya construidos", para seguir la misma convención de encabezado `## Fase N — Título` que el resto de fases, en vez de ser una sección con formato distinto antes de la Fase 1.
