
import React, { useState } from 'react';
import { ConjugationDrill as DrillType } from '../types';

interface ConjugationDrillProps {
  onExit: () => void;
  drills: DrillType[];
  tenseTitle: string;
  description: string;
}

export const ConjugationDrill: React.FC<ConjugationDrillProps> = ({ onExit, drills, tenseTitle, description }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const current = drills[currentIndex];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % drills.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + drills.length) % drills.length);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="max-w-4xl w-full px-6 flex flex-col items-center animate-fadeIn">
      {/* Header */}
      <div className="w-full flex justify-between items-end mb-12 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Grammaire: <span className="text-black/40">{tenseTitle}</span>
          </h2>
          <span className="mono-font text-xs font-bold opacity-40">EXERCISE {currentIndex + 1} / {drills.length}</span>
        </div>
        <button 
          onClick={onExit}
          className="text-black font-black uppercase text-sm tracking-widest hover:underline"
        >
          Exit Archive
        </button>
      </div>

      {/* Noir Intelligence Guide */}
      <div className="w-full border-2 border-black p-6 mb-12 flex gap-6 items-start">
        <div className="bg-black text-white p-3 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Dossier Intel</h4>
          <p className="text-sm font-bold leading-relaxed">{description}</p>
        </div>
      </div>

      <div 
        className="relative w-full aspect-[3/2] perspective-1000 cursor-pointer"
        onClick={toggleFlip}
      >
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front: Prompt */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-black p-12 flex flex-col items-center justify-between text-center group">
            <span className="mono-font text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Prompt</span>
            
            <div className="flex-grow flex flex-col items-center justify-center gap-4">
              <h3 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-none">
                {current.subject}
              </h3>
              <p className="text-2xl font-bold opacity-20 uppercase tracking-widest">({current.verb})</p>
            </div>

            <div className="w-full space-y-6">
              <div className="bg-black text-white p-4 text-xs font-black uppercase tracking-widest inline-block">
                Rule: {current.ruleNote}
              </div>
              <p className="mono-font text-[10px] font-bold uppercase tracking-widest animate-pulse opacity-40">Inspect Intel (Click to flip)</p>
            </div>
          </div>

          {/* Back: Answer */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black text-white border-2 border-black p-12 flex flex-col items-center justify-between text-center">
            <span className="mono-font text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Classified Answer</span>
            
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                <span className="opacity-40">{current.subject.includes("'") ? current.subject.split("'")[0] + "'" : current.subject + " "}</span>
                <span className="underline decoration-4 underline-offset-8">{current.auxiliary} {current.participle}</span>
              </div>
              <p className="text-xl opacity-60 italic font-medium">"{current.translation}"</p>
            </div>

            <div className="w-full">
              <p className="mono-font text-[10px] font-bold uppercase tracking-widest opacity-40">Return to Case</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-12 mt-12">
        <button onClick={handlePrev} className="group flex items-center gap-3 font-black uppercase text-sm tracking-widest hover:opacity-100 opacity-40 transition-opacity">
          &larr; Previous Case
        </button>
        <div className="h-1 w-24 bg-slate-100 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-black transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / drills.length) * 100}%` }}
          />
        </div>
        <button onClick={handleNext} className="group flex items-center gap-3 font-black uppercase text-sm tracking-widest hover:opacity-100 opacity-40 transition-opacity">
          Next Assignment &rarr;
        </button>
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
