import React from 'react';
import { ShieldCheck, AlertCircle, Heart } from 'lucide-react';

export function Footer({ t }) {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#060a14] py-8 text-center text-xs text-slate-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-4">
        {/* Safety Disclaimer Banner */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs flex items-start gap-2.5 max-w-2xl text-left">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.disclaimer}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-xs">
          <span className="flex items-center gap-1.5 text-teal-400">
            <ShieldCheck className="w-4 h-4" />
            {t.privacyBadge}
          </span>
          <span className="text-slate-600">•</span>
          <span>Helpline: <strong>1930</strong></span>
          <span className="text-slate-600">•</span>
          <a 
            href="https://cybercrime.gov.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-teal-300 underline"
          >
            cybercrime.gov.in
          </a>
        </div>

        <p className="text-[11px] text-slate-600 mt-1">
          {t.taglineBottom} Built for digital safety and consumer awareness.
        </p>
      </div>
    </footer>
  );
}
