import { Question, Word } from '@/types';

export class QuestionGenerator {
  private words: Word[] = [];

  constructor(words: Word[]) {
    this.words = words;
  }

  generateQuestions(count: number = 10): Question[] {
    const questions: Question[] = [];
    const usedWords = new Set<number>();

    for (let i = 0; i < count; i++) {
      const questionType = this.getRandomQuestionType();
      let word: Word;

      do {
        word = this.getRandomWord();
      } while (usedWords.has(word.id) && usedWords.size < this.words.length);

      usedWords.add(word.id);

      const question = this.createQuestion(questionType, word);
      questions.push(question);
    }

    return questions;
  }

  private getRandomQuestionType(): Question['type'] {
    const types: Question['type'][] = ['choice', 'spelling', 'audio'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomWord(): Word {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }

  private createQuestion(type: Question['type'], word: Word): Question {
    switch (type) {
      case 'choice':
        return this.createChoiceQuestion(word);
      case 'spelling':
        return this.createSpellingQuestion(word);
      case 'audio':
        return this.createAudioQuestion(word);
      default:
        return this.createChoiceQuestion(word);
    }
  }

  private createChoiceQuestion(word: Word): Question {
    const wrongOptions = this.getRandomWords(3, [word.id]);
    const options = [...wrongOptions.map(w => w.meaning), word.meaning];

    this.shuffleArray(options);

    return {
      type: 'choice',
      word,
      options,
      correctAnswer: word.meaning,
    };
  }

  private createSpellingQuestion(word: Word): Question {
    return {
      type: 'spelling',
      word,
      correctAnswer: word.headword.toLowerCase(),
    };
  }

  private createAudioQuestion(word: Word): Question {
    const wrongOptions = this.getRandomWords(3, [word.id]);
    const options = [...wrongOptions.map(w => w.headword), word.headword];

    this.shuffleArray(options);

    return {
      type: 'audio',
      word,
      options,
      correctAnswer: word.headword,
    };
  }

  private getRandomWords(count: number, excludeIds: number[] = []): Word[] {
    const availableWords = this.words.filter(w => !excludeIds.includes(w.id));
    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  getHint(question: Question): string {
    switch (question.type) {
      case 'choice':
        return `提示：单词以 "${question.word.headword[0].toUpperCase()}" 开头`;
      case 'spelling':
        const word = question.word.headword;
        const hintLength = Math.max(2, Math.floor(word.length / 3));
        return `提示：${word.substring(0, hintLength)}${'_'.repeat(word.length - hintLength)}`;
      case 'audio':
        return `提示：单词含义是 "${question.word.meaning.split('；')[0]}"`;
      default:
        return '暂无提示';
    }
  }

  checkAnswer(question: Question, userAnswer: string): boolean {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const correctAnswer = question.correctAnswer.toLowerCase().trim();

    return normalizedAnswer === correctAnswer;
  }
}