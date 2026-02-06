
import React, { useState, useMemo, useEffect } from 'react';
import { GameMode, Word } from '../types';
import { FRENCH_VOCABULARY, FRENCH_VERBS } from '../constants';

interface FlashcardDeckProps {
  mode: GameMode;
  category: string | null;
  onExit: () => void;
  onWordSeen?: (wordId: string) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ mode, category, onExit, onWordSeen }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [seenIndices, setSeenIndices] = useState<Set<number>>(new Set([0]));

  const words: Word[] = useMemo(() => {
    let base = mode === GameMode.VOCABULARY ? FRENCH_VOCABULARY : FRENCH_VERBS;
    if (category) {
      base = base.filter(w => w.category === category);
    }
    return base;
  }, [mode, category]);

  useEffect(() => {
    if (onWordSeen && words.length > 0) {
      onWordSeen(words[0].id);
    }
  }, []);

  const currentWord = words[currentIndex];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFlipped(false);
    const nextIdx = (currentIndex + 1) % words.length;
    
    if (!seenIndices.has(nextIdx)) {
      setSeenIndices(prev => new Set(prev).add(nextIdx));
      if (onWordSeen) onWordSeen(words[nextIdx].id);
    }
    
    setCurrentIndex(nextIdx);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFlipped(false);
    const prevIdx = (currentIndex - 1 + words.length) % words.length;
    
    if (!seenIndices.has(prevIdx)) {
      setSeenIndices(prev => new Set(prev).add(prevIdx));
      if (onWordSeen) onWordSeen(words[prevIdx].id);
    }

    setCurrentIndex(prevIdx);
  };

  const toggleFlip = () => setIsFlipped(!isFlipped);

  if (words.length === 0) return <div className="p-12 text-center font-black uppercase tracking-widest border-2 border-black">No evidence found.</div>;

  return (
    <div className="max-w-3xl w-full px-6 flex flex-col items-center animate-fadeIn">
      <div className="w-full flex justify-between items-end mb-12 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            {category || (mode === GameMode.VOCABULARY ? 'Vocabulaire' : 'Verbes')}
          </h2>
          <span className="mono-font text-xs font-bold opacity-40">CARD {currentIndex + 1} / {words.length}</span>
        </div>
        <button onClick={onExit} className="text-black font-black uppercase text-sm tracking-widest hover:underline">Exit</button>
      </div>

      <div className="relative w-full aspect-[3/2] perspective-1000 cursor-pointer" onClick={toggleFlip}>
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-black p-12 flex flex-col items-center justify-between text-center">
            <span className="mono-font text-[10px] font-black uppercase tracking-[0.5em] opacity-40">French</span>
            <h3 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-none">{currentWord.french}</h3>
            <div className="w-full pt-8 border-t border-slate-100"><p className="text-black/60 italic text-xl">"{currentWord.exampleFrench}"</p></div>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black text-white border-2 border-black p-12 flex flex-col items-center justify-between text-center">
            <span className="mono-font text-[10px] font-black uppercase tracking-[0.5em] opacity-40 text-white/40">English</span>
            <h3 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-none">{currentWord.english}</h3>
            <div className="w-full pt-8 border-t border-white/10"><p className="text-white/60 italic text-xl">"{currentWord.exampleEnglish}"</p></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12 mt-12">
        <button onClick={handlePrev} className="group flex items-center gap-3 font-black uppercase text-sm tracking-widest hover:opacity-100 opacity-40 transition-opacity">&larr; Prev</button>
        <div className="h-1 w-24 bg-slate-100 relative">
          <div className="absolute top-0 left-0 h-full bg-black transition-all duration-300" style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }} />
        </div>
        <button onClick={handleNext} className="group flex items-center gap-3 font-black uppercase text-sm tracking-widest hover:opacity-100 opacity-40 transition-opacity">Next &rarr;</button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
