/**
 * Button — componente "dummy" reutilizable de `libs/components/`.
 *
 * Contrato público: ver
 * `specs/001-component-library-architecture/contracts/button-component.md`.
 */

export interface ButtonProps {
  /** Texto visible del botón. Opcional si se proporciona `ariaLabel`. */
  label?: string;

  /**
   * Etiqueta accesible alternativa para tecnologías de asistencia.
   * Obligatoria si `label` no está presente o está vacío.
   */
  ariaLabel?: string;

  /** Acción a ejecutar cuando el botón se activa (clic, o Enter/Espacio con foco). */
  onClick: () => void;

  /** Indica si el botón está deshabilitado. Por defecto `false`. */
  disabled?: boolean;
}

/**
 * Crea un elemento `<button>` HTML nativo a partir de `ButtonProps`.
 *
 * No contiene lógica de negocio: es una función pura respecto a sus props.
 */
export function createButton(props: ButtonProps): HTMLButtonElement {
  const { label, ariaLabel, onClick, disabled = false } = props;

  const hasLabel = Boolean(label?.trim());
  const hasAriaLabel = Boolean(ariaLabel?.trim());

  if (!hasLabel && !hasAriaLabel) {
    throw new Error(
      'createButton: se requiere "label" o "ariaLabel" para que el botón tenga un nombre accesible.',
    );
  }

  const button = document.createElement('button');
  button.type = 'button';

  if (hasLabel) {
    button.textContent = label as string;
  }

  if (hasAriaLabel) {
    button.setAttribute('aria-label', ariaLabel as string);
  }

  button.disabled = disabled;

  button.addEventListener('click', () => {
    if (button.disabled) {
      return;
    }
    onClick();
  });

  return button;
}
