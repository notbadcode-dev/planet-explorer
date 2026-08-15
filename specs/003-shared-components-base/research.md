---
title: "Base mínima de componentes compartidos reutilizables — Investigación técnica"
feature: "003-shared-components-base"
type: "research"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, accessibility, architecture]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Investigación técnica: Base mínima de componentes compartidos reutilizables

**Entrada**: [spec.md](./spec.md), [plan.md](./plan.md), constitución del proyecto y convenciones existentes en `libs/components/`.

## Objetivo de la investigación

Resolver todas las incertidumbres del contexto técnico para implementar cinco componentes compartidos (`Input`, `Panel`, `Badge`, `Progress`, `Dialog`) con API estable, accesibilidad verificable, reglas de iconografía centralizadas y coherencia visual basada en tokens globales.

## Resumen de decisiones

| ID | Tema | Decisión | Estado |
|----|------|----------|--------|
| R-010 | Accesibilidad de Input | Exigir nombre accesible por `label` o `ariaLabel`, y sincronizar `error/hint` con `aria-describedby` | Resolved |
| R-011 | Modal accesible en Dialog | Foco inicial interno, trap de Tab, cierre con Escape y retorno al invocador | Resolved |
| R-012 | Normalización de Progress | Clamp determinista de `value/max` para salida visual y semántica consistente | Resolved |
| R-013 | Variantes no dependientes solo de color | `Badge` y `Panel` añaden señal visual secundaria (borde, contraste, peso) además del color | Resolved |
| R-014 | Gestión de tokens globales | Añadir token global solo si es reusable y no existe equivalente semántico | Resolved |
| R-015 | Composición de contenido | `Panel` y `Dialog` aceptan `HTMLElement | HTMLElement[]` con orden preservado | Resolved |
| R-016 | Iconografía compartida | Uso exclusivo del componente `Icon` para todo icono nuevo en componentes compartidos | Resolved |

## R-010 — Accesibilidad de Input

**Decision**: `Input` debe garantizar nombre accesible mediante `label` visible o `ariaLabel`; cuando existan `hint` y/o `error`, debe construir una cadena estable para `aria-describedby`; si hay `error`, activa `aria-invalid="true"`.

**Rationale**: Es el contrato mínimo para que lectores de pantalla reciban contexto completo de campo y estado de validación sin inferencias implícitas.

**Alternatives considered**:
- Permitir `Input` sin etiqueta ni `ariaLabel` (rechazado por incumplimiento de accesibilidad).
- Mostrar `error/hint` visualmente sin enlace ARIA (rechazado por pérdida de contexto para tecnologías de asistencia).

## R-011 — Modal accesible en Dialog

**Decision**: `Dialog` implementa ciclo completo de foco de teclado: foco inicial dentro del diálogo al abrir, navegación Tab contenida, cierre por Escape y retorno al elemento invocador al cerrar.

**Rationale**: Esta decisión fue aclarada explícitamente en la sesión de `/speckit-clarify` y define un criterio de aceptación de alto impacto.

**Alternatives considered**:
- Solo cerrar con Escape sin gestión de foco (rechazado por accesibilidad incompleta).
- Gestión parcial de foco (rechazado por inconsistencia de UX y pruebas ambiguas).

## R-012 — Normalización de Progress

**Decision**: `Progress` normaliza entrada de manera determinista: `max <= 0` se trata como mínimo válido seguro; `value < 0` se ajusta a 0; `value > max` se ajusta a `max`.

**Rationale**: Evita estados rotos y garantiza correspondencia entre valor mostrado, atributos semánticos y pruebas unitarias.

**Alternatives considered**:
- Lanzar excepciones en runtime (rechazado por degradar resiliencia para consumidores).
- Dejar valores fuera de rango sin normalizar (rechazado por comportamiento no predecible).

## R-013 — Variantes distinguibles más allá del color

**Decision**: Las variantes de `Badge` y `Panel` deben incluir señal secundaria no cromática (por ejemplo, borde, estilo de contorno o peso de texto) para distinguir estados.

**Rationale**: Cumple accesibilidad visual y evita dependencia exclusiva del color para comunicar significado.

**Alternatives considered**:
- Diferenciar solo por color (rechazado por incumplir requisito funcional y accesibilidad).

## R-014 — Evolución de tokens globales

**Decision**: Antes de añadir un token nuevo, verificar inexistencia de token semántico equivalente; si se añade, ubicarlo en el archivo global correspondiente (`_colors.css`, `_spacing.css`, `_shadows.css`, `_radii.css`, `_typography.css`) y reutilizarlo en más de un componente cuando aplique.

**Rationale**: Controla crecimiento del sistema visual y evita duplicación de variables con distinto nombre para mismo uso.

**Alternatives considered**:
- Crear tokens locales por componente (rechazado por fragmentar design system).
- Hardcode temporal en CSS del componente (rechazado por prohibición explícita en la spec).

## R-015 — Composición por HTMLElement

**Decision**: `Panel` y `Dialog` aceptan `HTMLElement | HTMLElement[]`; cuando reciban array, conservan orden de inserción y no mutan nodos externos.

**Rationale**: Mantiene API simple y predecible para composición de contenido y acciones sin acoplar a frameworks.

**Alternatives considered**:
- Aceptar solo `HTMLElement` único (rechazado por limitar composibilidad).
- Aceptar strings HTML crudas (rechazado por riesgo de seguridad y falta de tipado estructural).

## R-016 — Iconografía centralizada

**Decision**: Los componentes nuevos consumen iconos exclusivamente por `libs/components/icon`; si falta un icono, se amplía primero el catálogo central y luego se usa desde el componente consumidor.

**Rationale**: Centraliza semántica accesible, evita imports directos de fuentes externas y reduce divergencia visual.

**Alternatives considered**:
- Importar iconos directamente en cada componente (rechazado por violar reglas obligatorias de la feature).

## Conclusión

No quedan `NEEDS CLARIFICATION` abiertos para pasar a diseño detallado. Las decisiones R-010..R-016 cierran los puntos que impactan arquitectura, tests, contratos y criterios de aceptación.