---
title: "Convención: Assets SVG personalizados e iconografía espacial"
type: "convention"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
source: "constitution.md (sección Iconografía)"
tags: [design-system, assets, iconography]
---

# Convención: Assets SVG personalizados e iconografía espacial

**Fuente**: `constitution.md` (sección Iconografía).

> Extraído de `constitution.md` (sección "Iconografía") el 2026-08-16: la constitución
> mantiene la regla de principio (Phosphor Icons como librería principal, cuándo se
> justifica un SVG personalizado); este documento reúne el checklist técnico y la
> convención de organización de ficheros, que es material de referencia y no un
> principio de gobernanza.

## Propósito

Fijar los requisitos técnicos y la organización de ficheros para cualquier SVG
personalizado del proyecto (planetas, lunas, naves, criaturas, etc.), de forma que
sea verificable por cualquier desarrollador sin ambigüedad y no dependa de
decisiones estéticas ad hoc por pantalla.

## Cuándo usar un SVG personalizado

Los cuerpos astronómicos reales SHOULD utilizar SVG personalizados cuando un icono
genérico no permita reconocer adecuadamente el objeto representado (p. ej. Marte,
Júpiter o Saturno SHOULD representarse mediante assets específicos en lugar de un
icono genérico de planeta).

## Reglas técnicas para todo SVG personalizado

Todo SVG personalizado MUST:

* mantener coherencia visual con el sistema de diseño del proyecto;
* mantener una estética compatible con la iconografía `duotone` utilizada en la interfaz;
* utilizar un `viewBox` apropiado;
* ser completamente escalable;
* utilizar fondo transparente;
* evitar dimensiones fijas innecesarias;
* estar optimizado para web;
* evitar metadatos innecesarios;
* evitar código o scripts embebidos;
* evitar dependencias externas;
* evitar recursos remotos;
* utilizar nombres de archivo en inglés;
* evitar texto embebido cuando pueda representarse mediante HTML o mediante el sistema de UI;
* poder utilizarse de forma segura como asset estático en GitHub Pages.

Los SVG generados SHOULD mantener, cuando resulte apropiado:

* proporciones visuales coherentes;
* grosor visual consistente;
* estilo de formas consistente;
* uso consistente de capas principales y secundarias;
* paleta compatible con el sistema de diseño.

## Organización de assets

Los assets espaciales personalizados SHOULD almacenarse bajo una estructura clara como:

```text
public/
└── assets/
    └── icons/
        └── space/
```

Ejemplos:

```text
public/assets/icons/space/mercury.svg
public/assets/icons/space/venus.svg
public/assets/icons/space/earth.svg
public/assets/icons/space/mars.svg
public/assets/icons/space/jupiter.svg
public/assets/icons/space/saturn.svg
public/assets/icons/space/uranus.svg
public/assets/icons/space/neptune.svg
public/assets/icons/space/moon.svg
public/assets/icons/space/proxima-centauri.svg
public/assets/icons/space/trappist-1.svg
```

La estructura definitiva MAY adaptarse durante `plan.md` cuando exista una razón
arquitectónica concreta, manteniendo siempre nombres de ficheros y carpetas en inglés.

## Fuera de alcance

* La decisión de gobernanza sobre cuándo usar Phosphor Icons frente a un SVG
  personalizado: esa regla de principio vive en la constitución, sección
  "Iconografía".
* Un pipeline de optimización/compilación automática de SVG (p. ej. SVGO en build):
  no existe todavía una necesidad concreta que lo justifique (YAGNI).
