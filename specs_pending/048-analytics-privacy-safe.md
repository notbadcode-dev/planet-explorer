---
id: "048-analytics-privacy-safe"
name: "Analítica de uso respetuosa con la privacidad"
phase: "Fase 7 — Calidad avanzada y escala"
depends_on: ["006-skill-progress-model", "027-parental-dashboard", "029-security-and-privacy-baseline"]
---

# 048 — Analítica de uso respetuosa con la privacidad (analytics-privacy-safe)

## Objetivo
Añadir analítica de uso agregada (qué destinos/retos se juegan más, dónde se atascan los jugadores) sin recopilar datos personales identificables de menores ni usarla con fines de retención manipulativa.

## Contexto / motivación
El principio I prohíbe mecánicas manipulativas de retención; cualquier analítica MUST NOT usarse para diseñar dichas mecánicas. Dado que el usuario principal es un niño, la privacidad es una restricción legal y ética crítica ya cubierta como línea base en 029 (security-and-privacy-baseline, Fase 4); este slice añade analítica de uso agregada respetando esa misma línea base, sin relajarla.

## Alcance incluido
- Eventos agregados y anonimizados (sin PII): destino/misión iniciada/completada, tipo de reto fallado repetidamente, uso de pistas.
- Panel simple de visualización agregada (puede integrarse en 027 o ser interno de desarrollo, a decidir en clarificaciones).
- Política explícita de qué NO se recopila (nombre, ubicación precisa, identificadores publicitarios).

## Alcance excluido
- Analítica de terceros con fines publicitarios (prohibido por el principio I, "sin publicidad").
- Perfilado individual del niño con fines comerciales.

## Dependencias
- 006 (fuente de datos de progreso), 027 (posible superficie de visualización), 029 (línea base de seguridad/privacidad ya auditada).

## Criterios de aceptación de alto nivel
- Los eventos recopilados son agregados/anonimizados y no permiten identificar a un menor concreto sin su perfil local.
- Existe documentación clara de qué se recopila y qué explícitamente no.
- Ningún dato analítico se usa para activar mecánicas de retención prohibidas por el principio I.

## Alineación con la constitución
- **I. Experiencia centrada en el niño**: la analítica no debe alimentar mecánicas manipulativas.
- Consideración transversal de privacidad de menores (ver también 029).

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir analítica de uso agregada y anonimizada (destinos/misiones jugadas, retos con más fallos, uso de pistas) sin recopilar datos personales identificables de menores, documentando explícitamente qué no se recopila y garantizando que no se use para mecánicas de retención manipulativas."
