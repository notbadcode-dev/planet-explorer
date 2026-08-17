---
id: "003-shared-components-base"
name: "Base ampliada de componentes compartidos reutilizables"
phase: "Fase 0 — Fundamentos ya construidos (documentación retroactiva)"
status: "En progreso"
depends_on: ["002-button-variants"]
---

# 003 — Base ampliada de componentes compartidos reutilizables (shared-components-base)

> **Nota**: esta ficha es una reconstrucción retroactiva en el formato de `specs_pending/`, escrita **después** de que la funcionalidad ya estuviera especificada e implementada (parcialmente) siguiendo el ciclo completo de Spec Kit. La especificación formal y vinculante vive en [`specs/003-shared-components-base/spec.md`](../specs/003-shared-components-base/spec.md); este fichero solo existe para que el roadmap tenga una entrada consistente para los cimientos del proyecto.

## Objetivo
Ampliar `libs/components` con un catálogo base de componentes compartidos reutilizables (`Input`, `Panel`, `Badge`, `Progress`, `Dialog`, `Card/Tile`, `Select`, `RadioGroup`/`Checkbox`, `Tabs`, `Toast`, `Tooltip`, `Spinner`, `Accordion`, `Slider`) para construir vistas de juego sin duplicar UI, todos agnósticos de dominio.

## Contexto / motivación
Con solo `Button` (001, 002) no hay suficiente vocabulario de componentes para construir pantallas reales (selección de destino, quizzes, ficha de planeta, panel parental, HUD de audio). Esta spec cubre ese vocabulario mínimo antes de empezar `004-core-game-loop`.

## Alcance incluido
- Componentes P1 (bloquean pantalla principal): `Card/Tile`, `Select/Dropdown`.
- Componentes P2 (pantallas de quiz/ficha de planeta): `RadioGroup/Checkbox`, `Tabs`, `Toast/Snackbar`.
- Componentes P3 (según necesidad): `Tooltip`, `Spinner/Loader`, `Accordion`, `Slider` (control de volumen).
- Accesibilidad (foco atrapado en `Dialog`, teclado, `prefers-reduced-motion`), consistencia visual y pruebas unitarias + Storybook para cada componente y combinación de casos límite.
- Todos los componentes permanecen agnósticos de dominio (sin lógica de juego/educación/astronomía).

## Alcance excluido
- Lógica de juego, retos educativos o contenido astronómico real (ver `specs_pending/004` en adelante).
- Backend/API (no aplica; proyecto estático).

## Dependencias
- 002-button-variants (mismo catálogo de tamaños `small | medium | large` reutilizado por `Input`/`Dialog`).

## Criterios de aceptación de alto nivel
- Cada componente tiene pruebas unitarias y al menos una historia de Storybook por rama visual distinguible de su API pública.
- `Dialog` atrapa el foco, cierra con Escape y devuelve el foco al invocador.
- Las transiciones nuevas (Accordion, RadioGroup/Checkbox, Tabs, Toast, retardo de Tooltip) usan un token global de movimiento y se desactivan por completo con `prefers-reduced-motion: reduce`.

## Alineación con la constitución
- **VI. Simplicidad primero**: catálogo cerrado y agnóstico de dominio antes de construir pantallas de juego concretas.
- **I. Centrado en el niño (NO NEGOCIABLE)**: accesibilidad (teclado, foco, contraste, tap en Tooltip) como requisito, no como mejora posterior.

## Estado real (a fecha 2026-08-17)
🔄 **En progreso** — rama `003-crear-una-base` (no mergeada a `develop`). Fases 1-6 y convergencia de accesibilidad completas; pendiente de cerrar tareas menores de Phase 8 (tamaños/demos) y mergear. Ver especificación completa, plan y tareas en [`specs/003-shared-components-base/`](../specs/003-shared-components-base/).
