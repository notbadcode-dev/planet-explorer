---
id: "026-onboarding-first-session"
name: "Onboarding de primera sesión"
phase: "Fase 3 — Estructura de contenido, recompensas, rejugabilidad y experiencia de entrada"
depends_on: ["004-core-game-loop", "005-bot6-narrative-shell", "012-player-name-identity", "018-audio-and-sound-design"]
---

# 026 — Onboarding de primera sesión (onboarding-first-session)

## Objetivo
Diseñar e implementar el flujo de primera sesión: cómo un niño de ~6 años entiende qué hacer la primera vez que abre el juego, sin ayuda constante de un adulto.

## Contexto / motivación
El principio I exige explícitamente que el juego pueda usarse sin ayuda constante de un adulto durante el flujo normal. Hasta ahora el juego asume que el jugador ya sabe navegar; este slice cubre la primera experiencia real. La identidad del jugador (nombre, detección de primera sesión vs. sesiones posteriores) ya la resuelve 012; este slice reutiliza esa misma detección para no repetir el tutorial de CONTROLES (cómo navegar el mapa y resolver un reto), que es un concepto distinto al saludo/nombre ya cubierto por 012.

## Alcance incluido
- Secuencia guiada inicial: presentación de BOT-6, explicación mínima del mapa y de cómo seleccionar un destino, usando audio/imágenes antes que texto.
- Detección de "primera vez" vs. sesiones posteriores para el TUTORIAL de controles (reutilizando la misma detección de primera sesión ya introducida en 012 para el nombre/saludo, sin duplicar esa lógica) para no repetir el onboarding innecesariamente.
- Primer reto guiado con más apoyo/pistas visibles que en sesiones posteriores.

## Alcance excluido
- Tutoriales específicos de cada tipo de reto nuevo (cada spec de reto puede incluir su propio "primer uso" si aplica).
- Configuración parental durante el onboarding (ver 028).

## Dependencias
- 004, 005, 012 (detección de primera sesión e identidad ya resueltas ahí), 018.

## Criterios de aceptación de alto nivel
- Un niño de ~6 años puede completar su primera sesión (llegar a un destino y resolver al menos un reto) sin instrucciones externas.
- El onboarding no se repite en sesiones posteriores.
- El onboarding se apoya en audio/imágenes, con texto mínimo.

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: núcleo directo del principio ("usarse sin ayuda constante de un adulto").

## Frase de entrada sugerida para /speckit-specify
"Quiero diseñar el flujo de primera sesión del juego: una introducción guiada con BOT-6 que explique de forma visual y sonora (texto mínimo) cómo navegar el mapa y resolver el primer reto, detectando si es la primera vez que el jugador abre el juego para no repetir el onboarding después."
