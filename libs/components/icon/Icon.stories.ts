import type { Meta, StoryObj } from '@storybook/html-vite';
import { APP_ICON_NAMES, createIcon, type IconProps } from './index';

const meta: Meta<IconProps> = {
    title: 'Componentes/Icon',
    tags: ['autodocs'],
    render: (args) => createIcon(args),
    argTypes: {
        name: { control: 'select', options: APP_ICON_NAMES },
        className: { control: 'text' },
        size: { control: 'number' },
        fill: { control: 'color' },
        ariaLabel: { control: 'text' },
    },
    args: {
        name: 'rocket',
        size: 48,
        fill: 'currentColor',
    },
};

export default meta;

type Story = StoryObj<IconProps>;

export const Decorative: Story = {
    args: {
        name: 'rocket',
    },
};

export const Accessible: Story = {
    args: {
        name: 'orbit',
        ariaLabel: 'Planeta',
    },
};

export const Danger: Story = {
    args: {
        name: 'trash',
        fill: 'var(--color-danger)',
    },
};

export const Sparkles: Story = {
    args: {
        name: 'sparkles',
    },
};

export const Star: Story = {
    args: {
        name: 'star',
        fill: 'var(--color-warning)',
    },
};

export const CheckCircle: Story = {
    args: {
        name: 'check-circle',
        fill: 'var(--color-success)',
    },
};

export const WarningCircle: Story = {
    args: {
        name: 'warning-circle',
        fill: 'var(--color-warning)',
    },
};

export const XCircle: Story = {
    args: {
        name: 'x-circle',
        fill: 'var(--color-danger)',
    },
};

export const InfoCircle: Story = {
    args: {
        name: 'info-circle',
        fill: 'var(--color-info)',
    },
};

export const CaretDown: Story = {
    args: {
        name: 'caret-down',
    },
};

export const WithAccessibleLabelAndCustomSize: Story = {
    args: {
        name: 'rocket',
        ariaLabel: 'Lanzar expedición',
        size: 64,
    },
};

export const LargeWithFill: Story = {
    args: {
        name: 'star',
        size: 72,
        fill: 'var(--color-gradient-primary-start)',
    },
};
