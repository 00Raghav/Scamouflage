import React from 'react';
import { ShieldAlert, Languages, Sparkles } from 'lucide-react';

export function Header({ language, onToggleLanguage, t }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080d1a]/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-indigo-500/20 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)] group">
            {/* Magnifier + Mask / Shield SVG */}
            <svg 
              className="w-6 h-6 text-teal-400 transition-transform duration-300 group-hover:scale-110" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Magnifier rim */}
              <circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" />
              <path d="M21 21l-5.2-5.2" stroke="currentColor" strokeWidth="2.5" />
              {/* Inner disguise mask eye slits inside magnifier */}
              <path d="M7.5 9.5a1 1 0 0 1 1-1h.01a1 1 0 0 1 1 1" stroke="#38bdf8" strokeWidth="2" />
              <path d="M12 9.5a1 1 0 0 1 1-1h.01a1 1 0 0 1 1 1" stroke="#38bdf8" strokeWidth="2" />
              <path d="M8 12.5c.8.8 2.2.8 3 0" stroke="#38bdf8" strokeWidth="1.5" />
            </svg>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                Scamouflage
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                <Sparkles className="w-3 h-3 text-teal-400" />
                AI Shield v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right controls: Language Toggle */}
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-full p-1 shadow-inner"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => onToggleLanguage('en')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                language === 'en'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-pressed={language === 'en'}
            >
              <span>English</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleLanguage('hi')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                language === 'hi'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-pressed={language === 'hi'}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Hinglish</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
