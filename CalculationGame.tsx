
import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { GameState, Question, OperationType, DifficultyLevel, FriendType, GameMode } from './types';
import { generateQuestion } from './constants';
import useAudioPlayer from './hooks/useAudioPlayer';

interface CalculationGameProps {
  onExit: () => void;
}

const CalculationGame: React.FC<CalculationGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [numQuestions, setNumQuestions] = useState(5);
  const [operationType, setOperationType] = useState<OperationType>('mixed');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('k2');
  const [selectedFriend, setSelectedFriend] = useState<FriendType>('unicorn');
  const [gameMode, setGameMode] = useState<GameMode>('choice');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  const { playClick, playCorrect, playIncorrect } = useAudioPlayer();

  const initializeGame = useCallback((
    selectedNumQuestions: number,
    selectedOperationType: OperationType,
    difficulty: DifficultyLevel,
    selectedFriendType: FriendType,
    selectedGameMode: GameMode
  ) => {
    setNumQuestions(selectedNumQuestions);
    setOperationType(selectedOperationType);
    setSelectedDifficulty(difficulty);
    setSelectedFriend(selectedFriendType);
    setGameMode(selectedGameMode);
    
    const newQuestions: Question[] = [];
    const questionKeys = new Set<string>(); // To track uniqueness
    
    // Set a limit to prevent potential infinite loops if the question pool is small
    const maxAttempts = selectedNumQuestions * 10; 
    let attempts = 0;

    while (newQuestions.length < selectedNumQuestions && attempts < maxAttempts) {
      const question = generateQuestion(difficulty, selectedOperationType);
      let key: string;

      if (question.num3 !== undefined) {
        // Sort the three operands for addition uniqueness check
        const sorted = [question.num1, question.num2, question.num3].sort((a, b) => a - b);
        key = `${sorted[0]}+${sorted[1]}+${sorted[2]}`;
      } else if (question.operator === '+') {
        // For addition, treat 2+3 and 3+2 as the same question by sorting operands
        key = `${Math.min(question.num1, question.num2)}+${Math.max(question.num1, question.num2)}`;
      } else {
        // For subtraction, order matters
        key = `${question.num1}-${question.num2}`;
      }
      
      if (!questionKeys.has(key)) {
        questionKeys.add(key);
        newQuestions.push(question);
      }
      attempts++;
    }

    // If we couldn't generate enough unique questions (e.g., small pool, high question count),
    // fill the rest with non-unique questions to meet the user's request.
    while (newQuestions.length < selectedNumQuestions) {
        newQuestions.push(generateQuestion(difficulty, selectedOperationType));
    }

    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setLastAnswerCorrect(null);
    setGameState('playing');
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && questions.length === 0) {
      initializeGame(numQuestions, operationType, selectedDifficulty, selectedFriend, gameMode);
    }
  }, [gameState, questions.length, initializeGame, numQuestions, operationType, selectedDifficulty, selectedFriend, gameMode]);

  const handleAnswer = useCallback((selectedAnswer: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      const isCorrect = selectedAnswer === currentQuestion.answer;
      setLastAnswerCorrect(isCorrect);
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
    }
  }, [questions, currentQuestionIndex]);

  const goToNextQuestion = useCallback(() => {
    setLastAnswerCorrect(null);
    if (currentQuestionIndex < numQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setGameState('finished');
    }
  }, [currentQuestionIndex, numQuestions]);

  const handleBackToHome = useCallback(() => {
    onExit();
  }, [onExit]);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      {gameState === 'start' && <StartScreen onStart={initializeGame} playClick={playClick} selectedFriend={selectedFriend} onBackToHome={handleBackToHome} />}
      {gameState === 'playing' && currentQuestion && (
        <GameScreen
          question={currentQuestion}
          onAnswer={handleAnswer}
          onNextQuestion={goToNextQuestion}
          currentQuestionNumber={currentQuestionIndex + 1}
          totalQuestions={numQuestions}
          lastAnswerCorrect={lastAnswerCorrect}
          playClick={playClick}
          playCorrect={playCorrect}
          playIncorrect={playIncorrect}
          selectedDifficulty={selectedDifficulty}
          onBackToHome={handleBackToHome}
          selectedFriend={selectedFriend}
          gameMode={gameMode}
        />
      )}
      {gameState === 'finished' && (
        <ResultScreen
          score={score}
          totalQuestions={numQuestions}
          onPlayAgain={initializeGame}
          playClick={playClick}
          numQuestions={numQuestions}
          operationType={operationType}
          selectedDifficulty={selectedDifficulty}
          onBackToHome={handleBackToHome}
          gameMode={gameMode}
          selectedFriend={selectedFriend}
        />
      )}
    </>
  );
};

export default CalculationGame;