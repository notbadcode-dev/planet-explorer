---
title: Testing Policy
type: convention
scope: project-wide
applies_to: [all-specs, all-phases]
related_constitution: [Principle X (Cobertura exhaustiva de testing)]
updated: "2026-08-21"
status: Active
---

# Testing Policy — Explorador Espacial

## Objetivo

Establecer una convención clara y exhaustiva de testing que asegure que cada feature implementada tiene cobertura completa de su comportamiento, tanto de lógica pura como de interfaz de usuario.

Testing no es una tarea posterior ni opcional: es parte integral de cada spec.

---

## Principios

1. **Exhaustividad**: Cada feature MUST incluir tests que validen íntegramente su comportamiento.
2. **Separación**: Tests unitarios (lógica pura sin Phaser/DOM) y E2E (interfaz y flujos) son tipos distintos.
3. **Proporción**: La cobertura debe ser exhaustiva dentro del alcance de la feature, no especulativa.
4. **Automatización**: Todos los tests MUST ser reproducibles, automatizables y ejecutables en CI.
5. **Regresión**: Los tests MUST validar que el comportamiento anterior no ha cambiado (cuando aplique).

---

## Tests Unitarios (Vitest)

### Cuándo hacer tests unitarios

Todo módulo que contenga lógica pura MUST tener tests unitarios:

* Motores (`*-engine.ts`)
* Máquinas de estado (`*-state.ts`)
* Funciones de transformación y validación
* Funciones de cálculo
* Cualquier código que ejecute sin Phaser/DOM

### Responsabilidad del test unitario

Validar:

* **Comportamiento correcto**: La función produce el resultado esperado
* **Casos límite**: Comportamiento en bordes del dominio (mín, máx, valores especiales)
* **Regresiones**: Que el comportamiento anterior se mantiene (cuando se amenda un módulo)
* **Contratos**: Que la interfaz pública cumple su contrato
* **Invariantes**: Que los estados/datos mantienen propiedades que no deben cambiar

Ejemplos:

```ts
// challenge-engine.test.ts — Casos límite
describe('generateCountingChallenge', () => {
  it('should generate a challenge with count between 2 and 9', () => {
    const challenge = generateCountingChallenge(/* config */);
    expect(challenge.count).toBeGreaterThanOrEqual(2);
    expect(challenge.count).toBeLessThanOrEqual(9);
  });
});

// destination-visit-state.test.ts — Regresión contra spec anterior
describe('submitAnswer (spec 008 guarantees)', () => {
  it('G1: should not modify spec 008 behavior', () => {
    // Verificar que G1-G6 siguen siendo válidas
  });
});

// skill-progress-state.test.ts — Contrato
describe('updateSkillProgress', () => {
  it('should respect the update result contract', () => {
    const result = updateSkillProgress(/* ... */);
    expect(result.skillLevel).toBeDefined();
    expect(result.failureCount).toBeDefined();
    // ... validar que el contrato se cumple
  });
});
```

### Ubicación y nombrado

```text
src/game/core/challenge-engine/
├── challenge-engine.ts
├── challenge-engine.test.ts           ← Test unitario co-localizado
├── challenge-engine.type.ts
└── challenge-engine.constants.ts

src/game/core/destination-visit/
├── destination-visit-state.ts
├── destination-visit-state.test.ts    ← Test unitario co-localizado
├── destination-visit-state.type.ts
└── destination-visit-state.constants.ts
```

### Ejecución

```bash
npm test                    # Ejecuta todos los tests unitarios (Vitest)
npm test -- --coverage      # Con reporte de cobertura
npm test -- watch           # En modo watch
```

### Gate de verificación

```bash
npm run lint && npm test && npm run build
```

Esta gate MUST pasar antes de:
* Hacer commit
* Hacer push
* Hacer merge a `develop` o `master`

---

## Tests End-to-End (Playwright)

### Cuándo hacer tests E2E

A partir de **spec 033** en adelante, todo flujo de interfaz de usuario que integre lógica testeable unitariamente MUST tener tests E2E que validen el flujo completo.

**Specs anteriores a 033**: Solo tests unitarios (la infraestructura E2E aún no existe)

**Spec 033 en adelante**: Toda feature que implemente UI MUST incluir tests E2E exhaustivos

### Casos donde se requiere cobertura E2E

#### Nuevos tipos de retos

Si una spec implementa nuevos tipos de retos (ej: restas, memoria, lectura):

✅ **MUST**: Tests E2E que cubran todas las variantes visuales e interactivas
* Mostrar el reto
* Seleccionar/escribir respuesta
* Ver feedback correcto/incorrecto
* Ver pistas (si aplica)
* Reintentar

