import React, { useEffect, useState } from 'react';
import { BadgeDefinition } from '../types';

interface BadgeUnlockAnimationProps {
  badge: BadgeDefinition;
  onClose: () => void;
}

export const BadgeUnlockAnimation: React.FC<BadgeUnlockAnimationProps> = ({ badge, onClose }) => {
  const [stage, setStage] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('show'), 100);
    const t2 = setTimeout(() => setStage('exit'), 4000);
    const t3 = setTimeout(() => onClose(), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm transition-opacity duration-500 ${
        stage === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={onClose}
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              backgroundColor: ['#38bdf8', '#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981'][i % 6],
              animation: `confetti-fall ${2 + Math.random() * 2}s ease-in forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Badge Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full text-center transition-all duration-500 ${
          stage === 'enter' ? 'scale-0 opacity-0' : stage === 'show' ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-4">🎉 Badge Unlocked!</div>

        <div className={`w-20 h-20 mx-auto rounded-2xl ${badge.bgColor} border-2 ${badge.borderColor} flex items-center justify-center mb-4 animate-badge-glow`}>
          <span className="text-4xl animate-badge-unlock">{badge.icon}</span>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 font-outfit">{badge.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5 italic">{badge.hindiName}</p>
        <p className="text-xs text-slate-600 mt-2">{badge.description}</p>

        <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${badge.bgColor} ${badge.color} border ${badge.borderColor}`}>
          {badge.requirement}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
