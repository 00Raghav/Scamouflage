// Mock datasets conforming to the Scamouflage API Response format (English)

export const SAMPLE_TEXTS = {
  message: "Dear Customer, your SBI YONO account will be blocked today due to pending KYC. Click immediately to update PAN: http://sbi-kyc-verification.top/update",
  job: "Congratulations! You have been selected for a remote job paying ₹80,000 per month. Pay a ₹1,500 registration fee immediately to secure your position.",
  bank: "Dear Customer, your SBI YONO account will be blocked today due to pending KYC. Click immediately to update PAN: http://sbi-kyc-verification.top/update",
  url: "https://sbi-secure-login.xyz/portal/verify-aadhaar-pan",
  genuine: "Hi Madhav, our project sync meeting is scheduled for tomorrow at 3:00 PM on Google Meet: https://meet.google.com/abc-defg-hij. Please review the shared doc beforehand."
};

export const MOCK_RESPONSES = {
  job: {
    riskScore: 88,
    riskCategory: "Very High",
    summary: {
      en: "This message exhibits classic recruitment fraud patterns: an unsolicited job offer with an unrealistically high payout, coupled with an upfront fee demand disguised as a registration charge."
    },
    flaggedPhrases: [
      {
        text: "Congratulations! You have been selected",
        severity: "high",
        reason: {
          en: "Unsolicited selection for an unapplied position is the #1 psychological hook used by employment scammers to trigger excitement."
        }
      },
      {
        text: "remote job paying ₹80,000 per month",
        severity: "medium",
        reason: {
          en: "Unrealistically high remuneration promised for generic remote work with no technical evaluation or credentials verification."
        }
      },
      {
        text: "Pay a ₹1,500 registration fee",
        severity: "high",
        reason: {
          en: "Legitimate enterprises never charge candidates registration, training, documentation, or security deposit fees under labor guidelines."
        }
      },
      {
        text: "immediately to secure your position",
        severity: "high",
        reason: {
          en: "Manufactured urgency creates psychological panic, forcing victims into transferring money before conducting background checks."
        }
      }
    ],
    recommendedActions: [
      {
        en: "Never transfer any money via UPI, QR code, or bank transfer for job applications."
      },
      {
        en: "Search the company's verified LinkedIn or official corporate website career portal directly."
      },
      {
        en: "Block the sender and report the phone number as spam on WhatsApp and spam filters."
      },
      {
        en: "File a cyber fraud complaint on cybercrime.gov.in or call helpline 1930 if funds were sent."
      }
    ],
    urlAnalysis: null
  },

  bank: {
    riskScore: 94,
    riskCategory: "Very High",
    summary: {
      en: "Critical banking phishing threat. It impersonates State Bank of India (SBI) using simulated account suspension fear tactics to steal netbanking passwords and OTPs through a spoofed website."
    },
    flaggedPhrases: [
      {
        text: "account will be blocked today",
        severity: "high",
        reason: {
          en: "Extreme coercive urgency intended to override critical thinking and bypass safety protocols."
        }
      },
      {
        text: "due to pending KYC",
        severity: "high",
        reason: {
          en: "KYC expiration threats are the single most prevalent banking fraud tactic reported to steal netbanking credentials."
        }
      },
      {
        text: "Click immediately to update PAN",
        severity: "high",
        reason: {
          en: "Regulatory guidelines mandate that banks never solicit PAN, Aadhaar, or credential updates through SMS hyperlink redirects."
        }
      },
      {
        text: "http://sbi-kyc-verification.top/update",
        severity: "high",
        reason: {
          en: "Malicious unencrypted HTTP link on an untrusted '.top' domain mimicking official State Bank of India portal."
        }
      }
    ],
    recommendedActions: [
      {
        en: "Do NOT click the link, and under no circumstances enter your username, password, or OTP."
      },
      {
        en: "Access your bank account exclusively via verified mobile banking apps or official bank portals."
      },
      {
        en: "Forward the phishing SMS to 1909 and notify the bank anti-phishing security cell."
      },
      {
        en: "If you clicked the link or provided details, freeze your card and account immediately via official helpline numbers."
      }
    ],
    urlAnalysis: {
      domain: "sbi-kyc-verification.top",
      lookalikeOf: "sbi.co.in",
      isShortener: false,
      threatDbStatus: "flagged"
    }
  },

  url: {
    riskScore: 87,
    riskCategory: "Very High",
    summary: {
      en: "This URL is an active credential harvester targeting banking customers. The domain has been registered anonymously and spoofs legitimate Indian financial institutions."
    },
    flaggedPhrases: [
      {
        text: "sbi-secure-login.xyz",
        severity: "high",
        reason: {
          en: "Deceptive domain using '.xyz' generic TLD and brand trademark 'sbi' in the hostname to masquerade as an official banking gateway."
        }
      },
      {
        text: "verify-aadhaar-pan",
        severity: "high",
        reason: {
          en: "Phishing endpoint explicitly constructed to harvest sensitive national identity credentials and linked mobile numbers."
        }
      }
    ],
    recommendedActions: [
      {
        en: "Close this page immediately. Do not submit any forms or allow browser permissions."
      },
      {
        en: "Clear your browser cache if you have visited the link on this device."
      },
      {
        en: "Check your Aadhaar biometric lock status on the official UIDAI mAadhaar app."
      },
      {
        en: "Report the domain to Google Safe Browsing and Indian Computer Emergency Response Team (CERT-In)."
      }
    ],
    urlAnalysis: {
      domain: "sbi-secure-login.xyz",
      lookalikeOf: "sbi.co.in",
      isShortener: false,
      threatDbStatus: "not_flagged"
    }
  },

  genuine: {
    riskScore: 8,
    riskCategory: "Low",
    summary: {
      en: "This communication is verified clean. It features standard professional scheduling language, no financial solicitations, no credential harvesting hooks, and links to an authentic Google domain."
    },
    flaggedPhrases: [
      {
        text: "https://meet.google.com/abc-defg-hij",
        severity: "low",
        reason: {
          en: "Legitimate HTTPS domain owned and verified by Google LLC (meet.google.com). Safe for designated meetings."
        }
      }
    ],
    recommendedActions: [
      {
        en: "Safe to proceed. As a good habit, always confirm that meeting invites match your expected calendar events."
      },
      {
        en: "Ensure you only accept mic and camera permissions for legitimate enterprise communication platforms."
      }
    ],
    urlAnalysis: {
      domain: "meet.google.com",
      lookalikeOf: null,
      isShortener: false,
      threatDbStatus: "not_flagged"
    }
  }
};
