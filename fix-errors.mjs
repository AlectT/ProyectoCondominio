import fs from 'fs/promises';
import path from 'path';

async function processDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await processDir(fullPath);
        } else if (entry.isFile() && fullPath.endsWith('.jsx')) {
            let content = await fs.readFile(fullPath, 'utf8');
            let modified = false;

            const catchRegex1 = /setErrorModal\(extraerError\((err|error)\)\);\s*toast\.error\('([^']+)'\);/g;
            if (catchRegex1.test(content)) {
                content = content.replace(catchRegex1, (match, varName, msg) => {
                    return `const msj = extraerError(${varName}) || '${msg}';\n\t\t\tsetErrorModal(msj);\n\t\t\ttoast.error(msj);`;
                });
                modified = true;
            }

            const catchRegex2 = /console\.error\('[^']+',\s*extraerError\((err|error)\)\);\s*toast\.error\('([^']+)'\);/g;
            if (catchRegex2.test(content)) {
                content = content.replace(catchRegex2, (match, varName, msg) => {
                    return `const msj = extraerError(${varName}) || '${msg}';\n\t\t\tconsole.error('${msg}:', msj);\n\t\t\ttoast.error(msj);`;
                });
                modified = true;
            }
            
            const catchRegex3 = /toast\.error\((error|err)\.response\?\.data\?\.mensaje\s*\|\|\s*'([^']+)'\);/g;
            if (catchRegex3.test(content)) {
                content = content.replace(catchRegex3, (match, varName, msg) => {
                    return `const msj = extraerError(${varName}) || '${msg}';\n\t\t\ttoast.error(msj);`;
                });
                if (!content.includes('import { extraerError }')) {
                    if (fullPath.includes('modulos')) {
                        content = `import { extraerError } from '../../utilidades/extraerError.js';\n` + content;
                    } else {
                        content = `import { extraerError } from '../utilidades/extraerError.js';\n` + content;
                    }
                }
                modified = true;
            }

            const catchRegex4 = /catch \((err|error)\) {\s+toast\.error\('([^']+)'\);\s+}/g;
            if (catchRegex4.test(content)) {
                content = content.replace(catchRegex4, (match, varName, msg) => {
                    return `catch (${varName}) {\n\t\t\tconst msj = extraerError(${varName}) || '${msg}';\n\t\t\ttoast.error(msj);\n\t\t}`;
                });
                if (!content.includes('import { extraerError }')) {
                    if (fullPath.includes('modulos')) {
                        content = `import { extraerError } from '../../utilidades/extraerError.js';\n` + content;
                    } else {
                        content = `import { extraerError } from '../utilidades/extraerError.js';\n` + content;
                    }
                }
                modified = true;
            }

            if (modified) {
                await fs.writeFile(fullPath, content, 'utf8');
                console.log('Modified', fullPath);
            }
        }
    }
}

processDir('c:/Users/andresz/Documents/ProyectoCondominio/frontend/src/paginas').catch(console.error);
