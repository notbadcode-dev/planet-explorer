---

title: "Cascarón narrativo de BOT-6"
feature: "005-bot6-narrative-shell"
type: "implementation-plan"
version: "1.0"
created: "2026-08-18"
updated: "2026-08-18"
status: "Draft"
spec: "./spec.md"
tags: ["game", "narrative", "education"]
dependencies: ["004-core-game-loop"]
related_specs: []
------------------------------------------------------------

# Plan de implementación: Cascarón narrativo de BOT-6

**Rama**: `005-bot6-narrative-shell` | **Fecha**: 2026-08-18 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/005-bot6-narrative-shell/spec.md`

**Nota**: Esta plantilla se completa mediante el comando `/speckit-plan`; su definición describe el flujo de ejecución.

## Resumen

La funcionalidad añade a BOT-6 como robot acompañante narrativo sobre el bucle de juego ya existente (004-core-game-loop): un mensaje de bienvenida al entrar en `MapScene` y un mensaje de transición al entrar en `DestinationScene`, ambos con retrato de BOT-6, mostrados cada vez que se entra en la escena correspondiente (sin persistencia). El enfoque técnico reutiliza dos componentes ya existentes en `libs/components/` sin crear ningún componente compartido nuevo: `Dialog` (contenedor de diálogo modal accesible) e `Icon` (al que se añade el icono `robot` de Phosphor Icons como retrato placeholder de BOT-6). Se añade un pequeño módulo de overlay específico de la feature (`src/game/overlay/bot6-dialogue.ts`) que compone ambos componentes, y un módulo de contenido dirigido por datos (`src/game/core/content/bot6-messages.ts`) con los dos mensajes, siguiendo exactamente el mismo patrón ya establecido por `hud.ts` y `destinations.ts` en 004-core-game-loop.

## Contexto técnico

**Lenguaje/Versión**: TypeScript 6 (`strict` mode, ESM) — sin cambios respecto a 004-core-game-loop

**Dependencias principales**: Ninguna dependencia nueva. Reutiliza Phaser 4.2.1 (ya instalado), `@phosphor-icons/core` (ya instalado, se añade un icono más al catálogo local de `Icon`), `libs/components/dialog` y `libs/components/icon` (ya existentes)

**Almacenamiento**: N/A (sin persistencia entre sesiones ni entre visitas a una escena, ver Suposiciones de spec.md)

**Testing**: Vitest para el contenido de `core/content/bot6-messages` (longitud, textos no vacíos) y para el nuevo caso `'robot'` de `Icon.test.ts`; validación manual end-to-end del flujo narrativo (ver quickstart.md), igual que el resto de la capa de escenas Phaser en 004

**Plataforma objetivo**: Misma matriz que 004-core-game-loop — navegadores evergreen desktop y móvil, interacción táctil primaria con soporte de ratón

**Tipo de proyecto**: Aplicación web estática de página única (SPA sin framework de UI), desplegable en GitHub Pages — sin cambios

**Objetivos de rendimiento**: El diálogo de BOT-6 MUST mostrarse en el mismo ciclo de creación de la escena, sin ninguna petición de red ni carga asíncrona adicional (mensajes y retrato están embebidos en el bundle); hereda el mismo umbral de ≤ 200 ms de primera respuesta visual ya validado en 004-core-game-loop (SC-002) para la transición de escena que lo precede

**Restricciones**: Sin persistencia (FR-001/FR-002 se repiten en cada visita); sin datos astronómicos reales, audio/voz, ramificación de diálogo, personalización cosmética de BOT-6 ni interpolación del nombre del jugador (FR-007); un único mensaje por evento, sin encadenar secuencias (FR-003a); `Dialog`/`Icon` de `libs/components/` MUST NOT usarse dentro de una `Phaser.Scene` (regla R7 de `game-engine-scenes.md`) — se montan como overlay HTML hermano del `<canvas>`, igual que `hud.ts`

**Escala/Alcance**: 2 puntos de disparo (bienvenida en el mapa, transición al destino placeholder), 1 mensaje corto por punto, 1 icono nuevo (`robot`) añadido al catálogo de 11 iconos ya existente en `Icon`

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

**Pre-Fase 0**

* **Experiencia centrada en el niño (I)**: Cumple. Mensaje corto (≤ 2 líneas, FR-005/SC-004), cierre mediante una única acción táctil/clic (FR-004), sin temporizadores ni penalización por no leerlo a tiempo.
* **Juego antes que ejercicio (II)**: Cumple. Introduce a BOT-6 como parte de la ficción antes de cualquier mecánica educativa (que todavía no existe en este slice).
* **Astronomía real y separación entre realidad y ficción (III)**: Cumple. FR-006 garantiza la separación por construcción (Clarification Q3): el retrato/nombre "BOT-6" es la única marca visual presente en esta spec; no coexiste ningún contenido de datos reales que pueda confundirse.
* **Simplicidad primero (VI)**: Cumple. No se crea ningún componente compartido nuevo (se reutilizan `Dialog` e `Icon` ya existentes); un único mensaje por evento, sin motor de secuencias (FR-003a); sin estado de sesión nuevo para recordar "ya visto" (Clarification Q1).
* **Separación entre lógica y renderizado (VII)**: Cumple. Los mensajes viven como datos puros en `core/content/bot6-messages.ts` (sin import de `phaser`); `src/game/overlay/bot6-dialogue.ts` es HTML fuera de cualquier `Phaser.Scene`; `MapScene`/`DestinationScene` solo llaman a su función pública, igual patrón que `createHud(...)` en 004.
* **Contenido dirigido por datos (IX)**: Cumple. Los mensajes son registros en `core/content/`, igual patrón que `destinations.ts`; añadir un futuro mensaje (p. ej. al introducir un nuevo destino) no requiere tocar `bot6-dialogue.ts`.
* **Componentes compartidos**: Cumple. Se comprobó `libs/components/` antes de escribir HTML nuevo (regla "HTML fuera de un componente compartido"): existe `Dialog` (diálogo modal accesible) y se reutiliza sin duplicarlo; se extiende `Icon` (extensión permitida explícitamente por la constitución) en vez de crearlo de nuevo. `bot6-dialogue.ts` es HTML específico de la narrativa del juego (compone `Dialog`+`Icon` con contenido fijo de BOT-6), sin necesidad transversal real de reutilización todavía, por lo que permanece en `src/game/overlay/` sin promoverse a `libs/components/` (regla "Componentes específicos de una feature"). No se activa el procedimiento de parada de "componente reutilizable inexistente" porque no se requiere ningún componente nuevo.
* **Iconografía**: Cumple. Antes de considerar un SVG personalizado para el retrato de BOT-6 se comprobó el catálogo de Phosphor Icons; existe `robot-duotone`, que se reutiliza en vez de crear un asset nuevo (ver research.md).

**Post-Fase 1**

* Revalidado tras diseñar `data-model.md` y `contracts/bot6-dialogue-contract.md`: la composición `bot6-dialogue.ts` no introduce ninguna abstracción más allá de una única función `createBot6Dialogue(props)`; no hay estado, puertos ni event bus formal.
* Revalidado el uso de `Icon`: añadir `'robot'` a `APP_ICON_NAMES`/`APP_ICON_SVGS` sigue exactamente el mismo patrón que los 11 iconos ya existentes, sin romper ningún uso previo (API de `Icon` sin cambios).

**Resultado**: Gate superado. No se requiere seguimiento de complejidad.

## Investigación técnica

Ver [research.md](./research.md) para el detalle completo. Resumen de temas:

* **¿Existe ya un componente de diálogo reutilizable?**: resuelto → sí, `libs/components/dialog` (`Dialog`); se reutiliza envuelto en `bot6-dialogue.ts`.
* **¿Cómo representar el retrato de BOT-6 sin asset final?**: resuelto → icono `robot-duotone` de Phosphor Icons vía `Icon`, añadido al catálogo local.
* **¿Dónde vive el contenido de los mensajes?**: resuelto → `core/content/bot6-messages.ts`, mismo patrón data-driven que `destinations.ts`.
* **¿Cómo se disparan los mensajes desde las escenas?**: resuelto → llamada directa desde `create()` de `MapScene`/`DestinationScene`, mismo patrón que `createHud(...)` en `DestinationScene`.
* **¿Cómo verificar de forma objetiva el límite de 2 líneas (FR-005/SC-004)?**: resuelto → límite de caracteres como proxy verificable en Vitest sobre el contenido, complementado con revisión visual manual en `quickstart.md`.
* **¿Qué tamaño de `Dialog` usar?**: resuelto → `small`.
* **¿Qué título usar en el `Dialog` (campo obligatorio)?**: resuelto → `"BOT-6"` fijo.

## Decisiones técnicas

### Reutilizar `Dialog` de `libs/components/` en vez de crear un componente de diálogo nuevo

**Decisión**: `src/game/overlay/bot6-dialogue.ts` envuelve `createDialog` de `libs/components/dialog`, pasando `title: 'BOT-6'`, `description: message.text`, `content` con el retrato (`Icon` de `robot`), `size: 'small'` y `closeLabel: 'Continuar'`.

**Motivo**: La constitución exige comprobar `libs/components/` antes de implementar cualquier componente visual y reutilizarlo si satisface la necesidad. `Dialog` ya resuelve modal accesible, foco atrapado, cierre por Escape/botón y overlay a pantalla completa — exactamente lo que FR-003/FR-004 requieren, sin necesidad de escribir ni testear un nuevo primitivo de diálogo.

**Alternativas descartadas**: Construir un elemento de diálogo específico del juego desde cero (`<div>` posicionado manualmente) — descartada por duplicar funcionalidad ya resuelta (foco, accesibilidad, cierre) y por violar la regla constitucional de reutilización obligatoria cuando existe un componente adecuado.

### Icono `robot` de Phosphor Icons como retrato placeholder de BOT-6

**Decisión**: Añadir `'robot'` a `APP_ICON_NAMES`/`APP_ICON_SVGS` en `libs/components/icon/Icon.constants.ts`, importando `@phosphor-icons/core/duotone/robot-duotone.svg?raw`, y usarlo como `content` del diálogo de BOT-6 (tamaño mayor que un icono de UI habitual, p. ej. 64px).

**Motivo**: La constitución exige comprobar el catálogo de Phosphor Icons antes de crear un SVG personalizado y reutilizarlo cuando exista una alternativa adecuada; `robot-duotone` ya transmite razonablemente "robot acompañante" sin necesitar arte final. Evita crear un pipeline de asset nuevo (`public/assets/`) solo para un placeholder temporal, cumpliendo además la Suposición de spec.md ("el retrato final puede no estar disponible todavía").

**Alternativas descartadas**: Crear un SVG personalizado de BOT-6 bajo `public/assets/characters/` siguiendo `docs/conventions/design-system/icon-assets.md` — descartada por ahora por ser prematura (no existe todavía un diseño final del personaje) y por saltarse la comprobación obligatoria de Phosphor Icons; se reconsiderará cuando exista arte final de BOT-6.

### Mensajes de BOT-6 como contenido dirigido por datos

**Decisión**: `src/game/core/content/bot6-messages.ts` exporta `MAP_WELCOME_MESSAGE` y `DESTINATION_TRANSITION_MESSAGE` (tipo `Bot6Message { id, text }`), siguiendo el mismo patrón que `destinations.ts` (interfaz + constantes en un fichero `.constants.ts` separado).

**Motivo**: Principio IX (contenido dirigido por datos) y R5 de `game-engine-scenes.md`: añadir un futuro mensaje (p. ej. al introducir un segundo destino en spec 013) MUST NOT requerir modificar `bot6-dialogue.ts` ni la lógica de las escenas, solo añadir un registro de datos.

**Alternativas descartadas**: Incrustar el texto literal directamente en `MapScene.ts`/`DestinationScene.ts` — descartada por violar tanto el principio IX como la regla de "sin literales mágicos" de `scripts/check-components.mjs` (aplicable también a `src/game/`).

### Límite de 2 líneas verificado mediante un proxy de caracteres

**Decisión**: `bot6-messages.constants.ts` documenta y Vitest verifica que cada `text` no supera `BOT6_MESSAGE_MAX_LENGTH` caracteres (80), como proxy razonable de "2 líneas visibles" en el tamaño `small` del `Dialog`; la confirmación visual final de que ocupa 2 líneas o menos se hace manualmente vía `quickstart.md`.

**Motivo**: SC-004 exige que el resultado sea verificable, pero el número real de líneas depende del layout/CSS (ancho del diálogo, tipografía), no solo del contenido; un límite de caracteres es lo único que puede comprobarse de forma determinista y automatizada en Vitest sin renderizar el DOM con estilos reales.

**Alternativas descartadas**: Medir líneas reales con `getClientRects()` en un test con `happy-dom` — descartada porque `happy-dom` no calcula layout de texto real (no hay motor de fuentes), por lo que el resultado no sería fiable.

## Estrategia de pruebas

* **Unit**: `src/game/core/content/bot6-messages.test.ts` (textos no vacíos, ≤ `BOT6_MESSAGE_MAX_LENGTH` caracteres, ids únicos); `libs/components/icon/Icon.test.ts` ampliado con un caso para `'robot'` (mismo patrón que los demás iconos del catálogo).
* **Integration**: N/A. No existen integraciones con sistemas externos en esta feature.
* **Contract**: Verificación manual de que `MapScene`/`DestinationScene` consumen `createBot6Dialogue(...)` exclusivamente a través de la API pública descrita en `contracts/bot6-dialogue-contract.md` (revisión de código, sin acceso directo a los internos de `Dialog`).
* **E2E**: N/A para esta feature (se difiere a `specs_pending/034-automated-e2e-testing.md`); la validación end-to-end del flujo narrativo se cubre manualmente vía `quickstart.md`.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/005-bot6-narrative-shell/
├── spec.md              # Especificación funcional (/speckit-specify)
├── plan.md              # Este fichero (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/           # Fase 1 (/speckit-plan)
│   └── bot6-dialogue-contract.md
└── tasks.md             # Fase 2 (/speckit-tasks - NO creado por /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
src/game/
├── core/
│   └── content/
│       ├── bot6-messages.ts              # NUEVO: interfaz Bot6Message + export desde constants
│       ├── bot6-messages.constants.ts    # NUEVO: MAP_WELCOME_MESSAGE, DESTINATION_TRANSITION_MESSAGE, límite de longitud
│       └── bot6-messages.test.ts         # NUEVO: Vitest, sin Phaser
├── overlay/
│   ├── bot6-dialogue.ts                  # NUEVO: createBot6Dialogue(props), envuelve Dialog + Icon
│   └── bot6-dialogue.constants.ts        # NUEVO: título "BOT-6", closeLabel "Continuar", tamaño de icono/diálogo
├── scenes/
│   ├── MapScene.ts                       # MODIFICADO: monta el diálogo de bienvenida en create()
│   └── DestinationScene.ts               # MODIFICADO: monta el diálogo de transición en create()

libs/components/icon/
├── Icon.constants.ts                     # MODIFICADO: añade 'robot' (robot-duotone.svg) al catálogo
└── Icon.test.ts                          # MODIFICADO: añade caso de test para 'robot'
```

