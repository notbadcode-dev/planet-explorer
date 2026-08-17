---
id: "034-ci-cd-pipeline"
name: "Pipeline de CI/CD"
phase: "Fase 4 — Gate de publicación estable (MVP)"
depends_on: ["033-automated-e2e-testing"]
---

# 034 — Pipeline de CI/CD (ci-cd-pipeline)

## Objetivo
Consolidar, como parte del Gate de publicación estable (Fase 4), un pipeline de integración y despliegue continuo que ejecute lint, tests unitarios y el smoke E2E (033) en cada cambio, con despliegue automatizado a producción (GitHub Pages) tras cada release. Esta es la versión MÍNIMA necesaria para publicar; la Fase 7 (ver 049-visual-regression-testing) la EXTENDERÁ más adelante añadiendo regresión visual, sin bloquear la primera publicación por su ausencia.

## Contexto / motivación
Con lint/test/build ya funcionando manualmente (`.github/workflows/ci.yml`) y el smoke E2E de 033 recién definido, este slice los conecta en un pipeline reproducible que bloquea el merge/despliegue ante regresiones, evitando que la validación dependa de ejecutarla manualmente antes de cada release. La regresión visual (049) es deliberadamente NO bloqueante para el primer release público: añadirla aquí introduciría una dependencia hacia una fase muy posterior (Fase 7) sin necesidad real todavía (principio VI).

## Alcance incluido
- Pipeline de CI (lint, build, tests unitarios, smoke E2E) en cada pull request y en push a `develop`/`master`.
- Pipeline de CD hacia producción (GitHub Pages) tras merge a `master`, siguiendo el modelo git-flow ya usado en el repo.
- Notificación clara de fallos por etapa.
- Punto de extensión documentado para que 049 (Fase 7) añada el job de regresión visual sin rediseñar el pipeline.

## Alcance excluido
- Infraestructura de servidores propia (el juego es una app cliente; el despliegue es de assets estáticos).
- Feature flags avanzados (fuera de alcance salvo necesidad futura justificada).
- Regresión visual automatizada (ver 049, Fase 7 — se añade a este mismo pipeline más adelante, no lo bloquea).
- Entorno de staging separado (fuera de alcance para un proyecto de este tamaño; producción se valida en `develop` antes de mergear a `master`, principio VI).

## Dependencias
- 033 (smoke E2E).

## Criterios de aceptación de alto nivel
- Cada pull request ejecuta automáticamente lint, tests unitarios y el smoke E2E, bloqueando el merge si falla algo crítico.
- El despliegue a producción tras merge a `master` es reproducible y no depende de pasos manuales.
- Añadir el job de regresión visual (049) en el futuro no requiere rediseñar el pipeline.

## Alineación con la constitución
- **VI. Simplicidad primero**: pipeline proporcional al tamaño del proyecto (app estática), sin infraestructura especulativa.

## Frase de entrada sugerida para /speckit-specify
"Quiero consolidar un pipeline de CI/CD que ejecute lint, tests unitarios, E2E y regresión visual en cada pull request, y despliegue automáticamente a staging/producción siguiendo el flujo de git-flow ya usado en el repositorio, sin introducir infraestructura de servidor innecesaria."
