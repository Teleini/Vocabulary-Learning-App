import { useState, useEffect } from 'react';

type EffectType = 'correct' | 'wrong' | 'combo' | 'life-bonus';

interface Effect {
  id: string;
  type: EffectType;
  message?: string;
}

export const useGameEffects = () => {
  const [effects, setEffects] = useState<Effect[]>([]);

  const playEffect = (type: EffectType, message?: string) => {
    const effectId = Date.now().toString();
    const effect: Effect = { id: effectId, type, message };

    setEffects(prev => [...prev, effect]);

    // Play sound effect
    playSound(type);

    // Remove effect after animation
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== effectId));
    }, 1000);
  };

  const playSound = (type: EffectType) => {
    // Create simple beep sounds using Web Audio API
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      switch (type) {
        case 'correct':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
          break;
        case 'wrong':
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.2);
          break;
        case 'combo':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.05);
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
          break;
        case 'life-bonus':
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
          break;
      }

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  return {
    effects,
    playEffect,
  };
};

interface GameEffectsProps {
  effects: Effect[];
}

export function GameEffects({ effects }: GameEffectsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {effects.map((effect) => (
        <EffectComponent key={effect.id} effect={effect} />
      ))}
    </div>
  );
}

function EffectComponent({ effect }: { effect: Effect }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const getEffectStyles = () => {
    switch (effect.type) {
      case 'correct':
        return 'animate-pixel-flash bg-primary/30 text-primary';
      case 'wrong':
        return 'animate-shake bg-danger/30 text-danger';
      case 'combo':
        return 'animate-combo text-primary text-4xl';
      case 'life-bonus':
        return 'animate-bounce text-primary text-2xl';
      default:
        return '';
    }
  };

  const getEffectContent = () => {
    switch (effect.type) {
      case 'correct':
        return '✨ CORRECT!';
      case 'wrong':
        return '💥 WRONG!';
      case 'combo':
        return `🔥 COMBO x${effect.message || ''}!`;
      case 'life-bonus':
        return '❤️ +1 LIFE!';
      default:
        return '';
    }
  };

  return (
    <div className={`
      absolute inset-0 flex items-center justify-center
      font-pixel text-2xl font-bold
      ${getEffectStyles()}
    `}>
      <div className="pixel-border p-4">
        {getEffectContent()}
      </div>
    </div>
  );
}