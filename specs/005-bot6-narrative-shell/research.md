---
title: "Investigación: Cascarón narrativo de BOT-6"
feature: "005-bot6-narrative-shell"
type: "research"
version: "1.0"
created: "2026-08-18"
updated: "2026-08-18"
status: "Draft"
---

# Investigación técnica: Cascarón narrativo de BOT-6

**Entrada**: [plan.md](./plan.md) · [spec.md](./spec.md)

## 1. ¿Existe ya un componente de diálogo reutilizable?

**Decisión**: Reutilizar `Dialog` (`libs/components/dialog`) envuelto en una función específica de esta feature (`bot6-dialogue.ts`), en vez de crear un componente de diálogo nuevo.

**Motivo**: `Dialog` ya resuelve exactamente lo que FR-003/FR-004 necesitan: contenedor modal accesible (`role="dialog"`, `aria-modal`), atrapa el foco, se cierra con Escape o con un botón, y acepta `content` arbitrario (usado aquí para el retrato). La constitución (sección "Componentes compartidos") exige comprobar `libs/components/` antes de escribir cualquier HTML de diálogo nuevo y reutilizarlo si satisface la necesidad; no hacerlo duplicaría accesibilidad y comportamiento ya resueltos y probados.

**Alternativas descartadas**: Construir un `<div>` de diálogo específico del juego desde cero — descartada por violar la regla de reutilización obligatoria y por tener que re-implementar foco/cierre/accesibilidad ya cubiertos por `Dialog.test.ts`.

## 2. ¿Cómo representar el retrato de BOT-6 sin asset final?

**Decisión**: Usar el icono `robot-duotone` de `@phosphor-icons/core`, añadido como `'robot'` al catálogo local de `Icon` (`libs/components/icon`), como `content` del diálogo.

**Motivo**: La constitución exige comprobar el catálogo de Phosphor Icons antes de crear un SVG personalizado y reutilizarlo si existe una alternativa adecuada (sección "Iconografía"). `robot-duotone` existe en el paquete ya instalado (`node_modules/@phosphor-icons/core/assets/duotone/robot-duotone.svg`) y transmite razonablemente "robot acompañante" para un placeholder temporal, coherente con la Suposición de `spec.md` ("el retrato final puede no estar disponible todavía").

**Alternativas descartadas**: Crear un SVG personalizado de BOT-6 en `public/assets/characters/` siguiendo `docs/conventions/design-system/icon-assets.md` — descartada por ahora: no existe todavía un diseño final del personaje, y crearlo sin comprobar antes Phosphor Icons violaría la regla de reutilización obligatoria. Se reconsiderará cuando exista arte final de BOT-6 (fuera de alcance de esta spec).

## 3. ¿Dónde vive el contenido de los mensajes de BOT-6?

**Decisión**: `src/game/core/content/bot6-messages.ts` exporta un tipo `Bot6Message` y dos registros estáticos (`MAP_WELCOME_MESSAGE`, `DESTINATION_TRANSITION_MESSAGE`), en un fichero `.constants.ts` separado, replicando exactamente el patrón ya usado por `destinations.ts`/`destinations.constants.ts`.

**Motivo**: Principio IX (contenido dirigido por datos) y regla R5 de `game-engine-scenes.md`: un futuro mensaje adicional (p. ej. al añadir un segundo destino real en la spec 013) no debe requerir tocar `bot6-dialogue.ts` ni la lógica de las escenas, solo añadir un registro de datos. Mantener el patrón idéntico a `destinations.ts` evita introducir una segunda convención de contenido distinta dentro de la misma carpeta `core/content/`.

**Alternativas descartadas**: Incrustar el texto directamente como literal dentro de `MapScene.ts`/`DestinationScene.ts` — descartada por violar el principio IX y la regla de "sin literales mágicos" de `scripts/check-components.mjs` (aplicable también a `src/game/`, ver memoria de convenciones del repositorio).

