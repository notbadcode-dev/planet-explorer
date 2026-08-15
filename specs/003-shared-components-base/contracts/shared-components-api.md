---
title: "Contrato: API pública de componentes compartidos base"
feature: "003-shared-components-base"
type: "contract"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [contract, ui, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Contrato: API pública de componentes compartidos base

## Propósito

Definir la interfaz pública mínima y estable para `Input`, `Panel`, `Badge`, `Progress` y `Dialog`, incluyendo reglas obligatorias de accesibilidad y composición.

## Puntos de entrada

Cada componente expone su API desde su `index.ts` dentro de `libs/components/<component-name>/`.

## Firmas públicas mínimas

```ts
interface InputProps {
    value?: string;
    placeholder?: string;
    label?: string;
    ariaLabel?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    onInput: (value: string) => void;
}

interface PanelProps {
    title?: string;
    description?: string;
    variant?: 'default' | 'highlight' | 'danger';
    content: HTMLElement | HTMLElement[];
}

interface BadgeProps {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    icon?: IconName;
}

interface ProgressProps {
    value: number;
    max?: number;
    label?: string;
    ariaLabel?: string;
    showValue?: boolean;
}

interface DialogProps {
    title: string;
    description?: string;
    content?: HTMLElement | HTMLElement[];
    actions?: HTMLElement | HTMLElement[];
    onClose: () => void;
    closeLabel?: string;
}
```

## Reglas de contrato

- R1: `Input` MUST renderizar un `<input>` nativo y garantizar nombre accesible por `label` o `ariaLabel`.
- R2: `Input` MUST activar `aria-invalid` cuando exista `error`.
- R3: `Input` MUST vincular `hint` y/o `error` mediante `aria-describedby` cuando existan.
- R4: `Panel` MUST aceptar composición por `HTMLElement | HTMLElement[]` preservando orden.
- R5: `Badge` MUST exigir `label` y, si usa icono, MUST consumirlo vía `Icon`.
- R6: `Badge` y `Panel` MUST distinguir variantes sin depender solo del color.
- R7: `Progress` MUST exponer indicador accesible y normalizar valores fuera de rango.
- R8: `Progress` MUST tener nombre accesible por `label` o `ariaLabel`.
- R9: `Dialog` MUST exponer semántica accesible de diálogo modal y acción clara de cierre.
- R10: `Dialog` MUST soportar flujo completo de teclado: foco inicial interno, trap Tab, Escape cierra y retorno al invocador.
- R11: `Dialog` MUST permitir composición de `content` y `actions` con `HTMLElement | HTMLElement[]`.
- R12: La API pública de cada componente MUST permanecer pequeña y estable; cambios mayores requieren nueva feature spec.

## Fuera de alcance

- Theming dinámico por consumidor.
- Layout responsivo de pantallas completas.
- Extensiones de comportamiento específicas de dominio (juego/educación/astronomía).