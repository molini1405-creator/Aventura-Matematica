export type GameScreen =
  | 'TITLE'
  | 'TUTORIAL_INTRO'
  | 'AVENTURA'
  | 'MAQUINA_MAGICA'
  | 'COSECHA_RAPIDA'
  | 'MEMORIA_PAREJAS'
  | 'TABLA_PITAGORICA'
  | 'MODO_DESAFIO'
  | 'RECOMPENSAS'
  | 'DIPLOMA';

export interface ManipulativeItem {
  id: string;
  type: 'uva' | 'manzana' | 'cereza' | 'sol' | 'rueda' | 'estrella';
  color: string;
}

export type MascotType = 'zorrito' | 'guani' | 'condorito';

export interface BadgeInfo {
  id: string;
  title: string;
  description: string;
  howToEarn: string;
  icon: string;
  category: 'SUMA' | 'VECES' | 'MULTIPLICACION' | 'TABLA' | 'AVENTURA' | 'JUEGO';
  colorGradient: string;
  isUnlocked: boolean;
}

export interface QuestionData {
  id: string;
  stationName: string;
  stationNumber: number;
  stageType: 'SUMA_REPETIDA' | 'DESCUBRE_VECES' | 'SALTO_MULTIPLICACION' | 'TABLA_ENTRENAMIENTO';
  title: string;
  prompt: string;
  speechText: string;
  mascot: MascotType;
  mascotMessage: string;
  // Visual groups
  groupCount: number; // e.g. 3 baskets
  itemsPerGroup: number; // e.g. 2 grapes each
  itemType: 'uva' | 'manzana' | 'cereza' | 'sol' | 'rueda' | 'estrella';
  // Math representations
  additionEquation: string; // "2 + 2 + 2"
  timesExplanation: string; // "3 veces 2"
  multiplicationEquation: string; // "3 × 2"
  correctResult: number; // 6
  // Interaction style
  questionType: 'CHOOSE_RESULT' | 'FILL_ADDITION' | 'FILL_TIMES' | 'TRANSFORM_STEP' | 'TABLE_CHALLENGE';
  options: number[] | string[];
  correctOptionIndex: number;
  hint: string;
}

export interface UserProgress {
  currentStation: number;
  currentQuestionIndex: number;
  starsCount: number;
  completedStations: number[];
  unlockedBadgeIds: string[];
  playerName: string;
  schoolName: string;
  tablesMastered: number[]; // [1, 2, 3, 4, 5]
}
