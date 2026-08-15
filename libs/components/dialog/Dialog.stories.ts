import type { Meta, StoryObj } from '@storybook/html-vite';
import { createButton } from '../button';
import { createDialog, type DialogProps } from './index';

const meta: Meta<DialogProps> = {
    title: 'Componentes/Dialog',
    render: (args) => createDialog(args),
    argTypes: {
        title: { control: 'text' },
        description: { control: 'text' },
        content: { control: false },
        actions: { control: false },
        closeLabel: { control: 'text' },
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
