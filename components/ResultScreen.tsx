
import React from 'react';
import Button from './Button';
import { OperationType, DifficultyLevel, GameMode, FriendType } from '../types';
import IconButton from './IconButton';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: (numQuestions: number, operationType: OperationType, selectedDifficulty: DifficultyLevel, selectedFriend: FriendType, gameMode: GameMode) => void;
  playClick: () => void;
  numQuestions: number;
  operationType: OperationType;
  selectedDifficulty: DifficultyLevel;
  onBackToHome: () => void;
  gameMode: GameMode;
  selectedFriend: FriendType;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalQuestions,
  onPlayAgain,
  playClick,
  numQuestions,
  operationType,
  selectedDifficulty,
  onBackToHome,
  gameMode,
  selectedFriend,
}) => {
  const percentage = (score / totalQuestions) * 100;
  let message = '';
  let subMessage = '';
  let bgColor = 'bg-yellow-100';

  if (percentage === 100) {
    message = 'Incredible! 🏆';
    subMessage = 'You are a Math Superhero!';
    bgColor = 'bg-green-100';
  } else if (percentage >= 70) {
    message = 'Wonderful! 🌟';
    subMessage = 'You handled those numbers like a pro!';
    bgColor = 'bg-blue-100';
  } else {
    message = 'Good Try! 👍';
    subMessage = 'Every question makes you smarter!';
    bgColor = 'bg-orange-100';
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-6 sm:p-12 pt-20 sm:pt-24 gap-y-6 sm:gap-y-10 animate-fade-in w-full max-w-2xl bg-white rounded-3xl shadow-xl border-8 border-dashed border-orange-400 min-h-[500px] overflow-y-auto">
      <div className="absolute top-4 left-4 z-30">
        <IconButton onClick={onBackToHome} aria-label="Back to Home" className="p-2 sm:p-3">
          <span className="text-2xl sm:text-3xl">🏠</span>
        </IconButton>
      </div>

      <div className="text-center z-10">
        <h2 className="text-4xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2 sm:mb-4 drop-shadow-md">
          All Done! 🎉
        </h2>
        <p className="text-xl sm:text-3xl font-bold text-gray-700 italic">
          {message}
        </p>
      </div>

      <div className={`text-center ${bgColor} p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border-8 border-white transform hover:scale-105 transition-transform duration-300 z-10`}>
        <p className="text-lg sm:text-2xl font-bold text-gray-500 mb-1 sm:mb-2 uppercase tracking-widest">Score</p>
        <p className="text-6xl sm:text-9xl font-extrabold text-orange-600 drop-shadow-lg">
          {score}<span className="text-gray-400 text-3xl sm:text-4xl mx-1 sm:mx-2">/</span>{totalQuestions}
        </p>
        <p className="text-lg sm:text-2xl font-medium text-gray-600 mt-2 sm:mt-4 max-w-xs mx-auto">
          {subMessage}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md z-10">
        <Button
          onClick={() => onPlayAgain(numQuestions, operationType, selectedDifficulty, selectedFriend, gameMode)}
          onSoundEffect={playClick}
          className="flex-1 text-xl sm:text-3xl bg-gradient-to-r from-green-500 to-blue-500 border-green-700 py-3 sm:py-4 shadow-xl hover:from-green-600 hover:to-blue-600"
        >
          Play Again!
        </Button>
        <Button
          onClick={onBackToHome}
          onSoundEffect={playClick}
          className="flex-1 text-xl sm:text-3xl bg-gradient-to-r from-gray-500 to-gray-600 border-gray-700 py-3 sm:py-4 shadow-xl hover:from-gray-600 hover:to-gray-700"
        >
          Home
        </Button>
      </div>
    </div>
  );
};

export default ResultScreen;