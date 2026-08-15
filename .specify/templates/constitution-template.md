---

title: "Explorador Espacial Constitution"
project: "Explorador Espacial"
type: "constitution"
version: "1.0.0"
ratified: "2026-08-15"
updated: "2026-08-15"
status: "Active"
tags: [architecture, quality, testing, accessibility, performance, documentation, workflow, simplicity, maintainability, education, astronomy]
----------------------------------------------------------------------------------------------------------------------------------------------

# Constitución de Explorador Espacial

## Propósito y alcance

**Explorador Espacial** es un juego web educativo dirigido inicialmente a niños de aproximadamente 6 años, diseñado para crecer progresivamente en dificultad y contenido sin quedar limitado a esa edad.

El jugador asume el papel de comandante de una misión de exploración espacial acompañado por **BOT-6**, un robot ficticio. El juego combina exploración espacial, astronomía real adaptada a la edad, matemáticas, lectura y lenguaje, memoria, lógica, reconocimiento de patrones, orientación espacial y resolución de problemas.

La experiencia MUST sentirse primero como una **aventura espacial** y no como una colección de ejercicios escolares.

Esta constitución se aplica a:

* Especificaciones funcionales.
* Planes de implementación.
* Investigación y decisiones técnicas.
* Modelos de datos y contratos.
* Listas de tareas.
* Checklists.
* Código fuente.
* Pruebas.
* Documentación.
* Procesos de revisión, integración y despliegue.

Esta constitución MUST contener únicamente reglas estables y transversales. MUST NOT fijar detalles propios de una feature concreta, como el número exacto de sistemas planetarios, destinos, expediciones, misiones, retos, habilidades disponibles, recompensas, fórmulas de dificultad o reglas de desbloqueo. Estos detalles MUST definirse en `spec.md` y `plan.md`.

## Terminología normativa

Los términos normativos se interpretan de la siguiente forma:

* **MUST**: regla obligatoria. No puede incumplirse salvo mediante una excepción explícitamente permitida por esta constitución.
* **MUST NOT**: prohibición obligatoria.
* **SHOULD**: regla recomendada. Puede desviarse únicamente cuando exista una razón concreta y documentada.
* **SHOULD NOT**: comportamiento desaconsejado que requiere justificación si se adopta.
* **MAY**: comportamiento opcional.

Estas palabras MUST utilizarse de forma consistente cuando ayuden a distinguir reglas obligatorias de recomendaciones.

## Principios fundamentales

### I. Experiencia centrada en el niño (NON-NEGOTIABLE)

* El usuario inicial es un niño de aproximadamente 6 años.
* Toda decisión funcional, visual o técnica MUST priorizar simplicidad, comprensión inmediata, autonomía, interacción táctil, diversión y feedback claro.
* El juego MUST poder utilizarse sin ayuda constante de un adulto durante el flujo normal.
* Las zonas interactivas MUST ser grandes y apropiadas para uso táctil infantil.
* El texto MUST minimizarse y utilizar frases cortas y vocabulario apropiado cuando sea necesario.
* La experiencia SHOULD favorecer imágenes, animaciones, audio e interacción directa frente a instrucciones extensas.
* La navegación MUST ser sencilla, predecible y poco profunda.
* Toda interacción relevante MUST proporcionar feedback inmediato.
* Las respuestas incorrectas MUST poder reintentarse y MUST NOT provocar penalizaciones frustrantes.
* El juego MUST NOT utilizar publicidad, compras, FOMO, rachas obligatorias, pérdida de progreso por inactividad ni otras mecánicas manipulativas.

**Motivo**: la experiencia debe ser comprensible, segura y motivadora para el usuario principal sin depender de supervisión constante.

---

### II. Juego antes que ejercicio

* Los contenidos educativos MUST integrarse dentro de situaciones propias de una aventura espacial.
* El juego SHOULD evitar presentar ejercicios como fichas escolares cuando exista una alternativa jugable razonable.
* Los retos SHOULD favorecer interacción directa mediante selección, drag and drop, ordenación, emparejamiento, conteo, movimiento, construcción o exploración.
* La mecánica educativa y la ficción del juego SHOULD reforzarse mutuamente.
* Los destinos MUST representar lugares que explorar y MUST NOT convertirse en simples categorías escolares.
* Un mismo destino MAY contener actividades de distintas habilidades o materias.

