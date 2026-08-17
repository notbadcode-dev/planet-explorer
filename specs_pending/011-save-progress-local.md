---
id: "011-save-progress-local"
name: "Persistencia local de progreso"
phase: "Fase 1 — Motor de juego base y primer destino jugable"
depends_on: ["006-skill-progress-model", "008-moon-destination-counting"]
---

# 011 — Persistencia local de progreso (save-progress-local)

## Objetivo
Persistir el progreso del jugador (dominio por habilidad, destinos completados) en almacenamiento local del navegador, de forma que se recupere al reabrir el juego.

## Contexto / motivación
Hasta ahora (006-010) el progreso vive solo en memoria durante la sesión. Sin persistencia, el resto de features de contenido (nuevos destinos, rejugabilidad) no pueden validarse de forma realista.

## Alcance incluido
- Capa de persistencia (`localStorage` u otro almacenamiento local del navegador) para el modelo de habilidades (006) y el estado de destinos completados.
- Serialización/deserialización versionada (para poder migrar el esquema en el futuro sin perder datos).
- Carga de progreso al iniciar el juego; guardado tras eventos relevantes (fin de reto, fin de destino).
- Manejo de ausencia de datos (primera sesión) sin errores.

## Alcance excluido
- Sincronización remota/multi-dispositivo (ver spec de backend futura, fuera de las 50 si no se prioriza).
- Múltiples perfiles (ver 029).
- Backend/API propia.- Nombre/identidad del jugador (ver 012, que extiende este mismo esquema de persistencia con el nombre y un punto de retorno de navegación).
## Dependencias
- 006-skill-progress-model, 008-moon-destination-counting.

## Criterios de aceptación de alto nivel
- Cerrar y volver a abrir el juego conserva el nivel de dominio por habilidad y los destinos completados.
- Un esquema de datos corrupto o ausente no rompe el arranque del juego (fallback seguro a estado inicial).
- La lógica de guardado/carga es testeable sin un navegador real (mock de storage).

## Alineación con la constitución
- **VI. Simplicidad primero**: `localStorage` como solución más simple antes de introducir backend (evitar infraestructura especulativa).
- **IV. Progresión adaptativa**: el progreso por habilidad debe sobrevivir entre sesiones para tener sentido real.

## Frase de entrada sugerida para /speckit-specify
"Quiero persistir el progreso del jugador (dominio por habilidad y destinos completados) en almacenamiento local del navegador, con un esquema versionado y carga/guardado testeables, sin introducir backend ni sincronización remota todavía."
