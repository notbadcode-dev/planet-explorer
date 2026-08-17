---
title: "Variantes del componente Button — Guía de validación rápida"
feature: "002-button-variants"
type: "quickstart"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, accessibility]
dependencies: ["001-component-library-architecture"]
related_specs: ["001-component-library-architecture"]
---

# Guía de validación rápida: Variantes del componente Button

**Propósito**: Pasos ejecutables para comprobar de extremo a extremo que `Button` soporta `variant`/`size` correctamente, mantiene compatibilidad retro y cumple los criterios de éxito de `spec.md`.

## Prerrequisitos

* Dependencias instaladas: `npm install` (sin dependencias nuevas respecto a `001-component-library-architecture`).
* Rama `002-button-variants` activa (o la rama de feature correspondiente).

## 1. Validar las pruebas unitarias (US1, US2, US3)

```bash
npm run test -- Button
```

**Resultado esperado**: Todos los tests de `libs/components/button/Button.test.ts` pasan, incluyendo (además de los ya existentes en `001`):

* Cada `variant` (`primary`/`secondary`/`danger`) aplica la clase CSS correspondiente.
* Cada `size` (`small`/`medium`/`large`) aplica la clase CSS correspondiente.
* Sin `variant`/`size` explícitos, se aplican `primary`/`medium` (compatibilidad retro, US3).
* Un valor de `variant`/`size` no soportado (forzado con un cast de tipos) hace fallback a `primary`/`medium` sin lanzar (FR-008).
* Las reglas de accesibilidad ya existentes (nombre accesible, bloqueo de `onClick` en `disabled`) siguen pasando para cualquier combinación.

## 2. Validar visualmente en Storybook (US1, US2, criterios SC-001/SC-003/SC-004)

```bash
npm run storybook
```

En el navegador (`http://localhost:6006`), abrir `Componentes/Button` y comprobar:

* Existen historias (o controles) que muestran las 3 variantes (`primary`, `secondary`, `danger`) y los 3 tamaños (`small`, `medium`, `large`).
* Las 3 variantes son distinguibles entre sí sin depender únicamente del color (SC-003) — comprobar visualmente que `danger` tiene, además de su color, otro rasgo distintivo (borde, marcador, etc., ver R11 de `contracts/button-component.md`).
* Los 3 tamaños son perceptiblemente distintos (SC-004).
* Un botón `size: 'small'` sigue teniendo un área clicable cómoda (inspeccionar con las herramientas de desarrollador del navegador que el elemento mide al menos 44×44 px CSS).
* Una historia con `disabled: true` combinada con cualquier `variant`/`size` muestra el tratamiento visual de deshabilitado de forma consistente.

## 3. Validar la compatibilidad retro (US3, SC-002)

```bash
npm run test -- Button
npm run lint
```

**Resultado esperado**: Los tests y las historias de Storybook previas a esta funcionalidad (`Enabled`, `Disabled`, `SoloEtiquetaAccesible`, ver `Button.stories.ts` de `001`) siguen existiendo y pasando sin modificarse, y `npm run lint` (que incluye `check:components`) no reporta ningún componente incompleto ni nombre duplicado.

## 4. Validar el build de producción

```bash
npm run build
```

**Resultado esperado**: La build de Vite completa sin errores, incluyendo el nuevo `Button.css` como asset procesado (confirma R6 de `docs/conventions/components/css.md`).

## Referencias

* Especificación: [spec.md](./spec.md)
* Plan: [plan.md](./plan.md)
* Contrato de la API pública: [contracts/button-component.md](./contracts/button-component.md)
* Convención estructural (CSS opcional): [docs/conventions/components/css.md](../../docs/conventions/components/css.md)
