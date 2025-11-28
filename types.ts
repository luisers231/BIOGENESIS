export enum ThemeId {
  EVOLUCION = 'evolucion',
  ABIOGENESIS = 'abiogenesis',
  VAN_HELMONT = 'van_helmont',
  PASTEUR = 'pasteur',
  HALDANE_OPARIN = 'haldane_oparin',
  UREY_MILLER = 'urey_miller',
  PANSPERMIA = 'panspermia'
}

export interface Topic {
  id: ThemeId;
  title: string;
  description: string;
}

export enum ActivityType {
  FLASHCARDS = 'FLASHCARDS',
  MATCHING = 'MATCHING',
  TIMELINE = 'TIMELINE',
  TRIVIA = 'TRIVIA'
}

export interface ActivityItem {
  id: string;
  question: string; // Or front of card, or event description
  answer: string;   // Or back of card, or match pair, or date
  distractors?: string[]; // For multiple choice
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GameShowQuestion {
  question: string;
  answers: { text: string; points: number; revealed?: boolean }[];
}

export type GameMode = 'NONE' | 'LEARN' | 'ACTIVITIES' | 'QUIZ' | 'ARCADE' | 'GALILEANOS';

export interface ArcadeGame {
  id: 'AHORCADO' | 'TIC_TAC_TOE' | 'JEOPARDY';
  name: string;
}

export const TOPICS: Topic[] = [
  { id: ThemeId.EVOLUCION, title: 'Evolución', description: 'El cambio en las características de las poblaciones biológicas a través de generaciones.' },
  { id: ThemeId.ABIOGENESIS, title: 'Abiogénesis', description: 'El origen natural de la vida a partir de materia inerte.' },
  { id: ThemeId.VAN_HELMONT, title: 'Van Helmont', description: 'La teoría de la generación espontánea y experimentos iniciales.' },
  { id: ThemeId.PASTEUR, title: 'Louis Pasteur', description: 'Refutación definitiva de la generación espontánea. Biogénesis.' },
  { id: ThemeId.HALDANE_OPARIN, title: 'Haldane y Oparín', description: 'Teoría físico-química del origen de la vida en la Tierra primitiva.' },
  { id: ThemeId.UREY_MILLER, title: 'Urey y Miller', description: 'Experimento que simuló las condiciones de la Tierra primitiva.' },
  { id: ThemeId.PANSPERMIA, title: 'Panspermia', description: 'Hipótesis de que la vida existe en todo el Universo.' },
];