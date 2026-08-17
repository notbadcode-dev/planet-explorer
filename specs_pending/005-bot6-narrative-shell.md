---
id: "005-bot6-narrative-shell"
name: "Cascarón narrativo de BOT-6"
phase: "Fase 1 — Motor de juego base y primer destino jugable"
depends_on: ["004-core-game-loop"]
---

# 005 — Cascarón narrativo de BOT-6 (bot6-narrative-shell)

## Objetivo
Introducir a BOT-6 como robot acompañante y guía narrativo dentro del bucle de juego existente, con diálogos básicos y un sistema simple de presentación de texto/imagen, sin lógica educativa todavía.

## Contexto / motivación
La constitución define BOT-6 como elemento ficticio central de la narrativa (principio III) y exige que el juego se sienta primero como una aventura espacial (principio II). Este slice da voz y presencia al personaje antes de introducir retos educativos, sentando las bases de la separación entre narrativa/ficción y datos científicos reales.

## Alcance incluido
- Componente/sistema de diálogo simple (texto corto + retrato de BOT-6) reutilizable desde cualquier escena.
- Mensajes de bienvenida y de transición al entrar/salir de un destino.
- Frases cortas, vocabulario apropiado para ~6 años (principio I).
- Marcado claro (visual o estructural) que distinga narrativa ficticia de futuros datos científicos reales.

## Alcance excluido
- Contenido educativo o astronómico real (ver 023).
- Audio/voz de BOT-6 (ver 018).
- Ramificación de diálogo o árbol de conversación complejo.
- Personalización cosmética de BOT-6 (ver 055).
- Personalización con el nombre del jugador (ver 012, que añade la interpolación de nombre en estas mismas plantillas de diálogo una vez exista la persistencia, 011).

## Dependencias
- 004-core-game-loop (escenas y navegación ya existentes).

## Criterios de aceptación de alto nivel
- BOT-6 aparece con al menos un mensaje al entrar en el mapa y uno al entrar en el destino placeholder.
- Los textos son cortos, con vocabulario apropiado para la edad objetivo.
- El sistema de diálogo es reutilizable por futuras specs sin duplicar código.
- No se mezcla ningún dato astronómico real todavía (se reserva para 023).

## Alineación con la constitución
- **II. Juego antes que ejercicio**: refuerza la ficción de aventura antes de introducir mecánicas educativas.
- **III. Astronomía real y separación realidad/ficción**: sienta la convención de cómo distinguir narrativa de datos reales.
- **I. Experiencia centrada en el niño**: frases cortas, vocabulario apropiado.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir a BOT-6 como robot acompañante con un sistema simple de diálogo (texto corto + retrato) que salude al jugador en el mapa y al entrar en un destino, sin lógica educativa todavía, dejando clara la separación entre narrativa ficticia y futuros datos científicos."
