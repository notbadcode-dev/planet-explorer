import type { Meta, StoryObj } from '@storybook/html-vite';
import { createInput, type InputProps } from './index';

const meta: Meta<InputProps> = {
    title: 'Componentes/Input',
    tags: ['autodocs'],
    render: (args) => createInput(args),
    argTypes: {
        value: { control: 'text' },
        placeholder: { control: 'text' },
        label: { control: 'text' },
        ariaLabel: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        onInput: { action: 'input', control: false },
    },
    args: {
        label: 'Nombre de planeta',
        placeholder: 'Escribe aqui',
    },
};

export default meta;

type Story = StoryObj<InputProps>;

export const Playground: Story = {
    args: {
        hint: 'Se mostrara en la tarjeta de exploracion',
    },
};

export const Default: Story = {
    args: {
        label: 'Nombre de planeta',
        placeholder: 'Escribe aqui',
        hint: undefined,
        error: undefined,
    },
};

export const WithHelp: Story = {
    args: {
        hint: 'Se mostrara en la tarjeta de exploracion',
        error: undefined,
    },
};

export const WithError: Story = {
    args: {
        value: 'Kepler-9',
        error: 'Ya existe un planeta con ese nombre',
        hint: undefined,
    },
};

export const Disabled: Story = {
    args: {
        value: 'Kepler-9',
        disabled: true,
        hint: undefined,
        error: undefined,
    },
};

export const WithoutVisibleLabel: Story = {
    args: {
        label: undefined,
        ariaLabel: 'Buscar planeta',
        placeholder: 'Buscar...',
        hint: undefined,
        error: undefined,
    },
    parameters: {
        docs: {
            description: {
                story: 'Renderiza un input sin etiqueta visible. Sigue siendo accesible gracias a `ariaLabel`.',
            },
        },
    },
};

export const WithHelpAndError: Story = {
    args: {
        value: 'Kepler-9',
        hint: 'Se mostrara en la tarjeta de exploracion',
        error: 'Ya existe un planeta con ese nombre',
    },
    parameters: {
        docs: {
            description: {
                story: 'Combina `hint` y `error` simultaneamente; ambos se vinculan a `aria-describedby` en el mismo orden.',
            },
        },
    },
};

export const Small: Story = {
    args: {
        size: 'small',
        hint: undefined,
        error: undefined,
    },
};

export const Medium: Story = {
    args: {
        size: 'medium',
        hint: undefined,
        error: undefined,
    },
};

export const Large: Story = {
    args: {
        size: 'large',
        hint: undefined,
        error: undefined,
    },
};
