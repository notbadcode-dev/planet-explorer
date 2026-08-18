---
title: "Librería de componentes UI: arquitectura y componente Button"
feature: "001-component-library-architecture"
type: "feature-spec"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Implemented"
priority: "P1"
tags: [frontend, ui, testing, documentation, architecture]
dependencies: []
related_specs: []
---

# Especificación de funcionalidad: Librería de componentes UI: arquitectura y componente Button

**Rama de la funcionalidad**: `001-component-library-architecture`

**Creado**: 2026-08-15

**Estado**: Draft

**Entrada**: Descripción del usuario: "Quiero poder tener una carpeta libs/components donde tener componentes dummy reutilizables para luego usarlos en el proyecto, estos componentes estaran testeados de forma unitaria con vitest y tendra storybook para su presentacion. Quiero empezar con la arquitectura de esto y con un primer componente que sera un button."

## Clarifications

### Session 2026-08-15

- Q: ¿Debe impedirse automáticamente (lint/CI) el nombre duplicado de componentes, o basta con revisión de código? → A: El sistema MUST bloquear automáticamente (comprobación de lint/CI) la existencia de dos componentes con el mismo nombre en `libs/components`.
- Q: ¿El Button debe exigir siempre texto visible, o puede omitirlo con una etiqueta accesible alternativa? → B: El Button MAY omitir texto visible siempre que exponga una etiqueta accesible alternativa (equivalente a `aria-label`) para tecnologías de asistencia.

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Carpeta de componentes reutilizables (Prioridad: P1)

Como desarrollador del proyecto, quiero disponer de una carpeta `libs/components` con una estructura clara y consistente para alojar componentes de interfaz reutilizables, de forma que cualquier feature del juego pueda usarlos sin duplicar código de UI.

**Por qué tiene esta prioridad**: Es la base sobre la que se apoyan el resto de historias (tests, Storybook y el propio componente Button). Sin esta estructura no existe un lugar consistente donde añadir componentes reutilizables.

**Prueba independiente**: Puede probarse de forma independiente comprobando que existe la carpeta `libs/components`, que sigue una convención de organización documentada, y que un componente puede añadirse siguiendo dicha convención sin necesidad de que exista todavía ningún componente concreto.

**Escenarios de aceptación**:

1. **Given** el repositorio del proyecto, **When** un desarrollador busca dónde ubicar un componente de UI reutilizable, **Then** encuentra la carpeta `libs/components` con una convención clara sobre dónde colocar el código del componente, sus pruebas y su historia de Storybook.
2. **Given** la carpeta `libs/components` ya existe, **When** un desarrollador añade un nuevo componente siguiendo la convención documentada, **Then** el componente queda disponible para ser importado desde el resto del proyecto sin necesidad de configuración adicional.

---

### Historia de usuario 2 - Componentes cubiertos por pruebas unitarias (Prioridad: P2)

Como desarrollador del proyecto, quiero que cada componente de `libs/components` tenga su propia suite de pruebas unitarias con Vitest, para detectar regresiones de comportamiento antes de que lleguen al resto del proyecto.

**Por qué tiene esta prioridad**: Garantiza la fiabilidad de los componentes reutilizables; sin pruebas, cualquier cambio en un componente compartido podría romper silenciosamente otras partes del juego.

**Prueba independiente**: Puede probarse de forma independiente ejecutando la suite de pruebas del componente Button y comprobando que valida su comportamiento observable (renderizado, estados, interacción) sin depender de otras features.

**Escenarios de aceptación**:

1. **Given** el componente Button implementado, **When** se ejecuta la suite de pruebas unitarias del proyecto, **Then** las pruebas del componente Button se ejecutan y verifican su comportamiento esperado (renderizado, estado deshabilitado, disparo de la acción de clic).
2. **Given** un cambio que rompe el comportamiento esperado del componente Button, **When** se ejecutan las pruebas unitarias, **Then** la suite de pruebas falla e identifica el comportamiento afectado.

---

### Historia de usuario 3 - Presentación visual con Storybook (Prioridad: P3)

Como desarrollador o diseñador del proyecto, quiero poder visualizar cada componente de `libs/components` y sus variantes/estados en Storybook, para revisar su apariencia sin tener que integrarlo previamente en el juego.

**Por qué tiene esta prioridad**: Aporta valor de documentación visual y facilita la revisión y el diseño colaborativo, pero el proyecto sigue siendo funcional aunque esta historia no se entregue de inmediato, ya que las historias 1 y 2 ya permiten reutilizar y validar el componente.

**Prueba independiente**: Puede probarse de forma independiente abriendo Storybook y comprobando que el componente Button aparece con una historia navegable que muestra sus principales estados/variantes.

**Escenarios de aceptación**:

1. **Given** el componente Button implementado, **When** un desarrollador abre Storybook, **Then** encuentra una historia del componente Button que permite visualizar sus estados principales (normal, deshabilitado, variantes visuales) sin ejecutar el juego completo.
2. **Given** una historia de Storybook existente para un componente, **When** se modifican las propiedades expuestas en los controles de Storybook, **Then** la vista previa del componente refleja el cambio inmediatamente.

---

### Casos límite

