#!/usr/bin/env node

import minimist from 'minimist';
import { mdLinks } from '../dist/index.js';
// Importamos la función `mdLinks` desde `index.js`

// Parseamos los argumentos de la línea de comandos
// console.log(process.argv)
const argv = minimist(process.argv.slice(2), {
  boolean: ['validate', 'stats'],
  alias: { v: 'validate', s: 'stats' }
});
//console.log('argv', argv)

// Argumento principal (la ruta)
const path = argv._[0];

// Si no se proporciona la ruta, mostrar un mensaje de error
if (!path) {
  console.error('🛑 Por favor, provee una ruta para analizar. 🛑');
  process.exit(1);
}

// Obtener las opciones `--validate` y `--stats`
const validate = argv.validate || false;// aca se convierte validate en true
const stats = argv.stats || false; // aca se convierte stats en true

//console.log('validatee 28', validate)

// Ejecutar la función `mdLinks` con los argumentos proporcionados
mdLinks(path, validate)
  .then(links => {
    //console.log('liiinks', links)
    if (stats && validate) {
      printStatsWithValidation(links);
    } else if (stats) {
      printStats(links);
    } else {
      printLinks(links, validate);
    }
  })
  .catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });

  // Función para imprimir los links encontrados
function printLinks(links, validate) {
  //console.log('validateeee', validate)
  links.forEach((link, index) => {
    const numberElement = `-${index + 1}`;
    //console.log('links desde printLinkss',links)
    const truncatedText = link.text.length > 50 ? `${link.text.slice(0, 50)}...` : link.text;
    if (validate) {
      console.log(`File${numberElement}: ${link.file} \nHref${numberElement}: ${link.href} \nText${numberElement}: ${truncatedText} \nStatus${numberElement}: ${link.status}  \nOk or Fail${numberElement}: ${link.ok}`);
    } else {
      console.log(`File${numberElement}: ${link.file} \nHref${numberElement}: ${link.href} \nText${numberElement}: ${truncatedText}`);
    }
  });
}

// Función para imprimir las estadísticas de los links
function printStats(links) {
  //console.log('linkss 63',links)
  const total = links.length;
  const unique = new Set(links.map(link => link.href)).size;
  console.log(`Total: ${total}`);
  console.log(`Unique: ${unique}`);
}

// Función para imprimir las estadísticas junto con la validación
function printStatsWithValidation(links) {
  const total = links.length;
  const unique = new Set(links.map(link => link.href)).size;
  const broken = links.filter(link => link.ok === 'fail').length;
  console.log(`Total: ${total}`);
  console.log(`Unique: ${unique}`);
  console.log(`Broken: ${broken}`);
}
