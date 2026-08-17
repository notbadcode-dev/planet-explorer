---
id: "017-logic-challenges"
name: "Reto de lógica"
phase: "Fase 2 — Catálogo de retos por materia, audio y segundo destino"
depends_on: ["007-challenge-engine-core"]
---

# 017 — Reto de lógica (logic-challenges)

## Objetivo
Añadir el tipo de reto `logic`, centrado en clasificar y ordenar objetos según una regla simple (por tamaño, color, categoría).

## Contexto / motivación
"logic" es una habilidad explícita de la constitución y "clasificar"/"ordenar" son mecánicas recomendadas (principio II). Este reto trabaja razonamiento lógico básico sin necesidad de lectura.

## Alcance incluido
- Config data-driven `LogicChallengeConfig` (tipo de regla de clasificación/orden, número de elementos, número de categorías).
- Generación de un set de elementos y la regla a aplicar; validación de la clasificación/orden del jugador.
- Integración con el modelo de habilidad `logic`.

## Alcance excluido
- Reglas de lógica complejas (deducción multi-paso) — quedaría para una spec de "advanced-skill-tiers" (053) si se justifica.
- Integración narrativa específica (se resuelve en destinos existentes/futuros).

## Dependencias
- 007-challenge-engine-core.

## Criterios de aceptación de alto nivel
- El motor genera retos de clasificación/orden con una única solución válida clara.
- La dificultad es configurable por número de elementos/categorías.
- Tests unitarios cubren generación y validación.

## Alineación con la constitución
- **II. Juego antes que ejercicio**: "clasificar" y "ordenar" como mecánicas explícitas.
- **IV. Progresión por habilidades**: habilidad `logic` independiente.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un nuevo tipo de reto 'logic' de clasificación u ordenación de elementos según una regla simple (tamaño, color, categoría), configurado de forma data-driven, integrado con el modelo de habilidad logic."
