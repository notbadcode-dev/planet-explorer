---
id: 'R003'
type: 'retrospective'
date: '2026-08-22'
scope:
    from: '011'
    to: '011'
    additionally_review:
        - '001'
        - '002'
        - '003'
        - '004'
        - '005'
        - '006'
        - '007'
        - '008'
        - '009'
        - '010'
specs_reviewed:
    - '001-component-library-architecture'
    - '002-button-variants'
    - '003-shared-components-base'
    - '004-core-game-loop'
    - '005-bot6-narrative-shell'
    - '006-skill-progress-model'
    - '007-challenge-engine-core'
    - '008-moon-destination-counting'
    - '009-adaptive-difficulty-v1'
    - '010-hints-and-retry-flow'
    - '011-save-progress-local'
status: 'Completed'
---

# Retrospectiva R003 — Persistencia local (011) y Principio X (cobertura exhaustiva de testing)

## 1. Resumen ejecutivo

El proyecto sigue razonablemente consistente: no se han encontrado contradicciones confirmadas ni incompatibilidades de modelos/contratos compartidos entre las 11 specs implementadas. La spec 011 (persistencia local) consume correctamente `SkillProgressState` (006) y el estado de destino (008) sin modificarlos, y declara con precisión sus dependientes futuros (012, 030) en `related_specs`. El hallazgo real de esta retrospectiva es documental, no funcional: el **Principio X** ("Cobertura exhaustiva de testing"), añadido a la constitución después de R002, exige un bloque `Testing:` en el front matter de cada `spec.md`, y solo 011 lo tiene — los 10 specs anteriores no. Se confirma además que la deuda técnica ya señalada en R001/R002 (refactorización de `challenge-engine.ts` a patrón de registro por tipo de reto) sigue sin resolverse, tal como estaba previsto (no era exigible antes de 011).

## 2. Hallazgos por categoría

### 2.1 Contradicciones confirmadas entre specs

Sin hallazgos.

### 2.2 Modelos/entidades/DTOs compartidos

Sin hallazgos de incompatibilidad. `011-save-progress-local` serializa/deserializa `SkillProgressState` (definido en 006) y el estado de destino (definido en 008 y extendido informalmente por 009/010) sin alterar su forma; los módulos `serialize.ts`/`deserialize.ts`/`validate.ts` de `libs/persistence` tratan esas estructuras como datos de entrada/salida, no las redefinen.

### 2.3 Contratos compartidos

Sin incompatibilidades. `011` introduce un contrato nuevo (`PersistenceService.load()` / `.save()` / `.clear()`, formato JSON con campo de versión) que **012-player-name-identity** y **030-security-and-privacy-baseline** ya declaran como dependencia en su `related_specs` — es una extensión hacia adelante, no una modificación de un contrato existente consumido por specs ya implementadas.

### 2.4 Decisiones arquitectónicas transversales

**Informativo**: `011` fija `localStorage` + esquema versionado (`schemaVersion` + migración/fallback) como el mecanismo canónico de persistencia del proyecto. Cualquier spec futura que necesite guardar estado adicional (p. ej. 029-multi-profile-support) debería reutilizar `libs/persistence` en vez de introducir un mecanismo paralelo. No hay contradicción con specs ya implementadas; se deja constancia para que las próximas retrospectivas puedan verificar que ese patrón se respeta.

### 2.5 Drift terminológico

Sin hallazgos concretos citables. La nomenclatura de progreso/skills/destinos se mantiene consistente entre 006/007/008/009/010/011.

### 2.6 Deuda acumulada

1. **(Importante — nuevo)** Bloque `Testing:` en front matter ausente en 10/11 specs.
   - **Evidencia**: `grep -r "^Testing:" specs/*/spec.md` solo devuelve `011-save-progress-local/spec.md`. El Principio X (`.specify/memory/constitution.md`, commit `22e52f1`, 2026-08-21 21:00, posterior a R002) dice literalmente "Cada spec MUST documentar en su front matter (`spec.md`)... qué tests unitarios se agregan, cobertura estimada de lógica...". La constitución no aclara explícitamente si esta obligación aplica retroactivamente a specs ya cerradas antes de su adopción, o solo desde su fecha de efecto en adelante.

2. **(Importante — carryover de R001/R002, aún abierta)** Refactorización de `challenge-engine.ts` a patrón de registro por tipo de reto.
   - **Evidencia**: `grep` sobre `src/game/core/challenge/challenge-engine.ts` no encuentra ningún patrón de registro/tabla por tipo; sigue con lógica específica de `'counting'`. Confirmado como deuda diferida intencionadamente (R001 → R002 → aquí), no bloqueante mientras exista un único tipo de reto, pero **obligatoria antes de 014-020** (subtraction/memory/sequence challenges).

3. **(Informativo)** Gaps ya documentados por la propia spec 011: `test-scenarios.ts` (T029) no está importado todavía por ningún test de round-trip; SC-005 (cobertura de branches) queda con una salvedad documentada en `SUCCESS-CRITERIA.md`. Ambos están anotados de forma transparente en la propia spec — no requieren acción de esta retrospectiva.

## 3. Acciones recomendadas

1. **(Importante, hallazgo 2.6.1)** Clarificar el alcance retroactivo del Principio X.
   - Vía sugerida: `/speckit-constitution` — para añadir una nota explícita de "grandfathering" (Principio X aplica a specs cuyo cierre sea posterior a su fecha de adopción, 2026-08-21) **o**, alternativamente, decidir junto al usuario añadir manualmente el bloque `Testing:` a `001`–`010` como actualización documental de front matter (revisar spec por spec, no ejecutado por esta skill).

2. **(Importante, hallazgo 2.6.2)** Mantener como tarea Foundational obligatoria en el plan de la próxima spec de nuevo tipo de reto.
   - Vía sugerida: cuando se especifique `014-subtraction-challenges` (la primera de `specs_pending/` que introduce un segundo tipo de reto), su `/speckit-plan` MUST incluir como tarea Foundational la refactorización de `challenge-engine.ts` a patrón de registro, igual que ya se documentó en R001/R002.

3. **(Informativo, hallazgo 2.6.3)** Sin acción — ya documentado transparentemente en `specs/011-save-progress-local/tasks.md` y `SUCCESS-CRITERIA.md`.

## 4. Baseline para la próxima retrospectiva

`to: "011"`. La próxima ejecución de `planet-retrospective-check` MUST calcular `SPECS_IMPLEMENTED_SINCE` a partir de esta spec (011), no de 010.