**Motivo**: el aprendizaje debe surgir del propio juego y no percibirse como una capa escolar añadida artificialmente.

---

### III. Astronomía real y separación entre realidad y ficción (NON-NEGOTIABLE)

* El universo explorable MUST basarse, siempre que sea posible, en lugares y objetos astronómicos reales.
* MAY utilizar el Sistema Solar, planetas, planetas enanos, lunas, asteroides, estrellas, sistemas planetarios, exoplanetas, nebulosas, galaxias y otros objetos astronómicos conocidos.
* Los nombres, relaciones y características astronómicas reales MUST NOT alterarse para adaptarlos a la ficción del juego.
* Los datos científicos presentados al jugador MUST basarse en conocimiento astronómico fiable.
* Los datos MAY simplificarse para adaptarlos a la edad, pero la simplificación MUST NOT convertir una afirmación correcta en falsa.
* Los datos inciertos MUST NOT presentarse como hechos confirmados.
* Los elementos ficticios como BOT-6, misiones, cristales, robots, criaturas, artefactos o bases MAY utilizar lugares reales como contexto, pero MUST distinguirse razonablemente de los hechos científicos.

**Motivo**: el juego debe despertar interés por la astronomía sin enseñar información incorrecta ni confundir ficción con conocimiento científico.

---

### IV. Progresión adaptativa, por habilidades y rejugable

* La dificultad MUST NOT estar directamente asociada a un planeta, destino o sistema planetario.
* Los destinos representan lugares de exploración, no niveles de dificultad.
* El progreso educativo MUST poder mantenerse independientemente por habilidad o competencia.
* Un jugador MAY tener niveles de dominio diferentes en distintas habilidades.
* La dificultad SHOULD adaptarse progresivamente al rendimiento reciente del jugador.
* La adaptación MAY considerar respuestas correctas, respuestas incorrectas, número de intentos, uso de pistas, dominio previo y dificultad reciente.
* La velocidad de respuesta MUST NOT utilizarse como criterio principal para aumentar o reducir dificultad.
* Una reducción interna de dificultad MUST NOT mostrarse al niño como fracaso o pérdida de nivel.
* La arquitectura MUST NOT establecer un límite artificialmente bajo de dificultad y MUST permitir incorporar contenido educativo más avanzado mediante futuras especificaciones.
* Cada destino MUST poder contener múltiples expediciones y cada expedición múltiples misiones.
* Cada misión MUST poder combinar varios retos o minijuegos.
* El jugador MUST poder volver a destinos ya explorados.
* La repetición MUST NOT ser obligatoria para continuar la progresión principal.

Estructura conceptual recomendada:

```text
System
└── Destination
    └── Expedition
        └── Mission
            └── Challenge
```

**Motivo**: el juego debe tener recorrido a largo plazo sin convertir cada planeta en un nivel fijo ni agotar un destino tras una única actividad.

---

### V. Simplicidad primero

* La solución más simple que satisfaga correctamente los requisitos MUST ser la opción por defecto.
* La arquitectura MUST mantenerse intencionadamente sencilla.
* El código SHOULD ser explícito, comprensible y mantenible antes que altamente genérico.
* MUST evitarse CQRS, Clean Architecture aplicada sin necesidad, dependency injection frameworks, repository pattern sin necesidad real, microservicios, capas de servicios innecesarias y abstracciones prematuras.
* Una nueva abstracción SHOULD tener al menos dos casos de uso reales antes de introducirse.
* YAGNI MUST aplicarse a funcionalidades y necesidades especulativas.
* Una nueva dependencia MUST tener una justificación funcional o técnica concreta y actual.

**Motivo**: el proyecto es un juego pequeño y debe poder evolucionar rápidamente sin cargar con complejidad arquitectónica innecesaria.

---

### VI. Lógica desacoplada del renderizado y modularidad

* Las reglas del juego SHOULD mantenerse independientes de Phaser siempre que resulte razonable.
* La generación de retos, validación, dificultad, progreso, recompensas, desbloqueos y reglas de misión SHOULD poder probarse sin una `Phaser.Scene`.
* Las escenas de Phaser SHOULD concentrarse principalmente en presentación, input, animaciones, audio, transiciones y coordinación.
* Las características específicas de un destino SHOULD permanecer agrupadas y añadir un destino nuevo SHOULD NOT requerir modificar numerosos módulos no relacionados.
* La funcionalidad compartida SHOULD extraerse únicamente cuando exista reutilización real.
* La incorporación futura de un renderer distinto MUST NOT obligar a acoplar la lógica educativa a dicho renderer.

