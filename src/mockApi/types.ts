export type DocType = "pdf" | "docx" | "eml";

export interface DocumentItem {
  doc_id: string;
  filename: string;
  type: DocType;
  upload_date: string; // ISO
  source: "email" | "manual";
  pages: number;
  size_kb: number;
  status: "indexed" | "processing" | "error";
}

export interface ClauseItem {
  clause_id: string; // `${doc_id}::clause_x`
  doc_id: string;
  page: number;
  text: string;
  confidence: number;
  tags: string[];
  offsets?: { start: number; end: number };
  bbox?: { x: number; y: number; w: number; h: number }; // 0-1 normalized for preview overlay
}

export interface ParsedQuery {
  age: number | null;
  gender: string | null;
  procedure: string | null;
  location: string | null;
  policy_age_months: number | null;
  raw_text: string;
}

export interface DecisionJustificationEntry {
  clause_id: string;
  document: string;
  page: number;
  quote: string;
  reason: string;
}

export interface ClausesConsideredEntry {
  clause_id: string;
  similarity_score: number;
}

export interface DecisionPipelineInfo {
  parser_prompt_id: string;
  retrieval_k: number;
  retrieved_count: number;
  evaluator_prompt_id: string;
  timestamps: { started_at: string; completed_at: string };
}

export interface DecisionResult {
  query: string;
  parsed_query: ParsedQuery;
  decision: "approved" | "rejected" | "needs_manual_review" | "pending" | string;
  amount: number | null;
  currency: string | null;
  confidence: number;
  justification: DecisionJustificationEntry[];
  clauses_considered: ClausesConsideredEntry[];
  pipeline: DecisionPipelineInfo;
  audit_id: string;
  manual_override: null | { by: string; reason: string; at: string };
}

export interface AuditEntry {
  audit_id: string;
  user: string;
  timestamp: string;
  decision_summary: string;
  result_json: DecisionResult;
  prompts: {
    parser: string;
    retriever: string;
    evaluator: string;
  };
}

export interface UploadOptions { ocr: boolean; clause_split: boolean; manual_review: boolean }
