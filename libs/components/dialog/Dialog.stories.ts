import type { Meta, StoryObj } from '@storybook/html-vite';
import { createButton } from '../button';
import { createDialog, type DialogProps } from './index';

const meta: Meta<DialogProps> = {
    title: 'Componentes/Dialog',
    tags: ['autodocs'],
    render: (args) => createDialog(args),
    // El overlay del diálogo usa `position: fixed`, que se posiciona respecto
    // a la ventana raíz. En la vista "Docs" cada historia se renderiza normalmente
    // "inline" (sin iframe propio), lo que hace que el `fixed` ignore el pequeño
    // recuadro de previsualización y se posicione respecto a toda la página.
    // Forzamos un iframe real por historia para que el diálogo quede contenido.
    parameters: {
        docs: {
            story: { inline: false, iframeHeight: 400 },
        },
    },
    argTypes: {
        title: { control: 'text' },
        description: { control: 'text' },
        content: { control: false },
        actions: { control: false },
        closeLabel: { control: 'text' },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        onClose: { action: 'close', control: false },
    },
    args: {
        title: 'Dialogo base',
        description: 'Confirma la accion para continuar.',
    },
};

export default meta;

type Story = StoryObj<DialogProps>;

export const Playground: Story = {
    args: {
        content: (() => {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Contenido de ejemplo para el modal.';
            return paragraph;
        })(),
        actions: createButton({
            label: 'Confirmar',
            onClick: () => {},
        }),
    },
};

export const Base: Story = {
    args: {
        content: (() => {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Contenido de ejemplo para el modal.';
            return paragraph;
        })(),
        actions: undefined,
    },
};

export const WithComposedActions: Story = {
    args: {
        content: (() => {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Confirma la accion para continuar.';
            return paragraph;
        })(),
        actions: [
            createButton({ label: 'Cancelar', variant: 'secondary', onClick: () => {} }),
            createButton({ label: 'Confirmar', onClick: () => {} }),
        ],
    },
};

export const WithThreeActions: Story = {
    args: {
        content: (() => {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Con 3 o mas acciones de confirmacion, el dialogo crece su ancho minimo para que quepan en una sola fila, aunque la talla elegida (`size`) se quede corta.';
            return paragraph;
        })(),
        actions: [
            createButton({ label: 'Guardar como borrador', variant: 'secondary', onClick: () => {} }),
            createButton({ label: 'Descartar', variant: 'danger', onClick: () => {} }),
            createButton({ label: 'Publicar', onClick: () => {} }),
        ],
    },
    parameters: {
        docs: {
            description: {
                story: 'El ancho minimo real del dialogo aumenta segun el numero de botones de accion (ver `Dialog.css`), independientemente del `size` elegido.',
            },
        },
    },
};

export const WithoutDescription: Story = {
    args: {
        description: undefined,
        content: (() => {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Este dialogo no incluye descripcion.';
            return paragraph;
        })(),
        actions: undefined,
    },
};

export const WithContentAndMultipleActions: Story = {
    args: {
        content: [
            (() => {
                const paragraph = document.createElement('p');
                paragraph.textContent = 'Primer bloque de contenido del modal.';
                return paragraph;
            })(),
            (() => {
                const paragraph = document.createElement('p');
                paragraph.textContent = 'Segundo bloque de contenido del modal.';
                return paragraph;
            })(),
        ],
        actions: [
            createButton({ label: 'Cancelar', variant: 'secondary', onClick: () => {} }),
            createButton({ label: 'Eliminar', variant: 'danger', onClick: () => {} }),
        ],
    },
    parameters: {
        docs: {
            description: {
                story: '`content` y `actions` reciben un arreglo de elementos cada uno; el orden de insercion se preserva.',
            },
        },
    },
};

export const WithCustomCloseLabel: Story = {
    args: {
        closeLabel: 'Descartar',
        content: (() => {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'El texto del boton de cierre por defecto puede personalizarse.';
            return paragraph;
        })(),
        actions: undefined,
    },
};

export const Small: Story = {
    args: {
        size: 'small',
        content: (() => {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Dialogo de tamano pequeno.';
            return paragraph;
        })(),
        actions: undefined,
    },
};

export const Medium: Story = {
    args: {
        size: 'medium',
        content: (() => {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Dialogo de tamano medio (por defecto).';
            return paragraph;
        })(),
        actions: undefined,
    },
};

export const Large: Story = {
    args: {
        size: 'large',
        content: (() => {
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Dialogo de tamano grande.';
            return paragraph;
        })(),
        actions: undefined,
    },
};

export const InteractiveFromButton: Story = {
    render: () => {
        const wrapper = document.createElement('div');
        const invoker = createButton({
            label: 'Abrir dialogo',
            onClick: () => {
                const overlay = createDialog({
                    title: 'Dialogo interactivo',
                    description: 'Este dialogo se abre desde un boton real y devuelve el foco al cerrarse.',
                    content: (() => {
                        const paragraph = document.createElement('p');
                        paragraph.textContent = 'Cierra el dialogo y comprueba que el foco vuelve al boton "Abrir dialogo".';
                        return paragraph;
                    })(),
                    onClose: () => {
                        overlay.remove();
                    },
                });
                wrapper.append(overlay);
            },
        });
        wrapper.append(invoker);
        return wrapper;
    },
    parameters: {
        docs: {
            description: {
                story: 'Historia completamente interactiva: abre el dialogo desde un boton real del canvas y demuestra el retorno de foco al cerrarlo (Escape o boton de cierre).',
            },
        },
    },
};


