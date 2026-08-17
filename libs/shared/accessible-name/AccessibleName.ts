/**
 * Resolución del nombre accesible de un control de formulario: prioriza el
 * texto de `label` visible sobre `ariaLabel`, ambos recortados de espacios.
 * Ver P15 en `docs/conventions/components/api-patterns.md`.
 */

export function resolveAccessibleName(label: string | undefined, ariaLabel: string | undefined): string | undefined {
    const trimmedLabel = label?.trim();
    if (trimmedLabel) {
        return trimmedLabel;
    }

    const trimmedAriaLabel = ariaLabel?.trim();
    if (trimmedAriaLabel) {
        return trimmedAriaLabel;
    }

    return undefined;
}
