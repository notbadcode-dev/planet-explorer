import type { Meta, StoryObj } from '@storybook/html-vite';
import { createCheckboxGroup, type CheckboxGroupProps } from './index';

const OPTIONS = [
    { value: 'mercury', label: 'Mercurio' },
    { value: 'venus', label: 'Venus' },
    { value: 'earth', label: 'Tierra' },
    { value: 'mars', label: 'Marte' },
];

const meta: Meta<CheckboxGroupProps> = {
    title: 'Componentes/CheckboxGroup',
    tags: ['autodocs'],
    render: (args) => createCheckboxGroup(args),
    argTypes: {
        options: { control: false },
        values: { control: false },
        legend: { control: 'text' },
        ariaLabel: { control: 'text' },
        onChange: { action: 'change', control: false },
    },
    args: {
        options: OPTIONS,
        legend: 'Selecciona todos los planetas rocosos',
    },
};

export default meta;

type Story = StoryObj<CheckboxGroupProps>;

export const Playground: Story = {};

export const Default: Story = {
    args: {
        values: undefined,
    },
};

export const WithPreselectedOptions: Story = {
    args: {
        values: ['mercury', 'venus', 'earth'],
    },
};

const OPTIONS_CON_TOOLTIP = [
    { value: 'mercury', label: 'Mercurio', tooltip: 'El planeta más cercano al Sol.' },
    { value: 'venus', label: 'Venus' },
    { value: 'earth', label: 'Tierra' },
    { value: 'mars', label: 'Marte' },
];

export const WithTooltipOnOption: Story = {
    args: {
        options: OPTIONS_CON_TOOLTIP,
        legend: 'Selecciona todos los planetas rocosos',
    },
    parameters: {
        docs: {
            description: {
                story: '`tooltip` es opcional por opción: si se informa, se adjunta mediante `attachTooltip` sobre el área completa (etiqueta + control) de esa opción.',
            },
        },
    },
};
