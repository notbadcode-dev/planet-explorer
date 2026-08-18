---
title: "Quickstart: Cascarón narrativo de BOT-6"
feature: "005-bot6-narrative-shell"
type: "quickstart"
version: "1.0"
created: "2026-08-18"
updated: "2026-08-18"
status: "Draft"
---

# Quickstart: Validar el cascarón narrativo de BOT-6

**Entrada**: [spec.md](./spec.md) · [plan.md](./plan.md) · [contracts/bot6-dialogue-contract.md](./contracts/bot6-dialogue-contract.md)

## Prerrequisitos

* Node.js y dependencias instaladas (`npm install`) — no hay dependencias nuevas
  que instalar para esta feature (ver [research.md](./research.md)).
* Rama `005-bot6-narrative-shell` con la implementación de tasks.md aplicada.

## 1. Validar el contenido de los mensajes (sin Phaser)

```sh
npm test -- src/game/core/content/bot6-messages
```

**Resultado esperado**: todos los tests de
`src/game/core/content/bot6-messages.test.ts` en verde: textos no vacíos, longitud
de cada `text` ≤ `BOT6_MESSAGE_MAX_LENGTH` (proxy de SC-004, ver research.md §5),
`id` únicos entre los mensajes.

## 2. Validar el nuevo icono `robot`

```sh
npm test -- libs/components/icon
```

**Resultado esperado**: `Icon.test.ts` en verde, incluyendo el nuevo caso para
`'robot'` (mismo patrón que el resto del catálogo: `querySelector('path')` no
nulo).

## 3. Validar lint y build completos

```sh
npm run lint
npm test
npm run build
```

**Resultado esperado**: los tres comandos terminan sin errores (mismo gate que
`.github/workflows/ci.yml`).

## 4. Validación manual end-to-end (mapa → destino → mapa)

```sh
npm run dev
```

Abrir la URL servida por Vite y verificar, siguiendo los escenarios de aceptación
de [spec.md](./spec.md):

1. **Bienvenida en el mapa** (Historia de usuario 1, escenario 1): al cargar el
   mapa, aparece un diálogo con el retrato de BOT-6 (icono `robot`) y un mensaje
   corto de bienvenida, ocupando visualmente 2 líneas o menos sin cortar palabras
   (FR-005/SC-004).
2. **Cierre del mensaje** (Historia de usuario 1, escenario 2): cerrar el diálogo
   (botón "Continuar", Escape, o clic fuera si `Dialog` lo soporta) devuelve el
   control completo del mapa al jugador sin ningún mensaje adicional encadenado
   (FR-003a).
3. **Repetición en cada visita** (Historia de usuario 1, escenario 3): volver a
   entrar en el mapa (p. ej. tras volver de un destino) muestra el mismo mensaje de
   bienvenida de nuevo, sin lógica de "ya visto" (Clarification Q1).
4. **Transición al destino** (Historia de usuario 2, escenario 1): tocar/clicar el
   destino en el mapa muestra, al entrar en la escena de destino, un diálogo de
   BOT-6 con un mensaje breve de transición, además del HUD ya existente de
   004-core-game-loop.
5. **Cierre y flujo normal** (Historia de usuario 2, escenario 2): cerrar el
   diálogo de transición deja disponible el control "volver al mapa" del HUD sin
   ninguna interferencia.
6. **Un único mensaje por evento** (FR-003a): en ningún punto se muestra más de un
   mensaje de BOT-6 encadenado tras cerrar el anterior.
7. **Retrato como único marcador de ficción** (FR-006): no aparece ningún otro
   elemento visual (colores, iconografía) que sugiera que el mensaje de BOT-6 es
   un dato astronómico real; el nombre/retrato de BOT-6 es la única marca.
8. **Asset de retrato ausente** (Caso límite de spec.md): si se simula la ausencia
   del icono `robot` (p. ej. renombrando temporalmente el import), el diálogo
   MUST seguir siendo legible y cerrable (no debe bloquear la interacción).
9. **Interacción bloqueada mientras el diálogo está visible** (Caso límite de
   spec.md, FR-004): con el diálogo de bienvenida o de transición abierto,
   intentar tocar/clicar el mapa o el destino detrás del diálogo MUST NOT
   producir ninguna interacción hasta cerrar el diálogo (heredado del backdrop
   modal de `Dialog`, ya validado en 001-003-shared-components-base).

**Resultado esperado**: los criterios de éxito de spec.md (SC-001 a SC-005) se
cumplen observacionalmente.

**Nota sobre ajuste de texto**: el caso límite "texto más largo de lo esperado,
sin cortar palabras" (spec.md, Casos límite) se hereda íntegramente del
comportamiento ya validado de `Dialog.css`; no requiere un paso de verificación
adicional aquí porque el contenido de `bot6-messages.constants.ts` está acotado
por `BOT6_MESSAGE_MAX_LENGTH` (T003).

## Fuera de alcance de este quickstart

* Persistencia de si un mensaje ya se mostró — diferido a
  `specs_pending/011-save-progress-local.md`.
* Pruebas E2E automatizadas con Playwright — diferidas a
  `specs_pending/033-automated-e2e-testing.md` / `034-ci-cd-pipeline.md`; esta
  feature valida el flujo manualmente más tests unitarios de
  `core/content/bot6-messages` y del icono `robot`.
* Arte final del retrato de BOT-6 — fuera de alcance (Suposiciones de spec.md).
