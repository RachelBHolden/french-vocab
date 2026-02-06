
export interface Word {
  id: string;
  french: string;
  english: string;
  category: string;
  exampleFrench: string;
  exampleEnglish: string;
}

export interface ConjugationDrill {
  id: string;
  verb: string;
  subject: string;
  conjugated: string;
  translation: string;
  auxiliary: string;
  participle: string;
  ruleNote: string;
}

export interface CardItem {
  id: string; 
  wordId: string; 
  text: string;
  type: 'french' | 'english';
}

export enum GameState {
  MENU = 'MENU',
  CATEGORY_MENU = 'CATEGORY_MENU',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
  REVISION = 'REVISION',
  CONJUGATION_MENU = 'CONJUGATION_MENU',
  CONJUGATION_DRILL = 'CONJUGATION_DRILL',
  MYSTERY = 'MYSTERY',
  PROFILE = 'PROFILE'
}

export enum GameMode {
  VOCABULARY = 'VOCABULARY',
  VERBS = 'VERBS',
  CONJUGAISON = 'CONJUGAISON'
}

export interface ArchiveData {
  highScores: {
    [GameMode.VOCABULARY]: number;
    [GameMode.VERBS]: number;
    [GameMode.CONJUGAISON]: number;
  };
  masteredWordIds: string[];
  solvedPuzzleIds: number[];
  totalSessions: number;
}

export interface Stats {
  totalMatches: number;
  bestTime: number | null;
  lastScore: number;
}
