/**
 * Button — componente "dummy" reutilizable de `libs/components/`.
 *
 * Contrato público: ver
 * `specs/002-button-variants/contracts/button-component.md` (v1.1).
 */

import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

const VALID_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'danger'];
const VALID_SIZES: readonly ButtonSize[] = ['small', 'medium', 'large'];

const DEFAULT_VARIANT: ButtonVariant = 'primary';
const DEFAULT_SIZE: ButtonSize = 'medium';

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

  /**
   * Énfasis visual/semántico del botón. Catálogo cerrado.
   * Por defecto `'primary'` si se omite o si se recibe un valor no soportado en runtime.
   */
  variant?: ButtonVariant;

  /**
   * Tamaño relativo del botón. Catálogo cerrado.
   * Por defecto `'medium'` si se omite o si se recibe un valor no soportado en runtime.
   */
  size?: ButtonSize;
}

function resolveVariant(variant: ButtonProps['variant']): ButtonVariant {
  return VALID_VARIANTS.includes(variant as ButtonVariant) ? (variant as ButtonVariant) : DEFAULT_VARIANT;
}

function resolveSize(size: ButtonProps['size']): ButtonSize {
  return VALID_SIZES.includes(size as ButtonSize) ? (size as ButtonSize) : DEFAULT_SIZE;
}

/**
 * Crea un elemento `<button>` HTML nativo a partir de `ButtonProps`.
 *
 * No contiene lógica de negocio: es una función pura respecto a sus props.
 */
export function createButton(props: ButtonProps): HTMLButtonElement {
  const { label, ariaLabel, onClick, disabled = false, variant, size } = props;

  const hasLabel = Boolean(label?.trim());
  const hasAriaLabel = Boolean(ariaLabel?.trim());

  if (!hasLabel && !hasAriaLabel) {
    throw new Error(
      'createButton: se requiere "label" o "ariaLabel" para que el botón tenga un nombre accesible.',
    );
  }

  const resolvedVariant = resolveVariant(variant);
  const resolvedSize = resolveSize(size);

  const button = document.createElement('button');
  button.type = 'button';

  if (hasLabel) {
    button.textContent = label as string;
  }

  if (hasAriaLabel) {
    button.setAttribute('aria-label', ariaLabel as string);
  }

  button.disabled = disabled;

  button.classList.add('button', `button--${resolvedVariant}`, `button--${resolvedSize}`);

  button.addEventListener('click', () => {
    if (button.disabled) {
      return;
    }
    onClick();
  });

  return button;
}
