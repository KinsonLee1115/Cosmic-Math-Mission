

import React, { useState } from 'react';
import Button from './Button';
import { OperationType, DifficultyLevel, FriendType, GameMode } from '../types';
import IconButton from './IconButton';
import ThreeNumAdditionGuide from './ThreeNumAdditionGuide';

interface StartScreenProps {
  onStart: (numQuestions: number, operationType: OperationType, selectedDifficulty: DifficultyLevel, selectedFriend: FriendType, gameMode: GameMode) => void;
  playClick: () => void;
  selectedFriend: FriendType; // Initial selected friend from App state
  onBackToHome: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, playClick, selectedFriend: initialSelectedFriend, onBackToHome }) => {
  const [selectedNumQuestions, setSelectedNumQuestions] = useState(5);
  const [selectedOperationType, setSelectedOperationType] = useState<OperationType>('mixed');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('k2');
  const [currentSelectedFriend, setCurrentSelectedFriend] = useState<FriendType>(initialSelectedFriend);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('choice'); // New state for game mode
  const [showGuide, setShowGuide] = useState(false);

  const questionOptions = [5, 10, 15, 20, 25, 30];
  const operationOptions: { label: string, type: OperationType, emoji: string }[] = [
    { label: 'Addition', type: 'addition', emoji: '➕' },
    { label: '3-Num Addition', type: 'addition3', emoji: '➕➕' },
    { label: 'Subtraction', type: 'subtraction', emoji: '➖' },
    { label: 'Mixed', type: 'mixed', emoji: '⭐' },
  ];
  const difficultyOptions: { label: string, type: DifficultyLevel, description: string }[] = [
    { label: 'K2', type: 'k2', description: 'Numbers up to 10. Perfect for beginners.' },
    { label: 'P1', type: 'p1', description: 'Numbers up to 20. Simple two-digit calculations.' },
    { label: 'P2', type: 'p2', description: 'Numbers up to 100.' },
    { label: 'P3', type: 'p3', description: 'Numbers up to 200.' },
  ];
  const friendOptions: { label: string, type: FriendType, emoji: string }[] = [
    { label: 'Unicorn', type: 'unicorn', emoji: '🦄' },
    { label: 'Dog', type: 'dog', emoji: '🐶' },
    { label: 'Cat', type: 'cat', emoji: '🐱' },
  ];
  const gameModeOptions: { label: string, type: GameMode, emoji: string }[] = [
    { label: 'Easy Mode', type: 'choice', emoji: '✅' },
    { label: 'Hard Mode', type: 'dragAndDrop', emoji: '🖐️' },
  ];

  const handleStartGame = () => {
    playClick();
    onStart(selectedNumQuestions, selectedOperationType, selectedDifficulty, currentSelectedFriend, selectedGameMode);
  };

  return (
    <div className="relative flex flex-col items-center justify-between p-4 sm:p-8 pt-10 sm:pt-20 md:p-12 md:pt-24 gap-y-4 sm:gap-y-6 animate-fade-in w-full max-w-2xl bg-white rounded-3xl shadow-xl border-8 border-dashed border-purple-400 min-h-[500px] overflow-y-auto">
      <div className="absolute top-4 left-4 z-30">
        <IconButton onClick={onBackToHome} aria-label="Back to Home" className="p-2 sm:p-3">
          <span className="text-2xl sm:text-3xl">🏠</span>
        </IconButton>
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 mb-1 sm:mb-2 text-center leading-tight drop-shadow-lg z-10">
          Freya Math Adventure!
        </h1>
        <p className="text-lg sm:text-2xl text-pink-600 text-center max-w-md z-10 font-medium">
          Let's explore numbers! <span role="img" aria-label="Sparkles">✨</span>
        </p>
      </div>

      <div className="flex flex-col gap-y-3 sm:gap-y-4 w-full max-w-2xl mt-2 z-10">
        {/* Settings Sections */}
        <div className="flex flex-col items-center gap-y-2 p-3 sm:p-4 bg-blue-50 rounded-2xl border-3 border-blue-300 shadow-sm">
          <label className="text-base sm:text-xl font-semibold text-purple-700">How many questions?</label>
          <div className="flex flex-wrap justify-center gap-2">
            {questionOptions.map((option) => (
              <button key={option} onClick={() => { playClick(); setSelectedNumQuestions(option); }} className={`px-4 sm:px-6 py-1 sm:py-2 rounded-xl text-lg sm:text-xl font-bold transition-all ${selectedNumQuestions === option ? 'bg-blue-500 text-white border-b-4 border-blue-700' : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-b-2 border-blue-300'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-2 p-3 sm:p-4 bg-green-500/10 rounded-2xl border-3 border-green-300 shadow-sm">
          <label className="text-base sm:text-xl font-semibold text-purple-700">Choose your math power:</label>
          <div className="flex flex-wrap justify-center gap-2">
            {operationOptions.map((option) => (
              <button key={option.type} onClick={() => { playClick(); setSelectedOperationType(option.type); }} className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-base sm:text-lg font-bold transition-all ${selectedOperationType === option.type ? 'bg-green-500 text-white border-b-4 border-green-700' : 'bg-green-100 text-green-800 hover:bg-green-200 border-b-2 border-green-300'}`}>
                <span className="text-xl">{option.emoji}</span> {option.label}
              </button>
            ))}
          </div>
          {selectedOperationType === 'addition3' && (
            <button
              onClick={() => { playClick(); setShowGuide(true); }}
              className="mt-2 text-sm sm:text-base font-extrabold text-green-700 bg-white border-2 border-green-400 hover:bg-green-50 px-4 py-1.5 rounded-full shadow-sm animate-bounce-subtle flex items-center gap-1.5"
            >
              💡 Teaching Guide & Strategies! 🌈
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-y-2 p-3 sm:p-4 bg-pink-50 rounded-2xl border-3 border-pink-300 shadow-sm">
          <label className="text-base sm:text-xl font-semibold text-purple-700">Difficulty:</label>
          <div className="flex flex-wrap justify-center gap-2">
            {difficultyOptions.map((level) => (
              <button key={level.type} onClick={() => { playClick(); setSelectedDifficulty(level.type); }} title={level.description} className={`px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-sm sm:text-lg font-bold transition-all ${selectedDifficulty === level.type ? 'bg-teal-500 text-white border-b-4 border-teal-700' : 'bg-teal-100 text-teal-800 hover:bg-teal-200 border-b-2 border-teal-300'}`}>
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="flex flex-col items-center gap-y-2 p-3 sm:p-4 bg-yellow-50 rounded-2xl border-3 border-yellow-300 shadow-sm">
          <label className="text-base sm:text-xl font-semibold text-purple-700">Game Mode:</label>
          <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2 w-full max-w-lg">
            {gameModeOptions.map((mode) => (
              <button key={mode.type} onClick={() => { playClick(); setSelectedGameMode(mode.type); }} className={`flex items-center justify-center flex-1 gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-base sm:text-lg font-bold transition-all ${selectedGameMode === mode.type ? 'bg-yellow-500 text-white border-b-4 border-yellow-700' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-b-2 border-yellow-300'}`}>
                <span className="text-xl">{mode.emoji}</span> {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-2 p-3 sm:p-4 bg-purple-50 rounded-2xl border-3 border-purple-300 shadow-sm">
          <label className="text-base sm:text-xl font-semibold text-purple-700">Choose your buddy:</label>
          <div className="flex flex-wrap justify-center gap-2">
            {friendOptions.map((friend) => (
              <button key={friend.type} onClick={() => { playClick(); setCurrentSelectedFriend(friend.type); }} className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-base sm:text-lg font-bold transition-all ${currentSelectedFriend === friend.type ? 'bg-purple-500 text-white border-b-4 border-purple-700' : 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-b-2 border-purple-300'}`}>
                <span className="text-6xl">{friend.emoji}</span> {friend.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={handleStartGame} className="w-full sm:w-auto min-w-[200px] mt-4 text-2xl sm:text-4xl py-4 sm:py-5 bg-gradient-to-r from-red-500 to-orange-500 border-red-800 z-10 shadow-xl">
        Let's Go! 🚀
      </Button>

      {showGuide && (
        <ThreeNumAdditionGuide onClose={() => { playClick(); setShowGuide(false); }} playClick={playClick} />
      )}
    </div>
  );
};

export default StartScreen;