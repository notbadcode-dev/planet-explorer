import type { Meta, StoryObj } from '@storybook/html-vite';
import { createSelect, type SelectProps } from './index';

const OPTIONS = [
    { value: 'mars', label: 'Marte' },
    { value: 'venus', label: 'Venus' },
    { value: 'earth', label: 'Tierra' },
];

const meta: Meta<SelectProps> = {
    title: 'Componentes/Select',
    tags: ['autodocs'],
    render: (args) => createSelect(args),
    argTypes: {
        options: { control: false },
        value: { control: 'text' },
        label: { control: 'text' },
        ariaLabel: { control: 'text' },
        disabled: { control: 'boolean' },
        hint: { control: 'text' },
        error: { control: 'text' },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        onChange: { action: 'change', control: false },
    },
    args: {
        options: OPTIONS,
        label: 'Planeta',
    },
};

export default meta;

type Story = StoryObj<SelectProps>;

export const Playground: Story = {};

export const Default: Story = {
    args: {
        options: OPTIONS,
        label: 'Planeta',
        value: undefined,
    },
};

export const WithPreselectedValue: Story = {
    args: {
        options: OPTIONS,
        label: 'Planeta',
        value: 'venus',
    },
};

export const WithoutVisibleLabel: Story = {
    args: {
        options: OPTIONS,
        label: undefined,
        ariaLabel: 'Selecciona un planeta',
    },
    parameters: {
        docs: {
            description: {
                story: 'Renderiza un select sin etiqueta visible. Sigue siendo accesible gracias a `ariaLabel`.',
            },
        },
    },
};

export const WithoutOptions: Story = {
    args: {
        options: [],
        label: 'Planeta',
    },
    parameters: {
        docs: {
            description: {
                story: 'Con `options` vacío, el control se renderiza deshabilitado con una opción de marcador de posición, sin lanzar error en runtime.',
            },
        },
    },
};

export const WithSingleOption: Story = {
    args: {
        options: [{ value: 'jupiter', label: 'Júpiter' }],
    },
};

export const WithNonMatchingValue: Story = {
    args: {
        value: 'no-existe',
    },
};

export const WithHint: Story = {
    args: {
        hint: 'Podrás cambiarlo más adelante',
    },
};

export const WithError: Story = {
    args: {
        error: 'Selecciona un planeta para continuar',
    },
};

export const WithHintAndError: Story = {
    args: {
        hint: 'Podrás cambiarlo más adelante',
        error: 'Selecciona un planeta para continuar',
    },
    parameters: {
        docs: {
            description: {
                story: 'Combina `hint` y `error` simultáneamente; ambos se vinculan a `aria-describedby` en el mismo orden.',
            },
        },
    },
};

export const Small: Story = {
    args: {
        size: 'small',
    },
};

export const Medium: Story = {
    args: {
        size: 'medium',
    },
};

export const Large: Story = {
    args: {
        size: 'large',
    },
};
