---
id: "046-localization-i18n"
name: "Internacionalización (i18n)"
phase: "Fase 6 — Progresión avanzada y contenido data-driven"
depends_on: ["005-bot6-narrative-shell", "019-reading-challenges", "023-astronomy-facts-module", "045-data-driven-content-pipeline"]
---

# 046 — Internacionalización (localization-i18n)

## Objetivo
Añadir soporte multi-idioma para toda la interfaz, diálogos de BOT-6, retos de lectura y fichas astronómicas, apoyándose en el pipeline de contenido data-driven (045).

## Contexto / motivación
Aunque la constitución no menciona idiomas explícitamente, es un requisito transversal común para escalar la audiencia del juego educativo. Se ubica tras 045 porque requiere que todo el texto esté ya externalizado como datos, no embebido en código/escenas.

## Alcance incluido
- Extracción de todos los textos existentes (UI, diálogos, retos de lectura, fichas astronómicas) a archivos de traducción por idioma.
- Selector de idioma accesible (posiblemente desde el panel parental, 028, dado que un niño de 6 años no gestiona configuración de idioma).
- Al menos un idioma adicional al español como prueba de que el sistema funciona (a decidir en clarificaciones).
- Fallback seguro si falta una traducción (nunca mostrar texto roto o clave sin traducir).

## Alcance excluido
- Traducción audio/narración completa a todos los idiomas (puede quedar como ampliación futura por idioma).
- Adaptación cultural profunda de contenido (más allá de traducción textual).

## Dependencias
- 045 (contenido ya externalizado), 005, 019, 023 (fuentes de texto a traducir).

## Criterios de aceptación de alto nivel
- Cambiar de idioma actualiza toda la interfaz y contenido textual sin reiniciar el estado de progreso del jugador.
- Ningún texto queda sin traducir de forma visible (fallback seguro).
- Añadir un nuevo idioma no requiere tocar el motor ni las escenas, solo añadir un nuevo archivo de traducción.

## Alineación con la constitución
- **IX. Contenido dirigido por datos**: los textos deben ser datos, no estar embebidos en código (prerrequisito de esta spec).
- **VI. Simplicidad primero**: mecanismo de i18n simple, evitando frameworks pesados si el alcance no lo justifica.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir soporte multi-idioma para toda la interfaz, diálogos de BOT-6, retos de lectura y fichas astronómicas, con un selector de idioma accesible desde el panel parental, fallback seguro ante traducciones faltantes, y sin requerir tocar el motor para añadir un nuevo idioma."
