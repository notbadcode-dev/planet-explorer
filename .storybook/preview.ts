import type { Preview } from '@storybook/html-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Desactiva la detección automática de acciones por nombre de arg
    // (`^on[A-Z].*`), que duplicaría el registro cuando un argType ya declara
    // su propio `action:` explícito (ver `Button.stories.ts`).
    actions: {
      argTypesRegex: '^$',
    },
  },
};

export default preview;
