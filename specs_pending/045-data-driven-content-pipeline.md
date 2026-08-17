---
id: "045-data-driven-content-pipeline"
name: "Pipeline de contenido data-driven"
phase: "Fase 6 — Progresión avanzada y contenido data-driven"
depends_on: ["021-expedition-mission-structure", "023-astronomy-facts-module"]
---

# 045 — Pipeline de contenido data-driven (data-driven-content-pipeline)

## Objetivo
Formalizar y documentar el pipeline de configuración (destinos, expediciones, misiones, retos, fichas astronómicas) como datos versionados, validables y ampliables sin tocar código de lógica ni de renderizado.

## Contexto / motivación
El principio IX exige que "nuevas expediciones, misiones y variantes SHOULD poder añadirse sin modificar contenido existente no relacionado". Tras varias specs añadiendo contenido de forma ad-hoc (008-041), este slice consolida el patrón en un pipeline formal y validado (schema + herramientas de validación).

## Alcance incluido
- Esquema formal (tipado/validado) de destino, expedición, misión, reto y ficha astronómica.
- Validación automática (script/test) de que todo el contenido existente cumple el esquema.
- Documentación de la convención para añadir contenido nuevo sin tocar el motor.
- Refactor mínimo del contenido existente para ajustarse al esquema formalizado si hubiera desviaciones.

## Alcance excluido
- Editor visual de contenido (ver 051).
- Nuevos tipos de reto o destinos (esta spec es de consolidación, no de contenido nuevo).

## Dependencias
- 021, 023, y todo el contenido creado hasta el momento.

## Criterios de aceptación de alto nivel
- Existe un esquema formal y validado automáticamente para todo el contenido del juego.
- Añadir un destino/misión/reto nuevo siguiendo la convención no requiere tocar el motor genérico ni otras specs de contenido.
- Todo el contenido existente pasa la validación del esquema.

## Alineación con la constitución
- **IX. Contenido dirigido por datos**: formalización directa del principio.
- **VI. Simplicidad primero**: consolidar antes de escalar más contenido (evita deuda técnica acumulada).

## Frase de entrada sugerida para /speckit-specify
"Quiero formalizar un esquema validado automáticamente para todo el contenido data-driven del juego (destinos, expediciones, misiones, retos, fichas astronómicas), documentando la convención para añadir contenido nuevo sin tocar el motor, y validar que el contenido existente cumple ese esquema."
