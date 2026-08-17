import type { Meta, StoryObj } from '@storybook/html-vite';
import type { SpinnerProps } from './index';
import { createSpinner } from './index';

const meta: Meta<SpinnerProps> = {
    title: 'Componentes/Spinner',
    tags: ['autodocs'],
    render: (args) => createSpinner(args),
    argTypes: {
        size: { control: 'select', options: ['small', 'medium', 'large'] },
    },
    args: {
        label: 'Cargando misión…',
    },
};

export default meta;

type Story = StoryObj<SpinnerProps>;

export const Small: Story = {
    args: { size: 'small' },
};

export const Medium: Story = {
    args: { size: 'medium' },
};

export const Large: Story = {
    args: { size: 'large' },
};

export const WithLabel: Story = {
    args: {
        size: 'medium',
        label: 'Cargando misión…',
    },
};

export const WithAriaLabel: Story = {
    args: {
        size: 'medium',
        label: undefined,
        ariaLabel: 'Procesando solicitud',
    },
};
