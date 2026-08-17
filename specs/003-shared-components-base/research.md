---
title: "Base ampliada de componentes compartidos reutilizables — Investigación técnica"
feature: "003-shared-components-base"
type: "research"
version: "1.3"
created: "2026-08-16"
updated: "2026-08-16T12:00:00Z"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, accessibility, architecture]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Investigación técnica: Base ampliada de componentes compartidos reutilizables

**Entrada**: [spec.md](./spec.md), [plan.md](./plan.md), constitución del proyecto y convenciones existentes en `libs/components/`.

## Objetivo de la investigación

Resolver todas las incertidumbres del contexto técnico para implementar cinco componentes compartidos (`Input`, `Panel`, `Badge`, `Progress`, `Dialog`) con API estable, accesibilidad verificable, reglas de iconografía centralizadas y coherencia visual basada en tokens globales, junto con los 9 componentes adicionales de la ampliación 2026-08-16 (`Card/Tile`, `Select`, `RadioGroup`, `CheckboxGroup`, `Tabs`, `Tooltip`, `Toast/Snackbar`, `Spinner/Loader`, `Accordion`) y el componente `Slider` de la ampliación 2026-08-19 (control deslizante de valor numérico continuo).

## Resumen de decisiones

| ID | Tema | Decisión | Estado |
|----|------|----------|--------|
| R-010 | Accesibilidad de Input | Exigir nombre accesible por `label` o `ariaLabel`, y sincronizar `error/hint` con `aria-describedby` | Resolved |
| R-011 | Modal accesible en Dialog | Foco inicial interno, trap de Tab, cierre con Escape y retorno al invocador | Resolved |
| R-012 | Normalización de Progress | Clamp determinista de `value/max` para salida visual y semántica consistente | Resolved |
| R-013 | Variantes no dependientes solo de color | `Badge` y `Panel` añaden señal visual secundaria (borde, contraste, peso) además del color | Resolved |
| R-014 | Gestión de tokens globales | Añadir token global solo si es reusable y no existe equivalente semántico | Resolved |
| R-015 | Composición de contenido | `Panel` y `Dialog` aceptan `HTMLElement | HTMLElement[]` con orden preservado | Resolved |
| R-016 | Iconografía compartida | Uso exclusivo del componente `Icon` para todo icono nuevo en componentes compartidos | Resolved |
| R-017 | Demostración de estados en Storybook | Una historia nombrada dedicada por cada estado/variante/rama visual distinguible, siguiendo la convención de `Button`, en vez de un único playground con controles | Resolved |
| R-018 | Tamaños de Input y Dialog | Adoptar el mismo catálogo cerrado `ComponentSize` (`small | medium | large`, por defecto `medium`) ya definido por `Button`, en lugar de una escala propia | Resolved |
| R-019 | Cobertura interactiva de Dialog en Storybook | Al menos 2 historias que abren `Dialog` desde un control real distinto (botón e input) y demuestran el retorno de foco al invocador, además de las historias por estado | Resolved |
| R-020 | Base de implementación de Select | `<select>` nativo del navegador en lugar de listbox personalizado con ARIA | Resolved |
| R-021 | Modelo de RadioGroup/Checkbox | Dos componentes independientes (`RadioGroup`, `CheckboxGroup`) en carpetas separadas, no un único componente con `mode` | Resolved |
| R-022 | Patrón de navegación de Tabs | Patrón WAI-ARIA APG estándar de tabs/tabpanel con navegación por flechas y activación automática | Resolved |
| R-023 | Ciclo de vida de Toast/Snackbar | Apilado simultáneo de todas las notificaciones activas, con 4000 ms de duración por defecto antes de autodescartarse | Resolved |
| R-024 | Activación de Tooltip en táctil | Tap-to-toggle (alternar mostrar/ocultar) en dispositivos sin hover, además de hover/foco en desktop | Resolved |
| R-025 | Estado "seleccionado" en Card/Tile | Sin prop `selected` propia; la persistencia de selección queda a cargo del consumidor | Resolved |
| R-026 | Modelo de expansión de Accordion | Múltiples secciones pueden estar expandidas de forma independiente por defecto (no acordeón exclusivo) | Resolved |
| R-027 | Implementación de Slider | Elemento nativo `<input type="range">`, reutilizando `ComponentSize` y el patrón `showValue` de `Progress`; `value` opcional con `min` como valor por defecto | Resolved |

## R-010 — Accesibilidad de Input

**Decision**: `Input` debe garantizar nombre accesible mediante `label` visible o `ariaLabel`; cuando existan `hint` y/o `error`, debe construir una cadena estable para `aria-describedby`; si hay `error`, activa `aria-invalid="true"`.

