import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import GameQuestion from './components/GameQuestion';
import GameResultDialog from './components/GameResultDialog';
import { GameEffects, useGameEffects } from './components/GameEffects';
import { useGameState } from './hooks/useGameState';
import { QuestionGenerator } from './lib/questionGenerator';
import { db } from './lib/database';

type GameScreen = 'home' | 'playing' | 'result';

function App() {
  const [screen, setScreen] = useState<GameScreen>('home');
  const [questionGenerator, setQuestionGenerator] = useState<QuestionGenerator | null>(null);
  const gameState = useGameState();
  const { effects, playEffect } = useGameEffects();

  useEffect(() => {
    const initializeGame = async () => {
      try {
        await db.init();
        const words = await db.getAllWords();
        setQuestionGenerator(new QuestionGenerator(words));
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    initializeGame();
  }, []);

  const startGame = async () => {
    if (!questionGenerator) return;

    try {
      const words = await db.getRandomWords(10);
      const newGenerator = new QuestionGenerator(words);
      const questions = newGenerator.generateQuestions(10);

      gameState.startNewGame(questions);
      setScreen('playing');
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const handleAnswer = async (_answer: string, isCorrect: boolean) => {
    // Play effects
    if (isCorrect) {
      playEffect('correct');

      // Check for combo effects
      if ((gameState.gameState.combo + 1) % 3 === 0) {
        setTimeout(() => playEffect('combo', (gameState.gameState.combo + 1).toString()), 300);
      }

      // Check for life bonus
      if ((gameState.gameState.combo + 1) === 5) {
        setTimeout(() => playEffect('life-bonus'), 500);
      }
    } else {
      playEffect('wrong');
    }

    // Update game state
    gameState.answerQuestion(isCorrect);

    // Update progress in database
    if (gameState.currentQuestion) {
      try {
        await db.updateProgress(gameState.currentQuestion.word.id, isCorrect);
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
    }

    // Auto-advance to next question or end game
    setTimeout(() => {
      if (gameState.gameState.lives <= 0 || gameState.gameState.currentQuestion >= 10) {
        handleGameEnd();
      }
    }, 1500);
  };

  const handleGameEnd = async () => {
    const result = gameState.getGameResult();

    // Update high score
    try {
      await db.updateHighScore(result.score);
    } catch (error) {
      console.error('Failed to update high score:', error);
    }

    setScreen('result');
  };

  const handlePlayAgain = () => {
    startGame();
  };

  const handleBackToHome = () => {
    setScreen('home');
    gameState.resetGame();
  };

  if (!questionGenerator) {
    return (
      <div className="game-container">
        <div className="text-center text-primary text-xl font-pixel">
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GameEffects effects={effects} />

      {screen === 'home' && (
        <HomePage onStartGame={startGame} />
      )}

      {screen === 'playing' && gameState.currentQuestion && (
        <GameQuestion
          question={gameState.currentQuestion}
          questionGenerator={questionGenerator}
          onAnswer={handleAnswer}
          onUseHint={gameState.useHint}
          canUseHint={gameState.canUseHint}
          currentHint={gameState.currentHint}
          lives={gameState.gameState.lives}
          score={gameState.gameState.score}
          combo={gameState.gameState.combo}
          questionNumber={gameState.gameState.currentQuestion}
          totalQuestions={gameState.gameState.totalQuestions}
        />
      )}

      {screen === 'result' && (
        <GameResultDialog
          isOpen={screen === 'result'}
          result={gameState.getGameResult()}
          onPlayAgain={handlePlayAgain}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;