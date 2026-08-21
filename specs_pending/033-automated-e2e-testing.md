---
id: "033-automated-e2e-testing"
name: "Testing E2E de flujos de juego"
phase: "Fase 4 — Gate de publicación estable (MVP)"
depends_on: ["020-expedition-mission-structure", "025-onboarding-first-session", "026-accessibility-child-ux"]
status: "Pending"
priority: "High"
related_principle: ["Principle X (Cobertura exhaustiva de testing)", "Principle VII (Separación lógica/renderizado)"]
---

# 033 — Testing E2E de flujos de juego (automated-e2e-testing)

## Objetivo
Implementar una suite **exhaustiva** de tests end-to-end (Playwright) que valide completamente todos los flujos de juego implementados en specs 001-032, detectando regresiones de integración y validando interacción, accesibilidad e integración lógica-UI.

A partir de spec 033, toda feature nueva que implemente UI MUST incluir cobertura E2E exhaustiva (ver Principio X de constitution.md y docs/conventions/testing-policy.md).

## Contexto / motivación
Hasta ahora la disciplina de testing se ha centrado en tests unitarios de la lógica desacoplada (principio VII). Con múltiples destinos y flujos de UI reales, incluyendo los ajustes de la accesibilidad infantil (026), hace falta cobertura E2E que:

1. Valide flujos **completos** de usuario (entrada → lógica → renderizado → salida)
2. Detecte regresiones de integración que los tests unitarios no cubren
3. Valide sobre las pantallas **finales** ya auditadas/corregidas (026, accesibilidad infantil)
4. Testee interacción táctil, teclado y ratón (accesibilidad operacional)
5. Establezca una línea base exhaustiva para futuros specs

## Alcance incluido
- Selección de herramienta E2E adecuada al stack (Phaser + Vite) y su integración en CI
- Configuración de Playwright y estructura de tests (`e2e/`)
- Tests E2E **EXHAUSTIVOS** de TODA la funcionalidad UI implementada en specs 001-032:
  * **Flujos críticos**: primera sesión (025), onboarding, seleccionar destino, completar misión
  * **Todos los tipos de reto implementados**: conteo (008), adiciones (004), reintentos (010), pistas (010)
  * **Todas las pantallas/overlays**: diálogo de retos, mapas, selección de destino
  * **Interacción completa**: táctil (primary), teclado (accessibility), ratón (fallback)
  * **Variantes**: por dificultad, por progresión, por habilidad
  * **Rejugabilidad**: reintentar retos, volver a destinos, avanzar/retroceder
  * **Flujos de error**: reto incorrecto → pista → reintento → correcto
- Integración de tests E2E en gate de compilación (`npm run test:e2e`)
- Ejecución automática en pipeline de CI (spec 034)
- Documentación de política de testing en `docs/conventions/testing-policy.md`
- Reporte de cobertura E2E en cada spec posterior a 033

## Alcance excluido
- Testing de rendimiento (cubierto en 046)
- Testing de responsive design exhaustivo (tested representativamente en tablet/mobile)
- Testing de internacionalización exhaustiva (cuando 046 exista; aquí usar castellano)

## Dependencias
- 020, 025, 026 (los E2E deben ejercitar las pantallas ya auditadas/corregidas por la accesibilidad infantil, que es precondición)
- 001-032: toda funcionalidad implementada en estas specs MUST tener cobertura E2E dentro de 033

## Cambios esperados en constitution.md
- Añadir Principio X (Cobertura exhaustiva de testing): Tests unitarios desde inicio, tests E2E exhaustivos a partir de 033
- Redefinir "completa" una feature: requiere tests (unitarios + E2E desde 033)

## Cambios esperados en procesos
- `npm run test:e2e` será parte de gate obligatoria desde 033
- Cada spec ≥ 033 MUST documentar cobertura E2E en front matter
- PRs de specs ≥ 033 no se mergean sin tests E2E pasando

## Criterios de aceptación de alto nivel
- Infraestructura Playwright integrada y funcional
- Cobertura E2E exhaustiva de **TODA** funcionalidad UI de specs 001-032
- Tests E2E validar flujos completos (entry → logic → render → outcome)
- Tests E2E validar interacción táctil + teclado + ratón
- Tests E2E validar integración con progresión, dificultad, reintentos
- Cobertura mínima: 85% de UI crítica, 100% de flujos de usuario principales
- Gate `npm run test:e2e` pasa, integrada en CI
- Documentación clara de strategy para futuros specs (testing-policy.md)

## Alineación con la constitución
- **Principio X (nuevo)**: Cobertura exhaustiva de testing — tests unitarios desde el inicio, tests E2E desde spec 033
- **VI. Simplicidad primero**: no sobre-testear (solo lo que la feature implementa); reutilizar tests anteriores cuando sea posible
- **VII. Separación lógica/renderizado**: los E2E complementan, no sustituyen, los tests unitarios de lógica pura ya existentes

## Impacto en specs posteriores

A partir de spec 033, TODAS las specs implementadas deben cumplir:

```bash
# Gate anterior (specs 001-032)
npm run lint && npm test && npm run build

# Gate nuevo (specs 033+)
npm run lint && npm test && npm run build && npm run test:e2e
```

Toda feature ≥ 033 que implemente UI nueva MUST incluir tests E2E exhaustivos de esa UI en el alcance de su propia spec (no diferida a retrospectiva).

## Frase de entrada sugerida para /speckit-specify
"Implementar una suite exhaustiva de tests E2E (Playwright) que cubra completamente toda la funcionalidad UI de specs 001-032, incluyendo flujos críticos, todos los tipos de reto, variantes de dificultad, interacción táctil/teclado/ratón, y reintentos con pistas. A partir de esto, spec 034+ deberán incluir tests E2E exhaustivos de cualquier UI nueva que implementen. Documentar la estrategia y convenciones en testing-policy.md."
