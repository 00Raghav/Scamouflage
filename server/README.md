# Scamouflage Backend 🛡️

The Node.js backend for **Scamouflage**, an AI-powered scam detection platform. It exposes `POST /api/analyze`, which evaluates suspicious messages, job offers, and URLs and returns a structured risk assessment compatible with the Scamouflage React frontend.

---

## 📁 Project Structure

```
server/
├── index.js                 # Express app setup, security headers, rate limiting, error handling
├── routes/analyze.js        # POST /api/analyze route handler
├── rules/ruleEngine.js      # Regex-based scam signal detection (EN + Hinglish)
├── rules/urlChecks.js       # Domain extraction, lookalike & shortener detection
├── services/llm.js          # Isolated LLM service (@anthropic-ai/sdk by default)
├── services/safeBrowsing.js # Google Safe Browsing v4 threatMatches check
├── prompts/systemPrompt.js  # Exports SYSTEM_PROMPT placeholder
├── schema.js                # Zod schemas for request and response validation
├── combine.js               # Pipeline merging rules + LLM output, validation, and scoring
├── data/brands.js           # List of known target brand domains (SBI, HDFC, Amazon, etc.)
├── tests/
│   ├── samples.js           # 5 test samples (Job scam, Bank phishing, Lookalike URL, Genuine, Negation)
│   └── run.js               # Test runner asserting scores and schema conformance
├── .env.example             # Example environment variables
├── .env                     # Local environment configuration
└── package.json
```

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your variables in `.env`:
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_SAFE_BROWSING_KEY=your_google_safe_browsing_key_here
```

### 3. Add the System Prompt
Open `server/prompts/systemPrompt.js` and paste your custom system prompt inside the backticks:
```javascript
export const SYSTEM_PROMPT = `PASTE SYSTEM PROMPT HERE`;
```

---

## 🏃 Running the Server

### Development Mode (with automatic reload)
```bash
npm run dev
```

### Production Start
```bash
npm start
```

### Run Automated Pipeline Tests
```bash
npm test
```
The test suite validates:
1. Fake Job Offer scores **50+** (High / Very High)
2. Bank Phishing scores **50+** (High / Very High)
3. Lookalike URL scores **50+** (High / Very High)
4. Genuine Message scores **< 25** (Low)
5. Genuine Bank Alert with negation (*"never share your OTP"*) scores **< 25** (Low)

---

## 📡 API Reference

### Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok"
}
```

---

### Analyze Content
- **Endpoint**: `POST /api/analyze`
- **Headers**: `Content-Type: application/json`
- **Rate Limit**: 20 requests per minute per IP
- **Payload Limit**: 20kb

#### Request Payload
```json
{
  "inputType": "job_offer",
  "content": "Congratulations! You have been selected for a remote job paying ₹80,000 per month. Pay a ₹1,500 registration fee immediately to secure your position."
}
```

| Field | Type | Description |
|---|---|---|
| `inputType` | `"message"` \| `"job_offer"` \| `"url"` | The classification vector |
| `content` | `string` (1 to 5000 characters) | The suspicious text or URL |

#### Sample `curl` Command

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "inputType": "job_offer",
    "content": "Congratulations! You have been selected for a remote job paying ₹80,000 per month. Pay a ₹1,500 registration fee immediately to secure your position."
  }'
```

#### Sample Response (200 OK)

```json
{
  "riskScore": 96,
  "riskCategory": "Very High",
  "summary": {
    "en": "Critical risk detected. This content exhibits major scam indicators such as advance fee demands, credential phishing, or coercive threats.",
    "hi": "Is content mein fraud ke pakke sanket hain. Advance fee demand, KYC block ya credential chori ki koshish ki gayi hai."
  },
  "flaggedPhrases": [
    {
      "text": "Congratulations! You have been selected",
      "severity": "medium",
      "reason": {
        "en": "Unrealistic returns or unsolicited selection for high-paying positions without prior interviews indicate fraud.",
        "hi": "Bina kisi interview ya application ke badi salary ya lottery ka fake lalach diya gaya hai."
      }
    },
    {
      "text": "registration fee",
      "severity": "high",
      "reason": {
        "en": "Legitimate employers, buyers, and government agencies never ask for advance registration, training, or deposit fees.",
        "hi": "Asli company ya agency joining ya delivery se pehle kabhi bhi registration ya security deposit nahi maangti."
      }
    },
    {
      "text": "immediately",
      "severity": "high",
      "reason": {
        "en": "Coercive urgency is designed to panic you into taking hasty actions without independent verification.",
        "hi": "Jaldbaazi create ki ja rahi hai taaki aap bina soche samjhe turant decision le lein."
      }
    }
  ],
  "recommendedActions": [
    {
      "en": "Do NOT send any money, scan QR codes, or share OTP/passwords.",
      "hi": "Koi bhi payment na karein, QR scan na karein aur OTP ya PIN share na karein."
    },
    {
      "en": "Verify the claims independently via official websites or authorized corporate customer care numbers.",
      "hi": "Official website par jakar unke verified phone number ya email se confirm karein."
    },
    {
      "en": "Block the sender and report the number/message as spam.",
      "hi": "Sender ko turant block karein aur spam report darj karein."
    },
    {
      "en": "Report fraudulent numbers and links to the national cybercrime helpline (1930) or file a complaint at cybercrime.gov.in.",
      "hi": "Turant cybercrime helpline 1930 par call karein ya cybercrime.gov.in par formal complaint darj karein."
    }
  ],
  "urlAnalysis": null
}
```

---

## 🔒 Security & Privacy Implementation

- **Strict Zero-Storage Policy**: No databases, file dumps, or telemetry storage.
- **Privacy-Safe Logging**: Server logs record only HTTP method, endpoint, status code, and latency in milliseconds. Request content is never printed to standard output or log streams.
- **Helmet**: Applies hardened HTTP security headers (CSP, HSTS, X-Content-Type-Options, etc.).
- **CORS**: Restricted to the defined `CLIENT_ORIGIN`.
- **Zod Validation**: Validates all incoming parameters and sanitizes outgoing responses.
- **Graceful Fallbacks**: If the LLM provider times out or is unreachable, the system transparently falls back to the deterministic rule engine without throwing a 500 error.
