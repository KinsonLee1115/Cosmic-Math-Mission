
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Question, DifficultyLevel, FriendType, GameMode } from '../types';
import Button from './Button';
import IconButton from './IconButton';
import VerticalCalculationDisplay from './VerticalCalculationDisplay';
import NumberPalette from './NumberPalette';
import useTextToSpeech from '../hooks/useTextToSpeech';
import ThreeNumAdditionGuide from './ThreeNumAdditionGuide';

interface GameScreenProps {
  question: Question;
  onAnswer: (selectedAnswer: number) => void;
  onNextQuestion: () => void;
  currentQuestionNumber: number;
  totalQuestions: number;
  lastAnswerCorrect: boolean | null;
  playClick: () => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  selectedDifficulty: DifficultyLevel;
  onBackToHome: () => void;
  selectedFriend: FriendType;
  gameMode: GameMode; // New prop for game mode
}

const Dot: React.FC<{ isCrossedOut?: boolean; isHintMode?: boolean; animate?: boolean }> = ({ isCrossedOut = false, isHintMode = false, animate = false }) => (
  <span className={`inline-block rounded-full bg-yellow-400 m-0.5 relative transition-all duration-300
                    ${isHintMode ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'}
                    ${animate ? 'animate-pop-in' : ''}`}>
    {isCrossedOut && <span className={`absolute inset-0 flex items-center justify-center text-red-600 font-bold leading-none select-none
                                     ${isHintMode ? 'text-[13px] sm:text-[15px]' : 'text-lg sm:text-xl'}`}>&#x2715;</span>}
  </span>
);

const CloseSVG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const FRIEND_EMOJIS: Record<FriendType, string> = { unicorn: '🦄', dog: '🐶', cat: '🐱' };
const FRIEND_MESSAGES: string[] = ['You got this! ✨', 'Keep up the great work! 🌈', 'Math is fun! 🎉', 'Sparkle Power! 💫', 'Super smart! 🌟', 'Believe in yourself! ❤️'];

// Helper to format the question for text-to-speech
const getQuestionTextForSpeech = (q: Question | null): string => {
  if (!q) return '';
  const operatorText = q.operator === '+' ? 'plus' : 'minus';
  if (q.num3 !== undefined) {
    return `What is ${q.num1} plus ${q.num2} plus ${q.num3}?`;
  }
  return `What is ${q.num1} ${operatorText} ${q.num2}?`;
};

const GameScreen: React.FC<GameScreenProps> = ({
  question, onAnswer, onNextQuestion, currentQuestionNumber, totalQuestions, lastAnswerCorrect,
  playClick, playCorrect, playIncorrect, selectedDifficulty, onBackToHome, selectedFriend, gameMode
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [dotAnimationIndex, setDotAnimationIndex] = useState(0);
  const [showFriendMessage, setShowFriendMessage] = useState(false);
  const [currentFriendMessage, setCurrentFriendMessage] = useState('');
  const [isFriendAnimating, setIsFriendAnimating] = useState(false);
  const [showBuddyReaction, setShowBuddyReaction] = useState(false);
  const [buddyReactionEmoji, setBuddyReactionEmoji] = useState('');
  const [isMessageFadingOut, setIsMessageFadingOut] = useState(false);
  const [dndAnswerSlots, setDndAnswerSlots] = useState<(string | null)[]>([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [showStrategiesGuide, setShowStrategiesGuide] = useState(false);

  const [buddyPosition, setBuddyPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, buddyX: 0, buddyY: 0 });
  const wasDraggedRef = useRef(false);
  const isDraggingRef = useRef(false);

  const { speak } = useTextToSpeech();
  
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);

  const buddyReactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageFadeOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const friendAnimTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissHint = useCallback(() => { playClick(); setShowHint(false); }, [playClick]);

  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowHint(false);
    setDotAnimationIndex(0);
    setShowFriendMessage(false);
    setCurrentFriendMessage('');
    setIsFriendAnimating(false);
    setShowBuddyReaction(false);
    setBuddyReactionEmoji('');
    setIsMessageFadingOut(false);
    setBuddyPosition({ x: 0, y: 0 });
    wasDraggedRef.current = false;
    
    if (gameMode === 'dragAndDrop') {
      const answerLength = String(question.answer).length;
      setDndAnswerSlots(Array(answerLength).fill(null));
      setSelectedSlotIndex(0); // Select first slot by default
    } else {
      setSelectedSlotIndex(null);
    }
    
    // Read question aloud when it changes
    const textToSpeak = getQuestionTextForSpeech(question);
    const speechTimer = setTimeout(() => speak(textToSpeak), 500); // Small delay for transition

    if (buddyReactionTimeoutRef.current) clearTimeout(buddyReactionTimeoutRef.current);
    if (messageFadeOutTimeoutRef.current) clearTimeout(messageFadeOutTimeoutRef.current);
    if (messageHideTimeoutRef.current) clearTimeout(messageHideTimeoutRef.current);
    if (friendAnimTimeoutRef.current) clearTimeout(friendAnimTimeoutRef.current);
    
    return () => clearTimeout(speechTimer);
  }, [question, gameMode, speak]);

  useEffect(() => {
    if (lastAnswerCorrect === true) {
      playCorrect();
      speak("Correct!");
      setBuddyReactionEmoji('🎉');
      setShowBuddyReaction(true);
      buddyReactionTimeoutRef.current = setTimeout(() => setShowBuddyReaction(false), 1500);
    } else if (lastAnswerCorrect === false) {
      playIncorrect();
      speak("Try again!");
      setBuddyReactionEmoji('🤔');
      setShowBuddyReaction(true);
      buddyReactionTimeoutRef.current = setTimeout(() => setShowBuddyReaction(false), 1500);
    }
    return () => { if (buddyReactionTimeoutRef.current) clearTimeout(buddyReactionTimeoutRef.current); };
  }, [lastAnswerCorrect, playCorrect, playIncorrect, speak]);


  useEffect(() => {
    let dotInterval: ReturnType<typeof setInterval> | undefined;
    if (showHint && selectedDifficulty === 'k2' && !hasAnswered) {
      setDotAnimationIndex(0);
      let totalSteps = question.num1 + (question.operator === '+' ? (question.num2 + (question.num3 || 0)) : question.num2);
      if (totalSteps > 0) {
        dotInterval = setInterval(() => setDotAnimationIndex(prev => prev < totalSteps ? prev + 1 : prev), 150);
      }
    }
    return () => { if (dotInterval) clearInterval(dotInterval); };
  }, [question, showHint, selectedDifficulty, hasAnswered]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && showHint) dismissHint(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHint, dismissHint]);

  const handleChoiceClick = (choice: number) => {
    if (hasAnswered) return;
    playClick();
    setSelectedAnswer(choice);
    onAnswer(choice);
    setHasAnswered(true);
    if (showHint) setShowHint(false);
  };

  const handleDragAndDropCheck = () => {
    if (hasAnswered) return;
    playClick();
    const answerString = dndAnswerSlots.join('');
    const userAnswer = answerString === '' ? -1 : parseInt(answerString, 10);
    setSelectedAnswer(userAnswer);
    onAnswer(userAnswer);
    setHasAnswered(true);
  };
  
  const handleFriendClick = useCallback(() => {
    if (wasDraggedRef.current) { wasDraggedRef.current = false; return; }
    playClick();
    setCurrentFriendMessage(FRIEND_MESSAGES[Math.floor(Math.random() * FRIEND_MESSAGES.length)]);
    setShowFriendMessage(true);
    setIsFriendAnimating(true);
    setIsMessageFadingOut(false);
    if (messageFadeOutTimeoutRef.current) clearTimeout(messageFadeOutTimeoutRef.current);
    if (messageHideTimeoutRef.current) clearTimeout(messageHideTimeoutRef.current);
    if (friendAnimTimeoutRef.current) clearTimeout(friendAnimTimeoutRef.current);
    messageFadeOutTimeoutRef.current = setTimeout(() => {
      setIsMessageFadingOut(true);
      messageHideTimeoutRef.current = setTimeout(() => setShowFriendMessage(false), 500);
    }, 2000);
    friendAnimTimeoutRef.current = setTimeout(() => setIsFriendAnimating(false), 2500);
  }, [playClick]);

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    playClick();
    setIsDragging(true);
    wasDraggedRef.current = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { mouseX: clientX, mouseY: clientY, buddyX: buddyPosition.x, buddyY: buddyPosition.y };
    e.preventDefault();
    setShowFriendMessage(false);
    setIsFriendAnimating(false);
  }, [playClick, buddyPosition]);

  useEffect(() => {
    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - dragStartRef.current.mouseX;
      const deltaY = clientY - dragStartRef.current.mouseY;
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) wasDraggedRef.current = true;
      setBuddyPosition({ x: dragStartRef.current.buddyX + deltaX, y: dragStartRef.current.buddyY + deltaY });
    };
    const handleDragEnd = () => { if (isDraggingRef.current) setIsDragging(false); };
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, []);

  const getButtonClass = (choice: number) => {
    if (hasAnswered) {
      if (choice === question.answer) return 'bg-green-500 text-white border-green-700 shadow-lg';
      if (choice === selectedAnswer) return 'bg-red-500 text-white border-red-700 shadow-lg';
      return 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed';
    }
    return 'bg-gradient-to-br from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 active:from-yellow-200 active:to-yellow-400 text-yellow-900 border-yellow-600';
  };

  const handleSlotSelect = (index: number) => {
    if (hasAnswered) return;
    playClick();
    setSelectedSlotIndex(index);
  };
  
  const handleNumberPadClick = (number: number) => {
    if (hasAnswered || selectedSlotIndex === null) return;
    playClick();
    const newSlots = [...dndAnswerSlots];
    newSlots[selectedSlotIndex] = String(number);
    setDndAnswerSlots(newSlots);
  
    // Move to the next slot automatically
    const nextIndex = selectedSlotIndex + 1;
    if (nextIndex < dndAnswerSlots.length) {
      setSelectedSlotIndex(nextIndex);
    } else {
      setSelectedSlotIndex(null); // Deselect after filling the last slot
    }
  };
  
  const handleDeleteClick = () => {
    if (hasAnswered || selectedSlotIndex === null) return;
    playClick();
  
    const newSlots = [...dndAnswerSlots];
    if (newSlots[selectedSlotIndex] !== null) {
      newSlots[selectedSlotIndex] = null;
      setDndAnswerSlots(newSlots);
    } else {
      const prevIndex = selectedSlotIndex - 1;
      if (prevIndex >= 0) {
        newSlots[prevIndex] = null;
        setDndAnswerSlots(newSlots);
        setSelectedSlotIndex(prevIndex);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center p-4 sm:p-6 pt-16 sm:pt-24 gap-y-4 sm:gap-y-6 animate-scale-in w-full max-w-2xl bg-white rounded-3xl shadow-xl border-8 border-dashed border-green-400 transition-all duration-300 min-h-[500px] overflow-visible">
      
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30"><IconButton onClick={onBackToHome} aria-label="Back to Home" className="p-2 sm:p-3"><span className="text-2xl sm:text-3xl">🏠</span></IconButton></div>
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 flex items-center gap-2">
        <IconButton onClick={() => speak(getQuestionTextForSpeech(question))} aria-label="Read question aloud" className="p-2 sm:p-3">
          <span className="text-2xl sm:text-3xl">🔊</span>
        </IconButton>
        {question.num3 !== undefined && (
          <IconButton onClick={() => { playClick(); setShowStrategiesGuide(true); }} aria-label="Show Strategies Guide" className="p-2 sm:p-3 bg-green-100 border-green-300 text-green-600 hover:bg-green-200 hover:border-green-400">
            <span className="text-2xl sm:text-3xl">🧩</span>
          </IconButton>
        )}
        {!hasAnswered && !showHint && (
          <IconButton onClick={() => { playClick(); setShowHint(true); }} aria-label="Show Hint" className="p-2 sm:p-3 bg-yellow-100 border-yellow-300 text-yellow-600 hover:bg-yellow-200 hover:border-yellow-400">
            <span className="text-2xl sm:text-3xl">💡</span>
          </IconButton>
        )}
      </div>

      <div className={`absolute top-32 right-16 sm:top-32 sm:right-20 z-40 select-none ${isDragging ? 'cursor-grabbing transition-none' : 'cursor-grab'}`} style={{ transform: `translate(${buddyPosition.x}px, ${buddyPosition.y}px)`, touchAction: 'none' }} onMouseDown={handleDragStart} onTouchStart={handleDragStart} onClick={handleFriendClick}>
        {/* FIX: Cast style object to React.CSSProperties to allow for custom CSS properties. */}
<span className={`inline-block text-[8.5rem] sm:text-[10.5rem] ${isFriendAnimating ? 'animate-friend-talk' : ''} ${!isDragging ? 'hover:scale-110 active:scale-90 animate-float' : ''}`} style={{ '--float-duration': '6s' } as React.CSSProperties} role="img" aria-label={selectedFriend}>{FRIEND_EMOJIS[selectedFriend]}</span>
        {showFriendMessage && currentFriendMessage && (<div className={`absolute -top-8 left-1/2 -translate-x-1/2 w-max z-10 ${isMessageFadingOut ? 'animate-fade-out' : 'animate-pop-in'}`}><p className="text-base sm:text-lg font-bold text-purple-700 bg-white rounded-full px-4 py-2 shadow-md">{currentFriendMessage}</p></div>)}
        {showBuddyReaction && buddyReactionEmoji && (<span className="absolute top-0 -left-4 text-5xl sm:text-7xl z-10 animate-buddy-reaction" role="img" aria-label="Buddy Reaction">{buddyReactionEmoji}</span>)}
      </div>

      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 mb-0 sm:mb-1 text-center leading-tight drop-shadow-lg z-10 mt-2 sm:mt-4">Freya Math Adventure!</h1>
      <p className="text-base sm:text-xl text-pink-600 text-center max-w-md z-10 font-medium -mt-2 sm:-mt-1">Let's explore numbers! <span role="img" aria-label="Sparkles">✨</span></p>

      <div className="w-full max-w-sm px-4 mb-4 z-10">
        <div className="flex items-center justify-center bg-purple-100 rounded-full shadow-inner border-2 border-purple-200 p-1 mb-2">
          <span className="text-lg sm:text-xl font-semibold text-purple-600 mr-2">Question</span>
          <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full text-purple-800 font-bold text-2xl sm:text-3xl shadow-md border-2 border-purple-300">{currentQuestionNumber}</span>
          <span className="text-lg sm:text-xl font-semibold text-purple-600 ml-2">/ {totalQuestions}</span>
        </div>
        {/* FIX: The `aria-valuemin` attribute expects a number, not a string. */}
        <div className="w-full bg-gray-200 rounded-full h-4 sm:h-6 shadow-inner overflow-hidden border-2 border-white" role="progressbar" aria-valuenow={currentQuestionNumber} aria-valuemin={1} aria-valuemax={totalQuestions}>
          <div
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center w-full z-10">
        <div className={`flex flex-col items-center bg-blue-50 rounded-[2.5rem] shadow-inner border-3 border-blue-300 z-10 overflow-hidden p-6 sm:p-10 w-full max-w-lg transition-all duration-300`}>
          <VerticalCalculationDisplay
            num1={question.num1}
            num2={question.num2}
            num3={question.num3}
            operator={question.operator}
            gameMode={gameMode}
            answerSlots={dndAnswerSlots}
            isReadOnly={hasAnswered}
            isCorrect={lastAnswerCorrect}
            selectedSlotIndex={selectedSlotIndex}
            onSlotSelect={handleSlotSelect}
          />
        </div>
        {(selectedDifficulty === 'k2' || selectedDifficulty === 'p1') && question.num3 !== undefined && !hasAnswered && (
          <button
            onClick={() => { playClick(); setShowStrategiesGuide(true); }}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 border-b-4 border-green-700 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 animate-bounce-subtle z-20"
          >
            💡 Need Help? Let's Solve Step-by-Step! 🌈
          </button>
        )}
      </div>

      {/* Answer Input Area */}
      {gameMode === 'choice' && !hasAnswered && (
        <div className={`flex flex-row flex-wrap justify-center w-full max-w-md mt-4 z-10 transition-all duration-300 gap-3 sm:gap-6`}>
          {question.choices.map((choice) => (
            <button key={choice} onClick={() => handleChoiceClick(choice)} disabled={hasAnswered} className={`flex items-center justify-center rounded-2xl sm:rounded-3xl font-bold shadow-lg border-2 border-white w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 ${getButtonClass(choice)} border-b-4 transition-all duration-200 ${hasAnswered ? 'pointer-events-none' : 'hover:scale-105 active:scale-95'} p-3 sm:p-5 text-4xl sm:text-6xl`}>
              {choice}
            </button>
          ))}
        </div>
      )}

      {gameMode === 'dragAndDrop' && !hasAnswered && (
        <NumberPalette 
          isReadOnly={hasAnswered}
          onNumberClick={handleNumberPadClick}
          onDeleteClick={handleDeleteClick}
          instructionText="Click an answer slot, then tap a number."
        />
      )}
      
      {/* Action Buttons & Feedback */}
      <div className="h-24 mt-2 flex flex-col items-center justify-center">
        {gameMode === 'dragAndDrop' && !hasAnswered && (
            <Button onClick={handleDragAndDropCheck} onSoundEffect={playClick} className="min-w-[160px] sm:min-w-[220px] text-lg sm:text-2xl z-10 shadow-xl py-2 sm:py-4">Check</Button>
        )}

        {hasAnswered && (
          <>
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"><p className={`text-4xl sm:text-7xl font-extrabold px-6 py-4 sm:px-10 sm:py-6 rounded-full shadow-2xl animate-pop-feedback border-4 ${lastAnswerCorrect ? 'text-green-800 bg-green-100 border-green-600' : 'text-red-800 bg-red-100 border-red-600'}`}>{lastAnswerCorrect ? 'Great! 🎉' : 'Oops! 💡'}</p></div>
            <Button onClick={onNextQuestion} onSoundEffect={playClick} className="min-w-[160px] sm:min-w-[220px] text-lg sm:text-2xl z-10 shadow-xl py-2 sm:py-4">Next! ➡️</Button>
          </>
        )}
      </div>

      {showHint && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in" onClick={dismissHint} aria-modal="true" role="dialog"><div className="relative bg-white rounded-3xl shadow-2xl p-4 sm:p-6 border-8 border-dashed border-pink-400 max-w-md w-11/12 animate-hint-pop" onClick={(e) => e.stopPropagation()}><div className="absolute top-2 right-2 z-10"><IconButton onClick={dismissHint} aria-label="Close Hint" className="p-2 sm:p-3 bg-red-100 border-red-300 text-red-600 hover:bg-red-200 hover:border-red-400"><CloseSVG className="w-5 h-5 sm:w-8 sm:h-8" /></IconButton></div><p className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500 mb-4 text-center pt-12 sm:pt-10">Let's count it out!</p>{selectedDifficulty === 'k2' && (<div className={`flex flex-col items-center p-1 sm:p-2 rounded-3xl shadow-sm border-3 w-full mb-2 ${question.operator === '+' ? 'bg-lime-50 border-lime-300' : 'bg-rose-50 border-rose-300'}`}>{question.operator === '+' ? (<><p className="text-lg sm:text-2xl font-bold text-gray-700 mb-0.5 text-center">Let's add them!</p><div className="flex flex-wrap justify-center mb-0.5">{Array.from({ length: Math.min(question.num1, dotAnimationIndex) }).map((_, i) => (<Dot key={`n1-${i}`} isHintMode={true} animate={true} />))}</div><div className="text-3xl sm:text-4xl font-bold text-gray-400 leading-none my-1">+</div><div className="flex flex-wrap justify-center mt-0.5">{Array.from({ length: Math.min(question.num2, Math.max(0, dotAnimationIndex - question.num1)) }).map((_, i) => (<Dot key={`n2-${i}`} isHintMode={true} animate={true} />))}</div>{question.num3 !== undefined && (<><div className="text-3xl sm:text-4xl font-bold text-gray-400 leading-none my-1">+</div><div className="flex flex-wrap justify-center mt-0.5">{Array.from({ length: Math.min(question.num3, Math.max(0, dotAnimationIndex - question.num1 - question.num2)) }).map((_, i) => (<Dot key={`n3-${i}`} isHintMode={true} animate={true} />))}</div></>)}</>) : (<><p className="text-lg sm:text-2xl font-bold text-gray-700 mb-0.5 text-center">Let's take away!</p><div className="flex flex-wrap justify-center mt-0.5">{Array.from({ length: Math.min(question.num1, dotAnimationIndex) }).map((_, i) => (<Dot key={`sub-${i}`} isCrossedOut={i < Math.max(0, dotAnimationIndex - question.num1)} isHintMode={true} animate={true} />))}</div></>)}</div>)}<div className={`flex flex-col items-center p-1 sm:p-2 rounded-3xl shadow-sm border-3 w-full ${question.operator === '+' ? 'bg-lime-50 border-lime-300' : 'bg-rose-50 border-rose-300'}`}><VerticalCalculationDisplay num1={question.num1} num2={question.num2} num3={question.num3} operator={question.operator} isHint={true} showCarries={question.operator === '+'} showBorrows={question.operator === '-'} /></div></div></div>)}

      {showStrategiesGuide && (
        <ThreeNumAdditionGuide 
          onClose={() => { playClick(); setShowStrategiesGuide(false); }} 
          playClick={playClick} 
          num1={question.num1}
          num2={question.num2}
          num3={question.num3}
        />
      )}
    </div>
  );
};

export default GameScreen;
