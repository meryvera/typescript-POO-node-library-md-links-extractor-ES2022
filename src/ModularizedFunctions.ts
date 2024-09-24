import { access, readFile } from 'node:fs/promises';
import { readdirSync, statSync } from 'node:fs'
import path from 'node:path';

export interface Link {
  href: string,
  text: string,
  file: string,
}

export class PathValidator {
  static toAbsolutePath(inputPath: string): string {
    //console.log(path.resolve(inputPath))
    return path.isAbsolute(inputPath) ? inputPath : path.resolve(inputPath);
  }

  static async pathExists(absolutePath: string): Promise<boolean> {
    try {
      await access(absolutePath);
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

  // Verifica si es un directorio
  static isDirectory(absolutePath: string): boolean {
    try {
      const stats = statSync(absolutePath);
      //console.log(stats.isDirectory())
      return stats.isDirectory() ? true : false;// true false
    } catch (error) {
      throw new Error(`Error al comprobar si la ruta es un directorio: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static getDirectoryFiles(absolutePath: string): string[] {
    //console.log(readdirSync(absolutePath).map(file => path.join(absolutePath, file)))
    return readdirSync(absolutePath).map(file => path.join(absolutePath, file));
  }

}
// PathValidator.toAbsolutePath('conLinksRaiz.md')
// /Users/meryvera/Desktop/dev/projects/node-library/conLinksRaiz.md
// PathValidator.toAbsolutePath('directorio')
// /Users/meryvera/Desktop/dev/projects/node-library/directorio
const a = '/Users/meryvera/Desktop/dev/projects/node-library/directorio'
// PathValidator.isDirectory(a)
PathValidator.getDirectoryFiles(a)


export class FileValidator {
  static isMarkdownFile(filePath: string): boolean {
    // console.log(`Validando archivo si es markdown: ${filePath}`);
    const validExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];

    // Verifica si el archivo tiene una extensión válida de Markdown
    return validExtensions.includes(path.extname(filePath)); // true false
  }
}

export class FileProcess {
  static async readFile(filePath: string): Promise<string> {
    return await readFile(filePath, { encoding: 'utf8' });
  }
}

// Clase para validar los links usando fetch
export class LinkProcess {
  static extractLinks(content: string, filePath: string): Link[] {
    const matches = [...content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g)];

    // Usando programación funcional para el mapeo y filtrado de los links
    return matches.map(match => ({
      text: match[1],
      href: match[2],
      file: filePath
    }));
  }

  static async validateLinks(links: Link[]): Promise<Link[]> {
    const linksStatus: Link[] = await Promise.all(links.map(async link => {
      try {
        const response = await fetch(link.href);
        // console.log('responseee', response)
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
    return linksStatus;
  }
}

// if (stats.isFile()) console.log(`La ruta "${absolutePath}" es un archivo.`)
//   if (stats.isDirectory()) console.log(`La ruta "${absolutePath}" es un directorio.`)
//   console.log(`La ruta "${absolutePath}" no es ni un archivo ni un directorio.`);



// export class LinkProcess {
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
