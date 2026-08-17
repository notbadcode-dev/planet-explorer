---
id: "042-difficulty-tuning-v2"
name: "Dificultad adaptativa v2"
phase: "Fase 6 — Progresión avanzada y contenido data-driven"
depends_on: ["009-adaptive-difficulty-v1", "021-expedition-mission-structure"]
---

# 042 — Dificultad adaptativa v2 (difficulty-tuning-v2)

## Objetivo
Ampliar el motor de dificultad adaptativa (009) para considerar señales adicionales: dominio previo, dificultad de retos recientes y rendimiento reciente por habilidad de forma más matizada.

## Contexto / motivación
El principio IV lista explícitamente varias señales posibles (respuestas correctas/incorrectas, número de intentos, uso de pistas, dominio previo, dificultad de retos recientes, rendimiento reciente). La v1 (009) solo usó aciertos/fallos básicos; con más tipos de reto y destinos ya en producción (Fases 2-5), hay datos reales suficientes para refinar el algoritmo.

## Alcance incluido
- Incorporación de señales adicionales al cálculo de dificultad: dominio previo por habilidad, número de intentos, ratio de uso de pistas.
- Ponderación configurable y testable de cada señal (data-driven, principio IX).
- Migración retrocompatible: los destinos existentes siguen funcionando sin cambios en su integración con el motor.
- Suite de tests ampliada con escenarios más realistas (mezcla de señales).

## Alcance excluido
- Machine learning o modelos predictivos (mantener reglas explícitas, principio VI).
- Cambios en el modelo de datos de habilidades (006) salvo que sea estrictamente necesario.

## Dependencias
- 009, 021 (para tener suficiente variedad de retos/destinos que validar).

## Criterios de aceptación de alto nivel
- El nuevo algoritmo produce ajustes de dificultad más estables/precisos que v1 en los escenarios de test definidos.
- Ningún destino/reto existente requiere cambios de integración para beneficiarse de la mejora.
- El tiempo de respuesta sigue sin usarse como criterio principal.

## Alineación con la constitución
- **IV. Progresión adaptativa y por habilidades**: refinamiento directo del principio.
- **VI. Simplicidad primero**: reglas explícitas y testables, no un sistema especulativo de ML.

## Frase de entrada sugerida para /speckit-specify
"Quiero ampliar el motor de dificultad adaptativa existente para considerar señales adicionales (dominio previo, número de intentos, ratio de uso de pistas) de forma ponderada y configurable, manteniendo retrocompatibilidad con los destinos y retos ya implementados y sin usar el tiempo de respuesta como criterio."
