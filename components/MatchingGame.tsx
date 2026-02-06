
import React, { useState, useEffect } from 'react';
import { WordCard } from './WordCard';
import { Stats } from './Stats';
import { CardItem, Word, GameMode, ConjugationDrill } from '../types';
import { 
  FRENCH_VOCABULARY, 
  FRENCH_VERBS, 
  PASSE_COMPOSE_DRILLS,
  IMPARFAIT_DRILLS,
  FUTUR_SIMPLE_DRILLS,
  CONDITIONNEL_PRESENT_DRILLS
} from '../constants';

interface MatchingGameProps {
  mode: GameMode;
  category: string | null;
  tense?: 'passe-compose' | 'imparfait' | 'futur-simple' | 'conditionnel-present' | null;
  difficulty?: 'normal' | 'hard';
  onFinish: (finalTime: number, finalScore: number) => void;
  onQuit: () => void;
}

const POINTS_PER_MATCH = 150;
const PENALTY_PER_MISMATCH = 30;

export const MatchingGame: React.FC<MatchingGameProps> = ({ 
  mode, 
  category, 
  tense, 
  difficulty = 'normal', 
  onFinish, 
  onQuit 
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  
  const CARDS_COUNT = difficulty === 'hard' ? 12 : 8;
  const [totalPairs, setTotalPairs] = useState(CARDS_COUNT);

  useEffect(() => {
    const shuffle = <T,>(array: T[]): T[] => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    const selectData = () => {
      if (mode === GameMode.CONJUGAISON) {
        let conjuSource: ConjugationDrill[] = [];
        switch (tense) {
          case 'passe-compose': conjuSource = PASSE_COMPOSE_DRILLS; break;
          case 'imparfait': conjuSource = IMPARFAIT_DRILLS; break;
          case 'futur-simple': conjuSource = FUTUR_SIMPLE_DRILLS; break;
          case 'conditionnel-present': conjuSource = CONDITIONNEL_PRESENT_DRILLS; break;
          default: conjuSource = PASSE_COMPOSE_DRILLS;
        }
        const shuffled = shuffle(conjuSource);
        const limit = Math.min(shuffled.length, CARDS_COUNT);
        setTotalPairs(limit);
        return shuffled.slice(0, limit).map(c => ({
          id: c.id,
          french: c.conjugated,
          english: c.translation
        }));
      } else {
        let dataSource = mode === GameMode.VOCABULARY ? FRENCH_VOCABULARY : FRENCH_VERBS;
        if (category) {
          dataSource = dataSource.filter(w => w.category === category);
        }
        const shuffled = shuffle(dataSource);
        const limit = Math.min(shuffled.length, CARDS_COUNT);
        setTotalPairs(limit);
        return shuffled.slice(0, limit).map(w => ({
          id: w.id,
          french: w.french,
          english: w.english
        }));
      }
    };

    const setupBoard = () => {
      const items = selectData();
      const gameCards: CardItem[] = [];

      items.forEach(item => {
        gameCards.push({
          id: `french-${item.id}`,
          wordId: item.id,
          text: item.french,
          type: 'french'
        });
        gameCards.push({
          id: `english-${item.id}`,
          wordId: item.id,
          text: item.english,
          type: 'english'
        });
      });

      setCards(shuffle(gameCards));
      setScore(0);
      setTimer(0);
      setMatchedIds(new Set());
    };

    setupBoard();
  }, [mode, category, tense, difficulty]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    
    if (totalPairs > 0 && matchedIds.size === totalPairs) {
      clearInterval(interval);
      const timeBonus = Math.max(0, 1000 - timer * 5);
      onFinish(timer, score + timeBonus);
    }

    return () => clearInterval(interval);
  }, [matchedIds.size, totalPairs, onFinish, timer, score]);

  const handleCardClick = (card: CardItem) => {
    if (isProcessing) return;

    const isAlreadySelected = selectedCards.find(c => c.id === card.id);
    if (isAlreadySelected) {
      setSelectedCards(prev => prev.filter(c => c.id !== card.id));
      return;
    }

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      const [first, second] = newSelected;

      if (first.wordId === second.wordId && first.type !== second.type) {
        setMatchedIds(prev => new Set(prev).add(first.wordId));
        setScore(prev => prev + POINTS_PER_MATCH);
        setSelectedCards([]);
        setIsProcessing(false);
      } else {
        setScore(prev => Math.max(0, prev - PENALTY_PER_MISMATCH));
        setTimeout(() => {
          setSelectedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const getTitle = () => {
    if (mode === GameMode.CONJUGAISON) return `Conjugaison: ${tense?.replace('-', ' ')}`;
    return category || (mode === GameMode.VOCABULARY ? 'Vocabulaire' : 'Verbes');
  };

  return (
    <div className="max-w-7xl w-full px-6 animate-fadeIn">
      <div className="flex justify-between items-end mb-12 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">
            Archive: {getTitle()}
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="mono-font text-[10px] font-bold opacity-40 uppercase">Matching Protocol</span>
            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-black ${difficulty === 'hard' ? 'bg-black text-white' : 'bg-white text-black'}`}>
              Level: {difficulty}
            </span>
          </div>
        </div>
        <button 
          onClick={onQuit}
          className="text-black font-black uppercase text-sm tracking-widest hover:underline"
        >
          Abort
        </button>
      </div>

      <Stats 
        matches={matchedIds.size} 
        total={totalPairs} 
        timer={timer} 
        score={score}
      />

      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${difficulty === 'hard' ? 'lg:grid-cols-6' : 'lg:grid-cols-4'} gap-4 sm:gap-6`}>
        {cards.map(card => (
          <WordCard
            key={card.id}
            card={card}
            isSelected={selectedCards.some(c => c.id === card.id)}
            isMatched={matchedIds.has(card.wordId)}
            onClick={handleCardClick}
            disabled={isProcessing}
          />
        ))}
      </div>
    </div>
  );
};
