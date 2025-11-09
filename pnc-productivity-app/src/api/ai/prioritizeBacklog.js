const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const prioritizeBacklog = async (backlogItems) => {
  try {
    const itemsForAnalysis = backlogItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      reach: item.reach || 0,
      impact: item.impact || 0,
      confidence: item.confidence || 0,
      effort: item.effort || 0
    }));

    const prompt = `As a senior product manager at PNC Bank, analyze and prioritize these backlog items using the RICE framework (Reach, Impact, Confidence, Effort). 
    
    Backlog Items:
    ${JSON.stringify(itemsForAnalysis, null, 2)}
    
    For each item, provide:
    1. RICE Score calculation
    2. Priority ranking (1 being highest)
    3. Brief rationale focusing on PNC's business objectives
    4. Recommended improvements to increase RICE score
    
    Consider PNC's focus on customer experience, digital transformation, and financial services innovation.
    
    Return the response in JSON format with the structure:
    {
      "prioritizedItems": [
        {
          "id": "item_id",
          "riceScore": number,
          "priority": number,
          "rationale": "string",
          "recommendations": "string"
        }
      ]
    }`;

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
            content: 'You are a senior product manager at PNC Bank specializing in backlog prioritization and RICE framework analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    throw error;
  }
};

export const calculateRICEScore = (reach, impact, confidence, effort) => {
  if (effort === 0) return 0;
  return (reach * impact * confidence) / effort;
};

export const suggestBacklogImprovements = async (backlogItem) => {
  try {
    const prompt = `Analyze this backlog item and suggest improvements to increase its RICE score:
    
    Title: ${backlogItem.title}
    Description: ${backlogItem.description}
    Current RICE: Reach=${backlogItem.reach}, Impact=${backlogItem.impact}, Confidence=${backlogItem.confidence}, Effort=${backlogItem.effort}
    
    Provide specific suggestions to improve each RICE component while maintaining feasibility for a PNC Bank digital product.`;

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
            content: 'You are a product strategy consultant for PNC Bank providing backlog optimization advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};