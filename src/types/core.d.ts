export interface AppState {
  currentScreen: 'home' | 'gameMenu' | 'gameIntro' | 'gamePlay';
  category: string | null;
  game: string | null;
  stars: number;
  theme: 'dark' | 'light';
}

export interface GameState {
  currentRound: number;
  currentWord: any;
  score: number;
  streak: number;
  bestStreak: number;
  mistakes: number;
  isComplete: boolean;
  isPaused: boolean;
  timeElapsed: number;
  wordsCompleted: any[];
  wordsRemaining: any[];
}

export interface GameResult {
  gameId: string;
  category: string;
  score: number;
  accuracy: number;
  stars: number;
  streak: number;
  mistakes: number;
  timeElapsed: number;
  wordsCompleted: number;
  totalWords: number;
}

export interface GameConfig {
  id?: string;
  category?: string;
  words?: any[];
  totalRounds?: number;
  onStateChange?: (state: GameState) => void;
  onGameComplete?: (result: GameResult) => void;
  onCorrectAnswer?: (data: { word: any; points: number; streak: number }) => void;
  onWrongAnswer?: (data: { word: any; mistakes: number }) => void;
}

export interface Level {
  name: string;
  icon: string;
}
