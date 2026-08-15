import '../src/styles/index.css';
import type { Preview } from '@storybook/html-vite';

const preview: Preview = {
    decorators: [
        (story) => {
            const container = document.createElement('div');
            container.style.minHeight = '100vh';
            container.style.padding = 'var(--space-8)';
            container.style.background = 'var(--gradient-surface)';
            container.append(story());

            return container;
        },
    ],
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
