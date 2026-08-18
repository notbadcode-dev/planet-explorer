---
title: "Investigación: Modelo de progreso por habilidades"
feature: "006-skill-progress-model"
type: "research"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19"
status: "Draft"
---

# Investigación: Modelo de progreso por habilidades

**Entrada**: [spec.md](./spec.md) · `docs/conventions/architecture/progress-persistence-model.md` · `docs/conventions/architecture/game-engine-scenes.md`

## Contexto

Esta feature no presenta incertidumbres técnicas abiertas: las decisiones de diseño
relevantes (rango de niveles, mecánica de fallos acumulados, persistencia del
contador, manejo de errores) ya se resolvieron durante `/speckit-clarify` (sesión
2026-08-19, Q1-Q5, ver `spec.md` sección "Clarificaciones"). Las decisiones
estructurales (ubicación del código, restricción de pureza, formato serializable)
ya están fijadas por anticipado en los documentos de arquitectura referenciados
desde `constitution.md`.

No se han identificado marcadores `NEEDS CLARIFICATION` en el Contexto técnico del
plan. Este documento consolida únicamente las decisiones ya tomadas y su
justificación, sin abrir nuevas líneas de investigación.

## Decisiones

### Ubicación del código

**Decisión**: El modelo vive en `src/game/core/progress/`, como módulo hermano de
`src/game/core/navigation/` y `src/game/core/content/`.

**Motivo**: `docs/conventions/architecture/game-engine-scenes.md` fija por
anticipado este layout (tabla de `core/`), y R1 de ese mismo documento exige que
el código de `core/` no importe `phaser`. `progress-persistence-model.md` referencia
explícitamente esta ubicación como destino de esta feature.

**Alternativas descartadas**: Ubicarlo junto a `content/` (descartado: el progreso
del jugador no es contenido estático del juego, es estado mutable del jugador) o
crear un nuevo directorio de nivel superior (descartado: rompe la convención ya
fijada sin necesidad real).

### Estructura de datos e inmutabilidad

**Decisión**: `SkillProgressState` es un objeto plano (`Record<SkillName,
SkillDomain>`) serializable a JSON sin clases ni métodos. Las funciones de
actualización devuelven un **nuevo** objeto de estado sin mutar el argumento
recibido (mismo patrón que `src/game/core/navigation/navigation-state.ts`).

**Motivo**: Consistencia con el patrón ya establecido en `004-core-game-loop`
(funciones puras `createInitialNavigationState`, `completeTransition`, etc., que
devuelven nuevo estado vía spread). Un objeto plano serializable satisface también
el requisito de `progress-persistence-model.md` de que el esquema sea persistible
por `011-save-progress-local` sin transformación adicional.

**Alternativas descartadas**: Clase `SkillProgress` con métodos de instancia
(descartado: introduce estado mutable interno y complica la serialización directa
a JSON, violando principio VI de simplicidad); un único número por habilidad sin
`failureCount` (descartado: no soporta la mecánica de fallos acumulados fijada en
la clarificación Q2).

### Manejo del contador de fallos acumulados (`failureCount`)

**Decisión**: Campo persistente `failureCount` (0-2) dentro de cada `SkillDomain`,
junto a `level`. Se incrementa en cada fallo; al alcanzar 3 dispara `-1` nivel
(capped en 1) y se reinicia a 0. También se reinicia a 0 en cualquier acierto
(reset explícito, ver clarificación Q4: "reinicio automático al cambiar de nivel"
— un acierto que sube de nivel reinicia el contador; un acierto que no cambia de
nivel, por estar ya en el máximo, también reinicia el contador de fallos previos
como parte del mismo evento de progreso positivo).

**Motivo**: Clarificaciones Q2-Q4 (sesión 2026-08-19) fijan esta mecánica
explícitamente a partir de la propuesta del usuario ("intentos fallidos no cambian
nivel hasta X fallos acumulados... X=3").

**Alternativas descartadas**: Descenso inmediato de nivel en cada fallo
(descartado explícitamente por el usuario en Q2); contador transitorio no
persistente (descartado en Q3, rompe la continuidad de la mecánica entre sesiones
una vez exista 011).

### Manejo de errores para entradas inválidas

**Decisión**: Las funciones de lectura y actualización lanzan (`throw new
Error(...)`) cuando reciben una clave de habilidad no soportada o un
`SkillUpdateResult` no válido.

**Motivo**: Clarificación Q5 (sesión 2026-08-19). Consistente con TypeScript
`strict` mode ya exigido por la constitución: falla rápido ante errores de
programación (typos en la clave de habilidad) en lugar de propagar `undefined`
silenciosamente.

**Alternativas descartadas**: Devolver `undefined`/valor sentinela (descartado en
Q5, opción B); comportamiento mixto según operación (descartado en Q5, opción C,
por inconsistencia innecesaria).

### Persistencia y multi-perfil (fuera de alcance de esta feature)

**Decisión**: Esta feature MUST NOT implementar persistencia en disco/localStorage
ni namespacing por `profileId`. `SkillProgressState` se diseña como estructura
plana serializable para que `011-save-progress-local` pueda persistirla
directamente (incluyendo, en ese momento, el campo `schemaVersion` que exige R2 de
`progress-persistence-model.md`), y para que `029-multi-profile-support` pueda
namespacing por perfil sin rediseñar la forma del dato de una habilidad individual.

**Motivo**: Alcance excluido ya declarado explícitamente en `spec.md` y en
`specs_pending/006-skill-progress-model.md`. Añadir `schemaVersion` o `profileId`
en esta feature sería una anticipación no justificada (principio VI, YAGNI) ya que
ninguna de las dos features que los requieren (011, 029) está todavía implementada
ni consume este campo.

**Alternativas descartadas**: Incluir `schemaVersion` desde ya (descartado: sin
mecanismo de persistencia real que lo consuma, es campo muerto en este slice).
