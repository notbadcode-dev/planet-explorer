---
id: "044-cross-skill-missions"
name: "Misiones que combinan varias habilidades"
phase: "Fase 6 — Progresión avanzada y contenido data-driven"
depends_on: ["021-expedition-mission-structure", "043-mission-variability-engine"]
---

# 044 — Misiones que combinan varias habilidades (cross-skill-missions)

## Objetivo
Permitir que una misión combine retos de distintas habilidades (p. ej. counting + logic + memory en la misma misión), reforzando que un destino no es una categoría escolar única.

## Contexto / motivación
El principio II establece explícitamente que "un mismo destino MAY contener retos de diferentes materias y habilidades". Hasta ahora (021) las misiones agrupaban principalmente retos de un mismo tipo por destino; este slice generaliza esa capacidad.

## Alcance incluido
- Extensión del modelo de misión (021) para admitir una lista heterogénea de tipos de reto en una misma misión.
- Actualización del cálculo de dificultad adaptativa (042) para tratar correctamente el progreso de múltiples habilidades dentro de una misma misión.
- Al menos un ejemplo real aplicado a un destino existente (p. ej. cinturón de asteroides, 038, ya combina counting+logic; puede formalizarse aquí o crear un nuevo ejemplo).

## Alcance excluido
- Nuevos tipos de reto.
- Nuevos destinos (reutiliza los ya existentes).

## Dependencias
- 021, 043 (para variabilidad combinada con múltiples habilidades).

## Criterios de aceptación de alto nivel
- Una misión puede combinar retos de al menos dos habilidades distintas, actualizando correctamente el progreso de cada una por separado.
- Los destinos MUST NOT sentirse como "categorías escolares"; la combinación se valida contra el principio II mediante revisión de diseño narrativo.

## Alineación con la constitución
- **II. Juego antes que ejercicio**: aplicación literal ("un mismo destino MAY contener retos de diferentes materias y habilidades").
- **IV. Progresión por habilidades**: el progreso de cada habilidad se mantiene independiente incluso dentro de una misión combinada.

## Frase de entrada sugerida para /speckit-specify
"Quiero permitir que una misión combine retos de distintas habilidades (por ejemplo counting, logic y memory) dentro de un mismo destino, actualizando correctamente el progreso independiente de cada habilidad implicada."
