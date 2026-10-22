export const SAMPLES = [
  {
    name: 'Fake Job Offer',
    inputType: 'job_offer',
    content: 'Congratulations! You have been selected for a remote job paying ₹80,000 per month. Pay a ₹1,500 registration fee immediately to secure your position.',
    expectedScoreMin: 50,
    expectedCategory: ['High', 'Very High']
  },
  {
    name: 'Bank Phishing',
    inputType: 'message',
    content: 'Dear Customer, your SBI YONO account will be blocked today due to pending KYC. Click immediately to update PAN: http://sbi-kyc-verification.top/update',
    expectedScoreMin: 50,
    expectedCategory: ['High', 'Very High']
  },
  {
    name: 'Lookalike URL',
    inputType: 'url',
    content: 'http://sbi-secure-login.xyz/portal/verify-aadhaar-pan',
    expectedScoreMin: 50,
    expectedCategory: ['High', 'Very High']
  },
  {
    name: 'Genuine Message',
    inputType: 'message',
    content: 'Hi Madhav, our project sync meeting is scheduled for tomorrow at 3:00 PM on Google Meet: https://meet.google.com/abc-defg-hij. Please review the shared doc beforehand.',
    expectedScoreMax: 24,
    expectedCategory: ['Low']
  },
  {
    name: 'Genuine Bank Alert (Negation check)',
    inputType: 'message',
    content: 'Dear Customer, never share your OTP, UPI PIN, or netbanking password with anyone. SBI will never ask for your confidential details.',
    expectedScoreMax: 24,
    expectedCategory: ['Low']
  }
];
