---
id: "056-seasonal-events-content"
name: "Eventos temporales de contenido"
phase: "Fase 8 — Herramientas y crecimiento a largo plazo"
depends_on: ["043-mission-variability-engine", "024-reward-system-non-manipulative"]
---

# 056 — Eventos temporales de contenido (seasonal-events-content)

## Objetivo
Añadir eventos de contenido temporal (ej. lluvia de meteoros, eclipse) que aparecen durante un periodo limitado, sin usar presión ni FOMO, respetando estrictamente las prohibiciones del principio I.

## Contexto / motivación
Los eventos estacionales son un patrón común de motivación en juegos, pero la constitución prohíbe explícitamente FOMO y rachas obligatorias. Esta spec debe demostrar que es posible ofrecer contenido especial sin caer en esos patrones prohibidos.

## Alcance incluido
- Definición de al menos un evento temporal (p. ej. lluvia de meteoros como expedición especial reutilizando 043) disponible durante una ventana de tiempo configurable.
- Diseño explícito que garantice que NO jugar el evento no supone ninguna pérdida ni penalización, y que el contenido pueda quedar disponible de otra forma después (p. ej. reaparece más adelante o se archiva sin urgencia comunicada al niño).
- Checklist de cumplimiento del principio I aplicado específicamente a este tipo de contenido.

## Alcance excluido
- Eventos con recompensas exclusivas no recuperables (contradice el espíritu de "no penalizar por no jugar"; si se decide lo contrario debe justificarse explícitamente y validarse contra la constitución).
- Notificaciones push agresivas para atraer al jugador al evento (ver 052 notificaciones, deben ser suaves y opcionales).

## Dependencias
- 043 (variabilidad de misiones), 024 (sistema de recompensas ya validado como no manipulativo).

## Criterios de aceptación de alto nivel
- Existe al menos un evento temporal jugable, con checklist de cumplimiento del principio I aprobado explícitamente.
- No jugar el evento no supone pérdida de progreso ni frustración comunicada al niño.

## Alineación con la constitución
- **I. Experiencia centrada en el niño (NON-NEGOTIABLE)**: verificación explícita contra FOMO y rachas obligatorias, prohibiciones directas del principio.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un evento de contenido temporal (por ejemplo una lluvia de meteoros) disponible durante una ventana de tiempo, diseñado explícitamente para que no jugarlo no suponga ninguna pérdida ni penalización, validando mediante checklist que no se introduce FOMO ni rachas obligatorias."
