import { BadgeInfo } from '../types/game';

export const ALL_BADGES: Omit<BadgeInfo, 'isUnlocked'>[] = [
  {
    id: 'badge_primera_suma',
    title: 'Semillita de Mendoza',
    description: '¡Completaste tu primera suma repetitiva de canastos!',
    howToEarn: 'Resuelve un ejercicio de suma en el Parque San Martín.',
    icon: '🌱',
    category: 'SUMA',
    colorGradient: 'from-emerald-400 to-green-500',
  },
  {
    id: 'badge_palabra_veces',
    title: 'Descubridor de «Veces»',
    description: '¡Entendiste cuántas veces se repite el mismo número!',
    howToEarn: 'Completa un desafío de «veces» en los Viñedos de Maipú.',
    icon: '🍇',
    category: 'VECES',
    colorGradient: 'from-purple-400 to-violet-600',
  },
  {
    id: 'badge_salto_por',
    title: 'Varita Mágica del «Por» (×)',
    description: '¡Transformaste una suma repetitiva en multiplicación!',
    howToEarn: 'Usa la Máquina Mágica o avanza a la Estación del Valle de Uco.',
    icon: '✨',
    category: 'MULTIPLICACION',
    colorGradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'badge_tabla_1',
    title: 'Sol Mendocino (Tabla del 1)',
    description: '¡Sabes que 1 vez cualquier número da el mismo número!',
    howToEarn: 'Resuelve un ejercicio de la tabla del 1.',
    icon: '☀️',
    category: 'TABLA',
    colorGradient: 'from-yellow-300 to-amber-500',
  },
  {
    id: 'badge_tabla_2',
    title: 'Paso del Guanaco (Tabla del 2)',
    description: '¡Saltas de 2 en 2 sin equivocarte por la cordillera!',
    howToEarn: 'Acierta un desafío de la tabla del 2.',
    icon: '🦙',
    category: 'TABLA',
    colorGradient: 'from-sky-400 to-blue-600',
  },
  {
    id: 'badge_tabla_3',
    title: 'Cerezas de Tunuyán (Tabla del 3)',
    description: '¡Sumas grupitos de 3 cerezas con gran maestría!',
    howToEarn: 'Acierta un desafío de la tabla del 3.',
    icon: '🍒',
    category: 'TABLA',
    colorGradient: 'from-rose-400 to-red-600',
  },
  {
    id: 'badge_tabla_4',
    title: 'Astucia del Zorro (Tabla del 4)',
    description: '¡Cuentas de 4 en 4 con la agilidad del Zorrito!',
    howToEarn: 'Acierta un desafío de la tabla del 4.',
    icon: '🦊',
    category: 'TABLA',
    colorGradient: 'from-orange-400 to-amber-600',
  },
  {
    id: 'badge_tabla_5',
    title: 'Manos Cosechadoras (Tabla del 5)',
    description: '¡5 dedos, 5 puntas de hojas de vid! ¡Tabla del 5 dominada!',
    howToEarn: 'Acierta un desafío de la tabla del 5.',
    icon: '🖐️',
    category: 'TABLA',
    colorGradient: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'badge_cumbre_aconcagua',
    title: 'Cumbre del Aconcagua',
    description: '¡Llegaste a lo más alto de la Aventura de Mendoza!',
    howToEarn: 'Completa todas las estaciones de la Aventura.',
    icon: '🏔️',
    category: 'AVENTURA',
    colorGradient: 'from-indigo-400 to-purple-700',
  },
  {
    id: 'badge_atrapa_cosecha',
    title: 'Cosechador Veloz',
    description: '¡Atrapaste resultados correctos en el camión de la finca!',
    howToEarn: 'Juega una ronda en Atrapa la Cosecha.',
    icon: '🧺',
    category: 'JUEGO',
    colorGradient: 'from-lime-400 to-emerald-600',
  },
  {
    id: 'badge_memoria_genio',
    title: 'Memoria de Gigante',
    description: '¡Emparejaste las tarjetas de suma y multiplicación!',
    howToEarn: 'Gana una partida de Memoria de Parejas.',
    icon: '🧠',
    category: 'JUEGO',
    colorGradient: 'from-fuchsia-400 to-pink-600',
  },
  {
    id: 'badge_desafio_veloz',
    title: 'Relámpago de los Andes',
    description: '¡Superaste el Modo Desafío de 5 multiplicaciones contra el reloj!',
    howToEarn: 'Completa una carrera del Modo Desafío contra el tiempo.',
    icon: '⚡',
    category: 'JUEGO',
    colorGradient: 'from-amber-400 via-orange-500 to-red-500',
  },
];

export interface PlayerRank {
  level: number;
  title: string;
  minStars: number;
  icon: string;
  motto: string;
}

export const PLAYER_RANKS: PlayerRank[] = [
  { level: 1, title: 'Brote de la Vid', minStars: 0, icon: '🌱', motto: '¡Empezando a sumar grupitos!' },
  { level: 2, title: 'Racimo Dulce', minStars: 4, icon: '🍇', motto: '¡Descubriendo la palabra veces!' },
  { level: 3, title: 'Mago del Por (×)', minStars: 10, icon: '✨', motto: '¡Transformando sumas en tablas!' },
  { level: 4, title: 'Guía de los Andes', minStars: 20, icon: '🏔️', motto: '¡Dominando las tablas hasta el 5!' },
  { level: 5, title: 'Gran Campeón de Mendoza', minStars: 35, icon: '👑', motto: '¡Maestro/a total de 2° grado!' },
];

export function getPlayerRank(stars: number): PlayerRank {
  for (let i = PLAYER_RANKS.length - 1; i >= 0; i--) {
    if (stars >= PLAYER_RANKS[i].minStars) {
      return PLAYER_RANKS[i];
    }
  }
  return PLAYER_RANKS[0];
}
