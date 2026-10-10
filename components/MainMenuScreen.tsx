
import React from 'react';
import { GameTopic } from '../types';
import useAudioPlayer from '../hooks/useAudioPlayer';

interface MainMenuScreenProps {
  onSelectTopic: (topic: GameTopic) => void;
}

const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ onSelectTopic }) => {
  const { playClick } = useAudioPlayer();

  const handleSelect = (topic: GameTopic) => {
    playClick();
    onSelectTopic(topic);
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 sm:p-8 pt-10 sm:pt-20 md:p-12 md:pt-24 gap-y-6 sm:gap-y-8 animate-fade-in w-full max-w-2xl bg-white rounded-3xl shadow-xl border-8 border-dashed border-purple-400 min-h-[500px]">
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 mb-1 sm:mb-2 text-center leading-tight drop-shadow-lg z-10">
          Freya Math Adventure!
        </h1>
        <p className="text-lg sm:text-2xl text-pink-600 text-center max-w-md z-10 font-medium">
          Choose Your Adventure! <span role="img" aria-label="Map">🗺️</span>
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-8 w-full max-w-sm">
        <button
          onClick={() => handleSelect('numberBonds')}
          className="p-4 sm:p-6 rounded-3xl text-white text-xl sm:text-3xl font-bold transition-all duration-300 transform bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 active:scale-98 shadow-xl hover:scale-105 border-b-4 border-blue-700 hover:border-blue-800"
        >
          Number Bonds Fun <span role="img" aria-label="Brain">🧠</span>
        </button>
        <button
          onClick={() => handleSelect('calculation')}
          className="p-4 sm:p-6 rounded-3xl text-white text-xl sm:text-3xl font-bold transition-all duration-300 transform bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 active:scale-98 shadow-xl hover:scale-105 border-b-4 border-green-700 hover:border-green-800"
        >
          Calculation Adventure <span role="img" aria-label="Plus and Minus">➕➖</span>
        </button>
        <button
          onClick={() => handleSelect('learn')}
          className="p-4 sm:p-6 rounded-3xl text-white text-xl sm:text-3xl font-bold transition-all duration-300 transform bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 active:scale-98 shadow-xl hover:scale-105 border-b-4 border-pink-700 hover:border-pink-800"
        >
          Learn Math Concepts <span role="img" aria-label="Book">📖</span>
        </button>
      </div>
    </div>
  );
};

export default MainMenuScreen;