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
    tags: ['autodocs'],
    render: (args) => createButton(args),
    argTypes: {
        label: { control: 'text' },
        ariaLabel: { control: 'text' },
        disabled: { control: 'boolean' },
        variant: { control: 'select', options: BUTTON_VARIANTS },
        size: { control: 'select', options: BUTTON_SIZES },
        icon: { control: 'select', options: APP_ICON_NAMES },
        iconPosition: { control: 'radio', options: BUTTON_ICON_POSITIONS },
        tooltip: { control: 'text' },
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

export const AccessibleLabelOnly: Story = {
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

export const DisabledWithVariant: Story = {
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

export const WithTooltip: Story = {
    args: {
        label: undefined,
        ariaLabel: 'Cerrar',
        icon: 'star',
        tooltip: 'Cerrar',
    },
    parameters: {
        docs: {
            description: {
                story: 'Botón icon-only sin texto visible: `tooltip` es opcional y, cuando se informa, se adjunta mediante `attachTooltip` para reforzar el nombre accesible con ayuda visual en hover/foco.',
            },
        },
    },
};

export const WithoutIcon: Story = {
    args: {
        label: 'Aceptar',
        icon: undefined,
    },
};

export const SecondarySmall: Story = {
    args: {
        label: 'Cancelar',
        variant: 'secondary',
        size: 'small',
    },
};

export const SecondaryLarge: Story = {
    args: {
        label: 'Siguiente',
        variant: 'secondary',
        size: 'large',
    },
};

export const DangerLarge: Story = {
    args: {
        label: 'Eliminar permanentemente',
        variant: 'danger',
        size: 'large',
        icon: 'trash',
    },
};

export const IconEnd: Story = {
    args: {
        label: 'Descargar',
        icon: 'rocket',
        iconPosition: 'end',
    },
};

export const SecondaryDisabledLarge: Story = {
    args: {
        label: 'Siguiente',
        variant: 'secondary',
        size: 'large',
        disabled: true,
    },
};
