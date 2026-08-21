---

title: "Investigación: Dificultad adaptativa v1"
feature: "009-adaptive-difficulty-v1"
type: "research"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Investigación técnica: Dificultad adaptativa v1

## 1. Fórmula de mapeo nivel → rango para "counting"

**Pregunta**: ¿Qué relación matemática concreta produce, para cada nivel de
dominio 1-10, un rango `min`/`max` de conteo estrictamente más exigente que el
del nivel anterior (SC-001/SC-002), sin recurrir a una tabla de datos arbitraria?

**Decisión**: `min` constante en `1` para todos los niveles; `max(level) = 3 +
(level - 1) * 1`, es decir, `max` va de `3` (nivel 1) a `12` (nivel 10) en pasos
de `1`. `difficulty` del `ChallengeConfig` resultante se fija siempre igual al
`skillLevel` recibido (FR-002a).

**Justificación**:
- Es estrictamente creciente en `max` en cada paso de nivel (nunca hay dos
  niveles consecutivos con el mismo rango), cumpliendo SC-001.
- Es una fórmula de dos constantes (`DIFFICULTY_COUNTING_MAX_BASE`,
  `DIFFICULTY_COUNTING_MAX_STEP`), fácil de razonar y de ajustar por
  `042-difficulty-tuning-v2` sin rediseñar el módulo.
- No depende de tiempo de respuesta ni de ningún otro dato distinto del nivel de
  dominio (principio IV, FR-005).

**Alternativas descartadas**:
- Tabla explícita de 10 entradas `{ level, min, max }`: más verbosa, sin ninguna
  ventaja funcional sobre la fórmula mientras la progresión sea monótona simple;
  se reevaluará si una curva no lineal resulta necesaria en el futuro.
- Variar también `min` con el nivel: complica la fórmula sin necesidad para
  cumplir SC-001/SC-002 (basta con que `max` crezca); se mantiene `min` fijo por
  simplicidad (principio VI).
- Cualquier heurística basada en tiempo de respuesta o en historial de aciertos
  más allá del nivel de dominio ya existente: prohibido explícitamente por
  FR-005 y por la Suposición de spec.md de no introducir histórico nuevo.

## 2. Patrón de registro en `generateChallenge()` (corrección R2)

**Pregunta**: ¿Cómo introducir un patrón de registro por tipo de reto (exigido
por la regla R2 de `challenge-engine-contract.md`) cuando hoy solo existe un
tipo de reto (`counting`), sin sobre-diseñar para tipos que aún no existen?

**Decisión**: `Record<string, (config: ChallengeConfig) => Challenge>` con una
única entrada (`CHALLENGE_TYPE_COUNTING` → `generateCountingChallenge`),
consultado por `config.type` dentro de `generateChallenge()`; si no hay entrada,
se lanza el mismo error ya existente (`makeUnsupportedChallengeTypeError`).

**Justificación**: cumple la letra de R2 con la abstracción mínima (un objeto
literal, no una API de registro dinámico exportada); cualquier tipo de reto
futuro (`014`-`020`/`053`) añade su entrada al `Record` sin tocar el flujo de
control de `generateChallenge()`.

**Alternativas descartadas**: API pública `registerChallengeType()` — resuelve
un problema (extensibilidad desde fuera del módulo) que ninguna spec futura ha
pedido todavía; se puede introducir cuando sea necesaria (principio VI, YAGNI).

## 3. Eliminar el acoplamiento con `progress/` en `challenge-engine.ts` (corrección R5)

**Pregunta**: ¿Cómo deja `validateAnswer()` de importar
`SKILL_UPDATE_RESULT_SUCCESS`/`SKILL_UPDATE_RESULT_FAILURE` desde
`../progress/skill-progress-state.constants` sin romper la compatibilidad con el
tipo `SkillUpdateResult` que consumen `destination-visit-state.ts` y
`skill-progress-state.ts`?

**Decisión**: Definir `CHALLENGE_RESULT_SUCCESS = 'success'` y
`CHALLENGE_RESULT_FAILURE = 'failure'` como constantes locales nuevas en
`challenge-engine.constants.ts`, y usarlas en `validateAnswer()`. El tipo
`SkillUpdateResult` (`'success' | 'failure' | 'hint-used'`) ya está definido en
`challenge-engine.type.ts`, no en `progress/`, por lo que no requiere ningún
movimiento adicional.

**Justificación**: los valores son literales de cadena ya estables desde `006`;
duplicar dos constantes de texto en dos módulos independientes es más simple y
más desacoplado que introducir un tercer módulo compartido solo para dos
literales (principio VI). Ambos usos quedan cubiertos por tests existentes, por
lo que el riesgo de divergencia futura es bajo y detectable.

**Alternativas descartadas**: módulo compartido neutral
`core/shared/challenge-result.ts` — sobre-diseño para dos constantes estables;
se reconsiderará solo si aparece una tercera necesidad real de compartir este
tipo de valores entre módulos de `core/`.

## 4. Impacto en el contrato de `createDestinationVisit` (008)

**Pregunta**: ¿Cómo evoluciona la firma de `createDestinationVisit` para dejar
de depender del `min`/`max` fijo del contenido, preservando las garantías G1-G6
ya documentadas por `008`?

**Decisión**: el segundo parámetro pasa de `readonly CountingChallengeConfig[]`
a `readonly ChallengeConfig[]` (solo necesita `type` por entrada); internamente,
`createDestinationVisit` sustituye `generateChallenge({ ...config, difficulty:
skillLevel })` por `generateChallenge(getDifficultyConfig(config.type,
skillLevel))`. El número de retos generados (`challengeConfigs.length`) y el
resto de comportamiento (G1: secuencia fija al entrar; G2-G4: reintento/avance/
finalización; G5: actualización de habilidad; G6: pureza) no cambian.

**Justificación**: es el cambio mínimo necesario para satisfacer FR-008 sin
tocar ninguna otra garantía ya probada por los tests de `008`. Se documenta como
evolución hacia adelante en `009` (este `plan.md`/`data-model.md`), sin editar
retroactivamente los artefactos `Implemented` de `008`, igual que hace la propia
retrospectiva R001 al recomendar acciones futuras en vez de reescribir historia.

**Alternativas descartadas**: mantener el parámetro como
`CountingChallengeConfig[]` con `min`/`max` ignorados en tiempo de ejecución —
deja datos muertos y confusos en `destinations.constants.ts`, contradiciendo el
principio IX (contenido dirigido por datos, sin datos redundantes o inertes).
