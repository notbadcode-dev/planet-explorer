---
id: "027-accessibility-child-ux"
name: "Auditoría de accesibilidad infantil"
phase: "Fase 3 — Estructura de contenido, recompensas, rejugabilidad y experiencia de entrada"
depends_on: ["021-expedition-mission-structure", "018-audio-and-sound-design", "026-onboarding-first-session"]
---

# 027 — Auditoría de accesibilidad infantil (accessibility-child-ux)

## Objetivo
Auditar y corregir de forma transversal todos los flujos existentes (mapa, destinos, retos, HUD) contra los requisitos de accesibilidad e interacción infantil del principio I.

## Contexto / motivación
Las specs anteriores (004-026) han ido construyendo funcionalidad; esta spec es un hito de calidad que verifica de extremo a extremo el cumplimiento de: zonas táctiles grandes, texto mínimo, feedback inmediato, navegación predecible, ausencia de menús profundos.

## Alcance incluido
- Checklist de accesibilidad infantil aplicado a cada pantalla existente (tamaño mínimo de zona táctil, contraste, feedback sonoro/visual).
- Corrección de hallazgos (ajuste de tamaños, simplificación de textos, ajuste de profundidad de navegación).
- Validación de que ninguna pantalla requiere más de N niveles de navegación (definir N en clarificaciones) para llegar a un reto.
- Documentación de la convención de accesibilidad infantil para futuras specs (posible actualización de `shared-components-visual-rules`).

## Alcance excluido
- Accesibilidad para tecnologías de asistencia tipo lector de pantalla/switch control (ver 058, audiencia distinta: adultos/necesidades especiales).
- Nuevas funcionalidades; esta spec es de auditoría y corrección, no de contenido nuevo.

## Dependencias
- Todo lo construido hasta 026.

## Criterios de aceptación de alto nivel
- Todas las pantallas existentes cumplen el checklist de accesibilidad infantil definido.
- La navegación desde el mapa hasta cualquier reto no supera la profundidad máxima acordada.
- Ningún texto excede la longitud/vocabulario recomendado para ~6 años.

## Alineación con la constitución
- **I. Experiencia centrada en el niño (NON-NEGOTIABLE)**: auditoría directa y transversal del principio no negociable.

## Frase de entrada sugerida para /speckit-specify
"Quiero auditar todas las pantallas existentes del juego (mapa, destinos, retos, HUD) contra los requisitos de accesibilidad infantil de la constitución (zonas táctiles grandes, texto mínimo, feedback inmediato, navegación poco profunda) y corregir los hallazgos, documentando la convención resultante."
