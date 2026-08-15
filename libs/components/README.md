# Librería de componentes (`libs/components/`)

Esta carpeta aloja los componentes de interfaz **reutilizables** del proyecto: piezas
visuales "dummy" (presentacionales), independientes de cualquier feature, destino,
expedición o misión concreta del juego.

Antes de crear un componente nuevo dentro de una feature, comprueba primero si ya
existe un componente adecuado aquí (ver constitución, sección "Componentes
compartidos").

## Convención estructural

Cada componente vive en su propia carpeta, nombrada en `kebab-case`, con esta
estructura mínima:

```text
libs/components/<component-name>/
├── <ComponentName>.ts          # Implementación (función factory pública)
├── <ComponentName>.css         # Estilos del componente (OPCIONAL)
├── <ComponentName>.test.ts     # Pruebas unitarias con Vitest
├── <ComponentName>.stories.ts  # Historia de Storybook
└── index.ts                    # Punto de entrada público (reexporta la API)
```

Un componente sin su `*.test.ts` o sin su `*.stories.ts` se considera **incompleto**
y no está listo para su uso por el resto del proyecto. El script
`npm run check:components` bloquea automáticamente nombres duplicados y
componentes incompletos.

`<ComponentName>.css` es **opcional**: un componente puede incluir un fichero de
estilos co-localizado, importado desde su implementación (`import
'./<ComponentName>.css'`). Todas sus clases MUST ir prefijadas con un nombre
que identifique inequívocamente al componente (p. ej. `button`, `button--danger`)
para evitar colisiones con otros componentes; no puede definir selectores
globales sin prefijar. Su ausencia no afecta a la completitud del componente.
Ver el contrato completo en
[`../../specs/002-button-variants/contracts/component-library-convention-css.md`](../../specs/002-button-variants/contracts/component-library-convention-css.md).

Ver el contrato completo en
[`../../specs/001-component-library-architecture/contracts/component-library-convention.md`](../../specs/001-component-library-architecture/contracts/component-library-convention.md).

## Uso

Cualquier componente se importa directamente desde su carpeta:

```ts
import { createButton } from 'libs/components/button';
```

## Componentes disponibles

* [`button/`](./button/) — Botón interactivo básico, con soporte de estado
  deshabilitado y etiqueta accesible. Ver
  [contrato de `Button`](../../specs/001-component-library-architecture/contracts/button-component.md).
