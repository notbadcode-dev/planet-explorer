---
title: "Convención: Formato y estructura de contratos"
type: "convention"
version: "1.0"
created: "2026-08-17"
updated: "2026-08-17"
status: "Draft"
source: "constitution.md (sección 'Contratos')"
tags: [process, documentation, contracts, speckit]
---

# Convención: Formato y estructura de contratos

**Fuente**: `constitution.md` (sección "Contratos").

> Migrado/Extraído desde `constitution.md` (sección "Contratos") el 2026-08-17 a
> `docs/` por ser una convención técnica transversal: aplica a los `contracts/` de
> cualquier feature (`specs/NNN-feature/contracts/`), no es un principio de
> gobernanza ni el contrato específico de una única feature.

## Propósito

Fijar qué formato usar según la naturaleza de un contrato y qué estructura MUST
cumplir todo contrato basado en Markdown, para que cada feature no tenga que
decidirlo desde cero ni improvisar un estilo distinto.

## Formato según la naturaleza del contrato

Los contratos MUST utilizar el formato más apropiado según su naturaleza. Los
contratos MUST NOT forzarse a utilizar una única plantilla universal.

| Naturaleza del contrato | Formato |
|---|---|
| REST API | OpenAPI |
| GraphQL | GraphQL SDL |
| Events | AsyncAPI o Markdown estructurado |
| Commands | Markdown estructurado |
| Public interfaces | Markdown estructurado |
| CLI | Markdown estructurado |

## Reglas de los contratos Markdown

* **R1**: Todo contrato basado en Markdown MUST incluir front matter YAML al
  inicio del fichero, con el mismo estilo de front matter que el resto de
  artefactos del proyecto.
* **R2**: MUST utilizar títulos claros y una jerarquía explícita de encabezados,
  con secciones claramente delimitadas y fácilmente navegables.
* **R3**: El contenido documental (títulos, descripciones, explicaciones,
  comentarios, decisiones documentadas) MUST escribirse en castellano. Los
  elementos técnicos (nombres de ficheros, rutas, endpoints, propiedades,
  campos, eventos, comandos, tipos, identificadores, nombres de esquemas)
  MUST mantenerse en inglés.
* **R4**: Todo contrato SHOULD incluir trazabilidad con `FR-xxx`, `USx` o
  `R-xxx` cuando dicha trazabilidad aporte valor.
* **R5**: `contracts/` MUST contener únicamente contratos realmente necesarios
  para la funcionalidad; no se genera cuando la feature no introduce ni
  modifica contratos.
* **R6**: Una regla o convención técnica que aplique a más de una feature (no
  específica de la funcionalidad actual) SHOULD vivir aquí, en
  `docs/conventions/`, en lugar de en `contracts/`; un contrato de
  `contracts/` MAY referenciar esta convención por enlace en lugar de
  duplicarla.

## Fuera de alcance

* El contenido específico de un contrato concreto de una feature — vive en
  `specs/NNN-feature/contracts/`.
* Los estándares de `spec.md` (EARS, Gherkin, `FR-xxx`, `SC-xxx`) — se mantienen
  en la constitución, sección "Estándares de especificación", por ser reglas del
  propio flujo de gobernanza de speckit.
* Los Quality Gates que verifican el uso correcto de contratos — se mantienen en
  la constitución (p. ej. "Gate posterior al diseño").
