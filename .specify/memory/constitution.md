---

title: "Explorador Espacial Constitution"
project: "Explorador Espacial"
type: "constitution"
version: "2.0.0"
ratified: "2026-08-15"
updated: "2026-08-19"
status: "Active"
tags:

* architecture
* quality
* testing
* security
* accessibility
* performance
* documentation
* workflow
* simplicity
* maintainability
* education
* astronomy
* components
* design
* typography

---

<!--
Sync Impact Report
Version change: 1.11.0 → 2.0.0 (MAJOR: redefinición retroactiva del modelo de
  ramas/release. Antes `master` MUST NOT recibir merges directos de features
  y solo se actualizaba mediante un proceso de release independiente
  (SemVer + tag manual). Ahora, dado el tamaño reducido del proyecto, cerrar
  una funcionalidad MUST fusionarla con `--no-ff` tanto en `develop` como en
  `master` en la misma operación: no existe ya un proceso de release
  independiente ni una ventana en la que `develop` vaya por delante de
  `master`. Es un cambio incompatible con la regla anterior, de ahí el bump
  MAJOR.)
Modified principles: "Control de ramas (Git)" (regla de `master` y de "feature
  finish"); "Estrategia de release" (sustituida por publicación continua sin
  proceso de release independiente).
Added sections: none
Removed sections: ninguna sección eliminada, pero "Estrategia de release" deja
  de exigir un proceso de release/tag independiente.
Templates requiring updates: `.github/skills/planet-git-flow/SKILL.md` y
  `.github/skills/planet-finish-spec/SKILL.md` actualizados en el mismo cambio
  para reflejar el merge directo a `master` y la eliminación del paso de
  release.
Follow-up TODOs: ninguno
-->

# Constitución de Explorador Espacial

## Propósito y alcance

**Explorador Espacial** es un juego web educativo dirigido inicialmente a niños de aproximadamente 6 años, diseñado para crecer progresivamente en dificultad y contenido sin quedar limitado a esa edad.

El jugador asume el papel de comandante de una misión de exploración espacial acompañado por **BOT-6**, un robot ficticio.

El juego combina:

* exploración espacial;
* astronomía real adaptada a la edad;
* matemáticas;
* lectura y lenguaje;
* memoria;
* lógica;
* reconocimiento de patrones;
* orientación espacial;
* resolución de problemas.

La experiencia MUST sentirse primero como una **aventura espacial** y no como una colección de ejercicios escolares.

Esta constitución se aplica a:

* especificaciones funcionales;
* planes de implementación;
* investigación y decisiones técnicas;
* modelos de datos;
* contratos;
* listas de tareas;
* checklists;
* código fuente;
* componentes compartidos;
* pruebas;
* documentación;
* procesos de revisión;
* integración continua;
* despliegue.

Esta constitución MUST contener únicamente reglas estables y transversales.

MUST NOT fijar detalles específicos de una única feature, como:

* número exacto de sistemas planetarios;
* número exacto de destinos;
* número exacto de expediciones;
* número exacto de misiones;
* número exacto de retos;
* habilidades disponibles en una versión concreta;
* recompensas específicas;
* algoritmos exactos de dificultad;
* reglas específicas de desbloqueo;
* contenido concreto de una misión.

Estos detalles MUST definirse en los artefactos correspondientes de cada feature, principalmente `spec.md` y `plan.md`.

---

## Terminología normativa

Los términos normativos se interpretan de la siguiente forma:

### MUST

Regla obligatoria.

No puede incumplirse salvo mediante una excepción explícitamente permitida por esta constitución.

### MUST NOT

Prohibición obligatoria.

### SHOULD

Regla recomendada.

Puede desviarse únicamente cuando exista una razón concreta y documentada.

### SHOULD NOT

Comportamiento desaconsejado que requiere justificación cuando se adopte.

### MAY

Comportamiento opcional.

Estas palabras MUST utilizarse de forma consistente cuando ayuden a distinguir reglas obligatorias de recomendaciones.

---

# Principios fundamentales

## I. Experiencia centrada en el niño (NON-NEGOTIABLE)

El usuario inicial es un niño de aproximadamente 6 años.

Toda decisión funcional, visual o técnica MUST priorizar:

* simplicidad;
* comprensión inmediata;
* autonomía;
* interacción táctil;
* diversión;
* feedback claro;
* ausencia de frustración innecesaria.

El juego MUST:

* poder utilizarse sin ayuda constante de un adulto durante el flujo normal;
* utilizar zonas interactivas grandes;
* minimizar la cantidad de texto;
* utilizar frases cortas y vocabulario apropiado cuando el texto sea necesario;
* favorecer imágenes, animaciones, audio e interacción directa;
* mantener una navegación sencilla y predecible;
* evitar menús innecesariamente profundos;
* proporcionar feedback inmediato después de interacciones relevantes;
* permitir repetir una acción después de un error;
* permitir volver a intentar respuestas incorrectas;
* evitar penalizaciones frustrantes.

Las respuestas incorrectas MUST tratarse como parte natural del aprendizaje.

El juego MUST NOT utilizar:

* publicidad;
* compras dentro de la aplicación;
* loot boxes;
* FOMO;
* rachas obligatorias;
* pérdida de progreso por no jugar;
* esperas artificiales;
* mecánicas manipulativas de retención.

**Motivo**: la experiencia debe ser comprensible, segura, autónoma y motivadora para el usuario principal.

---

## II. Juego antes que ejercicio

Los contenidos educativos MUST integrarse dentro de situaciones propias de una aventura espacial.

El juego SHOULD evitar presentar ejercicios como fichas escolares cuando exista una alternativa jugable razonable.

En lugar de una interacción puramente académica como:

> 5 + 3 = ?

SHOULD favorecerse una situación integrada en el juego, por ejemplo:

> BOT-6 necesita 8 muestras y ya ha encontrado 5. Ayúdale a recoger las que faltan.

Los retos SHOULD favorecer, cuando resulte apropiado:

* seleccionar;
* arrastrar;
* soltar;
* ordenar;
* emparejar;
* contar;
* mover;
* construir;
* clasificar;
* explorar;
* resolver rutas;
* manipular objetos visualmente.

La mecánica educativa y la ficción del juego SHOULD reforzarse mutuamente.

Los destinos MUST representar lugares que explorar y MUST NOT convertirse en simples categorías escolares.

Un mismo destino MAY contener retos de diferentes materias y habilidades.

**Motivo**: el aprendizaje debe surgir del propio juego y no percibirse como una capa escolar añadida artificialmente.

---

## III. Astronomía real y separación entre realidad y ficción (NON-NEGOTIABLE)

