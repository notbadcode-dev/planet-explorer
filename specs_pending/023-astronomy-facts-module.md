---
id: "023-astronomy-facts-module"
name: "Módulo de datos astronómicos reales"
phase: "Fase 3 — Estructura de contenido, recompensas, rejugabilidad y experiencia de entrada"
depends_on: ["005-bot6-narrative-shell", "021-expedition-mission-structure"]
---

# 023 — Módulo de datos astronómicos reales (astronomy-facts-module)

## Objetivo
Introducir un módulo de datos astronómicos reales y verificados (fichas de planetas/lunas) que se presente claramente separado de la narrativa ficticia, empezando por la Luna y Marte.

## Contexto / motivación
El principio III exige que los datos científicos sean fiables, no se modifiquen arbitrariamente y se distingan razonablemente de la ficción; también exige marcar los datos inciertos como tales. Hasta ahora (005-022) toda la ambientación de Luna/Marte ha sido narrativa; este slice añade la capa de "conocimiento real".

## Alcance incluido
- Estructura de datos de "ficha astronómica" por destino (dato, fuente/nivel de certeza, versión simplificada apta para ~6 años).
- Presentación visual claramente diferenciada de los diálogos de BOT-6 (p. ej. un panel "esto es real" reutilizando componentes de `libs/components`).
- Contenido inicial verificado para la Luna y Marte (según ejemplo de la constitución: "Marte tiene dos lunas: Fobos y Deimos").
- Revisión editorial explícita de que la simplificación no convierte una afirmación correcta en falsa.

## Alcance excluido
- Contenido astronómico de otros destinos (se añade junto a cada destino nuevo: 037, 038, 039-041, 052).
- Fuentes dinámicas/API externas de datos (dataset estático versionado basta por ahora, principio VI).

## Dependencias
- 005 (para contraste con narrativa), 021 (estructura de contenido donde insertar la ficha).

## Criterios de aceptación de alto nivel
- Cada destino con ficha astronómica muestra al menos un dato real verificado, visualmente distinguible de la narrativa ficticia.
- Ningún dato se presenta como hecho establecido si es incierto o no confirmado.
- El contenido es revisable/editable sin tocar código (data-driven).

## Alineación con la constitución
- **III. Astronomía real y separación entre realidad y ficción**: implementación central del principio.
- **IX. Contenido dirigido por datos**: fichas como datos, no texto embebido en escenas.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir un módulo de datos astronómicos reales y verificados (fichas por destino) para la Luna y Marte, presentado de forma claramente diferenciada de la narrativa de BOT-6, con contenido data-driven y revisión de que ninguna simplificación convierta un dato correcto en falso."
