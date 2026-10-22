import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  Copy, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  FileText,
  Sparkles,
  ArrowUp
} from 'lucide-react';

import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { RiskMeter } from './components/RiskMeter';
import { HighlightedMessage } from './components/HighlightedMessage';
import { ExplanationList } from './components/ExplanationList';
import { ActionsChecklist } from './components/ActionsChecklist';
import { UrlCheckCard } from './components/UrlCheckCard';
import { ReportCard } from './components/ReportCard';
import { LearnMoreStrip } from './components/LearnMoreStrip';
import { Footer } from './components/Footer';

import { t } from './data/translations';
import { SAMPLE_TEXTS } from './data/mockData';
import { analyzeContent } from './services/analyzer';

export default function App() {
  const [inputText, setInputText] = useState(SAMPLE_TEXTS.job);
  const [inputType, setInputType] = useState('job'); // 'message' | 'job' | 'url'
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzedText, setAnalyzedText] = useState('');
  const [activePhraseIndex, setActivePhraseIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const resultsRef = useRef(null);

  // Sample selector
  const handleSelectSample = (sampleKey) => {
    const text = SAMPLE_TEXTS[sampleKey] || '';
    setInputText(text);
    setError(null);
  };

  // Main Analysis Trigger
  const handleAnalyze = async () => {
    if (!inputText || !inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setActivePhraseIndex(null);

    try {
      const result = await analyzeContent(inputText, inputType);
      setAnalysisResult(result);
      setAnalyzedText(inputText);

      // Trigger celebratory confetti if clean/genuine message analyzed
      if (result.riskScore < 25) {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#10b981', '#34d399', '#38bdf8', '#a7f3d0']
        });
      }

      // Smooth scroll to results
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error(err);
      setError(err.message || t.errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to analyze another
  const handleAnalyzeAnother = () => {
    setInputText('');
    setAnalysisResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const textarea = document.getElementById('scam-input-field');
    if (textarea) textarea.focus();
  };

  // Copy full analysis report to clipboard
  const handleCopyReport = () => {
    if (!analysisResult) return;

    const summaryText = typeof analysisResult.summary === 'string'
      ? analysisResult.summary
      : (analysisResult.summary?.en || '');

    const flaggedList = (analysisResult.flaggedPhrases || [])
      .map((p, i) => {
        const reason = typeof p.reason === 'string' ? p.reason : (p.reason?.en || '');
        return `[${i + 1}] "${p.text}" (${p.severity.toUpperCase()}): ${reason}`;
      })
      .join('\n');

    const actionsList = (analysisResult.recommendedActions || [])
      .map((a, i) => {
        const actionText = typeof a === 'string' ? a : (a?.en || '');
        return `${i + 1}. ${actionText}`;
      })
      .join('\n');

    const report = `--- SCAMOUFLAGE ANALYSIS REPORT ---
Risk Score: ${analysisResult.riskScore} / 100 (${analysisResult.riskCategory} Risk)
Analyzed Text: "${analyzedText}"

SUMMARY:
${summaryText}

FLAGGED SIGNALS:
${flaggedList || 'None detected (clean content)'}

RECOMMENDED ACTIONS:
${actionsList}

${analysisResult.urlAnalysis ? `URL INSPECTION:
Domain: ${analysisResult.urlAnalysis.domain}
Lookalike: ${analysisResult.urlAnalysis.lookalikeOf || 'None'}
Shortener: ${analysisResult.urlAnalysis.isShortener ? 'Yes' : 'No'}
Threat DB: ${analysisResult.urlAnalysis.threatDbStatus}` : ''}

Emergency Helpline: Dial 1930 | National Portal: cybercrime.gov.in
Scamouflage: Unmask what's hiding in plain sight.`;

    navigator.clipboard.writeText(report);
    setToastMessage(t.reportCopied);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const currentSummary = analysisResult
    ? (typeof analysisResult.summary === 'string' ? analysisResult.summary : (analysisResult.summary?.en || ''))
    : '';

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 cyber-grid">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 right-6 z-50 py-2.5 px-4 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4"
          role="status"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header */}
      <Header t={t} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4">
        {/* 2. Hero & Input Section */}
        <InputPanel
          inputText={inputText}
          setInputText={setInputText}
          inputType={inputType}
          setInputType={setInputType}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          onSelectSample={handleSelectSample}
          t={t}
        />

        {/* Error State */}
        {error && (
          <div className="my-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <h2 className="text-sm font-bold text-white">{t.errorTitle}</h2>
                <p className="text-xs text-rose-300">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAnalyze}
              className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors shrink-0"
            >
              {t.retryBtn}
            </button>
          </div>
        )}

        {/* 3. Results Section */}
        {analysisResult && (
          <section 
            ref={resultsRef} 
            className="mt-6 mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500"
            aria-label="Analysis Results"
          >
            {/* Results Header with Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                    {t.resultsTitle}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {t.riskAssessment}
                </h2>
              </div>

              {/* Action Buttons: Analyze Another & Copy Report */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleAnalyzeAnother}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.analyzeAnother}</span>
                </button>

                <button
                  type="button"
                  id="copy-report-button"
                  onClick={handleCopyReport}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyReport}</span>
                </button>
              </div>
            </div>

            {/* Score & Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Semicircular Risk Meter (Col 1-5) */}
              <div className="md:col-span-5 flex flex-col">
                <RiskMeter 
                  score={analysisResult.riskScore} 
                  category={analysisResult.riskCategory} 
                  t={t} 
                />
              </div>

              {/* Executive Summary Card (Col 6-12) */}
              <div className="md:col-span-7 flex flex-col">
                <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-teal-400" />
                        {t.summaryTitle}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Confidence: 96%
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                      {currentSummary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      {analysisResult.flaggedPhrases?.length || 0} indicators flagged
                    </span>
                    <span className="text-slate-500">
                      Scamouflage Neural Core v2.4
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Suspicious Phrases Highlighted */}
            <HighlightedMessage
              originalText={analyzedText}
              flaggedPhrases={analysisResult.flaggedPhrases}
              onSelectPhrase={(idx) => setActivePhraseIndex(idx)}
              activePhraseIndex={activePhraseIndex}
              t={t}
            />

            {/* Why This Looks Suspicious Breakdown */}
            <ExplanationList
              flaggedPhrases={analysisResult.flaggedPhrases}
              activePhraseIndex={activePhraseIndex}
              onSelectPhrase={(idx) => setActivePhraseIndex(idx)}
              t={t}
            />

            {/* What You Should Do Checklist */}
            <ActionsChecklist
              recommendedActions={analysisResult.recommendedActions}
              t={t}
            />

            {/* Link Check Card (if URL detected or provided) */}
            {analysisResult.urlAnalysis && (
              <UrlCheckCard 
                urlAnalysis={analysisResult.urlAnalysis} 
                t={t} 
              />
            )}

            {/* Official Report Card (for High / Very High risk) */}
            <ReportCard
              riskCategory={analysisResult.riskCategory}
              riskScore={analysisResult.riskScore}
              t={t}
            />

            {/* Bottom Floating Bar to Return to Input or Copy */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 hover:border-teal-400 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ArrowUp className="w-3.5 h-3.5 text-teal-400" />
                <span>Scroll to Top</span>
              </button>
            </div>
          </section>
        )}

        {/* 4. Learn More Tips Strip */}
        <LearnMoreStrip t={t} />
      </main>

      {/* 5. Footer */}
      <Footer t={t} />
    </div>
  );
}
