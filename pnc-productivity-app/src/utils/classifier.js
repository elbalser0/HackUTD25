import { classifyRuleBased, MIN_RULE_CONFIDENCE } from '../constants/pmCategories';
import OpenAIService from '../api/openai/service';

// Classify a message using rule-based approach, optionally falling back to AI classification
export async function classifyUserMessage(message) {
  const rule = classifyRuleBased(message);
  if (rule.confidence >= MIN_RULE_CONFIDENCE) {
    return { category: rule.category, confidence: rule.confidence, via: 'rule' };
  }
  try {
    const aiResult = await OpenAIService.classifyWithAI(message);
    return { category: aiResult.category, confidence: aiResult.confidence, via: 'ai' };
  } catch (e) {
    console.warn('AI classification fallback failed, using unknown.', e);
    return { category: null, confidence: 0, via: 'error' };
  }
}
