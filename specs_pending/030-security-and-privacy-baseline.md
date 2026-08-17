---
id: "030-security-and-privacy-baseline"
name: "Línea base de seguridad y privacidad"
phase: "Fase 4 — Gate de publicación estable (MVP)"
depends_on: ["011-save-progress-local", "028-parental-dashboard"]
---

# 030 — Línea base de seguridad y privacidad (security-and-privacy-baseline)

## Objetivo
Establecer, antes de la primera publicación pública, una línea base de seguridad y privacidad proporcional a una app cliente estática dirigida a menores: renderizado seguro frente a XSS, parseo seguro de datos persistidos, cabeceras/CSP razonables para el hosting estático, auditoría de dependencias en CI, y una postura explícita de "no PII, no rastreadores de terceros".

## Contexto / motivación
El proyecto no tiene backend ni cuentas (GitHub Pages, app estática), pero eso no exime de riesgos reales: contenido dinámico mal escapado (XSS vía `innerHTML`), datos corruptos o manipulados en `localStorage` que rompan el parseo (011 ya cubre el caso de datos corruptos, pero no un baseline de seguridad transversal), dependencias de terceros con vulnerabilidades conocidas, o la ausencia de una postura de privacidad clara y visible para las familias (principio I: el niño es el usuario, pero la confianza de los padres es una condición de adopción real). Esta spec es la que cierra esa brecha ANTES del gate de publicación, y sirve de línea base sobre la que 049 (analítica, Fase 7) y 058 (accesibilidad asistiva, Fase 8) construirán más adelante sin tener que redefinir la postura de privacidad desde cero.

## Alcance incluido
- Revisión y, si aplica, corrección de cualquier uso de `innerHTML`/inserción de HTML dinámico con datos no confiables (contenido de retos, nombres de perfil) en favor de `textContent`/inserción segura de nodos.
- Parseo seguro de JSON persistido en `localStorage`: validación de esquema/tipos antes de confiar en los datos (extendiendo el manejo de datos corruptos ya definido en 011), sin `eval` ni deserialización insegura en ningún punto del código.
- Cabeceras de seguridad razonables para el hosting estático (p. ej. `Content-Security-Policy` básica vía meta tag, ya que GitHub Pages no permite cabeceras HTTP custom) y ausencia de recursos cargados desde orígenes no confiables.
- `npm audit` (o equivalente) integrado como paso no bloqueante inicialmente, informativo, en el pipeline de CI ya existente (`.github/workflows/ci.yml`), revisando vulnerabilidades conocidas en dependencias; 035 consolidará después este paso junto con el resto de la validación automatizada, sin necesidad de rehacerlo.
- Declaración explícita y visible (en el panel parental, 028) de qué datos NO se recopilan ni se envían a terceros: sin nombre real requerido, sin ubicación, sin identificadores publicitarios, sin analítica de terceros por defecto.
- Checklist de seguridad básica (equivalente ligero a OWASP Top 10 aplicable a una SPA estática: XSS, dependencias vulnerables, exposición de datos sensibles, configuración insegura) documentado en `docs/conventions/`.

## Alcance excluido
- Autenticación, autorización o gestión de sesiones (no existen cuentas ni backend).
- Cifrado de datos en `localStorage` (no hay datos sensibles/PII que lo justifiquen; el progreso de juego no es información crítica).
- Cumplimiento legal formal tipo COPPA/GDPR con asesoría jurídica (fuera de alcance de una spec técnica; se documenta la postura de privacidad de producto, no un dictamen legal).
- Analítica de uso en sí misma (ver 049, que se apoya en esta línea base sin relajarla).

## Dependencias
- 011 (el parseo seguro extiende el manejo de datos corruptos ya definido ahí), 028 (superficie donde se muestra la postura de privacidad a las familias).

## Criterios de aceptación de alto nivel
- No existe ningún punto del código donde datos no confiables (contenido de usuario, datos persistidos) se inserten como HTML sin sanear.
- El parseo de datos persistidos valida forma/tipos antes de usarlos, degradando de forma segura (como ya hace 011) ante datos inesperados o manipulados.
- El pipeline de CI (035) ejecuta una auditoría de dependencias y reporta vulnerabilidades conocidas.
- El panel parental (028) muestra de forma clara y accesible qué datos no se recopilan.
- Existe un checklist de seguridad documentado y verificado antes del primer release público (036).

## Alineación con la constitución
- **I. Experiencia centrada en el niño (NON-NEGOTIABLE)**: la confianza de las familias en la privacidad del producto es una condición de adopción, no una funcionalidad opcional.
- **VI. Simplicidad primero**: baseline proporcional a una app cliente estática, sin infraestructura de seguridad especulativa (no hay cuentas, no hay backend que proteger).

## Frase de entrada sugerida para /speckit-specify
"Quiero establecer una línea base de seguridad y privacidad antes de publicar el juego: renderizado seguro sin XSS, parseo validado de datos persistidos en localStorage, una auditoría de dependencias en CI, y una declaración clara y visible en el panel parental de qué datos personales no se recopilan ni se envían a terceros."
