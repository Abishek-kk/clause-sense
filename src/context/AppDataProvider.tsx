import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/mockApi/api";
import type { AuditEntry, ClauseItem, DecisionResult, DocumentItem, UploadOptions } from "@/mockApi/types";

interface AppDataContextValue {
  documents: DocumentItem[];
  reloadDocuments: () => Promise<void>;
  listClauses: (doc_id: string) => Promise<ClauseItem[]>;
  uploadFiles: (files: File[], options: UploadOptions) => Promise<void>;
  stats?: { docs: number; queries_today: number; index_size: number; avg_latency_ms: number };
  refreshStats: () => Promise<void>;
  runQuery: (query: string, user: string) => Promise<DecisionResult>;
  audits: AuditEntry[];
  reloadAudits: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [stats, setStats] = useState<AppDataContextValue["stats"]>();

  const reloadDocuments = async () => {
    const data = await api.listDocuments();
    setDocuments(data);
  };
  const reloadAudits = async () => {
    const data = await api.listAudits();
    setAudits(data);
  };
  const refreshStats = async () => {
    const s = await api.documentsIndexStats();
    setStats(s);
  };

  useEffect(() => {
    reloadDocuments();
    reloadAudits();
    refreshStats();
  }, []);

  const value = useMemo<AppDataContextValue>(() => ({
    documents,
    reloadDocuments,
    listClauses: api.listClauses,
    uploadFiles: async (files, options) => {
      for (const f of files) {
        await api.uploadDocument(f);
      }
      await reloadDocuments();
      for (const f of files) {
        const doc = (await api.listDocuments()).find(d => d.filename === f.name);
        if (doc) await api.extract({ doc_id: doc.doc_id, options });
      }
      await reloadDocuments();
      await refreshStats();
    },
    stats,
    refreshStats,
    runQuery: async (q, user) => {
      const res = await api.runQuery({ query_text: q, user_id: user, options: { return_json: true, top_k: 20 } });
      await reloadAudits();
      await refreshStats();
      return res.result_json;
    },
    audits,
    reloadAudits,
  }), [documents, audits, stats]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
