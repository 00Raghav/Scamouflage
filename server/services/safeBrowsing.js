// Google Safe Browsing v4 API Integration
// Returns "flagged", "not_flagged", or "unavailable". Never throws.

export async function checkSafeBrowsing(url) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;

  if (!apiKey || !apiKey.trim() || !url) {
    return 'unavailable';
  }

  // Ensure scheme is present for Safe Browsing lookup
  const targetUrl = /^https?:\/\//i.test(url) ? url : `http://${url}`;

  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(apiKey.trim())}`;

    const requestBody = {
      client: {
        clientId: 'scamouflage',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url: targetUrl }]
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(4000)
    });

    if (!response.ok) {
      return 'unavailable';
    }

    const data = await response.json();
    if (data && Array.isArray(data.matches) && data.matches.length > 0) {
      return 'flagged';
    }

    return 'not_flagged';
  } catch (err) {
    // Timeout, network error, invalid key, or unreachable host
    return 'unavailable';
  }
}
