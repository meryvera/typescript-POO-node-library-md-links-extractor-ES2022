import { FileValidator, FileReader, LinkExtractor } from './ModularizedFunctions.js';
export class MarkdownLinks {
    mdLinks(inputPath) {
        return new Promise(async (resolve, reject) => {
            try {
                // Convierte la ruta en absoluta
                const absolutePath = FileValidator.toAbsolutePath(inputPath);
                // Verifica si el archivo existe y si es un archivo Markdown
                const isFileExisted = await FileValidator.fileExists(absolutePath);
                const isMdFile = FileValidator.isMarkdownFile(absolutePath);
                if (!isFileExisted || !isMdFile) {
                    return reject(new Error('Error al leer el archivo: No existe o no es un archivo Markdown válido'));
                }
                // Lee el contenido del archivo y extrae los links
                const data = await FileReader.readFile(absolutePath);
                const extractedDataLinks = LinkExtractor.extractLinks(data, absolutePath);
                resolve(extractedDataLinks); // Resolución de la promesa con los links extraídos
            }
            catch (error) {
                // Verificación de tipo para asegurar que 'error' es un objeto Error
                if (error instanceof Error) {
                    reject(new Error(`Error procesando el archivo: ${error.message}`));
                }
                else {
                    reject(new Error('Error desconocido al procesar el archivo'));
                }
            }
        });
    }
}
const md = new MarkdownLinks();
md.mdLinks('conLinksRaiz.md')
    .then(result => console.log('este es el resultado', result))
    .catch(error => {
    console.error('este es el error: ', error);
});
// mdLinks(): Promise<Link[]> {
//   return new Promise((resolve, reject) => {
//     fs.readFile(this.#absolutePath, 'utf-8', (err, data)=> {    // data y err son string
//       // if(err) return reject(`Error 1 - al leer el archivo: ${err}`)
//       // if(err) return reject(new Error(`Error 2 - al leer el archivo: ${err}`))
//       if(err) return reject(new Error(`Error al leer el archivo: ${err.message}`, { cause: err }));
//       const { extractLinks } = new ModularizedFunctions()
//       const links = extractLinks(data, this.#absolutePath)
//       resolve(links)
//     })
//   })
// }
// async mdLinks(): Promise<Link[]> {
//   const { extractLinks, validateMarkdownFile, fileExists } = new ModularizedFunctions()
//   const isFileExisting =  await fileExists(this.#absolutePath)
//   try {
//     if(isFileExisting) {
//       validateMarkdownFile(this.#absolutePath)
//     } else {
//       throw new Error('El file no existe. Por favor revisa el nombre de tu file');
//     };
//     const data = await fs.readFile(this.#absolutePath, 'utf-8');
//     return extractLinks(data, this.#absolutePath)
//   } catch (error) {
//     const errorMessage = (error instanceof Error) ? error.message : 'Error desconocido';
//     return Promise.reject(new Error(`Error al procesar el archivo: ${errorMessage}`));
//   }
// }
// export class MarkdownLinks {
//   constructor(){}
//   async mdLinks(inputPath: string): Promise<Link[]> {
//     const { toAbsolutePath, extractLinks,readRawFile, isMarkdownFile, fileExists } = new ModularizedFunctions()
//     let absolute = toAbsolutePath(inputPath);
//     let isFileExisted = await fileExists(absolute)
//     let isMdFile = isMarkdownFile(absolute)
//     let data = await readRawFile(absolute)
//     return new Promise((resolve, reject) => {
//       if(!isFileExisted || !isMdFile || !data) return reject(new Error('Error al leer el archivo:'));
//       let extratedDataLinks = extractLinks(data, absolute)
//       resolve(extratedDataLinks)
//     })
//   }
// }
