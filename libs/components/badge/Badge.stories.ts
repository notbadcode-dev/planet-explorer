import type { Meta, StoryObj } from '@storybook/html-vite';
import { APP_ICON_NAMES } from '../icon';
import { createBadge, type BadgeProps } from './index';

const meta: Meta<BadgeProps> = {
    title: 'Componentes/Badge',
    render: (args) => createBadge(args),
    argTypes: {
        label: { control: 'text' },
        variant: { control: 'select', options: ['default', 'success', 'warning', 'danger', 'info'] },
        icon: { control: 'select', options: APP_ICON_NAMES },
    },
    args: {
        label: 'Estado',
        variant: 'default',
    },
};

export default meta;

type Story = StoryObj<BadgeProps>;

export const Playground: Story = {};
