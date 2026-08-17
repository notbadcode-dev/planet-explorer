---
title: "Base ampliada de componentes compartidos reutilizables — Guía de validación rápida"
feature: "003-shared-components-base"
type: "quickstart"
version: "1.3"
created: "2026-08-16"
updated: "2026-08-19T00:00:00Z"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, testing, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Guía de validación rápida: Base ampliada de componentes compartidos reutilizables

## Propósito

Validar de extremo a extremo que los 5 componentes (`Input`, `Panel`, `Badge`, `Progress`, `Dialog`) se integran en la librería compartida cumpliendo accesibilidad, contratos de iconografía, reglas de tokens y quality gates del repositorio. Incluye además, en la sección 7, la guía de validación (con evidencia real de ejecución) para los 9 componentes adicionales de la ampliación 2026-08-16 (`CardTile`, `Select`, `RadioGroup`, `CheckboxGroup`, `Tabs`, `Tooltip`, `Toast`, `Spinner`, `Accordion`), ya implementados. La sección 9 documenta la guía de validación de `Slider` (ampliación 2026-08-19), implementado y validado con evidencia real de ejecución.

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
- Cada estado/variante/rama visual clave de los 5 componentes tiene su propia historia nombrada en el panel de Storybook (no solo un playground con controles).
- Variantes de `Badge` y `Panel` se distinguen sin depender solo de color.

## 5) Revisión rápida manual en Storybook (opcional recomendada)

```bash
npm run storybook
```

**Checklist visual** (cada ítem corresponde a una historia nombrada navegable directamente en el panel de Storybook, además del playground interactivo):
- `Input`: default, con ayuda (hint), con error, deshabilitado, sin etiqueta visible (`ariaLabel`), con ayuda+error simultáneos, tamaños `small`/`medium`/`large`.
- `Panel`: `default`, `highlight`, `danger`, contenido compuesto por múltiples elementos.
- `Badge`: `default`, `success`, `warning`, `danger`, `info`, con icono de consumidor junto a variante semántica.
- `Progress`: vacío, parcial, completo, valor fuera de rango (normalizado), sin valor visible (`showValue=false`), valor negativo (normalizado).
- `Dialog`: render base con acción de cierre, con acciones compuestas (`Button`), sin descripción, contenido/acciones múltiples, `closeLabel` personalizado, tamaños `small`/`medium`/`large`, demostración interactiva desde botón real (`InteractivoDesdeBoton`) y desde input real (`InteractivoDesdeInput`) con retorno de foco visible.

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

**Evidencia medida (automatizada, entorno único — happy-dom)**:

> Medición previa con Vitest + happy-dom (DOM simulado en Node), útil como proxy objetivo de la lógica de actualización del DOM y para detectar regresiones de rendimiento en CI, pero sin motores de renderizado reales.

| Entorno | Escenario | Iteraciones | Media | Máx. | <= 100 ms |
| --- | --- | --- | --- | --- | --- |
| Node v22.19.0 + happy-dom 20.11.2 | Input: eco de valor | 10 | 0.062 ms | 0.326 ms | 10/10 |
| Node v22.19.0 + happy-dom 20.11.2 | Progress: actualización de valor | 10 | 0.172 ms | 0.801 ms | 10/10 |
| Node v22.19.0 + happy-dom 20.11.2 | Dialog: apertura y cierre (con ciclo de foco) | 10 | 0.437 ms | 2.074 ms | 10/10 |

Método: script temporal con `performance.now()` alrededor de la interacción y el cambio de DOM resultante, 10 iteraciones por escenario, usando las mismas funciones de fábrica de los componentes (`createInput`, `createProgress`, `createDialog`) que consume Storybook.

**Evidencia medida (motores de navegador reales vía Playwright 1.62.1)**:

> Medición ejecutada con `@playwright/test` contra el build estático de Storybook (`npm run build-storybook`, servido localmente), navegando directamente a la historia "Playground" de cada componente (`iframe.html?id=componentes-<input|progress|dialog>--playground`). Cubre 3 motores de escritorio reales (Chromium, Firefox, WebKit) y 2 perfiles de emulación de dispositivo móvil (Pixel 7 sobre Chromium, iPhone 14 sobre WebKit). La emulación móvil reproduce viewport, user-agent y touch, pero **no sustituye hardware físico real**; queda documentada esa distinción de forma honesta.

