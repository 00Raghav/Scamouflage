// Scamouflage AI Analysis Service
// Easily swappable for real backend API: POST /api/analyze

import { SAMPLE_TEXTS, MOCK_RESPONSES } from '../data/mockData';

/**
 * Main analysis function.
 * Accepts input text and type ('message' | 'job' | 'url').
 * Returns a Promise that resolves with standard Scamouflage Analysis Response.
 * 
 * To switch to real API:
 * export async function analyzeContent(text, inputType = 'message') {
 *   const res = await fetch('/api/analyze', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ text, inputType })
 *   });
 *   if (!res.ok) throw new Error('Analysis API failed');
 *   return await res.json();
 * }
 */
export async function analyzeContent(text, inputType = 'message') {
  // Simulate network round-trip delay for realistic scanning feel
  await new Promise((resolve) => setTimeout(resolve, 1400));

  if (!text || text.trim().length === 0) {
    throw new Error('Please enter text or a URL to analyze.');
  }

  const cleanText = text.trim();

  // 1. Check exact or high-similarity match with sample datasets
  if (cleanText.includes("selected for a remote job paying") || cleanText.includes("registration fee")) {
    return structuredClone(MOCK_RESPONSES.job);
  }
  if (cleanText.includes("SBI YONO account will be blocked") || cleanText.includes("sbi-kyc-verification")) {
    return structuredClone(MOCK_RESPONSES.bank);
  }
  if (cleanText.includes("sbi-secure-login.xyz") || cleanText.includes("claim-reward-in")) {
    return structuredClone(MOCK_RESPONSES.url);
  }
  if (cleanText.includes("project sync meeting") || cleanText.includes("meet.google.com")) {
    return structuredClone(MOCK_RESPONSES.genuine);
  }

  // 2. Intelligent Dynamic Heuristic Analyzer for custom user input
  return generateDynamicAnalysis(cleanText, inputType);
}

/**
 * Dynamic fallback analyzer for any custom text entered by the user
 */
