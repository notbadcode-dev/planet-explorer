---
id: "057-teacher-classroom-mode"
name: "Modo aula para docentes"
phase: "Fase 8 — Herramientas y crecimiento a largo plazo"
depends_on: ["028-parental-dashboard", "029-multi-profile-support"]
---

# 057 — Modo aula para docentes (teacher-classroom-mode)

## Objetivo
Añadir un modo pensado para uso educativo grupal (aula), permitiendo a un docente gestionar varios perfiles de alumnos y ver progreso agregado por habilidad.

## Contexto / motivación
El proyecto es un "juego web educativo"; el uso en aula es un escenario natural de crecimiento de audiencia más allá del uso doméstico. Se apoya en el panel parental (028) y multi-perfil (029) ya existentes, extendiéndolos a un contexto de grupo más amplio.

## Alcance incluido
- Vista agregada de progreso por habilidad para un conjunto de perfiles (clase), reutilizando 006/028/029.
- Gestión simplificada de altas de perfiles de alumnos (posiblemente en lote) desde el panel docente.
- Consideraciones de privacidad reforzadas dado el contexto institucional (alineado con 030 de privacidad/seguridad base y 049 de analítica respetuosa con la privacidad).

## Alcance excluido
- Autenticación institucional compleja (SSO, roles múltiples) salvo que se justifique con un caso de uso real.
- Funcionalidad de comunicación docente-familia (fuera de alcance del juego en sí).

## Dependencias
- 028, 029.

## Criterios de aceptación de alto nivel
- Un docente puede ver el progreso agregado por habilidad de un conjunto de perfiles/alumnos.
- La gestión de perfiles de alumnos es más eficiente que crear perfiles uno a uno manualmente en el flujo doméstico.
- Se respetan los mismos principios de privacidad de menores que en el resto del producto.

## Alineación con la constitución
- **IV. Progresión por habilidades**: la vista agregada se apoya en el modelo de progreso ya existente sin duplicarlo.
- Consideración transversal de privacidad de menores en contexto institucional.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un modo aula que permita a un docente gestionar varios perfiles de alumnos y ver su progreso agregado por habilidad, reutilizando el panel parental y el soporte multi-perfil ya existentes, con consideraciones reforzadas de privacidad para el contexto institucional."
