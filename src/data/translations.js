// Application UI strings and labels (English)

export const translations = {
  en: {
    appTitle: "Scamouflage",
    tagline: "Unmask what's hiding in plain sight.",
    subtitle: "AI-powered detection for fraud, phishing attacks, fake job offers, and deceptive links.",
    noStorageNotice: "No account needed. Your message is analyzed and not stored.",
    tabs: {
      message: "Suspicious Message",
      job: "Job Offer",
      url: "Web Link / URL"
    },
    samplePillsLabel: "Try sample scams:",
    samples: {
      job: "Fake job offer",
      bank: "Bank phishing",
      url: "Suspicious link",
      genuine: "Genuine message"
    },
    textareaPlaceholder: "Paste the suspicious message, job offer, SMS, WhatsApp text, or link here...",
    analyzeBtn: "Analyze for Scams",
    scanningText: "Scanning for warning signs...",
    scanningSubtext: "Checking psychological pressure tactics, fee demands & domain reputation",
    clearBtn: "Clear",
    characterCount: "characters",
    errorTitle: "Analysis Failed",
    errorMessage: "Something went wrong, please try again.",
    retryBtn: "Try Again",
    riskAssessment: "Risk Assessment",
    resultsTitle: "Scam Analysis Report",
    riskCategories: {
      low: "Low Risk",
      moderate: "Moderate Risk",
      high: "High Risk",
      veryHigh: "Very High Risk"
    },
    scoreOutOf: "Threat Score",
    summaryTitle: "Executive Summary",
    highlightedTitle: "Suspicious Phrases Highlighted",
    highlightedSubtitle: "Hover or tap on highlighted text to view real-time threat intelligence.",
    noFlagsClean: "No suspicious patterns or coercive phrases detected in this text.",
    clickMarkerTip: "Tap any numbered badge to jump to its detailed breakdown.",
    whySuspiciousTitle: "Why This Looks Suspicious",
    whySuspiciousSubtitle: "Deconstruction of deceptive tactics identified in this content.",
    severityLabels: {
      high: "High Severity",
      medium: "Medium Severity",
      low: "Low Severity",
      safe: "Safe Indicator"
    },
    whatToDoTitle: "What You Should Do",
    whatToDoSubtitle: "Follow this safety protocol step-by-step. Mark items as completed:",
    completedText: "Actions completed",
    allDone: "All safety steps completed! Stay alert.",
    urlAnalysisTitle: "Deep Link & Domain Check",
    urlAnalysisSubtitle: "Technical inspection of the web destination and infrastructure.",
    domainLabel: "Extracted Domain",
    lookalikeLabel: "Lookalike Target",
    shortenerLabel: "URL Shortener Detected",
    threatDbLabel: "Threat Database Status",
    threatDbValues: {
      flagged: "Flagged Malicious",
      not_flagged: "Not Flagged",
      unavailable: "Lookup Unavailable"
    },
    urlNotice: "Important: 'Not flagged' does not mean safe. Newly created phishing domains often go undetected in blacklists for the first 24-48 hours.",
    yes: "Yes",
    no: "No",
    noneDetected: "None detected (Original brand domain)",
    reportTitle: "Official Indian Cybercrime Escalation",
    reportSubtitle: "If you have shared information, transferred money, or received repeated threats, report immediately.",
    helplineTitle: "National Cyber Helpline",
    helplineDesc: "Dial 1930 immediately for financial fraud within golden hours.",
    callNow: "Call 1930",
    copyNumber: "Copy 1930",
    portalTitle: "National Cybercrime Portal",
    portalDesc: "File formal complaints at cybercrime.gov.in (MHA Government of India).",
    visitPortal: "Open cybercrime.gov.in",
    evidenceTitle: "What evidence to preserve:",
    evidenceList: [
      "Keep screenshots of the sender's phone number, WhatsApp bio, or email address.",
      "Save transaction UTR/reference numbers if any payment was initiated.",
      "Do not delete SMS headers (e.g. VK-SBIINP, AD-JOBSRV)."
    ],
    analyzeAnother: "Analyze Another",
    copyReport: "Copy Report",
    reportCopied: "Report copied to clipboard!",
    disclaimer: "Scamouflage is an AI safety assistant, not a legal guarantee. A low score does not mean 100% safe. Always verify through official banking, employer, and government channels.",
    learnMoreTitle: "Essential Cyber Defense Knowledge",
    tips: [
      {
        title: "Never Share OTPs",
        desc: "Banks, couriers, or government officers will NEVER call or message you asking for your OTP, UPI PIN, or card CVV."
      },
      {
        title: "Real Jobs Never Charge Fees",
        desc: "Legitimate employers never demand registration fees, laptop security deposits, or Telegram task investments before hiring."
      },
      {
        title: "Check the Link Before You Click",
        desc: "Always examine the exact domain spelling. Scammers substitute letters (e.g. 'sbi-online.cc' or 'paytm-update.net')."
      }
    ],
    privacyBadge: "Privacy First: Client-safe analysis. Zero telemetry retention.",
    taglineBottom: "Scamouflage — Unmask what's hiding in plain sight."
  }
};

export const t = translations.en;
