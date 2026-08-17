---
title: "Convención: [TÍTULO DE LA CONVENCIÓN]"
type: "convention"
version: "1.0" # 1.0 | 1.1 | 1.2 — usa MINOR cuando amplías sin romper, y documenta el salto en "Amplía"
created: "[DATE]" # 2026-08-16
updated: "[DATE]" # 2026-08-16
status: "Draft" # Draft | In Review | Approved | Deprecated
source: "[FUENTE]" # "specs/NNN-feature-name/" si nace de una feature, o "constitution.md (sección X)" si se extrae de la constitución
tags: [] # frontend, architecture, convention, design-system, accessibility, iconography, typography...
---

# Convención: [TÍTULO DE LA CONVENCIÓN]

**Fuente**: [FR-001, FR-002... de `specs/NNN-feature-name/`] o [`constitution.md` (sección X)].

<!--
  OPCIONAL — solo si esta versión amplía una convención previa sin romperla:
  **Amplía**: [`otra-convencion.md`](./otra-convencion.md) (vX.Y), que se mantiene vigente
  en todo lo demás. Esta versión añade únicamente [qué añade]; no modifica ninguna otra regla.
-->

<!--
  OPCIONAL — solo si el documento se creó moviendo contenido desde otro sitio
  (specs/NNN/contracts/ o constitution.md). Si el documento es nuevo y no migra nada,
  elimina este bloque de cita.
-->
> Migrado/Extraído desde [origen] el [DATE] a `docs/` por ser una convención transversal
> aplicable a [ámbito] (más de una feature / toda la librería de componentes), no un
> contrato específico de una única feature ni un principio de gobernanza.

## Propósito

<!--
  Una o dos frases: qué fija este documento y por qué es necesario que sea
  verificable/consultable, en lugar de una decisión ad hoc repetida en cada feature.
-->

[Descripción del propósito.]

## [Sección de reglas 1, p. ej. "Reglas del contrato" o "Reglas técnicas"]

<!--
  Usa MUST/SHOULD/MAY (RFC 2119) igual que en la constitución y en los contratos de
  specs/. Numera las reglas si otros documentos necesitan referenciarlas (R1, R2...
  o A1, V1, I1, Q1... según el dominio, para no colisionar con la numeración de otras
  convenciones existentes).
-->

* **R1**: [Regla].
* **R2**: [Regla].

## [Sección adicional opcional, p. ej. "Verificación de completitud" o "Organización de assets"]

[Checklist, tabla de tokens, estructura de carpetas, ejemplos, etc., según aplique.]

## Fuera de alcance

<!--
  Qué queda deliberadamente fuera de este documento y dónde vive (constitución,
  contrato de una feature concreta, o "no existe necesidad todavía / YAGNI").
-->

* [Elemento fuera de alcance] — vive en [ubicación].
* [Elemento fuera de alcance] — no existe todavía una necesidad concreta que lo
  justifique (YAGNI).
