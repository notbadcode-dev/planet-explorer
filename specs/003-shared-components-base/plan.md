---

title: "Base ampliada de componentes compartidos reutilizables"
feature: "003-shared-components-base"
type: "implementation-plan"
version: "1.5"
created: "2026-08-16"
updated: "2026-08-19T00:00:00Z"
status: "Draft"
spec: "./spec.md"
tags: [frontend, ui, accessibility, testing, architecture]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
------------------------------------------------------------

# Plan de implementación: Base ampliada de componentes compartidos reutilizables

**Rama**: `003-shared-components-base` | **Fecha**: 2026-08-16 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/003-shared-components-base/spec.md`

**Nota**: Esta plantilla se completa mediante el comando `/speckit-plan`; su definición describe el flujo de ejecución.

## Resumen

La funcionalidad crea la base mínima de cinco componentes compartidos nuevos en `libs/components/` (`Input`, `Panel`, `Badge`, `Progress`, `Dialog`) para construir vistas sin duplicar UI, manteniendo independencia de dominio y reutilización transversal. El enfoque técnico sigue la convención existente del repositorio: componente por carpeta con API pública en `index.ts`, estilos co-localizados, tipado explícito, contratos de accesibilidad y validación por tests + Storybook.

Para preservar coherencia de diseño y mantenibilidad, los componentes consumirán tokens globales de `src/styles/`, reutilizarán `Button` e `Icon` cuando corresponda, y aplicarán reglas estrictas de iconografía centralizada y compatibilidad mínima en navegadores evergreen desktop/móvil (últimas 2 versiones estables).

**Ampliación 2026-08-16 (catálogo ampliado)**: esta misma feature incorpora 9 componentes adicionales motivados por las pantallas de un juego educativo de astronomía (Card/Tile, Select, RadioGroup, Checkbox-group, Tabs, Tooltip, Toast/Snackbar, Spinner/Loader, Accordion — FR-022 a FR-032), agnósticos de dominio igual que los 5 originales, implementados en 3 oleadas de prioridad (P1/P2/P3) sin bloquear una oleada a la siguiente.

**Ampliación 2026-08-19 (Slider)**: se incorpora un componente adicional `Slider` (control deslizante de valor numérico continuo, motivado por necesidades transversales de volumen de audio y ajustes del panel parental — FR-047 a FR-051), construido sobre `<input type="range">` nativo, reutilizando el catálogo de tamaños `ComponentSize` y el patrón `showValue` ya existentes en el catálogo.

## Contexto técnico

**Lenguaje/Versión**: TypeScript 6 (ESM) + CSS

**Dependencias principales**: Vite 8, Vitest 4 + happy-dom, Storybook 10 (`@storybook/html-vite`), ESLint 10, `@phosphor-icons/core` consumido indirectamente mediante `libs/components/icon`

**Almacenamiento**: N/A

**Testing**: Vitest (unitario/comportamiento/accesibilidad), revisión de estados en Storybook, validación de estructura con `check-components.mjs`

**Plataforma objetivo**: Navegadores evergreen desktop y móvil (últimas 2 versiones estables)

**Tipo de proyecto**: Librería interna de componentes UI para aplicación web estática

**Objetivos de rendimiento**: En la ejecución de la matriz de rendimiento de `quickstart.md`, cada interacción crítica (`Input` al escribir, `Progress` al actualizar, `Dialog` al abrir/cerrar) MUST registrar latencia <= 100 ms en al menos 8 de 10 iteraciones por navegador objetivo, sin bloqueos visibles de la interfaz

**Restricciones**: Sin lógica de dominio educativo/astronómico/juego en componentes; sin iconos directos fuera de `Icon`; sin magic strings/numbers en código productivo fuera de `*.constants.ts`; sin estilos hardcoded fuera de tokens globales

**Escala/Alcance**: 5 componentes nuevos, 5 carpetas nuevas en `libs/components/`, actualización de tokens globales solo si hay huecos reutilizables reales. Ampliación 2026-08-17 (tras revisión manual de Storybook): `Input`/`Dialog` incorporan `size` (`small|medium|large`, reutilizando `ComponentSize` de `Button`); Storybook debe cubrir combinaciones de casos límite y `Dialog` debe sumar historias interactivas con invocador real (botón/input) y retorno de foco verificable (ver FR-019 a FR-021, R-018/R-019). Ampliación 2026-08-16 (catálogo ampliado): +9 componentes nuevos, +9 carpetas nuevas en `libs/components/` (`card-tile`, `select`, `radio-group`, `checkbox-group`, `tabs`, `tooltip`, `toast`, `spinner`, `accordion`), en 3 oleadas de prioridad (ver FR-022 a FR-032, SC-010 a SC-013). Ampliación 2026-08-19: +1 componente nuevo `Slider`, +1 carpeta nueva `libs/components/slider/` (ver FR-047 a FR-051, SC-021), sin oleada de prioridad propia (P3, no bloqueante).

**Nota de terminología (resuelta 2026-08-16)**: SC-001 se reformuló para dejar explícito el total de 14 componentes nuevos aportados por esta feature (5 base + 9 de la ampliación, regidos por SC-010), eliminando la brecha de consistencia terminológica señalada anteriormente (ver Riesgos y compromisos).

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

**Pre-Fase 0**

* **Simplicidad primero (VI)**: Cumple. Se usa stack existente sin frameworks UI adicionales ni nuevas dependencias de runtime.
* **Componentes compartidos**: Cumple. La funcionalidad expande la librería en `libs/components/` con componentes reutilizables y desacoplados de features.
* **Accesibilidad**: Cumple. La spec exige naming accesible, estados ARIA y flujo de foco completo en `Dialog`.
* **Arquitectura y mantenibilidad**: Cumple. API pública acotada por componente, separación en `type/constants`, y reglas explícitas de contratos.
* **Diseño visual coherente**: Cumple. Se fuerza consumo de tokens globales y prohibición de hardcode visual.

**Post-Fase 1**

* Revalidado: sin nuevas violaciones constitucionales tras diseño de entidades, contratos y guía de validación.
* Revalidado (ampliación 2026-08-16): los 9 componentes adicionales cumplen los mismos principios — en particular, la decisión de tap-to-toggle en Tooltip y el apilado no destructivo de Toast refuerzan explícitamente el principio I ("Experiencia centrada en el niño", interacción táctil y ausencia de pérdida de feedback). Ninguna decisión introduce lógica de dominio ni rompe la independencia exigida por FR-004/FR-032.
* Revalidado (ampliación 2026-08-19): `Slider` cumple los mismos principios — construirse sobre `<input type="range">` nativo hereda accesibilidad/teclado del sistema (principio de accesibilidad), y reutilizar `ComponentSize`/`showValue` evita fragmentar el design system (principio de arquitectura y mantenibilidad). No introduce lógica de dominio (FR-048).
* Verificado post-implementación (ampliación 2026-08-19, T203): `Slider` implementado en `libs/components/slider/` con evidencia real de `npm run lint`, `npm test` (144/144), `npm run build` y `npm run build-storybook` (ver quickstart.md sección 9). Auditoría de ausencia de lógica de dominio documentada en contracts/slider-component.md confirma cumplimiento de FR-048. Ningún gate constitucional queda pendiente de revisión.

**Resultado**: Gate superado. No se requiere seguimiento de complejidad.

## Investigación técnica

* **Definir baseline de accesibilidad en `Input` y `Dialog`**: concretar manejo de `aria-describedby`, `aria-invalid` y ciclo de foco de modal para alinear tests y contrato.
* **Normalización robusta de `Progress`**: definir reglas de clamp para `value` y `max` fuera de rango sin comportamiento ambiguo.
* **Estrategia de variantes visuales en `Badge` y `Panel` sin depender solo de color**: concretar señales visuales adicionales consistentes con tokens globales.
* **Evolución controlada de tokens globales**: decidir cuándo añadir tokens nuevos y cómo evitar proliferación de valores redundantes.
* **Contrato de composición por `HTMLElement | HTMLElement[]`**: unificar patrón entre `Panel` y `Dialog` para contenido y acciones.
* **Select nativo vs. listbox personalizado**: decidir la base de implementación de Select/Dropdown y su impacto en estilo/teclado (resuelto en clarify: `<select>` nativo).
* **Modelo de RadioGroup/Checkbox(-group)**: decidir si son un único componente configurable o dos componentes independientes con semántica de agrupación distinta.
* **Patrón de navegación de Tabs**: concretar el patrón WAI-ARIA de pestañas/panel con navegación por flechas.
* **Ciclo de vida de Toast/Snackbar**: concretar apilado, duración por defecto y región en vivo no bloqueante (resuelto en clarify: apilado + 4000 ms).
* **Activación de Tooltip en táctil**: concretar estrategia sin hover (resuelto en clarify: tap-to-toggle).
* **Base de implementación de Slider**: decidir si se construye sobre `<input type="range">` nativo o un control ARIA personalizado (resuelto en clarify: nativo, mismo criterio que Select).

## Decisiones técnicas

### Contrato de accesibilidad primero en Input/Dialog

**Decisión**: Diseñar y probar `Input` y `Dialog` con contrato accesible explícito antes de detalles cosméticos, incluyendo nombre accesible, descripciones vinculadas y flujo de teclado del modal.

**Motivo**: Las reglas de accesibilidad impactan API, constantes y estructura de tests; decidirlas al inicio evita retrabajo transversal.

**Alternativas descartadas**: Definir accesibilidad al final de implementación; se descarta por alto riesgo de cambios de API y fallos en aceptación.

### Normalización determinista para Progress

**Decisión**: Aplicar normalización determinista para `Progress` en límites inválidos (`max <= 0`, `value < 0`, `value > max`) y reflejarla tanto visual como semánticamente.

**Motivo**: Evita resultados inconsistentes entre UI y atributos de accesibilidad; facilita pruebas unitarias reproducibles.

**Alternativas descartadas**: Fallar en runtime con error; se descarta por peor experiencia para consumidores y menor resiliencia.

### Variantes visuales guiadas por tokens globales

**Decisión**: Resolver estilos de `Panel` y `Badge` solo con tokens globales de color/espaciado/sombra/radio/tipografía, añadiendo tokens reutilizables únicamente cuando falte cobertura real.

**Motivo**: Mantiene coherencia de sistema y previene deuda visual por valores ad hoc.

**Alternativas descartadas**: Hardcode local temporal de estilos; se descarta por contradecir requisitos y elevar coste de mantenimiento.

### Reutilización obligatoria de Icon y Button

**Decisión**: Cualquier iconografía en los nuevos componentes se canaliza por `Icon`; las acciones de `Dialog` en documentación/historias se componen con `Button` existente.

**Motivo**: Evita duplicación de componentes base y centraliza consistencia visual/accesible.

**Alternativas descartadas**: Iconos inline o botones ad hoc en stories; se descarta por romper arquitectura acordada.

### Historias de Storybook nombradas por estado

**Decisión**: Cada componente expone una historia de Storybook nombrada e individual por cada estado/variante/rama visual distinguible de su API pública, siguiendo la convención ya usada por `Button` (`Enabled`, `Disabled`, `SoloEtiquetaAccesible`, `Secondary`, `Danger`, …). La historia `Playground` con controles se conserva como complemento, no como sustituto.

**Motivo**: Alinea el catálogo de historias con la convención existente del repositorio y hace cada rama revisable/navegable de forma discreta en el panel de Storybook, en vez de depender de que la persona revisora manipule controles manualmente.

**Alternativas descartadas**: Un único playground interactivo con controles como única historia (rechazado tras convergencia por inconsistencia con `Button` y por dificultar la revisión discreta de cada rama).

### Select sobre `<select>` nativo

**Decisión**: Select/Dropdown se implementa sobre el elemento `<select>` nativo del navegador, no como un listbox personalizado con ARIA.

**Motivo**: Decisión explícita de `/speckit-clarify` (2026-08-16); hereda accesibilidad y operabilidad de teclado del sistema operativo sin reimplementar semántica ARIA de listbox, priorizando robustez sobre control total de estilo.

**Alternativas descartadas**: Listbox personalizado con `role="listbox"`/`option` (rechazado por el coste de reimplementar teclado/accesibilidad y el riesgo de regresiones frente al control nativo).

### RadioGroup y CheckboxGroup como componentes independientes

**Decisión**: `RadioGroup` (selección única) y `CheckboxGroup` (selección múltiple) se implementan como dos componentes independientes en `libs/components/radio-group/` y `libs/components/checkbox-group/`, cada uno con su propia carpeta y API, en lugar de un único componente configurable por modo.

**Motivo**: Sus semánticas de agrupación accesible difieren (`role="radiogroup"` con exclusividad mutua vs. conjunto de checkboxes independientes); mantenerlos separados evita una API con ramas condicionales según un `mode` y sigue la convención de una carpeta por componente ya establecida en el repositorio.

**Alternativas descartadas**: Un único componente `ChoiceGroup` con prop `mode: 'single' | 'multiple'` (rechazado por mezclar dos contratos de accesibilidad distintos bajo una sola API).

### Tabs siguiendo el patrón WAI-ARIA de pestañas

**Decisión**: `Tabs` implementa el patrón estándar de Authoring Practices Guide (APG) para tabs: lista de pestañas con `role="tablist"`/`tab`, paneles con `role="tabpanel"`, asociación por `aria-controls`/`aria-labelledby`, y navegación entre pestañas con flechas izquierda/derecha (activación automática al navegar).

**Motivo**: Es el patrón de referencia documentado y probado por lectores de pantalla; evita inventar una variante propia con menor soporte de accesibilidad.

**Alternativas descartadas**: Navegación solo por Tab/Shift+Tab sin flechas (rechazado por no seguir el patrón esperado por usuarios de tecnologías de asistencia).

### Toast/Snackbar apilado con duración por defecto

**Decisión**: Toast/Snackbar usa una región en vivo (`aria-live="polite"`) que apila todas las notificaciones activas simultáneamente, cada una con una duración por defecto de 4000 ms antes de autodescartarse, sin bloquear foco ni exigir cierre manual.

**Motivo**: Decisión explícita de `/speckit-clarify` (2026-08-16); prioriza no perder feedback para un usuario infantil frente a la complejidad de gestionar una cola secuencial.

**Alternativas descartadas**: Cola secuencial de un mensaje a la vez (rechazado: retrasa feedback); reemplazo inmediato del mensaje anterior (rechazado: puede ocultar feedback relevante).

### Tooltip con activación táctil por tap

**Decisión**: Tooltip revela su contenido con hover de puntero o foco de teclado en desktop, y con tap-to-toggle (alternar mostrar/ocultar) en dispositivos táctiles donde no existe hover.

**Motivo**: Decisión explícita de `/speckit-clarify` (2026-08-16); sin esta estrategia, Tooltip quedaría inaccesible en el dispositivo principal del público objetivo (tablet/móvil), contradiciendo el principio constitucional de interacción táctil.

**Alternativas descartadas**: Long-press (rechazado por ser menos descubrible para un niño); no soportar táctil (rechazado por incompatibilidad con FR-017).

### Card/Tile sin estado "seleccionado" propio

**Decisión**: Card/Tile expone únicamente estado bloqueado/descubierto y un callback de activación; cualquier estado visual de "seleccionado/actualmente activo" persistente es responsabilidad de la vista consumidora, no de la API del componente.

**Motivo**: Decisión explícita de `/speckit-clarify` (2026-08-16); mantiene la API mínima y evita acoplar Card/Tile a un modelo de estado de aplicación específico del juego.

**Alternativas descartadas**: Prop `selected` propia con estado ARIA dedicado (rechazada por ampliar la API sin necesidad confirmada).

### Slider sobre `<input type="range">` nativo

**Decisión**: `Slider` se implementa sobre el elemento nativo `<input type="range">`, reutiliza el catálogo cerrado `ComponentSize` (`small | medium | large`) y el patrón `showValue` ya existente en `Progress`; `value` es opcional con `min` como valor por defecto.

**Motivo**: Decisiones explícitas de `/speckit-clarify` (2026-08-17); el elemento nativo hereda teclado y accesibilidad del sistema (mismo criterio que Select, R-020), y reutilizar convenciones ya existentes evita fragmentar el design system con una escala o mecanismo de visualización de valor propios.

**Alternativas descartadas**: Control deslizante personalizado con `role="slider"` (rechazado por el coste de reimplementar teclado/accesibilidad); escala de tamaños propia (rechazada por divergencia innecesaria); `value` obligatoria sin valor implícito (rechazada por introducir estados `undefined`/`NaN` evitables).

## Estrategia de pruebas

* **Unit**: Nuevos tests por componente (`Input`, `Panel`, `Badge`, `Progress`, `Dialog`, y los 9 de la ampliación: `CardTile`, `Select`, `RadioGroup`, `CheckboxGroup`, `Tabs`, `Tooltip`, `Toast`, `Spinner`, `Accordion`, más `Slider` de la ampliación 2026-08-19) centrados en comportamiento observable y accesibilidad básica.
* **Integration**: N/A en esta fase (componentes aislados), salvo composición de `Dialog`/`Panel` con `HTMLElement`/`HTMLElement[]` en pruebas de componente.
* **Contract**: Verificación de API pública y reglas de iconografía/tokens contra contratos de `specs/003-shared-components-base/contracts/`.
* **Documentation**: Historia de Storybook nombrada e individual por cada estado/variante/rama visual distinguible (per FR-003/SC-002 y SC-011 para la ampliación), verificable navegando el panel de historias sin depender de manipular controles.
* **E2E**: N/A para esta fase; la validación transversal se cubre con Storybook + build/lint/test del repositorio.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/003-shared-components-base/
├── spec.md              # Especificación funcional (/speckit-specify)
├── plan.md              # Este fichero (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/           # Fase 1 (/speckit-plan)
└── tasks.md             # Fase 2 (/speckit-tasks - NO creado por /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
libs/
└── components/
    ├── button/
    ├── icon/
    ├── input/       # NUEVO
    ├── panel/       # NUEVO
    ├── badge/       # NUEVO
    ├── progress/    # NUEVO
    ├── dialog/      # NUEVO
    ├── card-tile/       # NUEVO (ampliación 2026-08-16, P1)
    ├── select/          # NUEVO (ampliación 2026-08-16, P1)
    ├── radio-group/     # NUEVO (ampliación 2026-08-16, P2)
    ├── checkbox-group/  # NUEVO (ampliación 2026-08-16, P2)
    ├── tabs/            # NUEVO (ampliación 2026-08-16, P2)
    ├── toast/           # NUEVO (ampliación 2026-08-16, P2)
    ├── tooltip/         # NUEVO (ampliación 2026-08-16, P3)
    ├── spinner/         # NUEVO (ampliación 2026-08-16, P3)
    ├── accordion/       # NUEVO (ampliación 2026-08-16, P3)
    └── slider/          # NUEVO (ampliación 2026-08-19, P3)

src/
└── styles/
    ├── _colors.css
    ├── _spacing.css
    ├── _shadows.css
    ├── _radii.css
    ├── _typography.css
    └── index.css

scripts/
└── check-components.mjs
```

