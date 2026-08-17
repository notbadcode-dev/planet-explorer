import type { Meta, StoryObj } from '@storybook/html-vite';
import { createButton } from '../button';
import { attachTooltip } from './index';

const meta: Meta = {
    title: 'Componentes/Tooltip',
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
    render: () => {
        const wrapper = document.createElement('div');
        const target = createButton({ label: 'Pasa el ratón o enfoca', onClick: () => {} });
        attachTooltip({
            target,
            content: 'Un planeta enano es más pequeño que un planeta pero orbita el Sol.',
        });
        wrapper.append(target);
        return wrapper;
    },
};

export const Placements: Story = {
    render: () => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = '2rem';

        (['top', 'bottom', 'left', 'right'] as const).forEach((placement) => {
            const target = createButton({ label: placement, onClick: () => {} });
            attachTooltip({ target, content: 'Texto de ayuda breve', placement });
            wrapper.append(target);
        });

        return wrapper;
    },
};

export const OnDisabledElement: Story = {
    render: () => {
        const wrapper = document.createElement('div');
        const target = createButton({ label: 'Función bloqueada', onClick: () => {}, disabled: true });
        attachTooltip({
            target,
            content: 'Disponible al completar el nivel anterior.',
        });
        wrapper.append(target);
        return wrapper;
    },
};
