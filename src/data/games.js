/**
 * Game Intro Data
 * Información de introducción para cada juego
 */

const gameIntroData = {
  'complete-word': {
    id: 'complete-word',
    title: 'Completa la Palabra',
    icon: 'fa-puzzle-piece',
    iconColor: 'var(--color-category-animals)',
    description: 'Encuentra la letra que falta para formar la palabra correcta.',
    howToPlay: [
      'Mira la imagen que aparece',
      'Escucha cómo se pronuncia la palabra',
      'Elige la letra que completa la palabra',
      '¡La palabra se formará!'
    ],
    objective: 'Completar todas las palabras de la categoría',
    reward: 3,
    tip: 'Presta atención a la imagen y escucha bien la palabra',
    difficulty: 1,
    estimatedTime: '5 min'
  },

  'memory': {
    id: 'memory',
    title: 'Memoria',
    icon: 'fa-brain',
    iconColor: 'var(--color-secondary)',
    description: 'Encuentra los pares de imágenes iguales.',
    howToPlay: [
      'Toca una carta para voltearla',
      'Toca otra carta para buscar su par',
      'Si son iguales, ¡las conservas!',
      'Si son diferentes, se vuelven a ocultar'
    ],
    objective: 'Encontrar todos los pares posibles',
    reward: 3,
    tip: 'Recuerda dónde están las imágenes para encontrar los pares',
    difficulty: 2,
    estimatedTime: '7 min'
  },

  'syllables': {
    id: 'syllables',
    title: 'Letras y Sílabas',
    icon: 'fa-font',
    iconColor: 'var(--color-accent)',
    description: 'Aprende a separar las palabras en sílabas.',
    howToPlay: [
      'Escucha la palabra completa',
      'Mira cómo se separa en sílabas',
      'Toca cada sílaba para escucharla',
      'Apréndelas para leer mejor'
    ],
    objective: 'Dominar la separación silábica de cada palabra',
    reward: 2,
    tip: 'Acompaña la sílaba con la imagen para recordarla mejor',
    difficulty: 1,
    estimatedTime: '4 min'
  },

  'word-search': {
    id: 'word-search',
    title: 'Sopa de Letras',
    icon: 'fa-search',
    iconColor: 'var(--color-primary)',
    description: 'Encuentra las palabras ocultas en la cuadrícula.',
    howToPlay: [
      'Mira la palabra que debes encontrar',
      'Busca las letras en la cuadrícula',
      'Selecciona las letras en orden',
      '¡La palabra se resaltará!'
    ],
    objective: 'Encontrar todas las palabras de la lista',
    reward: 3,
    tip: 'Lee primero la palabra y busca su primera letra',
    difficulty: 2,
    estimatedTime: '6 min'
  },

  'sort-letters': {
    id: 'sort-letters',
    title: 'Acomoda las Sílabas',
    icon: 'fa-sort-amount-down',
    iconColor: '#9B59B6',
    description: 'Ordena las sílabas para formar la palabra correcta.',
    howToPlay: [
      'Escucha la palabra completa',
      'Mira las sílabas desordenadas',
      'Arrastra cada sílaba a su lugar',
      '¡Forma la palabra correctamente!'
    ],
    objective: 'Acomodar todas las sílabas en el orden correcto',
    reward: 3,
    tip: 'Escucha la palabra y repítela para saber el orden',
    difficulty: 3,
    estimatedTime: '5 min'
  },

  'association': {
    id: 'association',
    title: 'Asociación',
    icon: 'fa-project-diagram',
    iconColor: '#E67E22',
    description: 'Conecta cada palabra con su imagen correcta.',
    howToPlay: [
      'Mira las imágenes de un lado',
      'Lee las palabras del otro lado',
      'Conecta cada imagen con su palabra',
      '¡Demuestra lo que aprendiste!'
    ],
    objective: 'Conectar todas las imágenes con sus palabras',
    reward: 3,
    tip: 'Lee la palabra y piensa en qué imagen representa',
    difficulty: 2,
    estimatedTime: '5 min'
  }
};

export default gameIntroData;