| Navegador / perfil | Escenario | Iteraciones | Media | Máx. | <= 100 ms |
| --- | --- | --- | --- | --- | --- |
| Desktop Chromium | Input: eco de valor | 10 | 5.92 ms | 7.80 ms | 10/10 |
| Desktop Chromium | Progress: actualización de valor | 10 | 0.02 ms | 0.10 ms | 10/10 |
| Desktop Chromium | Dialog: apertura y cierre (con ciclo de foco) | 10 | 22.95 ms | 54.10 ms | 10/10 |
| Desktop Firefox | Input: eco de valor | 10 | 8.70 ms | 20.00 ms | 10/10 |
| Desktop Firefox | Progress: actualización de valor | 10 | 0.10 ms | 1.00 ms | 10/10 |
| Desktop Firefox | Dialog: apertura y cierre (con ciclo de foco) | 10 | 32.20 ms | 45.00 ms | 10/10 |
| Desktop WebKit (Safari) | Input: eco de valor | 10 | 11.60 ms | 22.00 ms | 10/10 |
| Desktop WebKit (Safari) | Progress: actualización de valor | 10 | 0.00 ms | 0.00 ms | 10/10 |
| Desktop WebKit (Safari) | Dialog: apertura y cierre (con ciclo de foco) | 10 | 37.10 ms | 44.00 ms | 10/10 |
| Chrome Android (emulación Pixel 7 / Chromium) | Input: eco de valor | 10 | 5.58 ms | 7.70 ms | 10/10 |
| Chrome Android (emulación Pixel 7 / Chromium) | Progress: actualización de valor | 10 | 0.04 ms | 0.10 ms | 10/10 |
| Chrome Android (emulación Pixel 7 / Chromium) | Dialog: apertura y cierre (con ciclo de foco) | 10 | 21.40 ms | 37.30 ms | 10/10 |
| Safari iOS (emulación iPhone 14 / WebKit) | Input: eco de valor | 10 | 14.70 ms | 68.00 ms | 10/10 |
| Safari iOS (emulación iPhone 14 / WebKit) | Progress: actualización de valor | 10 | 0.00 ms | 0.00 ms | 10/10 |
| Safari iOS (emulación iPhone 14 / WebKit) | Dialog: apertura y cierre (con ciclo de foco) | 10 | 37.50 ms | 45.00 ms | 10/10 |

**Resultado**: los 15 pares navegador/escenario cumplen el criterio de aprobación (<= 100 ms en al menos 8 de 10 iteraciones); en todos los casos se alcanzó 10/10. No se observaron bloqueos de interfaz durante la ejecución.

**Seguimiento pendiente**:
- [x] Ejecutar el método de medición en Chrome, Firefox y Safari desktop (últimas 2 versiones estables) — completado con los motores reales instalados vía Playwright (versión empaquetada más reciente disponible: Chromium/Firefox/WebKit 1.62.1).
- [x] Ejecutar el método de medición en un perfil de Chrome Android y Safari iOS — completado mediante emulación de dispositivo (Pixel 7, iPhone 14).
- [ ] Repetir la validación en al menos un dispositivo móvil físico real (Android/iOS) cuando se disponga de acceso a laboratorio de dispositivos; la emulación de Playwright no reproduce completamente las condiciones de hardware/red de un dispositivo físico.

## 7) Validar catálogo ampliado (9 componentes adicionales, ampliación 2026-08-16)

> Los 9 componentes (`CardTile`, `Select`, `RadioGroup`, `CheckboxGroup`, `Tabs`, `Toast`, `Tooltip`, `Spinner`, `Accordion`) están **implementados** (P1: `CardTile`, `Select`; P2: `RadioGroup`, `CheckboxGroup`, `Tabs`, `Toast`; P3: `Tooltip`, `Spinner`, `Accordion`). No requiere repetir la matriz de latencia de la sección 6 (SC-006 solo aplica a los 5 componentes base); aplica en su lugar SC-011/SC-012/SC-013.

```bash
npm run lint && npm test && npm run build && npm run build-storybook
```

**Evidencia real de ejecución (Phase 17, T152/T153)**:
- `npm run lint` → `check-components: 16 componente(s) verificado(s) sin problemas.` + `eslint .` sin errores.
- `npm test` → `Test Files 16 passed (16)` / `Tests 115 passed (115)`.
- `npm run build` → build de producción completado sin errores (`vite build`).
- `npm run build-storybook` → `Storybook build completed successfully` (únicamente advertencias informativas de tamaño de chunk, sin errores).

