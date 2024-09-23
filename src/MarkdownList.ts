import { FileValidator, FileReader, LinkExtractor,LinkValidator, Link } from './ModularizedFunctions.js';

export class MarkdownLinks {

  mdLinks(inputPath: string, validate: boolean = false ): Promise<Link[]> {
    return new Promise(async (resolve, reject) => {
      try {
        // Convierte la ruta en absoluta
        const absolutePath: string = FileValidator.toAbsolutePath(inputPath);

        // Verifica si el archivo existe y si es un archivo Markdown
        const isFileExisted: boolean = await FileValidator.fileExists(absolutePath);
        const isMdFile: boolean = FileValidator.isMarkdownFile(absolutePath);

        if (!isFileExisted || !isMdFile) {
          return reject(new Error('Error al leer el archivo: No existe o no es un archivo Markdown válido'));
        }

        // Lee el contenido del archivo y extrae los links
        const data: string = await FileReader.readFile(absolutePath);
        const extractedLinks: Link[] = LinkExtractor.extractLinks(data, absolutePath);

        // Si validate es true, se procede a validar los links
        if(validate) {
          const validatedLinks: Link[] = await LinkValidator.validateLinks(extractedLinks);
          resolve(validatedLinks)
        }

        // Si validate es false o undefined, simplemente retornamos los links extraídos
        resolve(extractedLinks);

      } catch (error) {
        // Verificación de tipo para asegurar que 'error' es un objeto Error
        if (error instanceof Error) {
          reject(new Error(`Error procesando el archivo: ${error.message}`));
        } else {
          reject(new Error('Error desconocido al procesar el archivo'));
        }
      }
    });
  }
}

const md = new MarkdownLinks();

md.mdLinks('conLinksRaiz.md', true)
  .then(result => console.log('este es el resultado', result))
  .catch(error => {
    console.error('este es el error: ', error)
  })
