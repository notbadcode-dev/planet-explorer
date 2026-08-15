#!/usr/bin/env node
/**
 * check-components.mjs
 *
 * Recorre `libs/components/` y falla (exit code != 0) si detecta:
 *   (a) nombres de componente duplicados (comparación insensible a mayúsculas), o
 *   (b) un componente incompleto: sin `*.test.ts` o sin `*.stories.ts` (FR-009).
 *   (c) tipos declarados fuera de `*.type.ts`, o
 *   (d) literales mágicos de string/número en código productivo fuera de `*.constants.ts`.
 *
 * Contrato: specs/001-component-library-architecture/contracts/component-library-convention.md
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const COMPONENTS_DIR = join(process.cwd(), 'libs', 'components');

function listComponentDirs(dir) {
    return readdirSync(dir).filter((entry) => statSync(join(dir, entry)).isDirectory());
}

function isTypeFile(fileName) {
    return fileName.endsWith('.type.ts');
}

function isConstantsFile(fileName) {
    return fileName.endsWith('.constants.ts');
}

function isDeclarationFile(fileName) {
    return fileName.endsWith('.d.ts');
}

function isProductionComponentFile(fileName) {
    return (
        fileName.endsWith('.ts') &&
        !isDeclarationFile(fileName) &&
        fileName !== 'index.ts' &&
        !fileName.endsWith('.test.ts') &&
        !fileName.endsWith('.stories.ts')
    );
}

function isCheckedImplementationFile(fileName) {
    return (
        isProductionComponentFile(fileName) && !isTypeFile(fileName) && !isConstantsFile(fileName)
    );
}

function formatLocation(sourceFile, node) {
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));

    return `${sourceFile.fileName}:${position.line + 1}:${position.character + 1}`;
}

function isImportOrExportModuleSpecifier(node) {
    const parent = node.parent;

    return (
        (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) &&
        parent.moduleSpecifier === node
    );
}

function isTemplateTextLiteral(node) {
    return (
        (node.kind === ts.SyntaxKind.TemplateHead ||
            node.kind === ts.SyntaxKind.TemplateMiddle ||
            node.kind === ts.SyntaxKind.TemplateTail) &&
        node.text.length > 0
    );
}

function isMagicLiteral(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        return !isImportOrExportModuleSpecifier(node);
    }

    if (isTemplateTextLiteral(node)) {
        return true;
    }

    return ts.isNumericLiteral(node);
}

function validateComponentCode(componentName, componentDir, files) {
    const errors = [];
    const hasConstants = files.some(isConstantsFile);
    const hasTypeFile = files.some(isTypeFile);

    for (const fileName of files.filter(isProductionComponentFile)) {
        const filePath = join(componentDir, fileName);
        const source = readFileSync(filePath, 'utf8');
        const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);

        function visit(node) {
            if (
                isCheckedImplementationFile(fileName) &&
                (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node))
            ) {
                const target = fileName.replace(/\.ts$/, '.type.ts');
                const typeFileHint = hasTypeFile ? '*.type.ts' : target;

                errors.push(
                    `Componente "${componentName}": declaración de tipo fuera de ${typeFileHint} en ${formatLocation(sourceFile, node)}.`,
                );
            }

            if (isCheckedImplementationFile(fileName) && isMagicLiteral(node)) {
                const constantsFileHint = hasConstants
                    ? '*.constants.ts'
                    : fileName.replace(/\.ts$/, '.constants.ts');

                errors.push(
                    `Componente "${componentName}": literal mágico fuera de ${constantsFileHint} en ${formatLocation(sourceFile, node)}.`,
                );
            }

            ts.forEachChild(node, visit);
        }

        visit(sourceFile);
    }

    return errors;
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
        const componentDir = join(COMPONENTS_DIR, name);
        const files = readdirSync(componentDir);
        const hasTest = files.some((f) => f.endsWith('.test.ts'));
        const hasStory = files.some((f) => f.endsWith('.stories.ts'));

        if (!hasTest) {
            errors.push(
                `Componente incompleto: "${name}" no tiene ningún fichero *.test.ts (FR-009).`,
            );
        }
        if (!hasStory) {
            errors.push(
                `Componente incompleto: "${name}" no tiene ningún fichero *.stories.ts (FR-009).`,
            );
        }

        errors.push(...validateComponentCode(name, componentDir, files));
    }

    if (errors.length > 0) {
        console.error('check-components: se han encontrado problemas en libs/components/:\n');
        for (const error of errors) {
            console.error(`  - ${error}`);
        }
        process.exit(1);
    }

    console.log(
        `check-components: ${componentDirs.length} componente(s) verificado(s) sin problemas.`,
    );
}

main();
