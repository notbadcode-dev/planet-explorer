---
id: "004-core-game-loop"
name: "Bucle de juego base"
phase: "Fase 1 — Motor de juego base y primer destino jugable"
depends_on: ["001-component-library-architecture", "002-button-variants", "003-shared-components-base"]
status: "done"
---

# 004 — Bucle de juego base (core-game-loop)

**Implementado en**: specs/004-core-game-loop/

## Objetivo
Implementar el primer vertical slice jugable de extremo a extremo: mapa del sistema solar navegable, selección de un destino, transición a una escena de destino (placeholder) y vuelta al mapa, con un HUD mínimo.

## Contexto / motivación
La constitución (principio VIII) exige desarrollo mediante vertical slices y usa literalmente `core-game-loop` como primer ejemplo. Esta es la base técnica sobre la que se apoyarán todos los destinos y retos futuros. Introduce Phaser como motor de renderizado (principio VII), reutilizando `libs/components` para UI fuera de canvas (HUD, menús) cuando aplique.

## Alcance incluido
- Integración de Phaser en el proyecto (build, escena de mapa, escena de destino placeholder).
- Mapa navegable con al menos un destino seleccionable visualmente (sin datos astronómicos reales aún).
- Transición mapa → destino → mapa, sin pérdida de estado.
- HUD mínimo: botón "volver al mapa", indicador de progreso vacío/placeholder.
- Módulo de navegación de estado (qué escena/destino está activo) desacoplado de las escenas de Phaser.

## Alcance excluido
- Retos educativos reales (ver 007-core, 008-moon).
- Persistencia de progreso (ver 011).
- Narrativa de BOT-6 (ver 005).
- Destinos con datos astronómicos reales y múltiples destinos (ver 008+).
- Audio (ver 018).

## Dependencias
- 001-003 (librería de componentes UI ya existente en `libs/components`).
- Constitución activa (`.specify/memory/constitution.md`).

## Criterios de aceptación de alto nivel
- Un jugador puede abrir el juego, ver el mapa, seleccionar el destino disponible, entrar en su escena y volver al mapa sin errores ni callejones sin salida.
- La lógica de navegación (estado actual, destino seleccionado, transición) es testeable con Vitest sin necesidad de renderizar Phaser.
- Ninguna interacción requiere texto extenso; las zonas interactivas son grandes y el feedback es inmediato (principio I).
- No se introduce ninguna dependencia, capa o patrón (DI, repository, microservicios) sin justificación funcional concreta (principio VI).

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: navegación simple, zonas táctiles grandes, sin ayuda constante de un adulto.
- **VI. Simplicidad primero**: arquitectura mínima viable, sin infraestructura especulativa.
- **VII. Separación lógica/renderizado**: el estado de navegación debe poder testearse sin `Phaser.Scene`.
- **VIII. Desarrollo incremental**: primer vertical slice explícito, sin implementar contenido futuro.

## Frase de entrada sugerida para /speckit-specify
"Quiero implementar el bucle de juego base: un mapa del sistema solar navegable donde el jugador pueda seleccionar un destino (placeholder), entrar en una escena de destino vacía y volver al mapa, usando Phaser para el renderizado y manteniendo la lógica de navegación desacoplada de las escenas."