```ts
// e2e/challenges/subtraction.e2e.ts
describe('Subtraction Challenge UI Flow', () => {
  it('should display and complete a subtraction challenge', async () => {
    await page.goto('/game/destination/mars/expedition/001');
    await page.click('[data-testid="start-mission"]');
    // Validar que el reto de resta se muestra
    await expect(page.locator('[data-testid="challenge-prompt"]')).toContainText('7 - 3');
    // Interactuar y validar flujo completo
  });
});
```

#### Nuevas pantallas o flujos

Si una spec implementa pantallas nuevas (ej: mapa de destinos, onboarding):

✅ **MUST**: Tests E2E que cubran flujos principales de usuario
* Navegación
* Selección de opciones
* Transiciones
* Validación de contenido

#### Nuevas interacciones

Si una spec añade nuevas formas de interacción (ej: botones, sliders, diálogos):

✅ **MUST**: Tests E2E que cubran:
* Interacción táctil (mobile-first)
* Interacción con ratón
* Interacción con teclado (Tab, Enter, Space) — accesibilidad
* Comportamiento en distintos tamaños de pantalla

```ts
// e2e/interaction/hint-button.e2e.ts
describe('Hint Button Accessibility', () => {
  it('should work with keyboard Tab + Enter', async () => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    // Validar que se reveló la pista
  });
  
  it('should work with touch tap', async () => {
    const hintButton = page.locator('[data-testid="hint-button"]');
    await hintButton.tap();
    // Validar que se reveló la pista
  });
});
```

#### Flujos críticos de usuario

Si una spec modifica un flujo existente (ej: agregar reintentos, pistas):

✅ **MUST**: Tests E2E que cubran el flujo completo de principio a fin

```ts
// e2e/flows/challenge-with-retry-and-hints.e2e.ts
describe('Complete Challenge Flow with Retry + Hints', () => {
  it('should fail a challenge, request hint, and retry successfully', async () => {
    // 1. Mostrar reto
    // 2. Intentar respuesta incorrecta
    // 3. Ver diálogo de error
    // 4. Pedir pista
    // 5. Ver pista revelada
    // 6. Intentar de nuevo
    // 7. Ver respuesta correcta y avance
  });
});
```

### Responsabilidad del test E2E

Validar:

* **Integración lógica-renderizado**: La lógica testeada unitariamente funciona correctamente en la UI
* **Flujos de usuario completos**: El jugador puede realizar el flujo de principio a fin
* **Regresiones de integración**: Cambios en un módulo no rompen flujos ya testeados
* **Accesibilidad de interacción**: Teclado, touch, ratón funcionan
* **Visualización correcta**: Los textos, estilos, y elementos aparecen donde se espera

### Estructura de tests E2E

```text
e2e/
├── fixtures/              # Datos compartidos
│   ├── game-state.ts
│   └── browser-context.ts
├── flows/                 # Flujos completos de usuario
│   ├── first-session.e2e.ts
│   ├── complete-mission.e2e.ts
│   └── retry-with-hints.e2e.ts
├── challenges/            # Por tipo de reto
│   ├── counting.e2e.ts
│   ├── addition.e2e.ts
│   ├── subtraction.e2e.ts
│   └── memory.e2e.ts
├── interaction/           # Interacción
│   ├── keyboard.e2e.ts
│   ├── touch.e2e.ts
│   └── mouse.e2e.ts
└── accessibility/         # Accesibilidad
    ├── button-keyboard.e2e.ts
    └── dialog-keyboard.e2e.ts
```

### Ejecución

```bash
npm run test:e2e                    # Ejecuta todos los tests E2E
npm run test:e2e -- --headed        # En modo visual (browsers abiertos)
npm run test:e2e -- --debug         # En modo debug
```

### Gate de verificación (spec 033+)

```bash
npm run lint && npm test && npm run build && npm run test:e2e
```

---

## Reporte de Testing en spec.md

Cada `spec.md` MUST documentar su cobertura de testing en el front matter:

### Specs anteriores a 033 (solo unitarios)

```yaml
---
name: "001 — Core Game Loop"
Testing:
  unitario:
    - challenge-engine.test.ts (8 tests)
    - destination-visit-state.test.ts (12 tests)
  e2e: null # Aún no disponible
  coverage_logic: 95%
  coverage_ui: N/A
---
```

### Specs 033+ (unitarios + E2E)

