import type { Meta, StoryObj } from '@storybook/html-vite';
import { createButton } from '../button';
import { showToast, type ToastProps } from './index';

const meta: Meta<ToastProps> = {
    title: 'Componentes/Toast',
    tags: ['autodocs'],
    render: (args) => {
        const wrapper = document.createElement('div');
        const trigger = createButton({
            label: 'Mostrar toast',
            onClick: () => showToast(args),
        });
        wrapper.append(trigger);
        return wrapper;
    },
    argTypes: {
        message: { control: 'text' },
        variant: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
        durationMs: { control: 'number' },
    },
    args: {
        message: '¡Correcto! Has encontrado 3 muestras.',
        variant: 'info',
    },
};

export default meta;

type Story = StoryObj<ToastProps>;

export const Info: Story = {
    args: {
        message: 'Guardado automáticamente.',
        variant: 'info',
    },
};

export const Success: Story = {
    args: {
        message: '¡Correcto! Has encontrado 3 muestras.',
        variant: 'success',
    },
};

export const Warning: Story = {
    args: {
        message: 'Te quedan pocos intentos.',
        variant: 'warning',
    },
};

export const Danger: Story = {
    args: {
        message: 'Respuesta incorrecta.',
        variant: 'danger',
    },
};

export const Stacked: Story = {
    render: () => {
        const wrapper = document.createElement('div');
        const trigger = createButton({
            label: 'Mostrar 3 toasts apilados',
            onClick: () => {
                showToast({ message: 'Primero', variant: 'info' });
                showToast({ message: 'Segundo', variant: 'success' });
                showToast({ message: 'Tercero', variant: 'warning' });
            },
        });
        wrapper.append(trigger);
        return wrapper;
    },
    parameters: {
        docs: {
            description: {
                story: 'Varias instancias activas se apilan simultáneamente sin descartar ni retrasar ninguna (VAL-1503).',
            },
        },
    },
};
