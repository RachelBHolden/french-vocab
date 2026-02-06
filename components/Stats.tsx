
import React from 'react';

interface StatsProps {
  matches: number;
  total: number;
  timer: number;
  score: number;
}

export const Stats: React.FC<StatsProps> = ({ matches, total, timer, score }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressWidth = (matches / total) * 100;

  return (
    <div className="border-2 border-black mb-12 bg-white">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x-2 divide-black">
        <div className="flex-1 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Progress</span>
            <span className="text-xl font-black">{Math.round(progressWidth)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2">
            <div 
              className="bg-black h-full transition-all duration-500 ease-out" 
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 divide-x-2 divide-black md:min-w-[400px]">
          <StatBox label="Score" value={score} isHighlight />
          <StatBox label="Index" value={`${matches}/${total}`} />
          <StatBox label="Time" value={formatTime(timer)} />
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, isHighlight }: any) => (
  <div className="p-6 text-center flex flex-col items-center justify-center">
    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">{label}</span>
    <span className={`text-2xl font-black tracking-tighter ${isHighlight ? 'animate-pulse' : ''}`}>{value}</span>
  </div>
);