**Motivo**: separar reglas y presentación mejora testabilidad, mantenibilidad y capacidad de evolución del juego.

---

### VII. Desarrollo incremental y contenido dirigido por datos

* El juego MUST desarrollarse mediante pequeñas vertical slices funcionales.
* Una feature SHOULD aportar valor jugable verificable de extremo a extremo.
* Una funcionalidad futura MUST NOT implementarse antes de ser necesaria.
* El contenido educativo SHOULD ser data-driven cuando resulte práctico.
* Grandes cantidades de contenido MUST NOT quedar embebidas innecesariamente dentro de escenas.
* La generación procedural MUST estar limitada por reglas explícitas y testables.
* Nuevas expediciones, misiones y variantes SHOULD poder añadirse sin modificar contenido existente no relacionado.

**Motivo**: el proyecto debe poder crecer de forma segura y gradual, validando primero el bucle jugable antes de ampliar volumen de contenido.

## Restricciones globales

### Arquitectura y tecnología

* El stack base MUST utilizar TypeScript con `strict` mode, Phaser, Vite, HTML, CSS, Vitest, ESLint y Prettier.
* Phaser MUST ser el motor principal del juego para escenas, sprites, input, animaciones, audio, cámaras, partículas y gameplay cuando aporte valor.
* HTML y CSS MAY utilizarse cuando sean más simples o apropiados para una interfaz concreta.
* Angular, React y Vue MUST NOT incorporarse sin una necesidad concreta justificada mediante una futura especificación.
* Three.js MUST NOT formar parte del stack base.
* Three.js MAY incorporarse mediante una futura especificación cuando exista una necesidad explícita de 3D real que Phaser no resuelva adecuadamente, como planetas 3D interactivos, sistemas planetarios navegables, modelos tridimensionales o vistas orbitales.
* Three.js MUST NOT introducirse únicamente con fines decorativos.
* La introducción de Three.js MUST mantener desacoplada la lógica educativa y MUST evitar duplicar responsabilidades innecesariamente con Phaser.
* El proyecto MUST mantenerse compatible con hosting estático.
* GitHub Actions MUST utilizarse para CI/CD y GitHub Pages MUST ser el destino inicial de producción.

### Seguridad

* La primera versión MUST NOT requerir cuentas, registro ni login.
* El proyecto MUST NOT incluir publicidad, compras dentro de la aplicación, trackers, analytics de terceros ni mecanismos de monetización.
* MUST minimizarse cualquier tratamiento de datos personales.
* Una integración externa MUST tener una necesidad explícita y MUST evaluarse desde el punto de vista de privacidad y seguridad antes de incorporarse.

### Rendimiento

* El juego MUST funcionar correctamente en tablets, teléfonos móviles y ordenadores de escritorio.
* La tablet será inicialmente el dispositivo prioritario.
* El gameplay normal SHOULD mantenerse fluido en dispositivos objetivo razonables.
* Los assets MUST optimizarse.
* MUST evitarse imágenes innecesariamente grandes, dependencias pesadas sin necesidad, cargas iniciales excesivas y creación evitable de objetos dentro del game loop.
* La optimización prematura MUST NOT introducir complejidad injustificada.

### Accesibilidad

* Toda interacción principal MUST funcionar mediante pantalla táctil y también mediante ratón cuando aplique.
* Las interacciones esenciales MUST NOT depender exclusivamente de hover, teclado, click derecho o alta precisión del puntero.
* El juego MUST NOT depender exclusivamente del color para comunicar información importante.
* El audio MUST NOT ser obligatorio para completar un reto.
* Los sonidos MUST poder desactivarse.
* Las animaciones SHOULD evitar movimientos innecesariamente agresivos o molestos.
* `prefers-reduced-motion` SHOULD respetarse cuando sea razonable.

### Datos y persistencia

* El progreso del jugador MUST almacenarse inicialmente de forma local en el dispositivo.
* `localStorage` SHOULD ser la solución inicial mientras satisfaga los requisitos de la feature.
* El modelo de progreso MUST poder representar dominio independiente por habilidad.
* Las habilidades concretas disponibles en cada versión MUST definirse en la especificación correspondiente.
* Backend, sincronización cloud o perfiles online MUST NOT introducirse sin una especificación explícita que los requiera.

