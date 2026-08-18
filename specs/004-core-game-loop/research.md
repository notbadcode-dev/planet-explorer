---
title: "Investigación: Bucle de juego base"
feature: "004-core-game-loop"
type: "research"
version: "1.0"
created: "2026-08-17"
updated: "2026-08-17"
status: "Draft"
---

# Investigación técnica: Bucle de juego base

**Entrada**: [plan.md](./plan.md) · [spec.md](./spec.md)

## 1. Versión de Phaser

**Decisión**: Usar `phaser@^4.2.1` (última versión estable publicada en npm).

**Motivo**: Es la major estable actual (4.x, con release candidates completados y
`4.2.1` publicado); la constitución exige Phaser como motor principal sin fijar una
versión concreta. No existe código Phaser previo en el repositorio que ate a una
versión anterior, por lo que no hay coste de migración.

**Alternativas descartadas**: Fijar `phaser@^3.90` (última minor de la serie 3):
descartada porque no aporta ninguna ventaja sobre 4.x para un proyecto que empieza
de cero, y fijar una major ya superada introduciría deuda de actualización
innecesaria desde el primer commit.

## 2. Alcance de Vitest sobre `src/game/core/`

**Decisión**: Ampliar `test.include` en `vite.config.ts` de `['libs/**/*.test.ts']`
a `['libs/**/*.test.ts', 'src/game/**/*.test.ts']`.

**Motivo**: [`game-engine-scenes.md`](../../docs/conventions/architecture/game-engine-scenes.md)
(R1/R4) exige que `src/game/core/navigation/` sea testable con Vitest sin
`Phaser.Scene`; el `test.include` actual solo cubre `libs/`, por lo que un test en
`src/game/core/navigation/*.test.ts` no se ejecutaría sin este cambio.

**Alternativas descartadas**: Mover la lógica de navegación a `libs/` para
aprovechar el `include` existente — descartada porque `libs/components/` es
exclusivamente presentacional (constitución, "Componentes compartidos"; regla G3
de `overview.md`) y la lógica de juego MUST vivir bajo `src/` (no en `libs/`).

## 3. `tsconfig.json` ya compila `src/`

**Hallazgo**: `overview.md` (regla G4) documentaba que `tsconfig.json` aún no
compilaba `src/`, pero la inspección directa del fichero confirma que `include` ya
contiene `"src"`. No se requiere ningún cambio de configuración de TypeScript para
esta feature.

**Acción de seguimiento**: `overview.md` queda desactualizado en ese punto concreto
y MUST corregirse como parte de la implementación de esta feature (regla G2 del
propio documento: la divergencia entre código/config y documento nunca queda sin
resolver).

## 4. Ubicación de la capa de overlay (HUD)

**Decisión**: Añadir `src/game/overlay/` como carpeta hermana de `core/` y
`scenes/`, documentada como ampliación (R8) de
[`game-engine-scenes.md`](../../docs/conventions/architecture/game-engine-scenes.md)
(v1.1 → v1.2) en lugar de decidirla solo de forma local en esta feature.

**Motivo**: La convención ya distinguía conceptualmente "UI de overlay (DOM)" de
"contenido del canvas", pero no fijaba un nombre de carpeta; al ser esta la primera
implementación real del motor de juego, la decisión estructural es transversal a
features futuras (HUD de retos, diálogos de resultado, dashboard parental) y por
tanto pertenece a `docs/conventions/`, no solo al `plan.md` de esta feature.

**Alternativas descartadas**: Documentar la carpeta únicamente en el `plan.md` de
`004-core-game-loop` — descartada porque futuras specs de gameplay necesitarán la
misma decisión y repetirla ad hoc por feature contradice la regla de autoridad G1
de `overview.md`.

## 5. Modelo de estado de la transición mapa↔destino

**Decisión**: Modelar `src/game/core/navigation/` como una máquina de estados
mínima con un patrón begin/complete (`beginTransitionToDestination`,
`beginTransitionToMap`, `completeTransition`) en lugar de un cambio de escena
instantáneo de un solo paso.

**Motivo**: FR-007 exige ignorar activaciones repetidas mientras una transición
"ya está en curso". Sin un estado explícito `isTransitioning`, no hay forma de
distinguir "sin transición" de "transición en curso" de forma testable con Vitest
sin depender del tiempo real de una animación Phaser. El patrón begin/complete
permite que la escena Phaser controle cuándo termina realmente la animación
(llamando a `completeTransition`) sin que `core/` conozca nada de temporizadores ni
de Phaser.

**Alternativas descartadas**: Guard basado en un `setTimeout`/debounce por tiempo
fijo — descartada por acoplar la lógica pura a un valor de tiempo arbitrario y por
ser más difícil de testear de forma determinista que un cambio de estado explícito.

## 6. Reutilización de `libs/components/` en el HUD de overlay

**Decisión**: El control "volver al mapa" reutiliza `Button` (variante/tamaño que
ya expone `--size-touch-target-min`) y el indicador de progreso placeholder
reutiliza `Progress` en su estado vacío, ambos de `libs/components/`, montados en
`src/game/overlay/`.

**Motivo**: `game-engine-scenes.md` (R7) permite y recomienda reutilizar
`libs/components/` en la capa de overlay; `Button` ya resuelve FR-003 (zona táctil
grande) sin introducir un control nuevo, y `Progress` ya soporta un estado
vacío/placeholder sin datos reales, evitando duplicar UI ya existente y probada.

**Alternativas descartadas**: Dibujar el control y el indicador como Game Objects
de Phaser dentro de `DestinationScene` — descartada porque contradice R7/R8 (UI de
overlay persistente, no contenido del canvas) y duplicaría accesibilidad/estilos ya
resueltos por los componentes existentes.

## 7. Representación visual del destino placeholder (sin assets nuevos)

**Decisión**: El destino en el mapa se representa mediante Game Objects nativos de
Phaser (círculo/texto vía `this.add.circle`/`this.add.text`), sin cargar imágenes ni
spritesheets nuevos.

**Motivo**: La spec no exige arte final para este slice (Suposiciones: "escena de
destino es un placeholder vacío"); la constitución desaconseja "imágenes
innecesariamente grandes" y "cargas iniciales excesivas". Evitar un pipeline de
assets todavía no decidido mantiene el slice simple (principio VI).

**Alternativas descartadas**: Añadir un sprite/imagen placeholder desde ya —
descartada por introducir una decisión de pipeline de assets (formato, carpeta,
optimización) sin necesidad real todavía; se difiere a la spec que introduzca el
primer destino con arte real (p. ej. 008/013).
