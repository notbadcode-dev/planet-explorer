---
title: "Convención: Patrones de API de componente (factory, validación, callbacks)"
type: "convention"
version: "1.1"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
source: "libs/components/ (patrón implícito en los 16 componentes existentes)"
tags: [convention, frontend, api-design]
---

# Convención: Patrones de API de componente (factory, validación, callbacks)

**Fuente**: patrón implícito ya aplicado por igual en los 16 componentes de
`libs/components/` (button, dialog, tabs, input, checkbox-group, toast, etc.),
nunca antes escrito como convención explícita.

**Amplía**: [`structure.md`](./structure.md) (v1.0), que fija la estructura de
ficheros de un componente pero no el contenido/forma de su API pública.

## Propósito

Fijar cómo debe construirse la API pública de un componente (función de creación,
props, validación en runtime, callbacks) para que cualquier componente nuevo sea
indistinguible en estilo de los existentes, sin que cada feature tenga que
redescubrir el patrón leyendo código ajeno.

## Función factory

* **P1**: Cada componente MUST exponer una única función factory exportada con el
  nombre `create{ComponentName}(props)` (p. ej. `createButton`, `createDialog`,
  `createCheckboxGroup`) que retorna un `HTMLElement` (o subtipo, p. ej.
  `HTMLButtonElement`) ya configurado y listo para insertarse en el DOM.
* **P2**: Los componentes MUST NOT exponer clases, instancias con estado interno
  oculto, ni Custom Elements. **Alternativa descartada**: Web Components/Shadow
  DOM (`specs/001-component-library-architecture/research.md`) — "queda como
  alternativa razonable a reconsiderar si en el futuro los componentes necesitan
  encapsulación de estilos o ciclo de vida más rico. Descartada para esta
  iteración por complejidad no justificada (YAGNI)". No reconsiderar sin una
  necesidad explícita de encapsulación de estilos o ciclo de vida más rico.

## Tipos derivados de catálogos cerrados

* **P3**: Un catálogo cerrado de valores (variante, tamaño, posición, etc.) MUST
  declararse como array `as const` en `{Component}.constants.ts` y su tipo MUST
  derivarse con `type X = (typeof X_VALUES)[number]` en `{Component}.type.ts`, en
  lugar de declarar el tipo unión a mano por separado.
* **P4**: `Input` y `Dialog` (y cualquier componente nuevo con prop `size`) MUST
  reutilizar el catálogo cerrado `'small' | 'medium' | 'large'` (por defecto
  `'medium'`) ya definido por `Button` en lugar de definir una escala propia (ver
  A2 en [`visual-rules.md`](./visual-rules.md)).

## Validación en runtime y fallback silencioso

* **P5**: Todo prop con catálogo cerrado MUST validarse en runtime mediante un par
  de funciones `is{Type}(value: unknown): value is Type` y
  `resolve{Type}(value: unknown): Type`, ya que TypeScript no protege frente a
  consumidores sin tipos (p. ej. HTML plano, JS no tipado).
* **P6**: Si el valor recibido no pertenece al catálogo, `resolve{Type}` MUST
  devolver el valor por defecto documentado en silencio (sin lanzar excepción ni
  registrar warning), de forma que el componente siga siendo utilizable y
  visualmente coherente.

## Callbacks

* **P7**: Los callbacks de interacción MUST nombrarse `on{PascalCaseAction}` (p.
  ej. `onClick`, `onChange`, `onClose`, `onDismiss`, `onSelect`, `onToggle`) y
  MUST tipar como funciones que retornan `void`.
* **P8**: Un callback MUST ser obligatorio en la prop si el componente no tiene
  forma de comunicar ese evento por otro medio (p. ej. `onClick` en `Button`,
  `onClose` en `Dialog`); MAY ser opcional si el evento es complementario (p. ej.
  `onDismiss` en `Toast`).

## Composición de contenido

* **P9**: Un componente contenedor (p. ej. `Panel`, `Dialog`) que acepte contenido
  externo MUST tipar la prop como `HTMLElement | HTMLElement[]`, MUST preservar el
  orden de inserción cuando reciba un array, y MUST NOT mutar los nodos externos
  recibidos.

## Normalización de valores numéricos

* **P10**: Un componente con un valor numérico acotado (p. ej. `Progress`) MUST
  normalizar la entrada de forma determinista: valores por debajo del mínimo se
  ajustan al mínimo, valores por encima del máximo se ajustan al máximo, y un
  máximo inválido (`<= 0`) se trata como el mínimo válido seguro. MUST NOT lanzar
  excepciones por valores fuera de rango.

## Separación de componentes por semántica

* **P11**: Si dos variantes de un mismo concepto tienen contratos de
  comportamiento/accesibilidad distintos (p. ej. selección única vs. selección
  múltiple), MUST implementarse como dos componentes independientes en dos
  carpetas (como `RadioGroup`/`CheckboxGroup`), en lugar de un único componente
  con una prop `mode` que ramifique su comportamiento internamente.
  **Alternativa descartada**: componente único `ChoiceGroup` con prop `mode`
  (`specs/003-shared-components-base/research.md`) — rechazado por "mezclar dos
  contratos de accesibilidad distintos" en una sola API.

## Preferencia por controles nativos sobre reimplementaciones ARIA

* **P13**: Si existe un elemento HTML nativo que ya resuelve la interacción y
  accesibilidad requeridas (p. ej. `<select>` para un desplegable), el
  componente MUST construirse sobre ese elemento nativo en lugar de
  reimplementar el patrón ARIA equivalente (p. ej. un listbox personalizado)
  desde cero. **Alternativa descartada**: listbox ARIA personalizado para
  `Select` (`specs/003-shared-components-base/research.md`) — rechazado "por el
  coste de reimplementar teclado/accesibilidad y riesgo de regresiones" frente
  al `<select>` nativo, que "hereda accesibilidad y operabilidad de teclado del
  sistema operativo sin reimplementar semántica ARIA de listbox". Precedente
  aplicable a futuros date pickers/time pickers.

## Constantes de atributos, clases y eventos

* **P12**: Además de los catálogos cerrados (P3), `{Component}.constants.ts` MUST
  centralizar nombres de etiqueta HTML, clases CSS (BEM, ver
  [`css.md`](./css.md)), atributos ARIA/HTML y nombres de eventos usados en el
  componente, con el patrón de nombrado `{COMPONENT}_{SEMANTIC_NAME}` (p. ej.
  `BUTTON_BASE_CLASS`, `DIALOG_CLOSE_EVENT`). Esto amplía la regla V4 de
  [`visual-rules.md`](./visual-rules.md) ("los `*.constants.ts` MUST centralizar
  strings y números").

## Fuera de alcance

* La estructura de ficheros de un componente (qué ficheros existen) — vive en
  [`structure.md`](./structure.md).
* Las reglas de testing/selectores para verificar estos patrones — viven en
  [`testing.md`](./testing.md).
* El comportamiento de accesibilidad concreto de cada patrón de interacción
  (foco, ARIA live, teclado) — vive en
  [`interaction-patterns.md`](./interaction-patterns.md).
* Las decisiones de arquitectura y alternativas descartadas — cada patrón cita
  aquí mismo su alternativa descartada; no existe un registro aparte.
* La API pública específica de un componente concreto (qué props tiene, qué
  hace cada una) — vive en su contrato individual dentro de
  `specs/NNN-feature/contracts/`.
