import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Ban, 
  Globe, 
  PhoneCall, 
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export function ActionsChecklist({
  recommendedActions = [],
  language = 'en',
  t
}) {
  // Track checked states by index
  const [checkedItems, setCheckedItems] = useState({});

  if (!recommendedActions || recommendedActions.length === 0) return null;

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = recommendedActions.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  // Icon mapping helper based on action content
  const getActionIcon = (text = '', idx) => {
    const lower = text.toLowerCase();
    if (lower.includes('money') || lower.includes('transfer') || lower.includes('upi') || lower.includes('paisa')) {
      return Ban;
    } else if (lower.includes('website') || lower.includes('search') || lower.includes('portal') || lower.includes('link')) {
      return Globe;
    } else if (lower.includes('call') || lower.includes('1930') || lower.includes('helpline') || lower.includes('complaint') || lower.includes('report')) {
      return PhoneCall;
    } else if (lower.includes('block') || lower.includes('spam')) {
      return AlertOctagon;
    }
    return ShieldCheck;
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span>{t.whatToDoTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.whatToDoSubtitle}
          </p>
        </div>

        {/* Progress tracker pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 self-start sm:self-auto">
          <span>{completedCount} / {totalCount} {t.completedText}</span>
          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {allCompleted && (
        <div className="mb-4 p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center gap-2.5 text-xs text-teal-300 font-semibold animate-in fade-in">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{t.allDone}</span>
        </div>
      )}

      <div className="space-y-2.5">
        {recommendedActions.map((action, idx) => {
          const actionText = action?.[language] || action?.en || '';
          const isChecked = !!checkedItems[idx];
          const IconComponent = getActionIcon(actionText, idx);

          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                isChecked
                  ? 'bg-slate-950/40 border-teal-500/30 opacity-75'
                  : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              {/* Checkbox Icon */}
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-teal-400 focus:outline-none shrink-0"
                aria-label={`Toggle action item: ${actionText}`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-teal-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {/* Action Text with Context Icon */}
              <div className="flex-1 flex items-start gap-2">
                <IconComponent className={`w-4 h-4 mt-0.5 shrink-0 ${isChecked ? 'text-teal-500' : 'text-cyan-400'}`} />
                <span className={`text-xs sm:text-sm leading-relaxed ${
                  isChecked 
                    ? 'line-through text-slate-400' 
                    : 'text-slate-200 font-medium'
                }`}>
                  {actionText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
