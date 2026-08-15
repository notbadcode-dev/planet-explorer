import { describe, it, expect, vi } from 'vitest';
import { BUTTON_ICON_CLASS, BUTTON_SIZES, BUTTON_VARIANTS } from './Button.constants';
import { createButton, type ButtonSize, type ButtonVariant } from './Button';

describe('createButton', () => {
    it('renderiza un elemento <button> nativo con el label proporcionado', () => {
        const button = createButton({ label: 'Explorar', onClick: () => {} });

        expect(button).toBeInstanceOf(HTMLButtonElement);
        expect(button.tagName).toBe('BUTTON');
        expect(button.textContent).toBe('Explorar');
    });

    it('refleja el atributo nativo disabled cuando disabled es true', () => {
        const enabledButton = createButton({ label: 'Explorar', onClick: () => {} });
        const disabledButton = createButton({
            label: 'Explorar',
            onClick: () => {},
            disabled: true,
        });

        expect(enabledButton.disabled).toBe(false);
        expect(disabledButton.disabled).toBe(true);
    });

    it('NO invoca onClick cuando el botón está deshabilitado y se activa', () => {
        const onClick = vi.fn();
        const button = createButton({ label: 'Explorar', onClick, disabled: true });

        button.click();

        expect(onClick).not.toHaveBeenCalled();
    });

    it('invoca onClick cuando el botón está habilitado y se activa', () => {
        const onClick = vi.fn();
        const button = createButton({ label: 'Explorar', onClick });

        button.click();

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('expone un nombre accesible a partir de ariaLabel cuando no hay label visible', () => {
        const button = createButton({ ariaLabel: 'Cerrar', onClick: () => {} });

        expect(button.textContent).toBe('');
        expect(button.getAttribute('aria-label')).toBe('Cerrar');
    });

    it('renderiza un icono decorativo cuando se proporciona icon', () => {
        const button = createButton({ label: 'Explorar', onClick: () => {}, icon: 'rocket' });
        const icon = button.querySelector('svg');

        expect(icon).toBeInstanceOf(SVGElement);
        expect(icon?.classList.contains(BUTTON_ICON_CLASS)).toBe(true);
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('permite colocar el icono después de la etiqueta visible', () => {
        const button = createButton({
            label: 'Explorar',
            onClick: () => {},
            icon: 'rocket',
            iconPosition: 'end',
        });

        expect(button.lastElementChild?.tagName.toLowerCase()).toBe('svg');
        expect(button.textContent).toBe('Explorar');
    });

    it('lanza un error de desarrollo si no se proporciona label ni ariaLabel', () => {
        expect(() => createButton({ onClick: () => {} } as never)).toThrow();
    });

    describe('variant', () => {
        it.each([...BUTTON_VARIANTS.map((variant) => [variant, `button--${variant}`] as const)])(
            'aplica la clase %s cuando variant es "%s"',
            (variant, expectedClass) => {
                const button = createButton({ label: 'Acción', onClick: () => {}, variant });

                expect(button.classList.contains(expectedClass)).toBe(true);
            },
        );

        it('hace fallback a "button--primary" cuando variant no pertenece al catálogo cerrado', () => {
            const button = createButton({
                label: 'Acción',
                onClick: () => {},
                variant: 'inexistente' as unknown as ButtonVariant,
            });

            expect(button.classList.contains('button--primary')).toBe(true);
        });

        it('sigue exigiendo label o ariaLabel al combinarse con cualquier variant/size', () => {
            expect(() =>
                createButton({
                    onClick: () => {},
                    variant: 'danger',
                    size: 'small',
                } as never),
            ).toThrow();
        });
    });

    describe('size', () => {
        it.each([...BUTTON_SIZES.map((size) => [size, `button--${size}`] as const)])(
            'aplica la clase %s cuando size es "%s"',
            (size, expectedClass) => {
                const button = createButton({ label: 'Acción', onClick: () => {}, size });

                expect(button.classList.contains(expectedClass)).toBe(true);
            },
        );

        it('hace fallback a "button--medium" cuando size no pertenece al catálogo cerrado', () => {
            const button = createButton({
                label: 'Acción',
                onClick: () => {},
                size: 'inexistente' as unknown as ButtonSize,
            });

            expect(button.classList.contains('button--medium')).toBe(true);
        });
    });

    describe('compatibilidad retroactiva (sin variant/size explícitos)', () => {
        it('aplica "button--primary button--medium" por defecto', () => {
            const button = createButton({ label: 'Explorar', onClick: () => {} });

            expect(button.classList.contains('button--primary')).toBe(true);
            expect(button.classList.contains('button--medium')).toBe(true);
        });

        it('sigue bloqueando onClick cuando disabled es true, para cualquier combinación de variant/size', () => {
            const onClick = vi.fn();
            const button = createButton({
                label: 'Eliminar',
                onClick,
                disabled: true,
                variant: 'danger',
                size: 'small',
            });

            button.click();

            expect(onClick).not.toHaveBeenCalled();
        });
    });
});
