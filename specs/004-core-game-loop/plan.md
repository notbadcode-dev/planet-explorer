---

title: "Bucle de juego base"
feature: "004-core-game-loop"
type: "implementation-plan"
version: "1.2"
created: "2026-08-17"
updated: "2026-08-18"
status: "Implemented"
spec: "./spec.md"
tags: ["game", "architecture"]
dependencies: ["001-component-library-architecture", "002-button-variants", "003-shared-components-base"]
related_specs: []
------------------------------------------------------------

# Plan de implementación: Bucle de juego base

**Rama**: `004-core-game-loop` | **Fecha**: 2026-08-17 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/004-core-game-loop/spec.md`

**Nota**: Esta plantilla se completa mediante el comando `/speckit-plan`; su definición describe el flujo de ejecución.

## Resumen

La funcionalidad implementa el primer bucle de juego jugable de extremo a extremo: un mapa del sistema solar con un único destino placeholder seleccionable, una transición a una escena de destino vacía con HUD mínimo (control "volver al mapa" + indicador de progreso placeholder), y el retorno al mapa preservando el destino seleccionable. El enfoque técnico introduce Phaser como motor de renderizado (`src/game/scenes/`) sobre el layout ya fijado por anticipado en `docs/conventions/architecture/game-engine-scenes.md`, con el estado de navegación implementado como una máquina de estados pura y testable en `src/game/core/navigation/` (sin dependencia de Phaser), y la capa de HUD como overlay HTML en `src/game/overlay/` que reutiliza `Button` y `Progress` de `libs/components/`.

## Contexto técnico

**Lenguaje/Versión**: TypeScript 6 (`strict` mode, ESM)

**Dependencias principales**: Phaser 4.2.1 (nueva dependencia de producción), Vite 8, Vitest 4 + happy-dom

**Almacenamiento**: N/A (FR-010: sin persistencia entre sesiones en esta feature)

**Testing**: Vitest para `src/game/core/navigation/` (sin `Phaser.Scene`, per principio VII); validación manual end-to-end del bucle mapa→destino→mapa (ver quickstart.md)

**Plataforma objetivo**: Navegadores evergreen desktop y móvil (misma matriz que la librería de componentes), interacción táctil primaria con soporte de ratón

**Tipo de proyecto**: Aplicación web estática de página única (SPA sin framework de UI), desplegable en GitHub Pages

**Objetivos de rendimiento**: Primera respuesta visual de una transición de escena en ≤ 200 ms desde el toque/clic del jugador (SC-002, clarificado en `/speckit-clarify` el 2026-08-17)

**Restricciones**: Sin persistencia, sin datos astronómicos reales, sin narrativa BOT-6, sin retos educativos reales (FR-010); lógica de navegación desacoplada de `Phaser.Scene` (FR-006, FR-009); `libs/components/` MUST NOT usarse dentro de una `Phaser.Scene` (solo en la capa de overlay)

**Escala/Alcance**: 2 escenas Phaser (`MapScene`, `DestinationScene`), 1 destino placeholder, 1 módulo de estado de navegación con 4 funciones públicas, 1 capa de overlay HTML con 2 elementos (control de retorno + indicador de progreso)

**Nota de cobertura (post-análisis)**: se añade un estado de carga mínimo (FR-011) y gestión básica del botón atrás (FR-012) tras `/speckit-analyze`; ver "Decisiones técnicas".

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

**Pre-Fase 0**

* **Experiencia centrada en el niño (I)**: Cumple. Zona táctil grande reutilizando `Button` (`--size-touch-target-min`), feedback inmediato (≤ 200 ms, SC-002), bucle repetible sin penalización (FR-008).
* **Simplicidad primero (VI)**: Cumple. Sin Clean Architecture, sin DI/event bus formal, sin capas adicionales — solo `core/` (lógica pura) y `scenes/`/`overlay/` (presentación), ya fijado por `game-engine-scenes.md`.
* **Separación entre lógica y renderizado (VII)**: Cumple. `src/game/core/navigation/` no importa `phaser`; las escenas y el overlay solo llaman a su API pública (ver `contracts/navigation-core-contract.md`).
* **Desarrollo incremental y vertical slices (VIII)**: Cumple. Esta feature ES el primer vertical slice jugable exigido explícitamente por este principio.
* **Contenido dirigido por datos (IX)**: Cumple. El destino placeholder vive como dato en `core/content/`, no embebido en una clase de escena; se difiere la jerarquía completa `System > Destination > Expedition > Mission` a `specs_pending/021-expedition-mission-structure.md` (no anticipación especulativa).
* **Arquitectura y tecnología**: Cumple. Se introduce Phaser (mandatado por la constitución) como única dependencia de producción nueva; ninguna otra dependencia (Angular/React/Vue/Three.js) se incorpora.
* **Accesibilidad**: Cumple. Interacción principal táctil con soporte de ratón (Phaser input maneja ambos); el control de overlay hereda accesibilidad de `Button`.

**Post-Fase 1**

* Revalidado tras diseño de `data-model.md` y `contracts/navigation-core-contract.md`: la máquina de estados begin/complete no introduce abstracciones nuevas más allá de las 4 funciones necesarias para cumplir FR-007 (guarda de activación redundante); no hay puertos, interfaces de inversión de dependencia ni event bus formal.
* Revalidado el uso de `src/game/overlay/`: la decisión se documentó como ampliación versionada de `game-engine-scenes.md` (v1.1 → v1.2), no como una divergencia local no gobernada.

**Resultado**: Gate superado. No se requiere seguimiento de complejidad.

## Investigación técnica

Ver [research.md](./research.md) para el detalle completo. Resumen de temas:

* **Versión de Phaser a fijar en `package.json`**: resuelto → `^4.2.1`.
* **Ampliación del `test.include` de Vitest para cubrir `src/game/core/`**: resuelto → añadir `'src/game/**/*.test.ts'`.
* **Estado real de `tsconfig.json` respecto a `src/`**: resuelto → ya compila `src/`; `overview.md` queda desactualizado en ese punto y se corrige como parte de esta feature.
* **Ubicación de la capa de overlay (HUD)**: resuelto → `src/game/overlay/`, documentado como R8 de `game-engine-scenes.md`.
* **Modelo de estado para la guarda de activaciones redundantes (FR-007)**: resuelto → patrón begin/complete en `core/navigation/`.
* **Reutilización de componentes existentes en el HUD**: resuelto → `Button` + `Progress` de `libs/components/`.
* **Representación visual del destino placeholder**: resuelto → Game Objects nativos de Phaser (círculo/texto), sin assets nuevos.

## Decisiones técnicas

### Máquina de estados begin/complete para la navegación

**Decisión**: `src/game/core/navigation/` expone `createInitialNavigationState`, `beginTransitionToDestination`, `beginTransitionToMap` y `completeTransition` (ver `contracts/navigation-core-contract.md`), en vez de un único `setActiveScene(scene)`.

**Motivo**: FR-007 exige distinguir "sin transición" de "transición en curso" para ignorar activaciones redundantes; un setter de un solo paso no puede representar ese estado intermedio de forma testable con Vitest sin acoplarse a temporizadores de animación reales.

**Alternativas descartadas**: `setActiveScene(scene)` con debounce por tiempo fijo dentro de la escena Phaser — descartada por mezclar lógica de navegación (principio VII) con temporización de presentación, y por ser no determinista en tests.

### `src/game/overlay/` como capa HTML de HUD

**Decisión**: El control "volver al mapa" y el indicador de progreso placeholder se implementan como overlay HTML (`src/game/overlay/`) reutilizando `Button`/`Progress` de `libs/components/`, nunca como Game Objects dentro de `DestinationScene`.

**Motivo**: `game-engine-scenes.md` (R7) prohíbe usar `libs/components/` dentro de una `Phaser.Scene`; el overlay HTML es el único lugar permitido para reutilizarlos, evitando reimplementar accesibilidad/estilos ya resueltos.

**Alternativas descartadas**: Dibujar el HUD con `this.add.text`/`this.add.rectangle` dentro de `DestinationScene` — descartada por duplicar UI ya accesible y por perder la reutilización explícitamente recomendada por la convención.

### Phaser 4.2.1 como versión fijada

**Decisión**: Fijar `phaser` en `^4.2.1` en `package.json`.

**Motivo**: Es la major estable actual publicada en npm; no existe código Phaser previo que ate a una versión anterior.

**Alternativas descartadas**: `phaser@^3.90` — descartada por no aportar ventaja alguna para un proyecto que introduce Phaser por primera vez.

### Indicador de carga simple durante la inicialización de Phaser

**Decisión**: `src/game/main.ts` muestra un indicador de carga simple (texto o spinner de `libs/components/spinner`, montado en el DOM sobre el `<canvas>`) desde el arranque de `Phaser.Game` hasta el evento `ready`/`boot` del juego, momento en el que se oculta.

**Motivo**: FR-011 exige evitar una pantalla en blanco o un error durante la inicialización; no requiere un preloader de assets complejo porque esta feature no carga imágenes/spritesheets (research.md, sección 7).

**Alternativas descartadas**: Una `Phaser.Scene` de tipo "Boot/Preload" — descartada por añadir una escena adicional para un estado que dura milisegundos sin assets reales que precargar; el indicador HTML es más simple (principio VI).

### Gestión mínima del botón "atrás" del navegador

**Decisión**: No se añade enrutamiento de historial (`pushState`/rutas por escena) en esta feature. En su lugar, `src/game/main.ts` registra un listener de `window.addEventListener('popstate', ...)` que, si se dispara, vuelve a renderizar la escena activa actual según `NavigationState` sin recargar la página, evitando una pantalla en blanco.

**Motivo**: FR-012 solo exige no dejar al jugador en un callejón sin salida, no una integración completa con el historial del navegador (que sería anticipación especulativa — principio VI); esta feature no crea entradas de historial nuevas, por lo que "atrás" no debería alterar realmente el estado, pero el listener defensivo cubre el caso de que el navegador dispare el evento igualmente (p. ej. tras cambiar de hash o recargar).

**Alcance real de la protección**: dado que esta feature no crea entradas de historial nuevas, el escenario más probable al pulsar "atrás" es que el navegador no haga nada (si no hay entrada previa) o navegue fuera de la SPA por completo (si la hay); ninguno de los dos casos dispara `popstate`. Salir de la SPA por completo mediante "atrás" es comportamiento estándar del navegador, fuera del control de esta feature, y se acepta como tal. El listener de `popstate` es cobertura defensiva exclusivamente para transiciones same-document (cambios de hash/estado), no la solución principal de FR-012.

**Alternativas descartadas**: Implementar rutas por escena con `history.pushState` — descartada por ser una funcionalidad de enrutamiento completa no requerida por ningún FR de esta feature.

### Evaluación constitucional del contenedor HTML del overlay

**Decisión**: El elemento contenedor de `src/game/overlay/hud.ts` (el `<div>` que posiciona `Button` y `Progress` como hermano del `<canvas>`) permanece como HTML específico de esta feature, sin promoverse a `libs/components/`.

**Motivo**: Por constitución (sección "Componentes compartidos"), antes de escribir HTML nuevo fuera de `libs/components/` MUST valorarse si debería ser un componente reutilizable. Este contenedor es puramente un wrapper de posicionamiento ligado al layout concreto de esta feature (hermano del canvas de Phaser), no una pieza de UI genérica reutilizable en otro contexto; califica como "componente específico de una feature" y por tanto no dispara el flujo de parada de "componente reutilizable inexistente".

**Alternativas descartadas**: Crear un componente `libs/components/game-hud/` — descartado por no existir todavía un segundo caso de uso real (principio VI, YAGNI); se reconsiderará si una futura feature de retos necesita el mismo layout.

## Estrategia de pruebas

* **Unit**: `src/game/core/navigation/navigation-state.test.ts` cubriendo las garantías G1–G7 de `contracts/navigation-core-contract.md` (estado inicial, inicio/cierre de transición en ambos sentidos, guarda de activaciones redundantes, repetibilidad indefinida sin residuo de estado) — 100% de las transiciones de estado, per SC-003.
* **Integration**: N/A. No existen integraciones con sistemas externos en esta feature.
* **Contract**: Verificación manual de que `MapScene`/`DestinationScene`/`src/game/overlay/` consumen exclusivamente la API pública descrita en `contracts/navigation-core-contract.md` (revisión de código, sin lectura/escritura directa de campos de `NavigationState`).
* **E2E**: N/A para esta feature (se difiere a `specs_pending/033-automated-e2e-testing.md`); la validación end-to-end del bucle se cubre manualmente vía `quickstart.md`.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/004-core-game-loop/
├── spec.md              # Especificación funcional (/speckit-specify)
├── plan.md              # Este fichero (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/           # Fase 1 (/speckit-plan)
│   └── navigation-core-contract.md
└── tasks.md             # Fase 2 (/speckit-tasks - NO creado por /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
src/
├── game/
│   ├── core/
│   │   ├── navigation/
│   │   │   ├── navigation-state.ts            # NUEVO: funciones puras (contracts/navigation-core-contract.md)
│   │   │   ├── navigation-state.type.ts        # NUEVO: NavigationState, SceneId
│   │   │   ├── navigation-state.constants.ts   # NUEVO: estado inicial, ids de escena
│   │   │   └── navigation-state.test.ts        # NUEVO: Vitest, sin Phaser
│   │   └── content/
│   │       └── destinations.ts                 # NUEVO: destino placeholder (id, name)
│   ├── scenes/
│   │   ├── MapScene.ts                         # NUEVO: renderiza destino, llama a core/navigation
│   │   └── DestinationScene.ts                 # NUEVO: escena vacía + notifica overlay
│   ├── overlay/
│   │   └── hud.ts                               # NUEVO: control "volver al mapa" + Progress placeholder
│   └── main.ts                                  # NUEVO: bootstrap de Phaser.Game, registro de escenas
└── styles/                                       # (existente) tokens de diseño CSS, sin cambios
```