**Rationale**: Es el contrato mínimo para que lectores de pantalla reciban contexto completo de campo y estado de validación sin inferencias implícitas.

**Alternatives considered**:
- Permitir `Input` sin etiqueta ni `ariaLabel` (rechazado por incumplimiento de accesibilidad).
- Mostrar `error/hint` visualmente sin enlace ARIA (rechazado por pérdida de contexto para tecnologías de asistencia).

## R-011 — Modal accesible en Dialog

**Decision**: `Dialog` implementa ciclo completo de foco de teclado: foco inicial dentro del diálogo al abrir, navegación Tab contenida, cierre por Escape y retorno al elemento invocador al cerrar.

**Rationale**: Esta decisión fue aclarada explícitamente en la sesión de `/speckit-clarify` y define un criterio de aceptación de alto impacto.

**Alternatives considered**:
- Solo cerrar con Escape sin gestión de foco (rechazado por accesibilidad incompleta).
- Gestión parcial de foco (rechazado por inconsistencia de UX y pruebas ambiguas).

## R-012 — Normalización de Progress

**Decision**: `Progress` normaliza entrada de manera determinista: `max <= 0` se trata como mínimo válido seguro; `value < 0` se ajusta a 0; `value > max` se ajusta a `max`.

**Rationale**: Evita estados rotos y garantiza correspondencia entre valor mostrado, atributos semánticos y pruebas unitarias.

**Alternatives considered**:
- Lanzar excepciones en runtime (rechazado por degradar resiliencia para consumidores).
- Dejar valores fuera de rango sin normalizar (rechazado por comportamiento no predecible).

## R-013 — Variantes distinguibles más allá del color

**Decision**: Las variantes de `Badge` y `Panel` deben incluir señal secundaria no cromática (por ejemplo, borde, estilo de contorno o peso de texto) para distinguir estados.

**Rationale**: Cumple accesibilidad visual y evita dependencia exclusiva del color para comunicar significado.

**Alternatives considered**:
- Diferenciar solo por color (rechazado por incumplir requisito funcional y accesibilidad).

## R-014 — Evolución de tokens globales

**Decision**: Antes de añadir un token nuevo, verificar inexistencia de token semántico equivalente; si se añade, ubicarlo en el archivo global correspondiente (`_colors.css`, `_spacing.css`, `_shadows.css`, `_radii.css`, `_typography.css`) y reutilizarlo en más de un componente cuando aplique.

**Rationale**: Controla crecimiento del sistema visual y evita duplicación de variables con distinto nombre para mismo uso.

**Alternatives considered**:
- Crear tokens locales por componente (rechazado por fragmentar design system).
- Hardcode temporal en CSS del componente (rechazado por prohibición explícita en la spec).

## R-015 — Composición por HTMLElement

**Decision**: `Panel` y `Dialog` aceptan `HTMLElement | HTMLElement[]`; cuando reciban array, conservan orden de inserción y no mutan nodos externos.

**Rationale**: Mantiene API simple y predecible para composición de contenido y acciones sin acoplar a frameworks.

**Alternatives considered**:
- Aceptar solo `HTMLElement` único (rechazado por limitar composibilidad).
- Aceptar strings HTML crudas (rechazado por riesgo de seguridad y falta de tipado estructural).

## R-016 — Iconografía centralizada

**Decision**: Los componentes nuevos consumen iconos exclusivamente por `libs/components/icon`; si falta un icono, se amplía primero el catálogo central y luego se usa desde el componente consumidor.

**Rationale**: Centraliza semántica accesible, evita imports directos de fuentes externas y reduce divergencia visual.

**Alternatives considered**:
- Importar iconos directamente en cada componente (rechazado por violar reglas obligatorias de la feature).

## R-017 — Demostración de estados en Storybook

**Decision**: Cada componente compartido MUST exponer una historia de Storybook nombrada e individual por cada estado/variante/rama visual distinguible de su API pública (por ejemplo variantes de `Badge`/`Panel`, estados de error/deshabilitado/ayuda de `Input`, valores límite de `Progress`, flujos de `Dialog`), siguiendo la convención ya establecida por `Button` (`Enabled`, `Disabled`, `SoloEtiquetaAccesible`, `Secondary`, `Danger`, …). La historia `Playground` con controles interactivos puede conservarse como complemento, pero no sustituye a las historias nombradas.

