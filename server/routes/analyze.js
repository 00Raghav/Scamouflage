import { Router } from 'express';
import { analyzeRequestSchema, analyzeResponseSchema } from '../schema.js';
import { processAnalysis } from '../combine.js';

export const analyzeRouter = Router();

analyzeRouter.post('/', async (req, res, next) => {
  try {
    // 1. Validate request body with Zod
    const validation = analyzeRequestSchema.safeParse(req.body);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      const errorMessage = firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : 'Invalid request payload';
      return res.status(400).json({ error: errorMessage });
    }

    const { inputType, content } = validation.data;

    // 2. Execute detection & analysis pipeline (content is never logged)
    const result = await processAnalysis({ inputType, content });

    // 3. Validate response shape against strict schema
    const responseValidation = analyzeResponseSchema.safeParse(result);
    if (!responseValidation.success) {
      console.error('Analysis response validation warning:', responseValidation.error.format());
      return res.status(200).json(result);
    }

    return res.status(200).json(responseValidation.data);
  } catch (err) {
    next(err);
  }
});
