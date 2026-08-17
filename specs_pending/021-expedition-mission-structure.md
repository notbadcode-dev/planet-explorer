---
id: "021-expedition-mission-structure"
name: "Estructura Destino > Expedición > Misión > Reto"
phase: "Fase 3 — Estructura de contenido, recompensas, rejugabilidad y experiencia de entrada"
depends_on: ["013-mars-destination-addition", "014-subtraction-challenges", "015-memory-challenge-type", "016-sequence-pattern-challenges", "017-logic-challenges", "019-reading-challenges", "020-spatial-reasoning-challenges"]
---

# 021 — Estructura Destino > Expedición > Misión > Reto (expedition-mission-structure)

## Objetivo
Formalizar la jerarquía conceptual completa exigida por la constitución (`System > Destination > Expedition > Mission > Challenge`) reorganizando los destinos y retos ya construidos (Luna, Marte) bajo este modelo.

## Contexto / motivación
El principio V exige que cada destino pueda contener múltiples expediciones, cada expedición múltiples misiones, y cada misión combine múltiples retos. Hasta ahora (008-020) los retos se han integrado de forma directa en el destino; este slice introduce la capa intermedia sin la cual la rejugabilidad (022) y las misiones cross-skill (044) no son posibles.

## Alcance incluido
- Modelo de datos de `Expedition` y `Mission` (data-driven), que agrupan uno o más `Challenge` ya existentes.
- Refactor de Luna y Marte para exponer al menos una expedición con una o dos misiones cada una, reutilizando los tipos de reto ya implementados (008-020).
- Navegación de UI/mapa actualizada para reflejar el nuevo nivel intermedio (destino → expediciones disponibles → misión).
- Migración de progreso persistido (011) compatible con el nuevo esquema (versión de esquema incrementada).

## Alcance excluido
- Contenido nuevo (nuevos destinos o tipos de reto); esta spec es puramente estructural/refactor.
- Generación procedural de variantes de misión (ver 043).

## Dependencias
- Todos los tipos de reto y destinos de la Fase 2 (013-020).

## Criterios de aceptación de alto nivel
- Un destino (Luna o Marte) puede exponer más de una expedición, y una expedición más de una misión, cada una combinando uno o más retos ya existentes.
- El progreso persistido migra sin pérdida de datos al nuevo esquema.
- Un destino no se considera "agotado" tras completar una única misión (principio V).

## Alineación con la constitución
- **V. Destinos, expediciones, misiones, retos y rejugabilidad**: implementación literal de la jerarquía exigida.
- **IX. Contenido dirigido por datos**: expediciones/misiones definidas por configuración, no hardcodeadas en escenas.

## Frase de entrada sugerida para /speckit-specify
"Quiero refactorizar los destinos existentes (Luna, Marte) para introducir la jerarquía completa Destino > Expedición > Misión > Reto definida en la constitución, agrupando los tipos de reto ya implementados en misiones data-driven, migrando el progreso persistido al nuevo esquema sin pérdida de datos."
