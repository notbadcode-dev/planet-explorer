import type { Meta, StoryObj } from '@storybook/html-vite';
import { APP_ICON_NAMES, createIcon, type IconProps } from './index';

const meta: Meta<IconProps> = {
    title: 'Componentes/Icon',
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
        fill: 'var(--color-danger-text)',
    },
};