El universo explorable MUST basarse, siempre que sea posible, en lugares y objetos astronómicos reales.

MAY utilizar:

* el Sistema Solar;
* planetas;
* planetas enanos;
* lunas;
* asteroides;
* cometas;
* estrellas;
* sistemas planetarios;
* exoplanetas;
* nebulosas;
* galaxias;
* otros objetos astronómicos conocidos.

Los nombres, relaciones y características astronómicas reales MUST NOT modificarse arbitrariamente para adaptarlos al juego.

Los datos científicos presentados al jugador MUST basarse en conocimiento astronómico fiable.

Los datos MAY simplificarse para adaptarlos a la edad.

La simplificación MUST NOT convertir una afirmación correcta en una afirmación falsa.

Los datos inciertos o no confirmados MUST NOT presentarse como hechos establecidos.

El juego MAY incorporar elementos ficticios como:

* BOT-6;
* misiones;
* cristales;
* robots;
* criaturas;
* artefactos;
* bases espaciales;
* acontecimientos narrativos;
* recompensas.

Estos elementos MUST distinguirse razonablemente de la información científica real.

La ficción MAY utilizar lugares reales como contexto, pero MUST NOT alterar hechos científicos sin dejar claro su carácter ficticio.

Ejemplo válido:

**Dato real**

> Marte tiene dos lunas: Fobos y Deimos.

**Ficción**

> BOT-6 ha perdido tres baterías cerca de Fobos.

**Motivo**: el juego debe despertar interés por la astronomía sin enseñar información incorrecta ni confundir ficción con conocimiento científico.

---

## IV. Progresión adaptativa y por habilidades

La dificultad MUST NOT estar directamente asociada a:

* un planeta;
* un destino;
* una luna;
* un sistema planetario;
* una posición concreta dentro del mapa.

Los destinos representan lugares de exploración, no niveles de dificultad.

El progreso educativo MUST poder mantenerse independientemente por habilidad o competencia.

Ejemplos de habilidades que MAY existir:

```text
counting
addition
subtraction
multiplication
division
sequences
comparison
memory
logic
reading
problemSolving
spatialReasoning
astronomy
```

Las habilidades concretas implementadas MUST definirse en las especificaciones correspondientes.

Un jugador MAY tener niveles de dominio distintos en cada habilidad.

Ejemplo conceptual:

```text
Addition        7
Subtraction     5
Memory          8
Reading         4
Logic           6
```

La dificultad SHOULD adaptarse progresivamente al rendimiento del jugador.

La adaptación MAY considerar:

* respuestas correctas;
* respuestas incorrectas;
* número de intentos;
* utilización de pistas;
* dominio previo;
* dificultad de los retos recientes;
* rendimiento reciente en una habilidad concreta.

La velocidad de respuesta MUST NOT utilizarse como criterio principal para aumentar o reducir dificultad.

Una reducción interna de dificultad MUST NOT mostrarse al niño como:

* fracaso;
* penalización;
* pérdida de nivel.

La arquitectura MUST NOT establecer un límite artificialmente bajo de dificultad.

El sistema MUST poder incorporar en futuras especificaciones contenido educativo significativamente más avanzado sin rediseñar completamente el modelo de progreso.

El contenido inicial MUST ser accesible para un niño de aproximadamente 6 años.

La edad inicial MUST NOT convertirse en una limitación estructural del producto.

**Motivo**: el juego debe poder acompañar la evolución del jugador y adaptarse independientemente a sus distintas capacidades.

---

## V. Destinos, expediciones, misiones, retos y rejugabilidad

La estructura conceptual del contenido SHOULD seguir:

```text
System
└── Destination
    └── Expedition
        └── Mission
            └── Challenge
```

Un sistema MAY contener múltiples destinos.

Cada destino MUST poder contener múltiples expediciones.

Cada expedición MUST poder contener múltiples misiones.

Cada misión MUST poder combinar múltiples retos o minijuegos.

Un destino MUST NOT considerarse agotado después de completar una única actividad.

El jugador MUST poder volver a destinos previamente explorados.

Los destinos MUST ser rejugables.

Las misiones MAY variar mediante:

* contenido diferente;
* dificultad adaptada;
* diferentes combinaciones de retos;
* distintos objetivos;
* generación procedural controlada.

Los retos ofrecidos en destinos previamente completados MAY utilizar el nivel actual del jugador.

La repetición MUST NOT ser obligatoria para avanzar por la progresión principal salvo que una especificación lo justifique expresamente.

El juego MAY incentivar la rejugabilidad mediante:

* estrellas pendientes;
* nuevos descubrimientos;
* nuevos retos;
* mejores resultados;
* variantes;
* contenido adicional.

La rejugabilidad MUST NOT basarse en penalizar al jugador por no repetir contenido.

**Motivo**: los destinos deben sentirse como lugares vivos y explorables, y no como pantallas desechables de un único uso.

---

## VI. Simplicidad primero

La solución más simple que satisfaga correctamente los requisitos MUST ser la opción por defecto.

La arquitectura MUST mantenerse intencionadamente sencilla.

El código SHOULD priorizar:

1. claridad;
2. mantenibilidad;
3. testabilidad;
4. simplicidad;
5. extensibilidad necesaria.

Se MUST evitar introducir sin una necesidad real:

* CQRS;
* Clean Architecture;
* dependency injection frameworks;
* repository pattern;
* microservicios;
* capas adicionales;
* service layers innecesarios;
* abstracciones genéricas prematuras;
* frameworks adicionales;
* infraestructura especulativa.

YAGNI MUST aplicarse a necesidades futuras no demostradas.

Una nueva abstracción SHOULD disponer normalmente de al menos dos casos de uso reales antes de introducirse.

Una nueva dependencia MUST tener una justificación funcional o técnica concreta y actual.

La posibilidad de necesitar algo en el futuro MUST NOT utilizarse por sí sola como justificación.

**Motivo**: la complejidad debe resolver problemas reales, no anticipar problemas hipotéticos.

---

## VII. Separación entre lógica y renderizado

Las reglas educativas y de juego SHOULD mantenerse independientes del renderer cuando resulte razonable.

Esto incluye especialmente:

* generación de retos;
* validación de respuestas;
* progresión;
* dificultad;
* dificultad adaptativa;
* recompensas;
* desbloqueos;
* reglas de misión;
* dominio de habilidades.

Ejemplo:

```ts
const challenge = generateAdditionChallenge(config);

const result = validateAnswer(challenge, answer);
```

Este tipo de lógica SHOULD poder ejecutarse sin una `Phaser.Scene`.

Las escenas de Phaser SHOULD concentrarse principalmente en:

