---
id: "020-spatial-reasoning-challenges"
name: "Reto de orientación espacial"
phase: "Fase 2 — Catálogo de retos por materia, audio y segundo destino"
depends_on: ["007-challenge-engine-core"]
---

# 020 — Reto de orientación espacial (spatial-reasoning-challenges)

## Objetivo
Añadir el tipo de reto `spatialReasoning`, centrado en resolver rutas simples o mover/orientar objetos en una cuadrícula o escena.

## Contexto / motivación
"spatialReasoning" es una habilidad explícita de la constitución, y "mover" y "resolver rutas" son mecánicas recomendadas (principio II). Cierra el catálogo inicial de tipos de reto planificado para la Fase 2.

## Alcance incluido
- Config data-driven `SpatialChallengeConfig` (tamaño de cuadrícula/mapa simple, número de obstáculos).
- Generación de un mini-puzzle de ruta u orientación con solución verificable.
- Validación de la solución propuesta por el jugador (arrastrar/mover u orden de pasos).
- Integración con el modelo de habilidad `spatialReasoning`.

## Alcance excluido
- Motor de pathfinding genérico complejo (mantener el algoritmo mínimo necesario, principio VI).
- Integración narrativa específica (se resuelve en destinos existentes/futuros).

## Dependencias
- 007-challenge-engine-core.

## Criterios de aceptación de alto nivel
- El motor genera puzzles de ruta/orientación con al menos una solución válida verificable automáticamente.
- La dificultad es configurable por tamaño/obstáculos.
- Tests unitarios cubren generación y validación sin UI.

## Alineación con la constitución
- **II. Juego antes que ejercicio**: "mover", "explorar", "resolver rutas" mencionados explícitamente.
- **VI. Simplicidad primero**: algoritmo de generación/validación mínimo suficiente, sin sobre-ingeniería.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un nuevo tipo de reto 'spatialReasoning' de resolver una ruta simple o mover/orientar objetos en una cuadrícula pequeña, con solución verificable automáticamente, configurado de forma data-driven e integrado con el modelo de habilidad spatialReasoning."
