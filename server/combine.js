import { detectSignals, computeBaselineScore } from './rules/ruleEngine.js';
import { analyzeUrl } from './rules/urlChecks.js';
import { checkSafeBrowsing } from './services/safeBrowsing.js';
import { callLlm } from './services/llm.js';

const TEMPLATE_REASONS = {
  advance_payment: {
    en: 'Legitimate employers, buyers, and government agencies never ask for advance registration, training, or deposit fees.'
  },
  otp_credentials: {
    en: 'Banks and official platforms never request OTP, UPI PIN, or CVV. Sharing this will lead to immediate unauthorized fund deductions.'
  },
  urgency_pressure: {
    en: 'Coercive urgency is designed to panic you into taking hasty actions without independent verification.'
  },
  threat_suspension: {
    en: 'Threats of account deactivation or legal penalty are psychological hooks to induce panic.'
  },
  unrealistic_rewards: {
    en: 'Unrealistic returns or unsolicited selection for high-paying positions without prior interviews indicate fraud.'
  },
  unofficial_channels: {
    en: 'Legitimate organizations do not conduct hiring or official business exclusively over Telegram, WhatsApp, or personal email.'
  },
  impersonation_hook: {
    en: 'Impersonating recognized financial institutions or courier services while demanding payments or urgent link clicks.'
  },
  prompt_injection: {
    en: 'Content contains prompt injection keywords attempting to manipulate safety scanning systems.'
  },
  brand_impersonation_domain: {
    en: 'Domain name spoofing detected mimicking an official brand to harvest credentials.'
  },
  typosquatting_domain: {
    en: 'Domain name closely mimics a trusted institution with minor spelling alterations.'
  },
  url_shortener: {
    en: 'URL shortener masks the real destination server, commonly used to conceal malicious phishing pages.'
  },
  suspicious_tld: {
    en: 'Disposable low-cost top-level domain frequently associated with automated scam infrastructure.'
  },
  excessive_hyphens: {
    en: 'Hostname contains multiple hyphens typical of phishing domains trying to look like trusted brands.'
  },
  deep_subdomain: {
    en: 'Deeply nested subdomains configured to deceive users into trusting an unauthorized domain.'
  }
};

const CYBERCRIME_ACTION = {
  en: 'Report fraudulent numbers and links to the national cybercrime helpline (1930) or file a complaint at cybercrime.gov.in.'
};

function getCategoryForScore(score) {
  if (score >= 75) return 'Very High';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Moderate';
  return 'Low';
}

function cleanPhrases(rawPhrases, content) {
  if (!Array.isArray(rawPhrases) || !content) return [];

  const lowerContent = content.toLowerCase();
  const matched = [];

  for (const p of rawPhrases) {
    if (!p || typeof p.text !== 'string') continue;
    const lowerPhrase = p.text.trim().toLowerCase();
    if (!lowerPhrase) continue;

    const startIdx = lowerContent.indexOf(lowerPhrase);
    if (startIdx !== -1) {
      const exactText = content.substring(startIdx, startIdx + lowerPhrase.length);
      matched.push({
        text: exactText,
        severity: p.severity || 'medium',
        reason: {
          en: p.reason?.en || 'Suspicious phrasing detected.'
        },
        start: startIdx,
        end: startIdx + lowerPhrase.length
      });
    }
  }

  // Sort by start position
  matched.sort((a, b) => a.start - b.start);

  // Remove overlapping
  const nonOverlapping = [];
  let lastEnd = -1;

  for (const m of matched) {
    if (m.start >= lastEnd) {
      nonOverlapping.push({
        text: m.text,
        severity: m.severity,
        reason: m.reason
      });
      lastEnd = m.end;
    }
  }

  return nonOverlapping.slice(0, 8);
}

