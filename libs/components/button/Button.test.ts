import { describe, it, expect, vi } from 'vitest';
import { createButton } from './Button';

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

  it('lanza un error de desarrollo si no se proporciona label ni ariaLabel', () => {
    expect(() => createButton({ onClick: () => {} } as never)).toThrow();
  });
});
