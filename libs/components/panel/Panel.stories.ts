import type { Meta, StoryObj } from '@storybook/html-vite';
import { createPanel, type PanelProps } from './index';

function createParagraph(text: string): HTMLParagraphElement {
    const element = document.createElement('p');
    element.textContent = text;
    return element;
}

const meta: Meta<PanelProps> = {
    title: 'Componentes/Panel',
    tags: ['autodocs'],
    render: (args) => createPanel(args),
    argTypes: {
        title: { control: 'text' },
        description: { control: 'text' },
        variant: { control: 'select', options: ['default', 'highlight', 'danger'] },
        content: { control: false },
    },
    args: {
        title: 'Panel base',
        description: 'Resumen rapido de estado',
        content: createParagraph('Contenido compuesto de ejemplo.'),
    },
};

export default meta;

type Story = StoryObj<PanelProps>;

export const Playground: Story = {};

export const Default: Story = {
    args: {
        variant: 'default',
    },
};

export const Highlight: Story = {
    args: {
        variant: 'highlight',
        title: 'Panel destacado',
        content: createParagraph('Contenido destacado de ejemplo.'),
    },
};

export const Danger: Story = {
    args: {
        variant: 'danger',
        title: 'Panel critico',
        content: createParagraph('Contenido de alerta de ejemplo.'),
    },
};

export const MultipleContent: Story = {
    args: {
        variant: 'default',
        title: 'Panel con contenido compuesto',
        content: [
            createParagraph('Primer bloque de contenido.'),
            createParagraph('Segundo bloque de contenido.'),
        ],
    },
    parameters: {
        docs: {
            description: {
                story: '`content` recibe un arreglo de elementos; el orden de insercion se preserva.',
            },
        },
    },
};
