const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const summarizeFeedback = async (feedbackText, feedbackSource = 'customer') => {
  try {
    const prompt = `Analyze this ${feedbackSource} feedback for a PNC Bank digital product and provide:
    
    Feedback Text:
    "${feedbackText}"
    
    Please provide:
    1. Key themes and insights (3-5 bullet points)
    2. Sentiment analysis (Positive/Negative/Neutral with percentage breakdown)
    3. Action items for product team (prioritized list)
    4. Potential impact on customer satisfaction
    5. Suggested tags for categorization
    
    Focus on PNC's customer experience goals and financial services context.
    
    Return in JSON format:
    {
      "summary": "brief overview",
      "themes": ["theme1", "theme2"],
      "sentiment": {
        "overall": "positive/negative/neutral",
        "score": number between -1 and 1,
        "breakdown": {
          "positive": percentage,
          "negative": percentage,
          "neutral": percentage
        }
      },
      "actionItems": ["item1", "item2"],
      "tags": ["tag1", "tag2"],
      "impactLevel": "low/medium/high"
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
            content: 'You are a product analyst at PNC Bank specializing in customer feedback analysis and sentiment analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.5,
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

export const categorizeFeedback = async (feedbackItems) => {
  try {
    const feedbackText = feedbackItems.map(item => item.content).join('\n---\n');
    
    const prompt = `Categorize these customer feedback items for a PNC Bank digital product:
    
    ${feedbackText}
    
    Group them into relevant categories such as:
    - User Experience (UX)
    - Security & Trust
    - Performance
    - Features & Functionality
    - Customer Support
    - Mobile App
    - Online Banking
    - Account Management
    
    Return in JSON format with categories and assigned feedback IDs.`;

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
            content: 'You are a customer experience analyst for PNC Bank categorizing feedback for product improvements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    throw error;
  }
};

export const generateInsightsFromFeedback = async (feedbackSummaries) => {
  try {
    const prompt = `Based on these feedback summaries, generate strategic insights for PNC Bank product development:
    
    ${JSON.stringify(feedbackSummaries, null, 2)}
    
    Provide:
    1. Top 3 opportunities for improvement
    2. Customer pain points to address immediately
    3. Feature recommendations based on feedback trends
    4. Risk assessment for ignoring these insights
    
    Focus on PNC's competitive advantage in financial services.`;

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
            content: 'You are a senior product strategist at PNC Bank providing actionable insights from customer feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.6,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};