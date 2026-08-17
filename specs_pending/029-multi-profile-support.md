---
id: "029-multi-profile-support"
name: "Soporte multi-perfil"
phase: "Fase 3 — Estructura de contenido, recompensas, rejugabilidad y experiencia de entrada"
depends_on: ["006-skill-progress-model", "011-save-progress-local", "012-player-name-identity", "028-parental-dashboard"]
---

# 029 — Soporte multi-perfil (multi-profile-support)

## Objetivo
Permitir que varios niños (p. ej. hermanos) usen el juego en el mismo dispositivo, cada uno con su propio progreso por habilidad y destinos completados.

## Contexto / motivación
La persistencia actual (011) asume un único jugador, y 012 asume un único nombre guardado por dispositivo. Muchos hogares comparten dispositivo entre hermanos; sin perfiles, el progreso y el nombre de uno sobrescribirían o mezclarían los del otro. Este slice extiende la base de identidad ya construida en 012 (nombre + punto de retorno) para que existan varios, seleccionables visualmente, en vez de rediseñarla desde cero.

## Alcance incluido
- Selección de perfil simple y visual (avatares/iconos, nombre ya introducido en 012 por cada perfil, sin texto complejo adicional) al iniciar el juego, apropiada para que un niño de 6 años identifique el suyo.
- Extensión del esquema de persistencia (011, 012) para almacenar progreso y nombre independientes por perfil.
- Extensión del panel parental (028) para gestionar/crear/eliminar perfiles.

## Alcance excluido
- Sincronización remota entre dispositivos (fuera de alcance salvo spec de backend futura).
- Autenticación con contraseña por perfil (innecesaria para la edad objetivo).

## Dependencias
- 006, 011, 012, 028.

## Criterios de aceptación de alto nivel
- Dos perfiles distintos pueden jugar en el mismo dispositivo sin mezclar su progreso por habilidad.
- La selección de perfil es visual y utilizable de forma autónoma por un niño de 6 años.
- La creación/eliminación de perfiles se gestiona desde el panel parental, no desde el flujo de juego principal.

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: selección de perfil simple, visual, sin texto complejo.
- **IV. Progresión por habilidades**: cada perfil mantiene su propio progreso independiente.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir soporte multi-perfil para que varios niños puedan usar el juego en el mismo dispositivo con progreso independiente por habilidad, con una selección de perfil visual y simple, y gestión de perfiles desde el panel parental."
