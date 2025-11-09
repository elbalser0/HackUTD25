// Prompt templates and builders per category

const baseGuidelines = {
  brainstorming: `Ask open-ended questions, encourage divergent thinking, use Problem → Solution → Impact, suggest multiple alternatives, avoid deep execution details.`,
  market_sizing: `Define target market, use TAM/SAM/SOM if applicable, state assumptions, provide rough numerical estimates, summarize in Market Definition → Key Drivers → Estimated Opportunity → Limitations.`,
  scenario_planning: `Define scenarios (best/expected/worst), identify variables & uncertainties, describe implications, suggest mitigations, summarize as Scenario → Assumptions → Impact → Action.`,
  aligning_customer_needs_with_business_goals: `Clarify pain points and strategic priorities, map needs to goals, recommend measurable success metrics, format: Customer Insight → Business Objective → Product Opportunity → Metric.`,

  user_stories: `Use: As a [user], I want [goal] so that [benefit]. Include persona/context/outcome and 2–3 variations if helpful.`,
  acceptance_criteria: `Write binary, testable criteria. Prefer Given/When/Then. Include edge cases and UX expectations.`,
  backlog_grooming: `Assess value, effort, urgency. Suggest RICE/MoSCoW. Identify dependencies, and recommend sprint placement.`,
  AI_assisted_prioritization: `Balance value, complexity, ROI, risk. Explain rationale behind prioritization; allow scenario comparisons. Output: Top Priorities → Rationale → Suggested Sprint Order.`,

  customer_feedback_analysis: `Cluster feedback by themes, highlight common/high impact issues, sentiment analysis, actionable recommendations, format: Theme → Insight → Action.`,
  competitor_activity: `Identify competitors, compare features/pricing/UX, find gaps & differentiators, present concise comparison with strategic notes.`,
  industry_trends: `Identify emerging trends, explain product impact, support with examples/metrics, group by short/long term, format: Trend → Impact → Response.`,
  actionable_insights_synthesis: `Consolidate findings into prioritized recommendations with rationale. Format: Insight → Why It Matters → Action Step → KPI.`,

  wireframe_generation: `Clarify purpose & user, list key components, focus on structure/hierarchy, propose layout(s).`,
  mockup_creation: `Ask for brand guidelines, show key interactions, use realistic data, ensure flow consistency, offer export.`,
  test_case_generation: `Test ID → Scenario → Steps → Expected Result. Cover positive, negative, edge; prioritize by impact/risk.`,
  iteration_with_feedback: `Summarize feedback by theme, highlight usability issues, propose solutions tied to evidence, track iterations.`,
  synthetic_user_testing: `Clarify test goals, simulate realistic behaviors, report friction points and estimates, format: Scenario → Observation → Recommendation.`,

  persona_development: `Define primary/secondary groups with role, goals, frustrations, motivations; one concise table per persona and strategic linkage.`,
  GTM_strategy: `Target Market → Value Proposition → Channels → Launch Plan → KPIs. Include risks & mitigations.`,
  release_notes: `Group by New/Improvements/Bug Fixes/Known Issues; include version & date; concise bullets.`,
  stakeholder_communication: `Objective → Update → Impact → Next Steps → Ask; tailor tone to audience.`,

  workflow_automation: `Identify repetitive tasks, recommend tools & triggers in If→Then, emphasize measurable benefits, offer flow diagrams.`,
  reporting_and_metrics_generation: `Select target metrics & cadence, summarize Metric → Change → Cause → Recommendation with trend commentary.`,
  sprint_planning_assistance: `Analyze backlog & velocity, allocate tasks by capacity & dependencies, use RICE/WSJF, output Sprint Goal → Tasks → Effort → Expected Outcome.`,
  cross_team_updates: `Identify recipients, tailor summaries, format for platform, recommend frequency, structure: Audience → Update Type → Summary → Action Needed.`,
  intelligent_agent_integration: `Define agent roles, tool integrations, Trigger → Agent Task → Output → Feedback Loop, show measurable value.`,

  PRD_creation: `Structure: Overview, Goals, User Stories, Functional, Non-Functional, Milestones, Metrics. Keep concise yet complete; offer export as PDF.`
};

export function buildSystemPrompt(category, fastMode = true) {
  const guide = baseGuidelines[category] || 'Be concise, professional, and helpful.';
  const speed = fastMode ? '\nKeep replies concise (<= 6 sentences) and prefer bullet points.' : '';
  return `You are a Product Manager Assistant. Category: ${category}. Guidelines: ${guide}.${speed}`;
}

export function buildUserPrompt(category, userMessage, context = {}) {
  // Optional context such as prior messages, project details, etc.
  const ctx = context && context.hint ? `\nContext: ${context.hint}` : '';
  return `${userMessage}${ctx}`;
}

export function postProcess(category, text) {
  // Optionally parse/format output per category; return { text, exportable, structured }
  const exportable = true;
  let structured = null;
  // Minimal heuristic: detect markdown tables or lists
  if (/\|.*\|/.test(text)) {
    structured = { type: 'table-markdown', body: text };
  } else if (/\n-\s|\n\*\s/.test(text)) {
    structured = { type: 'bullets', body: text };
  } else {
    structured = { type: 'text', body: text };
  }
  return { text, exportable, structured };
}
