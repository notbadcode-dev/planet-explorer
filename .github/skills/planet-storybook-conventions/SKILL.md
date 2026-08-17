---
name: planet-storybook-conventions
description: Apply this repository's Storybook (@storybook/html-vite) conventions and known gotchas. Use when creating or editing a *.stories.ts file, adding an event-handler arg (onX) to a component's argTypes, debugging Storybook Actions not firing or firing twice, or writing a story whose canvas looks visually empty on purpose.
---

# Convenciones de Storybook (`@storybook/html-vite`) en planet-explorer

Este proyecto usa `@storybook/html-vite` (sin framework de UI, sin docgen automático). Esto tiene implicaciones que NO son evidentes y que ya causaron bugs reales en esta sesión — léelas antes de tocar cualquier `*.stories.ts`.

## `argTypes` explícitos son obligatorios

`@storybook/html-vite` no infiere props/args desde el código (no hay react-docgen ni equivalente). Si un arg (por ejemplo `onClick`) no se declara explícitamente en `argTypes`, Storybook **no sabe que existe**: no aparece control, y tampoco se registra ninguna acción, sin importar la configuración de `parameters.actions`.

MUST: declarar en `argTypes` cada arg público del componente, incluidos los handlers de eventos:

```ts
argTypes: {
  label: { control: 'text' },
  disabled: { control: 'boolean' },
  onClick: { action: 'clicked', control: false },
}
```

## No dupliques la detección de acciones

`.storybook/preview.ts` desactiva la detección automática por regex (`parameters.actions.argTypesRegex: '^$'`) precisamente porque el regex por defecto de Storybook Essentials (`^on[A-Z].*`) coincide con cualquier arg `onX` y, si ADEMÁS ese arg tiene `action: 'clicked'` explícito en su `argTypes`, la acción se dispara **dos veces** por cada click (una por el regex, otra por el `action` explícito).

- MUST NOT reactivar `argTypesRegex` a su valor por defecto sin también quitar el `action:` explícito de los `argTypes` correspondientes (o viceversa). Elige un único mecanismo.
- El patrón estable de este repo: `argTypesRegex: '^$'` (global, en `preview.ts`) + `action: 'clicked'` explícito por cada handler (en el `argTypes` de cada story).

## Síntomas → causa

- **"Actions" no muestra nada al hacer click** → falta declarar el arg (`onClick`, etc.) en `argTypes` del meta/story.
- **"Actions" muestra la entrada duplicada** (p. ej. `onClick: []` y `clicked: {...}`) → el arg tiene `action:` explícito Y el regex de `argTypesRegex` sigue activo para ese nombre.

## Stories que se ven "vacías" a propósito

Si una story representa un estado visualmente vacío por diseño (p. ej. un botón que solo expone `ariaLabel` sin icono, porque el proyecto aún no integra una librería de iconos), NO renombres ni "arregles" el componente — documenta la intención en la propia story:

```ts
parameters: {
  docs: {
    description: {
      story: 'Vacío visualmente a propósito: sin librería de iconos integrada todavía (ver contrato del componente).',
    },
  },
},
```

Nombra la story de forma descriptiva del estado real (p. ej. `SoloEtiquetaAccesible`), no de una supuesta feature que no existe (`SoloIcono` cuando no hay icono).

## Referencias

- Configuración global: `.storybook/preview.ts`, `.storybook/main.ts`.
- Ejemplo de referencia completo: `libs/components/button/Button.stories.ts`.
- Convención estructural de componentes: `libs/components/README.md` y `docs/conventions/components/structure.md`.
- Nomenclatura (`title`, `autodocs`) y cobertura de historias por estado/variante: `docs/conventions/components/storybook.md`.
