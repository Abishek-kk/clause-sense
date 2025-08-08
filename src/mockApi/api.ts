import { sampleDocs, sampleClauses, sampleDecision, sampleAudit, parserPrompt, retrievalPrompt, evaluatorPrompt } from "./mockData";
import type { AuditEntry, ClauseItem, DecisionResult, DocumentItem, UploadOptions } from "./types";

let documents: DocumentItem[] = [...sampleDocs];
let clauses: ClauseItem[] = [...sampleClauses];
let audits: AuditEntry[] = [sampleAudit];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const api = {
  async uploadDocument(file: File): Promise<{ doc_id: string; status: string }> {
    await delay(500);
    const id = file.name.replace(/\W+/g, '').slice(0, 6).toUpperCase() + Math.floor(Math.random()*100);
    const type = (file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : file.name.toLowerCase().endsWith('.docx') ? 'docx' : 'eml') as DocumentItem["type"];
    const item: DocumentItem = {
      doc_id: id,
      filename: file.name,
      type,
      upload_date: new Date().toISOString(),
      source: "manual",
      pages: Math.max(1, Math.ceil(file.size / 50000)),
      size_kb: Math.round(file.size / 1024),
      status: "processing",
    };
    documents.unshift(item);
    return { doc_id: id, status: item.status };
  },
  async extract({ doc_id, options }: { doc_id: string; options: UploadOptions }): Promise<{ doc_id: string; clauses_count: number; extraction_log: string[] }>{
    await delay(800);
    // synthesize a few clauses for the new doc
    const base = documents.find(d => d.doc_id === doc_id);
    if (!base) throw new Error("doc not found");
    const newClauses: ClauseItem[] = Array.from({ length: 3 }).map((_, i) => ({
      clause_id: `${doc_id}::clause_${i+1}`,
      doc_id,
      page: i + 1,
      text: `Sample clause ${i+1} for ${base.filename}. This is auto-extracted${options.ocr ? ' with OCR' : ''}.`,
      confidence: 0.7 + Math.random() * 0.2,
      tags: ["auto", options.clause_split ? "split" : "unsplit"],
      bbox: { x: 0.1, y: 0.2 + i * 0.2, w: 0.75, h: 0.1 },
    }));
    clauses = [...newClauses, ...clauses];
    // mark doc indexed
    documents = documents.map((d) => d.doc_id === doc_id ? { ...d, status: "indexed" } : d);
    return { doc_id, clauses_count: newClauses.length, extraction_log: [
      `File received: ${base.filename}`,
      options.ocr ? 'OCR applied: yes' : 'OCR applied: no',
      options.clause_split ? 'Clause split: auto' : 'Clause split: off',
      'Indexing completed.'
    ] };
  },
  async listDocuments(): Promise<DocumentItem[]> {
    await delay(200);
    return documents;
  },
  async listClauses(doc_id: string): Promise<ClauseItem[]> {
    await delay(200);
    return clauses.filter(c => c.doc_id === doc_id);
  },
  async reindex(doc_id: string): Promise<{ ok: true }>{
    await delay(600);
    return { ok: true };
  },
  async deleteDocs(ids: string[]): Promise<{ deleted: number }>{
    documents = documents.filter(d => !ids.includes(d.doc_id));
    clauses = clauses.filter(c => !ids.includes(c.doc_id));
    return { deleted: ids.length };
  },
  async runQuery(payload: { query_text: string; user_id: string; options?: { return_json?: boolean; top_k?: number } }): Promise<{ audit_id: string; status: string; result_json: DecisionResult }>{
    await delay(300);
    const result: DecisionResult = { ...sampleDecision, query: payload.query_text };
    const audit: AuditEntry = {
      audit_id: result.audit_id,
      user: payload.user_id,
      timestamp: new Date().toISOString(),
      decision_summary: `${result.decision[0].toUpperCase()+result.decision.slice(1)} — ${result.amount ? `Payout ${result.amount} ${result.currency}` : 'No payout'}`,
      result_json: result,
      prompts: { parser: parserPrompt, retriever: retrievalPrompt, evaluator: evaluatorPrompt }
    };
    audits.unshift(audit);
    return { audit_id: result.audit_id, status: "completed", result_json: result };
  },
  async getAudit(audit_id: string): Promise<AuditEntry | undefined> {
    await delay(150);
    return audits.find(a => a.audit_id === audit_id);
  },
  async listAudits(): Promise<AuditEntry[]> { await delay(150); return audits; },
  async documentsIndexStats(): Promise<{ docs: number; queries_today: number; index_size: number; avg_latency_ms: number }>{
    await delay(150);
    return {
      docs: documents.length,
      queries_today: audits.length,
      index_size: clauses.length,
      avg_latency_ms: 1800,
    };
  },
};
