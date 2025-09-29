import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { GameResult } from '@/types';

interface GameResultDialogProps {
  isOpen: boolean;
  result: GameResult;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export default function GameResultDialog({
  isOpen,
  result,
  onPlayAgain,
  onBackToHome,
}: GameResultDialogProps) {
  const getMedalEmoji = (grade: GameResult['grade']) => {
    switch (grade) {
      case 'S': return '🥇';
      case 'A': return '🥈';
      case 'B': return '🥉';
      case 'C': return '🏅';
      default: return '🏅';
    }
  };

  const getGradeColor = (grade: GameResult['grade']) => {
    switch (grade) {
      case 'S': return 'text-yellow-400';
      case 'A': return 'text-gray-300';
      case 'B': return 'text-orange-400';
      case 'C': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getEncouragementMessage = (grade: GameResult['grade']) => {
    switch (grade) {
      case 'S': return '完美表现！你是单词大师！';
      case 'A': return '优秀！继续保持！';
      case 'B': return '不错的成绩，再接再厉！';
      case 'C': return '继续努力，你会越来越好！';
      default: return '加油！';
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-pixel">
            游戏结束
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Medal and Grade */}
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce">
              {getMedalEmoji(result.grade)}
            </div>
            <div className={`text-6xl font-pixel ${getGradeColor(result.grade)} mb-2`}>
              {result.grade}
            </div>
            <div className="text-sm text-muted-foreground">
              {getEncouragementMessage(result.grade)}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <Card>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-pixel text-primary">
                      {result.score}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      最终得分
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-pixel text-primary">
                      {result.correctRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      正确率
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-lg font-pixel">最高连击</span>
                </div>
                <div className="text-3xl font-pixel text-primary">
                  {result.maxCombo}
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onPlayAgain}
              className="w-full text-lg py-3"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              再来一局
            </Button>
            <Button
              onClick={onBackToHome}
              variant="outline"
              className="w-full text-lg py-3"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              返回首页
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}