#!/usr/bin/env node
/**
 * check-components.mjs
 *
 * Recorre `libs/components/` y falla (exit code != 0) si detecta:
 *   (a) nombres de componente duplicados (comparación insensible a mayúsculas), o
 *   (b) un componente incompleto: sin `*.test.ts` o sin `*.stories.ts` (FR-009).
 *
 * Contrato: specs/001-component-library-architecture/contracts/component-library-convention.md
 */

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const COMPONENTS_DIR = join(process.cwd(), 'libs', 'components');

function listComponentDirs(dir) {
  return readdirSync(dir).filter((entry) => statSync(join(dir, entry)).isDirectory());
}

function main() {
  let componentDirs;
  try {
    componentDirs = listComponentDirs(COMPONENTS_DIR);
  } catch {
    console.error(`No se ha encontrado la carpeta ${COMPONENTS_DIR}.`);
    process.exit(1);
  }

  const errors = [];

  // (a) Nombres duplicados (insensible a mayúsculas/minúsculas)
  const seen = new Map();
  for (const name of componentDirs) {
    const key = name.toLowerCase();
    if (seen.has(key)) {
      errors.push(
        `Nombre de componente duplicado: "${name}" colisiona con "${seen.get(key)}" (comparación insensible a mayúsculas).`,
      );
    } else {
      seen.set(key, name);
    }
  }

  // (b) Componentes incompletos: sin *.test.ts o sin *.stories.ts
  for (const name of componentDirs) {
    const files = readdirSync(join(COMPONENTS_DIR, name));
    const hasTest = files.some((f) => f.endsWith('.test.ts'));
    const hasStory = files.some((f) => f.endsWith('.stories.ts'));

    if (!hasTest) {
      errors.push(`Componente incompleto: "${name}" no tiene ningún fichero *.test.ts (FR-009).`);
    }
    if (!hasStory) {
      errors.push(
        `Componente incompleto: "${name}" no tiene ningún fichero *.stories.ts (FR-009).`,
      );
    }
  }

  if (errors.length > 0) {
    console.error('check-components: se han encontrado problemas en libs/components/:\n');
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log(`check-components: ${componentDirs.length} componente(s) verificado(s) sin problemas.`);
}

main();
