'use strict';

/** Voice lines for ElevenLabs — must match walkthrough `audioPrefix` step order. */

const aritmeticaN1 = [
  { file: 'paa-arit-n1-01.mp3', text: 'Hoy estudiaremos el orden de las operaciones. Este nos dice el orden en que debemos resolver cualquier expresión matemática.' },
  { file: 'paa-arit-n1-02.mp3', text: 'Aquí está nuestro problema. Vamos a resolverlo paso a paso usando el orden de las operaciones.' },
  { file: 'paa-arit-n1-03.mp3', text: 'La primera P es de Paréntesis. Siempre resolvemos primero lo que está dentro del paréntesis.' },
  { file: 'paa-arit-n1-04.mp3', text: 'Seis dividido entre tres es dos. Reemplazamos el paréntesis con ese resultado.' },
  { file: 'paa-arit-n1-05.mp3', text: 'Ahora viene la M de Multiplicación y D de división. Estas van antes que la suma y la resta. En este caso, sólo tenemos una multiplicación.' },
  { file: 'paa-arit-n1-06.mp3', text: 'Cuatro por dos es ocho. Reemplazamos esa parte de la expresión.' },
  { file: 'paa-arit-n1-07.mp3', text: 'Ahora la suma: de izquierda a derecha, primero tres más ocho.' },
  { file: 'paa-arit-n1-08.mp3', text: 'Tres más ocho es once. Ahora la resta. Cuánto es once menos dos.' },
  { file: 'paa-arit-n1-09.mp3', text: '¡Perfecto! La respuesta es nueve. Hemos aplicado así el orden de las operaciones correctamente.' },
];

/** PAA Álgebra N1 — linearSolveWalkthrough, audioPrefix: paa-algebra-n1-wt */
const algebraN1Wt = [
  {
    file: 'paa-algebra-n1-wt-01.mp3',
    text: 'Vamos a despejar una ecuación lineal. Primero sumamos o restamos en ambos lados para quitar el número suelto; después dividimos para dejar la x sola.',
  },
  {
    file: 'paa-algebra-n1-wt-02.mp3',
    text: 'Aquí está la ecuación: dos x más cinco igual trece. La resolveremos paso a paso en el tablero.',
  },
  {
    file: 'paa-algebra-n1-wt-03.mp3',
    text: 'Primero restamos cinco en ambos lados. Así movemos el más cinco al otro lado de la ecuación.',
  },
  {
    file: 'paa-algebra-n1-wt-04.mp3',
    text: 'Quedó dos x igual ocho. Ahora toca dividir entre dos para despejar x.',
  },
  {
    file: 'paa-algebra-n1-wt-05.mp3',
    text: 'Dividimos ambos lados entre dos. Ese es el paso de multiplicación o división del diagrama.',
  },
  {
    file: 'paa-algebra-n1-wt-06.mp3',
    text: '¡Perfecto! x es igual a cuatro. Ya despejaste la ecuación correctamente.',
  },
];

const SETS = {
  'arit-n1': aritmeticaN1,
  'algebra-n1': algebraN1Wt,
};

module.exports = { SETS, aritmeticaN1, algebraN1Wt };
