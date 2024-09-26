### **Resumen del Proceso:**

1. **Modificar el archivo `index.ts`** para exportar la función `mdLinks`.
2. **Crear el archivo `cli.js`** que maneja la lógica de la CLI.
3. **Configurar el `package.json`** para que el comando `md-links` sea ejecutable.
4. **Probar el CLI** con varios ejemplos desde la terminal.
5. **Documentar el proyecto** en tu archivo `README.md`.

1. **Modificar el archivo src/index.ts**

  ```typescript
  import { MarkdownLinks } from './MarkdownList.js';
  // Función `mdLinks` que se exportará como interfaz programática
  export function mdLinks(path: string, validate: boolean = false) {
    const md = new MarkdownLinks();
    return md.mdLinks(path, validate);
  }
  ```

2. **Crear el archivo cli.js**
Este  es el script que el usuario ejecutará desde la línea de comando. Este archivo se encargará de interpretar los argumentos pasados por el usuario y ejecutar la función mdLinks que hemos exportado en index.ts.
- minimist se usará para manejar los argumentos pasados desde la línea de comando.
- Se manejarán las opciones --validate y --stats

3. **Vincular el CLI a tu package.json**
Configurar el campo bin en el archivo package.json, que indica que el comando md-links ejecutará el script cli.js:

  ```json
    "bin": {
      "mdlinks-library": "./src/cli.js"
    }
  ```
Para ejecutar el comando md-links globalmente desde la terminal, se debe ejecutar el siguiente comando en la raíz de tu proyecto:
  ```bash
    npm link
  ```

4. **Probar el CLI localmente**

1. Puedes probarlo ejecutando el siguiente comando en la terminal:
md-links <path-to-file> [options]

Por ejemplo:

  ```bash
    mdlinks-library ./some-file.md
  ```
Esto debería listar todos los links encontrados en el archivo Markdown.

2. Para usar las opciones --validate y --stats, puedes hacer:

  ```bash
    mdlinks-library ./some-file.md --validate
  ```

  ```bash
    mdlinks-library ./some-file.md --stats
  ```

  ```bash
    mdlinks-library ./some-file.md --validate --stats
  ```


Probar desde un file directamente:
  ```bash
    node ./src/cli.js conLinksRaiz.md --validate --stats
  ```
