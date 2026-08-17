import { describe, expect, it } from 'vitest';
import {
    ICON_ARIA_HIDDEN_ATTRIBUTE,
    ICON_ARIA_LABEL_ATTRIBUTE,
    ICON_BASE_CLASS,
    ICON_DEFAULT_FILL,
    ICON_DEFAULT_SIZE,
    ICON_FILL_ATTRIBUTE,
    ICON_FOCUSABLE_ATTRIBUTE,
    ICON_ROLE_ATTRIBUTE,
    ICON_ROLE_IMAGE_VALUE,
} from './Icon.constants';
import { createIcon } from './Icon';

describe('createIcon', () => {
    it('renderiza un SVG de Phosphor del catálogo local', () => {
        const icon = createIcon({ name: 'rocket' });

        expect(icon).toBeInstanceOf(SVGElement);
        expect(icon.classList.contains(ICON_BASE_CLASS)).toBe(true);
        expect(icon.getAttribute('width')).toBe(String(ICON_DEFAULT_SIZE));
        expect(icon.getAttribute('height')).toBe(String(ICON_DEFAULT_SIZE));
        expect(icon.getAttribute(ICON_FILL_ATTRIBUTE)).toBe(ICON_DEFAULT_FILL);
    });

    it('renderiza iconos decorativos por defecto', () => {
        const icon = createIcon({ name: 'star' });

        expect(icon.getAttribute(ICON_ARIA_HIDDEN_ATTRIBUTE)).toBe('true');
        expect(icon.getAttribute(ICON_FOCUSABLE_ATTRIBUTE)).toBe('false');
        expect(icon.hasAttribute(ICON_ARIA_LABEL_ATTRIBUTE)).toBe(false);
    });

    it('permite crear un icono con nombre accesible cuando representa contenido', () => {
        const icon = createIcon({ name: 'orbit', ariaLabel: 'Planeta' });

        expect(icon.getAttribute(ICON_ROLE_ATTRIBUTE)).toBe(ICON_ROLE_IMAGE_VALUE);
        expect(icon.getAttribute(ICON_ARIA_LABEL_ATTRIBUTE)).toBe('Planeta');
        expect(icon.hasAttribute(ICON_ARIA_HIDDEN_ATTRIBUTE)).toBe(false);
    });

    it('añade clases de consumidor conservando la clase base', () => {
        const icon = createIcon({ name: 'trash', className: 'button__icon' });

        expect(icon.classList.contains(ICON_BASE_CLASS)).toBe(true);
        expect(icon.classList.contains('button__icon')).toBe(true);
    });

    it('renderiza iconos del catálogo no usados en stories: sparkles', () => {
        const icon = createIcon({ name: 'sparkles' });
        expect(icon.querySelector('path')).not.toBeNull();
    });

    it('renderiza iconos del catálogo no usados en stories: star', () => {
        const icon = createIcon({ name: 'star' });
        expect(icon.querySelector('path')).not.toBeNull();
    });

    it('renderiza iconos del catálogo no usados en stories: check-circle', () => {
        const icon = createIcon({ name: 'check-circle' });
        expect(icon.querySelector('path')).not.toBeNull();
    });

    it('renderiza iconos del catálogo no usados en stories: warning-circle', () => {
        const icon = createIcon({ name: 'warning-circle' });
        expect(icon.querySelector('path')).not.toBeNull();
    });

    it('renderiza iconos del catálogo no usados en stories: x-circle', () => {
        const icon = createIcon({ name: 'x-circle' });
        expect(icon.querySelector('path')).not.toBeNull();
    });

    it('renderiza iconos del catálogo no usados en stories: info-circle', () => {
        const icon = createIcon({ name: 'info-circle' });
        expect(icon.querySelector('path')).not.toBeNull();
    });

    it('renderiza iconos del catálogo no usados en stories: caret-down', () => {
        const icon = createIcon({ name: 'caret-down' });
        expect(icon.querySelector('path')).not.toBeNull();
    });

    it('combina ariaLabel con tamaño personalizado', () => {
        const icon = createIcon({ name: 'rocket', ariaLabel: 'Lanzar', size: 64 });
        expect(icon.getAttribute('aria-label')).toBe('Lanzar');
        expect(icon.getAttribute('width')).toBe('64');
        expect(icon.getAttribute('height')).toBe('64');
    });

    it('combina tamaño personalizado con fill personalizado', () => {
        const icon = createIcon({ name: 'star', size: 72, fill: '#ff00ff' });
        expect(icon.getAttribute('width')).toBe('72');
        expect(icon.getAttribute('height')).toBe('72');
        expect(icon.getAttribute('fill')).toBe('#ff00ff');
    });
});
