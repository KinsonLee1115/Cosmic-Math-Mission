
import React from 'react';

interface NumberPaletteProps {
  isReadOnly: boolean;
  onNumberClick: (number: number) => void;
  onDeleteClick: () => void;
  instructionText?: string;
}

const NumberPalette: React.FC<NumberPaletteProps> = ({ isReadOnly, onNumberClick, onDeleteClick, instructionText }) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className={`p-3 bg-blue-100 rounded-2xl shadow-md mt-4 transition-opacity duration-300 ${isReadOnly ? 'opacity-50 pointer-events-none' : ''}`}>
       {instructionText && <p className="text-center text-sm font-bold text-blue-800 mb-2 px-2">{instructionText}</p>}
      <div className="flex items-center justify-center gap-3">
          <div className="grid grid-cols-5 gap-2" aria-label="Number palette">
            {numbers.map((num) => (
              <button
                key={num}
                disabled={isReadOnly}
                onClick={() => onNumberClick(num)}
                className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14
                            bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900
                            rounded-xl shadow-md border-b-4 border-yellow-600
                            text-3xl sm:text-4xl font-bold
                            cursor-pointer active:scale-95 hover:scale-105 transition-transform`}
              >
                {num}
              </button>
            ))}
          </div>
         <button
          key="delete"
          disabled={isReadOnly}
          onClick={onDeleteClick}
          className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14
                      bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800
                      rounded-xl shadow-md border-b-4 border-gray-500
                      text-3xl sm:text-4xl font-bold
                      cursor-pointer active:scale-95 hover:scale-105 transition-transform`}
            aria-label="Delete last number"
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default NumberPalette;
