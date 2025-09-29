import { Word, Progress } from '@/types';

const DB_NAME = 'FunWordsDB';
const DB_VERSION = 1;

export class DatabaseService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('words')) {
          const wordsStore = db.createObjectStore('words', { keyPath: 'id' });
          wordsStore.createIndex('headword', 'headword', { unique: true });
        }

        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'wordId' });
        }

        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      };
    });
  }

  async initializeWords(words: Word[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['words'], 'readwrite');
    const store = transaction.objectStore('words');

    const promises = words.map(word =>
      new Promise<void>((resolve, reject) => {
        const request = store.put(word);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      })
    );

    await Promise.all(promises);
  }

  async getAllWords(): Promise<Word[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['words'], 'readonly');
      const store = transaction.objectStore('words');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getRandomWords(count: number): Promise<Word[]> {
    const allWords = await this.getAllWords();
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  async getProgress(wordId: number): Promise<Progress | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['progress'], 'readonly');
      const store = transaction.objectStore('progress');
      const request = store.get(wordId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async updateProgress(wordId: number, correct: boolean): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const currentProgress = await this.getProgress(wordId);

    const newProgress: Progress = {
      wordId,
      correct: currentProgress ? currentProgress.correct + (correct ? 1 : 0) : (correct ? 1 : 0),
      wrong: currentProgress ? currentProgress.wrong + (correct ? 0 : 1) : (correct ? 0 : 1),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['progress'], 'readwrite');
      const store = transaction.objectStore('progress');
      const request = store.put(newProgress);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getHighScore(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['meta'], 'readonly');
      const store = transaction.objectStore('meta');
      const request = store.get('highScore');

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : 0);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateHighScore(score: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const currentHighScore = await this.getHighScore();
    if (score <= currentHighScore) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['meta'], 'readwrite');
      const store = transaction.objectStore('meta');
      const request = store.put({ key: 'highScore', value: score });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new DatabaseService();