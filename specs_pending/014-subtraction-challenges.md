---
id: "014-subtraction-challenges"
name: "Reto de resta"
phase: "Fase 2 — Catálogo de retos por materia, audio y segundo destino"
depends_on: ["007-challenge-engine-core", "013-mars-destination-addition"]
---

# 014 — Reto de resta (subtraction-challenges)

## Objetivo
Añadir el tipo de reto `subtraction` al motor genérico, disponible para integrarse en destinos existentes o futuros.

## Contexto / motivación
Con `counting` y `addition` ya como precedente (007, 013), este slice confirma el patrón repetible para añadir nuevos tipos de reto de matemáticas básicas, manteniendo el motor central sin cambios estructurales.

## Alcance incluido
- Config data-driven `SubtractionChallengeConfig` (rango de operandos, evitar resultados negativos si corresponde a la edad).
- Generación y validación del reto, con tests unitarios.
- Integración de ejemplo en al menos un destino existente (Marte o Luna) como situación narrativa, sin crear necesariamente un destino nuevo.

## Alcance excluido
- Nuevo destino dedicado (no es necesario; puede combinarse con destinos existentes vía 021/044 más adelante).
- Multiplicación/división (specs futuras si el roadmap las prioriza).

## Dependencias
- 007-challenge-engine-core, patrón establecido en 013.

## Criterios de aceptación de alto nivel
- El motor genera y valida retos de resta correctamente configurados para la edad objetivo (sin resultados negativos confusos, salvo que se decida explícitamente lo contrario en clarificaciones).
- El nuevo tipo de reto se integra sin modificar el contrato genérico del motor.
- Cobertura de tests unitaria equivalente a la de `addition`.

## Alineación con la constitución
- **IX. Contenido dirigido por datos**: nueva config aislada, reglas explícitas.
- **II. Juego antes que ejercicio**: la resta se presenta dentro de una situación narrativa, no como operación aislada.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un nuevo tipo de reto 'subtraction' al motor genérico de retos, configurado de forma data-driven y apropiado para niños de ~6 años (evitando resultados negativos confusos), integrado como situación narrativa en un destino ya existente."
