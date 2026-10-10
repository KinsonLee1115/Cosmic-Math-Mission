
import React, { useState, useCallback } from 'react';
import NumberBondsScreen from './components/NumberBondsScreen';
import NumberBondsStartScreen from './components/NumberBondsStartScreen';
import useAudioPlayer from './hooks/useAudioPlayer';
import { NumberBondsProblem } from './types';

// Helper to generate a single random problem
const generateSingleRandomProblem = (): NumberBondsProblem => {
  const whole = Math.floor(Math.random() * 9) + 2; // 2-10
  const part1 = Math.floor(Math.random() * (whole - 1)) + 1; // 1 to (whole - 1)
  return { whole, part1, missingPart: whole - part1 };
};

// Helper to generate a list of random problems
const generateRandomProblems = (count: number): NumberBondsProblem[] => {
  return Array.from({ length: count }, generateSingleRandomProblem);
};

// Helper to generate all unique problems for a specific number
const generateProblemsForWhole = (whole: number): NumberBondsProblem[] => {
  const problems: NumberBondsProblem[] = [];
  for (let part1 = 1; part1 < whole; part1++) {
    problems.push({
      whole,
      part1,
      missingPart: whole - part1,
    });
  }
  // Shuffle the problems for variety
  return problems.sort(() => Math.random() - 0.5);
};


const NumberBondsGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [mode, setMode] = useState<'start' | 'playing'>('start');
  const [problems, setProblems] = useState<NumberBondsProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const { playClick, playCorrect, playIncorrect } = useAudioPlayer();

  const handleStart = useCallback((target: number | 'random') => {
    playClick();
    const newProblems = target === 'random' ? generateRandomProblems(10) : generateProblemsForWhole(target);
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setLastAnswerCorrect(null);
    setMode('playing');
  }, [playClick]);
  
  const handleNextProblem = useCallback(() => {
    setLastAnswerCorrect(null);
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
    } else {
      // Finished all questions, go back to the selection screen
      setMode('start');
    }
  }, [currentProblemIndex, problems.length]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    setLastAnswerCorrect(isCorrect);
  }, []);

  const handleBackToSelection = useCallback(() => {
    playClick();
    setMode('start');
  }, [playClick]);


  if (mode === 'start') {
    return <NumberBondsStartScreen onStart={handleStart} onExit={onExit} />;
  }

  const currentProblem = problems[currentProblemIndex];

  return (
    <NumberBondsScreen
      problem={currentProblem}
      onAnswer={handleAnswer}
      onNext={handleNextProblem}
      onExit={handleBackToSelection} // "Exit" on game screen returns to selection
      playClick={playClick}
      playCorrect={playCorrect}
      playIncorrect={playIncorrect}
      questionNumber={currentProblemIndex + 1}
      totalQuestions={problems.length}
      lastAnswerCorrect={lastAnswerCorrect}
    />
  );
};

export default NumberBondsGame;