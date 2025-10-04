
import React from 'react';
import { ShieldIcon } from './icons/ShieldIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
        <div className="flex items-center gap-3">
          <ShieldIcon className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            ShieldNet <span className="text-blue-500">VPN</span>
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  );
};
