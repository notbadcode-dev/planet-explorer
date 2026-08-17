---
title: "Librería de componentes UI: arquitectura y componente Button — Quickstart"
feature: "001-component-library-architecture"
type: "quickstart"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, testing, documentation, architecture]
dependencies: []
related_specs: []
---

# Quickstart: Librería de componentes UI: arquitectura y componente Button

**Entrada**: `spec.md`, `plan.md`, `data-model.md`, `contracts/`

## Objetivo

Permitir que cualquier desarrollador del proyecto pueda, en local: (1) instalar el entorno, (2) ejecutar las pruebas unitarias de `libs/components/`, (3) visualizar `Button` en Storybook, y (4) verificar que un intento de duplicar el nombre de un componente queda bloqueado.

## Alcance

**Incluye**:

* Instalación de dependencias del proyecto (Node.js, npm).
* Ejecución de la suite de pruebas Vitest de `libs/components/button/`.
* Arranque de Storybook en local para ver la historia de `Button`.
* Verificación manual de los tres escenarios de aceptación de `spec.md` (US1, US2, US3) y de la regla de nombres duplicados (FR-010).

**No incluye**:

* Publicación o despliegue de Storybook (queda fuera de alcance en esta iteración, ver Suposiciones de `spec.md`).
* Integración de `Button` en ninguna pantalla real del juego.

## Fuentes

* `./spec.md`
* `./plan.md`
* `./data-model.md`
* `./contracts/button-component.md`
* `../../docs/conventions/components/structure.md`

## Prerrequisitos

**Software**:

* Node.js (versión LTS activa) y npm.
* Editor con soporte TypeScript (recomendado: VS Code).

**Servicios**: Ninguno (no hay backend ni servicios externos).

**Acceso**: Ninguno especial; el repositorio es de acceso local para el equipo de desarrollo.

## Configuración

**Variables de entorno**: N/A — no se requieren variables de entorno para esta funcionalidad.

## Preparación del entorno

```bash
# 1. Instalar dependencias del proyecto
npm install

# 2. Ejecutar la suite de pruebas de la librería de componentes
npm run test -- libs/components

# 3. Arrancar Storybook en local
npm run storybook
```

**Verificación de la instalación**:

* `npm run test -- libs/components` MUST finalizar sin errores y mostrar los tests de `Button.test.ts` en verde.
* `npm run storybook` MUST abrir Storybook en el navegador y mostrar la historia de `Button` bajo la categoría de componentes.

## Ejecutar la aplicación

Esta funcionalidad no introduce una aplicación ejecutable en sí misma (no hay pantalla de juego que consuma `Button` todavía). La forma de "ejecutarla" es a través de Storybook:

```bash
npm run storybook
```

## Verificación inicial (checklist)

- [ ] `npm install` finaliza sin errores.
- [ ] `libs/components/button/` existe con `Button.ts`, `Button.test.ts`, `Button.stories.ts` e `index.ts` (contrato de convención estructural).
- [ ] `npm run test -- libs/components` ejecuta y pasa todos los tests de `Button`.
- [ ] `npm run storybook` muestra la historia de `Button` con al menos los estados habilitado y deshabilitado.
- [ ] Intentar crear una segunda carpeta con el mismo nombre (`button`) es detectado/bloqueado por lint o CI (FR-010).

## Datos de prueba

No se requieren datos de prueba externos. Los propios argumentos de Storybook (controles) sirven como datos de entrada de ejemplo para `ButtonProps` (`label`, `ariaLabel`, `disabled`).

## Escenarios de validación

### QS-001 — Estructura de carpeta reutilizable (US1)

**Objetivo**: Verificar que `libs/components/button/` existe con la estructura mínima requerida.

**Pasos**:

1. Abrir `libs/components/button/` en el explorador de archivos o editor.
2. Comprobar que existen `Button.ts`, `Button.test.ts`, `Button.stories.ts` e `index.ts`.
3. Importar el componente desde otra ubicación del proyecto usando `import { createButton } from 'libs/components/button'`.

**Resultado esperado**: El componente se importa sin duplicar código (FR-008); la estructura coincide con `docs/conventions/components/structure.md`.

### QS-002 — Pruebas unitarias con Vitest (US2)

**Objetivo**: Verificar que `Button` tiene pruebas unitarias que cubren sus estados principales.

**Pasos**:

1. Ejecutar `npm run test -- libs/components`.
2. Revisar el reporte de Vitest.

**Resultado esperado**: Existen tests que verifican, como mínimo: renderizado con `label`, bloqueo de `onClick` cuando `disabled` es `true` (FR-007), y presencia de nombre accesible cuando no hay `label` visible (FR-011). Todos los tests pasan.

### QS-003 — Presentación en Storybook (US3)

**Objetivo**: Verificar que `Button` tiene una historia visualizable en Storybook.

**Pasos**:

1. Ejecutar `npm run storybook`.
2. Navegar hasta la historia de `Button`.
3. Cambiar los controles (`label`, `disabled`) y observar el resultado visual.

**Resultado esperado**: Storybook muestra el `Button` renderizado y permite alternar entre estado habilitado y deshabilitado sin errores en consola.

### QS-004 — Bloqueo de nombres de componente duplicados (FR-010)

**Objetivo**: Verificar que no es posible introducir dos componentes con el mismo nombre sin que quede bloqueado automáticamente.

**Pasos**:

1. Crear una segunda carpeta `libs/components/button/` (duplicada) o un segundo componente que reutilice el nombre `button`.
2. Ejecutar el lint/CI del proyecto.

**Resultado esperado**: El lint o el pipeline de CI MUST fallar o señalar el conflicto, impidiendo que la duplicidad se fusione (FR-010).
