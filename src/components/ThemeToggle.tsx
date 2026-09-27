import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const tooltipText = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={tooltipText}
      aria-label={tooltipText}
      className={`relative inline-flex items-center justify-center rounded-xl p-2 transition-all duration-200 cursor-pointer ${
        isDark
          ? 'bg-slate-800/80 text-amber-300 hover:bg-slate-700/80 border border-slate-700/60 shadow-inner'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200 shadow-xs'
      } ${className}`}
    >
      <div className="relative w-4.5 h-4.5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4.5 h-4.5 transition-transform duration-300 rotate-0 scale-100 text-sky-300 fill-sky-300/20" />
        ) : (
          <Sun className="w-4.5 h-4.5 transition-transform duration-300 rotate-0 scale-100 text-amber-500 fill-amber-400/20" />
        )}
      </div>
    </button>
  );
};