* presentación;
* input;
* animaciones;
* sprites;
* audio;
* efectos;
* cámaras;
* transiciones;
* coordinación.

La incorporación futura de otros renderers MUST NOT obligar a acoplar la lógica educativa a dichos renderers.

**Motivo**: separar reglas de presentación mejora testabilidad, mantenimiento y evolución.

---

## VIII. Desarrollo incremental y vertical slices

El juego MUST desarrollarse mediante pequeñas vertical slices funcionales.

Una feature SHOULD producir un incremento jugable verificable de extremo a extremo.

MUST NOT intentarse implementar todo el producto mediante una única especificación.

Ejemplo conceptual:

```text
001-core-game-loop
002-lunar-expeditions
003-memory-challenges
004-mars-exploration
005-ship-customization
006-trappist-1
```

Una funcionalidad futura MUST NOT implementarse antes de ser necesaria.

La arquitectura MAY permitir extensión futura siempre que hacerlo no introduzca complejidad material.

Preparar una extensión MUST NOT implicar implementar anticipadamente la funcionalidad futura.

**Motivo**: el desarrollo incremental reduce riesgo y permite validar el juego antes de aumentar el alcance.

---

## IX. Contenido dirigido por datos

El contenido educativo SHOULD ser data-driven cuando resulte práctico.

Grandes cantidades de contenido MUST NOT quedar embebidas innecesariamente dentro de escenas o componentes.

Las configuraciones SHOULD separar:

* contenido;
* dificultad;
* reglas;
* validación;
* representación.

Ejemplo:

```ts
interface AdditionChallengeConfig {
  minOperand: number;
  maxOperand: number;
  maxResult: number;
}
```

La generación procedural MUST estar limitada mediante reglas explícitas y testables.

Nuevas expediciones, misiones y variantes SHOULD poder añadirse sin modificar contenido existente no relacionado.

**Motivo**: el contenido dirigido por datos facilita ampliar el juego sin incrementar innecesariamente la complejidad del código.

---

# Restricciones globales

## Arquitectura y tecnología

El stack base MUST utilizar:

* TypeScript;
* Phaser;
* Vite;
* HTML;
* CSS;
* Vitest;
* ESLint;
* Prettier.

TypeScript MUST utilizar `strict` mode.

Phaser MUST ser el motor principal del juego cuando aporte valor para:

* escenas;
* sprites;
* input;
* animaciones;
* audio;
* cámaras;
* partículas;
* gameplay.

HTML y CSS MAY utilizarse cuando resulten más simples o apropiados que Phaser para una interfaz concreta.

Angular, React y Vue MUST NOT incorporarse sin una necesidad concreta aprobada mediante una especificación.

### Three.js

Three.js MUST NOT formar parte del stack tecnológico base.

Three.js MAY incorporarse en una futura especificación cuando exista una necesidad explícita de renderizado 3D real que Phaser no resuelva adecuadamente.

Ejemplos válidos:

* planetas 3D interactivos;
* sistemas planetarios navegables;
* modelos tridimensionales;
* vistas orbitales;
* visualización educativa 3D.

Three.js MUST NOT introducirse únicamente con fines decorativos.

Su introducción MUST:

* estar justificada por una funcionalidad concreta;
* mantener desacoplada la lógica educativa;
* evitar duplicar responsabilidades innecesariamente con Phaser;
* definir claramente la frontera entre ambos renderers.

Phaser MUST continuar siendo el motor principal salvo que una futura especificación establezca explícitamente otra decisión.

### Arquitectura del motor de juego

Aunque el código del motor de juego todavía no exista, su arquitectura MUST fijarse
por anticipado en los siguientes documentos de `docs/conventions/architecture/`, de
forma que ninguna spec de contenido o gameplay tenga que re-decidirla:

* [`docs/conventions/architecture/game-engine-scenes.md`](../../docs/conventions/architecture/game-engine-scenes.md) — layout de `src/game/` (lógica pura vs. escenas Phaser) y separación lógica/renderizado (principio VII).
* [`docs/conventions/architecture/content-model.md`](../../docs/conventions/architecture/content-model.md) — esquema conceptual `System > Destination > Expedition > Mission > Challenge` (principio V).
* [`docs/conventions/architecture/challenge-engine-contract.md`](../../docs/conventions/architecture/challenge-engine-contract.md) — contrato genérico de generación/validación de retos (principio IX).
* [`docs/conventions/architecture/progress-persistence-model.md`](../../docs/conventions/architecture/progress-persistence-model.md) — modelo de progreso por habilidad y persistencia local (principio IV).

Toda spec que implemente o modifique el motor de juego MUST seguir estas decisiones
salvo que una futura especificación justifique explícitamente un cambio, en cuyo
caso el documento correspondiente MUST actualizarse como parte de la misma feature.

---

## Componentes compartidos

Los componentes visuales reutilizables propios del proyecto SHOULD alojarse en:

```text
libs/components/
```

Antes de implementar cualquier componente visual, MUST comprobarse si existe un componente adecuado dentro de `libs/components/`.

Cuando exista un componente reutilizable que satisfaga la necesidad:

* MUST reutilizarse;
* MAY extenderse cuando resulte necesario;
* MUST NOT duplicarse su implementación dentro de una feature.

Antes de modificar o extender un componente compartido, MUST comprobarse que el cambio:

* mantiene su carácter reutilizable;
* no introduce lógica específica de una feature;
* no rompe usos existentes;
* mantiene una API coherente.

### Componente reutilizable inexistente

Cuando una funcionalidad requiera un componente que por su naturaleza SHOULD ser reutilizable y dicho componente no exista en `libs/components/`:

1. La ejecución MUST detenerse antes de implementar el nuevo componente.
2. El agente o proceso de implementación MUST informar explícitamente al usuario.
3. MUST indicarse como mínimo:

   * qué componente es necesario;
   * qué necesidad resuelve;
   * por qué no puede reutilizarse un componente existente;
   * por qué debe ser compartido y no específico de la feature;
   * cuál sería su responsabilidad;
   * cuál sería su API pública mínima propuesta;
   * dónde se propone alojarlo dentro de `libs/components/`.
4. El componente MUST NOT crearse automáticamente.
5. La implementación que dependa de dicho componente MUST NOT continuar hasta recibir aprobación explícita del usuario.

Una vez aprobado, el componente MAY crearse dentro de `libs/components/` y la ejecución MAY continuar.

### Componentes específicos de una feature

Cuando un componente sea específico de:

* un destino;
* una expedición;
* una misión;
* un reto;
* una pantalla;
* una feature concreta;

y no exista una necesidad transversal real de reutilización:

* SHOULD permanecer dentro de la feature correspondiente;
* MUST NOT promoverse automáticamente a `libs/components/`;
* MUST NOT provocar una parada de ejecución por el simple hecho de no existir en `libs/components/`.

Un componente MUST NOT trasladarse a `libs/components/` únicamente por una posible reutilización futura.

SHOULD existir:

* reutilización real;
* o una necesidad transversal clara.

### HTML fuera de un componente compartido

Antes de escribir HTML/markup nuevo fuera de `libs/components/` (directamente dentro de una feature, pantalla, escena o overlay), MUST valorarse si ese HTML debería ser en su lugar un componente de `libs/components/`.

Cuando dicho HTML vaya a ser genuinamente reutilizable:

* MAY crearse como componente nuevo dentro de `libs/components/`;
* MUST seguir exactamente las mismas convenciones que el resto de componentes (estructura, CSS co-localizado, patrones de API, tests, Storybook, interacción/accesibilidad — ver enlaces en "Responsabilidades" más abajo);
* MUST seguir el flujo de "Componente reutilizable inexistente" ya definido (detener, informar, esperar aprobación) antes de crearse.

Cuando el mismo fragmento de HTML ya exista duplicado en otro sitio del repositorio (misma estructura/markup repetida en más de una feature o pantalla):

* SHOULD extraerse como componente de `libs/components/` en lugar de mantener las copias divergentes, siguiendo el mismo flujo de aprobación anterior.

Cuando el HTML sea específico de una única pantalla/feature, no esté duplicado en ningún otro sitio y no exista una necesidad transversal real:

* MAY permanecer como HTML plano dentro de la feature;
* MUST NOT provocar una parada de ejecución únicamente por no ser ya un componente (coherente con "Componentes específicos de una feature").

### Responsabilidades

Los componentes de `libs/components/` MUST:

* ser independientes de una feature concreta;
* mantener una API pública clara;
* mantener una API pública pequeña;
* tener responsabilidades explícitas;
* evitar conocimiento del dominio específico de una misión o destino.

La lógica educativa, de progresión o de dominio MUST NOT incorporarse a componentes compartidos puramente visuales.

Las convenciones técnicas transversales que apliquen a `libs/components/` en su conjunto (no a una feature concreta) SHOULD documentarse en `docs/conventions/` en lugar de dentro de `contracts/` de una única feature. Las convenciones ya existentes son:

* [`docs/conventions/components/structure.md`](../../docs/conventions/components/structure.md) — estructura mínima obligatoria de todo componente.
* [`docs/conventions/components/css.md`](../../docs/conventions/components/css.md) — convención de CSS co-localizado por componente.
* [`docs/conventions/components/api-patterns.md`](../../docs/conventions/components/api-patterns.md) — patrones de API (factory, validación, callbacks, catálogos cerrados, composición).
* [`docs/conventions/components/testing.md`](../../docs/conventions/components/testing.md) — entorno de test y estrategia de selectores.
* [`docs/conventions/components/storybook.md`](../../docs/conventions/components/storybook.md) — nomenclatura de historias y cobertura de estados/variantes.
* [`docs/conventions/components/interaction-patterns.md`](../../docs/conventions/components/interaction-patterns.md) — accesibilidad por tipo de componente.
* [`docs/conventions/components/visual-rules.md`](../../docs/conventions/components/visual-rules.md) — estilos/tokens, iconografía, estabilidad de API y quality gates.

**Motivo**: se debe favorecer la reutilización real sin crear una librería de componentes genéricos prematuramente ni duplicar componentes ya existentes.

---

## Iconografía

Phosphor Icons MUST ser la librería principal para iconografía general de interfaz.

El estilo `duotone` SHOULD utilizarse preferentemente cuando encaje con el diseño visual del proyecto.

Antes de crear un icono general personalizado, MUST comprobarse si existe un icono adecuado en Phosphor Icons.

Cuando exista un icono de Phosphor Icons que represente correctamente la necesidad visual o funcional, MUST reutilizarse en lugar de crear una alternativa equivalente.

Un icono general personalizado MUST NOT crearse únicamente por preferencia estética si Phosphor Icons ya proporciona una alternativa adecuada, salvo que exista una necesidad visual o funcional explícitamente justificada.

### SVG personalizados

Los SVG personalizados MAY utilizarse para elementos específicos del universo y de la identidad visual del juego, incluyendo:

* planetas;
* planetas enanos;
* lunas;
* estrellas concretas;
* sistemas planetarios;
* exoplanetas;
* galaxias;
* nebulosas;
* cuerpos astronómicos;
* naves propias;
* BOT-6;
* criaturas;
* artefactos;
* otros elementos visuales propios del juego.

Los cuerpos astronómicos reales SHOULD utilizar SVG personalizados cuando un icono genérico no permita reconocer adecuadamente el objeto representado.

Por ejemplo, Marte, Júpiter o Saturno SHOULD representarse mediante assets específicos en lugar de utilizar el mismo icono genérico de planeta.

Todo SVG personalizado MUST cumplir la convención técnica y de organización de assets definida en [`docs/conventions/design-system/icon-assets.md`](../../docs/conventions/design-system/icon-assets.md) (checklist de requisitos técnicos, estructura de carpetas y nombrado).

### Separación entre iconos y componentes

La política de iconografía MUST respetar las reglas existentes de `libs/components/`.

* Los iconos y SVG son assets visuales y MUST NOT contener lógica de dominio.
* Un componente reutilizable que encapsule comportamiento alrededor de un icono SHOULD seguir las reglas de `libs/components/`.
* La creación de un nuevo SVG personalizado por sí sola MUST NOT implicar automáticamente la creación de un nuevo componente compartido.
* Si para utilizar el icono se necesita un nuevo componente reutilizable que no existe en `libs/components/`, MUST aplicarse el procedimiento constitucional existente de detener la ejecución e informar al usuario antes de crear dicho componente (ver **Componentes compartidos → Componente reutilizable inexistente**).

**Motivo**: mantener consistencia visual mediante una librería estándar, evitar duplicaciones innecesarias de iconos genéricos y reservar los SVG personalizados para representar de forma reconocible los elementos propios del universo del juego.

---

## Tipografía

El sistema tipográfico del proyecto MUST favorecer:

* legibilidad para niños;
* claridad en controles;
* jerarquía visual inmediata;
* una sensación espacial, moderna, amable y limpia;
* coherencia visual entre juego, navegación y componentes compartidos.

Las familias tipográficas base, el mapa de uso semántico y los tokens tipográficos concretos MUST definirse en [`docs/conventions/design-system/typography.md`](../../docs/conventions/design-system/typography.md).

Los componentes y pantallas SHOULD consumir tokens tipográficos semánticos definidos por el sistema global de estilos.