### Documentación

* El contenido documental MUST redactarse en castellano.
* Esta regla aplica a requisitos, historias de usuario, criterios de aceptación, aclaraciones, decisiones, análisis, planes, tareas, checklists y documentación funcional o técnica.
* Los nombres de ficheros y carpetas MUST mantenerse en inglés.
* Los nombres de clases, funciones, métodos, variables, constantes, interfaces, tipos, enums, módulos, tests, APIs, endpoints, eventos, comandos, campos y demás identificadores técnicos MUST mantenerse en inglés.
* El código fuente MUST escribirse en inglés.
* El contenido visible para el jugador MUST escribirse inicialmente en castellano.
* Los comentarios de código SHOULD evitarse cuando el código sea autoexplicativo; cuando sean necesarios MAY escribirse en castellano.
* Los commits SHOULD escribirse en inglés y SHOULD seguir Conventional Commits.
* Los términos técnicos estándar MAY mantenerse en inglés cuando su traducción resulte artificial o menos precisa.

#### Contratos

* Los artefactos generados dentro de `contracts/` MUST crearse automáticamente a partir de `spec.md`, `plan.md`, `research.md` y `data-model.md` cuando la funcionalidad introduzca o modifique contratos.
* `contracts/` MUST NOT generarse cuando la funcionalidad no introduzca ni modifique contratos.
* Los contratos MUST utilizar el formato más apropiado para su naturaleza, como OpenAPI, AsyncAPI, GraphQL SDL o Markdown estructurado.
* Los contratos MUST NOT forzarse a utilizar una única plantilla universal.
* Todo contrato basado en Markdown MUST incluir front matter YAML coherente con el resto de artefactos Markdown del proyecto, utilizando el mismo formato y situado al inicio del fichero.
* El contenido documental, títulos, descripciones, explicaciones y comentarios de los contratos MUST redactarse en castellano.
* Los nombres de ficheros, rutas, identificadores, propiedades, campos, endpoints, eventos, comandos, tipos y demás elementos técnicos de los contratos MUST mantenerse en inglés.
* Todo contrato MUST tener una estructura clara, consistente y fácilmente navegable.
* Cuando el formato permita títulos o secciones documentales, MUST utilizarse una jerarquía explícita de encabezados o secciones.
* Todo contrato SHOULD incluir trazabilidad con los requisitos `FR-xxx`, historias `USx` o decisiones `R-xxx` relevantes cuando aporte valor real.
* `contracts/` MUST contener únicamente contratos realmente necesarios para la funcionalidad.

## Estándares de especificación

* Los requisitos funcionales de `spec.md` MUST seguir EARS cuando sea aplicable.
* Los escenarios de aceptación de `spec.md` MUST utilizar Gherkin mediante `Given / When / Then`.
* Cada requisito funcional MUST tener un identificador estable `FR-xxx`.
* Cada criterio de éxito MUST tener un identificador estable `SC-xxx`.
* Los requisitos MUST describir qué debe hacer el sistema y MUST NOT introducir detalles de implementación salvo que sean una restricción explícita.
* Los escenarios de aceptación MUST describir comportamiento observable.
* Los criterios de éxito MUST ser medibles y verificables.
* Las incertidumbres que puedan cambiar materialmente el alcance MUST marcarse como `NEEDS CLARIFICATION`.
* La información astronómica que forme parte de una feature MUST identificarse como dato real o ficción cuando exista riesgo razonable de confusión.
* Las especificaciones MUST NOT fijar la dificultad de un destino como una propiedad intrínseca de ese destino.

## Trazabilidad

* Cada historia de usuario SHOULD poder relacionarse con los requisitos que implementa.
* Cada `FR-xxx` MUST estar cubierto por al menos una tarea de implementación cuando se genere `tasks.md`.
* Las tareas SHOULD utilizar referencias `[USx]` y `[FR-xxx]` cuando aporten trazabilidad útil.
* Los escenarios de aceptación MUST poder validarse mediante la implementación y estrategia de pruebas.
* Los contratos y cambios de modelo de datos MUST poder relacionarse con requisitos o decisiones técnicas cuando sean relevantes.
* Las decisiones técnicas relevantes MAY utilizar identificadores `R-xxx` para mantener trazabilidad cuando aporte valor.
* MUST NOT crearse referencias artificiales únicamente para completar matrices de trazabilidad.

