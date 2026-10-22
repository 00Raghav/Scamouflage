import React, { useState } from 'react';
import { AlertCircle, HelpCircle, ArrowDown } from 'lucide-react';

export function HighlightedMessage({
  originalText,
  flaggedPhrases = [],
  language = 'en',
  onSelectPhrase,
  activePhraseIndex,
  t
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [pinnedIndex, setPinnedIndex] = useState(null);

  if (!originalText) return null;

  // If there are no flagged phrases, show the clean text
  if (!flaggedPhrases || flaggedPhrases.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <span>{t.highlightedTitle}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">{t.highlightedSubtitle}</p>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 font-mono text-sm leading-relaxed">
          {originalText}
        </div>
        <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          {t.noFlagsClean}
        </p>
      </div>
    );
  }

  // Find all phrase occurrences in text
  const matches = [];
  flaggedPhrases.forEach((phrase, idx) => {
    if (!phrase.text) return;
    const searchText = phrase.text.trim();
    if (!searchText) return;

    // Search case-insensitively
    let pos = 0;
    const lowerOrig = originalText.toLowerCase();
    const lowerSearch = searchText.toLowerCase();
    
    const foundAt = lowerOrig.indexOf(lowerSearch, pos);
    if (foundAt !== -1) {
      matches.push({
        start: foundAt,
        end: foundAt + searchText.length,
        phrase,
        originalSnippet: originalText.substring(foundAt, foundAt + searchText.length),
        index: idx
      });
    }
  });

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);

  // Filter overlapping matches
  const nonOverlapping = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.end;
    }
  }

  // Slice text into segments
  const segments = [];
  let cursor = 0;
  nonOverlapping.forEach((match) => {
    if (match.start > cursor) {
      segments.push({
        type: 'text',
        content: originalText.substring(cursor, match.start)
      });
    }
    segments.push({
      type: 'highlight',
      content: match.originalSnippet,
      phrase: match.phrase,
      index: match.index
    });
    cursor = match.end;
  });

  if (cursor < originalText.length) {
    segments.push({
      type: 'text',
      content: originalText.substring(cursor)
    });
  }

  // Severity style helper
  const getSeverityStyle = (severity, isActive) => {
    const s = severity?.toLowerCase();
    if (s === 'high') {
      return {
        bg: isActive ? 'bg-rose-500/35 ring-2 ring-rose-400' : 'bg-rose-500/20 hover:bg-rose-500/30',
        border: 'border-b-2 border-rose-500',
        text: 'text-rose-200',
        badge: 'bg-rose-500 text-white',
        tagText: 'High'
      };
    } else if (s === 'medium') {
      return {
        bg: isActive ? 'bg-orange-500/35 ring-2 ring-orange-400' : 'bg-orange-500/20 hover:bg-orange-500/30',
        border: 'border-b-2 border-orange-500',
        text: 'text-orange-200',
        badge: 'bg-orange-500 text-white',
        tagText: 'Medium'
      };
    } else {
      return {
        bg: isActive ? 'bg-yellow-500/35 ring-2 ring-yellow-400' : 'bg-yellow-500/20 hover:bg-yellow-500/30',
        border: 'border-b-2 border-yellow-500',
        text: 'text-yellow-200',
        badge: 'bg-yellow-500 text-slate-950 font-bold',
        tagText: 'Low'
      };
    }
  };

  const handleHighlightClick = (idx) => {
    const nextIndex = pinnedIndex === idx ? null : idx;
    setPinnedIndex(nextIndex);
    if (onSelectPhrase) {
      onSelectPhrase(idx);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>{t.highlightedTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.highlightedSubtitle}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-[11px] font-semibold">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            High
          </span>
          <span className="flex items-center gap-1 text-orange-400">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            Medium
          </span>
          <span className="flex items-center gap-1 text-yellow-400">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            Low
          </span>
        </div>
      </div>

      {/* Message Rendering Container */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800/90 font-mono text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap select-text">
        {segments.map((seg, i) => {
          if (seg.type === 'text') {
            return <span key={i}>{seg.content}</span>;
          }

          const style = getSeverityStyle(seg.phrase.severity, activePhraseIndex === seg.index || pinnedIndex === seg.index);
          const isInteracted = hoveredIndex === seg.index || pinnedIndex === seg.index || activePhraseIndex === seg.index;
          const reasonText = typeof seg.phrase.reason === 'string' 
            ? seg.phrase.reason 
            : (seg.phrase.reason?.en || '');

          return (
            <span key={i} className="relative inline-block my-0.5">
              <button
                type="button"
                onClick={() => handleHighlightClick(seg.index)}
                onMouseEnter={() => setHoveredIndex(seg.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(seg.index)}
                onBlur={() => setHoveredIndex(null)}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition-all duration-200 text-left font-mono font-medium ${style.bg} ${style.border} ${style.text}`}
                aria-label={`Flagged phrase ${seg.index + 1}: ${seg.content}. Severity: ${style.tagText}. Reason: ${reasonText}`}
              >
                {/* Numbered marker badge */}
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold shrink-0 ${style.badge}`}>
                  {seg.index + 1}
                </span>
                <span>{seg.content}</span>
              </button>

              {/* Accessible Interactive Popover / Tooltip */}
              {isInteracted && (
                <div 
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 sm:w-80 p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 text-xs font-sans pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95"
                  role="tooltip"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
                    <span className="font-bold flex items-center gap-1.5 text-white">
                      <span className={`w-2 h-2 rounded-full ${style.badge}`} />
                      Marker [{seg.index + 1}] — {style.tagText} Risk
                    </span>
                    <span className="text-[10px] text-teal-400 font-semibold flex items-center gap-0.5">
                      <ArrowDown className="w-3 h-3" />
                      Tap to focus
                    </span>
                  </div>
                  <p className="text-slate-300 font-normal leading-relaxed">
                    {reasonText}
                  </p>
                  {/* Tooltip caret */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-700" />
                </div>
              )}
            </span>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
        <HelpCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span>{t.clickMarkerTip}</span>
      </p>
    </div>
  );
}
