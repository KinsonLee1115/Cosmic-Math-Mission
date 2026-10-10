
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onSoundEffect?: () => void;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', disabled = false, onSoundEffect }) => {
  const handleClick = () => {
    if (!disabled) {
      onSoundEffect?.();
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`px-4 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-3xl text-white text-xl sm:text-2xl font-bold transition-all duration-300 transform
                  ${disabled
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 active:scale-98 shadow-xl hover:scale-105 border-b-4 border-green-700 hover:border-green-800'
                  }
                  ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;