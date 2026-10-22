// Isolated LLM Service using @anthropic-ai/sdk
// To swap with OpenAI, Gemini, etc., modify only this file.

import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt.js';
import { llmResponseSchema } from '../schema.js';

let anthropicClient = null;

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: apiKey.trim() });
  }
  return anthropicClient;
}

/**
 * Strips markdown code blocks if the LLM wrapped JSON in ```json ... ```
 */
function extractJsonString(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let str = raw.trim();

  // Match ```json ... ``` or ``` ... ```
  const fenceMatch = /```(?:json)?\s*([\s\S]*?)\s*```/i.exec(str);
  if (fenceMatch && fenceMatch[1]) {
    return fenceMatch[1].trim();
  }

  // Remove leading/trailing stray backticks
  str = str.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  return str.trim();
}

/**
 * Calls the LLM with a 20-second timeout and 1 automatic retry on parsing/validation failure.
 */
export async function callLlm({ inputType, content, ruleSignals }) {
  const client = getClient();
  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
  const userPayload = JSON.stringify({ inputType, content, ruleSignals });

  let lastError = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await client.messages.create(
        {
          model,
          max_tokens: 2000,
          temperature: 0.2,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: userPayload
            }
          ]
        },
        {
          timeout: 20000 // 20s timeout
        }
      );

      const rawText = response.content?.[0]?.text;
      if (!rawText) {
        throw new Error('Empty response from LLM');
      }

      const jsonStr = extractJsonString(rawText);
      const parsedJson = JSON.parse(jsonStr);
      const validated = llmResponseSchema.parse(parsedJson);

      return validated;
    } catch (err) {
      lastError = err;
      if (attempt === 1) {
        // Wait 500ms before single retry
        await new Promise(res => setTimeout(res, 500));
      }
    }
  }

  throw new Error(`LLM call failed after retry: ${lastError?.message || 'Unknown error'}`);
}
