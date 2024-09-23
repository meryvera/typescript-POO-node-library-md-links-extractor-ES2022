import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

export interface Link {
  href: string,
  text: string,
  file: string,
}

export class FileValidator {
  static toAbsolutePath(inputPath: string): string {
    return path.isAbsolute(inputPath) ? inputPath : path.resolve(inputPath);
  }

  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath);
      return true;
    } catch (err: unknown) {
      // Verificamos que 'err' es un objeto de tipo Error
      if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
        return false;
      }
      if (err instanceof Error) {
        throw new Error(`Error al acceder al archivo: ${err.message}`);
      } else {
        throw new Error('Error desconocido al acceder al archivo');
      }
      // throw new Error(`Error al acceder al archivo: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  }

  static isMarkdownFile(filePath: string): boolean {
    const validExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
    if (!validExtensions.includes(path.extname(filePath))) {
      throw new Error('El archivo no es un archivo Markdown válido');
    }
    return true;
  }
}

export class FileReader {
  static async readFile(filePath: string): Promise<string> {
    return await readFile(filePath, { encoding: 'utf8' });
  }
}

export class LinkExtractor {
  static extractLinks(content: string, filePath: string): Link[] {
    // Usando programación funcional para el mapeo y filtrado de los links
    return [...content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g)].map(match => ({
      text: match[1],
      href: match[2],
      file: filePath
    }));
  }
}

// Clase para validar los links usando fetch
export class LinkValidator {
  static async validateLinks(links: Link[]): Promise<Link[]> {
    const validatedLinks: Link[] = await Promise.all(links.map(async link => {
      try {
        const response = await fetch(link.href);
        console.log('responseee', response)
        return {
          ...link,
          status: response.status,
          ok: response.ok ? 'ok' : 'fail'
        };
      } catch (error) {
        return {
          ...link,
          status: 0,
          ok: 'fail'
        };
      }
    }));
    return validatedLinks;
  }
}



// export class LinkExtractor {
//   static extractLinks(content: string, filePath: string): Link[] {
//     const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
//     const links: Link[] = [];
//     let match: RegExpExecArray | null;

//     while (match = linkRegex.exec(content)) {
//       links.push({
//         text: match[1],
//         href: match[2],
//         file: filePath
//       });
//     }
//     return links;
//   }
// }
