---
id: "018-reading-challenges"
name: "Reto de lectura y lenguaje"
phase: "Fase 2 — Catálogo de retos por materia, audio y segundo destino"
depends_on: ["007-challenge-engine-core"]
---

# 018 — Reto de lectura y lenguaje (reading-challenges)

## Objetivo
Añadir el tipo de reto `reading`, centrado en reconocimiento de palabras cortas o asociación palabra-imagen, apropiado para un niño de ~6 años que puede estar iniciándose en la lectura.

## Contexto / motivación
"reading" es una habilidad explícita de la constitución. Dado que el usuario inicial tiene ~6 años (edad de alfabetización inicial), este reto MUST minimizar la dependencia de lectura fluida y apoyarse en imágenes/audio siempre que sea posible (principio I).

## Alcance incluido
- Config data-driven `ReadingChallengeConfig` (nivel de longitud de palabra, con apoyo visual obligatorio).
- Generación de retos de asociación palabra-imagen o selección de la palabra correcta entre distractores simples.
- Apoyo por audio (lectura en voz alta del enunciado) como requisito de accesibilidad, reutilizando el sistema de audio ya construido en 017.
- Integración con el modelo de habilidad `reading`.

## Alcance excluido
- Lectura de frases completas o comprensión lectora avanzada (ver 052, niveles avanzados).
- Locuciones grabadas específicas de cada palabra nueva (puede empezar con TTS o un subconjunto grabado; ampliar es responsabilidad de contenido, no del motor).

## Dependencias
- 007-challenge-engine-core, 017-audio-and-sound-design (narración del enunciado).

## Criterios de aceptación de alto nivel
- Los retos de lectura minimizan texto y usan apoyo visual siempre.
- La dificultad es configurable por longitud/complejidad de palabra.
- El reto es resoluble por un niño de ~6 años sin ayuda constante de un adulto (principio I).

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: minimizar texto, apoyo visual/audio.
- **IV. Progresión por habilidades**: habilidad `reading` independiente, pensada para crecer con el jugador (principio IV, sin techo artificial).

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un nuevo tipo de reto 'reading' de asociación palabra-imagen o selección de palabra correcta entre distractores simples, pensado para un niño de ~6 años iniciándose en la lectura, con apoyo visual obligatorio y config data-driven de dificultad."