function generateDynamicAnalysis(text, inputType) {
  const lower = text.toLowerCase();
  const flaggedPhrases = [];
  let scoreAccumulator = 10; // baseline

  // URL extraction
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;
  const urlsFound = text.match(urlRegex) || [];
  let urlAnalysis = null;

  if (urlsFound.length > 0 || inputType === 'url') {
    const rawUrl = urlsFound[0] || text.trim();
    const domainMatch = rawUrl.replace(/^https?:\/\//i, '').split('/')[0].split('?')[0];
    const isShortener = /bit\.ly|tinyurl|t\.co|is\.gd|goo\.gl|ow\.ly|cutt\.ly/i.test(domainMatch);
    const hasSuspiciousTLD = /\.(xyz|top|cc|club|live|pw|buzz|online|click|space|work|site)$/i.test(domainMatch);
    const hasBankBrand = /sbi|hdfc|icici|axis|pnb|paytm|phonepe|gpay/i.test(domainMatch);
    const isOfficialBank = /^(www\.)?(onlinesbi\.sbi|sbi\.co\.in|hdfcbank\.com|icicibank\.com|axisbank\.com|paytm\.com)$/i.test(domainMatch);

    let lookalikeOf = null;
    let threatDbStatus = "not_flagged";

    if (hasBankBrand && !isOfficialBank) {
      lookalikeOf = "Official Banking Portal (e.g. sbi.co.in / hdfcbank.com)";
      scoreAccumulator += 40;
      threatDbStatus = "flagged";
      flaggedPhrases.push({
        text: domainMatch,
        severity: "high",
        reason: {
          en: `Domain spoofing detected. '${domainMatch}' mimics authorized banking domains without authorization.`,
          hi: `'${domainMatch}' authorized bank domain ki copy karta lag raha hai. Iska official bank se koi sambandh nahi hai.`
        }
      });
    } else if (hasSuspiciousTLD) {
      scoreAccumulator += 28;
      flaggedPhrases.push({
        text: domainMatch,
        severity: "medium",
        reason: {
          en: `Uses a generic low-reputation top-level domain frequently associated with disposable phishing campaigns.`,
          hi: `Yeh low-cost disposable TLD aksar fake phishing campaigns mein use hota hai.`
        }
      });
    }

    if (isShortener) {
      scoreAccumulator += 25;
      flaggedPhrases.push({
        text: rawUrl,
        severity: "medium",
        reason: {
          en: "Shortened link obscures real server location, commonly masking credential harvesters.",
          hi: "Short URL asli website ko chhupane ke liye lagayi gayi hai."
        }
      });
    }

    urlAnalysis = {
      domain: domainMatch,
      lookalikeOf,
      isShortener,
      threatDbStatus: threatDbStatus === "flagged" ? "flagged" : (scoreAccumulator > 50 ? "not_flagged" : "not_flagged")
    };
  }

  // Keywords checks: Urgency & Panic
  const urgencyRegex = /(immediately|within 24 hours|account blocked|will be suspended|disconnect|tonight|final notice|urgent|action required|last date)/i;
  const urgencyMatch = text.match(urgencyRegex);
  if (urgencyMatch) {
    scoreAccumulator += 26;
    flaggedPhrases.push({
      text: urgencyMatch[0],
      severity: "high",
      reason: {
        en: "Manufactured panic deadline intended to disrupt calm reasoning and force compliance.",
        hi: "Panic aur jaldbaazi paida karne ke liye samay ka dabav banaya gaya hai."
      }
    });
  }

  // Keywords checks: Financial/Fee extortion
  const feeRegex = /(registration fee|processing fee|security deposit|pay ₹?\d+|send ₹?\d+|upfront fee|pay to secure|transfer money)/i;
  const feeMatch = text.match(feeRegex);
  if (feeMatch) {
    scoreAccumulator += 35;
    flaggedPhrases.push({
      text: feeMatch[0],
      severity: "high",
      reason: {
        en: "Advance-fee fraud pattern: Demanding money upfront under false pretenses of verification or processing.",
        hi: "Advance fee fraud: Verification ya registration ke naam par pehle paise maange ja rahe hain."
      }
    });
  }

  // Keywords checks: Credential Harvesting
  const credRegex = /(enter otp|share otp|update pan|kyc pending|aadhaar|netbanking password|upi pin|cvv)/i;
  const credMatch = text.match(credRegex);
  if (credMatch) {
    scoreAccumulator += 32;
    flaggedPhrases.push({
      text: credMatch[0],
      severity: "high",
      reason: {
        en: "Direct solicitation of non-public financial credentials or one-time authentication tokens.",
        hi: "Personal KYC, OTP ya banking credentials chori karne ka seedha prayas."
      }
    });
  }

  // Keywords checks: Job/Prize Bait
  const baitRegex = /(selected for|won ₹?\d+|lottery|daily income|part time job|earn \d+ per day|telegram task|youtube like)/i;
  const baitMatch = text.match(baitRegex);
  if (baitMatch) {
    scoreAccumulator += 22;
    flaggedPhrases.push({
      text: baitMatch[0],
      severity: "medium",
      reason: {
        en: "Enticement hook leveraging exaggerated wealth or unverified hiring selections.",
        hi: "Bina mehnat badi kamai ya unapplied job ka lalach dekar fasane ka prayas."
      }
    });
  }

  // Final risk score clamping
  let riskScore = Math.min(98, Math.max(8, scoreAccumulator));
  
  // Categorization
  let riskCategory = "Low";
  if (riskScore >= 75) {
    riskCategory = "Very High";
  } else if (riskScore >= 50) {
    riskCategory = "High";
  } else if (riskScore >= 25) {
    riskCategory = "Moderate";
  } else {
    riskCategory = "Low";
  }

  // Generate dynamic summaries
  let summary = {
    en: "General content analysis completed. No major coercive extortion or phishing patterns identified.",
    hi: "Content analysis complete hua. Koi bada fraud pattern ya extortion threat nahi mila."
  };

  if (riskScore >= 75) {
    summary = {
      en: "Extreme scam probability detected. Multiple high-severity red flags including coercive urgency, fee solicitation, or credential theft vectors.",
      hi: "Is message mein fraud hone ki sambhavna bohot zyada hai. Jaldbaazi, paise maangne ya personal data lene ke khatarnak sanket mile hain."
    };
  } else if (riskScore >= 50) {
    summary = {
      en: "Significant warning signs detected. Exercise strict caution before following instructions or contacting sender.",
      hi: "Savdhaan rahein! Isme suspicious baatein hain jo scams mein use hoti hain. Koi bhi decision lene se pehle verify karein."
    };
  } else if (riskScore >= 25) {
    summary = {
      en: "Moderate risk factors observed. The message has mild persuasion tactics that warrant independent verification.",
      hi: "Kuch baatein dhyan dene yogya hain. Sender ko bina kisi official proof ke response na karein."
    };
  }

  // Generate recommendations based on risk
  const recommendedActions = [];
  if (riskScore >= 50) {
    recommendedActions.push(
      {
        en: "Do NOT click any links, open attachments, or send money.",
        hi: "Kisi bhi link par click na karein aur koi paisa transfer na karein."
      },
      {
        en: "Verify the claim independently through verified public contact info, not details in this message.",
        hi: "Message mein diye number par bharosa na karein; official website se contact dhoondh kar call karein."
      },
      {
        en: "Block and report this sender on your messaging app and SMS spam filter.",
        hi: "Sender ko foran block karein aur spam report darj karein."
      },
      {
        en: "If money was debited, call 1930 immediately within the golden hour to freeze transfers.",
        hi: "Agar transaction ho gaya hai, toh 1930 par call karke transaction turant freeze karwayen."
      }
    );
  } else {
    recommendedActions.push(
      {
        en: "Safe to proceed, but confirm sender credentials if unexpected.",
        hi: "Aage badh sakte hain, par anjaan number ho toh sender ka identity verify kar lein."
      },
      {
        en: "Never share OTPs or passwords regardless of sender tone.",
        hi: "Chahe koi bhi kahe, apna OTP ya PIN kabhi share na karein."
      }
    );
  }

  return {
    riskScore,
    riskCategory,
    summary,
    flaggedPhrases,
    recommendedActions,
    urlAnalysis
  };
}
