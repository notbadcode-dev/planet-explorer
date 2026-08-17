import type { Meta, StoryObj } from '@storybook/html-vite';
import { createRadioGroup, type RadioGroupProps } from './index';

const OPTIONS = [
    { value: 'jupiter', label: 'Júpiter' },
    { value: 'saturn', label: 'Saturno' },
    { value: 'mars', label: 'Marte' },
];

const meta: Meta<RadioGroupProps> = {
    title: 'Componentes/RadioGroup',
    tags: ['autodocs'],
    render: (args) => createRadioGroup(args),
    argTypes: {
        name: { control: 'text' },
        options: { control: false },
        value: { control: 'text' },
        legend: { control: 'text' },
        ariaLabel: { control: 'text' },
        onChange: { action: 'change', control: false },
    },
    args: {
        name: 'quiz-planeta-mas-grande',
        options: OPTIONS,
        legend: '¿Cuál es el planeta más grande del sistema solar?',
    },
};

export default meta;

type Story = StoryObj<RadioGroupProps>;

export const Playground: Story = {};

export const Default: Story = {
    args: {
        value: undefined,
    },
};

export const WithPreselectedOption: Story = {
    args: {
        value: 'jupiter',
    },
};

const OPTIONS_CON_TOOLTIP = [
    { value: 'jupiter', label: 'Júpiter', tooltip: 'El planeta más grande del sistema solar.' },
    { value: 'saturn', label: 'Saturno' },
    { value: 'mars', label: 'Marte' },
];

export const WithTooltipOnOption: Story = {
    args: {
        name: 'quiz-planeta-mas-grande-tooltip',
        options: OPTIONS_CON_TOOLTIP,
        legend: '¿Cuál es el planeta más grande del sistema solar?',
    },
    parameters: {
        docs: {
            description: {
                story: '`tooltip` es opcional por opción: si se informa, se adjunta mediante `attachTooltip` sobre el área completa (etiqueta + control) de esa opción.',
            },
        },
    },
};
