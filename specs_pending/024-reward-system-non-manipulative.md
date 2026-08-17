---
id: "024-reward-system-non-manipulative"
name: "Sistema de recompensas no manipulativo"
phase: "Fase 3 — Estructura de contenido, recompensas, rejugabilidad y experiencia de entrada"
depends_on: ["021-expedition-mission-structure", "022-destination-replayability"]
---

# 024 — Sistema de recompensas no manipulativo (reward-system-non-manipulative)

## Objetivo
Diseñar e implementar un sistema de recompensas (estrellas, descubrimientos, insignias narrativas) que motive sin recurrir a mecánicas manipulativas prohibidas por la constitución.

## Contexto / motivación
El principio I prohíbe explícitamente publicidad, compras dentro de la app, loot boxes, FOMO, rachas obligatorias, pérdida de progreso por no jugar, esperas artificiales y mecánicas manipulativas de retención. Este slice formaliza qué tipo de recompensas SÍ son válidas, conectando con las estrellas pendientes de 022.

## Alcance incluido
- Catálogo inicial de recompensas válidas: estrellas por misión, nuevos "descubrimientos" narrativos, insignias temáticas sin coste ni presión.
- Presentación de recompensas con feedback positivo inmediato (principio I) tras completar/mejorar una misión.
- Revisión explícita (checklist) de que ninguna recompensa introduce racha obligatoria, temporizador de presión o pérdida de progreso por inactividad.

## Alcance excluido
- Monetización de cualquier tipo (explícitamente prohibida, no aplica ni como "fuera de alcance a futuro").
- Eventos temporales (ver 056, que también debe respetar esta misma prohibición).

## Dependencias
- 021, 022.

## Criterios de aceptación de alto nivel
- Existe un sistema de recompensas visible y motivador que no depende de rachas, temporizadores de presión ni pérdida de progreso.
- Las recompensas son coherentes con la narrativa (descubrimientos, insignias) y no con mecánicas de monetización.
- Un checklist de cumplimiento del principio I se aplica y pasa para este sistema.

## Alineación con la constitución
- **I. Experiencia centrada en el niño (NON-NEGOTIABLE)**: lista explícita de prohibiciones a verificar.
- **V. Rejugabilidad**: conecta con las estrellas pendientes como incentivo de rejugabilidad.

## Frase de entrada sugerida para /speckit-specify
"Quiero implementar un sistema de recompensas (estrellas por misión, descubrimientos narrativos, insignias) que motive la rejugabilidad sin usar rachas obligatorias, temporizadores de presión, FOMO ni pérdida de progreso por inactividad, verificando explícitamente el cumplimiento de las prohibiciones de la constitución."