Cuando exista un token semántico adecuado, los componentes MUST NOT fijar directamente una familia tipográfica concreta.

Las fuentes utilizadas en producción MUST cargarse como assets locales o empaquetados por Vite.

La aplicación MUST NOT depender en runtime de Google Fonts, CDNs de fuentes u otros proveedores remotos para renderizar su tipografía principal.

La incorporación de una nueva familia tipográfica MUST requerir una necesidad visual, educativa o de accesibilidad concreta, documentada en la especificación o plan correspondiente.

Los pesos tipográficos SHOULD limitarse a los necesarios para la jerarquía definida.

**Motivo**: la tipografía es una regla transversal de identidad, legibilidad y accesibilidad. Debe ser consistente en todo el producto, sin convertir cada pantalla en una decisión visual aislada ni introducir dependencias remotas innecesarias.

---

## Modularidad

Las características específicas de cada dominio SHOULD mantenerse agrupadas.

El layout concreto de `src/game/` (separación entre lógica pura sin Phaser y
escenas, y dónde vive cada dominio: navegación, retos, contenido, progreso) MUST
NOT volver a decidirse aquí: ya está fijado por anticipado en
[`docs/conventions/architecture/game-engine-scenes.md`](../../docs/conventions/architecture/game-engine-scenes.md)
(ver también "Arquitectura del motor de juego" más arriba).

Añadir un nuevo destino SHOULD NOT requerir modificar numerosos módulos no relacionados.

La funcionalidad compartida SHOULD extraerse únicamente cuando exista reutilización real.

---

## Seguridad y privacidad

La primera versión MUST NOT requerir:

* cuentas de usuario;
* registro;
* login;
* perfiles online.

El proyecto MUST NOT incluir sin una especificación explícita:

* publicidad;
* compras;
* trackers;
* analytics de terceros;
* mecanismos de monetización;
* recopilación innecesaria de información personal.

Cualquier integración externa MUST tener una necesidad explícita.

Toda integración externa MUST evaluarse desde el punto de vista de:

* privacidad;
* seguridad;
* datos transmitidos;
* dependencia introducida.

El proyecto MUST minimizar cualquier tratamiento de datos personales.

---

## Rendimiento

El juego MUST funcionar correctamente en:

* tablets;
* teléfonos móviles;
* ordenadores de escritorio.

La tablet será inicialmente el dispositivo prioritario.

El gameplay normal SHOULD mantenerse fluido en dispositivos objetivo razonables.

Los assets MUST optimizarse.

Se MUST evitar:

* imágenes innecesariamente grandes;
* audio innecesariamente pesado;
* dependencias pesadas sin necesidad;
* cargas iniciales excesivas;
* creación evitable de objetos durante el game loop;
* procesamiento innecesario por frame.

La optimización prematura MUST NOT introducir complejidad injustificada.

---

## Accesibilidad

Toda interacción principal MUST funcionar mediante pantalla táctil.

El ratón también MUST estar soportado cuando aplique.

Las interacciones esenciales MUST NOT depender exclusivamente de:

* hover;
* teclado;
* click derecho;
* precisión elevada del puntero.

El juego MUST NOT depender exclusivamente del color para comunicar información importante.

El audio MUST NOT ser obligatorio para completar un reto.

Los sonidos MUST poder desactivarse.

Las animaciones SHOULD evitar movimientos innecesariamente agresivos o molestos.

Cuando resulte razonable, SHOULD respetarse:

```text
prefers-reduced-motion
```

---

## Datos y persistencia

El progreso MUST almacenarse inicialmente de forma local en el dispositivo.

`localStorage` SHOULD utilizarse como solución inicial mientras satisfaga correctamente los requisitos.

El modelo de progreso MUST poder representar:

* progreso general;
* destinos desbloqueados;
* misiones completadas;
* dominio independiente por habilidad;
* dificultad adaptativa necesaria;
* recompensas relevantes.

Las habilidades concretas MUST definirse en las especificaciones correspondientes.

Backend, sincronización cloud o perfiles online MUST NOT introducirse sin una especificación explícita.

---

## Documentación

El contenido documental MUST redactarse en castellano.

Esto incluye:

* requisitos;
* historias de usuario;
* criterios de aceptación;
* aclaraciones;
* decisiones;
* investigación;
* análisis;
* planes;
* tareas;
* checklists;
* documentación funcional;
* documentación técnica;
* explicaciones dentro de contratos.

Los nombres de ficheros MUST mantenerse en inglés.

Los nombres de carpetas MUST mantenerse en inglés.

Los elementos técnicos MUST mantenerse en inglés.

Esto incluye:

* clases;
* funciones;
* métodos;
* variables;
* constantes;
* interfaces;
* tipos;
* enums;
* módulos;
* tests;
* APIs;
* endpoints;
* propiedades;
* campos;
* eventos;
* comandos;
* identificadores.

El código fuente MUST escribirse en inglés.

Ejemplo correcto:

```ts
class GalaxyScene {}

interface PlayerProgress {}

function generateChallenge() {}

function validateAnswer() {}
```

El contenido visible para el jugador MUST escribirse inicialmente en castellano.

Ejemplo:

```ts
const playLabel = 'Jugar';
const missionComplete = '¡Misión completada!';
```

Los comentarios de código SHOULD evitarse cuando el código sea autoexplicativo.

Cuando un comentario sea necesario, MAY escribirse en castellano.

Los commits SHOULD escribirse en inglés.

Los commits SHOULD seguir Conventional Commits.

Ejemplos:

```text
feat: add Mars exploration mission
test: cover addition challenge boundaries
fix: persist unlocked destinations
refactor: extract shared progress component
```

Los términos técnicos ampliamente aceptados MAY mantenerse en inglés cuando su traducción resulte artificial o menos precisa.

---

## Control de ramas (Git)

El proyecto MUST seguir un modelo de ramas estilo git-flow simplificado: `develop` (integración), `master` (estable/release), ramas de feature `###-feature-name` y ramas `hotfix/*`.

`develop` MUST ser la rama base para toda nueva funcionalidad. La detección de la rama base para crear una rama de feature MUST priorizar `develop` cuando exista localmente, antes que `origin/HEAD`, `main` o `master`.

`master` MUST representar el estado estable/publicado del proyecto. Dado el tamaño reducido del proyecto, `master` MUST recibir el mismo merge `--no-ff` que `develop` al cerrar cada funcionalidad: no existe un proceso de release independiente ni una ventana en la que `develop` vaya por delante de `master`.

