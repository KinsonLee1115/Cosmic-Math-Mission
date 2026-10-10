
import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import NumberPalette from './NumberPalette';
import IconButton from './IconButton';
import { NumberBondsProblem } from '../types';
import useTextToSpeech from '../hooks/useTextToSpeech';

interface NumberBondsScreenProps {
  problem: NumberBondsProblem;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  onExit: () => void;
  playClick: () => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  questionNumber: number;
  totalQuestions: number;
  lastAnswerCorrect: boolean | null;
}

const getQuestionTextForSpeech = (p: NumberBondsProblem): string => {
  return `What number plus ${p.part1} makes ${p.whole}?`;
};

const NumberBondsScreen: React.FC<NumberBondsScreenProps> = ({
  problem, onAnswer, onNext, onExit, playClick, playCorrect, playIncorrect, questionNumber, totalQuestions, lastAnswerCorrect
}) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [jiggle, setJiggle] = useState('');
  const { speak } = useTextToSpeech();
  const answerInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserAnswer('');
    setHasAnswered(false);
    const textToSpeak = getQuestionTextForSpeech(problem);
    const speechTimer = setTimeout(() => speak(textToSpeak), 500);
    return () => clearTimeout(speechTimer);
  }, [problem, speak]);

  useEffect(() => {
    if (lastAnswerCorrect === true) {
      setHasAnswered(true);
      playCorrect();
      speak("Correct!");
    } else if (lastAnswerCorrect === false) {
      setHasAnswered(true);
      playIncorrect();
      speak("Try again!");
    }
  }, [lastAnswerCorrect, playCorrect, playIncorrect, speak]);

  const handleCheck = () => {
    if (userAnswer === '') return;
    playClick();
    const isCorrect = parseInt(userAnswer, 10) === problem.missingPart;
    onAnswer(isCorrect);
  };

  const handleNumberClick = (num: number) => {
    playClick();
    if (userAnswer.length < 2) {
      setUserAnswer(userAnswer + String(num));
    }
  };

  const handleDeleteClick = () => {
    playClick();
    setUserAnswer(userAnswer.slice(0, -1));
  };

  const triggerJiggle = (part: 'part1' | 'part2' | 'whole') => {
    setJiggle(part);
    setTimeout(() => setJiggle(''), 300);
  };

  const getSlotClass = () => {
    if (!hasAnswered) {
      return 'bg-pink-100 border-pink-400 text-pink-700';
    }
    return lastAnswerCorrect ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800';
  };

  return (
    <div className="relative flex flex-col items-center p-4 sm:p-6 pt-16 sm:pt-24 gap-y-4 sm:gap-y-6 animate-scale-in w-full max-w-2xl bg-white rounded-3xl shadow-xl border-8 border-dashed border-blue-400 transition-all duration-300 min-h-[500px] overflow-visible">
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30">
        <IconButton onClick={onExit} aria-label="Back to Home" className="p-2 sm:p-3"><span className="text-2xl sm:text-3xl">🏠</span></IconButton>
      </div>
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30">
        <IconButton onClick={() => speak(getQuestionTextForSpeech(problem))} aria-label="Read question aloud" className="p-2 sm:p-3">
          <span className="text-2xl sm:text-3xl">🔊</span>
        </IconButton>
      </div>

      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 mb-0 sm:mb-1 text-center leading-tight drop-shadow-lg z-10 mt-2 sm:mt-4">Number Bonds Fun!</h1>
      <p className="text-base sm:text-xl text-teal-600 text-center max-w-md z-10 font-medium -mt-2 sm:-mt-1">Let's make {problem.whole}! <span role="img" aria-label="Thinking Face">🤔</span></p>

      <div className="w-full max-w-sm px-4 mb-2 z-10">
        <div className="flex items-center justify-center bg-blue-100 rounded-full shadow-inner border-2 border-blue-200 p-1 mb-2">
          <span className="text-lg sm:text-xl font-semibold text-blue-600 mr-2">Question</span>
          <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full text-blue-800 font-bold text-2xl sm:text-3xl shadow-md border-2 border-blue-300">{questionNumber}</span>
          <span className="text-lg sm:text-xl font-semibold text-blue-600 ml-2">/ {totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 sm:h-6 shadow-inner overflow-hidden border-2 border-white" role="progressbar" aria-valuenow={questionNumber} aria-valuemin={1} aria-valuemax={totalQuestions}>
          <div
            className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative w-full h-64 sm:h-80 flex items-center justify-center my-4">
        {/* Lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-full -translate-y-1/2 w-1/4 h-1 bg-gray-300 rounded-full origin-right -rotate-45" />
        <div className="absolute top-1/2 left-1/2 translate-x-0 -translate-y-1/2 w-1/4 h-1 bg-gray-300 rounded-full origin-left rotate-45" />
        
        {/* Whole Circle */}
        <div 
          onClick={() => triggerJiggle('whole')} 
          className={`absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 bg-purple-100 border-4 border-purple-300 rounded-full shadow-lg text-6xl sm:text-7xl font-bold text-purple-700 cursor-pointer hover:scale-105 transition-transform ${jiggle === 'whole' ? 'animate-jiggle' : ''}`}
        >
          {problem.whole}
        </div>

        {/* Part 1 Circle */}
        <div 
          onClick={() => triggerJiggle('part1')}
          className={`absolute bottom-0 left-1/4 -translate-x-1/2 flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-yellow-100 border-4 border-yellow-300 rounded-full shadow-lg text-5xl sm:text-6xl font-bold text-yellow-700 cursor-pointer hover:scale-105 transition-transform ${jiggle === 'part1' ? 'animate-jiggle' : ''}`}
        >
          {problem.part1}
        </div>

        {/* Part 2 Circle (Answer) */}
        <div
          ref={answerInputRef}
          className={`absolute bottom-0 right-1/4 translate-x-1/2 flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-lg text-5xl sm:text-6xl font-bold transition-all duration-300 border-4 ${getSlotClass()}`}
        >
          {userAnswer || '?'}
        </div>
      </div>

      <div className="h-40 flex flex-col items-center justify-start">
        {!hasAnswered && (
          <NumberPalette
            isReadOnly={hasAnswered}
            onNumberClick={handleNumberClick}
            onDeleteClick={handleDeleteClick}
          />
        )}

        <div className="h-24 mt-4 flex flex-col items-center justify-center">
          {!hasAnswered && userAnswer !== '' && (
            <Button onClick={handleCheck} onSoundEffect={() => {}} className="min-w-[160px] sm:min-w-[220px] text-lg sm:text-2xl z-10 shadow-xl py-2 sm:py-4">Check</Button>
          )}

          {hasAnswered && (
            <>
              <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"><p className={`text-4xl sm:text-7xl font-extrabold px-6 py-4 sm:px-10 sm:py-6 rounded-full shadow-2xl animate-pop-feedback border-4 ${lastAnswerCorrect ? 'text-green-800 bg-green-100 border-green-600' : 'text-red-800 bg-red-100 border-red-600'}`}>{lastAnswerCorrect ? 'Correct! 🎉' : 'Oops! 💡'}</p></div>
              <Button onClick={() => { playClick(); onNext(); }} onSoundEffect={() => {}} className="min-w-[160px] sm:min-w-[220px] text-lg sm:text-2xl z-10 shadow-xl py-2 sm:py-4">Next! ➡️</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberBondsScreen;