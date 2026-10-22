import { parse } from 'tldts';
import { distance } from 'fastest-levenshtein';
import { KNOWN_BRANDS } from '../data/brands.js';

const KNOWN_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'cutt.ly',
  'is.gd',
  'rb.gy',
  'ow.ly',
  'shorturl.at',
  'rebrand.ly',
  'v.gd',
  'bl.ink',
  'buff.ly',
  't.ly',
  'clck.ru',
  'snip.ly',
  'qr.ae',
  'adf.ly'
]);

const SUSPICIOUS_TLDS = new Set([
  'xyz',
  'top',
  'click',
  'buzz',
  'club',
  'work',
  'live',
  'space',
  'loan',
  'cam',
  'cfd',
  'rest',
  'sbs',
  'icu',
  'monster',
  'gq',
  'cf',
  'ml',
  'tk',
  'ga',
  'online',
  'site'
]);

/**
 * Extracts the first URL or parses the content if inputType is 'url'.
 */
function extractFirstUrl(content, inputType) {
  if (!content || typeof content !== 'string') return null;

  const trimmed = content.trim();

  if (inputType === 'url') {
    return ensureHttpScheme(trimmed);
  }

  // Regex to match URLs in text
  const urlRegex = /(https?:\/\/[^\s<>"'()]+|(?<![\w@])(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s<>"'()]*)?)/i;
  const match = urlRegex.exec(content);
  if (match) {
    return ensureHttpScheme(match[0]);
  }

  return null;
}

function ensureHttpScheme(urlString) {
  if (!urlString) return '';
  if (/^https?:\/\//i.test(urlString)) {
    return urlString;
  }
  return `https://${urlString}`;
}

/**
 * Analyzes a URL for domain structure, lookalikes, shorteners, and threat indicators.
 * Returns { domain, lookalikeOf, isShortener, signals } or null if no URL present.
 */
export function analyzeUrl(content, inputType = 'message') {
  const urlString = extractFirstUrl(content, inputType);
  if (!urlString) {
    return null;
  }

  let parsed;
  try {
    const urlObj = new URL(urlString);
    parsed = parse(urlObj.hostname);
  } catch (err) {
    parsed = parse(urlString);
  }

  const hostname = (parsed.hostname || '').toLowerCase();
  const domain = (parsed.domain || hostname).toLowerCase();
  const domainWithoutSuffix = (parsed.domainWithoutSuffix || '').toLowerCase();
  const publicSuffix = (parsed.publicSuffix || '').toLowerCase();
  const subdomain = (parsed.subdomain || '').toLowerCase();

  if (!domain && !hostname) {
    return null;
  }

  const signals = [];

  // 1. Shortener Detection
  const isShortener = KNOWN_SHORTENERS.has(domain) || KNOWN_SHORTENERS.has(hostname);
  if (isShortener) {
    signals.push({
      id: 'url_shortener',
      label: 'URL shortener hides actual destination',
      severity: 'medium',
      weight: 22,
      matchedText: domain
    });
  }

  // 2. Lookalike & Brand Spoofing Detection
  let lookalikeOf = null;

  for (const brand of KNOWN_BRANDS) {
    const isAuthentic = (brand.canonicalDomains || [brand.domain]).some(canonical => {
      const canon = canonical.toLowerCase();
      return domain === canon || hostname.endsWith(`.${canon}`);
    });

    if (isAuthentic) {
      // Legit official domain, no lookalike
      continue;
    }

    // Check A: Brand keyword embedded inside an unauthenticated domain (e.g. "sbi-secure-login.xyz")
    const brandNameLower = brand.name.toLowerCase();
    const hasBrandKeyword = brand.keywords.some(kw => {
      // Match keyword as token or substring in domainWithoutSuffix or subdomain
      const tokenRegex = new RegExp(`(^|[-._0-9])${kw}([-._0-9]|$)`, 'i');
      return tokenRegex.test(domainWithoutSuffix) || tokenRegex.test(subdomain) || (kw.length >= 4 && domainWithoutSuffix.includes(kw));
    });

    if (hasBrandKeyword) {
      lookalikeOf = brand.domain;
      signals.push({
        id: 'brand_impersonation_domain',
        label: `Domain impersonates ${brand.name} (${brand.domain})`,
        severity: 'high',
        weight: 40,
        matchedText: domain
      });
      break;
    }

    // Check B: Levenshtein distance check against brand domain label
    const brandLabel = brand.domain.split('.')[0].toLowerCase();
    if (domainWithoutSuffix && brandLabel.length >= 4) {
      const dist = distance(domainWithoutSuffix, brandLabel);
      if (dist > 0 && dist <= 2) {
        lookalikeOf = brand.domain;
        signals.push({
          id: 'typosquatting_domain',
          label: `Typosquatting lookalike of ${brand.name} (${brand.domain})`,
          severity: 'high',
          weight: 38,
          matchedText: domain
        });
        break;
      }
    }
  }

  // 3. Suspicious / Low-Cost TLD Check
  if (SUSPICIOUS_TLDS.has(publicSuffix)) {
    signals.push({
      id: 'suspicious_tld',
      label: `Suspicious or disposable top-level domain (.${publicSuffix})`,
      severity: 'medium',
      weight: 18,
      matchedText: `.${publicSuffix}`
    });
  }

  // 4. Excessive Hyphens / Subdomains Check
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    signals.push({
      id: 'excessive_hyphens',
      label: 'Excessive hyphens in hostname typical of phishing lures',
      severity: 'low',
      weight: 12,
      matchedText: hostname
    });
  }

  const subdomainParts = subdomain ? subdomain.split('.') : [];
  if (subdomainParts.length >= 3) {
    signals.push({
      id: 'deep_subdomain',
      label: 'Deep nested subdomains used to mimic security hierarchies',
      severity: 'low',
      weight: 10,
      matchedText: hostname
    });
  }

  return {
    domain: domain || hostname,
    lookalikeOf,
    isShortener,
    signals
  };
}
