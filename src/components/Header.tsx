import React from 'react';
import { ShieldCheck, Sparkles, FileText, Globe, Zap, Sun, Moon, Leaf, Box, Flame, Package } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSelectPreset: (presetKey: 'mango' | 'paneer' | 'spices' | 'strawberries') => void;
  onOpenDossier: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onSelectPreset,
  onOpenDossier,
  isDark,
  onToggleTheme,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-[60] w-full transition-colors duration-300">
      <div className="backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-emerald-500/20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Badge */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10">
                <ShieldCheck className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:space-x-2">
                  <span className="whitespace-nowrap text-lg font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                    {t.appTitle}
                  </span>
                  <span className="whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 tracking-wide">
                    <Sparkles className="w-3 h-3 mr-1 text-emerald-500 flex-shrink-0" />
                    {t.sihBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block whitespace-nowrap">
                  {t.appSubtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Action Controls: Theme Switcher, Language & Dossier */}
          <div className="flex items-center space-x-3 self-end md:self-auto flex-shrink-0">
            {/* Light / Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Trilingual Toggle */}
            <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded-md transition-all font-semibold ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded-md transition-all font-semibold ${
                  language === 'hi'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('ta')}
                className={`px-2 py-0.5 rounded-md transition-all font-semibold ${
                  language === 'ta'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Dossier Report Button */}
            <button
              id="open-dossier-btn"
              onClick={onOpenDossier}
              className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20"
            >
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">{t.downloadDossier}</span>
              <span className="sm:hidden whitespace-nowrap">Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Demo Presets Bar */}
      <div className="bg-slate-50/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex-1 min-w-0 flex items-center overflow-x-auto gap-2 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center whitespace-nowrap mr-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 mr-1" />
              <span className="hidden lg:inline">{t.presetsTitle}:</span>
            </span>
            <button
              id="preset-mango-btn"
              onClick={() => onSelectPreset('mango')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 dark:bg-slate-950 dark:hover:bg-emerald-950/40 dark:text-slate-300 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 transition-all flex items-center whitespace-nowrap shadow-sm"
            >
              <span className="mr-1.5 text-sm">🥭</span> {t.presetMango}
            </button>
            <button
              id="preset-paneer-btn"
              onClick={() => onSelectPreset('paneer')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 dark:bg-slate-950 dark:hover:bg-emerald-950/40 dark:text-slate-300 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 transition-all flex items-center whitespace-nowrap shadow-sm"
            >
              <span className="mr-1.5 text-sm">🧀</span> {t.presetPaneer}
            </button>
            <button
              id="preset-spices-btn"
              onClick={() => onSelectPreset('spices')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 dark:bg-slate-950 dark:hover:bg-emerald-950/40 dark:text-slate-300 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 transition-all flex items-center whitespace-nowrap shadow-sm"
            >
              <span className="mr-1.5 text-sm">🌿</span> {t.presetSpices}
            </button>
            <button
              id="preset-strawberries-btn"
              onClick={() => onSelectPreset('strawberries')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 dark:bg-slate-950 dark:hover:bg-emerald-950/40 dark:text-slate-300 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 transition-all flex items-center whitespace-nowrap shadow-sm"
            >
              <span className="mr-1.5 text-sm">🍓</span> {t.presetStrawberries}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
