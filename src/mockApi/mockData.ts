import { AuditEntry, ClauseItem, DecisionResult, DocumentItem } from "./types";

export const sampleDocs: DocumentItem[] = [
  {
    doc_id: "DOC123",
    filename: "HealthPolicy_2024_v1.pdf",
    type: "pdf",
    upload_date: new Date().toISOString(),
    source: "manual",
    pages: 24,
    size_kb: 812,
    status: "indexed",
  },
  {
    doc_id: "EML42",
    filename: "CustomerEmail_2025-08-07.eml",
    type: "eml",
    upload_date: new Date().toISOString(),
    source: "email",
    pages: 1,
    size_kb: 28,
    status: "indexed",
  },
];

export const sampleClauses: ClauseItem[] = [
  {
    clause_id: "DOC123::clause_45",
    doc_id: "DOC123",
    page: 14,
    text:
      "Knee surgery is a covered surgical procedure provided the policy has been active for at least 90 days.",
    confidence: 0.95,
    tags: ["waiting period", "coverage", "orthopedic"],
    bbox: { x: 0.1, y: 0.35, w: 0.8, h: 0.12 },
  },
  {
    clause_id: "DOC123::clause_47",
    doc_id: "DOC123",
    page: 15,
    text:
      "Maximum covered hospital payout for minor orthopedic surgery: up to 50,000 INR subject to co-pay 10%.",
    confidence: 0.92,
    tags: ["payout", "copay", "limits"],
    bbox: { x: 0.12, y: 0.48, w: 0.76, h: 0.1 },
  },
  {
    clause_id: "DOC123::clause_12",
    doc_id: "DOC123",
    page: 5,
    text: "Pre-existing conditions are subject to a 24-month waiting period unless specifically waived.",
    confidence: 0.85,
    tags: ["pre-existing", "waiting period"],
    bbox: { x: 0.14, y: 0.62, w: 0.7, h: 0.1 },
  },
  {
    clause_id: "EML42::clause_1",
    doc_id: "EML42",
    page: 1,
    text: "Agent note: Member confirms no prior knee surgeries and policy effective since May.",
    confidence: 0.6,
    tags: ["agent note", "context"],
    bbox: { x: 0.1, y: 0.2, w: 0.8, h: 0.2 },
  },
];

export const sampleDecision: DecisionResult = {
  query: "46M, knee surgery, Pune, 3-month policy",
  parsed_query: {
    age: 46,
    gender: "M",
    procedure: "knee surgery",
    location: "Pune",
    policy_age_months: 3,
    raw_text: "46M, knee surgery, Pune, 3-month policy",
  },
  decision: "approved",
  amount: 45000,
  currency: "INR",
  confidence: 0.87,
  justification: [
    {
      clause_id: "DOC123::clause_45",
      document: "HealthPolicy_2024_v1.pdf",
      page: 14,
      quote:
        "Knee surgery is a covered surgical procedure provided the policy has been active for at least 90 days.",
      reason:
        "Clause states knee surgery covered after 90-day waiting period; policy age is 3 months (≈90 days).",
    },
    {
      clause_id: "DOC123::clause_47",
      document: "HealthPolicy_2024_v1.pdf",
      page: 15,
      quote:
        "Maximum covered hospital payout for minor orthopedic surgery: up to 50,000 INR subject to co-pay 10%.",
      reason:
        "This clause defines payout cap; applying 10% co-pay gives estimated payout 45,000 INR.",
    },
  ],
  clauses_considered: [
    { clause_id: "DOC123::clause_45", similarity_score: 0.92 },
    { clause_id: "DOC123::clause_47", similarity_score: 0.89 },
  ],
  pipeline: {
    parser_prompt_id: "prompt_01",
    retrieval_k: 20,
    retrieved_count: 12,
    evaluator_prompt_id: "prompt_02",
    timestamps: {
      started_at: new Date(Date.now() - 4000).toISOString(),
      completed_at: new Date().toISOString(),
    },
  },
  audit_id: "AUDIT-20250808-0001",
  manual_override: null,
};

export const parserPrompt = `You are an extractor that receives free-form user queries about insurance claims. Return strict JSON with fields: age, gender, procedure, location, policy_age_months (integer), raw_text.\n\nExample: "46M, knee surgery, Pune, 3-month policy"\n-> { "age":46, "gender":"M", "procedure":"knee surgery", "location":"Pune", "policy_age_months":3 }\n\nIf any field is missing, set value to null. Always output valid JSON only.`;

export const retrievalPrompt = `Construct a semantic retrieval query from the parsed JSON. Prioritize retrieving clauses that mention: procedure synonyms (knee, arthroplasty), waiting period, geographic limits, policy effective date, exclusions, payout caps, co-pay percentages. Return a ranked list of top-20 clause ids to the evaluator, including a one-line reason for why each clause might be relevant.`;

export const evaluatorPrompt = `You are a claim rules engine assistant. Input:\n1) Parsed query JSON.\n2) Array of retrieved clauses, each with {clause_id, text, doc_id, page, metadata}.\n\nTask:\n- Apply rules in the clauses to decide: approved | rejected | needs_manual_review.\n- If monetary amount is determinable, calculate amount and provide currency.\n- Produce "justification" list mapping used clauses to the exact phrases (quoted) that determined the decision.\n- Always include clause metadata: doc name, page, clause_id, exact quoted text (≤25 words).\n- ALWAYS produce the final answer as the exact JSON schema provided (no extra fields).\n- If conflicting clauses exist, explain conflict and choose "needs_manual_review" unless a higher-authority clause (explicit “override”) exists.\n- NEVER hallucinate clause text: you must only quote from the clauses supplied.\n- Output VALID JSON only.`;

export const sampleAudit: AuditEntry = {
  audit_id: sampleDecision.audit_id,
  user: "agent.alex",
  timestamp: new Date().toISOString(),
  decision_summary: "Approved — Knee surgery covered; payout 45,000 INR.",
  result_json: sampleDecision,
  prompts: {
    parser: parserPrompt,
    retriever: retrievalPrompt,
    evaluator: evaluatorPrompt,
  },
};
