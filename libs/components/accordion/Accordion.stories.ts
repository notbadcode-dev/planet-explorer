import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAccordion } from './index';

function createContent(text: string): HTMLElement {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
}

const meta: Meta = {
    title: 'Componentes/Accordion',
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
    render: () =>
        createAccordion({
            sections: [
                { id: 'moons', title: '¿Cuántas lunas tiene?', content: createContent('Tiene 2 lunas: Fobos y Deimos.') },
                { id: 'rings', title: '¿Tiene anillos?', content: createContent('No, Marte no tiene anillos.') },
            ],
        }),
};

export const MultipleExpanded: Story = {
    render: () =>
        createAccordion({
            sections: [
                { id: 'moons', title: '¿Cuántas lunas tiene?', content: createContent('Tiene 2 lunas: Fobos y Deimos.') },
                { id: 'rings', title: '¿Tiene anillos?', content: createContent('No, Marte no tiene anillos.') },
                { id: 'color', title: '¿Por qué es rojo?', content: createContent('Por el óxido de hierro en su superficie.') },
            ],
            defaultExpandedIds: ['moons', 'color'],
        }),
};

export const EmptySection: Story = {
    render: () =>
        createAccordion({
            sections: [{ id: 'empty', title: 'Próximamente', content: document.createElement('div') }],
        }),
};

export const ExclusiveExpansion: Story = {
    render: () =>
        createAccordion({
            sections: [
                { id: 'moons', title: '¿Cuántas lunas tiene?', content: createContent('Tiene 2 lunas: Fobos y Deimos.') },
                { id: 'rings', title: '¿Tiene anillos?', content: createContent('No, Marte no tiene anillos.') },
                { id: 'color', title: '¿Por qué es rojo?', content: createContent('Por el óxido de hierro en su superficie.') },
            ],
            exclusive: true,
            defaultExpandedIds: ['moons'],
        }),
    parameters: {
        docs: {
            description: {
                story: 'Con `exclusive: true`, expandir una sección colapsa automáticamente el resto.',
            },
        },
    },
};

export const EmptySectionsArray: Story = {
    render: () =>
        createAccordion({
            sections: [],
            exclusive: false,
        }),
    parameters: {
        docs: {
            description: {
                story: 'Con `sections` vacío (0 elementos), el accordion no renderiza nada.',
            },
        },
    },
};

export const ExclusiveNoExpanded: Story = {
    render: () =>
        createAccordion({
            sections: [
                { id: 'moons', title: '¿Cuántas lunas tiene?', content: createContent('Tiene 2 lunas: Fobos y Deimos.') },
                { id: 'rings', title: '¿Tiene anillos?', content: createContent('No, Marte no tiene anillos.') },
            ],
            exclusive: true,
            defaultExpandedIds: [],
        }),
    parameters: {
        docs: {
            description: {
                story: 'Con `exclusive: true` y ninguna sección preexpandida, el usuario puede expandir una sección a su elección.',
            },
        },
    },
};