**Rationale**: Esta decisión fue aclarada explícitamente en una sesión de `/speckit-clarify` posterior (2026-08-16) tras detectar, tras convergencia, que un único playground con controles dificulta la revisión/demostración discreta de cada rama y no coincide con la convención ya usada por `Button` en el mismo catálogo.

**Alternatives considered**:
- Mantener solo un playground interactivo con controles (rechazado por inconsistencia con `Button` y por dificultar la revisión discreta de cada estado en el panel de Storybook).
- Documentar estados solo en `quickstart.md` sin historias dedicadas (rechazado por no ser un artefacto verificable/navegable directamente en Storybook).

**Nota de compatibilidad**: la historia `Playground` referenciada por su id (`componentes-<input|progress|dialog>--playground`) en la evidencia de latencia de `quickstart.md` (T050) MUST conservarse al añadir las nuevas historias nombradas, para no invalidar esa evidencia ya registrada.

## R-018 — Tamaños de Input y Dialog

**Decision**: `Input` y `Dialog` incorporan una propiedad `size?: 'small' | 'medium' | 'large'` (por defecto `medium`) que reutiliza exactamente el mismo catálogo cerrado que `ButtonSize`, en lugar de definir una escala de tamaños propia o divergente.

**Rationale**: Surgió de una revisión manual de Storybook (sesión 2026-08-17) donde se detectó que `Input` y `Dialog` eran los únicos componentes nuevos sin variante de tamaño, rompiendo la coherencia visual con `Button`. Reutilizar el catálogo existente evita fragmentar el sistema de tamaños y minimiza superficie de API nueva.

**Alternatives considered**:
- Definir una escala de tamaños independiente por componente (rechazado por divergencia innecesaria del design system).
- No añadir tamaños y dejarlo fuera de alcance (rechazado tras la revisión manual, que identificó la inconsistencia como una brecha real de coherencia visual, FR-007/FR-015).

## R-019 — Cobertura interactiva de Dialog en Storybook

**Decision**: Además de las historias nombradas por estado, `Dialog` incluye al menos 2 historias completamente interactivas con `render` personalizado que montan un control invocador real (un botón en una historia, un input en otra) y abren/cierran el diálogo en el propio canvas de Storybook, demostrando visualmente que el foco regresa exactamente al control que lo invocó.

**Rationale**: Las historias previas montaban el `Dialog` ya abierto sin invocador, por lo que el ciclo abrir/cerrar y el retorno de foco (FR-018) no eran verificables manualmente en Storybook, solo en pruebas unitarias. Esto generó la percepción de que "el diálogo no responde al cierre".

**Alternatives considered**:
- Confiar únicamente en pruebas unitarias de foco (rechazado: no permite verificación manual/exploratoria en Storybook, que es el artefacto de demostración exigido por FR-003).
- Un solo invocador genérico (rechazado: no cubre la variedad de controles reales mencionada explícitamente en la revisión manual, botón e input).

## R-020 — Base de implementación de Select

**Decision**: `Select/Dropdown` se implementa sobre el elemento `<select>` nativo del navegador.

**Rationale**: Decisión explícita de `/speckit-clarify` (2026-08-16): hereda accesibilidad y operabilidad de teclado del sistema operativo sin reimplementar semántica ARIA de listbox.

**Alternatives considered**:
- Listbox personalizado con `role="listbox"`/`option` (rechazado por el coste de reimplementar teclado/accesibilidad y el riesgo de regresiones frente al control nativo).

## R-021 — Modelo de RadioGroup/Checkbox

**Decision**: `RadioGroup` (selección única) y `CheckboxGroup` (selección múltiple) se implementan como dos componentes independientes, cada uno en su propia carpeta bajo `libs/components/`.

**Rationale**: Sus semánticas de agrupación accesible difieren (`role="radiogroup"` con exclusividad mutua vs. checkboxes independientes); separar evita una API con ramas condicionales según un `mode`.

**Alternatives considered**:
- Un único componente `ChoiceGroup` con prop `mode: 'single' | 'multiple'` (rechazado por mezclar dos contratos de accesibilidad distintos bajo una sola API).

## R-022 — Patrón de navegación de Tabs

**Decision**: `Tabs` implementa el patrón WAI-ARIA Authoring Practices Guide (APG) estándar: `role="tablist"`/`tab`, paneles `role="tabpanel"`, asociación por `aria-controls`/`aria-labelledby`, navegación entre pestañas con flechas izquierda/derecha y activación automática al navegar.

**Rationale**: Es el patrón de referencia documentado y probado por lectores de pantalla; evita inventar una variante propia con menor soporte de accesibilidad.

