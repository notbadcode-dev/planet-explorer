---
id: "028-parental-dashboard"
name: "Panel parental"
phase: "Fase 3 — Estructura de contenido, recompensas, rejugabilidad y experiencia de entrada"
depends_on: ["006-skill-progress-model", "011-save-progress-local"]
---

# 028 — Panel parental (parental-dashboard)

## Objetivo
Crear un panel separado del flujo de juego principal, pensado para adultos, que muestre el progreso por habilidad del niño y permita ajustes básicos (volumen, reinicio de progreso, tiempo de juego).

## Contexto / motivación
El usuario final es un niño, pero la constitución no excluye herramientas para adultos que acompañen la experiencia sin interferir en la aventura (principio I: el juego en sí no depende de un adulto, pero un adulto puede querer supervisar). Este panel debe vivir claramente fuera del flujo narrativo/jugable.

## Alcance incluido
- Pantalla de acceso diferenciada (ej. gesto o confirmación simple no accesible por error para un niño de 6 años, sin necesidad de autenticación compleja).
- Visualización del progreso por habilidad (reutilizando el modelo de 006) en formato comprensible para un adulto.
- Ajustes básicos: volumen, reinicio de progreso (con confirmación), ver destinos completados.
- Ninguna funcionalidad de este panel debe ser necesaria para que el niño juegue de forma autónoma.

## Alcance excluido
- Multi-perfil (ver 029; aquí se asume un único perfil).
- Analítica avanzada o exportación de datos (ver 049).
- Control de tiempo de pantalla con bloqueos duros (puede evaluarse como ampliación futura si se prioriza).

## Dependencias
- 006, 011.

## Criterios de aceptación de alto nivel
- Un adulto puede acceder al panel sin que sea trivialmente accesible por accidente durante el juego normal de un niño de 6 años.
- El panel muestra el progreso real por habilidad, coherente con el modelo de 006.
- El reinicio de progreso requiere confirmación explícita y no es accesible desde el flujo de juego principal.

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: el panel no debe interferir con la autonomía del niño en el flujo normal.
- **IV. Progresión por habilidades**: expone el modelo de progreso de forma legible para adultos.

## Frase de entrada sugerida para /speckit-specify
"Quiero crear un panel parental, separado del flujo de juego principal y no accesible accidentalmente por un niño, que muestre el progreso por habilidad y permita ajustes básicos (volumen, reinicio de progreso con confirmación), sin requerir autenticación compleja."