```yaml
---
name: "033 — Automated E2E Testing"
Testing:
  unitario:
    - challenge-engine.test.ts (5 new tests)
  e2e:
    - e2e/flows/first-session.e2e.ts
    - e2e/challenges/counting.e2e.ts
    - e2e/interaction/keyboard-navigation.e2e.ts
  coverage_logic: 98%
  coverage_ui: 90%  # Solo desde spec 033
---
```

---

## Estrategia de cobertura exhaustiva

### "Exhaustivo" NO significa

❌ Cubrir especulativamente funcionalidad futura
❌ Cubrir comportamiento imposible o irreal
❌ Escribir tests para cada línea sin sentido

### "Exhaustivo" SÍ significa

✅ Cubrir **completamente** la funcionalidad que la spec aporta
✅ Cubrir todos los caminos happy path + error path
✅ Cubrir todos los tipos de reto si la spec los implementa
✅ Cubrir todas las variantes visuales si se implementan
✅ Cubrir flujos desde entrada del usuario hasta resultado visible

### Checklist de cobertura (por tipo de feature)

**Feature de lógica pura (motor, máquina de estado)**
- [ ] Todos los casos de uso normales cubiertos
- [ ] Casos límite (min, max, vacío, nulo)
- [ ] Errores esperados manejados
- [ ] Contrato validado
- [ ] Invariantes preservados

**Feature de nuevo tipo de reto**
- [ ] Todos los niveles de dificultad cubiertos
- [ ] Validación correcta/incorrecta
- [ ] Feedback visual (reto mostrado, respuesta recibida, resultado dado)
- [ ] Interacción táctil + teclado + ratón
- [ ] Accesibilidad (Tab, Enter, labels)
- [ ] Rejugabilidad (reintentos, pistas)

**Feature de nueva pantalla/flujo**
- [ ] Navegación hacia la pantalla
- [ ] Renderización correcta del contenido
- [ ] Todas las interacciones principales
- [ ] Navegación hacia pantalla siguiente
- [ ] Preservación de estado (si aplica)

---

## Flujo de implementación con testing

### Para cada spec (sin importar fase)

1. **Leer spec y plan** → Entender qué se implementa
2. **Diseñar tests unitarios** → Qué lógica pura se agrega
3. **Implementar lógica + tests unitarios** → Código + validación
4. **Implementar UI que use la lógica** 
5. **Si spec < 033**: Listo. Pasar gate de unitarios.
6. **Si spec ≥ 033**: Diseñar e implementar tests E2E del flujo completo
7. **Pasar gate completo** (lint + test + build + test:e2e)

### Commits recomendados

```bash
# Fase Foundational
git commit -m "feat(010): add hint request logic + tests"

# Fase de UI
git commit -m "feat(010): add hint dialog UI + e2e tests"

# Integración
git commit -m "test(010): cover complete retry-with-hints flow"
```

---

## Revisión de testing en PR/feature finish

Before merging a feature, verify:

- [ ] Todos los tests unitarios pasan (`npm test`)
- [ ] Todos los tests E2E pasan (si spec ≥ 033) (`npm run test:e2e`)
- [ ] Cobertura de lógica ≥ 90%
- [ ] Cobertura de UI representativa (no al 100%, pero flujos críticos)
- [ ] Gate de compilación limpia (`npm run lint && npm test && npm run build`)
- [ ] Front matter de `spec.md` actualizado con testing info

---

## FAQs

**P: ¿Hay que testear todo?**
R: No. Testing exhaustivo significa cubrir completamente lo que la spec hace, no código que no existe aún ni comportamiento que nunca ocurre. Si una feature añade un nuevo tipo de reto, sí: cubrir completamente ese reto. Si agrega una nueva pantalla: cubrir el flujo de esa pantalla. Si modifica un motor: cubrir la lógica modificada.

**P: ¿Qué pasa si una feature anterior a spec 033 necesita tests E2E?**
R: Se espera hasta spec 033, que implementa la infraestructura E2E. Si es crítico cubrir algo antes, usar Storybook stories interactivas como workaround.

**P: ¿Los tests E2E deben probar accesibilidad completa?**
R: No; spec 026 (auditoría de accesibilidad infantil) es responsable de validación profunda de a11y. Tests E2E de interacción (Tab, Enter, Space) son suficientes para ensuring comportamiento básico funciona.

**P: ¿Se pueden reutilizar tests E2E entre specs?**
R: Sí. Si spec 034 no añade UI, los tests E2E de spec 033 SHOULD reutilizarse para validar que las mejoras de lógica no rompieron flujos existentes.

---

## Cambios documentados

**Version 1.0** — Initial policy (2026-08-21)
- Defined unit testing requirements (all specs)
- Defined E2E testing requirements (spec 033+)
- Established gate criteria
- Documented exhaustive coverage definition
