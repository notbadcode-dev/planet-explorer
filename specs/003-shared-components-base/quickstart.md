---
title: "Base mínima de componentes compartidos reutilizables — Guía de validación rápida"
feature: "003-shared-components-base"
type: "quickstart"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, testing, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Guía de validación rápida: Base mínima de componentes compartidos reutilizables

## Propósito

Validar de extremo a extremo que los 5 componentes (`Input`, `Panel`, `Badge`, `Progress`, `Dialog`) se integran en la librería compartida cumpliendo accesibilidad, contratos de iconografía, reglas de tokens y quality gates del repositorio.

## Prerrequisitos

- Dependencias instaladas: `npm install`
- Rama de la feature activa: `003-shared-components-base`
- Artefactos de diseño disponibles: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md)

## 1) Validar estructura y convenciones de componentes

```bash
npm run lint
```

**Resultado esperado**:
- `scripts/check-components.mjs` no reporta errores de estructura.
- Los componentes `input`, `panel`, `badge`, `progress`, `dialog` cumplen convención de archivos obligatorios.
- No hay errores de ESLint.

## 2) Validar pruebas de comportamiento y accesibilidad

```bash
npm test
```

**Resultado esperado**:
- Tests de cada componente nuevo pasan.
- `Input` valida nombre accesible, `aria-invalid`, `aria-describedby` y callback de entrada.
- `Progress` valida normalización de rango (vacío, parcial, completo, fuera de rango).
- `Dialog` valida render accesible, cierre y ciclo de foco de teclado.

## 3) Validar build de aplicación

```bash
npm run build
```

**Resultado esperado**:
- Build finaliza sin errores.
- No aparecen importaciones de iconos prohibidas fuera de `Icon`.

## 4) Validar build de Storybook

```bash
npm run build-storybook
```

**Resultado esperado**:
- Build de Storybook finaliza sin errores.
- Historias cubren estados visuales clave de los 5 componentes.
- Variantes de `Badge` y `Panel` se distinguen sin depender solo de color.

## 5) Revisión rápida manual en Storybook (opcional recomendada)

```bash
npm run storybook
```

**Checklist visual**:
- `Input`: default, placeholder, focused, filled, error, disabled.
- `Panel`: `default`, `highlight`, `danger`.
- `Badge`: variantes y uso opcional de icono vía `Icon`.
- `Progress`: vacío, parcial, completo, clamp de fuera de rango.
- `Dialog`: render accesible y ejemplos de acciones compuestas con `Button`.

## 6) Validar compatibilidad y rendimiento con matriz técnica

**Alcance de matriz objetivo**:
- Desktop: Chrome estable (n), Firefox estable (n), Safari estable (n)
- Móvil: Chrome Android estable (n), Safari iOS estable (n)
- Cobertura mínima: últimas 2 versiones estables disponibles por navegador

**Escenarios críticos a medir**:
- Entrada de texto en `Input` (eco de valor)
- Actualización de valor en `Progress`
- Apertura y cierre de `Dialog` (incluye ciclo de foco)

**Método de medición**:
1. En cada navegador objetivo, abrir Storybook y cargar la historia correspondiente.
2. Ejecutar 10 iteraciones por escenario crítico.
3. Medir latencia con marcas temporales (`performance.now()`) antes de disparar interacción y después de ver el estado actualizado en DOM.
4. Registrar resultados por navegador/escenario en tabla de evidencia dentro de este documento.

**Criterio de aprobación**:
- Cada escenario crítico debe quedar en <= 100 ms en al menos 8 de 10 iteraciones por navegador objetivo.
- No deben observarse bloqueos visibles de interfaz durante la interacción.

## Referencias

- Especificación: [spec.md](./spec.md)
- Plan: [plan.md](./plan.md)
- Modelo de datos: [data-model.md](./data-model.md)
- Contrato API: [contracts/shared-components-api.md](./contracts/shared-components-api.md)
- Contrato visual/iconografía: [contracts/shared-components-visual-rules.md](./contracts/shared-components-visual-rules.md)