**Checklist visual por componente** (cada ítem = historia nombrada navegable en Storybook, verificado tras `npm run build-storybook`):
- `CardTile`: `Playground`, `Default`, `Bloqueada`, `ConImagen`, `SinEstado`.
- `Select`: `Playground`, `Default`, `ConValorPreseleccionado`, `SinEtiquetaVisible`, `SinOpciones`.
- `RadioGroup`: `Playground`, `Default`, `ConSeleccionPrevia`.
- `CheckboxGroup`: `Playground`, `Default`, `ConSeleccionesPrevias`.
- `Tabs`: `Playground`, `Default`, `TresSecciones`, `PanelVacio`.
- `Toast`: `Info`, `Success`, `Warning`, `Danger`, `Apilado`.
- `Tooltip`: `Default`, `Placements`, `SobreElementoDeshabilitado`.
- `Spinner`: `Small`, `Medium`, `Large`, `ConEtiqueta`.
- `Accordion`: `Default`, `MultipleExpandido`, `SeccionVacia`.

**Verificación de accesibilidad/teclado (SC-012/SC-013)** — confirmado por inspección de código y pruebas automatizadas:
- `CardTile` (`role="button"` + `tabindex="0"` + `keydown` Enter/Espacio + `aria-disabled` si bloqueada), `Select`/`RadioGroup`/`CheckboxGroup` (controles nativos `<select>`/`radio`/`checkbox`, operables por teclado por defecto y con `disabled`/`checked` reflejados) son 100% operables por teclado, con estado de selección/bloqueo expuesto a tecnologías de asistencia.
- `Tabs` (patrón `tablist`/`tab`/`tabpanel` con foco itinerante y activación automática con flechas), `Toast` (`role="status"` + `aria-live="polite"`) y `Accordion` (`aria-expanded` por encabezado) cumplen el patrón WAI-ARIA correspondiente sin fallos en pruebas.

## 8) Refinamiento de interacción y microanimaciones (Fase 18, FR-007/FR-033 a FR-046)

> Añade transiciones CSS consistentes basadas en tokens de movimiento compartidos, modo de expansión exclusiva en `Accordion`, icono indicador en `Select`, transición de marcado/desmarcado en `RadioGroup`/`CheckboxGroup`, pestañas deshabilitadas y validación todo-o-nada de iconos en `Tabs`, transición de entrada/salida en `Toast`, retardo de 300 ms (con soporte `prefers-reduced-motion`) en `Tooltip`, verificación de accesibilidad de `Spinner`, e iframe de Storybook ajustado al contenido para no recortar `Dialog`.

```bash
npm run lint && npm test && npm run build && npm run build-storybook
```

**Evidencia real de ejecución (Fase 18, T186, 2026-08-19)**:
- `npm run lint` → `check-components: 16 componente(s) verificado(s) sin problemas.` + `eslint .` sin errores.
- `npm test` → `Test Files 16 passed (16)` / `Tests 129 passed (129)` (14 pruebas nuevas respecto a Phase 17).
- `npm run build` → build de producción completado sin errores (`vite build`).
- `npm run build-storybook` → `Storybook build completed successfully` (únicamente advertencias informativas de tamaño de chunk, sin errores).

**Tokens de movimiento** (`src/styles/_motion.css`, importado desde `src/styles/index.css`):
- `--motion-duration-fast` (150ms), `--motion-duration-base` (220ms), `--motion-duration-slow` (320ms), `--motion-easing-standard`, `--motion-easing-emphasized`, `--motion-delay-tooltip` (300ms).
- Bloque `@media (prefers-reduced-motion: reduce)` que reduce todas las duraciones a `0s`.

**Checklist visual por componente** (historias nuevas/ampliadas, verificado tras `npm run build-storybook`):
- `Accordion`: nueva historia `ExpansionExclusiva` (modo `exclusive`).
- `Tabs`: nuevas historias `ConPestanaDeshabilitada`, `ConIconos`.
- Resto de componentes: transición/comportamiento verificado sobre las historias ya existentes (sin necesidad de historias adicionales, al no introducir nuevas ramas visuales distinguibles).

