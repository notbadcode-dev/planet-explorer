---
id: "043-mission-variability-engine"
name: "Motor de variabilidad de misiones"
phase: "Fase 6 — Progresión avanzada y contenido data-driven"
depends_on: ["021-expedition-mission-structure", "022-destination-replayability"]
---

# 043 — Motor de variabilidad de misiones (mission-variability-engine)

## Objetivo
Implementar generación procedural controlada de variantes de misión (distinto contenido, combinación de retos u objetivos) limitada por reglas explícitas y testables.

## Contexto / motivación
El principio V permite que las misiones varíen mediante "generación procedural controlada", y el principio IX exige que dicha generación esté limitada por reglas explícitas. La rejugabilidad (022) hasta ahora reutiliza el motor de retos con nueva configuración; este slice añade variación real a nivel de misión (no solo de reto individual).

## Alcance incluido
- Reglas de variación de misión: combinación distinta de tipos de reto, distinto orden, distinto objetivo narrativo dentro de límites definidos por configuración.
- Garantía de que toda variante generada es completable y coherente (tests de propiedad/aleatorios controlados con semilla).
- Integración con la rejugabilidad (022) para que volver a un destino ofrezca variantes reales, no solo retos regenerados.

## Alcance excluido
- Generación de contenido completamente libre/no acotado (prohibido implícitamente por principio VI y IX: reglas MUST ser explícitas).
- Nuevos tipos de reto (reutiliza el catálogo existente).

## Dependencias
- 021, 022.

## Criterios de aceptación de alto nivel
- El sistema genera variantes de misión distintas entre sí dentro de límites definidos, siempre completables.
- Las reglas de generación son testables (dada una semilla, el resultado es determinista y verificable).
- La rejugabilidad de destinos (022) se beneficia de variantes reales, no solo de retos con nuevos números.

## Alineación con la constitución
- **V. Rejugabilidad**: "generación procedural controlada" mencionada explícitamente como mecanismo válido.
- **IX. Contenido dirigido por datos**: generación limitada por reglas explícitas y testables.

## Frase de entrada sugerida para /speckit-specify
"Quiero implementar un motor de variabilidad de misiones que genere, de forma procedural pero controlada por reglas explícitas y testables, distintas combinaciones de retos u objetivos narrativos al rejugar un destino, garantizando que toda variante generada sea siempre completable."
