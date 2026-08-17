---
id: "032-legal-credits-attribution"
name: "Créditos y atribuciones legales"
phase: "Fase 4 — Gate de publicación estable (MVP)"
depends_on: ["004-core-game-loop", "023-astronomy-facts-module"]
---

# 032 — Créditos y atribuciones legales (legal-credits-attribution)

## Objetivo
Añadir una pantalla de créditos/acerca-de accesible desde el menú principal que atribuya correctamente todas las fuentes de terceros usadas en el juego (iconografía, tipografías, datos astronómicos, librerías con licencias que lo requieran), como requisito de publicación pública responsable.

## Contexto / motivación
El proyecto usa activos y datos de terceros (Phosphor Icons, tipografías, fuentes de datos astronómicos reales usadas en las fichas de 023, y potencialmente otras librerías con licencias que exigen atribución). Publicar el juego sin una pantalla de créditos incumple términos de licencia de esos recursos y es una omisión habitual que se detecta tarde; incluirla como parte del gate de publicación (Fase 4) evita ese riesgo antes del release.

## Alcance incluido
- Pantalla "Créditos" o "Acerca de", accesible desde el menú principal (no desde el flujo de juego infantil, similar en criterio de acceso a 028), con:
 - Atribución de Phosphor Icons y de cualquier otra librería de iconos/UI usada.
 - Atribución de tipografías usadas si su licencia lo requiere.
 - Mención de las fuentes de datos astronómicos reales usadas en las fichas educativas (023 y sucesivas), aclarando que los datos se presentan con fines educativos.
 - Número de versión del juego.
- Verificación de que las licencias de todas las dependencias de terceros usadas en producción (no solo devDependencies) son compatibles con la distribución pública del proyecto.
- Documentación en `docs/conventions/` del proceso a seguir para añadir la atribución correspondiente cada vez que se incorpore un nuevo recurso de terceros (icono, fuente, dataset).

## Alcance excluido
- Redacción de términos de servicio o política de privacidad legal formal (ver 030 para la postura de privacidad de producto; esto no sustituye asesoría legal si en el futuro se requiere formalmente).
- Localización de la pantalla de créditos a otros idiomas (ver 046, Fase 6, si aplica).

## Dependencias
- 004 (necesita un menú principal existente donde insertar el acceso), 023 (fuente de los datos astronómicos a atribuir).

## Criterios de aceptación de alto nivel
- Existe una pantalla de créditos accesible desde el menú principal que atribuye correctamente iconografía, tipografías y fuentes de datos astronómicos.
- Se ha verificado que ninguna dependencia de producción tiene una licencia incompatible con la distribución pública del proyecto.
- Existe documentación del proceso para añadir atribuciones futuras.

## Alineación con la constitución
- **VI. Simplicidad primero**: una única pantalla de créditos, sin sobre-diseño legal innecesario para el tamaño del proyecto.
- **III. Astronomía real**: transparencia sobre el origen de los datos astronómicos usados, reforzando la credibilidad del contenido educativo.

## Frase de entrada sugerida para /speckit-specify
"Quiero añadir una pantalla de créditos accesible desde el menú principal que atribuya correctamente los iconos, tipografías y fuentes de datos astronómicos de terceros usados en el juego, y verificar que las licencias de las dependencias de producción son compatibles con la publicación pública."
