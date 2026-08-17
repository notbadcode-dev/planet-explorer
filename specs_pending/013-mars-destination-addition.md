---
id: "013-mars-destination-addition"
name: "Destino: Marte con retos de suma"
phase: "Fase 2 — Catálogo de retos por materia, audio y segundo destino"
depends_on: ["008-moon-destination-counting", "011-save-progress-local"]
---

# 013 — Destino: Marte con retos de suma (mars-destination-addition)

## Objetivo
Añadir el segundo destino real y jugable (Marte) e implementar el tipo de reto `addition`, reutilizando el motor genérico y todo lo construido en la Fase 1.

## Contexto / motivación
Con el bucle base cerrado y persistente, este slice valida que añadir un nuevo destino + nuevo tipo de reto es incremental y no requiere tocar el motor central (principio IX). También amplía el mapa a dos destinos, permitiendo probar la navegación entre varios.

## Alcance incluido
- Nuevo tipo de reto `addition` (config data-driven: rango de operandos y resultado máximo, ver ejemplo `AdditionChallengeConfig` de la constitución).
- Escena de destino "Marte" con ambientación propia y situación narrativa distinta a la Luna.
- Integración con dificultad adaptativa (009), pistas/reintento (010) y persistencia (011).
- Selección de ambos destinos (Luna, Marte) desde el mapa.

## Alcance excluido
- Datos astronómicos reales de Marte (ver 023).
- Expediciones/misiones múltiples dentro de Marte (ver 021).
- Nuevos destinos adicionales (Júpiter, etc. — specs posteriores).

## Dependencias
- 008 (patrón de destino jugable), 011 (persistencia ya operativa).

## Criterios de aceptación de alto nivel
- El jugador puede elegir entre Luna y Marte desde el mapa.
- Marte presenta retos de `addition` integrados narrativamente, con dificultad adaptativa y pistas funcionando igual que en la Luna.
- Añadir este destino no requirió modificar el motor genérico de retos ni el modelo de habilidades de forma no compatible.

## Alineación con la constitución
- **VIII. Desarrollo incremental**: segundo vertical slice de contenido, reutilizando la base.
- **IX. Contenido dirigido por datos**: nuevo tipo de reto configurado por datos, no hardcodeado.
- **III. Astronomía real**: se reserva la introducción de datos reales de Marte para 023, evitando mezclar ficción y ciencia de forma apresurada.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir Marte como segundo destino jugable, con un nuevo tipo de reto 'addition' configurado de forma data-driven, reutilizando el motor de retos, la dificultad adaptativa, el sistema de pistas/reintento y la persistencia ya existentes."
