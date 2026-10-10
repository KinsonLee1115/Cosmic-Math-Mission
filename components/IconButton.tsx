
import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  'aria-label': string; // For accessibility
  className?: string;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, 'aria-label': ariaLabel, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-3 rounded-full transition-all duration-200 transform
                  ${disabled
                    ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                    : 'bg-white border-2 border-gray-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 active:bg-blue-200 active:scale-98 hover:scale-110'
                  }
                  ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default IconButton;