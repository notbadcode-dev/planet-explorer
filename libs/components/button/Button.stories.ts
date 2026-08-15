import type { Meta, StoryObj } from '@storybook/html-vite';
import { createButton, type ButtonProps } from './index';

const meta: Meta<ButtonProps> = {
  title: 'Componentes/Button',
  render: (args) => createButton(args),
  argTypes: {
    label: { control: 'text' },
    ariaLabel: { control: 'text' },
    disabled: { control: 'boolean' },
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    // `html-vite` no tiene docgen automático: hay que declarar el argType de
    // `onClick` explícitamente para que Storybook lo reconozca y lo registre
    // en el panel "Actions". La detección automática por regex (`on[A-Z]`)
    // está desactivada en `.storybook/preview.ts` para evitar un doble registro.
    onClick: { action: 'clicked', control: false },
  },
  args: {
    label: 'Explorar planeta',
    disabled: false,
    // No se define un valor explícito para `onClick`: dejarlo así permite que
    // el addon "Actions" genere el espía a partir de `argTypes.onClick.action`.
  },
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Enabled: Story = {
  args: {
    label: 'Explorar planeta',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Explorar planeta',
    disabled: true,
  },
};

export const SoloEtiquetaAccesible: Story = {
  args: {
    label: undefined,
    ariaLabel: 'Cerrar',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Este proyecto no cuenta (todavía) con una librería de iconos, por lo que el botón se ve visualmente vacío a propósito: sigue siendo accesible gracias a `ariaLabel`, pero no renderiza ningún icono. Los iconos incorporados están fuera de alcance de esta primera versión (ver contrato del componente).',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    label: 'Cancelar',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    label: 'Eliminar',
    variant: 'danger',
  },
};

export const Small: Story = {
  args: {
    label: 'Explorar planeta',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    label: 'Explorar planeta',
    size: 'large',
  },
};

export const DeshabilitadoConVariante: Story = {
  args: {
    label: 'Eliminar',
    variant: 'danger',
    size: 'small',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Verifica que el tratamiento visual de deshabilitado se aplica de forma consistente incluso en combinaciones de `variant`/`size` distintas de las por defecto (FR-006).',
      },
    },
  },
};
