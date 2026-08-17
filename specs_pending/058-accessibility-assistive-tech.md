---
id: "058-accessibility-assistive-tech"
name: "Accesibilidad avanzada (tecnologías de asistencia)"
phase: "Fase 8 — Herramientas y crecimiento a largo plazo"
depends_on: ["027-accessibility-child-ux"]
---

# 058 — Accesibilidad avanzada: tecnologías de asistencia (accessibility-assistive-tech)

## Objetivo
Extender la accesibilidad del juego más allá de la auditoría infantil general (027), añadiendo soporte para tecnologías de asistencia como lectores de pantalla, navegación por switch/conmutador y otros dispositivos adaptados.

## Contexto / motivación
La auditoría de 027 se centró en accesibilidad centrada en niños neurotípicos de ~6 años (zonas táctiles, texto mínimo). Este slice amplía el alcance a jugadores con necesidades específicas de accesibilidad, un aspecto no cubierto explícitamente por la constitución pero coherente con el principio I ("comprensión inmediata, autonomía, ausencia de frustración").

## Alcance incluido
- Soporte de navegación completa por switch/conmutador único o doble (escaneo de elementos interactivos).
- Compatibilidad razonable con lectores de pantalla para las partes de UI fuera de canvas (HUD, panel parental) usando los componentes accesibles ya construidos en `libs/components`.
- Alternativas no visuales/no auditivas para feedback crítico (p. ej. vibración en dispositivos táctiles si aplica).
- Documentación de qué niveles de soporte de accesibilidad se garantizan y cuáles quedan fuera de alcance por limitaciones técnicas de Phaser (canvas).

## Alcance excluido
- Soporte accesible completo dentro del canvas de Phaser si resulta técnicamente inviable sin coste desproporcionado (documentar la limitación en vez de forzar una solución compleja, principio VI).
- Traducción a lenguaje de signos u otros formatos multimedia alternativos (evaluar como spec futura si se prioriza).

## Dependencias
- 027 (base de accesibilidad infantil ya auditada).

## Criterios de aceptación de alto nivel
- Un usuario con un lector de pantalla puede operar el HUD y el panel parental de forma comprensible.
- Existe al menos un modo de navegación por switch/conmutador funcional en los flujos críticos.
- Las limitaciones técnicas reales (p. ej. dentro del canvas de Phaser) quedan documentadas de forma transparente en vez de omitidas silenciosamente.

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: extiende "comprensión inmediata" y "ausencia de frustración" a jugadores con necesidades de accesibilidad adicionales.
- **VI. Simplicidad primero**: documentar limitaciones técnicas reales en vez de forzar soluciones desproporcionadas.

## Frase de entrada sugerida para /speckit-specify
"Quiero extender la accesibilidad del juego para soportar tecnologías de asistencia (lectores de pantalla para el HUD y panel parental, navegación por switch/conmutador en los flujos críticos), documentando de forma transparente las limitaciones técnicas reales dentro del canvas de Phaser."
