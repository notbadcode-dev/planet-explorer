---
title: "Contrato: Evidencia de cumplimiento de reglas visuales e iconografía compartida"
feature: "003-shared-components-base"
type: "contract"
version: "1.4"
created: "2026-08-16"
updated: "2026-08-19T00:00:00Z"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [contract, design-system, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Contrato: Evidencia de cumplimiento de reglas visuales e iconografía compartida

## Propósito

Este fichero conserva la **evidencia de cumplimiento** (auditoría T038/T045/T070/T154/Fase 18) de esta feature frente a las reglas transversales A1-A2, V1-V4, I1-I5 y Q1-Q10.

> Las reglas en sí (antes definidas aquí) se migraron el 2026-08-16 a
> [`docs/conventions/components/visual-rules.md`](../../../docs/conventions/components/visual-rules.md)
> por ser una convención transversal de `libs/components/`, no un contrato específico de esta
> feature. Este fichero mantiene únicamente el historial de auditoría, que sí es propio de
> `003-shared-components-base`.

La interfaz pública específica de cada componente (props, reglas de comportamiento propias) se define en su propio contrato individual dentro de esta misma carpeta: [input-component.md](./input-component.md), [panel-component.md](./panel-component.md), [badge-component.md](./badge-component.md), [progress-component.md](./progress-component.md), [dialog-component.md](./dialog-component.md), [card-tile-component.md](./card-tile-component.md), [select-component.md](./select-component.md), [radio-group-component.md](./radio-group-component.md), [checkbox-group-component.md](./checkbox-group-component.md), [tabs-component.md](./tabs-component.md), [tooltip-component.md](./tooltip-component.md), [toast-component.md](./toast-component.md), [spinner-component.md](./spinner-component.md), [accordion-component.md](./accordion-component.md).

## Trazabilidad

- Requisitos: FR-005, FR-006, FR-007, FR-008, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022 a FR-032, FR-033 a FR-046.
- Criterios de éxito: SC-002, SC-003, SC-004, SC-005, SC-006, SC-007, SC-008, SC-009, SC-010, SC-011, SC-012, SC-013.

## Evidencia de cumplimiento (auditoría T038/T045)

> **Nota de alcance**: la auditoría siguiente cubre únicamente los 5 componentes base. Q8-Q10 (ampliación 2026-08-16) quedaron pendientes de evidencia hasta la Phase 17 — ver "Evidencia de cumplimiento — Phase 17 (T154, 2026-08-16)" más abajo, donde se cierran con los 9 componentes adicionales implementados.

- **V1-V3 (tokens)**: los CSS de `input`, `panel`, `badge`, `progress` y `dialog` solo consumen `var(--...)` de `src/styles/`; no se detectan colores/medidas/fuentes hardcoded. Los tokens de icono de estado (`--size-icon-xs`, `--size-icon-sm`) ya existían en `_spacing.css`, sin necesidad de ampliar el set global.
- **V4 (constantes)**: `check-components.mjs` (regla `isMagicLiteral`) pasa sin incidencias sobre los cinco componentes, confirmando ausencia de literales mágicos fuera de `*.constants.ts`.
- **I1-I3 (iconografía centralizada)**: `grep` sobre `libs/components/**` confirma que los imports de `@phosphor-icons/core` existen únicamente en `libs/components/icon/Icon.constants.ts`; el catálogo se amplió ahí (`check-circle`, `warning-circle`, `x-circle`, `info-circle`) para cubrir los iconos de estado no-color de `Badge`/`Panel`.
- **I4-I5 (decorativo vs. informativo)**: los iconos de estado automáticos de `Badge`/`Panel` se crean sin `ariaLabel` (decorativos, `aria-hidden`); el icono opcional de `Badge` y las acciones de `Dialog` exponen `ariaLabel`/texto accesible cuando transmiten significado.
- **Q1-Q5 (gates)**: última ejecución registrada — `npm run lint` OK, `npm test` 57/57 OK, `npm run build` OK, `npm run build-storybook` OK. **Q5 verificado**: tras reforzar el requisito (spec.md FR-003/SC-002, 2026-08-16), `/speckit-implement` cerró la brecha (tasks.md T022/T032) añadiendo historias nombradas por estado/variante en los 5 componentes: `Input` (`PorDefecto`, `ConAyuda`, `ConError`, `Deshabilitado`, `SinEtiquetaVisible`), `Badge` (`Default`, `Success`, `Warning`, `Danger`, `Info`), `Progress` (`Vacio`, `Parcial`, `Completo`, `FueraDeRango`), `Panel` (`Default`, `Highlight`, `Danger`), `Dialog` (`Base`, `ConAccionesCompuestas`, `SinDescripcion`); la historia `Playground` se conserva en los 5 componentes como complemento.

## Evidencia de cumplimiento — Phase 8 (T070, 2026-08-16)

- **A2 (tamaños Input/Dialog, FR-019)**: `Input` y `Dialog` implementan `size?: 'small' | 'medium' | 'large'` (`medium` por defecto) reutilizando exactamente `ComponentSize`/`ButtonSize`, con clases modificadoras `input--<size>`/`dialog--<size>` y estilos tokenizados; fallback verificado ante valores no soportados en runtime.
- **Q6 (combinaciones de casos límite, FR-020)**: cubiertas mediante historias nombradas — `Input.ConAyudaYError`, `Badge.ConIconoDeConsumidor`, `Progress.SinValorVisible`/`Progress.ValorNegativo`, `Panel.ContenidoMultiple`, `Dialog.ConContenidoYAccionesMultiples`/`Dialog.ConCloseLabelPersonalizado`.
- **Q7 (demostración interactiva de Dialog, FR-021)**: cubierta mediante `Dialog.InteractivoDesdeBoton` y `Dialog.InteractivoDesdeInput`, que montan un invocador real en el canvas y demuestran visualmente el retorno de foco al cerrar.
- **Gates**: última ejecución registrada tras Phase 8 — `npm run lint` OK (`check-components`: 7/7), `npm test` 63/63 OK, `npm run build` OK, `npm run build-storybook` OK.

## Evidencia de cumplimiento — Phase 17 (T154, 2026-08-16)

> Cierra la nota de alcance de la sección anterior: Q8-Q10 quedan verificados con los 9 componentes de la ampliación 2026-08-16 ya implementados (`CardTile`, `Select`, `RadioGroup`, `CheckboxGroup`, `Tabs`, `Toast`, `Tooltip`, `Spinner`, `Accordion`).

- **Q8 (historias nombradas por estado/variante, SC-011)**: verificado — cada uno de los 9 componentes expone historias nombradas individuales además de su `Playground` (donde aplica): `CardTile` (`Default`, `Bloqueada`, `ConImagen`, `SinEstado`), `Select` (`Default`, `ConValorPreseleccionado`, `SinEtiquetaVisible`, `SinOpciones`), `RadioGroup` (`Default`, `ConSeleccionPrevia`), `CheckboxGroup` (`Default`, `ConSeleccionesPrevias`), `Tabs` (`Default`, `TresSecciones`, `PanelVacio`), `Toast` (`Info`, `Success`, `Warning`, `Danger`, `Apilado`), `Tooltip` (`Default`, `Placements`, `SobreElementoDeshabilitado`), `Spinner` (`Small`, `Medium`, `Large`, `ConEtiqueta`), `Accordion` (`Default`, `MultipleExpandido`, `SeccionVacia`).
- **Q9 (teclado + estado accesible en CardTile/Select/RadioGroup/CheckboxGroup, SC-012)**: verificado por inspección de código y pruebas automatizadas — `CardTile` usa `role="button"` + `tabindex="0"` + `keydown` (Enter/Espacio) + `aria-disabled` cuando `locked`; `Select`/`RadioGroup`/`CheckboxGroup` se apoyan en controles nativos (`<select>`, `radio`, `checkbox`) operables por teclado por defecto, reflejando `disabled`/`checked`/`value` sin necesidad de gestión manual de foco.
- **Q10 (patrones WAI-ARIA en Tabs/Toast/Accordion, SC-013)**: verificado — `Tabs` implementa `tablist`/`tab`/`tabpanel` con foco itinerante (`tabIndex` activo/inactivo) y activación automática con flechas; `Toast` usa un contenedor compartido `role="status"` + `aria-live="polite"` sin robo de foco ni cierre obligatorio; `Accordion` expone `aria-expanded` por encabezado con expansión múltiple independiente por defecto (R-026). Sin fallos en `Tabs.test.ts` (5), `Toast.test.ts` (5) y `Accordion.test.ts` (4).
- **Gates (Phase 17, T152)**: `npm run lint` OK (`check-components`: 16/16 componentes), `npm test` → 115/115 OK (16 archivos de test), `npm run build` OK, `npm run build-storybook` OK (únicamente advertencias informativas de tamaño de chunk, sin errores).

## Evidencia de cumplimiento — Fase 18 (T155-T186, 2026-08-19, refinamiento de interacción)

> Cubre FR-007, FR-033 a FR-046 (transiciones, modo exclusivo de `Accordion`, icono indicador de `Select`, pestañas deshabilitadas/validación de iconos de `Tabs`, retardo de `Tooltip`, iframe de Storybook ajustado al contenido).

- **V1-V4 (tokens y constantes)**: se creó `src/styles/_motion.css` con `--motion-duration-fast` (150ms), `--motion-duration-base` (220ms), `--motion-duration-slow` (320ms), `--motion-easing-standard`, `--motion-easing-emphasized` y `--motion-delay-tooltip` (300ms), consumidos exclusivamente vía `var(--...)` desde `Accordion.css`, `RadioGroup.css`, `CheckboxGroup.css`, `Tabs.css` y `Toast.css`; ningún componente introduce duraciones/easings hardcoded. `check-components.mjs` (regla `isMagicLiteral`) verificado sin incidencias tras mover los literales numéricos/de cadena introducidos (p. ej. `TABS_ICON_NONE_COUNT`, `TABS_STEP_START`, `TOAST_MIN_DELAY_MS`, `TOOLTIP_TYPEOF_FUNCTION`) a sus respectivos `*.constants.ts`, y la interfaz `AccordionEntry` movida de `Accordion.ts` a `Accordion.type.ts`.
- **FR-045 (reduced motion)**: `src/styles/_motion.css` incluye un bloque `@media (prefers-reduced-motion: reduce)` que reduce a `0s` todos los tokens de duración; `Tooltip.ts` además consulta explícitamente `window.matchMedia('(prefers-reduced-motion: reduce)')` (con guarda defensiva, ya que `happy-dom` no implementa `matchMedia` en el entorno de pruebas) para reducir su retardo de 300ms a 0ms.
- **I1-I5 (iconografía)**: el nuevo icono `caret-down` (usado por `Accordion` y `Select`) se añadió únicamente en `Icon.constants.ts` (`APP_ICON_NAMES`/`APP_ICON_SVGS`); tanto `Accordion` como `Select` lo consumen vía `createIcon(...)` de forma decorativa (`aria-hidden="true"`), sin imports directos de `@phosphor-icons/core`.
- **Q1-Q4 (gates)**: `npm run lint` OK (`check-components`: 16/16 componentes), `npm test` → 129/129 OK (16 archivos de test), `npm run build` OK, `npm run build-storybook` OK (únicamente advertencias informativas de tamaño de chunk, sin errores).
- **US2-AC4 (iframe de Storybook ajustado al contenido)**: ver evidencia detallada en `dialog-component.md` — Fase 18.
- **Diseño**: para el estado marcado/desmarcado de `RadioGroup`/`CheckboxGroup` se optó por animar `transform: scale()` en lugar de `accent-color` (no animable de forma fiable entre navegadores), preservando los `<input>` nativos sin rediseño de checkbox personalizado.