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

## Evidencia de cumplimiento (auditoría T038/T045)

Auditoría realizada por inspección directa de `libs/components/{input,panel,badge,progress,dialog}/*.ts` tras completar las Fases 1-8:

- **Ausencia de lógica de dominio (FR-004)**: ninguno de los cinco componentes importa, referencia o condiciona su comportamiento a conceptos de juego/educación/astronomía (progresión, expediciones, planetas, puntuación, logros). Los únicos textos temáticos ("Nombre de planeta", "Explorar planeta", "Carga de misión") aparecen exclusivamente como copy de ejemplo en `*.stories.ts` y no condicionan lógica de render ni de estado.
- **R1-R3 (`Input`)**: verificado en `Input.ts` — nombre accesible vía `label`/`ariaLabel`, `aria-invalid` cuando existe `error`, `aria-describedby` uniendo `hint`/`error` en orden estable.
- **R4 (`Panel`)**: verificado en `Panel.ts` — `content` se añade mediante `append(...toNodes(content))`, preservando el orden de entrada.
- **R5-R6 (`Badge`/`Panel`)**: verificado en `Badge.ts`/`Panel.ts` — icono siempre renderizado vía `createIcon` de `../icon`; cada variante semántica añade un icono de estado automático (independiente del icono opcional del consumidor) como señal no cromática.
- **R7-R8 (`Progress`)**: verificado en `Progress.ts` — `resolveMax`/`clampValue` normalizan valores fuera de rango; nombre accesible resuelto por `label`/`ariaLabel` con fallback.
- **R9-R11 (`Dialog`)**: verificado en `Dialog.ts` — `role="dialog"` + `aria-modal` + `aria-label`; foco inicial, trap de `Tab`/`Shift+Tab` y restauración de foco al invocador; `content`/`actions` aceptan `HTMLElement | HTMLElement[]`.
- **R12 (API estable)**: las cinco interfaces públicas (`InputProps`, `PanelProps`, `BadgeProps`, `ProgressProps`, `DialogProps`) coinciden con las firmas de este contrato sin campos añadidos fuera de plan.

Validación automatizada de respaldo: `npm run lint` (incluye `check-components.mjs`), `npm test`, `npm run build`, `npm run build-storybook` — todos en verde en la última ejecución.