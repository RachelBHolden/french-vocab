
import React, { useState, useEffect, useRef } from 'react';

interface Suspect {
  name: string;
  job: string;
}

interface MysteryScenario {
  title: string;
  intro: string;
  suspects: Suspect[];
  locations: string[];
  weapons: string[];
  clues: string[];
  solution: {
    suspect: string;
    location: string;
    weapon: string;
  };
}

const SCENARIOS: MysteryScenario[] = [
  {
    title: "Le Mystère du Manoir",
    intro: "Le célèbre détective arrive au manoir. Le propriétaire a disparu. C'est un soir de tempête.",
    suspects: [
      { name: 'Jacques', job: 'Le serveur' },
      { name: 'Lucie', job: 'La femme de ménage' },
      { name: 'Henri', job: 'Le jardinier' }
    ],
    locations: ['Le grand salon', 'La salle à manger', 'La véranda'],
    weapons: ['Un chandelier', 'Une corde', 'Un poison'],
    clues: [
      "Lucie nettoyait la véranda toute la soirée. Elle est innocente.",
      "Henri était dehors dans le jardin, il n'est pas entré dans la maison.",
      "L'arme n'est pas liquide, donc ce n'est pas le poison.",
      "Le crime a eu lieu dans la pièce la plus grande : le salon.",
      "Jacques a été vu avec un objet brillant et lourd."
    ],
    solution: {
      suspect: 'Jacques',
      location: 'Le grand salon',
      weapon: 'Un chandelier'
    }
  },
  {
    title: "Le Vol au Musée",
    intro: "Un diamant précieux a été volé au musée d'art moderne à minuit.",
    suspects: [
      { name: 'Marc', job: 'Le garde' },
      { name: 'Sophie', job: 'La guide' },
      { name: 'Pierre', job: 'Le visiteur' }
    ],
    locations: ['La galerie', 'Le bureau', 'Le couloir'],
    weapons: ['Un tournevis', 'Un marteau', 'Une clé'],
    clues: [
      "Sophie était dans le bureau pour préparer la visite de demain.",
      "Le voleur n'a pas utilisé de clé pour ouvrir la vitrine.",
      "Marc a entendu un bruit de verre cassé dans la galerie.",
      "Pierre a laissé un marteau sur le sol de la galerie.",
      "Le garde Marc était à son poste dans le couloir."
    ],
    solution: {
      suspect: 'Pierre',
      location: 'La galerie',
      weapon: 'Un marteau'
    }
  },
  {
    title: "Panique à la Boulangerie",
    intro: "La recette secrète du meilleur croissant a disparu de la boulangerie !",
    suspects: [
      { name: 'M. Jean', job: 'Le boulanger' },
      { name: 'Mme Claire', job: 'La cliente' },
      { name: 'Paul', job: 'L\'apprenti' }
    ],
    locations: ['Le fournil', 'La boutique', 'La réserve'],
    weapons: ['Un rouleau', 'Un sac de farine', 'Un couteau'],
    clues: [
      "Mme Claire attendait dans la boutique pour acheter du pain.",
      "Le boulanger M. Jean travaillait dans la réserve.",
      "On a trouvé de la farine partout dans le fournil.",
      "L'apprenti Paul était seul dans le fournil pendant dix minutes.",
      "Paul tenait un sac de farine vide."
    ],
    solution: {
      suspect: 'Paul',
      location: 'Le fournil',
      weapon: 'Un sac de farine'
    }
  },
  {
    title: "Intrigue à la Gare",
    intro: "Une valise pleine de billets a été échangée sur le quai numéro 9.",
    suspects: [
      { name: 'Thomas', job: 'Le contrôleur' },
      { name: 'Julie', job: 'La passagère' },
      { name: 'Lucas', job: 'Le conducteur' }
    ],
    locations: ['Le quai', 'La salle d\'attente', 'Le guichet'],
    weapons: ['Une valise', 'Une canne', 'Une montre'],
    clues: [
      "Le conducteur Lucas était dans son train, loin du quai.",
      "Julie lisait un livre dans la salle d'attente.",
      "Thomas marchait sur le quai avec une valise noire.",
      "L'objet utilisé pour le crime n'est pas petit comme une montre.",
      "Le guichet était fermé, personne n'était là."
    ],
    solution: {
      suspect: 'Thomas',
      location: 'Le quai',
      weapon: 'Une valise'
    }
  },
  {
    title: "Drame au Théâtre",
    intro: "Pendant la répétition, un acteur a été blessé par un accessoire dangereux.",
    suspects: [
      { name: 'Alex', job: 'L\'acteur' },
      { name: 'Marie', job: 'La maquilleuse' },
      { name: 'Éric', job: 'Le technicien' }
    ],
    locations: ['La scène', 'Les coulisses', 'La loge'],
    weapons: ['Une épée', 'Un miroir', 'Une perruque'],
    clues: [
      "Marie préparait les costumes dans la loge.",
      "Le technicien Éric vérifiait les lumières dans les coulisses.",
      "L'incident s'est produit sous les projecteurs, sur la scène.",
      "L'arme est en métal et elle est pointue.",
      "Alex tenait l'épée pour sa scène de combat."
    ],
    solution: {
      suspect: 'Alex',
      location: 'La scène',
      weapon: 'Une épée'
    }
  },
  {
    title: "Sabotage à l'Hôtel",
    intro: "Le dîner du ministre a été gâché par un ingrédient mystère.",
    suspects: [
      { name: 'Léa', job: 'La réceptionniste' },
      { name: 'Bruno', job: 'Le chef' },
      { name: 'Sarah', job: 'La directrice' }
    ],
    locations: ['La cuisine', 'La réception', 'Le restaurant'],
    weapons: ['Une poêle', 'Un flacon', 'Une cuillère'],
    clues: [
      "Léa n'a pas quitté son bureau à la réception.",
      "Sarah accueillait les invités dans le restaurant.",
      "Bruno préparait la sauce dans la cuisine.",
      "Le coupable a utilisé un petit flacon de sel.",
      "On a trouvé le flacon on the table de la cuisine."
    ],
    solution: {
      suspect: 'Bruno',
      location: 'La cuisine',
      weapon: 'Un flacon'
    }
  }
];

