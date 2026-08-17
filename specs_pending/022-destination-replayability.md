---
id: "022-destination-replayability"
name: "Rejugabilidad de destinos"
phase: "Fase 3 — Estructura de contenido, recompensas, rejugabilidad y experiencia de entrada"
depends_on: ["021-expedition-mission-structure"]
---

# 022 — Rejugabilidad de destinos (destination-replayability)

## Objetivo
Permitir volver a destinos ya completados y ofrecer incentivos de rejugabilidad no punitivos (estrellas pendientes, nuevos retos, mejores resultados).

## Contexto / motivación
El principio V exige explícitamente que los destinos sean rejugables y que la repetición no sea obligatoria ni penalizada. Este slice cierra ese requisito tras tener ya la estructura de expediciones/misiones (021).

## Alcance incluido
- Marcado de expediciones/misiones "completadas" vs. "con margen de mejora" (p. ej. estrellas pendientes).
- Regeneración de retos al rejugar una misión ya completada (usando el motor genérico + dificultad adaptativa según nivel actual del jugador, principio V).
- UI de mapa que permite volver a destinos previos sin bloquear el avance principal.
- Persistencia del mejor resultado obtenido por misión.

## Alcance excluido
- Generación procedural avanzada de variantes (ver 043; aquí basta con reutilizar el motor existente con nueva semilla/config).
- Sistema de recompensas cosmético más amplio (ver 024).

## Dependencias
- 021-expedition-mission-structure.

## Criterios de aceptación de alto nivel
- El jugador puede volver a un destino ya completado y jugar una misión de nuevo, recibiendo retos generados según su nivel actual (no los mismos retos exactos).
- No repetir contenido no bloquea el avance por la progresión principal.
- La repetición nunca se presenta como obligatoria ni penaliza el progreso existente.

## Alineación con la constitución
- **V. Destinos, expediciones, misiones, retos y rejugabilidad**: implementación directa.
- **I. Experiencia centrada en el niño**: rejugar es una opción motivadora, no una obligación frustrante.

## Frase de entrada sugerida para /speckit-specify
"Quiero permitir volver a destinos ya completados y rejugar sus misiones, regenerando retos según el nivel actual del jugador, marcando el progreso pendiente (p. ej. estrellas) sin penalizar ni obligar a repetir para avanzar en la progresión principal."