**Verificación de accesibilidad/teclado (Fase 18)**:
- `Tabs`: las pestañas `disabled` exponen `aria-disabled="true"` (no `disabled` nativo, para preservar el patrón de foco itinerante WAI-ARIA), no son activables por clic/teclado y se omiten en la navegación con flechas (`findNextEnabledIndex`).
- `Tooltip`: el revelado por hover/foco se retrasa 300 ms (`TOOLTIP_SHOW_DELAY_MS`); con `prefers-reduced-motion: reduce` el retardo se reduce a 0 ms; el ocultado y el tap-to-toggle táctil permanecen inmediatos.
- `Spinner`: confirmado por prueba explícita que, sin `label`, conserva nombre accesible sin texto visible (FR-039), sin cambios de código.

**Verificación del iframe de Storybook ajustado al contenido (US2-AC4, `Dialog`)**:
- `.storybook/preview.ts` sincroniza `document.body.style.minHeight` con `document.documentElement.scrollHeight` mediante `MutationObserver` + listener de `resize`.
- Verificado con Playwright contra el build estático: en la historia `componentes-dialog--base` con viewport reducido (800×400), `document.documentElement.scrollHeight` (496px) excede el viewport y el modal se renderiza completo sin recorte (captura de pantalla verificada).

**Decisiones de diseño documentadas**:
- `RadioGroup`/`CheckboxGroup`: transición implementada con `transform: scale(1.15)` sobre `:checked` (no `accent-color`, no animable de forma fiable entre navegadores), preservando los `<input>` nativos.
- `Toast`: la clase de salida (`.toast--exit`) se añade en `resolvedDuration - TOAST_EXIT_DURATION_MS` sin alterar el `setTimeout` de eliminación original en `resolvedDuration`, preservando el tiempo total de vida documentado (VAL-1501).

## 9) Validar Slider (ampliación 2026-08-19, implementado)

> `Slider` está **implementado** (FR-047 a FR-051, SC-021, DM-018, US12). Esta sección documenta evidencia real de ejecución (2026-08-19).

```bash
npm run lint && npm test && npm run build && npm run build-storybook
```

**Resultado real**:
- `npm run lint`: `check-components: 17 componente(s) verificado(s) sin problemas.` (incluye `libs/components/slider/` con la convención de archivos obligatorios) + `eslint .` sin incidencias.
- `npm test`: `Test Files 17 passed (17)` / `Tests 144 passed (144)`, incluyendo las 15 pruebas de `libs/components/slider/Slider.test.ts` (nombre accesible efectivo VAL-1801, construcción sobre `<input type="range">` nativo VAL-1802, valor por defecto `min` VAL-1803, normalización fuera de `[min, max]` VAL-1804, redondeo nativo a `step` VAL-1808, `showValue` por defecto/desactivado VAL-1805, catálogo `size` VAL-1806, bloqueo de `onChange` en `disabled` VAL-1807).
- `npm run build`: `vite build` completado sin errores.
- `npm run build-storybook`: build completado con éxito; `storybook-static/index.json` incluye las 8 historias nombradas de `Componentes/Slider`.

**Checklist visual verificado** (una historia nombrada por rama):
- `Slider`: `Default`, `Small`, `Medium`, `Large`, `SinValorVisible`, `Deshabilitado`, `FueraDeRango`, `SinEtiquetaVisible` — las 8 registradas en `storybook-static/index.json` bajo el título `Componentes/Slider`.

**Verificación de accesibilidad/teclado**:
- `Slider` (`<input type="range">` nativo) es 100% operable por teclado (flechas) por herencia del elemento nativo, con valor/mín/máx anunciables mediante `aria-label`/`label` y estado `disabled` reflejado de forma nativa a tecnologías de asistencia.

## Referencias

- Especificación: [spec.md](./spec.md)
- Plan: [plan.md](./plan.md)
- Modelo de datos: [data-model.md](./data-model.md)
- Contratos de API por componente: ver carpeta [contracts/](./contracts/) (un `.md` por componente, p. ej. [contracts/input-component.md](./contracts/input-component.md))
- Convención transversal (visual/iconografía/API/quality gates): [docs/conventions/components/visual-rules.md](../../docs/conventions/components/visual-rules.md) (evidencia de cumplimiento en [contracts/shared-components-visual-rules.md](./contracts/shared-components-visual-rules.md))