import type { Preview } from '@storybook/html-vite';
import '../src/styles/index.css';

const preview: Preview = {
    decorators: [
        (story, context) => {
            // Storybook aplica un `padding` propio al `body` de la vista previa;
            // lo neutralizamos para que solo el padding del contenedor (más
            // abajo) determine el espacio visual, evitando un scroll de página
            // adicional cuando el contenido ocupa exactamente el viewport.
            document.body.style.padding = 'var(--space-0)';
            const container = document.createElement('div');
            // `min-height` solo fija un piso visual (fondo/padding cubriendo
            // el viewport); el contenido real puede crecer más allá sin
            // recortarse. Los overlays `position: fixed` (p. ej. Dialog)
            // gestionan su propio scroll interno cuando exceden el viewport.
            container.style.boxSizing = 'border-box';
            container.style.minHeight = context.viewMode === 'docs' ? 'auto' : '100vh';
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
