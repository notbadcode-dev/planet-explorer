---
id: "002-button-variants"
name: "Variantes del componente Button"
phase: "Fase 0 — Fundamentos ya construidos (documentación retroactiva)"
status: "Implemented"
depends_on: ["001-component-library-architecture"]
---

# 002 — Variantes del componente Button (button-variants)

> **Nota**: esta ficha es una reconstrucción retroactiva en el formato de `specs_pending/`, escrita **después** de que la funcionalidad ya estuviera especificada e implementada siguiendo el ciclo completo de Spec Kit. La especificación formal y vinculante vive en [`specs/002-button-variants/spec.md`](../specs/002-button-variants/spec.md); este fichero solo existe para que el roadmap tenga una entrada consistente para los cimientos del proyecto.

## Objetivo
Ampliar el componente `Button` (001) con variantes de énfasis visual (`primary`, `secondary`, `danger`) y de tamaño (`small`, `medium`, `large`), manteniendo compatibilidad total con los usos existentes.

## Contexto / motivación
Un único estilo de botón no basta para comunicar distintos niveles de importancia/riesgo (acción principal, secundaria, destructiva) ni para adaptarse a distintos contextos de interfaz (barra compacta vs. llamada a la acción destacada).

## Alcance incluido
- Variante semántica `variant: 'primary' | 'secondary' | 'danger'` (por defecto `primary`).
- Variante de tamaño `size: 'small' | 'medium' | 'large'` (por defecto `medium`), con área táctil mínima de 44×44 px CSS incluso en `small`.
- Compatibilidad retroactiva: los botones creados antes de esta funcionalidad (sin `variant`/`size`) se comportan y ven igual que antes.

## Alcance excluido
- Nuevos componentes distintos de `Button` (ver 003-shared-components-base).
- Lógica de juego/educación dentro del componente (agnóstico de dominio).

## Dependencias
- 001-component-library-architecture (componente `Button` base).

## Criterios de aceptación de alto nivel
- Las tres variantes de énfasis son perceptiblemente distintas sin depender únicamente del color.
- Los tres tamaños son perceptiblemente distintos y todos cumplen el área táctil mínima.
- Todas las pruebas y historias de Storybook previas a esta funcionalidad siguen pasando sin modificarse.

## Alineación con la constitución
- **I. Centrado en el niño (NO NEGOCIABLE)**: área táctil mínima garantizada para interacción infantil en pantallas táctiles.
- **VI. Simplicidad primero**: catálogo cerrado de variantes/tamaños en vez de un sistema de estilos abierto/arbitrario.

## Estado real (a fecha 2026-08-17)
✅ **Hecha** — mergeada en `develop`. Ver especificación completa, plan y tareas en [`specs/002-button-variants/`](../specs/002-button-variants/).
