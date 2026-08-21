---
id: "010-hints-and-retry-flow"
name: "Pistas y reintento sin penalización"
phase: "Fase 1 — Motor de juego base y primer destino jugable"
depends_on: ["007-challenge-engine-core", "008-moon-destination-counting"]
status: "Implemented"
---

# 010 — Pistas y reintento sin penalización (hints-and-retry-flow)

**Implementado en**: specs/010-hints-and-retry-flow/

## Objetivo
Añadir un sistema transversal de pistas y de reintento tras una respuesta incorrecta, reutilizable por cualquier tipo de reto del motor genérico.

## Contexto / motivación
El principio I exige explícitamente permitir repetir una acción tras un error, permitir reintentar respuestas incorrectas y evitar penalizaciones frustrantes; también exige feedback inmediato. Actualmente (008) el reintento es ad-hoc; este slice lo formaliza como parte del motor de retos.

## Alcance incluido
- Extensión del contrato `Challenge` para soportar una o más pistas progresivas opcionales.
- Flujo de UI/escena: al fallar, mostrar feedback amable + opción de reintentar o pedir pista.
- Registro de "pista usada" como señal para el modelo de habilidades (006) y la dificultad adaptativa (009), sin penalizar puntuación de forma punitiva.
- Aplicable de forma transversal al reto `counting` existente.

## Alcance excluido
- Nuevos tipos de reto (siguen en specs de Fase 2).
- Contenido específico de las pistas para tipos de reto aún no creados (se añadirá junto a cada tipo nuevo).

## Dependencias
- 007-challenge-engine-core, 008-moon-destination-counting.

## Criterios de aceptación de alto nivel
- Tras una respuesta incorrecta, el jugador puede reintentar sin penalización visible ni pérdida de progreso.
- El jugador puede solicitar una pista, y su uso se registra como señal (no como castigo).
- El comportamiento es consistente y reutilizable para cualquier tipo de reto futuro sin modificar el motor central.

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: aplicación directa (reintento, pistas, ausencia de frustración).
- **IV. Progresión adaptativa**: el uso de pistas es una señal válida para la dificultad adaptativa.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un sistema transversal de pistas progresivas y reintento sin penalización tras una respuesta incorrecta, integrado en el motor genérico de retos, de forma que el uso de una pista se registre como señal para el progreso y la dificultad adaptativa, nunca como castigo visible para el jugador."
