---
id: "016-sequence-pattern-challenges"
name: "Reto de patrones y secuencias"
phase: "Fase 2 — Catálogo de retos por materia, audio y segundo destino"
depends_on: ["007-challenge-engine-core"]
---

# 016 — Reto de patrones y secuencias (sequence-pattern-challenges)

## Objetivo
Añadir el tipo de reto `sequences` centrado en reconocimiento de patrones (completar la secuencia, encontrar el elemento que no encaja).

## Contexto / motivación
"sequences" y "comparison" aparecen explícitamente en la lista de habilidades de la constitución. Este reto trabaja reconocimiento de patrones visuales/numéricos simples, mecánica clave para el desarrollo lógico a los 6 años.

## Alcance incluido
- Config data-driven `SequenceChallengeConfig` (tipo de patrón: numérico simple, por color/forma; longitud de la secuencia).
- Generación de secuencias con un elemento oculto/incorrecto a identificar o completar.
- Validación de la respuesta del jugador.
- Integración con el modelo de habilidad `sequences`.

## Alcance excluido
- Contenido narrativo/destino específico (se integra en destinos existentes o futuros vía 021/044).
- Patrones combinados con otras habilidades (ver 044).

## Dependencias
- 007-challenge-engine-core.

## Criterios de aceptación de alto nivel
- El motor genera secuencias válidas con exactamente una solución correcta clara para la edad objetivo.
- La dificultad es configurable por longitud/tipo de patrón.
- Tests unitarios cubren generación y validación sin UI.

## Alineación con la constitución
- **II. Juego antes que ejercicio**: mecánica de "ordenar"/"clasificar" mencionada explícitamente.
- **IV. Progresión por habilidades**: habilidad `sequences` independiente de otras.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un nuevo tipo de reto 'sequences' de reconocimiento de patrones (completar una secuencia o encontrar el elemento que no encaja), configurado de forma data-driven por longitud y tipo de patrón, integrado con el modelo de habilidad sequences."