## 4. ¿Cómo se disparan los mensajes desde las escenas sin acoplar lógica a `Phaser.Scene`?

**Decisión**: `MapScene.create()` y `DestinationScene.create()` llaman directamente a `createBot6Dialogue({ message, onClose })` y añaden el elemento devuelto como hermano del `<canvas>` (`this.game.canvas.parentElement?.append(...)`), retirándolo en su manejador de `SHUTDOWN` — exactamente el mismo patrón que `createHud(...)` ya usa en `DestinationScene.ts` (004-core-game-loop).

**Motivo**: Regla R8 de `game-engine-scenes.md`: la capa de overlay se comunica con las escenas mediante llamadas explícitas a funciones puras/de composición, nunca mediante una referencia directa de una `Phaser.Scene` al DOM del overlay ni viceversa. Reutilizar el patrón ya validado en 004 evita introducir una segunda forma de montar overlays en el mismo motor de juego.

**Alternativas descartadas**: Un mecanismo de eventos genérico (`EventEmitter` de Phaser) para desacoplar la escena del overlay — descartada por ser complejidad no requerida por ningún FR de esta feature (principio VI); el patrón de llamada directa ya es suficiente y es el que 004 estableció como precedente.

## 5. ¿Cómo verificar de forma objetiva el límite de 2 líneas (FR-005/SC-004)?

**Decisión**: `bot6-messages.constants.ts` define `BOT6_MESSAGE_MAX_LENGTH = 80` y un test de Vitest verifica que ningún `text` lo supera, como proxy verificable del contenido; la confirmación visual de que el mensaje ocupa 2 líneas o menos en el `Dialog` de tamaño `small` se hace manualmente vía `quickstart.md`.

**Motivo**: SC-004 exige un resultado verificable, pero el número real de líneas depende del layout/CSS (ancho de `.dialog__container.dialog--small`, tipografía, tamaño de fuente), no solo de la longitud del texto. `happy-dom` (entorno de test de este proyecto) no implementa un motor de layout de texto real, por lo que medir líneas reales en Vitest no sería fiable. Un límite de caracteres conservador es lo único comprobable de forma determinista en CI.

**Alternativas descartadas**: Medir `getClientRects()`/`scrollHeight` en un test con `happy-dom` — descartada porque `happy-dom` no calcula fuentes ni layout real de texto, por lo que el resultado del test no reflejaría el comportamiento real del navegador.

## 6. ¿Qué tamaño de `Dialog` usar?

**Decisión**: `size: 'small'`.

**Motivo**: `Dialog` ya expone un catálogo cerrado (`'small' | 'medium' | 'large'`); un mensaje corto de BOT-6 (≤ 2 líneas) no necesita el ancho de `medium`/`large`, y `small` (`min(100%, 24rem)`) refuerza visualmente que se trata de un mensaje breve, no de un panel de contenido extenso.

**Alternativas descartadas**: `medium` (tamaño por defecto de `Dialog`) — descartado por dejar espacio en blanco innecesario alrededor de un texto tan corto en pantallas grandes.

## 7. ¿Qué título usar en el `Dialog` (campo obligatorio de `DialogProps`)?

**Decisión**: `title: 'BOT-6'` fijo en ambos mensajes.

**Motivo**: `DialogProps.title` es obligatorio y se usa además como `aria-label` del diálogo. Fijar siempre `"BOT-6"` refuerza la Clarification Q3 de `spec.md`: el nombre del personaje es la marca que distingue esta narrativa ficticia de cualquier futuro diálogo de datos reales (spec 023), sin necesitar un elemento visual adicional en esta spec.

**Alternativas descartadas**: Usar como título el propósito del mensaje (p. ej. "Bienvenida"/"Transición") — descartada porque expondría al jugador un título orientado a desarrolladores en vez de reforzar la presencia del personaje, y porque diluiría la marca "BOT-6 = narrativa" que Q3 estableció como mecanismo de separación.
