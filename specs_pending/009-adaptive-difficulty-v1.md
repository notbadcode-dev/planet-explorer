---
id: "009-adaptive-difficulty-v1"
name: "Dificultad adaptativa v1"
phase: "Fase 1 — Motor de juego base y primer destino jugable"
depends_on: ["006-skill-progress-model", "007-challenge-engine-core"]
---

# 009 — Dificultad adaptativa v1 (adaptive-difficulty-v1)

## Objetivo
Implementar la primera versión del ajuste de dificultad de los retos generados, basada en el rendimiento reciente del jugador en una habilidad concreta.

## Contexto / motivación
El principio IV exige que la dificultad se adapte al rendimiento (aciertos, fallos, intentos, pistas usadas) y prohíbe explícitamente usar la velocidad de respuesta como criterio principal. Este slice conecta el modelo de habilidades (006) con el motor de retos (007) para cerrar el primer bucle adaptativo real.

## Alcance incluido
- Función pura que, dado el historial reciente de resultados de una habilidad, ajusta los parámetros de configuración del siguiente reto (p. ej. rango numérico de `counting`).
- Reglas explícitas y testables de subida/bajada de dificultad (sin IA/ML, ver nota de simplicidad).
- Integración con `007-challenge-engine-core` para que la config generada use el resultado del ajuste.
- Tests unitarios que cubran escenarios de mejora, empeoramiento y estabilidad.

## Alcance excluido
- Señales avanzadas (uso extensivo de pistas ponderado, dificultad de retos recientes combinada con múltiples habilidades) — ver 042.
- UI de mostrar "subida/bajada de nivel" al niño (MUST NOT mostrarse como fracaso, principio IV).
- Cualquier uso del tiempo de respuesta como criterio principal (explícitamente prohibido).

## Dependencias
- 006-skill-progress-model, 007-challenge-engine-core.

## Criterios de aceptación de alto nivel
- Tras varios aciertos consecutivos en una habilidad, la configuración del siguiente reto es más difícil; tras varios fallos, más fácil.
- El tiempo de respuesta no influye en el ajuste.
- Una bajada de dificultad interna nunca se comunica al niño como penalización o pérdida de nivel.
- La lógica es 100% testeable sin Phaser.

## Alineación con la constitución
- **IV. Progresión adaptativa y por habilidades**: implementación directa del principio, incluyendo la prohibición sobre velocidad de respuesta.
- **I. Experiencia centrada en el niño**: ninguna bajada de dificultad se percibe como fracaso.
- **VI. Simplicidad primero**: reglas explícitas, no un sistema de ML especulativo.

## Frase de entrada sugerida para /speckit-specify
"Quiero implementar una primera versión de dificultad adaptativa: una función pura que, según el historial reciente de aciertos/fallos/pistas de una habilidad, ajuste los parámetros del siguiente reto generado por el motor de retos, sin usar nunca el tiempo de respuesta como criterio y sin mostrar nunca una bajada de dificultad como fracaso al jugador."
