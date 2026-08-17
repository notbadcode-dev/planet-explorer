import type { Meta, StoryObj } from '@storybook/html-vite';
import { createSlider, type SliderProps } from './index';

const meta: Meta<SliderProps> = {
    title: 'Componentes/Slider',
    tags: ['autodocs'],
    render: (args) => createSlider(args),
    argTypes: {
        value: { control: 'number' },
        min: { control: 'number' },
        max: { control: 'number' },
        step: { control: 'number' },
        label: { control: 'text' },
        ariaLabel: { control: 'text' },
        disabled: { control: 'boolean' },
        showValue: { control: 'boolean' },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        tooltip: { control: 'text' },
        onChange: { action: 'changed', control: false },
    },
    args: {
        label: 'Volumen',
        min: 0,
        max: 100,
        step: 5,
        value: 40,
        showValue: true,
    },
};

export default meta;

type Story = StoryObj<SliderProps>;

export const Default: Story = {};

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

export const WithoutVisibleValue: Story = {
    args: {
        showValue: false,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const OutOfRange: Story = {
    args: {
        value: 999,
    },
    parameters: {
        docs: {
            description: {
                story: 'El valor recibido (999) supera `max` (100); se normaliza de forma determinista al límite superior.',
            },
        },
    },
};

export const WithoutVisibleLabel: Story = {
    args: {
        label: undefined,
        ariaLabel: 'Volumen',
    },
    parameters: {
        docs: {
            description: {
                story: 'Sin etiqueta visible: el nombre accesible se expone mediante `ariaLabel` para tecnologías de asistencia.',
            },
        },
    },
};

export const WithTooltip: Story = {
    args: {
        label: 'Dificultad',
        tooltip: 'Ajusta cuánto tiempo tienes para responder cada desafío.',
    },
    parameters: {
        docs: {
            description: {
                story: '`tooltip` es opcional: si se informa, se adjunta mediante `attachTooltip` sobre el contenedor completo del slider.',
            },
        },
    },
};

export const WithAriaLabelNoVisibleLabel: Story = {
    args: {
        label: undefined,
        ariaLabel: 'Volumen de música',
    },
};

export const WithTooltipNoLabel: Story = {
    args: {
        label: undefined,
        ariaLabel: 'Dificultad',
        tooltip: 'Cuánto tiempo tienes para responder cada desafío.',
    },
};