Cerrar una funcionalidad ("feature finish") MUST consistir en fusionar su rama con `--no-ff` tanto en `develop` como en `master` (para preservar el historial de la funcionalidad y mantener ambas ramas sincronizadas) y, tras la fusión, MUST eliminarse la rama de feature (local y remota).

Las ramas `hotfix/*` MUST partir de `master` para corregir un problema urgente ya publicado, y MUST fusionarse de vuelta tanto en `master` como en `develop`.

Una rama de feature nueva MUST NOT crearse partiendo de otra rama de feature, salvo que la nueva funcionalidad esté explícitamente relacionada con la spec de la rama actual (ver **Componentes compartidos** y el procedimiento del hook de creación de ramas).

**Motivo**: mantener `master` siempre desplegable y sincronizado con `develop`, evitando la sobrecarga de un proceso de release independiente en un proyecto de este tamaño, y disponer de una vía rápida y aislada (`hotfix/*`) para corregir producción sin mezclar trabajo en curso de otras funcionalidades.

---

## Estrategia de release

El proyecto MUST NOT mantener un proceso de release independiente: cada funcionalidad cerrada ("feature finish") se publica de inmediato en `master` mediante el mismo merge `--no-ff` que la integra en `develop` (ver **Control de ramas (Git)**), sin necesidad de decidir ni confirmar si se "corta" una release.

El campo `version` de `package.json` y los tags de Git (`vX.Y.Z`) MAY actualizarse puntualmente cuando se considere oportuno marcar un hito, pero no son un requisito para publicar cambios en `master`.

Cada push a `master` MUST disparar el despliegue automático a GitHub Pages mediante el pipeline de CI, de forma que `master` refleje siempre lo publicado.

---

## Contratos

Los artefactos dentro de `contracts/` MUST generarse automáticamente cuando una funcionalidad introduzca o modifique contratos.

La generación MUST partir de los artefactos relevantes existentes, incluyendo cuando apliquen:

* `spec.md`;
* `plan.md`;
* `research.md`;
* `data-model.md`.

`contracts/` MUST NOT generarse cuando la funcionalidad no introduzca ni modifique contratos.

El formato apropiado según la naturaleza del contrato, la estructura obligatoria de
los contratos Markdown (front matter, idioma, trazabilidad) y el criterio para
decidir qué reglas técnicas transversales SHOULD vivir en `docs/conventions/` en
lugar de en `contracts/` MUST fijarse en
[`docs/conventions/process/contracts.md`](../../docs/conventions/process/contracts.md)
en lugar de aquí.

`contracts/` MUST contener únicamente contratos realmente necesarios para la funcionalidad.

---

# Estándares de especificación

Los requisitos funcionales de `spec.md` MUST seguir EARS cuando sea aplicable.

Cada requisito funcional MUST tener un identificador estable:

```text
FR-xxx
```

Los escenarios de aceptación MUST utilizar Gherkin mediante:

```text
Given
When
Then
```

Cada criterio de éxito MUST tener un identificador estable:

```text
SC-xxx
```

Los requisitos MUST:

* ser atómicos;
* ser verificables;
* ser no ambiguos;
* describir qué debe hacer el sistema;
* evitar detalles de implementación salvo que sean una restricción explícita.

Los escenarios de aceptación MUST describir comportamiento observable.

Los criterios de éxito MUST ser:

* medibles;
* verificables.

Las incertidumbres capaces de cambiar materialmente el alcance MUST marcarse como:

```text
NEEDS CLARIFICATION
```

La información astronómica incluida en una feature MUST distinguir entre:

* hechos reales;
* contenido ficticio;

cuando exista riesgo razonable de confusión.

Las especificaciones MUST NOT establecer un planeta o destino como un nivel de dificultad fijo.

---

# Trazabilidad

Cada historia de usuario SHOULD poder relacionarse con los requisitos que implementa.

Cada `FR-xxx` MUST estar cubierto por al menos una tarea de implementación cuando se genere `tasks.md`.

Las tareas SHOULD utilizar referencias:

```text
[USx]
[FR-xxx]
```

cuando aporten trazabilidad útil.

Los escenarios de aceptación MUST poder validarse mediante:

* implementación;
* pruebas;
* validación funcional.

Los contratos y cambios de modelo de datos MUST poder relacionarse con requisitos o decisiones técnicas cuando resulte relevante.

Las decisiones técnicas relevantes MAY utilizar identificadores:

```text
R-xxx
```

MUST NOT crearse referencias artificiales únicamente para completar matrices de trazabilidad.

---

# Calidad y testing

La lógica crítica del juego MUST disponer de pruebas automatizadas.

Cuando formen parte de una feature, MUST probarse adecuadamente:

* generación de retos;
* validación de respuestas;
* progresión;
* dificultad;
* adaptación de dificultad;
* recompensas;
* persistencia;
* reglas de desbloqueo;
* reglas de misión.

Los tests MUST validar comportamiento antes que detalles internos de implementación.

Las condiciones límite MUST probarse cuando existan:

* rangos;
* umbrales;
* transiciones;
* restricciones numéricas.

Boundary Value Analysis MUST utilizarse cuando existan límites numéricos relevantes.

Ejemplo para un rango válido entre `0` y `10`:

```text
-1
0
1

9
10
11
```

Los tests de lógica educativa SHOULD permanecer independientes de Phaser cuando sea razonable.

El code coverage MAY utilizarse como indicador.

El code coverage MUST NOT:

* sustituir pruebas de comportamiento;
* utilizarse como único criterio de calidad;
* incentivar tests sin valor.

La calidad de los escenarios probados tiene prioridad sobre el porcentaje de coverage.

---

# Quality Gates

## Gate de especificación

Antes de aprobar `spec.md`:

* [ ] No existen `NEEDS CLARIFICATION` bloqueantes.
* [ ] Las historias P1 definen un incremento funcional verificable.
* [ ] Los requisitos funcionales relevantes siguen EARS.
* [ ] Los escenarios de aceptación relevantes siguen Gherkin.
* [ ] Los requisitos son atómicos, no ambiguos y verificables.
* [ ] Los criterios de éxito son medibles.
* [ ] Los casos límite críticos están contemplados.
* [ ] La experiencia propuesta respeta el principio de juego antes que ejercicio.
* [ ] La información astronómica y la ficción están claramente diferenciadas cuando aplique.

---

## Gate previo al diseño

Antes de iniciar la Fase 0 / Fase 1 de `plan.md`:

* [ ] La funcionalidad cumple todos los principios `NON-NEGOTIABLE`.
* [ ] Las desviaciones respecto a principios `SHOULD` están justificadas.
* [ ] No se introduce complejidad sin necesidad demostrable.
* [ ] Las restricciones globales aplicables están identificadas.
* [ ] La feature no implementa anticipadamente funcionalidad fuera de su alcance.
* [ ] Las nuevas dependencias tienen una necesidad identificada.

