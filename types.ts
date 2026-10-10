
export type GameState = 'start' | 'playing' | 'finished';

export type GameTopic = 'menu' | 'calculation' | 'numberBonds' | 'learn' | 'conceptQuiz';

export type Operator = '+' | '-';

export type OperationType = 'addition' | 'addition3' | 'subtraction' | 'mixed';

export type DifficultyLevel = 'k2' | 'p1' | 'p2' | 'p3'; // New type for difficulty levels

export type FriendType = 'unicorn' | 'dog' | 'cat'; // New type for friend selection

export type GameMode = 'choice' | 'dragAndDrop'; // New: To select game type

export interface Question {
  num1: number;
  num2: number;
  num3?: number;
  operator: Operator;
  answer: number;
  choices: number[];
}

export interface NumberBondsProblem {
  whole: number;
  part1: number;
  missingPart: number;
}

// Types for the new Learn & Quiz section
export type ConceptId = 'numRecognition' | 'shapes' | 'patterns' | 'sorting' | 'clock' | 'numSense' | 'measurement' | 'data';

export interface Concept {
  id: ConceptId;
  title: string;
  description: string;
  emoji: string;
}

export interface QuizOption {
  text: string;
  image: string; // Emoji
}

export type ClockImage = { type: 'clock'; hour: number; minute: number };

export interface ConceptQuestion {
  conceptId: ConceptId;
  text: string;
  image: string | ClockImage; // Emoji for the main question graphic
  options: QuizOption[];
  correctAnswerIndex: number;
}