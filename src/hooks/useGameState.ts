import { useState, useEffect, useCallback } from 'react';
import { GameState, Question, GameResult } from '@/types';

const INITIAL_GAME_STATE: GameState = {
  currentQuestion: 0,
  score: 0,
  lives: 3,
  combo: 0,
  maxCombo: 0,
  correctAnswers: 0,
  totalQuestions: 10,
  hintsUsed: 0,
  maxHints: 2,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>('');

  const resetGame = useCallback(() => {
    setGameState(INITIAL_GAME_STATE);
    setIsGameOver(false);
    setCurrentHint('');
  }, []);

  const startNewGame = useCallback((newQuestions: Question[]) => {
    resetGame();
    setQuestions(newQuestions);
  }, [resetGame]);

  const answerQuestion = useCallback((isCorrect: boolean) => {
    setGameState(prev => {
      const newCombo = isCorrect ? prev.combo + 1 : 0;
      const newScore = isCorrect
        ? prev.score + 1 + Math.floor(newCombo / 3)
        : Math.max(0, prev.score - 1);

      const newLives = isCorrect ? prev.lives : prev.lives - 1;
      const newCorrectAnswers = isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers;
      const newMaxCombo = Math.max(prev.maxCombo, newCombo);

      return {
        ...prev,
        score: newScore,
        lives: newLives,
        combo: newCombo,
        maxCombo: newMaxCombo,
        correctAnswers: newCorrectAnswers,
        currentQuestion: prev.currentQuestion + 1,
      };
    });

    setCurrentHint('');
  }, []);

  const useHint = useCallback((hint: string) => {
    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }));
    setCurrentHint(hint);
  }, []);

  const canUseHint = gameState.hintsUsed < gameState.maxHints;
  const currentQuestion = questions[gameState.currentQuestion];
  const isLastQuestion = gameState.currentQuestion >= gameState.totalQuestions;

  useEffect(() => {
    if (gameState.lives <= 0 || isLastQuestion) {
      setIsGameOver(true);
    }
  }, [gameState.lives, isLastQuestion]);

  const getGameResult = useCallback((): GameResult => {
    const correctRate = gameState.totalQuestions > 0
      ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)
      : 0;

    let grade: GameResult['grade'] = 'C';
    if (correctRate >= 90) grade = 'S';
    else if (correctRate >= 80) grade = 'A';
    else if (correctRate >= 70) grade = 'B';

    return {
      score: gameState.score,
      correctRate,
      maxCombo: gameState.maxCombo,
      grade,
    };
  }, [gameState]);

  return {
    gameState,
    questions,
    isGameOver,
    currentHint,
    currentQuestion,
    canUseHint,
    startNewGame,
    answerQuestion,
    useHint,
    resetGame,
    getGameResult,
  };
};