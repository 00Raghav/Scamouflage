import React, { useEffect, useRef } from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export function ExplanationList({
  flaggedPhrases = [],
  language = 'en',
  activePhraseIndex,
  onSelectPhrase,
  t
}) {
  const cardRefs = useRef([]);

  // Auto-scroll to selected card when clicked from HighlightedMessage
  useEffect(() => {
    if (activePhraseIndex !== null && cardRefs.current[activePhraseIndex]) {
      cardRefs.current[activePhraseIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activePhraseIndex]);

  if (!flaggedPhrases || flaggedPhrases.length === 0) {
    return null;
  }

  const getSeverityBadge = (severity) => {
    const s = severity?.toLowerCase();
    if (s === 'high') {
      return {
        label: t.severityLabels.high,
        bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
        markerBg: 'bg-rose-500 text-white',
        borderHighlight: 'border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
        icon: AlertTriangle
      };
    } else if (s === 'medium') {
      return {
        label: t.severityLabels.medium,
        bg: 'bg-orange-500/15 border-orange-500/40 text-orange-300',
        markerBg: 'bg-orange-500 text-white',
        borderHighlight: 'border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.15)]',
        icon: AlertCircle
      };
    } else {
      return {
        label: t.severityLabels.low,
        bg: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300',
        markerBg: 'bg-yellow-500 text-slate-950 font-bold',
        borderHighlight: 'border-yellow-500/60 shadow-[0_0_15px_rgba(234,179,8,0.15)]',
        icon: Info
      };
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 text-left">
      <div className="border-b border-slate-800/80 pb-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>{t.whySuspiciousTitle}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t.whySuspiciousSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {flaggedPhrases.map((phrase, idx) => {
          const config = getSeverityBadge(phrase.severity);
          const IconComponent = config.icon;
          const isActive = activePhraseIndex === idx;
          const explanation = typeof phrase.reason === 'string' 
            ? phrase.reason 
            : (phrase.reason?.en || '');

          return (
            <div
              key={idx}
              id={`explanation-card-${idx}`}
              ref={(el) => (cardRefs.current[idx] = el)}
              onClick={() => onSelectPhrase && onSelectPhrase(idx)}
              className={`rounded-xl p-4 transition-all duration-300 border cursor-pointer ${
                isActive
                  ? `bg-slate-900/90 ${config.borderHighlight} ring-1 ring-teal-400/50 scale-[1.01]`
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                {/* Numbered marker + Flagged Phrase Quote */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0 ${config.markerBg}`}>
                    {idx + 1}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 break-words">
                    "{phrase.text}"
                  </span>
                </div>

                {/* Severity Badge */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${config.bg}`}>
                  <IconComponent className="w-3.5 h-3.5 shrink-0" />
                  <span>{config.label}</span>
                </div>
              </div>

              {/* Explanation in Selected Language */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pl-7">
                {explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
