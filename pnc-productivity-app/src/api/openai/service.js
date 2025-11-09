const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

class OpenAIService {
  constructor() {
    this.baseURL = 'https://api.openai.com/v1';
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    };
    // Performance tuning
    this.fastModel = process.env.EXPO_PUBLIC_OPENAI_FAST_MODEL || 'gpt-4o-mini';
    this.defaultModel = process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-4';
    this.fastMode = (process.env.EXPO_PUBLIC_FAST_MODE || 'true').toLowerCase() === 'true';
    this.timeoutMs = parseInt(process.env.EXPO_PUBLIC_OPENAI_TIMEOUT_MS || '15000', 10);
  }

  // Lightweight AI classification fallback when rule-based confidence is low
  async classifyWithAI(message) {
    try {
      const started = Date.now();
      const system = 'You categorize product management related queries. Respond ONLY with a JSON object {"category":"<name>","confidence":<0-1>} choosing from predefined categories or null.';
      const user = `Categories: brainstorming, market_sizing, scenario_planning, aligning_customer_needs_with_business_goals, user_stories, acceptance_criteria, backlog_grooming, AI_assisted_prioritization, customer_feedback_analysis, competitor_activity, industry_trends, actionable_insights_synthesis, wireframe_generation, mockup_creation, test_case_generation, iteration_with_feedback, synthetic_user_testing, persona_development, GTM_strategy, release_notes, stakeholder_communication, workflow_automation, reporting_and_metrics_generation, sprint_planning_assistance, cross_team_updates, intelligent_agent_integration, PRD_creation.\nMessage: ${message}`;
      const response = await this.fetchWithTimeout(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: this.fastMode ? this.fastModel : this.defaultModel,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
          ],
          max_tokens: 120,
          temperature: 0.0,
        }),
      }, Math.min(this.timeoutMs, 8000));

      if (!response.ok) throw new Error(`OpenAI classify error: ${response.status}`);
      const data = await response.json();
      const raw = data.choices[0].message.content.trim();
      try {
        const parsed = JSON.parse(raw);
        const latency = Date.now() - started;
        console.log('[metrics] classify latency ms:', latency, 'tokens:', data.usage?.total_tokens || 'n/a');
        return { category: parsed.category || null, confidence: parsed.confidence || 0 };
      } catch (e) {
        console.warn('Failed to parse classification JSON:', raw);
        return { category: null, confidence: 0 };
      }
    } catch (error) {
      console.error('Error in classifyWithAI:', error);
      throw error;
    }
  }

  async generateCategoryResponse(category, userMessage, context = {}) {
    try {
      const started = Date.now();
      const { buildSystemPrompt, buildUserPrompt, postProcess } = await import('../../constants/pmPrompts.js');
      const systemPrompt = buildSystemPrompt(category, this.fastMode);
      const userPrompt = buildUserPrompt(category, userMessage, context);
      const messages = [
        { role: 'system', content: systemPrompt },
        ...(context.conversationHistory || []),
        { role: 'user', content: userPrompt }
      ];
      const response = await this.fetchWithTimeout(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: this.fastMode ? this.fastModel : this.defaultModel,
          messages,
          max_tokens: this.fastMode ? 600 : 1200,
          temperature: this.fastMode ? 0.5 : 0.75,
        }),
      }, this.timeoutMs);
      if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
      const data = await response.json();
      const text = data.choices[0].message.content;
      const latency = Date.now() - started;
      console.log('[metrics] category response', category, 'latency ms:', latency, 'tokens:', data.usage?.total_tokens || 'n/a');
      return postProcess(category, text);
    } catch (error) {
      console.error('Error generating category response:', error);
      throw error;
    }
  }

  async fetchWithTimeout(url, options = {}, timeout = this.timeoutMs) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  }

  async generatePRD(productInfo) {
    try {
      const prompt = `
As a senior product manager at PNC Bank, generate a comprehensive Product Requirements Document (PRD) for the following product:

Product Name: ${productInfo.name}
Target Audience: ${productInfo.audience}
Problem Statement: ${productInfo.problem}
Proposed Solution: ${productInfo.solution}
Key Features: ${productInfo.features}
Success Metrics: ${productInfo.metrics}
Timeline: ${productInfo.timeline}

Please structure the PRD with these sections:
1. Executive Summary
2. Product Overview
3. Target Market & User Personas
4. Problem Definition
5. Solution Description
6. Feature Requirements
7. Technical Requirements
8. Success Metrics & KPIs
9. Timeline & Milestones
10. Risk Assessment
11. Go-to-Market Strategy

Make it professional, detailed, and specific to financial services context. Include compliance and security considerations.
`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a senior product manager at PNC Bank with expertise in financial services product development, compliance, and digital banking solutions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating PRD:', error);
      throw error;
    }
  }

  async generateBacklogInsights(features) {
    try {
      const prompt = `
As a senior product manager at PNC Bank, analyze the following product features and provide RICE (Reach, Impact, Confidence, Effort) scoring recommendations:

Features to analyze:
${features.map(f => `- ${f.name}: ${f.description}`).join('\n')}

For each feature, provide:
1. Reach score (1-10): How many users will this feature affect?
2. Impact score (1-5): How much will this feature impact each user?
3. Confidence score (1-100%): How confident are we in our estimates?
4. Effort score (1-10): How much work is required to implement?
5. RICE Priority Score: (Reach × Impact × Confidence) ÷ Effort
6. Strategic rationale for the scoring
7. Recommendations for prioritization

Consider financial services context, compliance requirements, and customer experience impact.
`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a senior product manager at PNC Bank with expertise in feature prioritization, RICE framework, and financial services product strategy.'
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
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating backlog insights:', error);
      throw error;
    }
  }

  async generateProductIdeas(context) {
    try {
      const prompt = `
As a senior product manager at a financial services company, generate innovative product ideas based on the following context:

Business Context: ${context.business || 'Financial services / banking'}
Target Audience: ${context.audience || 'Banking customers'}
Problem Areas: ${context.problems || 'Customer pain points'}
Goals: ${context.goals || 'Improve customer experience'}
Market Constraints: ${context.constraints || 'Regulatory compliance required'}

Please provide 5-7 product ideas with:
1. Product Name
2. Target Customer Segment  
3. Problem Solved
4. Key Features (3-4)
5. Business Impact Potential
6. Implementation Complexity (Low/Medium/High)
7. Regulatory Considerations

Focus on innovative solutions that could realistically be implemented in a regulated financial environment.
`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a senior product manager with expertise in financial services innovation, regulatory compliance, and customer experience design.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2500,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating product ideas:', error);
      throw error;
    }
  }

  async analyzeFeedback(feedbackData) {
    try {
      const prompt = `
As a product analyst, analyze the following customer feedback and provide insights:

Customer Feedback:
${feedbackData.map(f => `- ${f.text} (Rating: ${f.rating || 'N/A'})`).join('\n')}

Please provide:
1. Sentiment Analysis Summary (% Positive, Neutral, Negative)
2. Top 5 Themes/Categories identified
3. Most Critical Issues (ranked by frequency and impact)
4. Positive Highlights (what customers love)
5. Actionable Product Recommendations
6. Suggested Priority Level for each recommendation

Focus on actionable insights that can drive product improvements.
`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a product analyst specializing in customer feedback analysis and sentiment analysis for financial services products.'
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
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      throw error;
    }
  }

  async generatePersonas(productInfo) {
    try {
      const prompt = `
Create detailed user personas for the following product:

Product: ${productInfo.name || 'New Product'}
Industry: ${productInfo.industry || 'Financial Services'}
Target Market: ${productInfo.market || 'Banking customers'}
Key Features: ${productInfo.features || 'Digital banking features'}

Generate 3-4 distinct user personas with:
1. Persona Name & Demographics
2. Background & Job Role
3. Goals & Motivations
4. Pain Points & Frustrations
5. Technology Comfort Level
6. Banking/Finance Behavior
7. How They Would Use This Product
8. Key Messaging That Resonates

Make personas realistic and specific to financial services context.
`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a UX researcher and product strategist with deep expertise in financial services customer personas and market research.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating personas:', error);
      throw error;
    }
  }

  async generateGTMPlan(productInfo) {
    try {
      const prompt = `
Create a comprehensive Go-To-Market plan for:

Product: ${productInfo.name || 'New Product'}
Target Audience: ${productInfo.audience || 'Banking customers'}  
Launch Timeline: ${productInfo.timeline || '6 months'}
Key Features: ${productInfo.features || 'Product features'}
Success Metrics: ${productInfo.metrics || 'User adoption'}

Provide a detailed GTM strategy including:

1. **Market Positioning**
   - Value proposition
   - Competitive differentiation
   - Key messaging

2. **Launch Strategy**
   - Pre-launch activities
   - Launch phases
   - Post-launch optimization

3. **Marketing Channels**
   - Digital marketing tactics
   - Customer communication plan
   - Partner/stakeholder engagement

4. **Compliance & Risk**
   - Regulatory requirements
   - Risk mitigation strategies
   - Compliance checkpoints

5. **Success Metrics & KPIs**
   - Launch metrics
   - Adoption targets
   - Customer satisfaction goals

6. **Launch Readiness Checklist**
   - Technical requirements
   - Legal/compliance sign-offs
   - Marketing asset creation
   - Training & support readiness

Focus on financial services industry requirements and best practices.
`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a go-to-market strategist with expertise in financial services product launches, regulatory compliance, and customer acquisition.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating GTM plan:', error);
      throw error;
    }
  }

  async generateChatResponse(userMessage, context = {}) {
    try {
      const started = Date.now();
      const { conversationHistory = [], currentTool = null, availableTools = [] } = context;
      
      let systemPrompt = `You are ProdigyPM Assistant, an AI-powered product management assistant for financial services professionals. You are helpful, professional, and knowledgeable about product management, AI tools, and financial services.

Your role is to:
- Help users with product management workflows
- Guide them through tool selection
- Ask clarifying questions when needed
- Provide intelligent, contextual responses
- Be conversational but professional

Available tools you can help with:
- Strategy & Ideation: Generate innovative product ideas
- PRD Generator: Create comprehensive Product Requirements Documents  
- Smart Backlog: RICE framework prioritization with AI insights
- Customer Research: Analyze customer feedback and sentiment
- Go-to-Market Planning: Launch strategy and persona generation

Always be helpful and guide the conversation naturally toward completing their product management tasks.`;

      if (currentTool) {
        systemPrompt += `\n\nCurrently helping user with: ${currentTool}. Ask appropriate follow-up questions to gather the information needed for this tool.`;
      }

      // If fast mode, bias the assistant to be concise
      const speedDirective = this.fastMode ? '\nKeep replies concise (<= 6 sentences) and prefer bullet points.' : '';

      const messages = [
        { role: 'system', content: systemPrompt + speedDirective },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const response = await this.fetchWithTimeout(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: this.fastMode ? this.fastModel : this.defaultModel,
          messages: messages,
          max_tokens: this.fastMode ? 256 : 500,
          temperature: this.fastMode ? 0.4 : 0.7,
        }),
      }, this.timeoutMs);

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const latency = Date.now() - started;
      console.log('[metrics] chat response latency ms:', latency, 'tokens:', data.usage?.total_tokens || 'n/a');
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw error;
    }
  }

  async generateWelcomeMessage(userName) {
    try {
      const prompt = `Generate a warm, professional welcome message for ${userName || 'a user'} who just logged into ProdigyPM Assistant. 

The message should:
- Welcome them personally
- Briefly explain you're an AI assistant for product management
- Ask how you can help them today
- Be concise but friendly (2-3 sentences max)
- Sound natural and conversational`;

      const response = await this.fetchWithTimeout(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: this.fastMode ? this.fastModel : this.defaultModel,
          messages: [
            {
              role: 'system', 
              content: 'You are ProdigyPM Assistant, a helpful AI for product managers. Generate welcoming, professional messages.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.fastMode ? 80 : 150,
          temperature: this.fastMode ? 0.5 : 0.8,
        }),
      }, this.timeoutMs);

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating welcome message:', error);
      return `Hello ${userName || 'there'}! 👋 I'm your ProdigyPM Assistant, here to help streamline your product management workflows with AI-powered tools. How can I assist you today?`;
    }
  }

  // Transcribe an audio file (uri) to text using OpenAI Whisper API
  async transcribeAudio(fileUri, options = {}) {
    try {
      if (!fileUri) throw new Error('No audio file provided');

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: 'audio.m4a',
        type: 'audio/m4a',
      });
      formData.append('model', options.model || 'whisper-1');
      if (options.language) formData.append('language', options.language);

      const response = await fetch(`${this.baseURL}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          // Let fetch set the multipart boundary automatically
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const body = await response.text();
        console.error('Transcription API error:', response.status, body);
        throw new Error(`OpenAI Transcription error: ${response.status}`);
      }

      const data = await response.json();
      // Whisper returns { text: string }
      return data.text || '';
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
}

export default new OpenAIService();