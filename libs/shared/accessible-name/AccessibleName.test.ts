import { describe, expect, it } from 'vitest';

import { resolveAccessibleName } from './AccessibleName';

describe('resolveAccessibleName', () => {
    it('prioriza label sobre ariaLabel cuando ambos están presentes', () => {
        expect(resolveAccessibleName('Nombre', 'Nombre accesible')).toBe('Nombre');
    });

    it('usa ariaLabel cuando label no está presente', () => {
        expect(resolveAccessibleName(undefined, 'Nombre accesible')).toBe('Nombre accesible');
    });

    it('usa ariaLabel cuando label está vacío tras recortar espacios', () => {
        expect(resolveAccessibleName('   ', 'Nombre accesible')).toBe('Nombre accesible');
    });

    it('devuelve undefined cuando ninguno está presente', () => {
        expect(resolveAccessibleName(undefined, undefined)).toBeUndefined();
    });

    it('devuelve undefined cuando ambos están vacíos tras recortar espacios', () => {
        expect(resolveAccessibleName('  ', '  ')).toBeUndefined();
    });
});
