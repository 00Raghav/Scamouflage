import React, { useRef } from 'react';
import { 
  MessageSquare, 
  Briefcase, 
  Link as LinkIcon, 
  Search, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle,
  Landmark,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react';
import { SAMPLE_TEXTS } from '../data/mockData';

export function InputPanel({
  inputText,
  setInputText,
  inputType,
  setInputType,
  onAnalyze,
  isLoading,
  onSelectSample,
  t
}) {
  const textareaRef = useRef(null);

  const dynamicPlaceholders = {
    message: "Paste the suspicious message, SMS, WhatsApp chat, or email here...",
    job: "Paste the suspicious job offer, salary claim, employment email, or offer letter here...",
    url: "Paste the suspicious website link, URL, or shortened domain here (e.g. https://...)..."
  };

  const handleClear = () => {
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleTabChange = (type) => {
    setInputType(type);
    if (type === 'message') {
      setInputText(SAMPLE_TEXTS.message || SAMPLE_TEXTS.bank);
    } else if (type === 'job') {
      setInputText(SAMPLE_TEXTS.job);
    } else if (type === 'url') {
      setInputText(SAMPLE_TEXTS.url);
    }
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSampleClick = (key) => {
    onSelectSample(key);
    // Determine corresponding type
    if (key === 'job') setInputType('job');
    else if (key === 'url') setInputType('url');
    else setInputType('message');
  };

  return (
    <section className="relative w-full pt-8 pb-12">
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/10 via-cyan-500/10 to-indigo-600/10 blur-[100px] pointer-events-none rounded-full" 
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Hero Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-teal-300 mb-4 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Real-time Anti-Fraud Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 leading-tight">
          Unmask what's hiding in{' '}
          <span className="relative inline-block whitespace-nowrap">
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              plain sight.
            </span>
            <span 
              className="absolute left-0 -bottom-1 sm:-bottom-1.5 w-full h-[3px] sm:h-[4px] bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 rounded-full opacity-85 shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
              aria-hidden="true" 
            />
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          {t.subtitle}
        </p>

        {/* Input Panel Card */}
        <div className="glass-panel-elevated rounded-2xl p-4 sm:p-6 text-left relative overflow-hidden transition-all duration-300">
          {/* Scanning Animation Bar overlay when loading */}
          {isLoading && (
            <div className="absolute inset-0 z-30 bg-[#080d1a]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              {/* Radar / Scanner Visual */}
              <div className="relative w-20 h-20 mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-teal-500/30 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-cyan-400/50" />
                <div className="absolute inset-0 rounded-full border border-teal-400 animate-radar origin-center bg-gradient-to-tr from-teal-500/20 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-teal-300 animate-pulse" />
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                {t.scanningText}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                {t.scanningSubtext}
              </p>

              {/* Laser scan line effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scanline" />
            </div>
          )}

          {/* Type Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
            <div 
              className="inline-flex p-1 rounded-xl bg-slate-950/70 border border-slate-800/90 text-xs sm:text-sm font-medium"
              role="tablist"
              aria-label="Input type selector"
            >
              <button
                type="button"
                role="tab"
                aria-selected={inputType === 'message'}
                onClick={() => handleTabChange('message')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-150 ${
                  inputType === 'message'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t.tabs.message}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={inputType === 'job'}
                onClick={() => handleTabChange('job')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-150 ${
                  inputType === 'job'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{t.tabs.job}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={inputType === 'url'}
                onClick={() => handleTabChange('url')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-150 ${
                  inputType === 'url'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>{t.tabs.url}</span>
              </button>
            </div>

            {/* Clear Button */}
            {inputText && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-800/60"
                aria-label="Clear text input"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.clearBtn}</span>
              </button>
            )}
          </div>

          {/* Textarea Area */}
          <div className="relative mb-3">
            <textarea
              ref={textareaRef}
              id="scam-input-field"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={dynamicPlaceholders[inputType] || t.textareaPlaceholder}
              rows={5}
              aria-label="Paste suspicious message, job offer, or link"
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-3.5 sm:p-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all font-mono text-xs sm:text-sm resize-y leading-relaxed"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1 px-1">
              <span>{inputText.length} {t.characterCount}</span>
              <span className="text-slate-400">Ctrl + Enter to analyze</span>
            </div>
          </div>

          {/* Action Row: Analyze Button & Samples */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-slate-800/80">
            {/* Sample Buttons */}
            <div className="flex-1">
              <span className="block text-xs font-medium text-slate-400 mb-2">
                {t.samplePillsLabel}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSampleClick('job')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <Briefcase className="w-3 h-3 text-amber-400" />
                  <span>{t.samples.job}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSampleClick('bank')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-rose-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <Landmark className="w-3 h-3 text-rose-400" />
                  <span>{t.samples.bank}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSampleClick('url')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-orange-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <LinkIcon className="w-3 h-3 text-orange-400" />
                  <span>{t.samples.url}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSampleClick('genuine')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{t.samples.genuine}</span>
                </button>
              </div>
            </div>

            {/* Analyze Button */}
            <div className="sm:self-end">
              <button
                type="button"
                id="analyze-submit-button"
                onClick={onAnalyze}
                disabled={isLoading || !inputText.trim()}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 shadow-lg ${
                  !inputText.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>{t.analyzeBtn}</span>
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{t.noStorageNotice}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