**Decisión de estructura**: Se sigue exactamente el layout ya fijado por `docs/conventions/architecture/game-engine-scenes.md` (`core/content/` para datos, `overlay/` para HTML fuera de Phaser, `scenes/` para presentación), sin introducir carpetas nuevas. No se crea ningún `bot6-dialogue.css` propio: los estilos del diálogo y del icono ya existen en `Dialog.css`/`Icon.css`.

## Modelo de datos

Ver [data-model.md](./data-model.md). Resumen: se define `Bot6Message` (`id`, `text`), con dos registros estáticos (`MAP_WELCOME_MESSAGE`, `DESTINATION_TRANSITION_MESSAGE`), sin persistencia ni relaciones con `NavigationState` más allá de ser leído por el `create()` de cada escena.

## Contratos e interfaces

* **`overlay/bot6-dialogue` (API pública del diálogo narrativo de BOT-6)**: [contracts/bot6-dialogue-contract.md](./contracts/bot6-dialogue-contract.md) — contrato consumido por `MapScene` y `DestinationScene`.

## Riesgos y compromisos

* **Riesgo**: El icono `robot-duotone` de Phosphor Icons es un placeholder genérico, no un retrato final de BOT-6; podría no transmitir suficiente personalidad al niño. **Mitigación**: aceptado explícitamente por spec.md ("Suposiciones") como no bloqueante; se sustituirá por arte final en una feature futura sin cambiar la API de `bot6-dialogue.ts` (solo el `content` interno).
* **Compromiso**: El límite de 2 líneas (SC-004) se verifica en Vitest mediante un proxy de caracteres, no mediante medición real de layout. **Aceptado**: `happy-dom` no soporta layout de texto real; la confirmación visual definitiva se hace manualmente vía `quickstart.md`.

## Seguimiento de complejidad

> **Completar SOLO si Constitution Check detecta violaciones que deban justificarse.**

N/A — no existen violaciones constitucionales que requieran justificación.
