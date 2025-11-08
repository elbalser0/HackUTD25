// AI service for generating launch notes and GTM content
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateLaunchNotes = async (productName, features, targetAudience, launchDate) => {
  try {
    const prompt = `Generate comprehensive launch notes for a PNC Bank digital product:
    
    Product Name: ${productName}
    Key Features: ${features.join(', ')}
    Target Audience: ${targetAudience}
    Launch Date: ${launchDate}
    
    Include:
    1. Executive Summary
    2. What's New section
    3. Customer Benefits
    4. Implementation Timeline
    5. Success Metrics
    6. Risk Mitigation
    7. Communication Strategy
    
    Align with PNC Bank's brand voice and regulatory compliance requirements.`;

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
            content: 'You are a product marketing manager at PNC Bank creating launch documentation for digital banking products.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating launch notes:', error);
    throw error;
  }
};

export const generateGTMChecklist = async (productType, launchScope) => {
  try {
    const prompt = `Create a comprehensive Go-to-Market checklist for a PNC Bank ${productType} with ${launchScope} launch scope.
    
    Include categories for:
    1. Pre-Launch (Legal, Compliance, Security)
    2. Product Readiness (Testing, Documentation, Training)
    3. Marketing & Communications (Campaigns, Announcements, PR)
    4. Sales Enablement (Training, Materials, Tools)
    5. Customer Support (Knowledge Base, Training, Escalation)
    6. Launch Day Activities
    7. Post-Launch Monitoring (Metrics, Feedback, Optimization)
    
    Each item should include owner, timeline, and success criteria.
    Consider PNC's regulatory environment and customer communication standards.
    
    Return in JSON format with structure:
    {
      "categories": [
        {
          "name": "category name",
          "items": [
            {
              "task": "task description",
              "owner": "role/team",
              "timeline": "relative timeline",
              "criteria": "success criteria",
              "priority": "high/medium/low"
            }
          ]
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
            content: 'You are a product launch specialist at PNC Bank with expertise in financial services go-to-market strategy.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating GTM checklist:', error);
    throw error;
  }
};

export const generatePressRelease = async (productName, keyBenefits, customerQuote) => {
  try {
    const prompt = `Write a professional press release for PNC Bank announcing the launch of ${productName}.
    
    Key Benefits: ${keyBenefits}
    Customer Quote: "${customerQuote}"
    
    Include:
    - Compelling headline
    - Strong lead paragraph with key announcement
    - Product benefits and customer value
    - Executive quote from PNC leadership
    - Customer testimonial (provided)
    - Company boilerplate
    - Contact information placeholder
    
    Follow financial services press release best practices and regulatory compliance.`;

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
            content: 'You are a corporate communications specialist at PNC Bank writing press releases for product launches.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating press release:', error);
    throw error;
  }
};