import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import GameQuestion from './components/GameQuestion';
import GameResultDialog from './components/GameResultDialog';
import { GameEffects, useGameEffects } from './components/GameEffects';
import { useGameState } from './hooks/useGameState';
import { QuestionGenerator } from './lib/questionGenerator';
import { db } from './lib/database';
import wordsData from './data/words.json';

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
        // 检查数据库是否为空
        const dbWords = await db.getAllWords();
        if (dbWords.length === 0) {
          // 如果为空，从JSON初始化数据
          await db.initializeWords(wordsData);
        }
        const words = await db.getAllWords();
        setQuestionGenerator(new QuestionGenerator(words));
      } catch (error) {
        console.error('Failed to initialize database, using fallback data:', error);
        // 使用备用数据
        setQuestionGenerator(new QuestionGenerator(wordsData));
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
      <div className="game-container flex flex-col items-center justify-center min-h-screen">
        <div className="animate-pulse mb-4">
          <div className="w-16 h-16 bg-primary/30 rounded-full"></div>
        </div>
        <div className="text-center text-primary text-xl font-pixel">
          正在加载单词数据...
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          首次加载可能需要一些时间
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    // 更新 state 使下一次渲染能够显示降级 UI
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="game-container text-center p-8">
          <h1 className="text-destructive text-2xl mb-4">出现错误</h1>
          <p className="text-muted-foreground mb-6">应用加载时遇到问题，请刷新页面重试</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded"
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;