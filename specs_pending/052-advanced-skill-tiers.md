---
id: "052-advanced-skill-tiers"
name: "Niveles de habilidad avanzados"
phase: "Fase 8 — Herramientas y crecimiento a largo plazo"
depends_on: ["006-skill-progress-model", "041-difficulty-tuning-v2", "051-exoplanet-systems-trappist1"]
---

# 052 — Niveles de habilidad avanzados (advanced-skill-tiers)

## Objetivo
Ampliar el modelo de habilidades y el catálogo de retos para soportar niveles de dificultad significativamente más avanzados (multiplicación, división, lógica multi-paso, lectura de frases), acompañando el crecimiento del jugador más allá de los ~6 años iniciales.

## Contexto / motivación
El principio IV establece explícitamente que la edad inicial "MUST NOT convertirse en una limitación estructural del producto" y que el sistema debe poder incorporar contenido más avanzado sin rediseñar el modelo de progreso. Tras validar la escalabilidad con TRAPPIST-1 (051), este slice añade profundidad real de contenido educativo.

## Alcance incluido
- Nuevos tipos de reto o extensión de los existentes: `multiplication`, `division`, `logic` multi-paso, y una variante `reading` de frases cortas que EXTIENDE explícitamente el alcance excluido de 018 (que solo cubría palabras sueltas/asociación palabra-imagen); esta spec es la que introduce comprensión de frases simples, reutilizando el mismo `ReadingChallengeConfig` con un nuevo nivel de longitud/complejidad en vez de un tipo de reto separado.
- Extensión de rangos de dificultad en los tipos de reto existentes (counting, addition, subtraction) para niveles altos de dominio.
- Verificación de que el modelo de habilidades (006) y la dificultad adaptativa (041) soportan estos nuevos rangos sin romper compatibilidad con el contenido existente.

## Alcance excluido
- Contenido curricular formal (el juego sigue sin ser "fichas escolares", principio II).
- Nuevos destinos (puede reutilizar destinos y sistemas ya existentes o futuros).

## Dependencias
- 006, 041, 051 (como validación previa de escalabilidad).

## Criterios de aceptación de alto nivel
- Existen nuevos tipos/rangos de reto que suponen un salto real de dificultad respecto al contenido inicial.
- El modelo de progreso y dificultad adaptativa siguen funcionando sin romper el contenido existente.
- El contenido avanzado sigue integrado narrativamente (principio II), no como ejercicios aislados.

## Alineación con la constitución
- **IV. Progresión adaptativa y por habilidades**: cumplimiento directo de "sin techo artificial" y "sin rediseñar el modelo".
- **II. Juego antes que ejercicio**: incluso el contenido avanzado debe mantenerse jugable, no académico.

## Frase de entrada sugerida para /speckit-specify
"Quiero ampliar el catálogo de retos con niveles de dificultad significativamente más avanzados (multiplicación, división, lógica multi-paso, lectura de frases), verificando que el modelo de progreso y la dificultad adaptativa existentes los soportan sin rediseño ni romper el contenido ya construido."
