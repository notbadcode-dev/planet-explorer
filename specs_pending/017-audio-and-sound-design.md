---
id: "017-audio-and-sound-design"
name: "Audio y diseño de sonido"
phase: "Fase 2 — Catálogo de retos por materia, audio y segundo destino"
depends_on: ["005-bot6-narrative-shell", "007-challenge-engine-core"]
---

# 017 — Audio y diseño de sonido (audio-and-sound-design)

## Objetivo
Añadir un sistema de audio (música ambiental, efectos de sonido, narración por voz de BOT-6) integrado en el bucle de juego y los destinos existentes.

## Contexto / motivación
El principio I exige favorecer audio e interacción directa y minimizar la dependencia del texto, especialmente relevante para un niño de ~6 años que puede no leer con fluidez (ver también 018, retos de lectura).

## Alcance incluido
- Sistema centralizado de reproducción de audio (música por escena, efectos por evento: acierto, fallo, pista, transición).
- Narración por voz (grabada o TTS) de los diálogos clave de BOT-6 (005) y, si aplica, de los enunciados de retos de lectura (018).
- Control de volumen/mute accesible desde el HUD.
- Gestión de assets de audio de forma data-driven (mapeo evento → clip).

## Alcance excluido
- Locuciones completas de todo el contenido futuro (se añade incrementalmente junto a cada nuevo destino/reto).
- Generación de voz dinámica por IA en tiempo real (fuera de alcance salvo justificación futura).

## Dependencias
- 005 (diálogos existentes), 007 (eventos de reto ya generados por el motor: acierto, fallo, pista).

## Criterios de aceptación de alto nivel
- Los eventos clave del juego (acierto, fallo, transición, diálogo de BOT-6) tienen audio asociado.
- El jugador puede silenciar/ajustar el volumen desde un control accesible y grande (principio I).
- Añadir audio a un nuevo evento no requiere cambios estructurales, solo registrar un nuevo clip en la configuración.

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: refuerza comprensión inmediata sin depender de lectura.
- **IX. Contenido dirigido por datos**: mapeo evento-audio configurable.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un sistema de audio centralizado (música, efectos de sonido y narración por voz de BOT-6) integrado en el bucle de juego y los destinos existentes, con control de volumen accesible y mapeo evento-audio configurable por datos."
