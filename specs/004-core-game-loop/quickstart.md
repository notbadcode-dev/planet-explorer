---
title: "Quickstart: Bucle de juego base"
feature: "004-core-game-loop"
type: "quickstart"
version: "1.1"
created: "2026-08-17"
updated: "2026-08-17"
status: "Draft"
---

# Quickstart: Validar el bucle de juego base

**Entrada**: [spec.md](./spec.md) · [plan.md](./plan.md) · [contracts/navigation-core-contract.md](./contracts/navigation-core-contract.md)

## Prerrequisitos

* Node.js y dependencias instaladas (`npm install`, incluyendo `phaser` una vez
  añadido a `package.json` según [research.md](./research.md), sección 1).
* `vite.config.ts` con `test.include` ampliado a `src/game/**/*.test.ts` (ver
  [research.md](./research.md), sección 2).

## 1. Validar la lógica de navegación (sin Phaser)

```sh
npm test -- src/game/core/navigation
```

**Resultado esperado**: todos los tests de
`src/game/core/navigation/*.test.ts` en verde, cubriendo las garantías G1–G7 de
[navigation-core-contract.md](./contracts/navigation-core-contract.md) (estado
inicial, inicio/cierre de transición, guarda de activaciones redundantes,
repetibilidad indefinida) sin instanciar ninguna `Phaser.Scene`.

## 2. Validar lint y build completos

```sh
npm run lint
npm test
npm run build
```

**Resultado esperado**: los tres comandos terminan sin errores (mismo gate que
`.github/workflows/ci.yml`); `npm run build` genera `dist/` incluyendo el bundle de
Phaser.

## 3. Validación manual end-to-end (mapa → destino → mapa)

```sh
npm run dev
```

Abrir la URL servida por Vite y verificar, siguiendo los escenarios de aceptación
de [spec.md](./spec.md):

1. **Carga inicial** (Historia de usuario 1, escenario 1): el mapa se muestra con
   un destino visualmente identificable.
2. **Selección** (Historia de usuario 1, escenario 2): tocar/clicar el destino
   transiciona a la escena de destino en ≤ 200 ms percibidos (SC-002).
3. **Activación repetida durante la transición** (Historia de usuario 1, escenario
   3): tocar varias veces seguidas el destino mientras transiciona no produce más
   de una transición.
4. **HUD mínimo** (Historia de usuario 3): dentro de la escena de destino, se ve un
   control "volver al mapa" grande (reutiliza `Button`) y un indicador de progreso
   vacío/placeholder (reutiliza `Progress`).
5. **Retorno al mapa** (Historia de usuario 2, escenarios 1–2): activar "volver al
   mapa" regresa al mapa con el destino de nuevo visible y seleccionable.
6. **Repetibilidad** (Historia de usuario 2, escenario 3): repetir el ciclo
   mapa→destino→mapa varias veces sin errores en consola ni degradación visible
   (SC-001, SC-004).
7. **Casos límite**: redimensionar la ventana/cambiar orientación durante cada
   escena; comprobar que sigue siendo usable (ver "Casos límite" en spec.md).
8. **Carga inicial lenta** (FR-011): simular una carga lenta (throttling de red en
   DevTools) y comprobar que se muestra un indicador de carga en vez de una
   pantalla en blanco antes de que aparezca el mapa.
9. **Botón atrás del navegador** (FR-012): estando en la escena de destino, pulsar
   el botón atrás del navegador y comprobar que no aparece una pantalla en blanco
   ni un error (la escena activa se mantiene o se re-renderiza correctamente).

**Resultado esperado**: los 4 criterios de éxito medibles de spec.md (SC-001 a
SC-004) se cumplen observacionalmente.

## Fuera de alcance de este quickstart

* Pruebas E2E automatizadas con Playwright — `@playwright/test` está instalado
  como devDependency pero su adopción formal se difiere a
  `specs_pending/033-automated-e2e-testing.md` / `034-ci-cd-pipeline.md`; esta
  feature valida el flujo manualmente más tests unitarios de `core/navigation`.
* Contenido real de destino, retos o narrativa — fuera de alcance por FR-010.
