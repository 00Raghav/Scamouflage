import React from 'react';
import { 
  Globe, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Link2, 
  HelpCircle,
  Database
} from 'lucide-react';

export function UrlCheckCard({ urlAnalysis, t }) {
  if (!urlAnalysis) return null;

  const { domain, lookalikeOf, isShortener, threatDbStatus } = urlAnalysis;

  const getThreatDbBadge = (status) => {
    if (status === 'flagged') {
      return {
        label: t.threatDbValues.flagged,
        color: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
        icon: ShieldAlert
      };
    } else if (status === 'not_flagged') {
      return {
        label: t.threatDbValues.not_flagged,
        color: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        icon: ShieldCheck
      };
    }
    return {
      label: t.threatDbValues.unavailable,
      color: 'bg-slate-700/50 text-slate-300 border-slate-600',
      icon: HelpCircle
    };
  };

  const threatBadge = getThreatDbBadge(threatDbStatus);
  const ThreatIcon = threatBadge.icon;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 text-left">
      <div className="border-b border-slate-800/80 pb-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span>{t.urlAnalysisTitle}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t.urlAnalysisSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        {/* Domain Card */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            {t.domainLabel}
          </span>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="font-mono text-xs sm:text-sm font-bold text-white break-all">
              {domain || 'Unknown Domain'}
            </span>
          </div>
        </div>

        {/* Lookalike Warning */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          lookalikeOf 
            ? 'bg-rose-500/10 border-rose-500/40' 
            : 'bg-slate-950/70 border-slate-800'
        }`}>
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertTriangle className={`w-3.5 h-3.5 ${lookalikeOf ? 'text-rose-400' : 'text-slate-400'}`} />
            {t.lookalikeLabel}
          </span>
          <div className="mt-2">
            {lookalikeOf ? (
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                Impersonating: {lookalikeOf}
              </span>
            ) : (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.noneDetected}
              </span>
            )}
          </div>
        </div>

        {/* Shortener Status */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Link2 className="w-3.5 h-3.5 text-indigo-400" />
            {t.shortenerLabel}
          </span>
          <div className="mt-2">
            {isShortener ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                <AlertTriangle className="w-3 h-3 text-orange-400" />
                {t.yes} — Destination Hidden
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-300">
                {t.no} (Direct URL)
              </span>
            )}
          </div>
        </div>

        {/* Threat Database Status */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            {t.threatDbLabel}
          </span>
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold border ${threatBadge.color}`}>
              <ThreatIcon className="w-3 h-3" />
              {threatBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Cautionary Note */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-200/90 leading-relaxed font-normal">
          {t.urlNotice}
        </p>
      </div>
    </div>
  );
}
