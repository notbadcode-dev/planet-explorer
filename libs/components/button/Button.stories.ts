import type { Meta, StoryObj } from '@storybook/html-vite';
import {
    BUTTON_ICON_POSITIONS,
    BUTTON_SIZES,
    BUTTON_VARIANTS,
    createButton,
    type ButtonProps,
} from './index';
import { APP_ICON_NAMES } from '../icon';

const meta: Meta<ButtonProps> = {
    title: 'Componentes/Button',
    render: (args) => createButton(args),
    argTypes: {
        label: { control: 'text' },
        ariaLabel: { control: 'text' },
        disabled: { control: 'boolean' },
        variant: { control: 'select', options: BUTTON_VARIANTS },
        size: { control: 'select', options: BUTTON_SIZES },
        icon: { control: 'select', options: APP_ICON_NAMES },
        iconPosition: { control: 'radio', options: BUTTON_ICON_POSITIONS },
        // `html-vite` no tiene docgen automático: hay que declarar el argType de
        // `onClick` explícitamente para que Storybook lo reconozca y lo registre
        // en el panel "Actions". La detección automática por regex (`on[A-Z]`)
        // está desactivada en `.storybook/preview.ts` para evitar un doble registro.
        onClick: { action: 'clicked', control: false },
    },
    args: {
        label: 'Explorar planeta',
        disabled: false,
        // No se define un valor explícito para `onClick`: dejarlo así permite que
        // el addon "Actions" genere el espía a partir de `argTypes.onClick.action`.
    },
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Enabled: Story = {
    args: {
        label: 'Explorar planeta',
        icon: 'rocket',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Explorar planeta',
        disabled: true,
        icon: 'rocket',
    },
};

export const SoloEtiquetaAccesible: Story = {
    args: {
        label: undefined,
        ariaLabel: 'Cerrar',
        icon: 'star',
    },
    parameters: {
        docs: {
            description: {
                story: 'Renderiza un botón sin etiqueta visible y con icono decorativo. Sigue siendo accesible gracias a `ariaLabel`.',
            },
        },
    },
};

export const Secondary: Story = {
    args: {
        label: 'Cancelar',
        variant: 'secondary',
        icon: 'orbit',
    },
};

export const Danger: Story = {
    args: {
        label: 'Eliminar',
        variant: 'danger',
        icon: 'trash',
    },
};

export const Small: Story = {
    args: {
        label: 'Explorar planeta',
        size: 'small',
        icon: 'rocket',
    },
};

export const Large: Story = {
    args: {
        label: 'Explorar planeta',
        size: 'large',
        icon: 'sparkles',
    },
};

export const DeshabilitadoConVariante: Story = {
    args: {
        label: 'Eliminar',
        variant: 'danger',
        size: 'small',
        disabled: true,
        icon: 'trash',
    },
    parameters: {
        docs: {
            description: {
                story: 'Verifica que el tratamiento visual de deshabilitado se aplica de forma consistente incluso en combinaciones de `variant`/`size` distintas de las por defecto (FR-006).',
            },
        },
    },
};