* ¿Qué sucede cuando se intenta añadir un componente a `libs/components` sin su suite de pruebas unitarias o sin su historia de Storybook correspondiente? (ver FR-009)
* Si ya existe un componente con el mismo nombre dentro de `libs/components`, una comprobación automática (lint/CI) bloquea la operación e informa del conflicto (ver FR-010).
* ¿Cómo se comporta el componente Button cuando está deshabilitado y el usuario intenta interactuar con él (clic, teclado)? (ver FR-007)
* Si el componente Button se usa sin texto visible, MUST proporcionarse una etiqueta accesible alternativa; no se permite un Button sin ningún tipo de etiqueta, ni visible ni accesible (ver FR-011).
* ¿Qué sucede si una feature del proyecto necesita una variante del Button que aún no existe en la librería? Queda fuera de alcance de esta iteración (ver Suposiciones): podrá añadirse en futuras iteraciones sin cambiar la arquitectura definida aquí.

## Requisitos *(obligatorio)*

### Requisitos funcionales

* **FR-001**: El sistema MUST proporcionar una carpeta `libs/components` como ubicación única para componentes de interfaz reutilizables e independientes de cualquier feature concreta del juego.
* **FR-002**: WHERE un componente reside en `libs/components`, el sistema MUST tratarlo como un componente "dummy" (presentacional): sin lógica de negocio propia de una feature ni dependencias de datos/estado específicos de una pantalla concreta.
* **FR-003**: WHEN se añade un nuevo componente a `libs/components`, el sistema MUST requerir que incluya su propia suite de pruebas unitarias implementada con Vitest.
* **FR-004**: WHEN se añade un nuevo componente a `libs/components`, el sistema MUST requerir que incluya al menos una historia de Storybook que permita visualizar sus estados/variantes principales.
* **FR-005**: El sistema MUST incluir un componente `Button` como primer componente publicado en `libs/components`, reutilizable desde cualquier parte del proyecto.
* **FR-006**: El componente `Button` MUST soportar, como mínimo, un estado habilitado y un estado deshabilitado.
* **FR-007**: WHILE el componente `Button` está en estado deshabilitado, el sistema MUST impedir que se dispare su acción de clic/activación.
* **FR-008**: El sistema MUST permitir importar cualquier componente de `libs/components` desde otras partes del proyecto sin duplicar su código.
* **FR-009**: IF un componente de `libs/components` carece de pruebas unitarias o de historia de Storybook, THEN el sistema MUST considerarlo incompleto y no listo para su uso por el resto del proyecto.
* **FR-010**: WHEN se intenta añadir un componente cuyo nombre coincide con el de otro componente ya existente en `libs/components`, el sistema MUST bloquear automáticamente la operación mediante una comprobación automatizada (lint/CI) e informar del conflicto.
* **FR-011**: WHERE el componente `Button` se usa sin texto visible, el sistema MUST exigir que se proporcione una etiqueta accesible alternativa (equivalente a `aria-label`) para que siga siendo comprensible por tecnologías de asistencia.

### Entidades clave

* **Componente de la librería**: Unidad de interfaz reutilizable alojada en `libs/components` (por ejemplo, el `Button`). Representa una pieza visual "dummy", sin lógica de negocio, con una API de propiedades propia, una suite de pruebas unitarias asociada y una historia de Storybook asociada.
* **Historia de Storybook**: Representación visual navegable de un componente de la librería y de sus principales estados/variantes, usada para su revisión y documentación.
* **Suite de pruebas unitarias**: Conjunto de pruebas automatizadas (Vitest) asociadas a un componente de la librería que verifican su comportamiento observable (renderizado, estados, interacción).

## Criterios de éxito *(obligatorio)*

### Resultados medibles

* **SC-001**: Un desarrollador puede localizar la convención para añadir un nuevo componente reutilizable a `libs/components` en menos de 2 minutos consultando la documentación/estructura del proyecto.
* **SC-002**: El 100% de los componentes publicados en `libs/components` (incluido `Button`) cuentan con pruebas unitarias automatizadas y con una historia de Storybook navegable.
* **SC-003**: Un desarrollador puede visualizar todos los estados principales del componente `Button` sin necesidad de ejecutar el juego completo.
* **SC-004**: Un cambio que rompa el comportamiento esperado del componente `Button` (por ejemplo, que deje de respetar el estado deshabilitado) es detectado automáticamente por la suite de pruebas antes de integrarse en el resto del proyecto.
* **SC-005**: Ningún componente con nombre duplicado llega a integrarse en el proyecto: el 100% de los intentos son detectados y bloqueados automáticamente antes de fusionar el cambio.

## Suposiciones

* La librería `libs/components` está pensada para uso interno de este proyecto (planet-explorer); no se contempla en esta iteración su publicación como paquete independiente para otros proyectos.
* El componente `Button` de esta primera iteración cubre un caso de uso básico: texto/etiqueta, acción de clic y estado deshabilitado; variantes visuales adicionales (tamaños, iconos, estilos secundarios) podrán añadirse en iteraciones futuras sin cambiar la arquitectura definida aquí.
* Las historias de Storybook de esta iteración se ejecutan y revisan en el entorno local de desarrollo; no se requiere publicar/desplegar Storybook en un entorno accesible externamente.
* No se exige un porcentaje mínimo de cobertura de código para las pruebas unitarias; se requiere que cada componente tenga pruebas que cubran su comportamiento observable principal (renderizado, estados y, si aplica, interacción).
* El componente `Button` sigue prácticas básicas de accesibilidad web (elemento semántico interactivo, operable por teclado, estado deshabilitado comunicado de forma accesible), acorde con el principio de la constitución de mantener zonas interactivas simples y claras.
