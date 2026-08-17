---
id: "050-visual-regression-testing"
name: "Testing de regresión visual"
phase: "Fase 7 — Calidad avanzada y escala"
depends_on: ["001-component-library-architecture", "034-automated-e2e-testing"]
---

# 050 — Testing de regresión visual (visual-regression-testing)

## Objetivo
Añadir tests de regresión visual (screenshot diffing) para los componentes de `libs/components` (Storybook) y para las escenas/pantallas clave del juego.

## Contexto / motivación
Con la librería de componentes (001-003) y múltiples escenas de juego ya consolidadas, cambios accidentales de estilo o layout pueden pasar desapercibidos en tests unitarios/E2E funcionales. Este slice añade una red de seguridad visual.

## Alcance incluido
- Integración de una herramienta de regresión visual sobre Storybook (para componentes) y sobre capturas de pantallas clave del juego (mapa, destino, reto, HUD).
- Baseline inicial de capturas aprobadas.
- Ejecución en CI con reporte claro de diffs visuales para revisión humana.

## Alcance excluido
- Cobertura visual de absolutamente todas las variantes de todos los componentes/escenas (priorizar las más críticas/reutilizadas).
- Aprobación automática de cambios visuales (siempre requiere revisión humana).

## Dependencias
- 001-003 (Storybook ya configurado), 034 (E2E como fuente de capturas de escenas de juego).

## Criterios de aceptación de alto nivel
- Un cambio de estilo no intencionado en un componente o escena clave es detectado automáticamente en CI.
- Existe un flujo claro para aprobar cambios visuales intencionados (actualizar baseline).

## Alineación con la constitución
- **VI. Simplicidad primero**: priorizar cobertura de lo más crítico/reutilizado antes que exhaustividad.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir testing de regresión visual sobre los componentes de Storybook y sobre las escenas clave del juego (mapa, destino, reto, HUD), con baseline aprobado, ejecución en CI y un flujo claro para actualizar el baseline ante cambios visuales intencionados."
