---

title: "Modelo de datos: Dificultad adaptativa v1"
feature: "009-adaptive-difficulty-v1"
type: "data-model"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Modelo de datos: Dificultad adaptativa v1

No se introduce ninguna entidad persistida nueva (NFR-002). Esta feature añade
una función pura y dos conceptos de diseño: una "configuración de dificultad
ajustada" (resultado) y una "tabla de mapeo nivel → dificultad" (regla interna,
no una estructura de datos que se guarde).

## Configuración de dificultad ajustada

Es, en esta versión, una `CountingChallengeConfig` completa (tipo ya definido en
`007-challenge-engine-core`, `challenge-engine.type.ts`), producida por
`getDifficultyConfig()` y lista para pasarse directamente a `generateChallenge()`
sin transformación adicional (FR-007).

| Campo        | Tipo     | Origen                                             | Regla                                                              |
| ------------ | -------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| `type`       | `string`   | parámetro `challengeType` recibido                  | debe existir una entrada registrada para este valor (si no, error, FR-009a) |
| `min`        | `number`   | fórmula de mapeo (constante `1` en esta versión)    | `min >= 1` (regla ya validada por `007`)                            |
| `max`        | `number`   | fórmula de mapeo (`3 + (level - 1) * 1`)            | `max >= min`; estrictamente creciente en niveles consecutivos (SC-001) |
| `difficulty` | `number`   | igual al `skillLevel` recibido (FR-002a)            | `1 <= difficulty <= 10` (mismo rango que `SkillProgressState`, `006`) |

No existe una clase o interfaz `DifficultyConfig` nueva y separada: el tipo de
retorno de `getDifficultyConfig()` es la unión ya existente `ChallengeConfig`
(hoy, en la práctica, siempre `CountingChallengeConfig` mientras solo `counting`
tenga mapeo definido).

## Tabla de mapeo nivel → dificultad

Regla interna de `core/difficulty/`, no un dato persistido ni exportado como
estructura pública. Para el tipo `counting`:

| Nivel de dominio (`skillLevel`) | `min` | `max` |
| -------------------------------- | ----- | ----- |
| 1                                 | 1     | 3     |
| 2                                 | 1     | 4     |
| 3                                 | 1     | 5     |
| 4                                 | 1     | 6     |
| 5                                 | 1     | 7     |
| 6                                 | 1     | 8     |
| 7                                 | 1     | 9     |
| 8                                 | 1     | 10    |
| 9                                 | 1     | 11    |
| 10                                | 1     | 12    |

Generada por la fórmula documentada en `research.md` (sección 1), no
tabulada como literal en el código — evita la duplicación de 10 literales
mágicos y permite ajustar la progresión cambiando dos constantes
(`DIFFICULTY_COUNTING_MAX_BASE`, `DIFFICULTY_COUNTING_MAX_STEP`).

Cada tipo de reto soportado tiene su propia entrada de mapeo en el registro
interno de `core/difficulty/`; en esta versión, solo `counting` está mapeado
(Suposición de spec.md). Un tipo de reto sin entrada en este registro provoca
que `getDifficultyConfig()` lance una excepción clara (FR-009a).

## Cambios en entidades existentes

- **`Destination.challengeConfigs` (`004`/`008`, `destinations.ts`)**: su tipo
  de elemento se amplía de `CountingChallengeConfig` a `ChallengeConfig` (solo
  necesita `type`); en la práctica, `destinations.constants.ts` deja de incluir
  `min`/`max` en las entradas del destino Luna (FR-008), ya que esos valores
  pasan a derivarse exclusivamente de `getDifficultyConfig()` en el momento de
  crear la visita.
- **Ningún cambio en `SkillProgressState` (`006`)** ni en `Challenge`/
  `ChallengeConfig` (`007`) — se reutilizan tal cual, sin campos nuevos.
