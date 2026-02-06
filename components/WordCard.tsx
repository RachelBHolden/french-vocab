
import React, { useState, useEffect, useRef } from 'react';
import { CardItem } from '../types';

interface WordCardProps {
  card: CardItem;
  isSelected: boolean;
  isMatched: boolean;
  onClick: (card: CardItem) => void;
  disabled: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ 
  card, 
  isSelected, 
  isMatched, 
  onClick,
  disabled 
}) => {
  const [justDeselected, setJustDeselected] = useState(false);
  const prevSelected = useRef(isSelected);

  useEffect(() => {
    // Detect the transition from selected to unselected
    if (prevSelected.current && !isSelected && !isMatched) {
      setJustDeselected(true);
      const timer = setTimeout(() => setJustDeselected(false), 400);
      return () => clearTimeout(timer);
    }
    prevSelected.current = isSelected;
  }, [isSelected, isMatched]);

  return (
    <button
      disabled={disabled || isMatched}
      onClick={() => onClick(card)}
      className={`
        relative h-28 sm:h-32 flex items-center justify-center p-4 sm:p-6 border-2 transition-all duration-300 text-center overflow-hidden
        ${isMatched 
          ? 'bg-black text-white border-black opacity-20 grayscale cursor-default scale-95' 
          : isSelected 
            ? 'bg-black text-white border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1 z-10 scale-105' 
            : justDeselected
              ? 'bg-slate-100 border-black animate-deselect-shake z-20'
              : 'bg-white text-black border-black hover:bg-slate-50 hover:border-slate-400 hover:scale-[1.01] active:scale-95'
        }
      `}
    >
      <span className="text-xs sm:text-base font-black uppercase tracking-tight leading-tight pointer-events-none">
        {card.text}
      </span>
      
      {/* Selected Indicator */}
      {isSelected && !isMatched && (
        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      )}

      {/* Deselect Flash Overlay */}
      {justDeselected && (
        <div className="absolute inset-0 bg-black/5 animate-flash-out pointer-events-none" />
      )}

      <style>{`
        @keyframes deselect-shake {
          0% { transform: translateX(0); background-color: #000; color: #fff; }
          25% { transform: translateX(-4px); background-color: #f1f5f9; color: #000; }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          100% { transform: translateX(0); background-color: #ffffff; color: #000; }
        }
        @keyframes flash-out {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-deselect-shake {
          animation: deselect-shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        .animate-flash-out {
          animation: flash-out 0.4s ease-out forwards;
        }
      `}</style>
    </button>
  );
};
