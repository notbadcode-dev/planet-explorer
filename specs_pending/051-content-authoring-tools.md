---
id: "051-content-authoring-tools"
name: "Herramientas de autoría de contenido"
phase: "Fase 8 — Herramientas y crecimiento a largo plazo"
depends_on: ["045-data-driven-content-pipeline"]
---

# 051 — Herramientas de autoría de contenido (content-authoring-tools)

## Objetivo
Construir herramientas internas (CLI o editor simple) que permitan crear/editar destinos, expediciones, misiones y fichas astronómicas siguiendo el esquema data-driven (045) sin escribir código manualmente.

## Contexto / motivación
Con el esquema formalizado (045), el siguiente cuello de botella para escalar contenido es la facilidad de autoría. Reduce el riesgo de errores de esquema y acelera la creación de las specs de contenido restantes (052, 056, etc.).

## Alcance incluido
- Herramienta CLI o editor mínimo que genere/valide archivos de contenido según el esquema de 045.
- Validación integrada (reutilizando la del 045) con mensajes de error claros para quien autora contenido.
- Documentación de uso para quien no sea desarrollador del motor.

## Alcance excluido
- Editor visual WYSIWYG completo (un CLI o formulario simple puede bastar; evaluar en clarificaciones según el principio VI).
- Gestión de permisos/roles de autoría (un único equipo interno por ahora).

## Dependencias
- 045-data-driven-content-pipeline.

## Criterios de aceptación de alto nivel
- Se puede crear un nuevo destino/misión/ficha válido usando la herramienta sin tocar el código del motor.
- La herramienta valida el contenido contra el esquema antes de aceptarlo, con mensajes de error comprensibles.

## Alineación con la constitución
- **IX. Contenido dirigido por datos**: facilita la autoría de contenido data-driven.
- **VI. Simplicidad primero**: elegir la herramienta más simple que resuelva el problema real (CLI antes que editor visual complejo, si es suficiente).

## Frase de entrada sugerida para /speckit-specify
"Quiero construir una herramienta interna (CLI o formulario simple) que permita crear y validar destinos, expediciones, misiones y fichas astronómicas según el esquema data-driven ya definido, sin necesidad de escribir código ni tocar el motor del juego."