**Alternatives considered**:
- Navegación solo por Tab/Shift+Tab sin flechas (rechazado por no seguir el patrón esperado por usuarios de tecnologías de asistencia).

## R-023 — Ciclo de vida de Toast/Snackbar

**Decision**: Toast/Snackbar usa una región en vivo (`aria-live="polite"`) que apila todas las notificaciones activas simultáneamente, cada una con una duración por defecto de 4000 ms antes de autodescartarse, sin bloquear foco ni exigir cierre manual.

**Rationale**: Decisión explícita de `/speckit-clarify` (2026-08-16); prioriza no perder feedback para un usuario infantil frente a la complejidad de gestionar una cola secuencial.

**Alternatives considered**:
- Cola secuencial de un mensaje a la vez (rechazada: retrasa feedback).
- Reemplazo inmediato del mensaje anterior (rechazado: puede ocultar feedback relevante).

## R-024 — Activación de Tooltip en táctil

**Decision**: Tooltip revela su contenido con hover de puntero o foco de teclado en desktop, y con tap-to-toggle en dispositivos táctiles donde no existe hover.

**Rationale**: Decisión explícita de `/speckit-clarify` (2026-08-16); sin esta estrategia, Tooltip quedaría inaccesible en el dispositivo principal del público objetivo (tablet/móvil), contradiciendo el principio constitucional de interacción táctil.

**Alternatives considered**:
- Long-press (rechazado por ser menos descubrible para un niño).
- No soportar táctil (rechazado por incompatibilidad con FR-017).

## R-025 — Estado "seleccionado" en Card/Tile

**Decision**: Card/Tile expone únicamente estado bloqueado/descubierto y un callback de activación; cualquier estado visual de "seleccionado/actualmente activo" persistente es responsabilidad de la vista consumidora.

**Rationale**: Decisión explícita de `/speckit-clarify` (2026-08-16); mantiene la API mínima y evita acoplar Card/Tile a un modelo de estado de aplicación específico del juego.

**Alternatives considered**:
- Prop `selected` propia con estado ARIA dedicado (rechazada por ampliar la API sin necesidad confirmada).

## R-026 — Modelo de expansión de Accordion

**Decision**: Accordion permite que múltiples secciones estén expandidas de forma independiente por defecto; no es un acordeón de expansión exclusiva (una sola sección abierta a la vez).

**Rationale**: Ya reflejado en el escenario de aceptación 2 de US11 en spec.md ("las demás permanecen independientes salvo que se documente lo contrario"); se documenta aquí como decisión de diseño explícita para guiar la implementación.

**Alternatives considered**:
- Expansión exclusiva (una sección abierta a la vez), rechazada por no ser el comportamiento por defecto ya descrito en spec.md; podría ofrecerse como opción futura si se necesita.

## R-027 — Implementación de Slider

**Decision**: `Slider` se implementa sobre el elemento nativo `<input type="range">` del navegador (no un control ARIA personalizado), reutiliza el catálogo cerrado `ComponentSize` (`small | medium | large`, por defecto `medium`) ya definido por `Button`/`Input`/`Dialog`, y adopta el mismo patrón `showValue` (por defecto `true`) ya usado por `Progress` para mostrar el valor numérico actual como texto. Su prop `value` es opcional; cuando se omite, el componente usa `min` como valor por defecto.

**Rationale**: Decisiones explícitas de `/speckit-clarify` (2026-08-17): el elemento nativo hereda teclado y accesibilidad del sistema operativo (mismo criterio que Select, R-020), evitando reimplementar semántica ARIA de slider; reutilizar `ComponentSize` y el patrón `showValue` evita fragmentar el design system con una escala o mecanismo de visualización de valor propios; un valor por defecto (`min`) evita estados `undefined`/`NaN` accidentales.

**Alternatives considered**:
- Control deslizante personalizado con `role="slider"` (rechazado por el coste de reimplementar teclado/accesibilidad y el riesgo de regresiones frente al control nativo).
- Escala de tamaños propia para Slider (rechazada por divergencia innecesaria del design system, mismo criterio que R-018).
- `value` como prop obligatoria sin valor implícito (rechazada por introducir estados `undefined`/`NaN` evitables en un control usado por un público infantil).

## Conclusión

No quedan `NEEDS CLARIFICATION` abiertos para pasar a diseño detallado. Las decisiones R-010..R-026 cierran los puntos que impactan arquitectura, tests, contratos y criterios de aceptación, incluyendo los 9 componentes de la ampliación 2026-08-16; R-027 cierra los puntos correspondientes al componente `Slider` de la ampliación 2026-08-19.