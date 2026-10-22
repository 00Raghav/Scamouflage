import React, { useState } from 'react';
import { 
  PhoneCall, 
  ExternalLink, 
  ShieldAlert, 
  Copy, 
  Check, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export function ReportCard({ riskCategory, riskScore, t }) {
  // Only show for High and Very High risk (or score >= 50)
  const isHighRisk = riskCategory === 'High' || riskCategory === 'Very High' || riskScore >= 50;
  const [copiedHelpline, setCopiedHelpline] = useState(false);

  if (!isHighRisk) return null;

  const handleCopyHelpline = () => {
    navigator.clipboard.writeText('1930');
    setCopiedHelpline(true);
    setTimeout(() => setCopiedHelpline(false), 2000);
  };

  return (
    <div className="glass-panel-elevated rounded-2xl p-4 sm:p-6 text-left border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-slate-900/90 to-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/20 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>{t.reportTitle}</span>
            </h2>
          </div>
          <p className="text-xs text-rose-200/80 mt-0.5">
            {t.reportSubtitle}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 self-start sm:self-auto">
          Immediate Action Advised
        </span>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
        {/* Helpline 1930 Card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-teal-400" />
                {t.helplineTitle}
              </span>
              <span className="text-lg font-extrabold text-white tracking-wider font-mono">
                1930
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.helplineDesc}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <a
              href="tel:1930"
              className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.callNow}</span>
            </a>
            <button
              type="button"
              onClick={handleCopyHelpline}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
              aria-label="Copy helpline number"
            >
              {copiedHelpline ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyNumber}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cybercrime Portal Card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                {t.portalTitle}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Official MHA
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.portalDesc}
            </p>
          </div>

          <div className="mt-3">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <span>{t.visitPortal}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Evidence to Preserve */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.evidenceTitle}</span>
        </h3>
        <ul className="space-y-1.5">
          {t.evidenceList.map((item, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
              <span className="text-teal-400 font-bold shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
