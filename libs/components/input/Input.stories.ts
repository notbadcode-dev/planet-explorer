import type { Meta, StoryObj } from '@storybook/html-vite';
import { createInput, type InputProps } from './index';

const meta: Meta<InputProps> = {
    title: 'Componentes/Input',
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
