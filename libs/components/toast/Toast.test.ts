import { afterEach, describe, expect, it, vi } from 'vitest';
import { showToast } from './Toast';
import { DEFAULT_TOAST_DURATION_MS, TOAST_EXIT_DURATION_MS } from './Toast.constants';

describe('showToast', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.useRealTimers();
    });

    it('se anuncia mediante una región accesible en vivo aria-live="polite" sin robar el foco (VAL-1502)', () => {
        const focusedBefore = document.activeElement;

        showToast({ message: 'Correcto' });

        const container = document.querySelector('.toast-container');
        expect(container?.getAttribute('aria-live')).toBe('polite');
        expect(document.activeElement).toBe(focusedBefore);
    });

    it('no exige cierre obligatorio ni atrapa el foco de teclado (VAL-1504)', () => {
        showToast({ message: 'Correcto' });

        const toast = document.querySelector('.toast');
        expect(toast?.querySelector('button')).toBeNull();
        expect(toast?.getAttribute('tabindex')).toBeNull();
    });

    it('usa 4000 ms como duración por defecto antes de auto-descartarse (VAL-1501)', () => {
        vi.useFakeTimers();
        const onDismiss = vi.fn();

        showToast({ message: 'Correcto', onDismiss });

        expect(document.querySelectorAll('.toast')).toHaveLength(1);

        vi.advanceTimersByTime(3999);
        expect(document.querySelectorAll('.toast')).toHaveLength(1);
        expect(onDismiss).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(document.querySelectorAll('.toast')).toHaveLength(0);
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('respeta una duración personalizada distinta de la por defecto', () => {
        vi.useFakeTimers();
        showToast({ message: 'Correcto', durationMs: 1000 });

        vi.advanceTimersByTime(1000);
        expect(document.querySelectorAll('.toast')).toHaveLength(0);
    });

    it('apila múltiples instancias simultáneas sin descartar ninguna (VAL-1503)', () => {
        vi.useFakeTimers();

        showToast({ message: 'Primero', variant: 'success' });
        showToast({ message: 'Segundo', variant: 'warning' });
        showToast({ message: 'Tercero', variant: 'danger' });

        const toasts = document.querySelectorAll('.toast');
        expect(toasts).toHaveLength(3);
        expect(document.querySelectorAll('.toast-container')).toHaveLength(1);
    });

    it('aplica una clase de salida antes de eliminar el nodo, permitiendo una transición CSS (FR-043)', () => {
        vi.useFakeTimers();
        showToast({ message: 'Adiós' });

        const toast = document.querySelector('.toast');
        expect(toast?.classList.contains('toast--exit')).toBe(false);

        vi.advanceTimersByTime(DEFAULT_TOAST_DURATION_MS - TOAST_EXIT_DURATION_MS);
        expect(toast?.classList.contains('toast--exit')).toBe(true);
        expect(document.body.contains(toast)).toBe(true);

        vi.advanceTimersByTime(TOAST_EXIT_DURATION_MS);
        expect(document.body.contains(toast)).toBe(false);
    });
});
