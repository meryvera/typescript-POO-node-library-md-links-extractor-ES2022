import { MarkdownLinks } from './MarkdownList.js';

// Función `mdLinks` que se exportará como interfaz programática
export function mdLinks(path: string, validate: boolean = false) {
  const md = new MarkdownLinks();
  return md.mdLinks(path, validate);
}

// export { MarkdownLinks };
