import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
export class FileValidator {
    static toAbsolutePath(inputPath) {
        return path.isAbsolute(inputPath) ? inputPath : path.resolve(inputPath);
    }
    static async fileExists(filePath) {
        try {
            await access(filePath);
            return true;
        }
        catch (err) {
            // Verificamos que 'err' es un objeto de tipo Error
            if (err instanceof Error && err.code === 'ENOENT') {
                return false;
            }
            if (err instanceof Error) {
                throw new Error(`Error al acceder al archivo: ${err.message}`);
            }
            else {
                throw new Error('Error desconocido al acceder al archivo');
            }
        }
    }
    static isMarkdownFile(filePath) {
        const validExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
        const fileExtension = path.extname(filePath);
        if (!validExtensions.includes(fileExtension)) {
            throw new Error('El archivo no es un archivo Markdown válido');
        }
        return true;
    }
}
export class FileReader {
    static async readFile(filePath) {
        return await readFile(filePath, { encoding: 'utf8' });
    }
}
export class LinkExtractor {
    static extractLinks(content, filePath) {
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
        const links = [];
        let match;
        while (match = linkRegex.exec(content)) {
            links.push({
                text: match[1],
                href: match[2],
                file: filePath
            });
        }
        return links;
    }
}
// // import {access} from 'node:fs';
// import { access, readFile } from 'node:fs/promises';
// import path from 'node:path';
// export interface Link {
//   href: string,
//   text: string,
//   file: string,
// }
// export class ModularizedFunctions {
//   // Conversión de ruta a absoluta, lógica ya modularizada
//   toAbsolutePath(inputPath: string): string {
//     return path.isAbsolute(inputPath) ? inputPath : path.resolve(inputPath);
//   }
//   extractLinks(content: string, filePath: string):Link[] {
//     const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;  // Expresión regular para buscar links en Markdown
//     const links:Link[] = []
//     let match: RegExpExecArray | null;
//     while(match = linkRegex.exec(content)){   // regex.exec(string)
//       links.push({
//         text: match[1],
//         href: match[2],
//         file: filePath
//       })
//     }
//     return links;
//   }
//   async readRawFile(filePath: string): Promise<string> {
//     const data = await readFile(filePath, { encoding: 'utf8' })
//     return data;
//   }
//   async fileExists(filePath: string): Promise<boolean> {
//     try {
//       await access(filePath);  // Verifica si el archivo es accesible
//       return true;
//     } catch (err: any) {
//       throw new Error(`Error al acceder al archivo: ${err.message}`);
//     }
//   }
//   isMarkdownFile(filePath: string): boolean {
//     const validExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
//     const fileExtension = path.extname(filePath);
//     if (!validExtensions.includes(fileExtension)) {
//       throw new Error('El archivo no es un archivo Markdown válido');
//     }
//     return true;
//   }
// }
