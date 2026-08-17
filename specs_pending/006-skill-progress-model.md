---
id: "006-skill-progress-model"
name: "Modelo de progreso por habilidades"
phase: "Fase 1 — Motor de juego base y primer destino jugable"
depends_on: ["004-core-game-loop"]
---

# 006 — Modelo de progreso por habilidades (skill-progress-model)

## Objetivo
Definir e implementar el modelo de datos que representa el dominio del jugador por habilidad (counting, addition, memory, logic, reading, etc.), independiente de cualquier destino o reto concreto.

## Contexto / motivación
La constitución (principio IV) prohíbe asociar la dificultad a un destino/planeta concreto: el progreso MUST mantenerse por habilidad. Este modelo es prerrequisito de `007-challenge-engine-core` y de toda la dificultad adaptativa futura.

## Alcance incluido
- Definición de las habilidades iniciales soportadas (subconjunto de la lista de la constitución: counting, addition, memory, logic, reading, spatialReasoning, astronomy).
- Estructura de datos de nivel/dominio por habilidad (in-memory, sin persistencia todavía).
- API/funciones puras para leer y actualizar el dominio de una habilidad tras un resultado (acierto/fallo/pista usada).
- Tests unitarios de la lógica de actualización, sin dependencia de UI ni Phaser.

## Alcance excluido
- Persistencia en disco/localStorage (ver 011).
- Algoritmo de dificultad adaptativa final (ver 009, 042).
- UI de visualización de progreso (puede reutilizarse en dashboards futuros, ver 028).

## Dependencias
- 004-core-game-loop (opcional como contexto de integración; el modelo en sí es independiente de Phaser).

## Criterios de aceptación de alto nivel
- Existe un modelo de datos testeable que representa el nivel de dominio por habilidad, sin acoplarse a ningún destino concreto.
- Las funciones de actualización de dominio son puras y testeables con Vitest sin renderizar nada.
- El modelo permite que un jugador tenga niveles distintos en habilidades distintas (ejemplo de la constitución: Addition 7, Memory 8, Reading 4...).

## Alineación con la constitución
- **IV. Progresión adaptativa y por habilidades**: núcleo directo de este principio.
- **VII. Separación lógica/renderizado**: modelo puro, sin Phaser.
- **VI. Simplicidad primero**: estructura mínima, sin sobre-ingeniería antes de tener casos de uso reales.

## Frase de entrada sugerida para /speckit-specify
"Quiero definir el modelo de datos de progreso por habilidad del jugador (counting, addition, memory, logic, reading, spatialReasoning, astronomy), con funciones puras para leer y actualizar el nivel de dominio tras un resultado, completamente desacoplado de destinos y de Phaser."