## Calidad y testing

* La lógica crítica del juego MUST tener pruebas automatizadas.
* La generación y validación de retos, progresión, dificultad adaptativa, recompensas, persistencia y reglas de desbloqueo MUST probarse cuando formen parte de una feature.
* Las condiciones límite MUST probarse cuando existan rangos o transiciones relevantes.
* Boundary Value Analysis MUST utilizarse cuando existan límites numéricos significativos.
* Los tests MUST validar comportamiento antes que detalles internos de implementación.
* Los tests SHOULD permanecer desacoplados del renderer cuando prueben reglas de dominio o educativas.
* El coverage MAY utilizarse como indicador, pero MUST NOT sustituir pruebas de comportamiento ni utilizarse como objetivo aislado de calidad.
* Lint, tests y build MUST pasar antes de desplegar.

## Quality Gates

### Gate de especificación

Antes de aprobar `spec.md`:

* [ ] No existen `NEEDS CLARIFICATION` bloqueantes.
* [ ] Las historias P1 definen un incremento funcional verificable.
* [ ] Los requisitos funcionales relevantes siguen EARS.
* [ ] Los escenarios de aceptación relevantes siguen Gherkin.
* [ ] Los requisitos son atómicos, no ambiguos y verificables.
* [ ] Los criterios de éxito son medibles.
* [ ] Los casos límite críticos están contemplados.
* [ ] La experiencia propuesta respeta el principio de juego antes que ejercicio.
* [ ] Los datos astronómicos y la ficción están claramente diferenciados cuando aplique.

### Gate previo al diseño

Antes de iniciar la Fase 0 / Fase 1 de `plan.md`:

* [ ] La funcionalidad cumple todos los principios `NON-NEGOTIABLE`.
* [ ] Las desviaciones respecto a principios `SHOULD` están justificadas.
* [ ] No se introduce complejidad sin necesidad demostrable.
* [ ] Las restricciones globales aplicables están identificadas.
* [ ] La feature no implementa anticipadamente funcionalidad fuera de su alcance.

### Gate posterior al diseño

Después de completar el diseño:

* [ ] Las decisiones técnicas respetan esta constitución.
* [ ] La estructura propuesta es coherente con la arquitectura del proyecto.
* [ ] Los contratos y modelo de datos respetan las restricciones establecidas.
* [ ] Si existen contratos, `contracts/` contiene únicamente los necesarios y utiliza el formato apropiado para cada uno.
* [ ] Los contratos Markdown incluyen front matter y estructura documental clara.
* [ ] La estrategia de pruebas cubre los riesgos y comportamientos críticos.
* [ ] La lógica educativa permanece razonablemente desacoplada del renderizado.
* [ ] Las violaciones justificadas están registradas en `Complexity Tracking`.

### Gate previo a implementación

Antes de ejecutar `tasks.md`:

* [ ] Todos los `FR-xxx` implementables están cubiertos por tareas.
* [ ] Las dependencias entre tareas son explícitas cuando sea necesario.
* [ ] Las historias pueden implementarse de forma independiente cuando el dominio lo permita.
* [ ] Las tareas de prueba requeridas están incluidas.
* [ ] No existen tareas sin origen justificable en `spec.md`, `plan.md` o esta constitución.
* [ ] Las tareas relacionadas con contratos identifican claramente qué contratos se crean o modifican.

### Gate de finalización

Antes de considerar una funcionalidad completada:

* [ ] Todos los requisitos incluidos en el alcance están satisfechos.
* [ ] Todos los escenarios de aceptación incluidos en el alcance pueden validarse.
* [ ] Las pruebas obligatorias pasan.
* [ ] Lint y build pasan sin errores.
* [ ] No existen violaciones constitucionales sin resolver.
* [ ] La documentación afectada está actualizada.
* [ ] Los contratos afectados están actualizados y mantienen trazabilidad cuando aplique.
* [ ] Los criterios de éxito verificables en esta fase se cumplen o tienen un mecanismo definido de medición.

## Flujo de desarrollo

