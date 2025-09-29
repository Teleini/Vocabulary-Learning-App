import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Lightbulb, Volume2 } from 'lucide-react';
import { Question } from '@/types';
import { QuestionGenerator } from '@/lib/questionGenerator';

interface GameQuestionProps {
  question: Question;
  questionGenerator: QuestionGenerator;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  onUseHint: (hint: string) => void;
  canUseHint: boolean;
  currentHint: string;
  lives: number;
  score: number;
  combo: number;
  questionNumber: number;
  totalQuestions: number;
}

export default function GameQuestion({
  question,
  questionGenerator,
  onAnswer,
  onUseHint,
  canUseHint,
  currentHint,
  lives,
  score,
  combo,
  questionNumber,
  totalQuestions,
}: GameQuestionProps) {
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleAnswer = () => {
    let answer = '';
    if (question.type === 'spelling') {
      answer = userInput;
    } else {
      answer = selectedOption;
    }

    const isCorrect = questionGenerator.checkAnswer(question, answer);
    onAnswer(answer, isCorrect);

    setUserInput('');
    setSelectedOption('');
  };

  const handleHint = () => {
    if (canUseHint) {
      const hint = questionGenerator.getHint(question);
      onUseHint(hint);
    }
  };

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(question.word.headword);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'choice':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-pixel mb-2">选择正确释义</h2>
              <div className="text-4xl font-pixel text-primary mb-4">
                {question.word.headword}
              </div>
            </div>
            <div className="grid gap-2">
              {question.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedOption === option ? 'default' : 'outline'}
                  className="text-left justify-start h-auto p-4"
                  onClick={() => setSelectedOption(option)}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'spelling':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-pixel mb-2">拼写单词</h2>
              <div className="text-lg mb-4">
                {question.word.meaning}
              </div>
              {question.word.example && (
                <div className="text-sm text-muted-foreground italic">
                  例句：{question.word.example}
                </div>
              )}
            </div>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-4 text-center text-2xl font-pixel bg-surface border-2 border-primary rounded-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="输入英文单词..."
              autoFocus
            />
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-pixel mb-4">听音选词</h2>
              <Button
                onClick={playAudio}
                variant="outline"
                size="lg"
                className="mb-4"
              >
                <Volume2 className="w-6 h-6 mr-2" />
                播放发音
              </Button>
            </div>
            <div className="grid gap-2">
              {question.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedOption === option ? 'default' : 'outline'}
                  className="text-left justify-start h-auto p-4"
                  onClick={() => setSelectedOption(option)}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              ))}
            </div>
          </div>
        );
    }
  };

  const canAnswer = question.type === 'spelling' ? userInput.trim() !== '' : selectedOption !== '';

  return (
    <div className="game-container">
      <div className="max-w-2xl w-full space-y-6">
        {/* Game Stats */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${i < lives ? 'text-danger fill-current' : 'text-gray-600'}`}
              />
            ))}
          </div>
          <div className="text-lg font-pixel">
            SCORE: {score}
          </div>
          {combo > 0 && (
            <div className="text-lg font-pixel text-primary animate-pulse">
              COMBO x{combo}
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>题目进度</span>
            <span>{questionNumber + 1}/{totalQuestions}</span>
          </div>
          <Progress value={((questionNumber + 1) / totalQuestions) * 100} />
        </div>

        {/* Question Card */}
        <Card>
          <div className="p-6">
            {renderQuestionContent()}

            {/* Hint Display */}
            {currentHint && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary rounded-none">
                <div className="text-sm text-primary font-pixel">
                  💡 {currentHint}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleHint}
            variant="outline"
            disabled={!canUseHint}
            className="flex-1"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            提示 ({canUseHint ? '可用' : '已用完'})
          </Button>
          <Button
            onClick={handleAnswer}
            disabled={!canAnswer}
            size="lg"
            className="flex-2 text-xl"
          >
            确认答案
          </Button>
        </div>
      </div>
    </div>
  );
}