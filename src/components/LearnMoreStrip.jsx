import React from 'react';
import { KeyRound, Briefcase, Link2, Lightbulb } from 'lucide-react';

export function LearnMoreStrip({ t }) {
  const tipIcons = [KeyRound, Briefcase, Link2];

  return (
    <section className="w-full py-8 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-teal-400" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
            {t.learnMoreTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.tips.map((tip, idx) => {
            const IconComponent = tipIcons[idx] || Lightbulb;
            return (
              <div 
                key={idx} 
                className="glass-panel rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-teal-500/30 transition-all duration-200 group"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-4 h-4 text-teal-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
