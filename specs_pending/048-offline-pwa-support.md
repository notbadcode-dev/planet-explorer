---
id: "048-offline-pwa-support"
name: "Soporte offline / PWA"
phase: "Fase 7 — Calidad avanzada y escala"
depends_on: ["047-performance-optimization-phaser", "011-save-progress-local"]
---

# 048 — Soporte offline / PWA (offline-pwa-support)

## Objetivo
Convertir el juego en una Progressive Web App instalable, capaz de funcionar sin conexión a internet estable una vez cargada por primera vez.

## Contexto / motivación
El uso infantil/en el hogar o aula puede darse en entornos con conectividad inestable. Dado que el progreso ya es local (011) y los assets ya están optimizados (047), añadir soporte offline es una extensión natural sin backend.

## Alcance incluido
- Service worker con estrategia de caché de assets (app shell + contenido de destinos ya visitados).
- Manifest de instalación (icono, nombre, modo standalone).
- Indicador claro (apto para niños) de estado online/offline si afecta a alguna funcionalidad.
- Verificación de que el progreso local sigue funcionando correctamente sin conexión.

## Alcance excluido
- Sincronización de progreso entre dispositivos (requeriría backend, fuera de alcance).
- Descarga selectiva de contenido por el usuario (podría añadirse después si se prioriza).

## Dependencias
- 047 (assets optimizados), 011 (persistencia local ya operativa).

## Criterios de aceptación de alto nivel
- El juego puede instalarse como PWA y abrirse sin conexión tras la primera carga.
- El progreso y contenido ya visitado funcionan completamente offline.
- No se introduce ninguna dependencia de backend nueva.

## Alineación con la constitución
- **VI. Simplicidad primero**: PWA como solución más simple frente a apps nativas o backend propio.
- **I. Experiencia centrada en el niño**: evita interrupciones frustrantes por problemas de conexión.

## Frase de entrada sugerida para /speckit-specify
"Quiero convertir el juego en una Progressive Web App instalable con soporte offline mediante service worker, cacheando el app shell y el contenido de destinos ya visitados, verificando que el progreso local sigue funcionando correctamente sin conexión."
