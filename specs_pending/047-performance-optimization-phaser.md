---
id: "047-performance-optimization-phaser"
name: "Optimización de rendimiento (Phaser)"
phase: "Fase 7 — Calidad avanzada y escala"
depends_on: ["025-map-navigation-ui", "041-comets-and-nebulae-content"]
---

# 047 — Optimización de rendimiento (performance-optimization-phaser)

## Objetivo
Optimizar el rendimiento del renderizado Phaser (carga de assets, uso de memoria, tiempos de transición) tras haber acumulado múltiples destinos y escenas.

## Contexto / motivación
Con 8+ destinos/expediciones ya implementados (Fases 1-5), el volumen de assets y escenas puede degradar el rendimiento en dispositivos modestos (tablets de gama media, típicas en el uso infantil). El principio I exige interacción fluida y ausencia de frustración; un juego lento frustra a un niño de 6 años.

## Alcance incluido
- Auditoría de rendimiento (carga inicial, cambios de escena, uso de memoria) en dispositivos objetivo representativos.
- Lazy loading de assets por destino (no cargar todo el sistema solar de golpe).
- Optimización de sprites/atlas de texturas y limpieza de recursos al salir de una escena.
- Métricas y umbrales de rendimiento documentados como criterio de aceptación para specs futuras.

## Alcance excluido
- Rediseño de contenido o mecánicas (esta spec es puramente técnica/no funcional).
- Infraestructura de CDN/backend (fuera de alcance, sigue siendo una app cliente).

## Dependencias
- 025, 041 (para tener volumen real de contenido que optimizar).

## Criterios de aceptación de alto nivel
- Los tiempos de carga y transición entre escenas se mantienen dentro de umbrales aceptables definidos en dispositivos objetivo.
- El uso de memoria no crece de forma no acotada al navegar entre múltiples destinos en una misma sesión.
- Ninguna funcionalidad existente se rompe como efecto secundario de la optimización.

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: fluidez como parte de "ausencia de frustración innecesaria".
- **VI. Simplicidad primero**: optimizar sin introducir infraestructura compleja innecesaria.

## Frase de entrada sugerida para /speckit-specify
"Quiero auditar y optimizar el rendimiento del renderizado Phaser (carga de assets, uso de memoria, transiciones entre escenas) ahora que existen múltiples destinos, con lazy loading por destino y umbrales de rendimiento documentados para dispositivos objetivo."
