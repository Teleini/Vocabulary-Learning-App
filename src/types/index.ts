export interface Word {
  id: number;
  headword: string;
  meaning: string;
  example?: string;
  audioKey?: string;
}

export interface Progress {
  wordId: number;
  correct: number;
  wrong: number;
}

export interface Meta {
  highScore: number;
}

export interface GameState {
  currentQuestion: number;
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  correctAnswers: number;
  totalQuestions: number;
  hintsUsed: number;
  maxHints: number;
}

export interface Question {
  type: 'choice' | 'spelling' | 'audio';
  word: Word;
  options?: string[];
  correctAnswer: string;
}

export interface GameResult {
  score: number;
  correctRate: number;
  maxCombo: number;
  grade: 'S' | 'A' | 'B' | 'C';
}