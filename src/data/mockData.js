// Mock datasets conforming to the Scamouflage API Response format

export const SAMPLE_TEXTS = {
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
      en: "This message exhibits classic recruitment fraud patterns: an unsolicited job offer with an unrealistically high payout, coupled with an upfront fee demand disguised as a registration charge.",
      hi: "Is message mein job fraud ke pakke sanket hain: bina interview ke ₹80,000 ka offer aur joining se pehle ₹1,500 registration fee maangi ja rahi hai. Kisi bhi haal mein payment na karein."
    },
    flaggedPhrases: [
      {
        text: "Congratulations! You have been selected",
        severity: "high",
        reason: {
          en: "Unsolicited selection for an unapplied position is the #1 psychological hook used by employment scammers to trigger excitement.",
          hi: "Bina kisi application ya interview ke seedhe selection ka dawa karna fake employment scam ka classic lalach hai."
        }
      },
      {
        text: "remote job paying ₹80,000 per month",
        severity: "medium",
        reason: {
          en: "Unrealistically high remuneration promised for generic remote work with no technical evaluation or credentials verification.",
          hi: "Bina kisi assessment ya qualification check ke aswabhavik roop se bohot badi salary ka dawa kiya gaya hai."
        }
      },
      {
        text: "Pay a ₹1,500 registration fee",
        severity: "high",
        reason: {
          en: "Legitimate enterprises never charge candidates registration, training, documentation, or security deposit fees under Indian labor guidelines.",
          hi: "Asli corporate company job offer dene se pehle candidate se kabhi registration ya security deposit nahi maangti."
        }
      },
      {
        text: "immediately to secure your position",
        severity: "high",
        reason: {
          en: "Manufactured urgency creates psychological panic, forcing victims into transferring money before conducting background checks.",
          hi: "Jaldbaazi paida ki ja rahi hai taaki aap bina company verify kiye ghabrahat mein turant paise transfer kar dein."
        }
      }
    ],
    recommendedActions: [
      {
        en: "Never transfer any money via UPI, QR code, or bank transfer for job applications.",
        hi: "Job paane ke liye kisi bhi UPI, QR code ya bank account par koi payment na karein."
      },
      {
        en: "Search the company's verified LinkedIn or official corporate website career portal directly.",
        hi: "Company ki official website ya LinkedIn page par jakar unke official HR email se verify karein."
      },
      {
        en: "Block the sender and report the phone number as spam on WhatsApp and Truecaller.",
        hi: "Sender ko WhatsApp, SMS aur Truecaller par turant block aur spam report karein."
      },
      {
        en: "File a cyber fraud complaint on cybercrime.gov.in or call helpline 1930 if funds were sent.",
        hi: "Agar paise kat gaye hain, toh foran 1930 par call karein aur cybercrime.gov.in par complaint karein."
      }
    ],
    urlAnalysis: null
  },

  bank: {
    riskScore: 94,
    riskCategory: "Very High",
    summary: {
      en: "Critical banking phishing threat. It impersonates State Bank of India (SBI) using simulated account suspension fear tactics to steal netbanking passwords and OTPs through a spoofed website.",
      hi: "State Bank of India (SBI) ke naam par bohot bada phishing fraud hai. Account band hone ka dar dikhakar fake link ke zariye aapka netbanking password aur OTP churane ki sazish hai."
    },
    flaggedPhrases: [
      {
        text: "account will be blocked today",
        severity: "high",
        reason: {
          en: "Extreme coercive urgency intended to override critical thinking and bypass safety protocols.",
          hi: "Account turant band hone ki fake dhamki di gayi hai taaki aap ghabra kar link khol lein."
        }
      },
      {
        text: "due to pending KYC",
        severity: "high",
        reason: {
          en: "KYC expiration threats are the single most prevalent banking fraud tactic reported across India in 2024-2025.",
          hi: "KYC update ke bahane credentials churana sabse aam banking fraud tactic hai."
        }
      },
      {
        text: "Click immediately to update PAN",
        severity: "high",
        reason: {
          en: "RBI guidelines strictly mandate that banks never solicit PAN, Aadhaar, or credential updates through SMS hyperlink redirects.",
          hi: "RBI ke niyamon ke mutabik banks kabhi bhi SMS link par click karke PAN update karne ko nahi kehte."
        }
      },
      {
        text: "http://sbi-kyc-verification.top/update",
        severity: "high",
        reason: {
          en: "Malicious unencrypted HTTP link on an untrusted '.top' domain mimicking official State Bank of India portal.",
          hi: "Yeh unencrypted HTTP link '.top' domain par hosted hai, jiska official SBI portal se koi lena-dena nahi hai."
        }
      }
    ],
    recommendedActions: [
      {
        en: "Do NOT click the link, and under no circumstances enter your username, password, or OTP.",
        hi: "Is link par bilkul click na karein aur apna user ID, password ya OTP galti se bhi na dalein."
      },
      {
        en: "Access your SBI account exclusively via the verified YONO SBI App or 'onlinesbi.sbi'.",
        hi: "Apne bank account ka status sirf official YONO app ya direct 'onlinesbi.sbi' par jakar dekhein."
      },
      {
        en: "Forward the phishing SMS to 1909 and notify SBI anti-phishing cell at report.phishing@sbi.co.in.",
        hi: "Is fraud SMS ko 1909 par forward karein aur SBI cyber cell report.phishing@sbi.co.in ko bhejein."
      },
      {
        en: "If you clicked the link or provided details, freeze your card and account immediately via 1800 1234.",
        hi: "Agar aapne link par details daal di hain, toh turant SBI helpline 1800 1234 par call karke account freeze karwayen."
      }
    ],
    urlAnalysis: {
      domain: "sbi-kyc-verification.top",
      lookalikeOf: "onlinesbi.sbi (State Bank of India)",
      isShortener: false,
      threatDbStatus: "flagged"
    }
  },

  url: {
    riskScore: 87,
    riskCategory: "Very High",
    summary: {
      en: "This URL is an active credential harvester targeting banking customers. The domain has been registered anonymously and spoofs legitimate Indian financial institutions.",
      hi: "Yeh URL ek active fake phishing link hai jo SBI ki nakal karke banking aur Aadhaar details churane ke liye banayi gayi hai. Is par click karna khatarnaak hai."
    },
    flaggedPhrases: [
      {
        text: "sbi-secure-login.xyz",
        severity: "high",
        reason: {
          en: "Deceptive domain using '.xyz' generic TLD and brand trademark 'sbi' in the hostname to masquerade as an official banking gateway.",
          hi: "Official bank ke naam 'sbi' ko '.xyz' domain ke saath joda gaya hai jo 100% fake website ki nishani hai."
        }
      },
      {
        text: "verify-aadhaar-pan",
        severity: "high",
        reason: {
          en: "Phishing endpoint explicitly constructed to harvest sensitive national identity credentials and linked mobile numbers.",
          hi: "Yeh URL path aapke Aadhaar aur PAN card ka sensitive data capture karne ke liye banaya gaya hai."
        }
      }
    ],
    recommendedActions: [
      {
        en: "Close this page immediately. Do not submit any forms or allow browser permissions.",
        hi: "Is page ko turant band kar dein. Koi bhi form na bharein aur browser notification allow na karein."
      },
      {
        en: "Clear your browser cache if you have visited the link on this device.",
        hi: "Apne phone ya computer ke browser ka cache aur history clear kar lein."
      },
      {
        en: "Check your Aadhaar biometric lock status on the official UIDAI mAadhaar app.",
        hi: "Official mAadhaar app par jakar apna biometric data lock rakhein taaki koi durupyog na ho."
      },
      {
        en: "Report the domain to Google Safe Browsing and Indian Computer Emergency Response Team (CERT-In).",
        hi: "Is domain ki report Google Safe Browsing aur CERT-In (incident@cert-in.org.in) ko karein."
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
      en: "This communication is verified clean. It features standard professional scheduling language, no financial solicitations, no credential harvesting hooks, and links to an authentic Google domain.",
      hi: "Yeh message bilkul genuine aur safe hai. Isme normal office meeting ki baat hai, koi paise ki maang ya account band hone ki dhamki nahi hai, aur official Google Meet link hai."
    },
    flaggedPhrases: [
      {
        text: "https://meet.google.com/abc-defg-hij",
        severity: "low",
        reason: {
          en: "Legitimate HTTPS domain owned and verified by Google LLC (meet.google.com). Safe for designated meetings.",
          hi: "Google LLC ka official aur surakshit domain (meet.google.com) hai. Meeting join karne ke liye safe hai."
        }
      }
    ],
    recommendedActions: [
      {
        en: "Safe to proceed. As a good habit, always confirm that meeting invites match your expected calendar events.",
        hi: "Aage badh sakte hain. Standard aadat ke mutabik check karein ki meeting ka samay aapke calendar se match karta hai."
      },
      {
        en: "Ensure you only accept mic and camera permissions for legitimate enterprise communication platforms.",
        hi: "Camera aur mic ki permission sirf verified platforms ko hi dein."
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
