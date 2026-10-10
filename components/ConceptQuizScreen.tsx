
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Concept, ConceptQuestion, ClockImage } from '../types';
import { learnQuestions } from '../data/learnQuestions';
import IconButton from './IconButton';
import Button from './Button';
import useAudioPlayer from '../hooks/useAudioPlayer';
import useTextToSpeech from '../hooks/useTextToSpeech';
import Clock from './Clock';

// Helper to shuffle an array and return a new one
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

interface ConceptQuizScreenProps {
  concept: Concept;
  onExit: () => void;
}

const ConceptQuizScreen: React.FC<ConceptQuizScreenProps> = ({ concept, onExit }) => {
  const [questions, setQuestions] = useState<ConceptQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const { playClick, playCorrect, playIncorrect } = useAudioPlayer();
  const { speak } = useTextToSpeech();

  const loadQuestions = useCallback(() => {
    const filtered = learnQuestions.filter(q => q.conceptId === concept.id);
    const shuffled = shuffleArray(filtered);
    const selectedQuestions = shuffled.slice(0, 10); // Get 10 random questions
    setQuestions(selectedQuestions);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);

    if (selectedQuestions.length > 0) {
      speak(`Let's start! ${selectedQuestions[0].text}`);
    }
  }, [concept, speak]);

  useEffect(() => {
    loadQuestions();
  }, [concept, loadQuestions]);

  const handleAnswerSelect = (selectedIndex: number) => {
    if (selectedAnswer !== null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const correct = selectedIndex === currentQuestion.correctAnswerIndex;
    
    setSelectedAnswer(selectedIndex);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      speak("Correct! Great job!");
      playCorrect();
    } else {
      speak("Oops! That's not quite it.");
      playIncorrect();
    }
  };

  const handleNextQuestion = () => {
    playClick();
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setIsCorrect(null);
      speak(questions[nextIndex].text);
    } else {
      setQuizFinished(true);
      // Announce the final score correctly, as the 'score' state update might be pending.
      const finalScore = isCorrect ? score + 1 : score;
      speak(`Quiz complete! You got ${finalScore} out of ${questions.length}.`);
    }
  };

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  
  const renderQuestionImage = useCallback((image: string | ClockImage) => {
    if (typeof image === 'object' && image.type === 'clock') {
      // Use the Clock component for clock objects
      return <Clock hour={image.hour} minute={image.minute} size={150} />;
    }
    // Render string emojis as before
    return <div className="text-5xl sm:text-6xl leading-tight px-4">{image}</div>;
  }, []);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-y-6 animate-fade-in w-full max-w-2xl bg-white rounded-3xl shadow-xl border-8 border-dashed border-gray-400 min-h-[500px]">
        <h2 className="text-2xl font-bold text-purple-700">Loading questions...</h2>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-12 pt-20 sm:pt-24 gap-y-6 sm:gap-y-10 animate-fade-in w-full max-w-2xl bg-white rounded-3xl shadow-xl border-8 border-dashed border-green-400 min-h-[500px]">
        <div className="absolute top-4 left-4 z-30">
          <IconButton onClick={onExit} aria-label="Back to Concepts" className="p-2 sm:p-3">
            <span className="text-2xl sm:text-3xl">📖</span>
          </IconButton>
        </div>
        <h2 className="text-4xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 mb-2 sm:mb-4 drop-shadow-md">Quiz Complete! ✨</h2>
        <div className="text-center bg-green-100 p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border-8 border-white">
            <p className="text-lg sm:text-2xl font-bold text-gray-500 mb-1 sm:mb-2 uppercase tracking-widest">Your Score</p>
            <p className="text-6xl sm:text-9xl font-extrabold text-green-600 drop-shadow-lg">{score}<span className="text-gray-400 text-3xl sm:text-4xl mx-1 sm:mx-2">/</span>{questions.length}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md z-10">
            <Button onClick={loadQuestions}>Play Again!</Button>
        </div>
      </div>
    );
  }

  const getButtonClass = (index: number) => {
    if (selectedAnswer === null) {
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-b-4 border-blue-300';
    }
    const isCorrectAnswer = index === currentQuestion.correctAnswerIndex;
    const isSelectedAnswer = index === selectedAnswer;

    if (isCorrectAnswer) return 'bg-green-500 text-white border-b-4 border-green-700';
    if (isSelectedAnswer) return 'bg-red-500 text-white border-b-4 border-red-700';
    return 'bg-gray-200 text-gray-500 border-b-2 border-gray-400 opacity-60';
  };
  
  return (
    <div className="relative flex flex-col items-center justify-between p-4 sm:p-8 pt-16 sm:pt-24 gap-y-4 animate-scale-in w-full max-w-2xl bg-white rounded-3xl shadow-xl border-8 border-dashed border-purple-400 min-h-[500px]">
      <div className="absolute top-4 left-4 z-30">
        <IconButton onClick={onExit} aria-label="Back to Concepts" className="p-2 sm:p-3">
            <span className="text-2xl sm:text-3xl">📖</span>
        </IconButton>
      </div>
       <div className="absolute top-4 right-4 z-30">
        <IconButton onClick={() => speak(currentQuestion.text)} aria-label="Read question aloud" className="p-2 sm:p-3">
            <span className="text-2xl sm:text-3xl">🔊</span>
        </IconButton>
      </div>

      <div className="w-full text-center">
        <p className="text-lg sm:text-xl font-bold text-purple-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mt-2 min-h-[3em] flex items-center justify-center px-4">{currentQuestion.text}</h2>
        <div className="my-4 flex justify-center items-center h-[150px]">
          {renderQuestionImage(currentQuestion.image)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={selectedAnswer !== null}
            className={`p-3 sm:p-4 rounded-2xl text-lg sm:text-xl font-bold transition-all w-full flex flex-col items-center gap-2 ${getButtonClass(index)} ${selectedAnswer === null ? 'hover:scale-105' : 'cursor-not-allowed'}`}
          >
            <span className={`${option.image.length > 3 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'}`}>
              {option.image}
            </span>
            <span>{option.text}</span>
          </button>
        ))}
      </div>

      <div className="h-20 flex items-center justify-center">
        {selectedAnswer !== null && (
          <Button onClick={handleNextQuestion} className="min-w-[180px] animate-pop-in">
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConceptQuizScreen;
