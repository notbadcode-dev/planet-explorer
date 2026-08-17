# Librería de componentes (`libs/components/`)

Esta carpeta aloja los componentes de interfaz **reutilizables** del proyecto: piezas
visuales "dummy" (presentacionales), independientes de cualquier feature, destino,
expedición o misión concreta del juego.

Antes de crear un componente nuevo dentro de una feature, comprueba primero si ya
existe un componente adecuado aquí (ver constitución, sección "Componentes
compartidas").

## Convenciones (fuente única de verdad en `docs/`)

Todas las convenciones técnicas de esta librería viven en
[`../../docs/conventions/components/`](../../docs/conventions/components/), no en
este README (para evitar mantener la misma regla en dos sitios). Consulta:

* [`structure.md`](../../docs/conventions/components/structure.md) — estructura
  mínima de ficheros de un componente y checklist de completitud (`*.test.ts` y
  `*.stories.ts` obligatorios; `npm run check:components` los exige).
* [`css.md`](../../docs/conventions/components/css.md) — CSS opcional
  co-localizado y prefijado por componente.
* [`api-patterns.md`](../../docs/conventions/components/api-patterns.md) —
  función factory, validación en runtime, callbacks, tipos y constantes.
* [`testing.md`](../../docs/conventions/components/testing.md) — entorno
  (`happy-dom`) y estrategia de selectores en tests.
* [`storybook.md`](../../docs/conventions/components/storybook.md) —
  nomenclatura y cobertura de historias.
* [`interaction-patterns.md`](../../docs/conventions/components/interaction-patterns.md) —
  accesibilidad por tipo de componente (form controls, modales, pestañas...).
* [`visual-rules.md`](../../docs/conventions/components/visual-rules.md) — reglas
  de tokens, iconografía, estabilidad de API y quality gates.

Índice completo, incluidos tokens de diseño y decisiones de arquitectura, en
[`../../docs/index.md`](../../docs/index.md).

## Uso

Cualquier componente se importa directamente desde su carpeta:

```ts
import { createButton } from 'libs/components/button';
```

## Componentes disponibles

- [`accordion/`](./accordion/) — Contenido expandible/colapsable por secciones,
  con expansión múltiple independiente por defecto (`aria-expanded` por
  encabezado).
- [`badge/`](./badge/) — Etiqueta de estado compacta, con variantes semánticas
  (`default`, `success`, `warning`, `danger`, `info`) e icono opcional.
- [`button/`](./button/) — Botón interactivo básico, con variantes, tamaños,
  icono opcional, estado deshabilitado y etiqueta accesible. Ver
  [contrato vigente de `Button`](../../specs/002-button-variants/contracts/button-component.md).
- [`card-tile/`](./card-tile/) — Unidad clicable/seleccionable en cuadrícula
  (icono o imagen, título y `Badge` de estado), con soporte de bloqueo.
- [`checkbox-group/`](./checkbox-group/) — Grupo de casillas de verificación
  con selección múltiple independiente y `onChange` de valores seleccionados.
- [`dialog/`](./dialog/) — Modal con título, descripción opcional, contenido
  y acciones compuestas (uno o varios botones).
- [`icon/`](./icon/) — Renderizador común de iconos Phosphor del catálogo local.
- [`input/`](./input/) — Campo de texto con etiqueta, texto de ayuda, estado
  de error, deshabilitado y soporte de etiqueta accesible sin texto visible.
- [`panel/`](./panel/) — Contenedor de contenido compuesto con variantes
  (`default`, `highlight`, `danger`).
- [`progress/`](./progress/) — Barra de progreso con valor/máximo
  configurables y normalización determinista de valores fuera de rango.
- [`radio-group/`](./radio-group/) — Grupo de botones de radio con selección
  única, agrupados mediante `<fieldset>`/`name` compartido.
- [`select/`](./select/) — Selector nativo (`<select>`) con etiqueta, opciones
  y `onChange`, con marcador de posición cuando no hay opciones disponibles.
- [`spinner/`](./spinner/) — Indicador de carga indeterminada
  (`role="status"` + `aria-busy="true"`), distinto de `Progress`.
- [`tabs/`](./tabs/) — Navegación por pestañas con patrón WAI-ARIA
  `tablist`/`tab`/`tabpanel`, foco itinerante y activación automática con flechas.
- [`toast/`](./toast/) — Aviso transitorio no bloqueante (`showToast`) con
  región en vivo (`aria-live="polite"`) y apilado simultáneo de instancias.
- [`tooltip/`](./tooltip/) — Texto explicativo bajo demanda (`attachTooltip`),
  con hover/foco en escritorio y tap-to-toggle en dispositivos táctiles.
