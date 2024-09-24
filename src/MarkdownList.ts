import {
  PathValidator,
  FileProcess,
  FileValidator,
  LinkProcess,
  Link
} from './ModularizedFunctions.js';

export class MarkdownLinks {

  mdLinks(inputPath: string, validate: boolean = false ): Promise<Link[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Convierte la ruta en absoluta
        const absolutePath: string = PathValidator.toAbsolutePath(inputPath);

        // Verifica si el archivo existe y si es un archivo Markdown
        const isExistingPath: boolean = await PathValidator.pathExists(absolutePath);

        if (!isExistingPath) {
          return reject(new Error('La ruta no existe'));
        }

        if(PathValidator.isDirectory(absolutePath)) {
          const allLinks: Link[] = [];

          // Obtenemos todos los archivos del directorio
          const files: string[] = PathValidator.getDirectoryFiles(absolutePath);
          // console.log('lineaa 29', files)
          // [
          //  '/Users/meryvera/Desktop/dev/projects/node-library/directorio/conLinks2Dir.md',
          //  '/Users/meryvera/Desktop/dev/projects/node-library/directorio/conLinksDir.md',
          //  '/Users/meryvera/Desktop/dev/projects/node-library/directorio/directorio2',
          //  '/Users/meryvera/Desktop/dev/projects/node-library/directorio/sinLinksDir.md'
          // ]
          for (const filePath of files) {
            // console.log('linea 31', filePath)
            // /Users/meryvera/Desktop/dev/projects/node-library/directorio/conLinks2Dir.md
            // /Users/meryvera/Desktop/dev/projects/node-library/directorio/conLinksDir.md
            // /Users/meryvera/Desktop/dev/projects/node-library/directorio/directorio2
            // /Users/meryvera/Desktop/dev/projects/node-library/directorio/sinLinksDir.md
            if (PathValidator.isDirectory(filePath)) {
              // console.info(`Omitiendo subdirectorio: ${filePath}`);
              continue; // Saltar directorios
            }

            if(FileValidator.isMarkdownFile(filePath)) {
              const fileLinks: Link[] = await this.#processFile(filePath, validate);
              // console.log('fileLinkssss', fileLinks)
              allLinks.push(...fileLinks);  // Agregamos todos los links encontrados
            }
          }
          // console.log('allll links', allLinks)
          resolve(allLinks);
        } else if (FileValidator.isMarkdownFile(absolutePath)) {
          // Si es un archivo .md, lo procesamos directamente
          const fileLinks = await this.#processFile(absolutePath, validate);
          resolve(fileLinks);
        } else {
          reject(new Error('El archivo no es un archivo Markdown válido'));
        }

      } catch (error) {
        if (error instanceof Error) {
          reject(new Error(`Error procesando el archivo o directorio: ${error.message}`));
        } else {
          reject(new Error('Error desconocido al procesar el archivo o directorio'));
        }
      }
    });
  }

  async #processFile(filePath: string, validate: boolean) : Promise<Link[]>{
    try {
      const data: string = await FileProcess.readFile(filePath);
      const extractedLinks: Link[] = LinkProcess.extractLinks(data, filePath);
      // Verificamos si se encontró algún link
      if (!extractedLinks.length) return [];

      if (validate) {
        const validatedLinks: Link[] = await LinkProcess.validateLinks(extractedLinks);
        return validatedLinks;
      }

      return extractedLinks;
    } catch (error) {
        throw new Error(`Error procesando el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}

const md = new MarkdownLinks();

//  md.mdLinks('conLinksRaiz.md', true)
md.mdLinks('directorio', true)
  .then(result => console.log('este es el resultado', result))
  .catch(error => {
    console.error('este es el error: ', error)
  })
