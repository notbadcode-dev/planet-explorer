---

title: "Quickstart: Destino: la Luna con retos de conteo"
feature: "008-moon-destination-counting"
type: "quickstart"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Quickstart de validación

## Pruebas automatizadas

```bash
npm run lint
npm test
npm run build
```

- `npm test` debe incluir (tras `/speckit-implement`) al menos:
  `destination-visit-state.test.ts` (secuencia, reintento, avance, finalización,
  actualización de habilidad en cada intento) y las extensiones de
  `destinations.test.ts`/`bot6-messages.test.ts` para los nuevos datos.

## Validación manual (navegador)

1. `npm run storybook` o `npm run dev` (según disponibilidad de una entrada que
   monte el juego completo; usar la vía ya establecida por `004`/`005`).
2. Entrar al destino "Luna" desde el mapa.
3. Comprobar que aparece un mensaje narrativo de BOT-6 (no una pregunta
   aritmética desnuda) junto a un conjunto de elementos a contar y varias
   opciones numéricas seleccionables (SC-002).
4. Seleccionar una opción incorrecta:
   - Debe mostrarse feedback claro sin penalización visible (sin "vidas"
     perdidas, sin bloqueo) y permitir reintentar el mismo reto (FR-004/FR-006).
5. Seleccionar la opción correcta:
   - Debe mostrarse feedback de acierto y avanzar al siguiente reto de la
     secuencia (FR-011), con progreso visible en el HUD (`N/3`).
6. Repetir hasta completar los 3 retos:
   - Debe mostrarse un mensaje de cierre de BOT-6 y volver a un estado
     navegable (regreso al mapa) (FR-003/FR-009).
7. Volver a entrar al mismo destino:
   - Debe generarse una secuencia nueva (retos no memorizados de la visita
     anterior, ya que no hay persistencia — fuera de alcance hasta `011`).

## Criterios de éxito relacionados (spec.md)

- SC-001: el jugador nuevo completa la secuencia completa del destino Luna
  (2-3 retos) en menos de 3 minutos en su primera visita — cronometrar el
  paso 2 a 6 de la validación manual anterior con un reloj y confirmar que el
  total es inferior a 3 minutos.
- SC-002: el 100% de los retos se presentan envueltos en narrativa de BOT-6,
  ninguno como expresión aritmética desnuda.
- SC-003: tras responder incorrectamente, el jugador puede reintentar sin
  observar ninguna reducción de puntuación, vidas o tiempo disponible.
- SC-004: al completar el destino Luna, el nivel de dominio de "counting"
  refleja los aciertos y fallos obtenidos durante la visita (comparar el
  nivel antes y después).
- SC-005: el jugador puede volver al mapa en cualquier momento durante la
  secuencia sin que la aplicación quede en un estado de error o inconsistente.
