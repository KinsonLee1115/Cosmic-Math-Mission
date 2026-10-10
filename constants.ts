
import { Question, Operator, OperationType, DifficultyLevel } from './types';

export const NUM_CHOICES = 3; // Number of answer choices, including the correct one

// Define number ranges for different difficulty levels
export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, {
  minOperand: number;
  maxOperand: number;
  maxAdditionAnswer: number;
  maxSubtractionNum1: number; // Max for the first number in subtraction to control results
}> = {
  k2: {
    minOperand: 1,
    maxOperand: 12, // was 10
    maxAdditionAnswer: 24, // was 20
    maxSubtractionNum1: 15, // was 10
  },
  p1: {
    minOperand: 1,
    maxOperand: 25, // was 20
    maxAdditionAnswer: 50, // was 40
    maxSubtractionNum1: 30, // was 20
  },
  p2: {
    minOperand: 10, // Start with slightly larger numbers
    maxOperand: 75, // was 50
    maxAdditionAnswer: 150, // was 100
    maxSubtractionNum1: 150, // was 100
  },
  p3: {
    minOperand: 20, // Even larger numbers
    maxOperand: 150, // was 100
    maxAdditionAnswer: 300, // was 200
    maxSubtractionNum1: 300, // was 200
  },
};

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Update generateQuestion to accept difficultyLevel
export function generateQuestion(difficultyLevel: DifficultyLevel, operationType: OperationType): Question {
  const settings = DIFFICULTY_SETTINGS[difficultyLevel];
  let operator: Operator;

  if (operationType === 'addition' || operationType === 'addition3') {
    operator = '+';
  } else if (operationType === 'subtraction') {
    operator = '-';
  } else { // 'mixed'
    operator = Math.random() < 0.5 ? '+' : '-';
  }

  let num1: number;
  let num2: number;
  let num3: number | undefined;
  let answer: number;

  if (operationType === 'addition3') {
    operator = '+';
    let minSingle = 1;
    let maxSingle = 5;
    if (difficultyLevel === 'k2') {
      minSingle = 1;
      maxSingle = 4; // K2 limits to smaller single digits to keep sum simple for 4-year-olds
    } else if (difficultyLevel === 'p1') {
      minSingle = 1;
      maxSingle = 9;
    } else if (difficultyLevel === 'p2') {
      minSingle = 2;
      maxSingle = 9;
    } else { // p3
      minSingle = 4;
      maxSingle = 9;
    }
    num1 = generateRandomNumber(minSingle, maxSingle);
    num2 = generateRandomNumber(minSingle, maxSingle);
    num3 = generateRandomNumber(minSingle, maxSingle);
    answer = num1 + num2 + num3;
  } else if (operator === '+') {
    // For addition, ensure num1 + num2 does not exceed maxAdditionAnswer
    num1 = generateRandomNumber(settings.minOperand, settings.maxOperand);
    num2 = generateRandomNumber(settings.minOperand, Math.min(settings.maxOperand, settings.maxAdditionAnswer - num1));
    answer = num1 + num2;
  } else {
    // For subtraction, ensure num1 >= num2 and num1 does not exceed maxSubtractionNum1
    num1 = generateRandomNumber(settings.minOperand, settings.maxSubtractionNum1);
    num2 = generateRandomNumber(settings.minOperand, num1); // num2 must be less than or equal to num1
    answer = num1 - num2;
  }

  // Use a Set to store unique choices
  const uniqueChoices = new Set<number>();
  uniqueChoices.add(answer);

  while (uniqueChoices.size < NUM_CHOICES) {
    let wrongChoice: number;
    // Generate wrong choices that are close to the answer but not identical
    const offset = generateRandomNumber(-2, 2); // Difference of -2, -1, 1, 2
    wrongChoice = answer + offset;

    // Ensure wrong choices are not less than 0
    if (wrongChoice < 0) {
      wrongChoice = 0;
    }
    // Ensure wrong choices are within a reasonable range for the current difficulty
    // For simplicity, we'll bound them roughly by the max possible answer for that difficulty + a small buffer
    const upperbound = difficultyLevel === 'k2' ? 25 : difficultyLevel === 'p1' ? 45 : difficultyLevel === 'p2' ? 105 : 205;
    if (wrongChoice > upperbound) {
        wrongChoice = upperbound;
    }

    if (!uniqueChoices.has(wrongChoice)) {
      uniqueChoices.add(wrongChoice);
    }
  }

  // Convert the Set to an array and then shuffle
  const shuffledChoices = Array.from(uniqueChoices).sort(() => Math.random() - 0.5);

  return { num1, num2, num3, operator, answer, choices: shuffledChoices };
}