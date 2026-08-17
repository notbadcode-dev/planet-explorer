import { describe, expect, it, vi } from 'vitest';
import { createDialog } from './Dialog';

describe('createDialog', () => {
    it('renderiza dialogo accesible con accion de cierre', () => {
        const onClose = vi.fn();
        const dialog = createDialog({
            title: 'Confirmar salida',
            onClose,
        });

        const container = dialog.querySelector('[role="dialog"]');
        const closeButton = dialog.querySelector('button');

        closeButton?.click();

        expect(container).toBeInstanceOf(HTMLElement);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('expone atributos ARIA obligatorios', () => {
        const dialog = createDialog({
            title: 'Modal de confirmación',
            onClose: () => {},
        });

        const dialogElement = dialog.querySelector('[role="dialog"]') as HTMLElement;

        expect(dialogElement.getAttribute('role')).toBe('dialog');
        expect(dialogElement.getAttribute('aria-modal')).toBe('true');
        expect(dialogElement.getAttribute('aria-label')).toBe('Modal de confirmación');
    });

    it('renderiza contenido y acciones compuestas', () => {
        const content = document.createElement('p');
        content.textContent = 'Contenido importante del modal';

        const action = document.createElement('button');
        action.textContent = 'Aceptar';

        const dialog = createDialog({
            title: 'Confirmación',
            content,
            actions: action,
            onClose: () => {},
        });

        const dialogContent = dialog.querySelector('[role="dialog"]');

        expect(dialogContent?.textContent).toContain('Contenido importante del modal');
        expect(dialogContent?.textContent).toContain('Aceptar');
    });

    it('cierra el diálogo al pulsar Escape', () => {
        const onClose = vi.fn();
        const dialog = createDialog({
            title: 'Modal con Escape',
            onClose,
        });

        const dialogElement = dialog.querySelector('[role="dialog"]') as HTMLElement;
        const event = new KeyboardEvent('keydown', {
            key: 'Escape',
        });

        dialogElement.dispatchEvent(event);

        expect(onClose).toHaveBeenCalled();
    });

    it('solo cierra con Escape, no con otras teclas', () => {
        const onClose = vi.fn();
        const dialog = createDialog({
            title: 'Modal selectivo',
            onClose,
        });

        const dialogElement = dialog.querySelector('[role="dialog"]') as HTMLElement;
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });

        dialogElement.dispatchEvent(enterEvent);
        dialogElement.dispatchEvent(tabEvent);

        expect(onClose).not.toHaveBeenCalled();
    });

    it('renderiza botón de cierre interactivo', () => {
        const onClose = vi.fn();
        const dialog = createDialog({
            title: 'Modal con botón',
            onClose,
        });

        const closeButtons = dialog.querySelectorAll('button');

        expect(closeButtons.length).toBeGreaterThan(0);

        closeButtons[0].click();

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('coloca el foco inicial dentro del diálogo al abrirse', async () => {
        const dialog = createDialog({
            title: 'Modal con foco inicial',
            onClose: () => {},
        });
        document.body.append(dialog);

        await Promise.resolve();

        const closeButton = dialog.querySelector('button');

        expect(document.activeElement).toBe(closeButton);

        dialog.remove();
    });

    it('atrapa el foco con Tab dentro del diálogo', async () => {
        const onClose = vi.fn();
        const extraAction = document.createElement('button');
        extraAction.textContent = 'Confirmar';

        const dialog = createDialog({
            title: 'Modal con trap de foco',
            actions: extraAction,
            onClose,
        });
        document.body.append(dialog);

        await Promise.resolve();

        const dialogElement = dialog.querySelector('[role="dialog"]') as HTMLElement;
        const buttons = dialogElement.querySelectorAll('button');
        const closeButton = buttons[0];
        const confirmButton = buttons[1];

        confirmButton.focus();
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        dialogElement.dispatchEvent(tabEvent);

        expect(document.activeElement).toBe(closeButton);

        dialog.remove();
    });

    it('restaura el foco al elemento invocador al cerrar', async () => {
        const invoker = document.createElement('button');
        invoker.textContent = 'Abrir modal';
        document.body.append(invoker);
        invoker.focus();

        const onClose = vi.fn();
        const dialog = createDialog({
            title: 'Modal con retorno de foco',
            onClose,
        });
        document.body.append(dialog);

        await Promise.resolve();

        const closeButton = dialog.querySelector('button') as HTMLButtonElement;
        closeButton.click();

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(document.activeElement).toBe(invoker);

        invoker.remove();
    });

    it('aplica el tamaño medium por defecto', () => {
        const dialog = createDialog({
            title: 'Modal por defecto',
            onClose: () => {},
        });

        const container = dialog.querySelector('.dialog__container');

        expect(container?.classList.contains('dialog--medium')).toBe(true);
    });

    it('aplica la clase modificadora para cada tamaño soportado', () => {
        const small = createDialog({ title: 'Modal pequeño', size: 'small', onClose: () => {} });
        const large = createDialog({ title: 'Modal grande', size: 'large', onClose: () => {} });

        expect(small.querySelector('.dialog__container')?.classList.contains('dialog--small')).toBe(true);
        expect(large.querySelector('.dialog__container')?.classList.contains('dialog--large')).toBe(true);
    });

    it('usa medium como fallback ante un tamaño no soportado', () => {
        const dialog = createDialog({
            title: 'Modal con tamaño inválido',
            // @ts-expect-error valor inválido a propósito para probar el fallback en runtime
            size: 'huge',
            onClose: () => {},
        });

        expect(dialog.querySelector('.dialog__container')?.classList.contains('dialog--medium')).toBe(true);
    });
});
