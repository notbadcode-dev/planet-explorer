---
id: "008-moon-destination-counting"
name: "Destino: la Luna con retos de conteo"
phase: "Fase 1 — Motor de juego base y primer destino jugable"
depends_on: ["004-core-game-loop", "005-bot6-narrative-shell", "007-challenge-engine-core"]
---

# 008 — Destino: la Luna con retos de conteo (moon-destination-counting)

## Objetivo
Convertir el destino placeholder en el primer destino real y jugable: la Luna, con retos de `counting` integrados en una situación narrativa (no como ficha escolar).

## Contexto / motivación
Primer cierre completo del vertical slice: mapa → destino real → reto educativo → resultado → vuelta al mapa. Debe demostrar el principio II (juego antes que ejercicio) con un ejemplo similar al de la constitución ("BOT-6 necesita 8 muestras y ya ha encontrado 5...").

## Alcance incluido
- Escena de destino "Luna" con ambientación visual básica.
- Integración de 2-3 retos de `counting` presentados como una situación narrativa con BOT-6.
- Feedback inmediato correcto/incorrecto, con reintento sin penalización (principio I).
- Actualización del modelo de habilidad `counting` tras completar el destino.

## Alcance excluido
- Persistencia entre sesiones (ver 011).
- Otros destinos (Marte, etc. — specs posteriores).
- Rejugabilidad avanzada (estrellas pendientes, variantes — ver 022).
- Datos astronómicos reales de la Luna (ver 023; aquí solo ambientación).

## Dependencias
- 004 (bucle base), 005 (BOT-6), 007 (motor de retos).

## Criterios de aceptación de alto nivel
- Un jugador puede completar el destino Luna resolviendo retos de counting presentados narrativamente, con feedback claro y reintento permitido tras error.
- El destino actualiza el nivel de dominio de `counting` en el modelo de habilidades.
- El reto se presenta como parte de la aventura, no como "5+3=?" desnudo (principio II).

## Alineación con la constitución
- **II. Juego antes que ejercicio**: ejemplo de aplicación directa.
- **I. Experiencia centrada en el niño**: feedback inmediato, reintento sin penalización.
- **V. Destinos, expediciones, misiones**: primer destino real, aunque la jerarquía completa llega en 021.

## Frase de entrada sugerida para /speckit-specify
"Quiero convertir el destino placeholder en la Luna, con 2-3 retos de conteo presentados como una situación narrativa junto a BOT-6 (por ejemplo, recolectar muestras), con feedback inmediato, reintento sin penalización, y actualización del nivel de dominio de la habilidad counting al terminar."