interface MysteryPuzzleProps {
  onExit: () => void;
  // Adjusted to accept index to match handlePuzzleSolved in App.tsx
  onSolved?: (index: number) => void;
}

export const MysteryPuzzle: React.FC<MysteryPuzzleProps> = ({ onExit, onSolved }) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selection, setSelection] = useState<{
    suspect: string | null;
    location: string | null;
    weapon: string | null;
  }>({ suspect: null, location: null, weapon: null });
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [solvedScenarios, setSolvedScenarios] = useState<Set<number>>(new Set());
  
  const cluesRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[scenarioIndex];

  const handleAccuse = () => {
    if (!selection.suspect || !selection.location || !selection.weapon) return;

    const isCorrect = 
      selection.suspect === scenario.solution.suspect &&
      selection.location === scenario.solution.location &&
      selection.weapon === scenario.solution.weapon;

    if (isCorrect) {
      setResult('correct');
      if (!solvedScenarios.has(scenarioIndex)) {
        setSolvedScenarios(prev => new Set(prev).add(scenarioIndex));
        // Pass the scenario index to the callback
        if (onSolved) onSolved(scenarioIndex);
      }
    } else {
      setResult('incorrect');
    }
  };

  const nextMystery = () => {
    setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
    setSelection({ suspect: null, location: null, weapon: null });
    setResult(null);
  };

  return (
    <div className="max-w-6xl w-full px-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-black pb-6 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em]">Top Secret</span>
            <span className="mono-font text-xs font-bold opacity-40">DOSSIER #{scenarioIndex + 101}</span>
          </div>
          <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">{scenario.title}</h2>
        </div>
        <div className="flex gap-4">
          <button onClick={nextMystery} className="px-6 py-3 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all">Next Case</button>
          <button onClick={onExit} className="px-6 py-3 bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Close Files</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Investigation */}
        <div className="lg:col-span-8 space-y-12">
          {/* Report Text */}
          <div className="relative p-12 bg-white border-2 border-black overflow-hidden group">
            <div className="absolute top-4 right-4 text-[40px] font-black opacity-[0.03] rotate-12 pointer-events-none select-none uppercase tracking-widest">Confidentiel</div>
            <h3 className="mono-font text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-black"></span> Opening Report
            </h3>
            <p className="text-3xl font-black tracking-tight leading-snug">
              "{scenario.intro}"
            </p>
          </div>

          {/* Clues Board */}
          <div 
            ref={cluesRef}
            className="bg-black text-white p-12 border-2 border-black relative overflow-hidden clues-container"
          >
            <h3 className="mono-font text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-10">Available Intel</h3>
            <div className="space-y-6">
              {scenario.clues.map((clue, idx) => (
                <div key={idx} className="flex gap-6 items-start border-b border-white/10 pb-6 group/clue">
                  <span className="mono-font text-lg font-black text-white/20 group-hover/clue:text-white transition-colors">{String(idx + 1).padStart(2, '0')}</span>
                  <p className="text-xl font-medium tracking-tight leading-relaxed">{clue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SelectorSection 
              label="Subject" 
              items={scenario.suspects.map(s => ({ name: s.name, sub: s.job }))} 
              current={selection.suspect} 
              onSelect={(val) => { setSelection(p => ({...p, suspect: val})); setResult(null); }} 
            />
            <SelectorSection 
              label="Location" 
              items={scenario.locations.map(l => ({ name: l }))} 
              current={selection.location} 
              onSelect={(val) => { setSelection(p => ({...p, location: val})); setResult(null); }} 
            />
            <SelectorSection 
              label="Object" 
              items={scenario.weapons.map(w => ({ name: w }))} 
              current={selection.weapon} 
              onSelect={(val) => { setSelection(p => ({...p, weapon: val})); setResult(null); }} 
            />
          </div>
        </div>

        {/* Accusation Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 p-10 bg-white border-2 border-black">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-2 border-black pb-4">Theory</h3>
            
            <div className="space-y-8 mb-10">
              <SummaryField label="Suspect" value={selection.suspect} />
              <SummaryField label="Setting" value={selection.location} />
              <SummaryField label="Evidence" value={selection.weapon} />
            </div>

            <button
              disabled={!selection.suspect || !selection.location || !selection.weapon}
              onClick={handleAccuse}
              className={`w-full py-6 font-black uppercase tracking-[0.2em] transition-all border-2 ${(!selection.suspect || !selection.location || !selection.weapon) ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : 'bg-black text-white border-black hover:bg-white hover:text-black'}`}
            >
              Verify Intel
            </button>

            {result === 'correct' && (
              <div className="mt-8 p-8 bg-black text-white text-center animate-bounceIn relative">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-white/10 pointer-events-none"></div>
                <h4 className="text-4xl font-black uppercase leading-none mb-2 tracking-tighter">Solved</h4>
                <p className="text-xs font-black uppercase tracking-widest opacity-60">Dossier Archived</p>
                <button 
                  onClick={nextMystery}
                  className="mt-6 w-full py-2 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-slate-200"
                >
                  Next Assignment
                </button>
              </div>
            )}

            {result === 'incorrect' && (
              <div className="mt-8 p-8 border-2 border-black text-center animate-shake">
                <h4 className="text-4xl font-black uppercase leading-none mb-2 tracking-tighter">False</h4>
                <p className="text-xs font-black uppercase tracking-widest opacity-40">Check Intel Again</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .clues-container:hover {
          cursor: crosshair;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

const SelectorSection = ({ label, items, current, onSelect }: any) => (
  <div className="space-y-4">
    <h4 className="mono-font text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{label}</h4>
    <div className="space-y-2">
      {items.map((item: any) => (
        <button
          key={item.name}
          onClick={() => onSelect(item.name)}
          className={`w-full p-5 text-left border-2 transition-all ${current === item.name ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-black hover:text-white'}`}
        >
          <p className="font-black uppercase tracking-tight text-sm">{item.name}</p>
          {item.sub && <p className={`text-[10px] font-bold uppercase tracking-widest ${current === item.name ? 'text-white/40' : 'text-black/40'}`}>{item.sub}</p>}
        </button>
      ))}
    </div>
  </div>
);

const SummaryField = ({ label, value }: any) => (
  <div className="group">
    <span className="mono-font text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-2 block">{label}</span>
    <div className={`p-4 border-b-2 transition-all ${value ? 'border-black' : 'border-slate-100 text-slate-200 uppercase text-xs font-black tracking-widest italic'}`}>
      {value || 'Awaiting Intel...'}
    </div>
  </div>
);
