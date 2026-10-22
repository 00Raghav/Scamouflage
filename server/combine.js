import { detectSignals, computeBaselineScore } from './rules/ruleEngine.js';
import { analyzeUrl } from './rules/urlChecks.js';
import { checkSafeBrowsing } from './services/safeBrowsing.js';
import { callLlm } from './services/llm.js';

const TEMPLATE_REASONS = {
  advance_payment: {
    en: 'Legitimate employers, buyers, and government agencies never ask for advance registration, training, or deposit fees.',
    hi: 'Asli company ya agency joining ya delivery se pehle kabhi bhi registration ya security deposit nahi maangti.'
  },
  otp_credentials: {
    en: 'Banks and official platforms never request OTP, UPI PIN, or CVV. Sharing this will lead to immediate unauthorized fund deductions.',
    hi: 'Bank ya official authority kabhi bhi aapse OTP ya UPI PIN nahi mangegi. Isse aapka account khali ho sakta hai.'
  },
  urgency_pressure: {
    en: 'Coercive urgency is designed to panic you into taking hasty actions without independent verification.',
    hi: 'Jaldbaazi create ki ja rahi hai taaki aap bina soche samjhe turant decision le lein.'
  },
  threat_suspension: {
    en: 'Threats of account deactivation or legal penalty are psychological hooks to induce panic.',
    hi: 'Account block ya police action ki fake dhamki dekar darane ka prayas kiya ja raha hai.'
  },
  unrealistic_rewards: {
    en: 'Unrealistic returns or unsolicited selection for high-paying positions without prior interviews indicate fraud.',
    hi: 'Bina kisi interview ya application ke badi salary ya lottery ka fake lalach diya gaya hai.'
  },
  unofficial_channels: {
    en: 'Legitimate organizations do not conduct hiring or official business exclusively over Telegram, WhatsApp, or personal email.',
    hi: 'Asli corporate companies WhatsApp ya Telegram par private chat ke zariye hiring ya banking nahi karti.'
  },
  impersonation_hook: {
    en: 'Impersonating recognized financial institutions or courier services while demanding payments or urgent link clicks.',
    hi: 'Bank ya courier service ke naam par fake call-to-action aur link click karwane ki koshish hai.'
  },
  prompt_injection: {
    en: 'Content contains prompt injection keywords attempting to manipulate safety scanning systems.',
    hi: 'Is content mein safety filters ko bypass karne ki koshish ke patterns mile hain.'
  },
  brand_impersonation_domain: {
    en: 'Domain name spoofing detected mimicking an official brand to harvest credentials.',
    hi: 'Yeh domain official brand ki nakal karke login details churane ke liye banaya gaya hai.'
  },
  typosquatting_domain: {
    en: 'Domain name closely mimics a trusted institution with minor spelling alterations.',
    hi: 'Asli website ki spelling thodi si badal kar fake phishing page banaya gaya hai.'
  },
  url_shortener: {
    en: 'URL shortener masks the real destination server, commonly used to conceal malicious phishing pages.',
    hi: 'URL shortener asli website ko chhupane ke liye use kiya gaya hai.'
  },
  suspicious_tld: {
    en: 'Disposable low-cost top-level domain frequently associated with automated scam infrastructure.',
    hi: 'Yeh low-cost domain aksar temporary fraud campaigns mein use hota hai.'
  },
  excessive_hyphens: {
    en: 'Hostname contains multiple hyphens typical of phishing domains trying to look like trusted brands.',
    hi: 'Domain mein bohot saare hyphens hain jo aksar fake websites mein dekhe jaate hain.'
  },
  deep_subdomain: {
    en: 'Deeply nested subdomains configured to deceive users into trusting an unauthorized domain.',
    hi: 'Deep subdomains use karke official website jaisa dikhane ki koshish ki gayi hai.'
  }
};

const CYBERCRIME_ACTION = {
  en: 'Report fraudulent numbers and links to the national cybercrime helpline (1930) or file a complaint at cybercrime.gov.in.',
  hi: 'Turant cybercrime helpline 1930 par call karein ya cybercrime.gov.in par formal complaint darj karein.'
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
          en: p.reason?.en || 'Suspicious phrasing detected.',
          hi: p.reason?.hi || 'Suspicious pattern detect hua hai.'
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
  let summary = { en: '', hi: '' };

  if (llmResult?.summary?.en && !llmUnavailable) {
    summary = {
      en: llmResult.summary.en,
      hi: llmResult.summary.hi || llmResult.summary.en
    };
  } else {
    // Built-in rule-only template summaries (Roman script Hinglish, no Devanagari)
    if (finalScore >= 75) {
      summary = {
        en: 'Critical risk detected. This content exhibits major scam indicators such as advance fee demands, credential phishing, or coercive threats.',
        hi: 'Is content mein fraud ke pakke sanket hain. Advance fee demand, KYC block ya credential chori ki koshish ki gayi hai.'
      };
    } else if (finalScore >= 50) {
      summary = {
        en: 'High scam probability detected. Multiple warning signs were identified. Exercise extreme caution and do not follow payment or verification links.',
        hi: 'Savdhaan rahein. Is message mein fraud hone ke bade sanket mile hain. Kisi bhi payment ya link par bharosa na karein.'
      };
    } else if (finalScore >= 25) {
      summary = {
        en: 'Moderate risk observed. The message contains unverified claims or subtle urgency tactics that require independent verification.',
        hi: 'Kuch baatein suspicious hain. Anjaan sender ki details official channel se verify karein.'
      };
    } else {
      summary = {
        en: 'Low risk. No prominent scam patterns or coercive tactics were detected in this content.',
        hi: 'Yeh message safe lag raha hai. Isme koi fraud pattern ya jaldbaazi ka dabav nahi mila.'
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
        en: s.label,
        hi: 'Is text mein suspicious fraud indicator mila hai.'
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
        en: hRule.label,
        hi: 'Is phrase mein high severity threat paya gaya hai.'
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
      en: a.en || '',
      hi: a.hi || a.en || ''
    }));
  } else {
    // Fallback actions
    if (finalScore >= 50) {
      recommendedActions = [
        {
          en: 'Do NOT send any money, scan QR codes, or share OTP/passwords.',
          hi: 'Koi bhi payment na karein, QR scan na karein aur OTP ya PIN share na karein.'
        },
        {
          en: 'Verify the claims independently via official websites or authorized corporate customer care numbers.',
          hi: 'Official website par jakar unke verified phone number ya email se confirm karein.'
        },
        {
          en: 'Block the sender and report the number/message as spam.',
          hi: 'Sender ko turant block karein aur spam report darj karein.'
        }
      ];
    } else {
      recommendedActions = [
        {
          en: 'Safe to proceed, but always confirm sender identity if communication is unexpected.',
          hi: 'Aage badh sakte hain, lekin anjaan number ho toh sender ka identity verify kar lein.'
        },
        {
          en: 'Never share OTPs, passwords, or personal credentials over messages or calls.',
          hi: 'Chahe koi bhi kahe, apna OTP ya password kabhi kisi se share na karein.'
        }
      ];
    }
  }

  // 9. Cybercrime action rule:
  // Only include cybercrime helpline when category is High or Very High
  const isCybercrimeReportable = riskCategory === 'High' || riskCategory === 'Very High';
  
  // Remove any existing cybercrime actions from list first
  recommendedActions = recommendedActions.filter(a => {
    const text = (a.en + ' ' + a.hi).toLowerCase();
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
