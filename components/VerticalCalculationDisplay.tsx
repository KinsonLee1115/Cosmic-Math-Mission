import React from 'react';
import { Operator, GameMode } from '../types';

interface VerticalCalculationDisplayProps {
  num1: number;
  num2: number;
  num3?: number;
  operator: Operator;
  showPlaceValueLine?: boolean;
  isHint?: boolean;
  showCarries?: boolean;
  showBorrows?: boolean;
  forceSmall?: boolean;
  gameMode?: GameMode;
  answerSlots?: (string | null)[];
  isReadOnly?: boolean;
  isCorrect?: boolean | null;
  selectedSlotIndex?: number | null;
  onSlotSelect?: (index: number) => void;
}

const MAX_DISPLAY_DIGITS = 3;

const VerticalCalculationDisplay: React.FC<VerticalCalculationDisplayProps> = ({
  num1,
  num2,
  num3,
  operator,
  showPlaceValueLine = true,
  isHint = false,
  showCarries = false,
  showBorrows = false,
  forceSmall = false,
  gameMode = 'choice',
  answerSlots = [],
  isReadOnly = false,
  isCorrect = null,
  selectedSlotIndex = null,
  // FIX: Update default prop to match function signature, accepting an argument.
  onSlotSelect = (index) => {},
}) => {
  const answer = operator === '+' ? (num3 !== undefined ? num1 + num2 + num3 : num1 + num2) : num1 - num2;
  const num1Str = String(num1);
  const num2Str = String(num2);
  const num3Str = num3 !== undefined ? String(num3) : '';
  const answerStr = String(answer);

  const maxActualDigits = Math.max(num1Str.length, num2Str.length, num3Str.length, answerStr.length);

  const unitsTensLineVisible = showPlaceValueLine && maxActualDigits >= 2;
  const tensHundredsLineVisible = showPlaceValueLine && maxActualDigits >= 3;

  const padNumber = (numStr: string) => {
    return ' '.repeat(Math.max(0, MAX_DISPLAY_DIGITS - numStr.length)) + numStr;
  };

  const paddedNum1 = padNumber(num1Str);
  const paddedNum2 = padNumber(num2Str);
  const paddedNum3 = num3Str ? padNumber(num3Str) : '';

  const carries: (number | null)[] = Array(MAX_DISPLAY_DIGITS).fill(null);
  let requiresCarryingHint = false;

  const borrowedDigitVisuals = new Map<number, number>();
  const borrowedDigitStrikethrough = new Set<number>();
  const borrowedReceivedValueVisuals = new Map<number, number>();
  let requiresBorrowingHint = false;

  if (isHint) {
    if (operator === '+' && showCarries) {
      let currentCarry = 0;
      for (let i = 0; i < MAX_DISPLAY_DIGITS; i++) {
        const p1Digit = parseInt(num1Str[num1Str.length - 1 - i] || '0');
        const p2Digit = parseInt(num2Str[num2Str.length - 1 - i] || '0');
        const p3Digit = num3Str ? parseInt(num3Str[num3Str.length - 1 - i] || '0') : 0;
        const sum = p1Digit + p2Digit + p3Digit + currentCarry;
        if (sum >= 10 && i < MAX_DISPLAY_DIGITS - 1) {
          currentCarry = Math.floor(sum / 10);
          carries[MAX_DISPLAY_DIGITS - 1 - (i + 1)] = currentCarry;
          requiresCarryingHint = true;
        } else {
          currentCarry = 0;
        }
      }
    } else if (operator === '-' && showBorrows) {
      const actualNum1Digits = Array.from(num1Str).map(Number);
      const tempNum1DigitsForBorrowing = [...actualNum1Digits];
      for (let i = num1Str.length - 1; i >= 0; i--) {
        const colPadded = MAX_DISPLAY_DIGITS - 1 - (num1Str.length - 1 - i);
        const p1DigitOriginal = actualNum1Digits[i] !== undefined ? actualNum1Digits[i] : 0;
        let p1DigitCurrent = tempNum1DigitsForBorrowing[i] !== undefined ? tempNum1DigitsForBorrowing[i] : 0;
        const p2Digit = parseInt(num2Str[num2Str.length - 1 - (num1Str.length - 1 - i)] || '0');
        if (p1DigitCurrent < p2Digit) {
          requiresBorrowingHint = true;
          borrowedReceivedValueVisuals.set(colPadded, p1DigitOriginal + 10);
          let lenderActualIndex = -1;
          for (let j = i - 1; j >= 0; j--) {
            if (tempNum1DigitsForBorrowing[j] > 0) {
              lenderActualIndex = j;
              break;
            }
          }
          if (lenderActualIndex !== -1) {
            const lenderColPadded = MAX_DISPLAY_DIGITS - 1 - (num1Str.length - 1 - lenderActualIndex);
            tempNum1DigitsForBorrowing[lenderActualIndex]--;
            borrowedDigitVisuals.set(lenderColPadded, tempNum1DigitsForBorrowing[lenderActualIndex]);
            borrowedDigitStrikethrough.add(lenderColPadded);
            for (let k = lenderActualIndex + 1; k < i; k++) {
              const kColPadded = MAX_DISPLAY_DIGITS - 1 - (num1Str.length - 1 - k);
              tempNum1DigitsForBorrowing[k] = 9;
              borrowedDigitVisuals.set(kColPadded, 9);
              borrowedDigitStrikethrough.add(kColPadded);
            }
          }
        }
      }
    }
  }

  const renderDigits = (numString: string, isAnswerLine: boolean = false) => {
    return Array.from(numString).map((char, index) => {
      const column = index;
      let bgColor = '';
      let textColor = 'text-blue-800';
      if (char === '?' && isAnswerLine) textColor = 'text-red-700';
      if (isHint && char !== ' ' && char !== '?') {
        if (column === MAX_DISPLAY_DIGITS - 1) bgColor = 'bg-blue-100';
        else if (column === MAX_DISPLAY_DIGITS - 2) bgColor = 'bg-green-100';
        else if (column === MAX_DISPLAY_DIGITS - 3) bgColor = 'bg-yellow-100';
      }
      return (
        <span key={index} className={`inline-block w-[1em] text-center ${textColor} ${bgColor} rounded-md transition-colors duration-200`}>
          {char}
        </span>
      );
    });
  };

  const renderNum1WithBorrowHints = (numString: string) => {
    return Array.from(numString).map((char, index) => {
      const column = index;
      const isLender = borrowedDigitStrikethrough.has(column);
      const newLenderValue = borrowedDigitVisuals.get(column);
      const receivedValue = borrowedReceivedValueVisuals.get(column);
      const isReceiver = receivedValue !== undefined;
      let bgColor = '';
      if (isHint && char !== ' ' && char !== '?') {
        if (column === MAX_DISPLAY_DIGITS - 1) bgColor = 'bg-blue-100';
        else if (column === MAX_DISPLAY_DIGITS - 2) bgColor = 'bg-green-100';
        else if (column === MAX_DISPLAY_DIGITS - 3) bgColor = 'bg-yellow-100';
      }
      return (
        <span key={index} className={`relative inline-block w-[1em] text-center text-blue-800 ${bgColor} rounded-md transition-colors duration-200`}>
          {isLender && newLenderValue !== undefined && ( <div className="absolute -top-[2.2em] left-1/2 -translate-x-1/2 z-20"><span className="inline-flex items-center justify-center w-[1.8em] h-[1.8em] sm:w-[2em] sm:h-[2em] rounded-full bg-blue-400 text-white text-lg sm:text-xl font-black shadow-md">{newLenderValue}</span></div> )}
          {isReceiver && ( <div className="absolute -top-[1.4em] left-1/2 -translate-x-1/2 z-20"><span className="inline-flex items-center justify-center px-2 h-[1.8em] sm:h-[2em] rounded-full bg-green-400 text-white text-lg sm:text-xl font-black shadow-md">{receivedValue}</span></div> )}
          <span className={`${isLender ? 'line-through decoration-red-500 decoration-2 opacity-50' : ''}`}>{char}</span>
        </span>
      );
    });
  };
  
  const getSlotClass = (index: number) => {
    if (isReadOnly) {
      return isCorrect ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800';
    }
    if (selectedSlotIndex === index) {
      return 'bg-blue-100 border-blue-500 ring-2 ring-blue-400 text-gray-800';
    }
    return 'bg-gray-100 border-gray-400 text-gray-800 hover:bg-gray-200 hover:border-blue-500';
  };

  const renderAnswerLine = () => {
    if (gameMode === 'dragAndDrop') {
      return (
        <div className="leading-none flex justify-end">
          {' '.repeat(MAX_DISPLAY_DIGITS - answerStr.length).split('').map((_, i) => ( <span key={`space-${i}`} className="inline-block w-[1em] text-center" /> ))}
          {answerSlots.map((slot, index) => (
            <div
              key={index}
              onClick={() => onSlotSelect(index)}
              className={`flex items-center justify-center w-[1em] h-[1.3em] rounded-md border-2 border-dashed transition-all duration-200 ${getSlotClass(index)} ${!isReadOnly ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {isReadOnly && !isCorrect ? (
                <span className="opacity-70 relative">
                  <span className="absolute -top-[0.7em] -right-[0.1em] text-[0.3em] leading-none text-red-600 font-sans font-bold">{answerStr[index]}</span>
                  {slot || ''}
                </span>
              ) : ( slot )}
            </div>
          ))}
        </div>
      );
    }
    const displayStr = isReadOnly && !isHint ? answerStr : '?';
    const paddedDisplay = ' '.repeat(Math.max(0, MAX_DISPLAY_DIGITS - displayStr.length)) + displayStr;
    return <div className="leading-none flex justify-end">{renderDigits(paddedDisplay, true)}</div>;
  };

  if (num3 !== undefined) {
    // Render horizontal display!
    const renderHorizontalAnswer = () => {
      if (gameMode === 'dragAndDrop') {
        return (
          <div className="flex gap-x-1 sm:gap-x-2">
            {answerSlots.map((slot, index) => (
              <div
                key={index}
                onClick={() => onSlotSelect(index)}
                className={`flex items-center justify-center w-[1.2em] h-[1.4em] rounded-xl border-4 border-dashed text-4xl sm:text-6xl transition-all duration-200 ${getSlotClass(index)} ${!isReadOnly ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                {isReadOnly && !isCorrect ? (
                  <span className="opacity-70 relative">
                    <span className="absolute -top-[0.6em] -right-[0.1em] text-[0.3em] leading-none text-red-600 font-sans font-bold">{answerStr[index]}</span>
                    {slot || ''}
                  </span>
                ) : ( slot )}
              </div>
            ))}
          </div>
        );
      }
      const displayStr = isReadOnly && !isHint ? answerStr : '?';
      return (
        <span className={`${isReadOnly && !isHint ? (isCorrect ? 'text-green-600 bg-green-100 border-green-500' : 'text-red-500 bg-red-100 border-red-500') : 'text-purple-600 bg-purple-100 border-purple-300'} font-black px-4 py-2 rounded-3xl border-4 min-w-[1.8em] h-[1.8em] flex items-center justify-center text-center inline-block`}>
          {displayStr}
        </span>
      );
    };

    let horizontalFontSizeClass = isHint || forceSmall ? 'text-3xl sm:text-5xl' : 'text-4xl sm:text-6xl';

    return (
      <div className={`flex flex-row items-center justify-center gap-x-2 sm:gap-x-4 ${horizontalFontSizeClass} font-black font-mono transition-all duration-300 px-4 py-6 text-blue-800`}>
        <span>{num1}</span>
        <span className="text-purple-400 font-sans">+</span>
        <span>{num2}</span>
        <span className="text-purple-400 font-sans">+</span>
        <span>{num3}</span>
        <span className="text-purple-400 font-sans">=</span>
        {renderHorizontalAnswer()}
      </div>
    );
  }

  let currentFontSizeClass = isHint || forceSmall ? 'text-5xl xs:text-6xl sm:text-7xl md:text-8xl' : 'text-6xl xs:text-7xl sm:text-8xl md:text-9xl';
  const hintPaddingTop = isHint ? 'pt-[2.5em]' : '';

  return (
    <div className={`relative inline-block ${currentFontSizeClass} font-black font-mono tracking-tighter ${hintPaddingTop} transition-all duration-300 px-4`}>
      {unitsTensLineVisible && (<div className="absolute w-0.5 border-l-2 border-dotted border-gray-400 pointer-events-none" style={{ right: '1em', top: '0', bottom: '0' }} />)}
      {tensHundredsLineVisible && (<div className="absolute w-0.5 border-l-2 border-dotted border-gray-400 pointer-events-none" style={{ right: '2em', top: '0', bottom: '0' }} />)}

      {isHint && operator === '+' && requiresCarryingHint && showCarries && ( carries.map((carryVal, colIndex) => { if (carryVal === null) return null; const numColumnsFromRight = MAX_DISPLAY_DIGITS - 1 - colIndex; const columnCenter = numColumnsFromRight + 0.5; return (<div key={`carry-${colIndex}`} className="absolute top-[1em] z-20" style={{ right: `${columnCenter}em`, transform: 'translateX(50%)' }}><span className="inline-flex items-center justify-center w-[1.8em] h-[1.8em] sm:w-[2em] sm:h-[2em] rounded-full bg-red-400 text-white text-lg sm:text-xl font-black shadow-md">{carryVal}</span></div>); }) )}

      <div className="leading-none flex justify-end">{isHint && operator === '-' && showBorrows ? renderNum1WithBorrowHints(paddedNum1) : renderDigits(paddedNum1)}</div>
      <div className="flex justify-end items-center leading-none">
        {num3 === undefined && <span className="text-purple-400 mr-4 text-[0.8em]">{operator}</span>}
        {renderDigits(paddedNum2)}
      </div>
      {num3 !== undefined && (
        <div className="flex justify-end items-center leading-none">
          <span className="text-purple-400 mr-4 text-[0.8em]">{operator}</span>
          {renderDigits(paddedNum3)}
        </div>
      )}
      <hr className={`w-full ${isHint ? 'h-0.5' : 'h-2 sm:h-3'} bg-pink-400 my-1 rounded-full shadow-sm`} />
      {renderAnswerLine()}
      {isHint && (requiresCarryingHint || requiresBorrowingHint) && (<p className="text-lg sm:text-xl md:text-2xl text-purple-600 mt-1 font-bold uppercase tracking-wider text-center animate-bounce-subtle">{requiresCarryingHint ? 'Carry!' : 'Borrow!'}</p>)}
    </div>
  );
};

export default VerticalCalculationDisplay;