export async function processAnalysis({ inputType, content }) {
  // 1. Run rule engine and URL checks first
  const ruleSignals = detectSignals(content);
  const urlCheck = analyzeUrl(content, inputType);

  if (urlCheck && Array.isArray(urlCheck.signals)) {
    ruleSignals.push(...urlCheck.signals);
  }

  const rulesBaseline = computeBaselineScore(ruleSignals);

  // 2. Run Google Safe Browsing in parallel if URL exists
  let safeBrowsingStatus = 'unavailable';
  if (urlCheck?.domain) {
    safeBrowsingStatus = await checkSafeBrowsing(urlCheck.domain);
  }

  // 3. Call LLM (with fallback on failure)
  let llmResult = null;
  let llmUnavailable = false;

  try {
    llmResult = await callLlm({
      inputType,
      content,
      ruleSignals: ruleSignals.map(s => ({
        id: s.id,
        label: s.label,
        matchedText: s.matchedText,
        severity: s.severity
      }))
    });
  } catch (err) {
    llmUnavailable = true;
  }

  // 4. Score Calculation
  let finalScore = rulesBaseline;

  if (llmResult && !llmUnavailable) {
    const rawDiff = llmResult.riskScore - rulesBaseline;
    const clampedDiff = Math.max(-20, Math.min(20, rawDiff));
    finalScore = Math.round(rulesBaseline + clampedDiff);
  }

  // If a threat database flagged the URL, raise score to at least 85
  if (safeBrowsingStatus === 'flagged') {
    finalScore = Math.max(85, finalScore);
  }

  // Clamp 0 - 100
  finalScore = Math.max(0, Math.min(100, finalScore));

  // 5. Fix riskCategory in code so it always strictly matches score
  let riskCategory = getCategoryForScore(finalScore);

  // 6. Summary generation (use LLM summary or rule-only fallback)
  let summary = { en: '' };

  if (llmResult?.summary?.en && !llmUnavailable) {
    summary = { en: llmResult.summary.en };
  } else {
    if (finalScore >= 75) {
      summary = {
        en: 'Critical risk detected. This content exhibits major scam indicators such as advance fee demands, credential phishing, or coercive threats.'
      };
    } else if (finalScore >= 50) {
      summary = {
        en: 'High scam probability detected. Multiple warning signs were identified. Exercise extreme caution and do not follow payment or verification links.'
      };
    } else if (finalScore >= 25) {
      summary = {
        en: 'Moderate risk observed. The message contains unverified claims or subtle urgency tactics that require independent verification.'
      };
    } else {
      summary = {
        en: 'Low risk. No prominent scam patterns or coercive tactics were detected in this content.'
      };
    }
  }

  // 7. Flagged Phrases Validation & Augmentation
  let candidatePhrases = [];

  if (llmResult?.flaggedPhrases && !llmUnavailable) {
    candidatePhrases = llmResult.flaggedPhrases;
  } else {
    // Generate phrases from ruleSignals
    candidatePhrases = ruleSignals.map(s => ({
      text: s.matchedText,
      severity: s.severity,
      reason: TEMPLATE_REASONS[s.id] || {
        en: s.label
      }
    }));
  }

  // Keep only phrases that appear exactly in original content
  let flaggedPhrases = cleanPhrases(candidatePhrases, content);

  // If LLM missed high-severity rule matches, add them
  const highSeverityRules = ruleSignals.filter(s => s.severity === 'high');
  for (const hRule of highSeverityRules) {
    if (!hRule.matchedText) continue;
    const lowerMatched = hRule.matchedText.toLowerCase();
    const alreadyCovered = flaggedPhrases.some(p => p.text.toLowerCase().includes(lowerMatched));
    if (!alreadyCovered) {
      const templateReason = TEMPLATE_REASONS[hRule.id] || {
        en: hRule.label
      };
      flaggedPhrases.push({
        text: hRule.matchedText,
        severity: 'high',
        reason: templateReason
      });
    }
  }

  // Re-clean and ensure sorted & capped at 8
  flaggedPhrases = cleanPhrases(flaggedPhrases, content);

  // 8. Recommended Actions
  let recommendedActions = [];

  if (llmResult?.recommendedActions && Array.isArray(llmResult.recommendedActions) && !llmUnavailable && llmResult.recommendedActions.length > 0) {
    recommendedActions = llmResult.recommendedActions.map(a => ({
      en: a.en || ''
    }));
  } else {
    // Fallback actions
    if (finalScore >= 50) {
      recommendedActions = [
        { en: 'Do NOT send any money, scan QR codes, or share OTP/passwords.' },
        { en: 'Verify the claims independently via official websites or authorized corporate customer care numbers.' },
        { en: 'Block the sender and report the number/message as spam.' }
      ];
    } else {
      recommendedActions = [
        { en: 'Safe to proceed, but always confirm sender identity if communication is unexpected.' },
        { en: 'Never share OTPs, passwords, or personal credentials over messages or calls.' }
      ];
    }
  }

  // 9. Cybercrime action rule:
  // Only include cybercrime helpline when category is High or Very High
  const isCybercrimeReportable = riskCategory === 'High' || riskCategory === 'Very High';

  // Remove any existing cybercrime actions from list first
  recommendedActions = recommendedActions.filter(a => {
    const text = (a.en).toLowerCase();
    return !text.includes('1930') && !text.includes('cybercrime.gov.in');
  });

  if (isCybercrimeReportable) {
    recommendedActions.push(CYBERCRIME_ACTION);
  }

  // 10. Overwrite urlAnalysis with computed values
  let urlAnalysis = null;
  if (urlCheck && urlCheck.domain) {
    urlAnalysis = {
      domain: urlCheck.domain,
      lookalikeOf: urlCheck.lookalikeOf || null,
      isShortener: Boolean(urlCheck.isShortener),
      threatDbStatus: safeBrowsingStatus
    };
  }

  const responsePayload = {
    riskScore: finalScore,
    riskCategory,
    summary,
    flaggedPhrases,
    recommendedActions,
    urlAnalysis
  };

  if (llmUnavailable) {
    responsePayload.llmUnavailable = true;
  }

  return responsePayload;
}
