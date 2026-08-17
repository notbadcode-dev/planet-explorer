---
id: "036-mvp-release-checklist"
name: "Checklist de release estable (MVP)"
phase: "Fase 4 — Gate de publicación estable (MVP)"
depends_on: ["030-security-and-privacy-baseline", "031-responsive-cross-device-support", "032-legal-credits-attribution", "033-error-monitoring", "034-automated-e2e-testing", "035-ci-cd-pipeline"]
---

# 036 — Checklist de release estable (MVP) (mvp-release-checklist)

## Objetivo
Definir y ejecutar el checklist final de "Definition of Done" que determina que el proyecto está listo para su primera publicación pública estable (v1.0.0): un cierre explícito de la Fase 4 (Gate de publicación estable) que verifica, de forma consolidada, todo lo construido en las Fases 1-4 (specs 004-035) contra los Quality Gates de la constitución y contra los criterios de "estable para publicar y jugar" planteados como objetivo del roadmap completo.

## Contexto / motivación
Las specs 004-035 construyen, de forma incremental, un juego jugable (Fases 1-3) y lo endurecen para producción (Fase 4: seguridad/privacidad, responsive, créditos legales, monitorización de errores, E2E, CI/CD). Sin embargo, ninguna spec individual verifica el CONJUNTO: es fácil completar cada slice por separado y aun así publicar con una combinación de huecos (p. ej. responsive corregido pero sin monitorización de errores activa, o viceversa). Esta spec es deliberadamente la última de la Fase 4: no añade funcionalidad nueva, sino que cierra el gate con una verificación explícita, trazable y repetible, alineada con los "Quality Gates" ya definidos en la constitución (gate de especificación, gate previo al diseño, gate posterior al diseño) y con el proceso de release ya documentado (SemVer + tag de git sobre `master` tras merge `--no-ff` desde `develop`, sin ramas `release/*`).

## Alcance incluido
- Checklist consolidado de "listo para publicar", agrupado por área, verificable de forma objetiva (no subjetiva):
 - **Jugabilidad núcleo (Fases 1-3)**: bucle de juego, BOT-6, progreso por habilidad, motor de retos, al menos Luna y Marte completos con sus tipos de reto, dificultad adaptativa v1, pistas/reintentos, persistencia local, rejugabilidad, astronomía real, recompensas no manipulativas, mapa, onboarding, accesibilidad infantil, panel parental y multi-perfil — todos con sus criterios de aceptación propios ya cumplidos.
 - **Endurecimiento de producción (Fase 4)**: línea base de seguridad/privacidad (030), soporte responsive multi-dispositivo (031), créditos/atribuciones legales (032), monitorización de errores (033), suite E2E (034) y pipeline de CI/CD (035), todos con sus propios criterios de aceptación ya cumplidos.
 - **Quality Gates de la constitución**: repaso explícito del Gate de especificación, Gate previo al diseño y Gate posterior al diseño de la constitución aplicado retrospectivamente al conjunto ya construido, documentando cualquier desviación justificada en `Complexity Tracking`.
 - **Principios NON-NEGOTIABLE**: verificación explícita y documentada de que ninguna funcionalidad construida viola el principio I (sin ads/IAP/loot boxes/FOMO/pérdida de progreso) ni el principio III (ficción y astronomía real siguen siendo distinguibles).
- Ejecución del proceso de release ya documentado: merge `--no-ff` `develop` → `master`, tag `v1.0.0`, verificación de que el pipeline de CD (035) despliega correctamente a GitHub Pages.
- Documento de resultado del checklist (aprobado/con excepciones documentadas) que sirve de registro histórico de la primera publicación estable.

## Alcance excluido
- Nueva funcionalidad de producto (esta spec es puramente de verificación y cierre, no de construcción).
- Contenido de las Fases 5-8 (expansión del sistema solar, motor de dificultad avanzado, i18n, rendimiento, PWA, herramientas de autoría, exoplanetas, personalización, eventos estacionales, modo docente, accesibilidad asistiva): explícitamente NO son bloqueantes para v1.0.0; el juego debe ser "estable para publicar y jugar" con el alcance de Fases 1-4, no con el roadmap completo.

## Dependencias
- 030, 031, 032, 033, 034, 035 (los seis slices de endurecimiento de la Fase 4), y transitivamente todo lo construido en 004-029 (Fases 1-3), que debe estar ya completo y verificado antes de iniciar este checklist.

## Criterios de aceptación de alto nivel
- Todos los ítems del checklist consolidado están marcados como cumplidos o tienen una excepción explícitamente documentada y justificada (no hay ítems ambiguos o "pendientes" sin decisión).
- Los tres Quality Gates de la constitución se han repasado explícitamente contra el estado actual del proyecto, con cualquier desviación registrada en `Complexity Tracking`.
- Se ha verificado de forma activa que ninguna funcionalidad existente viola los principios I o III (NON-NEGOTIABLE).
- El release `v1.0.0` se ha cortado siguiendo el proceso documentado (merge `develop`→`master`, tag SemVer) y el pipeline de CD ha desplegado correctamente a producción.
- Existe un documento de resultado del checklist, fechado y trazable, que constituye el registro de que el proyecto alcanzó el estado "estable para publicar y jugar".

## Alineación con la constitución
- **Quality Gates**: esta spec es, en esencia, la aplicación explícita y consolidada de los tres Quality Gates de la constitución sobre el conjunto de lo construido hasta la Fase 4.
- **I y III (NON-NEGOTIABLE)**: verificación final explícita antes de la primera exposición pública del producto.
- **VI. Simplicidad primero**: el checklist es proporcional (una lista verificable, no un proceso de auditoría externo o certificación formal).

## Frase de entrada sugerida para /speckit-specify
"Quiero definir y ejecutar el checklist final de publicación estable (v1.0.0) que verifica de forma consolidada toda la jugabilidad núcleo (Fases 1-3) y el endurecimiento de producción (seguridad/privacidad, responsive, créditos, monitorización de errores, E2E, CI/CD de la Fase 4) contra los Quality Gates y los principios no negociables de la constitución, y que culmina con el corte del release v1.0.0 siguiendo el proceso de git-flow ya documentado."
