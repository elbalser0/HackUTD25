// Taxonomy & keyword maps for Product Manager Assistant classification
// Each category has: id, group, keywords (lowercase), description

export const CATEGORY_GROUPS = {
  product_strategy: [
    'brainstorming',
    'market_sizing',
    'scenario_planning',
    'aligning_customer_needs_with_business_goals'
  ],
  requirements_development: [
    'user_stories',
    'acceptance_criteria',
    'backlog_grooming',
    'AI_assisted_prioritization'
  ],
  customer_market_research: [
    'customer_feedback_analysis',
    'competitor_activity',
    'industry_trends',
    'actionable_insights_synthesis'
  ],
  prototyping_testing: [
    'wireframe_generation',
    'mockup_creation',
    'test_case_generation',
    'iteration_with_feedback',
    'synthetic_user_testing'
  ],
  go_to_market: [
    'persona_development',
    'GTM_strategy',
    'release_notes',
    'stakeholder_communication'
  ],
  automation_agents: [
    'workflow_automation',
    'reporting_and_metrics_generation',
    'sprint_planning_assistance',
    'cross_team_updates',
    'intelligent_agent_integration'
  ],
  prd_creation: [
    'PRD_creation'
  ]
};

// Flatten categories for iteration
export const ALL_CATEGORIES = Object.values(CATEGORY_GROUPS).flat();

