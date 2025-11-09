# Product Manager Agent – Implementation Plan

> Repo root: `./`
> App: Expo React Native (SDK 54)

This plan maps the attached “Product Manager Agent Guide” into concrete deliverables. Work is split into phases with checklists, acceptance criteria, and open questions. We’ll check off items as we complete them and update this plan continuously.

## Phase 0 – Baseline & Architecture (Done)
- [x] Taxonomy & categories (`pmCategories.js`): full list with keyword maps and rule-based scoring
- [x] Prompt templates per category (`pmPrompts.js`) with system/user builders and `postProcess` → `{ text, exportable, structured }`
- [x] OpenAI service support (`src/api/openai/service.js`):
	- [x] `classifyWithAI()` JSON contract
	- [x] `generateCategoryResponse(category, userMessage, context)` routing to template
	- [x] `fastMode` config & small-token path
- [x] Classifier utility (`src/utils/classifier.js`): rule-based first, AI fallback
- [x] Chat integration (`src/screens/ChatScreen.js`): classify → route → respond; attach `message.meta.category`
- [x] PDF export utility (`src/utils/pdfExport.js`): expo-print + expo-sharing, HTML builder from `structured` content
- [x] Export UI (`src/components/ChatMessage.js`): export button on AI messages
- [x] Merge conflict resolution and clean build for changed files

Acceptance criteria
- Agent responds using category-specific guidance and concise, professional tone
- Export button produces a shareable PDF for structured outputs without crashes

## Phase 1 – UX Enhancements (Pending)
- [ ] Category pill UI: render `message.meta.category` as a labeled badge on AI messages
- [ ] Category override: tap pill → dropdown/modal to reassign category → regenerate response
- [ ] Recording UX: timer + cancel while capturing audio; visible transcribing state

Acceptance criteria
- Users can see and change the assigned category from the chat thread
- Audio capture provides clear affordances (recording vs transcribing)

## Phase 2 – Persistence & Data Model (Pending)
- [ ] Extend document/message persistence (AsyncStorage) to include:
	- [ ] `category`, `summary`, `pdfUri`
	- [ ] Backfill/migration for existing records (non-breaking)
- [ ] Save exported PDFs and surface them in any document view/history

Acceptance criteria
- Re-opening the app preserves category and export metadata
- Existing saved items remain readable; migration is idempotent

## Phase 3 – Feature Coverage per Guide (Pending)
Implement or refine category-specific behaviors. Each category: clarify input → respond using format standards → enable PDF export.

- Product Strategy & Ideation
	- [ ] Brainstorming: multi-option ideas with Problem → Solution → Impact
	- [ ] Market_sizing: TAM/SAM/SOM scaffold with stated assumptions
	- [ ] Scenario_planning: Best/Expected/Worst tables + recommended actions
	- [ ] Aligning_customer_needs_with_business_goals: mapping needs → goals → opportunities → metrics
- Requirements & Development
	- [ ] User_stories: standard format + acceptance criteria placeholders
	- [ ] Acceptance_criteria: Gherkin-style Given/When/Then
	- [ ] Backlog_grooming: RICE/MoSCoW quick table with priorities
	- [ ] AI_assisted_prioritization: weighted scoring + rationale
- Customer & Market Research
	- [ ] Customer_feedback_analysis: theme clustering + sentiment
	- [ ] Competitor_activity: comparison table + white space
	- [ ] Industry_trends: short/long-term trends → impact → response
	- [ ] Actionable_insights_synthesis: consolidated insights → actions → KPI
- Prototyping & Testing
	- [ ] Wireframe_generation: annotated component lists/layouts
	- [ ] Mockup_creation: brand questions + realistic sample data
	- [ ] Test_case_generation: positive/negative/edge cases by risk
	- [ ] Iteration_with_feedback: Feedback → Issue → Solution → Next Step
	- [ ] Synthetic_user_testing: scenarios → observations → recs + estimated success
- Go-to-Market Execution
	- [ ] Persona_development: concise profiles connected to KPIs
	- [ ] GTM_strategy: Target → Value → Channels → Launch → KPIs
	- [ ] Release_notes: New/Improved/Fixed/Known Issues format
	- [ ] Stakeholder_communication: Objective → Update → Impact → Next → Ask
- Automation & Intelligent Agents
	- [ ] Workflow_automation: If→Then triggers/actions and estimated impact
	- [ ] Reporting_and_metrics_generation: Metric → Change → Cause → Rec
	- [ ] Sprint_planning_assistance: Goal → Tasks → Effort → Outcome (CSV/Jira option)
	- [ ] Cross_team_updates: Audience → Summary → Action Needed
	- [ ] Intelligent_agent_integration: Trigger → Task → Output → Feedback Loop
- [ ] PRD_creation: Map/merge existing PRD tool flow into unified category pipeline

Acceptance criteria
- Every category adheres to its “agent operating guide” style and structure
- Outputs are concise, scannable, and exportable; postProcess marks exportable

## Phase 4 – Observability & Performance (Pending)
- [ ] Structured logs: classification confidence, model, latency, token use
- [ ] Timing metrics per call; simple in-app debug screen toggle
- [ ] FastMode coverage across all new calls; safe token limits

Acceptance criteria
- Logs observable in dev; low overhead in prod profile
- No noticeable regression in response latency

## Phase 5 – Testing & Quality Gates (Pending)
- [ ] Unit tests (Jest):
	- [ ] Classifier keyword scoring and thresholds
	- [ ] Prompt builders and postProcess for 3–5 categories
	- [ ] PDF HTML builder sanity (title/body, basic tables)
- [ ] Lint/type checks pass
- [ ] Manual device tests for speech, category override, and PDF export

Acceptance criteria
- All tests pass; code coverage on core utilities
- PASS: Build, Lint/Typecheck, and targeted manual tests

## Phase 6 – Documentation & Developer Experience (Pending)
- [ ] `docs/pm_agent_usage.md`: feature guide and examples
- [ ] Update `AGENTS.md` appendix: PM Agent maintenance notes
- [ ] “Try it” runbook: Expo tunnel, LAN fallback, and mobile testing tips

Acceptance criteria
- New contributors can run and validate PM Agent end-to-end on device

---

## Open Questions
1) Category override behavior: regenerate response automatically on change?
2) Auto-summary PDF trigger: after N assistant messages in same category, or manual only?
3) File persistence: store PDFs to filesystem and link in chat, or re-generate on demand?
4) Default AI fallback policy: rule-based low confidence threshold at 0.55 OK?
5) MVP subset to ship first (suggested): Brainstorming, PRD_creation, User_stories, Release_notes, GTM_strategy

## Risks & Mitigations
- Network/tunnel flakiness → Provide LAN fallback and retry guidance
- Token overruns in rich outputs → Enforce tight templates, chunking if needed
- PDF rendering variability on Android/iOS → Use simple, table-light HTML and test on both

## Success Criteria
- Classification accurate for ≥80% manual test queries
- Typical AI response latency <3.5s in fastMode
- PDF export completes <2s for medium structured message
- No regressions to existing flows (speech, prior chat features)

## Future Enhancements (Post-Launch)
- Multi-message synthesis pipelines (e.g., brainstorming → market sizing → prioritized roadmap)
- Cloud sync / remote storage for PDFs
- Inline table editing & re-export

## Execution Order (Adjusted)
1. UX Enhancements (Phase 1)
2. Persistence & Migration (Phase 2)
3. Feature Coverage (Phase 3)
4. Observability & Performance (Phase 4)
5. Testing & Quality (Phase 5)
6. Documentation (Phase 6)

---
Please review and confirm or adjust priorities, then I'll begin implementation.
