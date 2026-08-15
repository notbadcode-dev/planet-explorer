import type { Meta, StoryObj } from '@storybook/html-vite';
import { createProgress, type ProgressProps } from './index';

const meta: Meta<ProgressProps> = {
    title: 'Componentes/Progress',
    render: (args) => createProgress(args),
    argTypes: {
        value: { control: 'number' },
        max: { control: 'number' },
        label: { control: 'text' },
        ariaLabel: { control: 'text' },
        showValue: { control: 'boolean' },
    },
    args: {
        value: 35,
        max: 100,
        label: 'Carga de mision',
        showValue: true,
    },
};

export default meta;

type Story = StoryObj<ProgressProps>;

export const Playground: Story = {};
