import type { Meta, StoryObj } from '@storybook/html-vite';
import { createProgress, type ProgressProps } from './index';

const meta: Meta<ProgressProps> = {
    title: 'Componentes/Progress',
    tags: ['autodocs'],
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

export const Empty: Story = {
    args: {
        value: 0,
        max: 100,
        label: 'Carga de mision',
    },
};

export const Partial: Story = {
    args: {
        value: 35,
        max: 100,
        label: 'Carga de mision',
    },
};

export const Complete: Story = {
    args: {
        value: 100,
        max: 100,
        label: 'Carga de mision',
    },
};

export const OutOfRange: Story = {
    args: {
        value: 150,
        max: 100,
        label: 'Carga de mision',
    },
    parameters: {
        docs: {
            description: {
                story: 'El valor recibido (150) supera `max` (100); se normaliza de forma determinista al limite superior.',
            },
        },
    },
};

export const WithoutVisibleValue: Story = {
    args: {
        value: 35,
        max: 100,
        label: 'Carga de mision',
        showValue: false,
    },
};

export const NegativeValue: Story = {
    args: {
        value: -20,
        max: 100,
        label: 'Carga de mision',
    },
    parameters: {
        docs: {
            description: {
                story: 'El valor recibido (-20) es negativo; se normaliza de forma determinista al minimo (0).',
            },
        },
    },
};

export const WithoutLabel: Story = {
    args: {
        label: undefined,
        ariaLabel: 'Progreso de descarga',
    },
};

export const WithAriaLabelNoVisibleLabel: Story = {
    args: {
        label: undefined,
        ariaLabel: 'Carga del juego',
        value: 75,
    },
};
