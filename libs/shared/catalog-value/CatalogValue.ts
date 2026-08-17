/**
 * Validación y resolución de valores frente a un catálogo cerrado de strings
 * (p. ej. `size`, `variant`, `placement`). Ver P15 en
 * `docs/conventions/components/api-patterns.md`.
 */

export function isInCatalog<Value extends string>(value: unknown, catalog: readonly Value[]): value is Value {
    return catalog.includes(value as Value);
}

export function resolveCatalogValue<Value extends string>(
    value: unknown,
    catalog: readonly Value[],
    fallback: Value,
): Value {
    return isInCatalog(value, catalog) ? value : fallback;
}
