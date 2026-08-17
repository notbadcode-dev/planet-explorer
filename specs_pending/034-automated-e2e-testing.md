---
id: "034-automated-e2e-testing"
name: "Testing E2E de flujos de juego"
phase: "Fase 4 — Gate de publicación estable (MVP)"
depends_on: ["021-expedition-mission-structure", "026-onboarding-first-session", "027-accessibility-child-ux"]
---

# 034 — Testing E2E de flujos de juego (automated-e2e-testing)

## Objetivo
Añadir una suite de tests end-to-end que valide los flujos de juego completos (onboarding, seleccionar destino, completar misión, ver recompensa, volver al mapa) de forma automatizada.

## Contexto / motivación
Hasta ahora la disciplina de testing se ha centrado en tests unitarios de la lógica desacoplada (principio VII). Con múltiples destinos y flujos de UI reales, incluyendo los ajustes de la auditoría de accesibilidad infantil (027), hace falta cobertura E2E que detecte regresiones de integración que los tests unitarios no cubren y que valide sobre las pantallas ya corregidas por 027, no sobre una versión anterior.

## Alcance incluido
- Selección de herramienta E2E adecuada al stack (Phaser + Vite) y su integración en CI.
- Escenarios E2E clave: primera sesión completa (026), completar una misión de principio a fin (021), rejugar un destino (022).
- Ejecución de la suite en el pipeline de CI existente o futuro (035).

## Alcance excluido
- Cobertura E2E exhaustiva de absolutamente todos los destinos/retos (priorizar flujos críticos representativos).
- Testing de rendimiento (cubierto en 047).

## Dependencias
- 021, 026, 027 (los E2E deben ejercitar las pantallas ya auditadas/corregidas por la accesibilidad infantil).

## Criterios de aceptación de alto nivel
- Los flujos críticos de juego están cubiertos por tests E2E automatizados y reproducibles.
- Los tests E2E se ejecutan en CI y fallan de forma clara ante una regresión de integración.

## Alineación con la constitución
- **VI. Simplicidad primero**: priorizar flujos críticos antes que cobertura exhaustiva prematura.
- **VII. Separación lógica/renderizado**: los E2E complementan, no sustituyen, los tests unitarios de lógica pura ya existentes.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir una suite de tests end-to-end que cubra los flujos de juego críticos (primera sesión, completar una misión de principio a fin, rejugar un destino), integrada en el pipeline de CI, sin sustituir la cobertura unitaria ya existente de la lógica desacoplada."
