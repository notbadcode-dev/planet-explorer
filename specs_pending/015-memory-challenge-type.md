---
id: "015-memory-challenge-type"
name: "Reto de memoria"
phase: "Fase 2 — Catálogo de retos por materia, audio y segundo destino"
depends_on: ["007-challenge-engine-core"]
---

# 015 — Reto de memoria (memory-challenge-type)

## Objetivo
Añadir el tipo de reto `memory` (emparejar/recordar secuencias u objetos), primer tipo de reto no puramente matemático, validando que el motor genérico soporta mecánicas distintas.

## Contexto / motivación
La constitución (principio II) lista "emparejar" y "memorizar" entre las mecánicas preferidas. Este es el primer reto basado en manipulación/reconocimiento visual en lugar de cálculo numérico.

## Alcance incluido
- Config data-driven `MemoryChallengeConfig` (número de pares/elementos, tiempo de exposición si aplica, dificultad por cantidad de elementos).
- Generación de un set de elementos (iconos/objetos temáticos del juego) y validación de la secuencia/emparejamiento del jugador.
- Integración con el modelo de habilidad `memory` (006).
- Tests unitarios de generación y validación sin UI.

## Alcance excluido
- Escena Phaser final de presentación visual (se prototipa mínimamente aquí; el pulido de UI/animación puede ser parte de esta spec o derivarse a una futura si el research lo aconseja).
- Integración en un destino narrativo específico (puede combinarse en 021/044).

## Dependencias
- 007-challenge-engine-core.

## Criterios de aceptación de alto nivel
- El motor genera retos de memoria con dificultad configurable por cantidad de elementos.
- La validación de la respuesta del jugador (secuencia u emparejamiento correcto) funciona de forma pura y testeable.
- El resultado alimenta el modelo de habilidad `memory`.

## Alineación con la constitución
- **II. Juego antes que ejercicio**: mecánica de emparejar/recordar, no un test de memoria abstracto.
- **IX. Contenido dirigido por datos**: dificultad controlada por configuración explícita.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un nuevo tipo de reto 'memory' (emparejar o recordar una secuencia de elementos), configurado de forma data-driven por cantidad de elementos y dificultad, integrado con el modelo de habilidad memory, reutilizando el motor genérico de retos."