1. `constitution.md` establece las reglas globales.
2. `spec.md` define qué debe hacer la funcionalidad.
3. `research.md` resuelve incertidumbres técnicas o científicas cuando sea necesario.
4. `plan.md` define cómo se implementará.
5. `data-model.md` y `contracts/` detallan el diseño cuando apliquen.
6. `tasks.md` transforma el diseño en unidades ejecutables.
7. `checklist.md` valida aspectos específicos cuando sea necesario.
8. La implementación ejecuta las tareas respetando dependencias y gates.
9. La validación final comprueba requisitos, escenarios, pruebas, documentación, contratos y constitución.

Las features SHOULD desarrollarse como vertical slices y MUST NOT intentar implementar todo el universo del juego en una única especificación.

## Gestión de complejidad

* La solución más simple que satisfaga los requisitos SHOULD ser la opción por defecto.
* La complejidad adicional MUST resolver un problema concreto y actual.
* Las alternativas más simples MUST evaluarse antes de introducir una desviación significativa.
* Las nuevas dependencias, patrones, capas, servicios, renderers o sistemas de persistencia MUST tener justificación concreta.
* Las violaciones constitucionales necesarias MUST documentarse en `Complexity Tracking` de `plan.md`.
* Una justificación basada únicamente en posibles necesidades futuras no es suficiente.
* Preparar puntos de extensión MAY ser válido cuando no añada complejidad material, pero implementar anticipadamente la funcionalidad asociada MUST NOT hacerse.

## Excepciones

Una excepción a una regla obligatoria solo MAY aceptarse cuando:

1. La regla no esté marcada como `NON-NEGOTIABLE`.
2. Exista una necesidad técnica o funcional concreta.
3. La alternativa conforme a la constitución haya sido evaluada.
4. El impacto y riesgo estén documentados.
5. La excepción quede registrada en `plan.md`.
6. La excepción sea aprobada mediante el proceso de revisión definido por el proyecto.

Las excepciones temporales MUST incluir una condición o mecanismo para su eliminación cuando corresponda.

## Precedencia documental

El orden de precedencia es:

1. `constitution.md`
2. `spec.md`
3. `plan.md`
4. `data-model.md` / `contracts/`
5. `tasks.md`
6. `checklist.md`
7. Código y documentación auxiliar

Si dos artefactos entran en conflicto:

* El artefacto de menor precedencia MUST corregirse.
* Si el artefacto de mayor precedencia está desactualizado, MUST modificarse primero mediante su proceso correspondiente.
* Una implementación MUST NOT resolver silenciosamente una contradicción documental.

## Gobierno

* Esta constitución prevalece sobre cualquier otro documento o práctica del proyecto.
* Todas las especificaciones, planes, tareas, pruebas, contratos e implementaciones MUST cumplirla.
* Todo `Constitution Check` MUST utilizar la versión activa de este fichero.
* Una violación MUST resolverse o justificarse formalmente antes de continuar cuando afecte a un gate.
* Las revisiones de código SHOULD comprobar las reglas constitucionales aplicables.
* Una regla global recurrente SHOULD incorporarse a esta constitución en lugar de duplicarse en múltiples features.
* Las reglas específicas de una única funcionalidad MUST NOT incorporarse a esta constitución.

## Modificación y versionado

Toda modificación MUST:

1. Actualizar `version`.
2. Actualizar `updated`.
3. Mantener `ratified` como fecha de ratificación original.
4. Documentar cualquier impacto de migración cuando exista.
5. Revisar si las features activas quedan afectadas por el cambio.

### Reglas de versión

* **PATCH**: aclaración o corrección sin cambio normativo.
* **MINOR**: nueva regla compatible o ampliación normativa.
* **MAJOR**: cambio incompatible en principios, restricciones o gobierno.

## Revisión de cumplimiento

Una revisión de cumplimiento SHOULD comprobar:

* Principios fundamentales.
* Restricciones globales.
* Quality Gates aplicables.
* Trazabilidad de requisitos.
* Estrategia de pruebas.
* Complejidad introducida.
* Excepciones abiertas.
* Consistencia entre `spec.md`, `plan.md`, `data-model.md`, `contracts/` y `tasks.md`.
* Coherencia documental de los contratos generados.
* Vigencia de las reglas constitucionales.

---

**Versión**: 1.0.0
**Ratificada**: 2026-08-15
**Última modificación**: 2026-08-15
