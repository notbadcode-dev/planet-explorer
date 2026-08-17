import type { Meta, StoryObj } from '@storybook/html-vite';
import { createTabs, type TabsProps } from './index';

function createPanel(text: string): HTMLParagraphElement {
    const element = document.createElement('p');
    element.textContent = text;
    return element;
}

const meta: Meta<TabsProps> = {
    title: 'Componentes/Tabs',
    tags: ['autodocs'],
    render: (args) => createTabs(args),
    argTypes: {
        tabs: { control: false },
        activeTabId: { control: 'text' },
        onChange: { action: 'change', control: false },
    },
    args: {
        tabs: [
            { id: 'facts', label: 'Datos', panel: createPanel('Marte es el cuarto planeta desde el Sol.') },
            { id: 'trivia', label: 'Curiosidades', panel: createPanel('Marte tiene la montaña más alta del sistema solar.') },
        ],
    },
};

export default meta;

type Story = StoryObj<TabsProps>;

export const Playground: Story = {};

export const Default: Story = {
    args: {
        tabs: [
            { id: 'facts', label: 'Datos', panel: createPanel('Marte es el cuarto planeta desde el Sol.') },
            { id: 'trivia', label: 'Curiosidades', panel: createPanel('Marte tiene la montaña más alta del sistema solar.') },
        ],
    },
};

export const ThreeSections: Story = {
    args: {
        tabs: [
            { id: 'facts', label: 'Datos', panel: createPanel('Marte es el cuarto planeta desde el Sol.') },
            { id: 'trivia', label: 'Curiosidades', panel: createPanel('Marte tiene la montaña más alta del sistema solar.') },
            { id: 'quiz', label: 'Quiz', panel: createPanel('Pon a prueba lo aprendido sobre Marte.') },
        ],
        activeTabId: 'quiz',
    },
};

export const EmptyPanel: Story = {
    args: {
        tabs: [
            { id: 'facts', label: 'Datos', panel: createPanel('Marte es el cuarto planeta desde el Sol.') },
            // @ts-expect-error demostración deliberada de pestaña sin panel asociado (VAL-1304)
            { id: 'trivia', label: 'Curiosidades' },
        ],
    },
    parameters: {
        docs: {
            description: {
                story: 'Una pestaña sin `panel` asociado se renderiza igualmente, con su panel vacío, sin romper la navegación (VAL-1304).',
            },
        },
    },
};

export const WithDisabledTab: Story = {
    args: {
        tabs: [
            { id: 'facts', label: 'Datos', panel: createPanel('Marte es el cuarto planeta desde el Sol.') },
            {
                id: 'trivia',
                label: 'Curiosidades',
                panel: createPanel('Marte tiene la montaña más alta del sistema solar.'),
                disabled: true,
            },
            { id: 'quiz', label: 'Quiz', panel: createPanel('Pon a prueba lo aprendido sobre Marte.') },
        ],
    },
    parameters: {
        docs: {
            description: {
                story: 'Una pestaña con `disabled: true` se omite en clic, teclado y navegación con flechas (FR-041).',
            },
        },
    },
};

export const WithIcons: Story = {
    args: {
        tabs: [
            {
                id: 'facts',
                label: 'Datos',
                panel: createPanel('Marte es el cuarto planeta desde el Sol.'),
                icon: 'orbit',
            },
            {
                id: 'trivia',
                label: 'Curiosidades',
                panel: createPanel('Marte tiene la montaña más alta del sistema solar.'),
                icon: 'sparkles',
            },
        ],
    },
    parameters: {
        docs: {
            description: {
                story: 'Todas las pestañas definen `icon` (validación todo-o-nada, FR-042).',
            },
        },
    },
};

export const WithTooltipOnTab: Story = {
    args: {
        tabs: [
            { id: 'facts', label: 'Datos', panel: createPanel('Marte es el cuarto planeta desde el Sol.') },
            {
                id: 'trivia',
                label: 'Curiosidades',
                panel: createPanel('Marte tiene la montaña más alta del sistema solar.'),
                tooltip: 'Datos poco conocidos y sorprendentes sobre Marte.',
            },
        ],
    },
    parameters: {
        docs: {
            description: {
                story: '`tooltip` es opcional por pestaña: si se informa, se adjunta mediante `attachTooltip` sobre el botón de esa pestaña concreta.',
            },
        },
    },
};
export const SingleTab: Story = {
    args: {
        tabs: [
            { id: 'solo', label: 'Información', panel: createPanel('Solo una pestaña en este componente.') },
        ],
    },
};

export const WithIconAndTooltip: Story = {
    args: {
        tabs: [
            {
                id: 'facts',
                label: 'Datos',
                panel: createPanel('Marte es el cuarto planeta desde el Sol.'),
                icon: 'orbit',
                tooltip: 'Hechos verificables sobre Marte.',
            },
            {
                id: 'trivia',
                label: 'Curiosidades',
                panel: createPanel('Marte tiene la montaña más alta del sistema solar.'),
                icon: 'sparkles',
                tooltip: 'Datos poco conocidos y sorprendentes.',
            },
        ],
    },
};

export const DisabledTabWithIcon: Story = {
    args: {
        tabs: [
            {
                id: 'facts',
                label: 'Datos',
                panel: createPanel('Marte es el cuarto planeta desde el Sol.'),
                icon: 'orbit',
            },
            {
                id: 'trivia',
                label: 'Curiosidades',
                panel: createPanel('Marte tiene la montaña más alta del sistema solar.'),
                icon: 'sparkles',
                disabled: true,
            },
            { id: 'quiz', label: 'Quiz', panel: createPanel('Pon a prueba lo aprendido.'), icon: 'star' },
        ],
    },
};

export const DisabledTabWithTooltip: Story = {
    args: {
        tabs: [
            { id: 'facts', label: 'Datos', panel: createPanel('Marte es el cuarto planeta desde el Sol.') },
            {
                id: 'trivia',
                label: 'Próximamente',
                panel: createPanel(''),
                disabled: true,
                tooltip: 'Esta sección está en desarrollo.',
            },
        ],
    },
};