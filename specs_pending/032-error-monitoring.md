---
id: "032-error-monitoring"
name: "Monitorización de errores"
phase: "Fase 4 — Gate de publicación estable (MVP)"
depends_on: ["004-core-game-loop"]
---

# 032 — Monitorización de errores (error-monitoring)

## Objetivo
Añadir captura y reporte de errores en producción (JS runtime errors, fallos de carga de assets, errores de persistencia) para detectar problemas reales de los jugadores.

## Contexto / motivación
Sin monitorización, los fallos que un niño encuentra en casa nunca llegan al equipo de desarrollo. Este slice cierra esa brecha de observabilidad de forma proporcional (principio VI: simplicidad, no una plataforma de observabilidad compleja).

## Alcance incluido
- Captura de errores no controlados (global error handler) con contexto mínimo útil (escena/destino activo, versión del juego).
- Envío a un servicio de error tracking (o almacenamiento local exportable si no se dispone de backend, a decidir en clarificaciones).
- Filtrado para no capturar datos personales del jugador (alineado con 029).

## Alcance excluido
- Dashboards avanzados de analítica de errores (basta con reporte + listado básico).
- Alertas automáticas complejas (puede añadirse después si el volumen lo justifica).
- Captura de errores específica de escenarios offline/service worker (ver 047, Fase 7 — se extiende este mismo sistema cuando exista soporte PWA, no lo bloquea).

## Dependencias
- 004 (bucle de juego base ya jugable, contexto mínimo para tener algo que monitorizar).

## Criterios de aceptación de alto nivel
- Un error no controlado en producción queda registrado con contexto suficiente para diagnosticarlo, sin datos personales del jugador.
- El sistema de monitorización no afecta perceptiblemente al rendimiento del juego.

## Alineación con la constitución
- **VI. Simplicidad primero**: solución proporcional, sin infraestructura de observabilidad especulativa.
- Coherencia con 029 en cuanto a no capturar datos personales de menores.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir captura y reporte de errores no controlados en producción (con contexto de escena/destino y versión, sin datos personales del jugador), de forma proporcional y sin introducir una plataforma de observabilidad compleja."
