---
id: "031-responsive-cross-device-support"
name: "Soporte responsive multi-dispositivo"
phase: "Fase 4 — Gate de publicación estable (MVP)"
depends_on: ["004-core-game-loop", "025-map-navigation-ui"]
---

# 031 — Soporte responsive multi-dispositivo (responsive-cross-device-support)

## Objetivo
Garantizar que el juego es jugable de forma cómoda y con zonas táctiles adecuadas en el rango real de dispositivos donde una familia lo usaría (tablet en primer lugar, pero también móvil y navegador de escritorio), incluyendo cambios de orientación, antes de la primera publicación pública.

## Contexto / motivación
El desarrollo hasta ahora (004-029) se ha validado principalmente en un viewport de referencia. Publicar sin verificar el comportamiento en el rango real de tamaños de pantalla y orientaciones donde las familias efectivamente juegan (tablets de distintos tamaños, móviles, y también navegador de escritorio para quien no tenga tablet) arriesga con zonas táctiles rotas, HUD cortado, o texto ilegible — problemas que contradicen directamente el principio I (zonas táctiles grandes, interacción fluida) pero que no se detectan sin una pasada explícita multi-dispositivo.

## Alcance incluido
- Definición de un conjunto mínimo de breakpoints/viewports de referencia a soportar (tablet apaisada como caso principal, tablet vertical, móvil apaisada/vertical, escritorio), documentado en `docs/conventions/`.
- Auditoría y corrección de todas las pantallas existentes (mapa, destinos, retos, HUD, panel parental) en ese conjunto de viewports: sin scroll no intencionado, sin elementos cortados, zonas táctiles que se mantienen grandes en el rango completo.
- Manejo explícito del cambio de orientación en tiempo real (portrait/landscape) sin perder el estado de la sesión de juego en curso.
- Estrategia de testing (manual y/o automatizado vía el E2E de 034) para verificar el layout en al menos los viewports de referencia definidos.

## Alcance excluido
- Soporte nativo específico por plataforma (apps nativas iOS/Android); el alcance es exclusivamente el navegador/PWA web.
- Optimización de rendimiento específica por dispositivo de gama baja (ver 047, Fase 6, que trata rendimiento en profundidad).
- Diseño de layouts radicalmente distintos por dispositivo (se prioriza un único layout fluido/responsive sobre mantener múltiples diseños paralelos, principio VI).

## Dependencias
- 004 (bucle de juego base sobre el que se valida el layout), 025 (el mapa, como interfaz central, es la pantalla con más elementos dinámicos a validar).

## Criterios de aceptación de alto nivel
- Todas las pantallas existentes son usables, sin elementos cortados ni zonas táctiles reducidas, en el conjunto de viewports de referencia definido.
- Un cambio de orientación durante una sesión de juego no provoca pérdida de progreso ni de estado de la pantalla activa.
- Existe documentación clara de los viewports soportados y cómo se verifican.

## Alineación con la constitución
- **I. Experiencia centrada en el niño (NON-NEGOTIABLE)**: zonas táctiles grandes e interacción fluida deben cumplirse en el rango real de dispositivos, no solo en un viewport de referencia.
- **VI. Simplicidad primero**: un único layout fluido y responsive, sin mantener diseños paralelos por dispositivo salvo necesidad real demostrada.

## Frase de entrada sugerida para /speckit-specify
"Quiero verificar y corregir el comportamiento responsive de todas las pantallas existentes del juego (mapa, destinos, retos, HUD, panel parental) en un conjunto definido de tablets, móviles y escritorio, incluyendo cambios de orientación sin pérdida de estado, antes de la primera publicación pública."
