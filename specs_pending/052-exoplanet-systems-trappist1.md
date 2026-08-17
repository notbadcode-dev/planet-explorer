---
id: "052-exoplanet-systems-trappist1"
name: "Sistemas exoplanetarios (TRAPPIST-1)"
phase: "Fase 8 — Herramientas y crecimiento a largo plazo"
depends_on: ["023-astronomy-facts-module", "045-data-driven-content-pipeline", "051-content-authoring-tools"]
---

# 052 — Sistemas exoplanetarios: TRAPPIST-1 (exoplanet-systems-trappist1)

## Objetivo
Expandir el universo explorable más allá del sistema solar, añadiendo un sistema exoplanetario real (TRAPPIST-1) como contenido avanzado para jugadores con mayor dominio.

## Contexto / motivación
El principio III permite explícitamente exoplanetas y otros sistemas planetarios reales, y el principio IV exige que el sistema pueda incorporar contenido significativamente más avanzado sin rediseñar el modelo de progreso. Este slice es la primera validación real de ese requisito de escalabilidad a largo plazo.

## Alcance incluido
- Nuevo "System" (jerarquía System > Destination, principio V) para TRAPPIST-1, usando la herramienta de autoría (051) y el esquema (045).
- Al menos 2-3 destinos (planetas de TRAPPIST-1) con expediciones/misiones reutilizando retos existentes, con dificultad ajustada a un nivel de dominio más alto.
- Fichas astronómicas reales, dejando claro qué se sabe con certeza y qué es todavía objeto de estudio científico (principio III: datos inciertos no se presentan como hechos).
- Criterio de desbloqueo basado en nivel de habilidad (no en tiempo jugado ni pago), acorde al principio IV: se define un umbral mínimo explícito y testeable (p. ej. dominio ≥20 en al menos 3 habilidades distintas, valor exacto a confirmar en `/speckit-clarify`), nunca un único promedio agregado que oculte habilidades poco desarrolladas.

## Alcance excluido
- Contenido de otros sistemas exoplanetarios (puede añadirse en specs futuras siguiendo el mismo patrón).
- Cambios en el modelo de progreso (debe reutilizarse sin rediseño, validando el principio IV).

## Dependencias
- 023, 045, 051.

## Criterios de aceptación de alto nivel
- El nuevo sistema es jugable reutilizando el modelo de progreso, motor de retos y estructura de contenido existentes sin rediseño.
- Las fichas astronómicas distinguen claramente entre datos confirmados e inciertos sobre TRAPPIST-1.
- El acceso a este contenido depende de un umbral explícito y documentado de nivel de habilidad del jugador (no de mecánicas de pago o tiempo), verificable con un test automatizado.

## Alineación con la constitución
- **IV. Progresión adaptativa**: valida que el sistema soporta contenido más avanzado sin rediseño estructural.
- **III. Astronomía real**: manejo cuidadoso de incertidumbre científica en exoplanetas.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir TRAPPIST-1 como nuevo sistema exoplanetario explorable, con 2-3 destinos reutilizando el motor de retos y el modelo de progreso existentes sin rediseño, ajustado a niveles de dominio más altos, con fichas astronómicas que distingan claramente datos confirmados de datos inciertos."
