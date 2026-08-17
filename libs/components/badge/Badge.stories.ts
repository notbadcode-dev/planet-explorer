import type { Meta, StoryObj } from '@storybook/html-vite';
import { APP_ICON_NAMES } from '../icon';
import { createBadge, type BadgeProps } from './index';

const meta: Meta<BadgeProps> = {
    title: 'Componentes/Badge',
    tags: ['autodocs'],
    render: (args) => createBadge(args),
    argTypes: {
        label: { control: 'text' },
        variant: { control: 'select', options: ['default', 'success', 'warning', 'danger', 'info'] },
        icon: { control: 'select', options: APP_ICON_NAMES },
        tooltip: { control: 'text' },
    },
    args: {
        label: 'Estado',
        variant: 'default',
    },
};

export default meta;

type Story = StoryObj<BadgeProps>;

export const Playground: Story = {};

export const Default: Story = {
    args: {
        label: 'Estado',
        variant: 'default',
    },
};

export const Success: Story = {
    args: {
        label: 'Completado',
        variant: 'success',
    },
};

export const Warning: Story = {
    args: {
        label: 'Atencion',
        variant: 'warning',
    },
};

export const Danger: Story = {
    args: {
        label: 'Critico',
        variant: 'danger',
    },
};

export const Info: Story = {
    args: {
        label: 'Informativo',
        variant: 'info',
    },
};

export const WithConsumerIcon: Story = {
    args: {
        label: 'Favorito',
        variant: 'success',
        icon: 'star',
    },
    parameters: {
        docs: {
            description: {
                story: 'Combina el icono de estado automatico de la variante con un icono adicional provisto por el consumidor (`icon`).',
            },
        },
    },
};

export const WithTooltip: Story = {
    args: {
        label: 'Racha x3',
        variant: 'info',
        tooltip: 'Has completado 3 desafios seguidos sin fallar.',
    },
    parameters: {
        docs: {
            description: {
                story: '`tooltip` es opcional: si se informa, se adjunta mediante `attachTooltip` para dar contexto adicional sin depender solo del texto corto del badge.',
            },
        },
    },
};

export const DefaultWithIcon: Story = {
    args: {
        label: 'Nuevo',
        variant: 'default',
        icon: 'sparkles',
    },
};

export const WarningWithIcon: Story = {
    args: {
        label: 'Revisa',
        variant: 'warning',
        icon: 'warning-circle',
    },
};

export const DangerWithIcon: Story = {
    args: {
        label: 'Crítico',
        variant: 'danger',
        icon: 'x-circle',
    },
};

export const DefaultWithTooltip: Story = {
    args: {
        label: 'Desbloqueado',
        variant: 'default',
        tooltip: 'Este logro ya fue alcanzado.',
    },
};

export const WarningWithTooltip: Story = {
    args: {
        label: 'Incompleto',
        variant: 'warning',
        tooltip: 'Aún no completaste todos los requisitos.',
    },
};

export const DangerWithTooltip: Story = {
    args: {
        label: 'Error',
        variant: 'danger',
        tooltip: 'Hubo un problema al procesar tu solicitud.',
    },
};
