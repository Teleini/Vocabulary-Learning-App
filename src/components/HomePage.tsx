import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Trophy } from 'lucide-react';
import { db } from '@/lib/database';
import wordsData from '@/data/words.json';

interface HomePageProps {
  onStartGame: () => void;
}

export default function HomePage({ onStartGame }: HomePageProps) {
  const [highScore, setHighScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await db.init();

        const existingWords = await db.getAllWords();
        if (existingWords.length === 0) {
          await db.initializeWords(wordsData);
        }

        const currentHighScore = await db.getHighScore();
        setHighScore(currentHighScore);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="game-container">
        <div className="pixel-card animate-pulse">
          <div className="text-center text-primary text-xl">
            LOADING...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="pixel-border bg-surface p-6 mb-6">
            <h1 className="text-4xl text-primary font-pixel mb-2">
              FUNWORDS
            </h1>
            <p className="text-sm text-muted-foreground">
              高考趣味背单词
            </p>
          </div>
        </div>

        {/* High Score Display */}
        <Card className="text-center">
          <div className="p-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-6 h-6 text-primary" />
              <span className="text-lg font-pixel">HIGH SCORE</span>
            </div>
            <div className="text-3xl font-pixel text-primary">
              {highScore}
            </div>
          </div>
        </Card>

        {/* Game Info */}
        <Card>
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-pixel text-center mb-4">游戏规则</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-primary">❤️</span>
                <span>3条生命，答错扣1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✨</span>
                <span>连对3题获得特效</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">💡</span>
                <span>每轮2次提示机会</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">🎯</span>
                <span>每轮10题挑战</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Start Game Button */}
        <Button
          onClick={onStartGame}
          size="lg"
          className="w-full text-xl py-6 font-pixel"
        >
          <Play className="w-6 h-6 mr-2" />
          START GAME
        </Button>

        {/* Version Info */}
        <div className="text-center text-xs text-muted-foreground">
          v1.0.0 | 魂斗罗像素风
        </div>
      </div>
    </div>
  );
}