**Decisión de estructura**: Se sigue exactamente el layout ya fijado por anticipado en `docs/conventions/architecture/game-engine-scenes.md` (v1.2, ampliada en esta feature con `overlay/`), sin introducir carpetas adicionales. `src/main.ts` (bootstrap actual de la pantalla "en construcción") se sustituye por `src/game/main.ts` como punto de entrada del juego real.

## Modelo de datos

Ver [data-model.md](./data-model.md). Resumen: se define `NavigationState` (estado de navegación con `activeScene`/`pendingScene`/`selectedDestinationId`/`isTransitioning`, sin persistencia) y `Destination` placeholder (`id`, `name`, un único registro en esta feature, preparado como colección abierta para features futuras).

## Contratos e interfaces

* **`core/navigation` (API pública de estado de navegación)**: [contracts/navigation-core-contract.md](./contracts/navigation-core-contract.md) — contrato consumido por `MapScene`, `DestinationScene` y `src/game/overlay/`.

## Riesgos y compromisos

* **Riesgo**: Añadir Phaser como primera dependencia de renderizado real puede revelar ajustes no anticipados en `game-engine-scenes.md` (p. ej. el nombre de carpeta `overlay/` fijado aquí). **Mitigación**: la convención se actualiza como parte de esta misma feature en lugar de divergir silenciosamente (ver research.md, sección 4).
* **Riesgo**: `tsconfig.json`/`overview.md` estaban desalineados respecto al estado real de compilación de `src/`. **Mitigación**: corregir `overview.md` como parte de la implementación (research.md, sección 3); no requiere cambio de `tsconfig.json`.
* **Compromiso**: El destino placeholder se dibuja con Game Objects nativos (círculo/texto) en vez de arte final, aceptado explícitamente por spec.md ("Suposiciones") para no bloquear el vertical slice con una decisión de pipeline de assets todavía no necesaria.

## Seguimiento de complejidad

> **Completar SOLO si Constitution Check detecta violaciones que deban justificarse.**

N/A — no existen violaciones constitucionales que requieran justificación.
