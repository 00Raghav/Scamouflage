import { z } from 'zod';

export const analyzeRequestSchema = z.object({
  inputType: z.enum(['message', 'job_offer', 'url'], {
    errorMap: () => ({ message: "inputType must be 'message', 'job_offer', or 'url'" })
  }),
  content: z
    .string({ required_error: 'content is required and must be a string' })
    .min(1, 'content must not be empty')
    .max(5000, 'content must not exceed 5000 characters')
});

export const flaggedPhraseSchema = z.object({
  text: z.string(),
  severity: z.enum(['high', 'medium', 'low']),
  reason: z.object({
    en: z.string()
  })
});

export const recommendedActionSchema = z.object({
  en: z.string()
});

export const urlAnalysisSchema = z.object({
  domain: z.string(),
  lookalikeOf: z.string().nullable(),
  isShortener: z.boolean(),
  threatDbStatus: z.enum(['flagged', 'not_flagged', 'unavailable'])
});

export const analyzeResponseSchema = z.object({
  riskScore: z.number().int().min(0).max(100),
  riskCategory: z.enum(['Low', 'Moderate', 'High', 'Very High']),
  summary: z.object({
    en: z.string()
  }),
  flaggedPhrases: z.array(flaggedPhraseSchema),
  recommendedActions: z.array(recommendedActionSchema),
  urlAnalysis: urlAnalysisSchema.nullable(),
  llmUnavailable: z.boolean().optional()
});

export const llmResponseSchema = z.object({
  riskScore: z.coerce.number().min(0).max(100),
  riskCategory: z.string().optional(),
  summary: z.object({
    en: z.string()
  }),
  flaggedPhrases: z.array(
    z.object({
      text: z.string(),
      severity: z.enum(['high', 'medium', 'low']).catch('medium'),
      reason: z.object({
        en: z.string()
      })
    })
  ).default([]),
  recommendedActions: z.array(
    z.object({
      en: z.string()
    })
  ).default([]),
  urlAnalysis: z.object({
    domain: z.string().optional(),
    lookalikeOf: z.string().nullable().optional(),
    isShortener: z.boolean().optional(),
    threatDbStatus: z.enum(['flagged', 'not_flagged', 'unavailable']).optional()
  }).nullable().optional()
});
