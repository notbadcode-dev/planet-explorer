#!/usr/bin/env node
/**
 * check-components.mjs
 *
 * (a)-(c) recorren SOLO `libs/components/` (estructura propia de la librería de
 * componentes, docs/conventions/components/structure.md) y fallan si detectan:
 *   (a) nombres de componente duplicados (comparación insensible a mayúsculas), o
 *   (b) un componente incompleto: sin `*.test.ts` o sin `*.stories.ts` (FR-009).
 *   (c) tipos declarados fuera de `*.type.ts`.
 *
 * (d) recorre TODO el código productivo del proyecto (`src/` y `libs/`, incluyendo
 * `libs/shared/`), no solo `libs/components/`, y falla si detecta:
 *   (d) literales mágicos de string/número fuera de `*.constants.ts`.
 *
 * Contrato: docs/conventions/components/structure.md (a-c) y
 * docs/conventions/components/visual-rules.md V4 (d, regla general del proyecto).
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import ts from 'typescript';

const COMPONENTS_DIR = join(process.cwd(), 'libs', 'components');
const MAGIC_LITERAL_CHECK_ROOTS = ['src', 'libs'].map((dir) => join(process.cwd(), dir));

function listComponentDirs(dir) {
    return readdirSync(dir).filter((entry) => statSync(join(dir, entry)).isDirectory());
}

function listTsFilesRecursively(dir) {
    let entries;
    try {
        entries = readdirSync(dir, { withFileTypes: true });
    } catch {
        return [];
    }

    const files = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...listTsFilesRecursively(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.ts')) {
            files.push(fullPath);
        }
    }

    return files;
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

function validateComponentTypeDeclarations(componentName, componentDir, files) {
    const errors = [];
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

            ts.forEachChild(node, visit);
        }

        visit(sourceFile);
    }

    return errors;
}

function collectMagicLiteralErrors(rootDirs) {
    const errors = [];

    for (const rootDir of rootDirs) {
        for (const filePath of listTsFilesRecursively(rootDir)) {
            const fileName = basename(filePath);
            if (!isCheckedImplementationFile(fileName)) {
                continue;
            }

            const siblings = readdirSync(dirname(filePath));
            const constantsFileHint = siblings.some(isConstantsFile)
                ? '*.constants.ts'
                : fileName.replace(/\.ts$/, '.constants.ts');

            const relativePath = relative(process.cwd(), filePath);
            const source = readFileSync(filePath, 'utf8');
            const sourceFile = ts.createSourceFile(relativePath, source, ts.ScriptTarget.Latest, true);

            function visit(node) {
                if (isMagicLiteral(node)) {
                    errors.push(
                        `Literal mágico fuera de ${constantsFileHint} en ${formatLocation(sourceFile, node)}.`,
                    );
                }

                ts.forEachChild(node, visit);
            }

            visit(sourceFile);
        }
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

        errors.push(...validateComponentTypeDeclarations(name, componentDir, files));
    }

    // (d) Literales mágicos: todo el código productivo del proyecto (src/ + libs/)
    errors.push(...collectMagicLiteralErrors(MAGIC_LITERAL_CHECK_ROOTS));

    if (errors.length > 0) {
        console.error('check-components: se han encontrado problemas en el proyecto:\n');
        for (const error of errors) {
            console.error(`  - ${error}`);
        }
        process.exit(1);
    }

    console.log(
        `check-components: ${componentDirs.length} componente(s) verificado(s) sin problemas (más literales mágicos en todo el proyecto).`,
    );
}

main();
