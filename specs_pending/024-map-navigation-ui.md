---
id: "024-map-navigation-ui"
name: "Mejora del mapa como interfaz central"
phase: "Fase 3 — Estructura de contenido, recompensas, rejugabilidad y experiencia de entrada"
depends_on: ["020-expedition-mission-structure", "023-reward-system-non-manipulative"]
---

# 024 — Mejora del mapa como interfaz central (map-navigation-ui)

## Objetivo
Rediseñar el mapa del sistema solar como interfaz central de navegación de forma GENÉRICA/data-driven (principio IX): debe mostrar el estado de cualquier número de destinos (no visitado, en progreso, completado, con margen de mejora) sin asumir una cantidad fija, validado con los 2 destinos existentes hoy (Luna, Marte) y sin necesidad de rediseño cuando la Fase 5 añada Juúpiter, Saturno, el cinturón de asteroides y más.

## Contexto / motivación
El mapa inicial (004) fue mínimo, pensado para un único destino placeholder. Con la estructura de expediciones/misiones (020) y el sistema de recompensas (023) ya operativos sobre Luna y Marte, este slice formaliza el layout definitivo del mapa ANTES de escalar el contenido (Fase 5), evitando así tener que rediseñarlo por cada tanda de destinos nuevos (principio VI: diseñar lo necesario ahora, de forma que escale, sin construir por adelantado el contenido futuro en sí).

## Alcance incluido
- Rediseño visual del mapa mostrando TODOS los destinos existentes en cada momento con su estado (no visitado, en progreso, completado, con margen de mejora), leyendo la lista de destinos de forma data-driven (nunca hardcodeada a "2" ni a ningún número fijo).
- Zoom/scroll o distribución espacial que respete tamaños táctiles grandes (principio I) y que siga funcionando razonablemente con más destinos de los que existen hoy (validado con un destino de prueba adicional ficticio en tests, sin publicarlo).
- Integración con el sistema de recompensas (023) para mostrar estrellas pendientes por destino.

## Alcance excluido
- Nuevos destinos reales (Juúpiter, Saturno, etc. — Fase 5, specs 036+).
- Cambios en la lógica de navegación interna (ya definida en 004).

## Dependencias
- 020, 023 (para mostrar estado de recompensas).

## Criterios de aceptación de alto nivel
- El mapa muestra correctamente el estado de todos los destinos existentes (hoy 2, mañana N) sin saturar visualmente la pantalla para un niño de 6 años.
- Añadir un destino nuevo en el futuro (Fase 5) es una operación de datos (nuevo registro en `core/content/`), no requiere volver a tocar este componente de mapa.
- La navegación sigue siendo predecible y con zonas táctiles grandes independientemente del número de destinos.

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: navegación sencilla y predecible pese a más contenido.
- **V. Rejugabilidad**: visibilidad de estrellas pendientes por destino.

## Frase de entrada sugerida para /speckit-specify
"Quiero rediseñar el mapa del sistema solar para mostrar el estado (no visitado, en progreso, completado, con estrellas pendientes) de todos los destinos existentes, manteniendo zonas táctiles grandes y navegación predecible para un niño de 6 años."
