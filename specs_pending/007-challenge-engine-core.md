---
id: "007-challenge-engine-core"
name: "Motor genérico de retos"
phase: "Fase 1 — Motor de juego base y primer destino jugable"
depends_on: ["006-skill-progress-model"]
status: "Implemented"
---

# 007 — Motor genérico de retos (challenge-engine-core)

**Implementado en**: [specs/007-challenge-engine-core/](../specs/007-challenge-engine-core/spec.md)

## Objetivo
Construir el motor genérico de generación y validación de retos (challenges), desacoplado de Phaser y de cualquier tipo de reto concreto, junto con el primer tipo real: `counting`.

## Contexto / motivación
El principio VII exige que la generación de retos y la validación de respuestas puedan ejecutarse sin una `Phaser.Scene`. Este motor es la base reutilizable para todos los tipos de reto futuros (addition, memory, logic, reading, spatialReasoning...).

## Alcance incluido
- Interfaz genérica `Challenge` / `ChallengeConfig` y contrato de generación (`generateChallenge(config)`) y validación (`validateAnswer(challenge, answer)`).
- Primer tipo de reto implementado: `counting`, con configuración data-driven (rango de valores, dificultad mínima/máxima).
- Integración con el modelo de habilidades (006) para registrar resultado tras validar.
- Tests unitarios exhaustivos del motor y del tipo `counting`.

## Alcance excluido
- Otros tipos de reto (addition, subtraction, memory...) — cada uno es una spec futura que reutiliza este motor.
- UI/escena Phaser de presentación del reto (ver 008).
- Dificultad adaptativa (ver 009).

## Dependencias
- 006-skill-progress-model.

## Criterios de aceptación de alto nivel
- El motor genera y valida retos `counting` sin ninguna dependencia de renderizado.
- Añadir un nuevo tipo de reto en el futuro no debe requerir modificar el motor genérico (principio IX, contenido data-driven).
- Los resultados de validación pueden alimentar el modelo de habilidades sin acoplamiento fuerte.

## Alineación con la constitución
- **VII. Separación lógica/renderizado**: núcleo directo del principio.
- **IX. Contenido dirigido por datos**: configuración explícita y testable (`AdditionChallengeConfig`-like).
- **VI. Simplicidad primero**: interfaz mínima que cubre el primer caso real antes de generalizar de más.

## Frase de entrada sugerida para /speckit-specify
"Quiero construir un motor genérico de retos (generación y validación) desacoplado de Phaser, con una interfaz reutilizable para futuros tipos de reto, implementando primero el tipo 'counting' de forma data-driven e integrado con el modelo de progreso por habilidades."
