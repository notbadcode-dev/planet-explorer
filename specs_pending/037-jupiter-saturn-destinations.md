---
id: "037-jupiter-saturn-destinations"
name: "Destinos: Júpiter y Saturno"
phase: "Fase 5 — Expansión del sistema solar"
depends_on: ["021-expedition-mission-structure", "023-astronomy-facts-module"]
---

# 037 — Destinos: Júpiter y Saturno (jupiter-saturn-destinations)

## Objetivo
Añadir dos nuevos destinos jugables (Júpiter y Saturno) combinando expediciones/misiones con los tipos de reto ya existentes, sin crear mecánicas nuevas.

## Contexto / motivación
Valida que el pipeline de contenido (estructura de 021 + catálogo de retos de la Fase 2 + fichas astronómicas de 023) permite escalar el número de destinos de forma barata, tal como exige el principio VI (simplicidad) y VIII (incremental).

## Alcance incluido
- Escenas/ambientación para Júpiter y Saturno.
- Al menos una expedición con una o dos misiones por destino, combinando tipos de reto ya existentes (p. ej. counting + logic en Júpiter, memory + sequences en Saturno).
- Fichas astronómicas reales (023) para ambos destinos (p. ej. anillos de Saturno, Gran Mancha Roja de Júpiter con nivel de certeza adecuado).
- Actualización del mapa para incluir ambos destinos.

## Alcance excluido
- Nuevos tipos de reto o mecánicas.
- Lunas específicas de estos planetas como destinos propios (podría ser una spec futura si se prioriza).

## Dependencias
- 021, 023.

## Criterios de aceptación de alto nivel
- Ambos destinos son jugables de principio a fin reutilizando exclusivamente retos y estructura ya existentes.
- Cada destino incluye al menos un dato astronómico real verificado.
- Añadir estos destinos no requiere cambios en el motor de retos ni en el modelo de habilidades.

## Alineación con la constitución
- **VIII. Desarrollo incremental**: contenido nuevo sin nueva infraestructura.
- **III. Astronomía real**: datos reales de gigantes gaseosos, simplificados sin falsear.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir Júpiter y Saturno como nuevos destinos jugables, combinando expediciones y misiones con tipos de reto ya existentes y añadiendo sus fichas astronómicas reales correspondientes, sin introducir mecánicas nuevas."
