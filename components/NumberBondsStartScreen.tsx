
import React from 'react';
import IconButton from './IconButton';
import useAudioPlayer from '../hooks/useAudioPlayer';

interface NumberBondsStartScreenProps {
  onStart: (target: number | 'random') => void;
  onExit: () => void;
}

const NumberBondsStartScreen: React.FC<NumberBondsStartScreenProps> = ({ onStart, onExit }) => {
  const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const { playClick } = useAudioPlayer();

  const handleSelect = (target: number | 'random') => {
    playClick();
    onStart(target);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 sm:p-8 pt-16 sm:pt-24 gap-y-6 sm:gap-y-8 animate-fade-in w-full max-w-2xl bg-white rounded-3xl shadow-xl border-8 border-dashed border-blue-400 min-h-[500px]">
      <div className="absolute top-4 left-4 z-30">
        <IconButton onClick={onExit} aria-label="Back to Home" className="p-2 sm:p-3">
          <span className="text-2xl sm:text-3xl">🏠</span>
        </IconButton>
      </div>

      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 mb-1 sm:mb-2 text-center leading-tight drop-shadow-lg z-10">
          Number Bonds Fun!
        </h1>
        <p className="text-lg sm:text-2xl text-teal-600 text-center max-w-md z-10 font-medium">
          Choose a number to practice! <span role="img" aria-label="Brain">🧠</span>
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 w-full max-w-lg px-4">
        {numbers.map(num => (
          <button
            key={num}
            onClick={() => handleSelect(num)}
            className="p-4 rounded-2xl text-white text-4xl sm:text-5xl font-bold transition-all duration-300 transform bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 active:scale-98 shadow-lg hover:scale-105 border-b-4 border-yellow-700 hover:border-orange-800 aspect-square"
          >
            {num}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => handleSelect('random')}
        className="mt-4 p-4 sm:p-5 rounded-2xl text-white text-xl sm:text-3xl font-bold transition-all duration-300 transform bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-98 shadow-xl hover:scale-105 border-b-4 border-purple-700 hover:border-purple-800 w-full max-w-sm"
        >
        Random Mix <span role="img" aria-label="Dice">🎲</span>
      </button>

    </div>
  );
};

export default NumberBondsStartScreen;
