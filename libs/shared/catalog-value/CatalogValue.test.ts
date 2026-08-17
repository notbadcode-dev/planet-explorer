import { describe, expect, it } from 'vitest';

import { isInCatalog, resolveCatalogValue } from './CatalogValue';

const CATALOG = ['small', 'medium', 'large'] as const;
type CatalogValue = (typeof CATALOG)[number];
const DEFAULT_VALUE: CatalogValue = 'medium';

describe('isInCatalog', () => {
    it('devuelve true para un valor presente en el catálogo', () => {
        expect(isInCatalog('large', CATALOG)).toBe(true);
    });

    it('devuelve false para un valor ausente del catálogo', () => {
        expect(isInCatalog('huge', CATALOG)).toBe(false);
    });

    it('devuelve false para undefined', () => {
        expect(isInCatalog(undefined, CATALOG)).toBe(false);
    });
});

describe('resolveCatalogValue', () => {
    it('devuelve el valor recibido cuando pertenece al catálogo', () => {
        expect(resolveCatalogValue('small', CATALOG, DEFAULT_VALUE)).toBe('small');
    });

    it('devuelve el valor por defecto cuando el valor no pertenece al catálogo', () => {
        expect(resolveCatalogValue('huge', CATALOG, DEFAULT_VALUE)).toBe(DEFAULT_VALUE);
    });

    it('devuelve el valor por defecto cuando el valor es undefined', () => {
        expect(resolveCatalogValue(undefined, CATALOG, DEFAULT_VALUE)).toBe(DEFAULT_VALUE);
    });
});