---

## Gate posterior al diseño

Después de completar el diseño:

* [ ] Las decisiones técnicas respetan esta constitución.
* [ ] La estructura propuesta es coherente con la arquitectura del proyecto.
* [ ] Los contratos y modelo de datos respetan las restricciones establecidas.
* [ ] Si existen contratos, `contracts/` contiene únicamente los necesarios.
* [ ] Cada contrato utiliza el formato apropiado para su naturaleza.
* [ ] Los contratos Markdown incluyen front matter.
* [ ] Los contratos tienen estructura documental clara.
* [ ] La estrategia de pruebas cubre riesgos y comportamientos críticos.
* [ ] La lógica educativa permanece razonablemente desacoplada del renderizado.
* [ ] Las violaciones justificadas están registradas en `Complexity Tracking`.
* [ ] Los componentes visuales previstos han sido contrastados con `libs/components/`.
* [ ] Se han identificado los componentes específicos de feature y los realmente compartidos.
* [ ] La solución propuesta mantiene compatibilidad completa con GitHub Pages.
* [ ] No se introduce ninguna dependencia de ejecución server-side no aprobada.
* [ ] La iconografía general prevista reutiliza Phosphor Icons cuando existe una alternativa adecuada.
* [ ] Los SVG personalizados previstos están justificados por necesidades específicas de identidad visual o representación astronómica.
* [ ] La tipografía prevista respeta el mapa semántico del sistema tipográfico.
* [ ] No se introducen fuentes nuevas ni dependencias remotas de fuentes sin justificación.

---

## Gate previo a implementación

Antes de ejecutar `tasks.md`:

* [ ] Todos los `FR-xxx` implementables están cubiertos por tareas.
* [ ] Las dependencias entre tareas son explícitas cuando sea necesario.
* [ ] Las historias pueden implementarse independientemente cuando el dominio lo permita.
* [ ] Las tareas de prueba necesarias están incluidas.
* [ ] No existen tareas sin origen justificable en `spec.md`, `plan.md` o esta constitución.
* [ ] Las tareas relacionadas con contratos identifican qué contratos se crean o modifican.
* [ ] Todos los componentes visuales necesarios han sido contrastados con `libs/components/`.
* [ ] No existe ningún componente compartido pendiente de aprobación.
* [ ] Todo componente compartido nuevo necesario ha recibido aprobación explícita del usuario antes de su creación.
* [ ] Los componentes específicos de una feature permanecen dentro de dicha feature salvo justificación contraria.
* [ ] Ninguna tarea requiere infraestructura incompatible con GitHub Pages sin aprobación explícita del usuario.
* [ ] No se prevé crear iconografía general personalizada que duplique innecesariamente iconos disponibles en Phosphor Icons.
* [ ] Los SVG personalizados requeridos tienen definida una ubicación y convención de nombres coherentes.

Si durante la implementación aparece una necesidad de componente compartido no identificada previamente, la ejecución MUST detenerse y aplicar el procedimiento definido en **Componentes compartidos → Componente reutilizable inexistente**.

---

## Gate de finalización

Antes de considerar una funcionalidad completada:

* [ ] Todos los requisitos incluidos en el alcance están satisfechos.
* [ ] Todos los escenarios de aceptación incluidos en el alcance pueden validarse.
* [ ] Las pruebas obligatorias pasan.
* [ ] TypeScript compila sin errores.
* [ ] Lint pasa sin errores bloqueantes.
* [ ] Build finaliza correctamente.
* [ ] No existen violaciones constitucionales sin resolver.
* [ ] La documentación afectada está actualizada.
* [ ] Los contratos afectados están actualizados.
* [ ] Los contratos mantienen trazabilidad cuando aplique.
* [ ] No existen duplicaciones evitables de componentes disponibles en `libs/components/`.
* [ ] Los componentes compartidos nuevos aprobados respetan su API y responsabilidades definidas.
* [ ] Los criterios de éxito verificables en esta fase se cumplen o tienen un mecanismo definido de medición.
* [ ] La build de producción funciona correctamente bajo la subruta configurada para GitHub Pages.
* [ ] Rutas, assets y recursos funcionan correctamente en el despliegue estático.
* [ ] Los iconos generales utilizan Phosphor Icons cuando corresponde.
* [ ] Los SVG personalizados están optimizados, son escalables y no contienen scripts ni dependencias externas.
* [ ] Los nombres y rutas de los assets respetan las convenciones en inglés del proyecto.
* [ ] Los componentes y pantallas usan tokens tipográficos semánticos cuando existe un token adecuado.
* [ ] Las fuentes principales se sirven como assets locales o empaquetados por Vite.

---

# Flujo de desarrollo

El flujo estándar será:

1. `constitution.md` establece las reglas globales.
2. `spec.md` define qué debe hacer la funcionalidad.
3. `research.md` resuelve incertidumbres técnicas, funcionales o científicas cuando sea necesario.
4. `plan.md` define cómo se implementará.
5. `data-model.md` define el modelo de datos cuando aplique.
6. `contracts/` define contratos cuando aplique.
7. `tasks.md` transforma el diseño en unidades ejecutables.
8. `checklist.md` valida aspectos específicos cuando sea necesario.
9. La implementación ejecuta las tareas respetando dependencias y gates.
10. La validación final comprueba requisitos, escenarios, pruebas, componentes, documentación, contratos y constitución.

Las features SHOULD desarrollarse como vertical slices.

Una fase necesaria MUST NOT omitirse únicamente por conveniencia.

Una fase que no resulte aplicable MAY omitirse cuando la razón sea clara.

---

# Gestión de complejidad

La solución más simple que satisfaga los requisitos SHOULD ser la opción por defecto.

La complejidad adicional MUST resolver un problema concreto y actual.

Antes de introducir una desviación significativa MUST evaluarse una alternativa más sencilla.

Elementos que MAY requerir justificación:

* nuevos módulos;
* nuevos proyectos;
* nuevas capas;
* nuevos patrones arquitectónicos;
* nuevas dependencias;
* nuevos servicios;
* nuevos sistemas de persistencia;
* nuevos renderers;
* excepciones a convenciones existentes;
* nuevos componentes compartidos especialmente genéricos.

Las violaciones constitucionales necesarias MUST documentarse en:

```text
Complexity Tracking
```

dentro de `plan.md`.

Una justificación basada únicamente en posibles necesidades futuras MUST NOT considerarse suficiente.

Preparar puntos de extensión MAY aceptarse cuando no añada complejidad material.

Implementar anticipadamente la funcionalidad asociada MUST NOT hacerse.

