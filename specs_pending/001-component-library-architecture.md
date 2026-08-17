---
id: "001-component-library-architecture"
name: "Arquitectura de la librería de componentes"
phase: "Fase 0 — Fundamentos ya construidos (documentación retroactiva)"
status: "Hecha"
depends_on: []
---

# 001 — Arquitectura de la librería de componentes (component-library-architecture)

> **Nota**: esta ficha es una reconstrucción retroactiva en el formato de `specs_pending/`, escrita **después** de que la funcionalidad ya estuviera especificada e implementada siguiendo el ciclo completo de Spec Kit. La especificación formal y vinculante vive en [`specs/001-component-library-architecture/spec.md`](../specs/001-component-library-architecture/spec.md); este fichero solo existe para que el roadmap tenga una entrada consistente para los cimientos del proyecto.

## Objetivo
Establecer una carpeta `libs/components` con una convención clara para alojar componentes de interfaz reutilizables (código, pruebas unitarias y presentación en Storybook), y entregar el primer componente (`Button`) siguiendo esa convención.

## Contexto / motivación
El proyecto no tenía todavía ningún lugar consistente donde colocar UI reutilizable fuera del canvas del juego. Sin esta base, cualquier feature futura (menús, HUD, pantallas de destino) habría duplicado estilos y lógica de UI ad-hoc.

## Alcance incluido
- Estructura y convención de `libs/components` (código, pruebas, historia de Storybook por componente).
- Primer componente `Button` (dummy, sin lógica de juego) con pruebas unitarias con Vitest.
- Presentación de `Button` en Storybook (`@storybook/html-vite`) con sus estados principales.
- Bloqueo automático (lint/CI) de nombres de componente duplicados en `libs/components`.

## Alcance excluido
- Variantes visuales adicionales de `Button` (ver 002-button-variants).
- Cualquier otro componente distinto de `Button` (ver 003-shared-components-base).
- Lógica de juego/educación/astronomía dentro de los componentes (agnósticos de dominio).

## Dependencias
- Ninguna; es el cimiento del que dependen 002, 003 y, transitivamente, todo `specs_pending/004` en adelante.

## Criterios de aceptación de alto nivel
- Existe `libs/components` con una convención documentada y reproducible para añadir componentes.
- El componente `Button` tiene pruebas unitarias que verifican su comportamiento observable.
- El componente `Button` tiene una historia de Storybook navegable con sus estados principales.
- No pueden coexistir dos componentes con el mismo nombre en `libs/components` sin que lint/CI lo bloquee.

## Alineación con la constitución
- **VI. Simplicidad primero**: convención mínima viable antes de sofisticar el sistema de componentes.
- **VII. Separación lógica/renderizado**: los componentes de `libs/components` son UI reutilizable, independiente del motor de juego (Phaser).

## Estado real (a fecha 2026-08-17)
✅ **Hecha** — mergeada en `develop`. Ver especificación completa, plan y tareas en [`specs/001-component-library-architecture/`](../specs/001-component-library-architecture/).
