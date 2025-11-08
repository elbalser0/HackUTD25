// AI service for generating Product Requirements Documents
import { PRODUCT_MANAGER_PROMPTS } from '../utils/prompts';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generatePRD = async (productIdea, targetAudience, businessGoals) => {
  try {
    const prompt = `${PRODUCT_MANAGER_PROMPTS.PRD_GENERATION}
    
    Product Idea: ${productIdea}
    Target Audience: ${targetAudience}
    Business Goals: ${businessGoals}
    
    Please generate a comprehensive PRD with the following sections:
    1. Executive Summary
    2. Problem Statement
    3. Goals and Objectives
    4. User Stories
    5. Functional Requirements
    6. Success Metrics
    7. Timeline and Milestones
    
    Focus on PNC Bank's values of financial innovation, customer trust, and operational excellence.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a senior product manager at PNC Bank with expertise in financial services and digital product development.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating PRD:', error);
    throw error;
  }
};

export const generatePRDSection = async (sectionType, context) => {
  try {
    const prompt = `Generate a ${sectionType} section for a PRD with the following context: ${context}`;
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a senior product manager creating PRD sections for PNC Bank digital products.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating PRD section:', error);
    throw error;
  }
};