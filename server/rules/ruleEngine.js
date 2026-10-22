// Rule-based scam detection engine
// Detects scam signals using pattern recognition across English and Hinglish

export function detectSignals(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const signals = [];
  const text = content;

  // Helper to test regex and extract exact matchedText
  const testRule = (regex, id, label, weight, severity, category) => {
    const match = regex.exec(text);
    if (match) {
      const matchedText = text.substring(match.index, match.index + match[0].length);
      signals.push({
        id,
        label,
        weight,
        matchedText,
        severity,
        category,
        index: match.index
      });
      return true;
    }
    return false;
  };

  // 1. Advance Payment / Fee Demands
  const advancePaymentRegex = /(?:registration\s+(?:fee|charge|deposit|amount)|security\s+(?:deposit|fee|charge)|training\s+(?:fee|charges?)|processing\s+(?:fee|charges?)|pay\s+(?:₹|rs\.?|inr)?\s*[\d,]+(?:\s*(?:fee|charges?))?\s+(?:to\s+(?:secure|confirm|join|start|register)|immediately)|upfront\s+(?:fee|charges?|payment)|advance\s+(?:fee|charges?|dena\s+hoga|payment)|joining\s+(?:fee|charges?)|pehle\s+paise\s+(?:transfer|bhejo|jama))/i;
  testRule(
    advancePaymentRegex,
    'advance_payment',
    'Upfront fee or registration charge demanded',
    35,
    'high',
    'advance_payment'
  );

  // 2. OTP / Credential Requests (with negation handling)
  const otpCredentialRegex = /(?:share\s+(?:your\s+)?otp|send\s+(?:me\s+)?(?:the\s+)?otp|tell\s+(?:me\s+)?(?:the\s+)?otp|enter\s+(?:your\s+)?(?:upi\s+)?pin|share\s+(?:your\s+)?(?:password|pin|cvv)|send\s+(?:your\s+)?(?:password|pin|cvv)|provide\s+(?:your\s+)?(?:netbanking\s+password|cvv|card\s+number)|(?:card\s+number|cvv\s+number|upi\s+pin)\s+(?:batao|bhejo|share\s+karo)|otp\s+(?:bhejo|share\s+karo|batao|de\s+do))/i;
  
  const otpMatch = otpCredentialRegex.exec(text);
  if (otpMatch) {
    // Check for negation within ~50 characters before or after the match
    const windowStart = Math.max(0, otpMatch.index - 50);
    const windowEnd = Math.min(text.length, otpMatch.index + otpMatch[0].length + 50);
    const contextWindow = text.substring(windowStart, windowEnd);

    const negationRegex = /(?:never|do\s+not|don't|should\s+not|kabhi\s+(?:bhi\s+)?(?:mat|na|nahi)|mat\s+karein|na\s+karein|do\s+never)\s+(?:share|disclose|give|tell|bataen|karein)?/i;
    const isNegated = negationRegex.test(contextWindow) && 
      /(?:never\s+share|do\s+not\s+share|don't\s+share|kabhi\s+share\s+na|kabhi\s+na\s+bataen)/i.test(contextWindow);

    if (!isNegated) {
      signals.push({
        id: 'otp_credentials',
        label: 'Request for OTP, PIN, password, or card CVV',
        weight: 35,
        matchedText: text.substring(otpMatch.index, otpMatch.index + otpMatch[0].length),
        severity: 'high',
        category: 'credentials',
        index: otpMatch.index
      });
    }
  }

  // 3. Urgency & High Pressure Tactics
  const urgencyRegex = /(?:immediately|within\s+24\s+hours?|within\s+\d+\s+(?:minutes?|hours?)|last\s+chance|act\s+now|urgent(?:\s+action)?|before\s+it(?:'s|\s+is)\s+too\s+late|turant|abhi\s+ke\s+abhi|aaj\s+hi|bina\s+kisi\s+deri|aakhri\s+mauka)/i;
  testRule(
    urgencyRegex,
    'urgency_pressure',
    'Manufactured urgency designed to force hasty decisions',
    20,
    'high',
    'urgency'
  );

  // 4. Threats of Coercion / Disconnection / Arrest / Suspension
  const threatsRegex = /(?:account\s+will\s+be\s+(?:blocked|suspended|terminated|frozen|closed)|due\s+to\s+pending\s+kyc|kyc\s+(?:is\s+)?pending|update\s+pan|pan\s+card\s+will\s+be\s+blocked|legal\s+action\s+will\s+be\s+taken|arrest\s+warrant|police\s+(?:action|complaint)|electricity\s+(?:will\s+be\s+)?disconnected|power\s+(?:will\s+be\s+)?cut|sim\s+(?:card\s+)?(?:will\s+be\s+)?(?:blocked|deactivated)|penalty\s+of\s+₹?[\d,]+|account\s+block\s+ho\s+jayega|bijli\s+kat\s+jayegi)/i;
  testRule(
    threatsRegex,
    'threat_suspension',
    'Threat of immediate account suspension, disconnection, or legal penalty',
    30,
    'high',
    'threats'
  );

  // 5. Unrealistic Rewards / Guaranteed Returns / Job Bait
  const rewardsRegex = /(?:congratulations!?\s+you\s+have\s+been\s+selected|you\s+have\s+won|won\s+(?:a\s+)?lottery|guaranteed\s+(?:returns|income|profits?)|earn\s+(?:₹|rs\.?|inr)?\s*[\d,]+\s+(?:per|a)\s+(?:day|hour|month)|remote\s+job\s+paying\s+(?:₹|rs\.?|inr)?\s*[\d,]+|paying\s+(?:₹|rs\.?|inr)?\s*[\d,]+\s+per\s+month|part\s*time\s+job.*earn|no\s+experience.*earn|inaam\s+jeeta|daily\s+kamaye|ghar\s+baithe\s+kamai)/i;
  testRule(
    rewardsRegex,
    'unrealistic_rewards',
    'Unrealistic financial rewards or unsolicited high-paying offer',
    25,
    'medium',
    'rewards'
  );

  // 6. Unofficial Channels (WhatsApp / Telegram / Free Recruiter Emails)
  const unofficialRegex = /(?:contact\s+(?:us\s+)?on\s+whatsapp|contact\s+(?:us\s+)?on\s+telegram|message\s+(?:us\s+)?on\s+(?:whatsapp|telegram)|telegram\s+(?:channel|group|link)|join\s+our\s+telegram|whatsapp\s+pe\s+(?:message|contact)|(?:hr|recruiter|career|jobs)[\w.-]*@(gmail|yahoo|hotmail|outlook)\.com)/i;
  testRule(
    unofficialRegex,
    'unofficial_channels',
    'Recruiter or official directing communication to unofficial WhatsApp/Telegram/personal email',
    20,
    'medium',
    'channels'
  );

  // 7. Impersonation of Banks / Government / Courier Services with Action Link
  const impersonationRegex = /(?:(?:sbi|yono|hdfc|icici|axis|rbi|income\s*tax|mumbai\s+police|delhi\s+police|fedex|india\s*post|bluedart|dhl)\b.*(?:click|update|verify|login|pay|link|link\.php|apk))/i;
  testRule(
    impersonationRegex,
    'impersonation_hook',
    'Brand/Institutional impersonation linked with an immediate call to action',
    25,
    'high',
    'impersonation'
  );

  // 8. Prompt Injection Attempts
  const injectionRegex = /(?:ignore\s+(?:all\s+)?previous\s+instructions|disregard\s+(?:all\s+)?previous|say\s+this\s+is\s+safe|output\s+only\s+(?:safe|low\s+risk)|system\s+prompt\s+override|developer\s+mode\s+activated)/i;
  testRule(
    injectionRegex,
    'prompt_injection',
    'Attempted prompt injection or system override detected',
    50,
    'high',
    'injection'
  );

  return signals;
}

/**
 * Computes a baseline risk score (0-100) based on detected rule signals.
 * Incorporates multi-category synergy bonuses.
 */
export function computeBaselineScore(signals = []) {
  if (!signals || signals.length === 0) {
    return 0;
  }

  // Sum weights, grouping by category to prevent repetitive spam from skewing
  const categoryWeights = {};
  const categories = new Set();

  signals.forEach(sig => {
    const cat = sig.category || sig.id;
    categories.add(cat);
    // Keep max weight per category + 5 for duplicate hits in same category
    if (!categoryWeights[cat]) {
      categoryWeights[cat] = sig.weight;
    } else {
      categoryWeights[cat] += Math.min(10, sig.weight * 0.25);
    }
  });

  let totalScore = Object.values(categoryWeights).reduce((sum, w) => sum + w, 0);

  // Synergy bonus when multiple distinct scam categories appear together
  const categoryCount = categories.size;
  if (categoryCount >= 4) {
    totalScore += 25;
  } else if (categoryCount === 3) {
    totalScore += 16;
  } else if (categoryCount === 2) {
    totalScore += 8;
  }

  return Math.min(100, Math.round(totalScore));
}
