import type { Meta, StoryObj } from '@storybook/html-vite';
import { APP_ICON_NAMES } from '../icon';
import { createCardTile, type CardTileProps } from './index';

const meta: Meta<CardTileProps> = {
    title: 'Componentes/CardTile',
    tags: ['autodocs'],
    render: (args) => createCardTile(args),
    argTypes: {
        title: { control: 'text' },
        icon: { control: 'select', options: APP_ICON_NAMES },
        imageSrc: { control: 'text' },
        imageAlt: { control: 'text' },
        statusLabel: { control: 'text' },
        statusVariant: { control: 'select', options: ['default', 'success', 'warning', 'danger', 'info'] },
        locked: { control: 'boolean' },
        tooltip: { control: 'text' },
        onSelect: { action: 'select', control: false },
    },
    args: {
        title: 'Marte',
        icon: 'orbit',
        statusLabel: 'Descubierto',
        statusVariant: 'success',
    },
};

export default meta;

type Story = StoryObj<CardTileProps>;

export const Playground: Story = {};

export const Default: Story = {
    args: {
        title: 'Marte',
        icon: 'orbit',
        statusLabel: 'Descubierto',
        statusVariant: 'success',
        locked: false,
    },
};

export const Locked: Story = {
    args: {
        title: '???',
        icon: 'orbit',
        statusLabel: 'Bloqueado',
        statusVariant: 'default',
        locked: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Estado bloqueado: `onSelect` no se dispara y `aria-disabled="true"` comunica el estado a tecnologías de asistencia.',
            },
        },
    },
};

const EARTH_ILLUSTRATION_SVG =
    'data:image/svg+xml,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">' +
            '<circle cx="48" cy="48" r="44" fill="#2f6fed" />' +
            '<path d="M20 30c10-6 22 4 34-2s18 10 26 4v14c-8 6-16-6-26 0s-24-4-34 2z" fill="#3fb27f" />' +
            '<circle cx="48" cy="48" r="44" fill="none" stroke="#0b1120" stroke-width="2" />' +
            '</svg>',
    );

export const WithImage: Story = {
    args: {
        title: 'Tierra',
        icon: undefined,
        imageSrc: EARTH_ILLUSTRATION_SVG,
        imageAlt: 'Ilustración de la Tierra',
        statusLabel: 'Descubierto',
        statusVariant: 'success',
    },
};

export const WithoutState: Story = {
    args: {
        title: 'Venus',
        icon: 'orbit',
        statusLabel: undefined,
        statusVariant: undefined,
    },
    parameters: {
        docs: {
            description: {
                story: '`statusLabel` es opcional; sin él, la tarjeta no renderiza `Badge`.',
            },
        },
    },
};

export const WithTooltip: Story = {
    args: {
        title: 'Marte',
        icon: 'orbit',
        statusLabel: 'Descubierto',
        statusVariant: 'success',
        tooltip: 'Cuarto planeta desde el Sol. Toca para ver la expedición.',
    },
    parameters: {
        docs: {
            description: {
                story: '`tooltip` es opcional: si se informa, se adjunta mediante `attachTooltip` para dar contexto adicional en hover/foco.',
            },
        },
    },
};

export const WithImageAndTooltip: Story = {
    args: {
        title: 'Tierra',
        icon: undefined,
        imageSrc: EARTH_ILLUSTRATION_SVG,
        imageAlt: 'Ilustración de la Tierra',
        statusLabel: 'Descubierto',
        statusVariant: 'success',
        tooltip: 'Nuestro hogar. Haz clic para explorar.',
    },
};

export const StatusWarning: Story = {
    args: {
        title: 'Venus',
        icon: 'orbit',
        statusLabel: 'Progreso limitado',
        statusVariant: 'warning',
    },
};

export const StatusDanger: Story = {
    args: {
        title: 'Plutón',
        icon: 'orbit',
        statusLabel: 'No explorado',
        statusVariant: 'danger',
    },
};

export const StatusInfo: Story = {
    args: {
        title: 'Mercurio',
        icon: 'orbit',
        statusLabel: 'En investigación',
        statusVariant: 'info',
    },
};

export const WithoutStatusVariant: Story = {
    args: {
        title: 'Júpiter',
        icon: 'orbit',
        statusLabel: 'Descubierto',
        statusVariant: undefined,
    },
};
