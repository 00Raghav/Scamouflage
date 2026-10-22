import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export function RiskMeter({ score, category, t }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Smooth count-up animation
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (score - start) * ease);
      setDisplayScore(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  // Color config based on score & category
  const getConfig = (val) => {
    if (val >= 75) {
      return {
        badgeText: t.riskCategories.veryHigh,
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/40',
        bgColor: 'bg-rose-500/10',
        glowColor: 'rgba(239, 68, 68, 0.35)',
        strokeColor: '#ef4444',
        icon: ShieldAlert,
        level: 'veryHigh'
      };
    } else if (val >= 50) {
      return {
        badgeText: t.riskCategories.high,
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500/40',
        bgColor: 'bg-orange-500/10',
        glowColor: 'rgba(249, 115, 22, 0.35)',
        strokeColor: '#f97316',
        icon: AlertTriangle,
        level: 'high'
      };
    } else if (val >= 25) {
      return {
        badgeText: t.riskCategories.moderate,
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/40',
        bgColor: 'bg-amber-500/10',
        glowColor: 'rgba(234, 179, 8, 0.35)',
        strokeColor: '#eab308',
        icon: AlertCircle,
        level: 'moderate'
      };
    } else {
      return {
        badgeText: t.riskCategories.low,
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/40',
        bgColor: 'bg-emerald-500/10',
        glowColor: 'rgba(16, 185, 129, 0.35)',
        strokeColor: '#10b981',
        icon: ShieldCheck,
        level: 'low'
      };
    }
  };

  const config = getConfig(score);
  const IconComponent = config.icon;

  // Semicircle gauge parameters
  // Radius = 85, arc length = PI * 85 ≈ 267.03
  const radius = 85;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // 267.035
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  
  // Angle for needle pointer (-90deg at 0 to +90deg at 100)
  const needleRotation = -90 + (displayScore / 100) * 180;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden h-full">
      {/* Background radial glow matching the risk color */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[70px] pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: config.glowColor }}
        aria-hidden="true"
      />

      <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-3 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t.riskAssessment}
        </span>
        {/* Category Badge */}
        <div 
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors duration-300 ${config.bgColor} ${config.textColor} ${config.borderColor}`}
          role="status"
          aria-label={`Risk category: ${config.badgeText}`}
        >
          <IconComponent className="w-3.5 h-3.5 shrink-0" />
          <span>{config.badgeText}</span>
        </div>
      </div>

      {/* SVG Semicircle Gauge */}
      <div className="relative w-64 h-36 my-2 flex items-end justify-center">
        <svg 
          viewBox="0 0 200 120" 
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="25%" stopColor="#eab308" />
              <stop offset="55%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 15 105 A 85 85 0 0 1 185 105"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Animated Arc */}
          <path
            d="M 15 105 A 85 85 0 0 1 185 105"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter="url(#gaugeGlow)"
            className="transition-all duration-300"
          />

          {/* Needle Pivot Indicator */}
          <g 
            transform={`translate(100, 105) rotate(${needleRotation})`} 
            className="transition-transform duration-300 ease-out origin-center"
          >
            {/* Needle Line */}
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="-78" 
              stroke="#f8fafc" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
            />
            {/* Needle center cap */}
            <circle cx="0" cy="0" r="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="3" fill="#38bdf8" />
          </g>
        </svg>

        {/* Numeric Score inside the gauge */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl sm:text-5xl font-black tracking-tight ${config.textColor}`}>
              {displayScore}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              / 100
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest -mt-1">
            {t.scoreOutOf}
          </span>
        </div>
      </div>

      {/* Scale Indicator labels */}
      <div className="w-full grid grid-cols-4 gap-1 text-[10px] text-slate-400 font-medium pt-3 border-t border-slate-800/60">
        <div className="flex flex-col items-center text-emerald-400/90">
          <span className="font-semibold">0 - 24</span>
          <span className="text-[9px] text-slate-400">Low</span>
        </div>
        <div className="flex flex-col items-center text-amber-400/90">
          <span className="font-semibold">25 - 49</span>
          <span className="text-[9px] text-slate-400">Moderate</span>
        </div>
        <div className="flex flex-col items-center text-orange-400/90">
          <span className="font-semibold">50 - 74</span>
          <span className="text-[9px] text-slate-400">High</span>
        </div>
        <div className="flex flex-col items-center text-rose-400/90">
          <span className="font-semibold">75 - 100</span>
          <span className="text-[9px] text-slate-400">Very High</span>
        </div>
      </div>
    </div>
  );
}
