# Scamouflage 🛡️
> *"Unmask what's hiding in plain sight."*

**Scamouflage** is a responsive, modern AI-powered scam detection platform designed to protect users from fraudulent messages, fake job offers, banking phishing schemes, and deceptive links.

---

## ✨ Features

- **Multi-Vector Input Analysis**: Supports suspicious text messages, employment offers, and URLs/web links.
- **Semicircular Risk Gauge**: Dynamic 0–100 threat meter categorized into *Low*, *Moderate*, *High*, and *Very High*.
- **Interactive Highlight Tooltips**: Flags suspicious phrases with severity color-coding (Red = High, Orange = Medium, Yellow = Low), numbered markers, and hover/tap explanation tooltips.
- **Root-Cause Breakdown**: Detailed cards explaining *Why This Looks Suspicious*.
- **Interactive Safety Checklist**: Step-by-step actionable recommendations that users can check off as they protect themselves.
- **Domain & Lookalike Inspection**: Deep link check detecting brand spoofing (e.g. lookalikes of SBI, HDFC, Amazon), URL shorteners, and threat database status.
- **Instant Cybercrime Escalation**: Direct click-to-call helpline **1930** and direct links to **cybercrime.gov.in** with evidence preservation checklists for high-risk threats.
- **Instant English / Hinglish Toggle**: Complete bilingual support across all explanations, summaries, safety tips, and UI elements.
- **Privacy-First**: Zero tracking, zero account requirement, and no `localStorage` persistence.
- **One-Click Shareable Report**: Copies an executive summary of the threat score, flagged indicators, and actions directly to clipboard.

---

## 🚀 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS animations (radar sweeps, scan lines, cyber glassmorphism)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

---

## 🛠️ Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/00Raghav/Scamouflage.git
cd Scamouflage
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 🔌 API Integration Note

The core scam analysis logic is encapsulated in `src/services/analyzer.js` inside `analyzeContent(text, inputType)`. To connect your live backend:

```javascript
export async function analyzeContent(text, inputType = 'message') {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, inputType })
  });
  if (!res.ok) throw new Error('Analysis failed');
  return await res.json();
}
```

---

## 📜 Disclaimer
*Scamouflage is an AI safety assistant, not a legal guarantee. A low threat score does not mean 100% safe. Always verify transactions and official notices through authorized banking, corporate, and government portals.*
