
import React, { useState, useEffect } from 'react';
import { MatchingGame } from './components/MatchingGame';
import { FlashcardDeck } from './components/FlashcardDeck';
import { ConjugationDrill } from './components/ConjugationDrill';
import { MysteryPuzzle } from './components/MysteryPuzzle';
import { Logo } from './components/Logo';
import { GameState, GameMode, ArchiveData } from './types';
import { 
  PASSE_COMPOSE_DRILLS, 
  IMPARFAIT_DRILLS, 
  FUTUR_SIMPLE_DRILLS, 
  CONDITIONNEL_PRESENT_DRILLS,
  FRENCH_VOCABULARY,
  FRENCH_VERBS
} from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.VOCABULARY);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTense, setCurrentTense] = useState<'passe-compose' | 'imparfait' | 'futur-simple' | 'conditionnel-present'>('passe-compose');
  const [difficulty, setDifficulty] = useState<'normal' | 'hard'>('normal');
  const [finalTime, setFinalTime] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  // Persistence logic
  const [archive, setArchive] = useState<ArchiveData>(() => {
    const saved = localStorage.getItem('vocab_noir_archive');
    const defaultData: ArchiveData = {
      highScores: {
        [GameMode.VOCABULARY]: 0,
        [GameMode.VERBS]: 0,
        [GameMode.CONJUGAISON]: 0
      },
      masteredWordIds: [],
      solvedPuzzleIds: [],
      totalSessions: 0
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultData, ...parsed };
      } catch (e) {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('vocab_noir_archive', JSON.stringify(archive));
  }, [archive]);

  const handleWordSeen = (wordId: string) => {
    if (!archive.masteredWordIds.includes(wordId)) {
      setArchive(prev => ({
        ...prev,
        masteredWordIds: [...prev.masteredWordIds, wordId]
      }));
    }
  };

  const handlePuzzleSolved = (index: number) => {
    if (!archive.solvedPuzzleIds.includes(index)) {
      setArchive(prev => ({
        ...prev,
        solvedPuzzleIds: [...prev.solvedPuzzleIds, index]
      }));
    }
  };

  const resetArchives = () => {
    if (window.confirm("BURN AFTER READING? This will erase all classified progress.")) {
      const defaultData: ArchiveData = {
        highScores: {
          [GameMode.VOCABULARY]: 0,
          [GameMode.VERBS]: 0,
          [GameMode.CONJUGAISON]: 0
        },
        masteredWordIds: [],
        solvedPuzzleIds: [],
        totalSessions: 0
      };
      setArchive(defaultData);
      setGameState(GameState.MENU);
    }
  };

  const quitToMenu = () => {
    setGameState(GameState.MENU);
    setSelectedCategory(null);
  };

  const openCategoryMenu = (mode: GameMode) => {
    setGameMode(mode);
    setGameState(GameState.CATEGORY_MENU);
  };

  const startNewGame = (category: string | null) => {
    setSelectedCategory(category);
    setGameState(GameState.PLAYING);
  };

  const startConjugationMatch = (tense: typeof currentTense) => {
    setGameMode(GameMode.CONJUGAISON);
    setCurrentTense(tense);
    setGameState(GameState.PLAYING);
  };

  const startRevision = (category: string | null) => {
    setSelectedCategory(category);
    setGameState(GameState.REVISION);
  };

  const startConjugationMenu = () => {
    setGameState(GameState.CONJUGATION_MENU);
  };

  const startConjugationDrill = (tense: typeof currentTense) => {
    setCurrentTense(tense);
    setGameState(GameState.CONJUGATION_DRILL);
  };

  const startMystery = () => {
    setGameState(GameState.MYSTERY);
  };

  const handleGameFinish = (time: number, score: number) => {
    setFinalTime(time);
    setFinalScore(score);
    setGameState(GameState.FINISHED);
    
    if (!selectedCategory && score > (archive.highScores[gameMode] || 0)) {
      setArchive(prev => ({
        ...prev,
        highScores: {
          ...prev.highScores,
          [gameMode]: score
        }
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTenseData = () => {
    switch (currentTense) {
      case 'passe-compose': return { data: PASSE_COMPOSE_DRILLS, title: 'Passé Composé', description: "Action Past." };
      case 'imparfait': return { data: IMPARFAIT_DRILLS, title: 'Imparfait', description: "Background Past." };
      case 'futur-simple': return { data: FUTUR_SIMPLE_DRILLS, title: 'Futur Simple', description: "The 'Will' Tense." };
      case 'conditionnel-present': return { data: CONDITIONNEL_PRESENT_DRILLS, title: 'Conditionnel Présent', description: "The 'Would' Tense." };
      default: return { data: PASSE_COMPOSE_DRILLS, title: 'Passé Composé', description: "" };
    }
  };

  const getCategories = () => {
    const dataSource = gameMode === GameMode.VOCABULARY ? FRENCH_VOCABULARY : FRENCH_VERBS;
    const uniqueCategories = Array.from(new Set(dataSource.map(w => w.category)));
    return uniqueCategories.sort();
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans relative overflow-x-hidden">
      {/* Navbar */}
      <header className="bg-white border-b border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={quitToMenu}>
              <Logo size={48} />
              <h1 className="text-2xl font-black uppercase tracking-tighter transition-colors group-hover:text-slate-500">
                Vocab<span className="text-slate-400">Noir</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setGameState(GameState.PROFILE)}
                className={`flex items-center gap-2 px-4 py-2 border-2 border-black font-bold transition-all ${gameState === GameState.PROFILE ? 'bg-black text-white' : 'hover:bg-black hover:text-white'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline uppercase tracking-widest text-[10px]">Dossier</span>
              </button>
              <button 
                onClick={startMystery}
                className={`flex items-center gap-2 px-4 py-2 border-2 border-black font-bold transition-all ${gameState === GameState.MYSTERY ? 'bg-black text-white' : 'hover:bg-black hover:text-white'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline uppercase tracking-widest text-[10px]">Affaires</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-16">
        {gameState === GameState.MENU && (
          <div className="max-w-6xl w-full px-6 text-center animate-fadeIn">
            <div className="mb-16 flex flex-col items-center">
              <Logo size={80} className="mb-8" />
              <h2 className="text-6xl sm:text-8xl font-black mb-4 uppercase tracking-tighter leading-none">Archives</h2>
              <p className="text-black/60 text-xl max-w-lg mx-auto font-medium">Classified French Lexicon.</p>
              
              <div className="mt-8 flex gap-8 border-y border-black/5 py-4 w-full justify-center mono-font text-[10px] font-black uppercase tracking-[0.3em]">
                <div className="flex items-center gap-3">
                  <span className="opacity-40">Intelligence:</span>
                  <span className="text-lg tracking-tighter">{archive.masteredWordIds.length} Mots</span>
                </div>
                <div className="w-px h-4 bg-black/10 self-center"></div>
                <div className="flex items-center gap-3">
                  <span className="opacity-40">Cases:</span>
                  <span className="text-lg tracking-tighter">{archive.solvedPuzzleIds.length} Résolues</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <MenuCard title="Vocabulaire" desc="The basic dossiers." best={archive.highScores[GameMode.VOCABULARY]} onClick={() => openCategoryMenu(GameMode.VOCABULARY)} />
              <MenuCard title="Verbes" desc="Action intel." best={archive.highScores[GameMode.VERBS]} onClick={() => openCategoryMenu(GameMode.VERBS)} />
              <MenuCard title="Conjugaison" desc="Grammar logic." best={archive.highScores[GameMode.CONJUGAISON]} onClick={startConjugationMenu} />
            </div>
          </div>
        )}

        {gameState === GameState.PROFILE && (
          <div className="max-w-4xl w-full px-6 animate-fadeIn">
             <div className="bg-white border-4 border-black p-12 relative overflow-hidden">
                <div className="absolute top-8 right-8 rotate-12 opacity-10 pointer-events-none">
                  <span className="text-6xl font-black uppercase border-8 border-black p-4">Classifié</span>
                </div>

                <div className="border-b-4 border-black pb-8 mb-12 flex justify-between items-end">
                   <div>
                      <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">Dossier Personnel</h2>
                      <p className="mono-font text-xs uppercase tracking-[0.4em] opacity-40">Agent Identity: Anonymous</p>
                   </div>
                   <button onClick={quitToMenu} className="font-black uppercase text-sm tracking-widest hover:underline">Close Folder</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                   <div className="space-y-12">
                      <ProfileStat label="Field Intelligence" value={`${archive.masteredWordIds.length} Mots Mastered`} />
                      <ProfileStat label="Cases Solved" value={`${archive.solvedPuzzleIds.length} Mysteries`} />
                      <ProfileStat label="Operational Records" value={`${archive.totalSessions} Sessions`} />
                   </div>
                   <div className="space-y-8 bg-slate-50 p-8 border-2 border-black border-dashed">
                      <h3 className="mono-font text-[10px] font-black uppercase tracking-widest opacity-60">High Scores per Sector</h3>
                      <ModeScore label="Vocabulary" score={archive.highScores[GameMode.VOCABULARY]} />
                      <ModeScore label="Verbs" score={archive.highScores[GameMode.VERBS]} />
                      <ModeScore label="Grammar" score={archive.highScores[GameMode.CONJUGAISON]} />
                   </div>
                </div>

                <div className="mt-16 pt-8 border-t-2 border-black flex justify-between items-center">
                   <p className="text-[10px] mono-font opacity-40 uppercase tracking-widest">Archive storage: Browser LocalStorage Active</p>
                   <button 
                    onClick={resetArchives}
                    className="px-6 py-2 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-colors"
                   >
                     Burn After Reading (Reset)
                   </button>
                </div>
             </div>
          </div>
        )}

        {gameState === GameState.CATEGORY_MENU && (
          <div className="max-w-5xl w-full px-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 border-b-2 border-black pb-4 gap-6">
              <div>
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">{gameMode === GameMode.VOCABULARY ? 'Vocabulaire' : 'Verbes'}</h2>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => setDifficulty('normal')} 
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black transition-all ${difficulty === 'normal' ? 'bg-black text-white' : 'hover:bg-slate-100'}`}
                  >
                    Normal
                  </button>
                  <button 
                    onClick={() => setDifficulty('hard')} 
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black transition-all ${difficulty === 'hard' ? 'bg-black text-white' : 'hover:bg-slate-100'}`}
                  >
                    Hard (24 Cards)
                  </button>
                </div>
              </div>
              <button onClick={quitToMenu} className="font-black uppercase text-sm tracking-widest hover:underline">Back</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CategoryItem title="Tout Réviser" desc="The full collection." onMatch={() => startNewGame(null)} onRevise={() => startRevision(null)} />
              {getCategories().map(cat => <CategoryItem key={cat} title={cat} desc={`Index: ${cat}`} onMatch={() => startNewGame(cat)} onRevise={() => startRevision(cat)} />)}
            </div>
          </div>
        )}

        {gameState === GameState.CONJUGATION_MENU && (
          <div className="max-w-3xl w-full px-6 animate-fadeIn">
            <div className="mb-12 border-b-2 border-black pb-4 flex justify-between items-end">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Grammaire</h2>
              <button onClick={quitToMenu} className="font-black uppercase text-sm tracking-widest hover:underline">Back</button>
            </div>
            <div className="space-y-6">
              <ChapterItem title="Passé Composé" onMatch={() => startConjugationMatch('passe-compose')} onDrill={() => startConjugationDrill('passe-compose')} />
              <ChapterItem title="L'Imparfait" onMatch={() => startConjugationMatch('imparfait')} onDrill={() => startConjugationDrill('imparfait')} />
              <ChapterItem title="Futur Simple" onMatch={() => startConjugationMatch('futur-simple')} onDrill={() => startConjugationDrill('futur-simple')} />
              <ChapterItem title="Conditionnel Présent" onMatch={() => startConjugationMatch('conditionnel-present')} onDrill={() => startConjugationDrill('conditionnel-present')} />
            </div>
          </div>
        )}

        {gameState === GameState.CONJUGATION_DRILL && <ConjugationDrill onExit={startConjugationMenu} drills={getTenseData().data} tenseTitle={getTenseData().title} description={getTenseData().description} />}
        {gameState === GameState.MYSTERY && <MysteryPuzzle onExit={quitToMenu} onSolved={handlePuzzleSolved} />}
        {gameState === GameState.PLAYING && <MatchingGame mode={gameMode} category={selectedCategory} tense={gameMode === GameMode.CONJUGAISON ? currentTense : null} difficulty={difficulty} onFinish={handleGameFinish} onQuit={() => gameMode === GameMode.CONJUGAISON ? setGameState(GameState.CONJUGATION_MENU) : setGameState(GameState.CATEGORY_MENU)} />}
        {gameState === GameState.REVISION && <FlashcardDeck mode={gameMode} category={selectedCategory} onExit={() => setGameState(GameState.CATEGORY_MENU)} onWordSeen={handleWordSeen} />}

        {gameState === GameState.FINISHED && (
          <div className="max-w-md w-full p-12 text-center bg-black text-white border-4 border-black animate-bounceIn mx-6">
            <div className="mb-8">
              <Logo size={64} className="mx-auto mb-6 bg-white border-white" />
              <h2 className="text-5xl font-black uppercase leading-none">Affaire<br/>Terminée</h2>
            </div>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center border-b border-white/20 pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-white/40">Points</span>
                <span className="text-4xl font-black">{finalScore}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-white/40">Duration</span>
                <span className="text-4xl font-black">{formatTime(finalTime)}</span>
              </div>
            </div>
            <div className="space-y-4">
              <button onClick={() => gameMode === GameMode.CONJUGAISON ? startConjugationMatch(currentTense) : startNewGame(selectedCategory)} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Replay Mission</button>
              <button onClick={() => gameMode === GameMode.CONJUGAISON ? setGameState(GameState.CONJUGATION_MENU) : setGameState(GameState.CATEGORY_MENU)} className="w-full py-5 bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all border-2 border-white">Return to Files</button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-black">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black"></div>
            <span>VocabNoir v2.3 Agent Edition</span>
          </div>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

const ProfileStat = ({ label, value }: any) => (
  <div>
    <h4 className="mono-font text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">{label}</h4>
    <p className="text-3xl font-black uppercase tracking-tighter">{value}</p>
  </div>
);

const ModeScore = ({ label, score }: any) => (
  <div className="flex justify-between items-center border-b border-black/10 pb-2">
    <span className="font-bold uppercase text-[10px] tracking-widest">{label}</span>
    <span className="font-black text-lg">{score}</span>
  </div>
);

const MenuCard = ({ title, desc, best, onClick }: any) => (
  <button onClick={onClick} className="group relative bg-white border-2 border-black p-10 text-left transition-all hover:bg-black hover:text-white flex flex-col h-full">
    <div className="flex-grow">
      <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 leading-none">{title}</h3>
      <p className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-80 mb-6">{desc}</p>
    </div>
    {best !== undefined && <div className="mt-4 border-t border-black/10 group-hover:border-white/20 pt-4"><span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-60">Record: {best}</span></div>}
  </button>
);

const CategoryItem = ({ title, desc, onMatch, onRevise }: any) => (
  <div className="border-2 border-black p-8 bg-white transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
    <div className="mb-10"><h4 className="text-2xl font-black uppercase tracking-tighter leading-none">{title}</h4><p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">{desc}</p></div>
    <div className="flex gap-4">
      <button onClick={onMatch} className="flex-1 py-3 bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-slate-800">Match</button>
      <button onClick={onRevise} className="flex-1 py-3 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white">Revise</button>
    </div>
  </div>
);

const ChapterItem = ({ title, onMatch, onDrill }: any) => (
  <div className="w-full p-8 border-2 border-black text-left flex flex-col md:flex-row items-start md:items-center justify-between hover:border-slate-400 transition-all group">
    <span className="text-2xl font-black uppercase tracking-tighter mb-4 md:mb-0">{title}</span>
    <div className="flex gap-4 w-full md:w-auto">
      <button onClick={onMatch} className="flex-1 px-6 py-3 bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Match</button>
      <button onClick={onDrill} className="flex-1 px-6 py-3 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all">Drill</button>
    </div>
  </div>
);

export default App;
