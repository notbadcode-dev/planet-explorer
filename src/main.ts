import './styles/index.css';

import { createBadge } from '../libs/components/badge';
import { createIcon } from '../libs/components/icon';
import { createPanel } from '../libs/components/panel';

const APP_TITLE = 'Explorador Espacial';
const UNDER_CONSTRUCTION_LABEL = 'En construcción';
const PANEL_DESCRIPTION =
    'Estamos preparando la próxima misión. Muy pronto podrás explorar el sistema solar aquí.';
const STORYBOOK_NOTE =
    'Mientras tanto, la librería de componentes se revisa en Storybook (npm run storybook).';

function createUnderConstructionScreen(): HTMLElement {
    const logo = document.createElement('div');
    logo.classList.add('app-shell__logo');
    logo.append(createIcon({ name: 'rocket', size: 32 }));
    logo.append(document.createTextNode(APP_TITLE));

    const note = document.createElement('p');
    note.textContent = STORYBOOK_NOTE;

    const badge = createBadge({ label: UNDER_CONSTRUCTION_LABEL, variant: 'info', icon: 'sparkles' });
    badge.classList.add('app-shell__badge');

    const panel = createPanel({
        variant: 'highlight',
        description: PANEL_DESCRIPTION,
        content: [note, badge],
    });
    panel.classList.add('app-shell__panel');

    const shell = document.createElement('div');
    shell.classList.add('app-shell');
    shell.append(logo, panel);

    return shell;
}

const rootElement = document.querySelector('#app');
rootElement?.append(createUnderConstructionScreen());