**Decisión de estructura**: Se mantiene el patrón actual de librería interna. Los 5 componentes originales, los 9 de la ampliación 2026-08-16 y `Slider` de la ampliación 2026-08-19 siguen la misma convención de archivos obligatorios (`.ts`, `.type.ts`, `.constants.ts`, `.css`, `.test.ts`, `.stories.ts`, `index.ts`), implementados en oleadas de prioridad (P1: `card-tile`, `select`; P2: `radio-group`, `checkbox-group`, `tabs`, `toast`; P3: `tooltip`, `spinner`, `accordion`, `slider`).

## Modelo de datos

Ver [data-model.md](./data-model.md). Resumen: se definen cinco nuevas entidades de contrato de componente (`InputProps`, `PanelProps`, `BadgeProps`, `ProgressProps`, `DialogProps`) y un conjunto compartido de reglas de composición/accesibilidad/iconografía, más nueve entidades adicionales para la ampliación 2026-08-16 (`CardTileProps`, `SelectProps`, `RadioGroupProps`, `CheckboxGroupProps`, `TabsProps`, `TooltipProps`, `ToastProps`, `SpinnerProps`, `AccordionProps`), más `SliderProps` para la ampliación 2026-08-19.

## Contratos e interfaces

* **Contratos de API pública por componente** (siguiendo la misma convención que `001-component-library-architecture`/`002-button-variants`, un `.md` por componente): [input-component.md](./contracts/input-component.md), [panel-component.md](./contracts/panel-component.md), [badge-component.md](./contracts/badge-component.md), [progress-component.md](./contracts/progress-component.md), [dialog-component.md](./contracts/dialog-component.md), [card-tile-component.md](./contracts/card-tile-component.md), [select-component.md](./contracts/select-component.md), [radio-group-component.md](./contracts/radio-group-component.md), [checkbox-group-component.md](./contracts/checkbox-group-component.md), [tabs-component.md](./contracts/tabs-component.md), [tooltip-component.md](./contracts/tooltip-component.md), [toast-component.md](./contracts/toast-component.md), [spinner-component.md](./contracts/spinner-component.md), [accordion-component.md](./contracts/accordion-component.md), [slider-component.md](./contracts/slider-component.md).
* **Convención de reglas transversales (visuales, iconografía, estabilidad de API y quality gates)**: ver [docs/conventions/components/visual-rules.md](../../docs/conventions/components/visual-rules.md) (evidencia de cumplimiento propia de esta feature en [contracts/shared-components-visual-rules.md](./contracts/shared-components-visual-rules.md))

