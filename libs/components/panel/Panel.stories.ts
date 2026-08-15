import type { Meta, StoryObj } from '@storybook/html-vite';
import { createPanel, type PanelProps } from './index';

function createParagraph(text: string): HTMLParagraphElement {
    const element = document.createElement('p');
    element.textContent = text;
    return element;
}

const meta: Meta<PanelProps> = {
    title: 'Componentes/Panel',
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