export const CATEGORY_DEFINITIONS = {
  brainstorming: {
    group: 'product_strategy',
    keywords: [
      'brainstorm','ideas','ideation','creative','innovation','new feature','concept','what if','blue sky','solutions'
    ],
    description: 'Generate and refine new product ideas.'
  },
  market_sizing: {
    group: 'product_strategy',
    keywords: [
      'TAM','SAM','SOM','market size','market sizing','revenue potential','penetration','addressable','growth rate','demand'
    ],
    description: 'Estimate market opportunity and size.'
  },
  scenario_planning: {
    group: 'product_strategy',
    keywords: [
      'scenario','what if','contingency','risk cases','best case','worst case','expected case','future outcome','sensitivity'
    ],
    description: 'Analyze possible future outcomes and contingencies.'
  },
  aligning_customer_needs_with_business_goals: {
    group: 'product_strategy',
    keywords: [
      'align','customer need','business goal','kpi mapping','retention','churn','acquisition','nps','lifetime value','ltv','pain point'
    ],
    description: 'Map customer pain points to business objectives.'
  },
  user_stories: {
    group: 'requirements_development',
    keywords: [
      'user story','as a','story points','epic','feature request','acceptance','persona wants','goal so that'
    ],
    description: 'Create user stories describing functionality.'
  },
  acceptance_criteria: {
    group: 'requirements_development',
    keywords: [
      'acceptance criteria','gherkin','given when then','definition of done','test passes','success conditions'
    ],
    description: 'Define conditions for feature completion.'
  },
  backlog_grooming: {
    group: 'requirements_development',
    keywords: [
      'backlog','prioritize','groom','refine tickets','story refinement','epic breakdown','sprint candidates'
    ],
    description: 'Organize and prioritize backlog items.'
  },
  AI_assisted_prioritization: {
    group: 'requirements_development',
    keywords: [
      'prioritize with ai','scoring','rice','weighted','wsjf','ranking','optimize order','priority algorithm'
    ],
    description: 'Use AI to score and order backlog tasks.'
  },
  customer_feedback_analysis: {
    group: 'customer_market_research',
    keywords: [
      'feedback','reviews','survey','sentiment','nps comments','complaint','user said','pain point','theme clustering'
    ],
    description: 'Cluster and synthesize customer feedback.'
  },
  competitor_activity: {
    group: 'customer_market_research',
    keywords: [
      'competitor','benchmark','competitive analysis','feature comparison','pricing comparison','differentiation','white space'
    ],
    description: 'Analyze competitor positioning and gaps.'
  },
  industry_trends: {
    group: 'customer_market_research',
    keywords: [
      'trend','emerging','market shift','forecast','regulation','macro','future direction','adoption','technology shift'
    ],
    description: 'Identify and interpret industry trends.'
  },
  actionable_insights_synthesis: {
    group: 'customer_market_research',
    keywords: [
      'synthesis','actionable insights','combine findings','recommendations','prioritized actions','summary of research'
    ],
    description: 'Consolidate findings into prioritized recommendations.'
  },
  wireframe_generation: {
    group: 'prototyping_testing',
    keywords: [
      'wireframe','layout','structure','low fidelity','screen sketch','interface outline','flow diagram'
    ],
    description: 'Produce low-fidelity interface layouts.'
  },
  mockup_creation: {
    group: 'prototyping_testing',
    keywords: [
      'mockup','high fidelity','visual design','ui polish','prototype look','brand application'
    ],
    description: 'Generate higher-fidelity visual representations.'
  },
  test_case_generation: {
    group: 'prototyping_testing',
    keywords: [
      'test case','edge case','qa scenario','validation steps','expected result','verification'
    ],
    description: 'Create structured test cases for features.'
  },
  iteration_with_feedback: {
    group: 'prototyping_testing',
    keywords: [
      'iterate','refine design','usability feedback','improve prototype','change log','revision suggestions'
    ],
    description: 'Refine concepts based on feedback.'
  },
  synthetic_user_testing: {
    group: 'prototyping_testing',
    keywords: [
      'simulate user','synthetic testing','usability simulation','predict friction','task completion time'
    ],
    description: 'Simulate user interactions & identify friction.'
  },
  persona_development: {
    group: 'go_to_market',
    keywords: [
      'persona','user profile','user archetype','target segment','audience definition','role goals'
    ],
    description: 'Create or refine user personas.'
  },
  GTM_strategy: {
    group: 'go_to_market',
    keywords: [
      'go to market','launch plan','positioning','messaging','channels','GTM','distribution strategy'
    ],
    description: 'Plan product launch & positioning.'
  },
  release_notes: {
    group: 'go_to_market',
    keywords: [
      'release notes','version','changelog','new features','bug fixes','known issues'
    ],
    description: 'Document product release changes.'
  },
  stakeholder_communication: {
    group: 'go_to_market',
    keywords: [
      'stakeholder update','executive summary','roadmap alignment','progress report','milestones','status update'
    ],
    description: 'Prepare clear updates for stakeholders.'
  },
  workflow_automation: {
    group: 'automation_agents',
    keywords: [
      'automate','workflow','trigger','if then','integration','scripting','reduce manual','template'
    ],
    description: 'Design automation flows to reduce manual PM tasks.'
  },
  reporting_and_metrics_generation: {
    group: 'automation_agents',
    keywords: [
      'reporting','metrics','dashboard','kpi tracking','weekly summary','performance report'
    ],
    description: 'Automate status updates & KPI summaries.'
  },
  sprint_planning_assistance: {
    group: 'automation_agents',
    keywords: [
      'sprint planning','capacity','velocity','story points','sprint scope','iteration goals'
    ],
    description: 'Assist with automated sprint creation & scope.'
  },
  cross_team_updates: {
    group: 'automation_agents',
    keywords: [
      'cross team','department update','share status','broadcast','alignment','summary distribution'
    ],
    description: 'Distribute tailored updates to multiple teams.'
  },
  intelligent_agent_integration: {
    group: 'automation_agents',
    keywords: [
      'agent integration','copilot','ai bot','delegation','automated assistant','meeting summary bot','risk tracker'
    ],
    description: 'Integrate AI agents into PM workflows.'
  },
  PRD_creation: {
    group: 'prd_creation',
    keywords: [
      'prd','product requirements document','requirements spec','write prd','draft prd'
    ],
    description: 'Draft or refine a Product Requirements Document.'
  }
};

// Simple keyword-based scoring
export function scoreCategory(message) {
  const text = message.toLowerCase();
  let best = { category: null, score: 0 };
  for (const [cat, def] of Object.entries(CATEGORY_DEFINITIONS)) {
    let score = 0;
    def.keywords.forEach(kw => {
      if (text.includes(kw.toLowerCase())) score += 1;
    });
    if (score > best.score) best = { category: cat, score };
  }
  return best;
}

export const MIN_RULE_CONFIDENCE = 0.3;

export function computeConfidence(rawScore) {
  // Heuristic: confidence saturates at score>=5
  if (rawScore <= 0) return 0;
  if (rawScore >= 5) return 0.95;
  return (rawScore / 5) * 0.8 + 0.15; // maps 1..5 roughly to 0.31..0.95
}

export function classifyRuleBased(message) {
  const { category, score } = scoreCategory(message);
  const confidence = computeConfidence(score);
  return { category, confidence, score };
}