## Riesgos y compromisos

* **Riesgo**: Inconsistencias de naming/tokens entre 5 componentes implementados en paralelo. **Mitigación**: contrato centralizado + validación obligatoria con `check-components.mjs` y revisión Storybook de variantes.
* **Riesgo**: `Dialog` podría incumplir accesibilidad de teclado si se implementa tarde. **Mitigación**: tests de foco/cierre como criterio bloqueante desde el primer commit del componente.
* **Riesgo**: Select nativo limita el control de estilo visual (no puede tematizarse completamente con tokens propios en todos los navegadores). **Mitigación**: aceptado explícitamente en clarify; se documenta como límite conocido, no como bug.
* **Riesgo**: Apilar Toast/Snackbar sin límite podría saturar la pantalla en sesiones con muchos eventos simultáneos. **Mitigación**: diferir a una feature futura si se observa el problema en uso real; no se fija límite de cupo en esta feature.
* **Riesgo (resuelto 2026-08-16)**: SC-001 estaba desactualizado frente al catálogo ampliado de 14 componentes. **Mitigación**: reformulado para declarar explícitamente el total de 14 componentes nuevos (5 base + 9 de la ampliación).
* **Riesgo**: `Slider` nativo (`<input type="range">`) limita el control de estilo visual del track/thumb entre navegadores, igual que ocurre con `Select`. **Mitigación**: aceptado explícitamente en clarify (2026-08-17); se documenta como límite conocido, no como bug.
* **Compromiso**: Se prioriza una API mínima y estable sobre opciones avanzadas (p. ej. posicionamiento complejo, theming dinámico), difiriendo extensiones no críticas a features posteriores.

## Seguimiento de complejidad

N/A — no existen violaciones constitucionales que requieran justificación.