---

# Excepciones

Una excepción a una regla obligatoria solo MAY aceptarse cuando:

1. La regla no esté marcada como `NON-NEGOTIABLE`.
2. Exista una necesidad técnica o funcional concreta.
3. La alternativa conforme a esta constitución haya sido evaluada.
4. El impacto esté documentado.
5. El riesgo esté documentado.
6. La excepción quede registrada en `plan.md`.
7. La excepción sea aprobada mediante el proceso de revisión definido por el proyecto.

Las excepciones temporales MUST incluir una condición o mecanismo para su eliminación cuando corresponda.

La obligación de detener la ejecución ante la necesidad de un nuevo componente compartido MUST NOT omitirse silenciosamente mediante una excepción implícita.

---

# Precedencia documental

El orden de precedencia es:

1. `constitution.md`
2. `spec.md`
3. `plan.md`
4. `research.md`
5. `data-model.md` / `contracts/`
6. `tasks.md`
7. `checklist.md`
8. Código y documentación auxiliar

Si dos artefactos entran en conflicto:

* el artefacto de menor precedencia MUST corregirse;
* si el artefacto de mayor precedencia está desactualizado, MUST modificarse primero mediante su proceso correspondiente;
* una implementación MUST NOT resolver silenciosamente una contradicción documental.

---

# CI/CD y despliegue

El proyecto MUST mantenerse compatible con hosting estático.

El pipeline real (workflow concreto, ficheros, ramas que lo disparan y en qué
push se despliega) MUST fijarse y mantenerse actualizado en
[`docs/conventions/architecture/overview.md`](../../docs/conventions/architecture/overview.md)
(sección "Tooling y pipeline") en lugar de aquí: esta constitución únicamente fija
los requisitos mínimos que ese pipeline MUST cumplir siempre.

La integración continua MUST comprobar como mínimo:

```text
install
lint
test
build
```

Una build con errores de:

* TypeScript;
* lint bloqueante;
* tests;
* compilación;

MUST NOT desplegarse.

La configuración MUST contemplar que GitHub Pages pueda servir la aplicación desde una subruta del repositorio.

### Compatibilidad con GitHub Pages

GitHub Pages MUST ser compatible con todas las funcionalidades incluidas en el producto salvo que una futura especificación apruebe explícitamente un cambio de estrategia de hosting.

La aplicación MUST poder compilarse mediante Vite como contenido estático.

El funcionamiento principal del juego MUST NOT depender de ejecución server-side.

Las rutas, assets y recursos MUST funcionar correctamente cuando la aplicación se publique bajo una subruta de GitHub Pages.

La configuración de Vite MUST establecer correctamente `base` para la ruta de publicación.

Una funcionalidad que requiera backend, SSR, ejecución server-side, persistencia de servidor u otra infraestructura incompatible con GitHub Pages MUST detener su implementación.

Cuando se detecte una incompatibilidad con GitHub Pages, la ejecución MUST detenerse antes de modificar la arquitectura o estrategia de hosting.

En ese caso, MUST informarse explícitamente al usuario de:

* qué requisito o funcionalidad provoca la incompatibilidad;
* por qué GitHub Pages deja de ser suficiente;
* qué alternativas de arquitectura o hosting existen;
* qué impacto técnico tendría el cambio;
* qué impacto tendría sobre despliegue, mantenimiento y complejidad.

La estrategia de hosting MUST NOT modificarse sin aprobación explícita del usuario.

La implementación MUST NOT introducir silenciosamente servicios externos, backend, SSR u otra infraestructura para evitar las limitaciones de GitHub Pages.

---

# Gobierno

Esta constitución prevalece sobre cualquier otro documento o práctica del proyecto.

Todas las:

* especificaciones;
* investigaciones;
* decisiones;
* planes;
* tareas;
* contratos;
* componentes;
* pruebas;
* implementaciones;

MUST cumplirla.

Todo `Constitution Check` MUST utilizar la versión activa de este fichero.

Una violación MUST:

* resolverse;
* o justificarse formalmente;

antes de continuar cuando afecte a un Quality Gate.

Las revisiones de código SHOULD comprobar las reglas constitucionales aplicables.

Una regla global recurrente SHOULD incorporarse a esta constitución en lugar de duplicarse en múltiples features.

Una regla específica de una única feature MUST NOT incorporarse a esta constitución.

---

# Modificación y versionado

Toda modificación de esta constitución MUST:

1. actualizar `version`;
2. actualizar `updated`;
3. mantener `ratified` como fecha de ratificación original;
4. documentar impactos de migración cuando existan;
5. revisar si las features activas quedan afectadas.

Se utilizará Semantic Versioning.

## PATCH

Se utilizará para:

* correcciones de redacción;
* aclaraciones sin cambio normativo;
* ejemplos adicionales;
* mejoras editoriales.

## MINOR

Se utilizará para:

* nuevos principios compatibles;
* nuevas reglas;
* nuevos gates;
* ampliaciones normativas compatibles.

## MAJOR

Se utilizará para:

* eliminación de principios;
* redefinición incompatible de principios;
* cambios fundamentales de gobierno;
* cambios que hagan inválidas decisiones previamente conformes.

---

# Revisión de cumplimiento

Una revisión de cumplimiento SHOULD comprobar:

* principios fundamentales;
* restricciones globales;
* Quality Gates;
* trazabilidad;
* estrategia de pruebas;
* arquitectura;
* dificultad adaptativa;
* separación entre lógica y renderizado;
* uso correcto de `libs/components/`;
* componentes compartidos pendientes de aprobación;
* duplicaciones de componentes;
* sistema tipográfico;
* contratos;
* estructura de `contracts/`;
* front matter de contratos Markdown;
* idioma documental;
* convenciones técnicas en inglés;
* complejidad introducida;
* excepciones abiertas;
* consistencia entre `spec.md`, `research.md`, `plan.md`, `data-model.md`, `contracts/` y `tasks.md`;
* vigencia de las reglas constitucionales.

---

# Criterio general de decisión

Ante dos soluciones técnicamente válidas, MUST favorecerse aquella que, manteniendo los requisitos:

1. sea más sencilla;
2. sea más comprensible;
3. tenga menos dependencias;
4. sea más fácil de probar;
5. sea más fácil de mantener;
6. evite duplicación;
7. reutilice correctamente componentes existentes;
8. sea más fácil de ampliar cuando exista una necesidad real;
9. proporcione mejor experiencia al niño.

La complejidad adicional MUST estar justificada por una necesidad concreta y actual.

---

**Versión**: 2.0.0
**Ratificada**: 2026-08-15
**Última modificación**: 2026-08-19
